'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Music, TrendingUp, Clock, Target, Heart, Plus, Search, LogOut, User, Upload, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Song, DashboardStats, PracticeSession } from '@/lib/types'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalSongs: 0,
    totalPracticeTime: 0,
    averageAccuracy: 0,
    currentStreak: 0,
    favoriteSongs: 0,
    recentSessions: []
  })
  const [songs, setSongs] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await loadDashboardData(user.id)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadDashboardData(userId: string) {
    try {
      // Carregar músicas
      const { data: songsData } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      setSongs(songsData || [])

      // Carregar sessões de prática
      const { data: sessionsData } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      // Carregar favoritos
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)

      // Calcular estatísticas
      const totalPracticeTime = sessionsData?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0
      const averageAccuracy = sessionsData?.length 
        ? Math.round(sessionsData.reduce((acc, s) => acc + s.accuracy, 0) / sessionsData.length)
        : 0

      setStats({
        totalSongs: songsData?.length || 0,
        totalPracticeTime,
        averageAccuracy,
        currentStreak: 7, // Implementar lógica de streak
        favoriteSongs: favoritesData?.length || 0,
        recentSessions: sessionsData || []
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  async function handleSignIn() {
    try {
      // Usar autenticação por email (magic link) em vez de OAuth
      const email = prompt('Digite seu email:')
      if (!email) return

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      })
      
      if (error) throw error
      
      toast.success('Link de acesso enviado para seu email!')
    } catch (error: any) {
      toast.error('Erro ao fazer login: ' + error.message)
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSongs([])
      toast.success('Logout realizado com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao fazer logout: ' + error.message)
    }
  }

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <Music className="w-16 h-16 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                <Music className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white">ChordMaster</h1>
            <p className="text-xl text-purple-200">
              Aprenda violão com análise inteligente de acordes
            </p>
          </div>

          <div className="space-y-4 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-purple-200">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <span>Análise de acordes com IA</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <span>Acompanhe seu progresso</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
                <span>Salve suas músicas favoritas</span>
              </div>
            </div>

            <Button 
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl text-lg shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Começar Agora
            </Button>
          </div>

          <p className="text-purple-300 text-sm">
            Conecte-se e comece sua jornada musical hoje
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">ChordMaster</h1>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="border-2 border-purple-500">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-purple-500 text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-purple-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="songs" className="data-[state=active]:bg-purple-500">
              Minhas Cifras
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-purple-500">
              Explorar
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-200">Total de Músicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.totalSongs}</div>
                  <p className="text-xs text-purple-300 mt-1">cifras salvas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-200">Tempo de Prática</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.totalPracticeTime}h</div>
                  <p className="text-xs text-blue-300 mt-1">total praticado</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-200">Precisão Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.averageAccuracy}%</div>
                  <p className="text-xs text-green-300 mt-1">nas práticas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-200">Sequência Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
                  <p className="text-xs text-orange-300 mt-1">dias seguidos</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Sessões Recentes</CardTitle>
                <CardDescription className="text-purple-300">
                  Suas últimas práticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                    <p className="text-purple-300">Nenhuma sessão de prática ainda</p>
                    <p className="text-sm text-purple-400 mt-2">Comece a praticar para ver seu progresso aqui</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 p-2 rounded-lg">
                            <Music className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Sessão de Prática</p>
                            <p className="text-sm text-purple-300">{session.duration_minutes} minutos</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          {session.accuracy}% precisão
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Songs Tab */}
          <TabsContent value="songs" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input 
                  placeholder="Buscar por música ou artista..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-purple-400 focus:border-purple-500"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Nova Cifra
              </Button>
            </div>

            {filteredSongs.length === 0 ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Music className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery ? 'Nenhuma música encontrada' : 'Nenhuma cifra ainda'}
                    </h3>
                    <p className="text-purple-300 mb-6">
                      {searchQuery 
                        ? 'Tente buscar por outro termo' 
                        : 'Adicione sua primeira cifra para começar'}
                    </p>
                    {!searchQuery && (
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Primeira Cifra
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.map((song) => (
                  <Card 
                    key={song.id}
                    className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                            {song.title}
                          </CardTitle>
                          <CardDescription className="text-purple-300">
                            {song.artist}
                          </CardDescription>
                        </div>
                        <Badge 
                          className={
                            song.difficulty === 'beginner' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : song.difficulty === 'intermediate'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }
                        >
                          {song.difficulty === 'beginner' ? 'Iniciante' : 
                           song.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-purple-300">
                        <Music className="w-4 h-4" />
                        <span>Tom: {song.tone}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Explorar Cifras
                  </h3>
                  <p className="text-purple-300 mb-6">
                    Em breve: biblioteca com milhares de cifras
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
