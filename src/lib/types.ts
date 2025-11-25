// Types para o clone do Uber Brasil 2025

export type UserRole = 'passenger' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  totalTrips?: number;
}

export interface Driver extends User {
  role: 'driver';
  vehicleInfo: VehicleInfo;
  documents: DriverDocuments;
  isOnline: boolean;
  currentLocation?: Location;
  earnings: {
    today: number;
    week: number;
    month: number;
  };
}

export interface VehicleInfo {
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  category: RideCategory;
  photo?: string;
}

export interface DriverDocuments {
  cnh: string;
  crlv: string;
  selfie: string;
  backgroundCheck: boolean;
  approved: boolean;
}

export type RideCategory = 
  | 'uberx' 
  | 'comfort' 
  | 'black' 
  | 'xl' 
  | 'flash' 
  | 'moto' 
  | 'taxi' 
  | 'electric' 
  | 'reserve' 
  | 'shuttle';

export interface RideCategoryInfo {
  id: RideCategory;
  name: string;
  description: string;
  icon: string;
  priceMultiplier: number;
  capacity: number;
  features: string[];
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  category: RideCategory;
  pickup: Location;
  destination: Location;
  status: TripStatus;
  price: number;
  distance: number;
  duration: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  rating?: number;
  scheduledFor?: Date;
}

export type TripStatus = 
  | 'requesting' 
  | 'accepted' 
  | 'arriving' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 
  | 'pix' 
  | 'credit_card' 
  | 'debit_card' 
  | 'cash' 
  | 'wallet' 
  | 'uber_one';

export interface PaymentInfo {
  method: PaymentMethod;
  cardLast4?: string;
  pixKey?: string;
  walletBalance?: number;
}

export interface SafetyFeatures {
  shareTrip: boolean;
  trustedContacts: string[];
  emergencyButton: boolean;
  audioRecording: boolean;
  preferFemaleDriver: boolean;
  routeDeviation: boolean;
}
