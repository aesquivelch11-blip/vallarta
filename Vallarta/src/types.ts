export type ScreenType =
  | 'login'
  | 'nav_menu'
  | 'reporting'
  | 'deep_dive'
  | 'camera_expanded'
  | 'calendar';

export interface EstateMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'stable' | 'down';
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
