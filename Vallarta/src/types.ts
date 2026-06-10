export type ScreenType =
  | 'login'
  | 'nav_menu'
  | 'reporting'
  | 'deep_dive'
  | 'camera_expanded'
  | 'calendar'
  | 'property_selector'
  | 'dashboard'

export interface EstateMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'stable' | 'down';
}

export type OccupancyStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Property {
  id: string;
  name: string;
  location: string;
  tagline: string;
  imageUrl: string;
  imageWebp?: string;
  images?: string[];
  occupancyStatus: OccupancyStatus;
  pricePerNight: number;
  propertyType: string;
  metrics?: {
    bedrooms: number;
    occupancy: string;
    revenue: string;
  };
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  live: boolean;
}

export interface ArrivalEvent {
  id: string;
  name: string;
  dates: string;
  nights: number;
}
