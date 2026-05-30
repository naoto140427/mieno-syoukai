export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          codename: string
          created_at: string | null
          email: string
          id: string
          role: string | null
        }
        Insert: {
          codename: string
          created_at?: string | null
          email: string
          id: string
          role?: string | null
        }
        Update: {
          codename?: string
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      archives: {
        Row: {
          avg_speed: number | null
          created_at: string | null
          date: string
          details: string | null
          distance: string | null
          distance_km: number | null
          duration_time: string | null
          elevation_gain: number | null
          geojson: string | null
          id: number
          location_name: string | null
          max_elevation: number | null
          max_speed: number | null
          members: string[] | null
          route_data: Json | null
          title: string
          weather: string | null
        }
        Insert: {
          avg_speed?: number | null
          created_at?: string | null
          date: string
          details?: string | null
          distance?: string | null
          distance_km?: number | null
          duration_time?: string | null
          elevation_gain?: number | null
          geojson?: string | null
          id?: number
          location_name?: string | null
          max_elevation?: number | null
          max_speed?: number | null
          members?: string[] | null
          route_data?: Json | null
          title: string
          weather?: string | null
        }
        Update: {
          avg_speed?: number | null
          created_at?: string | null
          date?: string
          details?: string | null
          distance?: string | null
          distance_km?: number | null
          duration_time?: string | null
          elevation_gain?: number | null
          geojson?: string | null
          id?: number
          location_name?: string | null
          max_elevation?: number | null
          max_speed?: number | null
          members?: string[] | null
          route_data?: Json | null
          title?: string
          weather?: string | null
        }
        Relationships: []
      }
      autonomous_tasks: {
        Row: {
          created_at: string
          id: number
          result_artifact: string | null
          status: string
          subagent_id: string | null
          task_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          result_artifact?: string | null
          status?: string
          subagent_id?: string | null
          task_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          result_artifact?: string | null
          status?: string
          subagent_id?: string | null
          task_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      consumables: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          level: number
          max_capacity: number
          name: string
          unit: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          level?: number
          max_capacity: number
          name: string
          unit: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          level?: number
          max_capacity?: number
          name?: string
          unit?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      inventory_requests: {
        Row: {
          agent_id: string | null
          created_at: string | null
          end_date: string
          id: string
          item_id: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          item_id?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          item_id?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          cost: number | null
          created_at: string | null
          date: string
          details: string | null
          id: number
          log_type: string
          title: string
          unit_id: number | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          date: string
          details?: string | null
          id?: number
          log_type: string
          title: string
          unit_id?: number | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          date?: string
          details?: string | null
          id?: number
          log_type?: string
          title?: string
          unit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          date: string
          event_date: string | null
          id: number
          image_url: string | null
          is_pinned: boolean | null
          location: string | null
          requirements: string | null
          title: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          date: string
          event_date?: string | null
          id?: number
          image_url?: string | null
          is_pinned?: boolean | null
          location?: string | null
          requirements?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          date?: string
          event_date?: string | null
          id?: number
          image_url?: string | null
          is_pinned?: boolean | null
          location?: string | null
          requirements?: string | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          ai_strictness: number | null
          emergency_banner_active: boolean | null
          id: string
        }
        Insert: {
          ai_strictness?: number | null
          emergency_banner_active?: boolean | null
          id?: string
        }
        Update: {
          ai_strictness?: number | null
          emergency_banner_active?: boolean | null
          id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          created_at: string | null
          id: number
          location: string | null
          name: string
          qty: number | null
          spec: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          location?: string | null
          name: string
          qty?: number | null
          spec?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          location?: string | null
          name?: string
          qty?: number | null
          spec?: string | null
          status?: string | null
        }
        Relationships: []
      }
      touring_surveys: {
        Row: {
          agent_name: string
          attendance_status: string
          created_at: string | null
          id: string
          message: string | null
          news_id: string
          vehicle_info: string | null
        }
        Insert: {
          agent_name: string
          attendance_status: string
          created_at?: string | null
          id?: string
          message?: string | null
          news_id: string
          vehicle_info?: string | null
        }
        Update: {
          agent_name?: string
          attendance_status?: string
          created_at?: string | null
          id?: string
          message?: string | null
          news_id?: string
          vehicle_info?: string | null
        }
        Relationships: []
      }
      unit_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_url: string
          id: number
          title: string
          unit_id: number | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_url: string
          id?: number
          title: string
          unit_id?: number | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_url?: string
          id?: number
          title?: string
          unit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_documents_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          maintenance_note: string | null
          next_oil_change: string | null
          odometer: number
          owner_id: string
          slug: string
          specs: Json | null
          unit_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          maintenance_note?: string | null
          next_oil_change?: string | null
          odometer?: number
          owner_id: string
          slug: string
          specs?: Json | null
          unit_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          maintenance_note?: string | null
          next_oil_change?: string | null
          odometer?: number
          owner_id?: string
          slug?: string
          specs?: Json | null
          unit_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
