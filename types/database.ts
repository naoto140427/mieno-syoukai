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
  members: string[] | null;
  weather: "Clear" | "Rainy" | "Cloudy" | "Snow" | string | null;
  details: string;
  geojson?: string | null;
  // Tactical Data (GPX)
  distance_km?: number | null;
  max_speed?: number | null;
  max_elevation?: number | null;
  duration_time?: string | null;
  avg_speed?: number | null;
  elevation_gain?: number | null;
  route_data?: [number, number, number][] | [number, number][] | null;
  location_name?: string | null;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
}

export interface News {
  is_pinned?: boolean;
  id: number;
  date: string;
  category: 'PRESS' | 'UPDATE' | 'REPORT' | 'OTHER' | 'TOURING';
  title: string;
  content: string;
  image_url?: string;
  event_date?: string;
  location?: string;
  requirements?: string;
  created_at?: string;
}

export interface TouringSurvey {
  id: number;
  news_id: number;
  agent_name: string;
  attendance_status: 'JOIN' | 'PENDING' | 'DECLINE';
  vehicle_info?: string;
  message?: string;
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

export interface Agent {
  id: string; // uuid from auth.users
  email: string;
  name: string;
  role: string;
  created_at?: string;
}

export interface InventoryItem {
  id: number;
  tool_id: number;
  status: "Available" | "In Use" | "Maintenance" | "Missing";
  // redundant with tool but requested
}

export interface InventoryRequest {
  id: number;
  tool_id: number;
  agent_id: string;
  start_date: string;
  end_date: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";
  created_at?: string;
  tool?: Tool; // Optional for joins
}
