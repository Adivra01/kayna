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
      affiliate_sales: {
        Row: {
          affiliate_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          order_total: number | null
          product_id: string | null
          product_name: string
          product_price: number
          visitor_id: string | null
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          commission_rate?: number
          created_at?: string
          id?: string
          order_total?: number | null
          product_id?: string | null
          product_name: string
          product_price: number
          visitor_id?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          order_total?: number | null
          product_id?: string | null
          product_name?: string
          product_price?: number
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_sales_product_id_fkey"
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
      discount_coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          product_ids: string[] | null
          scope: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          product_ids?: string[] | null
          scope?: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          product_ids?: string[] | null
          scope?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          order_id: string
          printful_sync_product_id: string | null
          printful_variant_id: string | null
          product_id: string | null
          product_image: string | null
          product_title: string
          quantity: number
          size: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          order_id: string
          printful_sync_product_id?: string | null
          printful_variant_id?: string | null
          product_id?: string | null
          product_image?: string | null
          product_title: string
          quantity?: number
          size?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string
          printful_sync_product_id?: string | null
          printful_variant_id?: string | null
          product_id?: string | null
          product_image?: string | null
          product_title?: string
          quantity?: number
          size?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          message: string | null
          order_id: string
          printful_status: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          order_id: string
          printful_status?: string | null
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          order_id?: string
          printful_status?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          affiliate_code: string | null
          affiliate_id: string | null
          created_at: string
          customer_name: string
          delivered_at: string | null
          discount_amount: number
          discount_code: string | null
          email: string
          id: string
          order_number: string
          paid_at: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          phone: string | null
          printful_estimated_delivery: string | null
          printful_order_id: string | null
          printful_shipping_carrier: string | null
          printful_status: string | null
          printful_tracking_number: string | null
          printful_tracking_url: string | null
          shipped_at: string | null
          shipping_address_1: string
          shipping_address_2: string | null
          shipping_city: string
          shipping_cost: number
          shipping_country: string
          shipping_state: string | null
          shipping_zip: string
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          created_at?: string
          customer_name: string
          delivered_at?: string | null
          discount_amount?: number
          discount_code?: string | null
          email: string
          id?: string
          order_number: string
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          printful_estimated_delivery?: string | null
          printful_order_id?: string | null
          printful_shipping_carrier?: string | null
          printful_status?: string | null
          printful_tracking_number?: string | null
          printful_tracking_url?: string | null
          shipped_at?: string | null
          shipping_address_1: string
          shipping_address_2?: string | null
          shipping_city: string
          shipping_cost?: number
          shipping_country: string
          shipping_state?: string | null
          shipping_zip: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          created_at?: string
          customer_name?: string
          delivered_at?: string | null
          discount_amount?: number
          discount_code?: string | null
          email?: string
          id?: string
          order_number?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          printful_estimated_delivery?: string | null
          printful_order_id?: string | null
          printful_shipping_carrier?: string | null
          printful_status?: string | null
          printful_tracking_number?: string | null
          printful_tracking_url?: string | null
          shipped_at?: string | null
          shipping_address_1?: string
          shipping_address_2?: string | null
          shipping_city?: string
          shipping_cost?: number
          shipping_country?: string
          shipping_state?: string | null
          shipping_zip?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      printful_webhook_logs: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Relationships: []
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
          out_of_stock: boolean | null
          price: number
          printful_sync_product_id: string | null
          printful_variants: Json | null
          sizes: string[] | null
          slug: string
          stock_quantity: number | null
          tag: string | null
          title: string
          updated_at: string
          video_url: string | null
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
          out_of_stock?: boolean | null
          price: number
          printful_sync_product_id?: string | null
          printful_variants?: Json | null
          sizes?: string[] | null
          slug: string
          stock_quantity?: number | null
          tag?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
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
          out_of_stock?: boolean | null
          price?: number
          printful_sync_product_id?: string | null
          printful_variants?: Json | null
          sizes?: string[] | null
          slug?: string
          stock_quantity?: number | null
          tag?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
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
          drop_closing_duration_hours: number | null
          drop_closing_enabled: boolean | null
          drop_duration_hours: number | null
          drop_end_time: string | null
          drop_opening_time: string | null
          free_shipping_threshold: number | null
          id: string
          lock_message: string | null
          shop_just_opened: boolean | null
          site_status: Database["public"]["Enums"]["site_status"]
          updated_at: string
        }
        Insert: {
          cart_timeout_minutes?: number | null
          created_at?: string
          drop_closing_duration_hours?: number | null
          drop_closing_enabled?: boolean | null
          drop_duration_hours?: number | null
          drop_end_time?: string | null
          drop_opening_time?: string | null
          free_shipping_threshold?: number | null
          id?: string
          lock_message?: string | null
          shop_just_opened?: boolean | null
          site_status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
        }
        Update: {
          cart_timeout_minutes?: number | null
          created_at?: string
          drop_closing_duration_hours?: number | null
          drop_closing_enabled?: boolean | null
          drop_duration_hours?: number | null
          drop_end_time?: string | null
          drop_opening_time?: string | null
          free_shipping_threshold?: number | null
          id?: string
          lock_message?: string | null
          shop_just_opened?: boolean | null
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
      generate_order_number: { Args: never; Returns: string }
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
