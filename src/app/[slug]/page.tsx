import { notFound } from 'next/navigation'
import DynamicLegalPage from '@/components/pages/DynamicLegalPage'
import { supabase } from '@/lib/supabase'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// This route handles dynamic legal pages at root level
// Examples: /privacy-policy, /cookie-policy, /gdpr, /disclaimer, etc.
// Only renders if the slug matches a published legal page in the database
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  
  // Check if this slug corresponds to a legal page
  const { data: page } = await supabase
    .from('pages')
    .select('slug, is_published')
    .eq('slug', slug)
    .eq('template_type', 'legal')
    .single()

  // If no legal page found with this slug, return 404
  if (!page) {
    notFound()
  }

  // Render the legal page
  return <DynamicLegalPage slug={slug} />
}

// Generate static pages at build time for all published legal pages
export async function generateStaticParams() {
  try {
    const { data: pages } = await supabase
      .from('pages')
      .select('slug')
      .eq('template_type', 'legal')
      .eq('is_published', true)

    return pages?.map((page) => ({ slug: page.slug })) || []
  } catch (error) {
    console.error('Error generating static params for legal pages:', error)
    return []
  }
}

// Metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const { data: page } = await supabase
      .from('pages')
      .select('title, meta_title, meta_description')
      .eq('slug', slug)
      .eq('template_type', 'legal')
      .single()

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.'
      }
    }

    return {
      title: page.meta_title || page.title,
      description: page.meta_description || '',
    }
  } catch (error) {
    console.error('Error generating metadata for legal page:', error)
    return {
      title: 'Legal Page',
      description: ''
    }
  }
}
