'use client';

import { useEffect, useRef, useState } from 'react';
import { mapsLoader, Location } from '@/lib/maps';
import { Loader2 } from 'lucide-react';

interface MapComponentProps {
  center?: Location;
  zoom?: number;
  markers?: Array<{
    position: Location;
    title?: string;
    icon?: string;
  }>;
  route?: {
    origin: Location;
    destination: Location;
  };
  onMapClick?: (location: Location) => void;
  className?: string;
}

export default function MapComponent({
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo padrão
  zoom = 13,
  markers = [],
  route,
  onMapClick,
  className = 'w-full h-full'
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const google = await mapsLoader.load();
        
        const map = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        mapInstanceRef.current = map;

        // Adicionar listener de clique
        if (onMapClick) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              onMapClick({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              });
            }
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar mapa:', err);
        setError('Erro ao carregar o mapa. Verifique sua chave de API.');
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Atualizar centro do mapa
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  // Atualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Adicionar novos marcadores
    markers.forEach(({ position, title, icon }) => {
      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current!,
        title,
        icon: icon ? {
          url: icon,
          scaledSize: new google.maps.Size(40, 40)
        } : undefined
      });

      markersRef.current.push(marker);
    });
  }, [markers]);

  // Desenhar rota
  useEffect(() => {
    if (!mapInstanceRef.current || !route) return;

    const drawRoute = async () => {
      try {
        const google = await mapsLoader.load();
        
        // Limpar rota anterior
        if (directionsRendererRef.current) {
          directionsRendererRef.current.setMap(null);
        }

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: mapInstanceRef.current!,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#8B5CF6',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });

        directionsRendererRef.current = directionsRenderer;

        const result = await directionsService.route({
          origin: route.origin,
          destination: route.destination,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          }
        });

        directionsRenderer.setDirections(result);
      } catch (err) {
        console.error('Erro ao desenhar rota:', err);
      }
    };

    drawRoute();
  }, [route]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50`}>
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold mb-2">Erro ao carregar mapa</p>
          <p className="text-sm text-red-500">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
