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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          lock_password: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lock_password?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lock_password?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_earned_trophies: {
        Row: {
          affiliate_id: string
          claimed: boolean | null
          claimed_at: string | null
          earned_at: string
          id: string
          trophy_id: string
        }
        Insert: {
          affiliate_id: string
          claimed?: boolean | null
          claimed_at?: string | null
          earned_at?: string
          id?: string
          trophy_id: string
        }
        Update: {
          affiliate_id?: string
          claimed?: boolean | null
          claimed_at?: string | null
          earned_at?: string
          id?: string
          trophy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earned_trophies_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earned_trophies_trophy_id_fkey"
            columns: ["trophy_id"]
            isOneToOne: false
            referencedRelation: "affiliate_trophies"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_product_views: {
        Row: {
          affiliate_id: string
          created_at: string
          id: string
          product_id: string | null
          visitor_id: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string
          id?: string
          product_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string
          id?: string
          product_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_product_views_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_trophies: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          required_sales: number
          reward_description: string | null
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          required_sales: number
          reward_description?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          required_sales?: number
          reward_description?: string | null
        }
        Relationships: []
      }
      affiliate_visits: {
        Row: {
          affiliate_id: string
          browser: string | null
          city: string | null
          converted: boolean | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          order_id: string | null
          os: string | null
          page_url: string | null
          referrer: string | null
          visitor_id: string | null
        }
        Insert: {
          affiliate_id: string
          browser?: string | null
          city?: string | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          order_id?: string | null
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          visitor_id?: string | null
        }
        Update: {
          affiliate_id?: string
          browser?: string | null
          city?: string | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          order_id?: string | null
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_visits_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string | null
          commission_rate: number | null
          created_at: string
          email: string
          full_name: string
          id: string
          pending_earnings: number | null
          phone: string | null
          status: string
          total_earnings: number | null
          total_sales: number | null
          total_visits: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          commission_rate?: number | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          pending_earnings?: number | null
          phone?: string | null
          status?: string
          total_earnings?: number | null
          total_sales?: number | null
          total_visits?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          commission_rate?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          pending_earnings?: number | null
          phone?: string | null
          status?: string
          total_earnings?: number | null
          total_sales?: number | null
          total_visits?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          affiliate_code: string | null
          age_range: string | null
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          event_type: string
          gender: string | null
          id: string
          ip_address: string | null
          os: string | null
          page_url: string | null
          product_id: string | null
          referrer: string | null
          session_id: string | null
          traffic_source: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          affiliate_code?: string | null
          age_range?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type: string
          gender?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          traffic_source?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          affiliate_code?: string | null
          age_range?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          gender?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          traffic_source?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_colors: {
        Row: {
          color_hex: string
          color_name: string
          created_at: string
          id: string
          images: string[] | null
          product_id: string
        }
        Insert: {
          color_hex: string
          color_name: string
          created_at?: string
          id?: string
          images?: string[] | null
          product_id: string
        }
        Update: {
          color_hex?: string
          color_name?: string
          created_at?: string
          id?: string
          images?: string[] | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_colors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          colors: string[] | null
          created_at: string
          description: string | null
          details: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          price: number
          sizes: string[] | null
          slug: string
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          price: number
          sizes?: string[] | null
          slug: string
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          price?: number
          sizes?: string[] | null
          slug?: string
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          cart_timeout_minutes: number | null
          created_at: string
          drop_duration_hours: number | null
          drop_end_time: string | null
          free_shipping_threshold: number | null
          id: string
          lock_message: string | null
          site_status: Database["public"]["Enums"]["site_status"]
          updated_at: string
        }
        Insert: {
          cart_timeout_minutes?: number | null
          created_at?: string
          drop_duration_hours?: number | null
          drop_end_time?: string | null
          free_shipping_threshold?: number | null
          id?: string
          lock_message?: string | null
          site_status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
        }
        Update: {
          cart_timeout_minutes?: number | null
          created_at?: string
          drop_duration_hours?: number | null
          drop_end_time?: string | null
          free_shipping_threshold?: number | null
          id?: string
          lock_message?: string | null
          site_status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          country: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          subscribed_at: string
        }
        Insert: {
          country?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          subscribed_at?: string
        }
        Update: {
          country?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          processed_at: string | null
          rejection_reason: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_affiliate_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      site_status: "open" | "locked" | "maintenance"
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
    Enums: {
      app_role: ["admin", "user"],
      site_status: ["open", "locked", "maintenance"],
    },
  },
} as const
