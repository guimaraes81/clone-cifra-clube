import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          user_id: string
          title: string
          artist: string
          chords: string
          lyrics: string
          tone: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          ai_analysis: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          artist: string
          chords: string
          lyrics: string
          tone: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          ai_analysis?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          artist?: string
          chords?: string
          lyrics?: string
          tone?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          ai_analysis?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_sessions: {
        Row: {
          id: string
          user_id: string
          song_id: string
          duration_minutes: number
          accuracy: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id: string
          duration_minutes: number
          accuracy: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string
          duration_minutes?: number
          accuracy?: number
          notes?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          song_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string
          created_at?: string
        }
      }
    }
  }
}
