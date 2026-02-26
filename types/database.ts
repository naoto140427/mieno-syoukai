export interface Consumable {
  id: number;
  name: string;
  level: number; // percentage (0-100)
  max_capacity: number;
  unit: string;
  color: string;
  // New fields
  type?: string;
  quantity?: number;
  threshold?: number;
  updated_at?: string;
}

export interface Tool {
  id: number;
  name: string;
  spec: string;
  qty: number;
  status: "Available" | "In Use" | "Maintenance" | "Missing";
  location: string;
  // New fields
  assigned_to?: string | null;
  updated_at?: string;
}

export interface Archive {
  id: number;
  title: string;
  date: string;
  distance: string;
  members: number;
  weather: "Clear" | "Rainy" | "Cloudy" | "Snow";
  details: string;
  geojson?: string | null;
  // Tactical Data (GPX)
  distance_km?: number;
  max_speed?: number;
  max_elevation?: number;
  route_data?: any; // JSON or array of coordinates
  location_name?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface News {
  id: number;
  date: string;
  category: 'PRESS' | 'UPDATE' | 'REPORT' | 'OTHER';
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
}

export interface UnitDocument {
  id: number;
  title: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

export interface MaintenanceLog {
  id: number;
  date: string;
  title: string;
  type: 'maintenance' | 'inspection' | 'upgrade' | 'incident';
  details: string;
  cost?: number;
}

export interface Unit {
  id: number;
  slug: string;
  unit_name: string;
  owner_id: string;
  odometer: number;
  next_oil_change: string;
  maintenance_note: string;
  created_at?: string;
  description?: string;
  specs?: any;
  docs?: UnitDocument[];
  logs?: MaintenanceLog[];
}
