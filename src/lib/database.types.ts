export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          resume_count: number
          last_login: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          resume_count?: number
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          resume_count?: number
          last_login?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json
          created_at: string
          updated_at: string
          is_active: boolean
          analysis_score: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
          analysis_score?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
          analysis_score?: number
        }
      }
    }
  }
}