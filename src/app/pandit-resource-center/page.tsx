import type { Metadata } from 'next'
import ResourceCenterPage from '@/components/pages/ResourceCenterPage'
import { supabase } from '@/lib/supabase'

const SLUG = 'pandit-resource-center'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: page } = await supabase
      .from('pages')
      .select('title, meta_title, meta_description')
      .eq('slug', SLUG)
      .single()

    return {
      title: page?.meta_title || page?.title || 'Pandit Resource Center',
      description: page?.meta_description || 'Curated resources, guides, photos, videos and downloadable files.',
      alternates: { canonical: `/${SLUG}` },
    }
  } catch {
    return {
      title: 'Pandit Resource Center',
      description: 'Curated resources, guides, photos, videos and downloadable files.',
    }
  }
}

export default function Page() {
  return <ResourceCenterPage />
}
