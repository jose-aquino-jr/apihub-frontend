'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, Clock, CheckCircle, Trophy, TrendingUp,
  PlayCircle, ChevronRight, Download, BarChart, Loader2
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

const BACKEND_URL = 'https://apihub-br.duckdns.org'

// --- INTERFACES AJUSTADAS CONFORME DOC ---
interface DB_Course {
  id: string
  titulo: string // Corrigido de 'nome'
  descricao: string
  categoria?: string
  total_aulas?: number
  carga_horaria?: number // Corrigido de 'horas_estimadas'
}

// O APIHub retorna o progresso dentro da estrutura do curso ou em endpoint específico
interface CourseUI {
  id: string
  title: string
  description: string
  category: string
  progress: number
  status: 'in_progress' | 'completed' | 'not_started'
  totalLessons: number
  completedLessons: number
  timeSpent: number
  lastAccessed: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CourseUI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      const token = localStorage.getItem('authToken')
      if (!token) return

      try {
        setLoading(true)
        
        // 1. Busca todos os cursos disponíveis (Doc 6.1)
        const resCursos = await fetch(`${BACKEND_URL}/cursos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const cursosData = await resCursos.json()
        const listaCursos: DB_Course[] = cursosData.success ? cursosData.data : []

        // 2. Para cada curso, buscamos o progresso individual (Doc 7.1)
        // Dica: Em um cenário real, o backend deveria ter um endpoint "meus-cursos"
        // Para este exemplo, vamos simular a integração com o endpoint /progresso/{id}
        const merged: CourseUI[] = await Promise.all(listaCursos.map(async (curso) => {
          const resProg = await fetch(`${BACKEND_URL}/progresso/${curso.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const progData = await resProg.json()
          
          // Se o backend retornar sucesso, pegamos a porcentagem, senão é 0
          const progressoInfo = progData.success ? progData.data : { porcentagem: 0, aulas_concluidas: [] }
          const percent = Number(progressoInfo.porcentagem || 0)

          return {
            id: curso.id,
            title: curso.titulo,
            description: curso.descricao,
            category: curso.categoria || 'Desenvolvimento',
            progress: percent,
            status: percent === 100 ? 'completed' : (percent > 0 ? 'in_progress' : 'not_started'),
            totalLessons: curso.total_aulas || 0,
            completedLessons: progressoInfo.aulas_concluidas?.length || 0,
            timeSpent: 0, // Campo não disponível diretamente na doc base
            lastAccessed: 'Recentemente'
          }
        }))

        setCourses(merged)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  // Estatísticas calculadas
  const stats = {
    total: courses.length,
    concluidos: courses.filter(c => c.status === 'completed').length,
    emAndamento: courses.filter(c => c.status === 'in_progress').length,
    media: courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length) : 0
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sincronizando seu progresso...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Painel de <span className="text-blue-600">Controle</span></h1>
        <p className="text-gray-500 mt-2">Bem-vindo de volta, {user?.name.split(' ')[0]}!</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen size={20}/>} label="Cursos" value={stats.total} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<CheckCircle size={20}/>} label="Concluídos" value={stats.concluidos} color="bg-green-50 text-green-600" />
        <StatCard icon={<TrendingUp size={20}/>} label="Andamento" value={stats.emAndamento} color="bg-orange-50 text-orange-600" />
        <StatCard icon={<Trophy size={20}/>} label="Média" value={`${stats.media}%`} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Lista de Cursos */}
      <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">Sua Jornada</h3>
        
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-medium">Você ainda não se inscreveu em nenhum curso.</p>
              <Link href="/academy/courses" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Ver catálogo</Link>
            </div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="group p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-md">
                        {course.category}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{course.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-1 mt-1">{course.description}</p>
                  </div>

                  <div className="w-full lg:w-64 space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                    <Link 
                      href={`/academy/courses/${course.id}`}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                      {course.progress === 100 ? 'Revisar' : 'Continuar'} <PlayCircle size={14}/>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-4 ${color}`}>
      <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  )
}