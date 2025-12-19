'use client'

import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import BlogDetailPage from '../../../components/pages/BlogDetailPage'
import { AppPage, AppNavigationData } from '../../../lib/types'

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

interface BlogDetailProps {
  params: {
    slug: string
  }
}

export default function BlogDetail({ params }: BlogDetailProps) {
  const router = useRouter()

  const handleNavigate = (pageOrData: AppPage | AppNavigationData) => {
    if (typeof pageOrData === 'string') {
      router.push(pageOrData === 'home' ? '/' : `/${pageOrData}`)
    } else {
      // Handle AppNavigationData object
      const { page, blogSlug } = pageOrData
      if (page === 'blog-detail' && blogSlug) {
        router.push(`/blog/${blogSlug}`)
      } else {
        router.push(page === 'home' ? '/' : `/${page}`)
      }
    }
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <BlogDetailPage blogId={params.slug} onNavigate={handleNavigate} />
    </Suspense>
  )
}