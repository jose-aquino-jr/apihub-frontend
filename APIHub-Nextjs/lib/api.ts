import { generateSlug } from '@/lib/slug'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apihub-br.duckdns.org'

const REVALIDATE_TIME = 3600

function getAuthHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function fetchAPIs(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/apis`, {
      next: { revalidate: REVALIDATE_TIME }
    })
    if (!response.ok) {
      console.error('[api] Erro ao buscar APIs:', response.status)
      return []
    }
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('[api] Erro ao buscar APIs:', error)
    return []
  }
}

export async function fetchAPIBySlug(slug: string): Promise<any | null> {
  try {
    const apis = await fetchAPIs()
    console.log(`[fetchAPIBySlug] total APIs: ${apis.length}, buscando slug: "${slug}"`)
    const found = apis.find((a: any) => generateSlug(a.name) === slug) || null
    console.log(`[fetchAPIBySlug] encontrou: ${found?.name ?? 'nenhuma'}`)
    return found
  } catch (error) {
    console.error('[api] Erro ao buscar API por slug:', error)
    return null
  }
}

export async function fetchAPIById(apiId: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/apis/${apiId}`, {
      next: { revalidate: REVALIDATE_TIME }
    })
    if (!response.ok) return null
    const result = await response.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error('[api] Erro ao buscar API por ID:', error)
    return null
  }
}

export async function fetchRanking(limit: number = 50): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/apis/ranking?limit=${limit}`, {
      next: { revalidate: REVALIDATE_TIME }
    })
    if (!response.ok) return []
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('[api] Erro ao buscar ranking:', error)
    return []
  }
}

export async function fetchAPIsByCategory(category: string): Promise<any[]> {
  const allAPIs = await fetchAPIs()
  return allAPIs.filter((api: any) => {
    const tags = api.tags?.toLowerCase().split(',') || []
    return tags.some((tag: string) => tag.trim().includes(category.toLowerCase()))
  })
}

export async function searchAPIs(query: string): Promise<any[]> {
  const allAPIs = await fetchAPIs()
  return allAPIs.filter((api: any) => {
    const searchString = `${api.name || ''} ${api.description || ''} ${api.tags || ''}`.toLowerCase()
    return searchString.includes(query.toLowerCase())
  })
}

export async function fetchUserFavorites(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-favorites`, {
      headers: getAuthHeader()
    })
    if (!response.ok) return []
    const result = await response.json()
    return result.success ? result.data?.map((fav: any) => fav.apis).filter(Boolean) || [] : []
  } catch (error) {
    console.error('[api] Erro ao buscar favoritos:', error)
    return []
  }
}

export async function toggleFavorite(apiId: string, isCurrentlyFavorite: boolean): Promise<boolean> {
  try {
    const method = isCurrentlyFavorite ? 'DELETE' : 'POST'
    const url = `${API_BASE_URL}/user-favorites${isCurrentlyFavorite ? `/${apiId}` : ''}`
    const response = await fetch(url, {
      method,
      headers: getAuthHeader(),
      body: !isCurrentlyFavorite ? JSON.stringify({ api_id: apiId }) : undefined
    })
    if (response.status === 401) return false
    const result = await response.json()
    return result.success || false
  } catch (error) {
    console.error('[api] Erro ao alternar favorito:', error)
    return false
  }
}