export interface Consumable {
  id: number;
  name: string;
  level: number; // percentage (0-100)
  max_capacity: number;
  unit: string;
  color: string;
}

export interface Tool {
  id: number;
  name: string;
  spec: string;
  qty: number;
  status: "Available" | "In Use" | "Maintenance" | "Missing";
  location: string;
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

export interface Unit {
  id: number;
  slug: string;
  unit_name: string;
  owner_id: string;
  odometer: number;
  next_oil_change: string;
  maintenance_note: string;
  created_at?: string;
  // New fields
  specs?: any; // JSONB can be anything, default is {}
  description?: string;
  image_url?: string; // Restored
}

export interface UnitDocument {
  id: number;
  unit_id: number;
  title: string;
  file_url: string; // Changed from url
  document_type: string; // Changed from file_type
  // file_size: string; // Removed as per schema
  created_at: string;
}

export interface MaintenanceLog {
  id: number;
  unit_id: number;
  date: string;
  title: string;
  log_type: string; // Changed from type
  details: string;
  cost?: number; // Added
  created_at: string;
}
