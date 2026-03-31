import type { API } from '@/types'
import { fetchAPIs, fetchAPIBySlug } from '@/lib/api'

export { generateSlug } from '@/lib/slug'

export function getCategoryFromTags(tags: string): string {
  if (!tags) return 'Outros'
  const commonCategories = [
    'Clima', 'Financeiro', 'Imagens', 'Dados', 'Tradução',
    'Geografia', 'Redes Sociais', 'Pagamentos', 'IA', 'Educação',
    'Animais', 'Palavras', 'Livros', 'Produtos', 'Diversão',
    'Nomes', 'Localização', 'Fotos', 'Música', 'Jogos',
    'Desenvolvimento', 'Email', 'Calendário', 'Análises', 'Mobile'
  ]
  const tagList = tags.split(',').map(tag => tag.trim())
  const foundCategory = commonCategories.find(category =>
    tagList.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  )
  return foundCategory || 'Outros'
}

export function parseParameters(parameters: string): Record<string, string> {
  try {
    if (!parameters) return {}
    return JSON.parse(parameters)
  } catch {
    return { parâmetros: parameters }
  }
}

export async function getApiBySlug(slug: string): Promise<API | null> {
  try {
    const api = await fetchAPIBySlug(slug)
    if (api) return api
    return null
  } catch (error) {
    console.error('[utils] Erro ao buscar API por slug:', error)
    return null
  }
}

export async function getRelatedApis(api: API, limit: number = 4): Promise<API[]> {
  try {
    const allApis = await fetchAPIs()
    if (!Array.isArray(allApis)) return []
    const category = getCategoryFromTags(api.tags)
    return allApis
      .filter((a: API) => a.id !== api.id && getCategoryFromTags(a.tags) === category)
      .slice(0, limit)
  } catch (error) {
    console.error('[utils] Erro ao buscar APIs relacionadas:', error)
    return []
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function capitalizeFirst(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function cleanUrl(url: string): string {
  if (!url) return ''
  return url.replace(/\/$/, '')
}