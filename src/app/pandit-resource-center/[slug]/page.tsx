import { supabase } from '../../../lib/supabase'
import ResourceSectionDetailClient from './ResourceSectionDetailClient'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { data, error } = await supabase
      .from('resource_sections')
      .select('slug')
      .eq('status', 'published')

    if (error || !data || data.length === 0) return [{ slug: 'placeholder' }]
    return data.map((s) => ({ slug: s.slug }))
  } catch {
    return [{ slug: 'placeholder' }]
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ResourceSectionPage({ params }: Props) {
  const { slug } = await params
  return <ResourceSectionDetailClient slug={slug} />
}
