'use client';

import { useState, useEffect, useCallback } from 'react';
import { mapsLoader, Location } from '@/lib/maps';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    location: Location;
    placeId: string;
  }) => void;
  placeholder?: string;
  className?: string;
  icon?: 'pickup' | 'destination';
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = 'Digite um endereço',
  className = '',
  icon = 'pickup'
}: PlacesAutocompleteProps) {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  // Inicializar serviços do Google Places
  useEffect(() => {
    const initServices = async () => {
      try {
        const google = await mapsLoader.load();
        setAutocompleteService(new google.maps.places.AutocompleteService());
        
        // PlacesService precisa de um elemento div
        const div = document.createElement('div');
        setPlacesService(new google.maps.places.PlacesService(div));
      } catch (error) {
        console.error('Erro ao inicializar Places API:', error);
      }
    };

    initServices();
  }, []);

  // Buscar predições
  const searchPlaces = useCallback(async (searchInput: string) => {
    if (!autocompleteService || !searchInput.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);

    try {
      const result = await autocompleteService.getPlacePredictions({
        input: searchInput,
        componentRestrictions: { country: 'br' }, // Restringir ao Brasil
        types: ['address', 'establishment']
      });

      setPredictions(result?.predictions || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Erro ao buscar lugares:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, [autocompleteService]);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.length >= 3) {
        searchPlaces(input);
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, searchPlaces]);

  // Selecionar lugar
  const handleSelectPlace = async (placeId: string, description: string) => {
    if (!placesService) return;

    setInput(description);
    setShowDropdown(false);
    setPredictions([]);

    try {
      placesService.getDetails(
        { placeId },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            onPlaceSelect({
              address: description,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              placeId
            });
          }
        }
      );
    } catch (error) {
      console.error('Erro ao obter detalhes do lugar:', error);
    }
  };

  const iconColor = icon === 'pickup' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
        {!loading && input && (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Dropdown de sugestões */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
