export type AppPage = 'home' | 'services' | 'about' | 'why-choose-us' | 'gallery' | 'blog' | 'blog-detail' | 'books' | 'charity' | 'testimonials' | 'contact' | 'admin' | 'terms' | 'privacy' | 'dakshina'

// ── Dynamic service content (new admin design) ─────────────────────────────
export interface BulletItem {
  id: string
  icon: string
  text: string
}
export interface VideoItem {
  url: string
  thumbnail: string
}
export interface ContentSection {
  id: string
  icon: string
  enabled: boolean
  title: string
  description: string
  bullets: BulletItem[]
  images: string[]
  videos: VideoItem[]
  bgColor: string
}
export interface BlogLink {
  title: string
  url: string
}

export type AppNavigationData = {
  page: AppPage
  category?: string
  blogSlug?: string
  blogId?: string
}

export interface Service {
  id: string
  name: string
  category: 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness' | 'packages'
  duration: string
  description: string
  imageUrl?: string
  detailedDescription?: string
  price?: string
  samagriFile?: {
    name: string
    data?: string
    url?: string
    type: string
  }
  isPackage?: boolean
  packageSavingsText?: string
  packageHighlights?: string[]
  includedServices?: Array<{
    id: string
    name: string
    slug: string
    price?: string
    duration?: string
    description: string
    imageUrl?: string
  }>
  // Dynamic content from database
  contentSections?: ContentSection[]
  blogLinks?: BlogLink[]
  bookingButton?: { name: string; url: string }
}