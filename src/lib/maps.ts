import { Loader } from '@googlemaps/js-api-loader';

// Configuração do Google Maps
export const mapsLoader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'directions']
});

// Tipos
export interface Location {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  durationInTraffic?: string;
  polyline: string;
}

// Calcular rota entre dois pontos
export async function calculateRoute(
  origin: Location,
  destination: Location
): Promise<RouteInfo | null> {
  try {
    const google = await mapsLoader.load();
    const directionsService = new google.maps.DirectionsService();

    const result = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: google.maps.TrafficModel.BEST_GUESS
      }
    });

    if (result.routes[0]) {
      const route = result.routes[0].legs[0];
      return {
        distance: route.distance?.text || '',
        duration: route.duration?.text || '',
        durationInTraffic: route.duration_in_traffic?.text,
        polyline: result.routes[0].overview_polyline || ''
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
}

// Buscar endereço por coordenadas (geocoding reverso)
export async function getAddressFromCoords(location: Location): Promise<string> {
  try {
    const google = await mapsLoader.load();
    const geocoder = new google.maps.Geocoder();

    const result = await geocoder.geocode({ location });
    
    if (result.results[0]) {
      return result.results[0].formatted_address;
    }

    return 'Endereço não encontrado';
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return 'Erro ao buscar endereço';
  }
}

// Obter localização atual do usuário
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// Calcular distância entre dois pontos
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
