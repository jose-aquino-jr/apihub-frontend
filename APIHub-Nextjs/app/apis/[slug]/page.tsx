// app/apis/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { fetchAPIBySlug, fetchAPIs } from '@/lib/api'
import { APIDetailClient } from '@/components/APIDetailClient'
import { APIDetailSkeleton } from '@/components/APIDetailSkeleton'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getAPI(slug: string) {
  const api = await fetchAPIBySlug(slug)
  if (!api) return null
  
  // Buscar APIs relacionadas (mesma categoria)
  const allApis = await fetchAPIs()
  const category = api.tags?.split(',')[0]?.trim() || ''
  const related = allApis
    .filter(a => a.id !== api.id && a.tags?.includes(category))
    .slice(0, 4)
  
  return { api, related, category }
}

export default async function APIDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getAPI(slug)
  
  if (!data) notFound()
  
  return (
    <Suspense fallback={<APIDetailSkeleton />}>
      <APIDetailClient 
        initialApi={data.api}
        initialRelated={data.related}
        initialCategory={data.category}
      />
    </Suspense>
  )
}