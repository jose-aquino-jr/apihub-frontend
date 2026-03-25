// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Sparkles, ArrowRight, Code2, Globe, Users, CheckCircle2, Star, TrendingUp, Shield } from 'lucide-react'
import { fetchAPIs } from '@/lib/api'
import { Metadata } from 'next'

// ============================================
// METADADOS PARA SEO (CRÍTICO)
// ============================================
export const metadata: Metadata = {
  title: 'APIHub | A Maior Plataforma de APIs Gratuitas para Desenvolvedores',
  description: 'Descubra e integre APIs gratuitas de forma simples. Catálogo com +40 APIs, documentação completa, exemplos práticos e comunidade ativa. Comece agora!',
  keywords: 'API, APIs gratuitas, desenvolvimento de software, integração de APIs, APIHub, REST API, desenvolvedor',
  authors: [{ name: 'APIHub Team' }],
  openGraph: {
    title: 'APIHub | Domine o Poder das APIs',
    description: 'Plataforma gratuita com dezenas de APIs prontas para integração. Documentação, exemplos e suporte da comunidade.',
    url: 'https://apihub.com.br',
    siteName: 'APIHub',
    images: [
      {
        url: 'https://apihub.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'APIHub - Plataforma de APIs'
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APIHub | Plataforma de APIs Gratuitas',
    description: '+40 APIs gratuitas para você integrar em seus projetos. Documentação completa e exemplos práticos.',
    images: ['https://apihub.com.br/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://apihub.com.br',
  },
}

export const revalidate = 3600 // Revalida a cada 1 hora
export const dynamic = 'force-static' // Página totalmente estática

// ============================================
// DADOS ESTÁTICOS (para fallback)
// ============================================
const FALLBACK_STATS = { apis: 40, categories: 15, users: 3200 }
const FALLBACK_FEATURED = [
  { name: 'OpenWeatherMap', category: 'Clima', description: 'Previsão do tempo para qualquer localização', rating: 4.8 },
  { name: 'ViaCEP', category: 'Dados', description: 'Busca de CEPs brasileiros', rating: 4.9 },
  { name: 'PokeAPI', category: 'Entretenimento', description: 'Dados completos de Pokémon', rating: 4.7 },
  { name: 'JSONPlaceholder', category: 'Desenvolvimento', description: 'API fake para testes e prototipagem', rating: 4.6 }
]

// ============================================
// FUNÇÕES DE BUSCA (SERVIDOR)
// ============================================
async function getStats() {
  try {
    const apis = await fetchAPIs()
    const categories = new Set<string>()
    
    apis.forEach((api: any) => {
      api.tags?.split(',').forEach((tag: string) => categories.add(tag.trim()))
    })
    
    return { apis: apis.length, categories: categories.size, users: 3250 }
  } catch {
    return FALLBACK_STATS
  }
}

async function getFeaturedApis() {
  try {
    const apis = await fetchAPIs()
    return apis.slice(0, 6).map((api: any) => ({
      name: api.name,
      category: api.tags?.split(',')[0]?.trim() || 'Diversos',
      description: api.description?.substring(0, 100) || 'API incrível para suas aplicações',
      rating: api.rating || 4.5,
      slug: api.slug || api.name?.toLowerCase().replace(/\s+/g, '-')
    }))
  } catch {
    return FALLBACK_FEATURED
  }
}

// ============================================
// COMPONENTES SERVER (SEM 'use client')
// ============================================
const StatCard = ({ value, label, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
    <div className={`w-12 h-12 bg-${color}-50 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`w-6 h-6 text-${color}-600`} />
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}+</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
)

const FeatureCard = ({ icon, title, description, features }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((item: string) => (
        <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          {item}
        </li>
      ))}
    </ul>
  </div>
)

const ApiCard = ({ name, category, description, rating, slug }: any) => (
  <Link href={`/apis/${slug}`} className="group">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105">
      <div className="flex justify-between items-start mb-3">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{category}</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-gray-700">{rating}</span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
    </div>
  </Link>
)

// ============================================
// PÁGINA PRINCIPAL (SERVER COMPONENT)
// ============================================
export default async function Home() {
  const [stats, featuredApis] = await Promise.all([getStats(), getFeaturedApis()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Schema JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "APIHub",
            "url": "https://apihub.com.br",
            "description": "Plataforma de APIs gratuitas para desenvolvedores",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://apihub.com.br/apis?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-8 shadow-sm border border-gray-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Plataforma <span className="text-blue-600 font-semibold">Gratuita</span> para Devs
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Domine o Poder</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              das APIs
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubra e integre <strong className="text-gray-800">APIs gratuitas</strong> em uma plataforma 
            <span className="font-semibold text-gray-800"> feita para desenvolvedores de verdade</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/apis" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2 group"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/documentacao-oficial-apihub.pdf" 
              className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:shadow transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>Ver Documentação</span>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <StatCard value={stats.apis} label="APIs Disponíveis" icon={Code2} color="blue" />
            <StatCard value={stats.categories} label="Categorias" icon={Globe} color="purple" />
            <StatCard value={stats.users} label="Desenvolvedores" icon={Users} color="green" />
          </div>
        </div>
      </section>

      {/* WHY APIHUB SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o APIHub?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Uma plataforma completa para suas integrações de API
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon="📚" 
              title="Catálogo Organizado" 
              description="APIs categorizadas e fáceis de encontrar"
              features={['Busca inteligente', 'Filtros por categoria', 'Avaliações da comunidade']}
            />
            <FeatureCard 
              icon="⚡" 
              title="Implementação Rápida" 
              description="Documentação clara e exemplos práticos"
              features={['Exemplos em múltiplas linguagens', 'Sandbox para testes', 'Deploy rápido']}
            />
            <FeatureCard 
              icon="🔧" 
              title="Fácil Integração" 
              description="Teste e use APIs em minutos"
              features={['Documentação interativa', 'Suporte da comunidade', 'Zero configuração']}
            />
          </div>
        </div>
      </section>

      {/* FEATURED APIS SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                APIs em Destaque
              </h2>
              <p className="text-gray-600">
                As APIs mais populares da nossa plataforma
              </p>
            </div>
            <Link href="/apis" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApis.map((api: any) => (
              <ApiCard key={api.name} {...api} />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefícios Exclusivos
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Tudo o que você precisa para acelerar seu desenvolvimento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gratuito para sempre</h3>
              <p className="text-gray-500">Sem taxas escondidas. Todas as APIs são totalmente gratuitas.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Documentação Completa</h3>
              <p className="text-gray-500">Exemplos práticos e documentação detalhada para cada API.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidade Ativa</h3>
              <p className="text-gray-500">Suporte da comunidade e atualizações constantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Junte-se a milhares de desenvolvedores e acelere seus projetos
          </p>
          <Link 
            href="/apis" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Explorar APIs Agora</span>
          </Link>
          <p className="text-blue-200 text-sm mt-6">
            🚀 Não precisa de cartão de crédito • Totalmente gratuito
          </p>
        </div>
      </section>
    </div>
  )
}