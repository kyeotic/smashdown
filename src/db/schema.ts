export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leagues: {
        Row: {
          id: string
          user_id: string
          updated_at: string | null
          created_at: string | null
          data: Json
        }
        Insert: {
          id?: string
          user_id: string
          updated_at?: string | null
          created_at?: string | null
          data?: Json
        }
        Update: {
          id?: string
          user_id?: string
          updated_at?: string | null
          created_at?: string | null
          data?: Json
        }
      }
      tournaments: {
        Row: {
          id: string
          user_id: string
          league_id: string | null
          updated_at: string | null
          created_at: string | null
          data: Json
        }
        Insert: {
          id?: string
          user_id: string
          league_id?: string | null
          updated_at?: string | null
          created_at?: string | null
          data?: Json
        }
        Update: {
          id?: string
          user_id?: string
          league_id?: string | null
          updated_at?: string | null
          created_at?: string | null
          data?: Json
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email?: string | null
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
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
  }
}
