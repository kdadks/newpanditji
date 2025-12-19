export type AppPage = 'home' | 'services' | 'about' | 'why-choose-us' | 'gallery' | 'blog' | 'blog-detail' | 'books' | 'charity' | 'testimonials' | 'contact' | 'admin' | 'terms' | 'privacy' | 'dakshina'

export type AppNavigationData = {
  page: AppPage
  category?: string
  blogSlug?: string
  blogId?: string
}