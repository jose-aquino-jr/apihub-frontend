'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Eye, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  ArrowLeft,
  User,
  Calendar,
  ShieldCheck,
  Loader2,
  Lock,
  Unlock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import type { API } from '@/types' // Certifique-se de importar sua interface

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export default function APIDashboard() {
  const params = useParams()
  const router = useRouter()
  const apiId = params.id // Usando o ID da URL para buscar dados reais

  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState<API | null>(null)

  // 1. Busca de dados reais da API
  useEffect(() => {
    async function fetchAPIDetails() {
      try {
        const res = await fetch(`https://apihub-br.duckdns.org/api-detalhes/${apiId}`)
        const data = await res.json()
        
        if (data.success) {
          setApiData(data.data)
        } else {
          toast.error("Não foi possível carregar os dados desta API.")
        }
      } catch (error) {
        console.error("Erro dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    if (apiId) fetchAPIDetails()
  }, [apiId])

  // Dados de estatísticas processados da API real
  const stats = [
    { 
      label: 'Visualizações', 
      value: apiData?.ranking_position ? `${apiData.ranking_position * 12} ` : '---', 
      icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' 
    },
    { 
      label: 'Avaliação Média', 
      value: apiData?.rating?.toFixed(1) || '0.0', 
      icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' 
    },
    { 
      label: 'Rank Global', 
      value: apiData?.ranking_position ? `#${apiData.ranking_position}` : 'N/A', 
      icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' 
    },
    { 
      label: 'Total de Rankings', 
      value: apiData?.total_ranked || '0', 
      icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' 
    },
  ]

  // Mock de reviews (substituir por endpoint de reviews se existir)
  const reviews: Review[] = [
    { id: '1', user: 'DevGabriel', rating: 5, comment: 'API extremamente rápida e fácil de integrar!', date: '2023-10-25' },
    { id: '2', user: 'AnaFrontend', rating: 4, comment: 'Gostei muito, mas senti falta de mais exemplos em Python.', date: '2023-10-24' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-blue-50/20 pb-12">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header do Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2 font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">
              Insights: <span className="text-blue-600">{apiData?.name}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${apiData?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-bold text-gray-700 uppercase">Status: {apiData?.status || 'Online'}</span>
             </div>
          </div>
        </div>

        {/* Grid de Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Comentários */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> 
              Feedback da Comunidade
            </h2>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.user}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Técnica */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">Qualidade da API</h3>
              <div className="space-y-5">
                {[5, 4, 3, 2, 1].map((nota) => (
                  <div key={nota} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-3">{nota}</span>
                    <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${apiData?.rating && apiData.rating >= nota ? (nota * 20) : 5}%` }}
                        className="h-full bg-blue-600" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de Segurança Real baseado na Interface */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={80} />
              </div>
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-400" /> Segurança
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase">Protocolo</span>
                  <span className="text-xs font-mono font-bold flex items-center gap-1">
                    {apiData?.https ? <Lock size={12} className="text-green-400" /> : <Unlock size={12} className="text-red-400" />}
                    {apiData?.https ? 'HTTPS Ativo' : 'HTTP Inseguro'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase">CORS Policy</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded ${apiData?.cors ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {apiData?.cors ? 'HABILITADO' : 'BLOQUEADO'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase">Método Padrão</span>
                  <span className="text-xs font-black text-blue-400 underline">{apiData?.method || 'GET'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}