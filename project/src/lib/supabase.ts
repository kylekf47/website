import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          role: 'admin' | 'customer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          role?: 'admin' | 'customer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string;
          role?: 'admin' | 'customer';
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string;
          size: string;
          popular: boolean;
          spicy: boolean;
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string;
          size?: string;
          popular?: boolean;
          spicy?: boolean;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image_url?: string;
          size?: string;
          popular?: boolean;
          spicy?: boolean;
          available?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          order_details: string;
          total_amount: number;
          status: 'pending' | 'fulfilled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          order_details: string;
          total_amount: number;
          status?: 'pending' | 'fulfilled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: string;
          customer_name?: string;
          customer_phone?: string;
          order_details?: string;
          total_amount?: number;
          status?: 'pending' | 'fulfilled';
          updated_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: number;
          phone: string;
          email: string;
          address: string;
          map_embed_url: string;
          whatsapp_number: string;
          updated_at: string;
        };
        Insert: {
          phone: string;
          email: string;
          address: string;
          map_embed_url: string;
          whatsapp_number: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          phone?: string;
          email?: string;
          address?: string;
          map_embed_url?: string;
          whatsapp_number?: string;
          updated_at?: string;
        };
      };
    };
  };
};