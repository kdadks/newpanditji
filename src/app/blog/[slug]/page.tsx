import { supabase } from '../../../lib/supabase'
import BlogDetailClient from './BlogDetailClient'

// Allow dynamic params for blogs created after build
export const dynamicParams = true

// Generate static params for all blog slugs
export async function generateStaticParams() {
  try {
    const { data: blogs, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')
    
    if (error) {
      console.error('Error fetching blog slugs:', error)
      return [{ slug: 'placeholder' }]
    }

    if (!blogs || blogs.length === 0) {
      return [{ slug: 'placeholder' }]
    }

    return blogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return [{ slug: 'placeholder' }]
  }
}

interface BlogDetailProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { slug } = await params
  return <BlogDetailClient slug={slug} />
}