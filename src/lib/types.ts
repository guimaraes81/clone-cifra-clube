export interface Song {
  id: string
  user_id: string
  title: string
  artist: string
  chords: string
  lyrics: string
  tone: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  ai_analysis: ChordAnalysis | null
  created_at: string
  updated_at: string
}

export interface ChordAnalysis {
  chords: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  suggestions: string[]
  alternativeTones: string[]
  practiceTime: string
}

export interface PracticeSession {
  id: string
  user_id: string
  song_id: string
  duration_minutes: number
  accuracy: number
  notes: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalSongs: number
  totalPracticeTime: number
  averageAccuracy: number
  currentStreak: number
  favoriteSongs: number
  recentSessions: PracticeSession[]
}
