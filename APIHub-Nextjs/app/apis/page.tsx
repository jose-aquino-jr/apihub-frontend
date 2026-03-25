// app/apis/page.tsx
import { Suspense } from 'react'
import { fetchAPIs } from '@/lib/api'
import { APICatalogClient } from '@/components/APICatalogClient'
import { APICatalogSkeleton } from '@/components/APICatalogSkeleton'

// ISR - Incremental Static Regeneration
export const revalidate = 3600 // Revalida a cada hora
export const dynamic = 'force-static' // Gera estático, revalida depois

async function getAPIs() {
  try {
    const apis = await fetchAPIs()
    return Array.isArray(apis) ? apis : []
  } catch (error) {
    console.error('Erro ao carregar APIs:', error)
    return []
  }
}

export default async function APICatalogPage() {
  const apis = await getAPIs()
  
  return (
    <Suspense fallback={<APICatalogSkeleton />}>
      <APICatalogClient initialApis={apis} />
    </Suspense>
  )
}