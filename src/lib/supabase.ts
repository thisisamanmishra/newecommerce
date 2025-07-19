import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          category_id: string | null;
          stock_quantity: number;
          sku: string | null;
          images: string[];
          specifications: any;
          is_active: boolean;
          weight: number | null;
          dimensions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          category_id?: string | null;
          stock_quantity?: number;
          sku?: string | null;
          images?: string[];
          specifications?: any;
          is_active?: boolean;
          weight?: number | null;
          dimensions?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string | null;
          stock_quantity?: number;
          sku?: string | null;
          images?: string[];
          specifications?: any;
          is_active?: boolean;
          weight?: number | null;
          dimensions?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_amount: number;
          discount_amount: number;
          tax_amount: number;
          shipping_address: any;
          billing_address: any | null;
          payment_method: string | null;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id: string | null;
          delivery_partner: string | null;
          tracking_id: string | null;
          awb_number: string | null;
          estimated_delivery: string | null;
          delivered_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          shipping_address: any;
          billing_address?: any | null;
          payment_method?: string | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          delivery_partner?: string | null;
          tracking_id?: string | null;
          awb_number?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          total_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          shipping_address?: any;
          billing_address?: any | null;
          payment_method?: string | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          delivery_partner?: string | null;
          tracking_id?: string | null;
          awb_number?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}