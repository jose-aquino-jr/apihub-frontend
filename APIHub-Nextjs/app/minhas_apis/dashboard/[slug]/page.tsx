'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Eye, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  ArrowLeft,
  User,
  Calendar,
  ShieldCheck,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Interface para Tipagem (ajuste conforme seu types.ts)
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
  const slug = params.slug as string

  // Estados para dados (em um cenário real, você buscaria do useEffect)
  const [isLoading, setIsLoading] = useState(false)

  // Dados Mockados (Simulando o que viria da sua API/Banco)
  const apiName = slug.replace(/-/g, ' ')
  const stats = [
    { label: 'Cliques (Visualizações)', value: '1,284', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avaliação Média', value: '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Total de Notas', value: '85', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Comentários', value: '12', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  const reviews: Review[] = [
    { id: '1', user: 'DevGabriel', rating: 5, comment: 'API extremamente rápida e fácil de integrar!', date: '2023-10-25' },
    { id: '2', user: 'AnaFrontend', rating: 4, comment: 'Gostei muito, mas senti falta de mais exemplos em Python.', date: '2023-10-24' },
    { id: '3', user: 'LucasTech', rating: 5, comment: 'O suporte ao CORS salvou meu projeto.', date: '2023-10-22' },
  ]

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-blue-50/20 pb-12">
      <div className="container-custom">
        
        {/* Botão Voltar e Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o catálogo
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">
              <span className="text-blue-600">{apiName}</span>
            </h1>
            
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                API Online
             </div>
          </div>
        </div>

        {/* Grid de Estatísticas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Comentários */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> 
                Avaliações e Comentários
              </h2>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.user}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {review.date}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coluna Direita: Distribuição e Resumo */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Distribuição de Notas</h3>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((nota) => (
                  <div key={nota} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-4">{nota}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${nota === 5 ? 70 : nota === 4 ? 20 : 5}%` }}
                        className="h-full bg-yellow-400" 
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {nota === 5 ? '70%' : nota === 4 ? '20%' : '5%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de Informações Técnicas Rápidas */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Info da API
              </h3>
              <div className="space-y-3 text-sm opacity-90">
                <div className="flex justify-between">
                  <span>Protocolo:</span>
                  <span className="font-mono">HTTPS / TLS 1.3</span>
                </div>
                <div className="flex justify-between">
                  <span>CORS:</span>
                  <span className="bg-white/20 px-2 rounded">Habilitado</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime (30d):</span>
                  <span className="text-green-300 font-bold">99.98%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}