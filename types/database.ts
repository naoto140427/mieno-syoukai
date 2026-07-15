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
  id: number;
  category: 'PRESS' | 'UPDATE' | 'REPORT' | 'OTHER' | 'TOURING';
  title: string;
  content: string;
  status?: 'DRAFT' | 'PUBLISHED';
  image_url?: string;
  event_date?: string;
  location?: string;
  requirements?: string;
  date: string;
  is_pinned: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  target_table?: string;
  target_id?: string;
  user_id?: string;
  details?: any;
  created_at: string;
}

export interface TouringSurvey {
  id: number | string;
  news_id: number | string;
  agent_name: string;
  attendance_status: 'JOIN' | 'PENDING' | 'DECLINE';
  vehicle_info?: string;
  message?: string;
  created_at?: string;
}

export interface UnitDocument {
  id: number;
  unit_id?: number;
  title: string;
  document_type: string;  // 'MANUAL' | 'PARTS_LIST' | 'CERTIFICATE' | 'INSPECTION' | 'OTHER'
  file_url: string;
  file_name: string;
  file_size: number;      // bytes
  mime_type?: string;
  storage_path?: string;  // for deletion
  uploaded_by?: string;   // uuid
  created_at: string;
  // Legacy compatibility fields (derived from above)
  type?: string;          // alias for document_type
  size?: string;          // formatted string e.g. "1.2 MB"
  date?: string;          // alias for created_at
  url?: string;           // alias for file_url
}

export interface MaintenanceLog {
  id: number;
  date: string;
  title: string;
  type: 'maintenance' | 'inspection' | 'upgrade' | 'incident';
  details: string;
  cost?: number;
}

export interface SpecItem {
  label: string;
  value: string;
  progress?: number;
  icon?: string | null;
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
  specs?: SpecItem[];
  docs?: UnitDocument[];
  logs?: MaintenanceLog[];
  image_url?: string;
}

export interface Agent {
  id: string; // uuid from auth.users
  email: string;
  codename: string; // DB column: codename (not name)
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
  agent?: Agent;
}
