import { createClient } from '@supabase/supabase-js'
import { Database } from '../db/schema'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export type AppSupabaseClient = typeof supabase

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
