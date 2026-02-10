export type AppPage = 'home' | 'services' | 'about' | 'why-choose-us' | 'gallery' | 'blog' | 'blog-detail' | 'books' | 'charity' | 'testimonials' | 'contact' | 'admin' | 'terms' | 'privacy' | 'dakshina'

export type AppNavigationData = {
  page: AppPage
  category?: string
  blogSlug?: string
  blogId?: string
}

// Service types
export interface ServiceDetail {
  deity?: {
    name: string
    description: string
    significance: string
  }
  nature?: string
  purpose?: string[]
  significance?: string[]
  scripturalRoots?: {
    source: string
    description: string
  }
  whenToPerform?: string[]
  whereAndWho?: string
  specialForNRIs?: string[]
  coreAspects?: {
    title: string
    content: string
  }[]
}

export interface Service {
  id: string
  name: string
  category: 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness' | 'packages'
  duration: string
  description: string
  imageUrl?: string
  detailedDescription?: string
  benefits?: string[]
  includes?: string[]
  requirements?: string[]
  price?: string
  bestFor?: string[]
  details?: ServiceDetail
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
}