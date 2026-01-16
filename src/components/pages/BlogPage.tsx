'use client'

import { useRouter } from 'next/navigation'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useBlogs } from '../../hooks/useBlogs'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { BookOpen, CaretRight, Calendar, User, Sparkle, CircleNotch } from '@phosphor-icons/react'
import { blogArticles as defaultBlogs } from '../../lib/data'
import { AppPage, AppNavigationData } from '../../lib/types'

interface BlogArticle {
  id: string
  slug?: string
  title: string
  excerpt: string
  category: string
  content?: string
  featured_image_url?: string | null
  reading_time_minutes?: number | null
  published_at?: string | null
}

interface BlogPageProps {
}

export default function BlogPage({ }: BlogPageProps) {
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
  usePageSEO({
    title: 'Hindu Spirituality & Philosophy | Blog on Rituals, Traditions & Vedic Wisdom',
    description: 'Discover insights on Hindu spirituality, pooja significance, and Vedic traditions. Learn about spiritual practices and sacred rituals in modern life.',
    keywords: 'Hindu spirituality, pooja blog, spiritual practices, Vedic wisdom, Hindu traditions, spiritual guidance, ritual significance',
    canonicalUrl: 'https://panditrajesh.ie/blog'
  })

  const { blogs: dbBlogs, isLoading } = useBlogs()
  
  // Transform database blogs to BlogArticle format, or use defaults
  const blogArticles: BlogArticle[] = (dbBlogs && dbBlogs.length > 0) 
    ? dbBlogs.map(blog => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        category: blog.category_name || 'Article',
        content: blog.content,
        featured_image_url: blog.featured_image_url,
        reading_time_minutes: blog.reading_time_minutes,
        published_at: blog.published_at
      }))
    : defaultBlogs.map(blog => ({
        ...blog,
        slug: undefined,
        content: undefined,
        featured_image_url: null,
        reading_time_minutes: null,
        published_at: null
      }))

  // Get unique categories (filter out undefined/null values)
  const categories = [...new Set(blogArticles.map(article => article.category).filter((c): c is string => Boolean(c)))]

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            {/* Duplicate for seamless animation */}
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>

        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>

        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <Sparkle size={18} weight="fill" className="animate-pulse" />
              Spiritual Wisdom & Insights
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              Spiritual <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Wisdom</span> Blog
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              Discover profound insights on Hindu philosophy, spirituality, and practical guidance
              for navigating life's sacred journey with wisdom and grace.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Badge variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
            All Articles
          </Badge>
          {categories.map((category, index) => (
            <Badge key={category || `category-${index}`} variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {category}
            </Badge>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <CircleNotch className="animate-spin text-primary" size={48} />
          </div>
        ) : (
        <>
        {/* Featured Article */}
        {blogArticles.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-heading font-semibold text-2xl mb-2">Featured Article</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <Card className="border-0 shadow-2xl bg-linear-to-br from-card via-card to-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {'category' in blogArticles[0] ? blogArticles[0].category : 'Article'}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        Recent
                      </div>
                    </div>

                    <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-4 leading-tight">
                      {blogArticles[0].title}
                    </h2>

                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {blogArticles[0].excerpt}
                    </p>

                    <Button 
                      className="w-fit shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        if (blogArticles[0].slug) {
                          handleNavigate({ page: 'blog-detail', blogSlug: blogArticles[0].slug })
                        }
                      }}
                      disabled={!blogArticles[0].slug}
                    >
                      <BookOpen className="mr-2" size={18} />
                      Read Full Article
                      <CaretRight className="ml-2" size={16} />
                    </Button>
                  </div>

                  <div className="bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center p-8 lg:p-12 min-h-[300px]">
                    {blogArticles[0].featured_image_url ? (
                      <img 
                        src={blogArticles[0].featured_image_url} 
                        alt={blogArticles[0].title}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="text-center">
                        <BookOpen className="text-primary/60 mx-auto mb-4" size={80} />
                        <p className="text-primary/60 font-medium">Spiritual Wisdom</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogArticles.slice(1).map((article, index) => (
            <Card 
              key={article.id} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-card to-card/80 hover:scale-105 cursor-pointer"
              onClick={() => {
                if (article.slug) {
                  handleNavigate({ page: 'blog-detail', blogSlug: article.slug })
                }
              }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Blog Image */}
              {article.featured_image_url ? (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.featured_image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                </div>
              ) : (
                <div className="h-32 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <BookOpen className="text-primary/40" size={40} />
                </div>
              )}

              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="text-primary/60 text-lg font-bold">
                    {(index + 2).toString().padStart(2, '0')}
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {article.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User size={14} />
                    Pandit Rajesh Joshi
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (article.slug) {
                        handleNavigate({ page: 'blog-detail', blogSlug: article.slug })
                      }
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter/Coming Soon */}
        <Card className="bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5 border-0 shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            <BookOpen className="mx-auto mb-6 text-primary" size={48} />

            <h3 className="font-heading font-semibold text-2xl mb-4">More Wisdom Coming Soon</h3>

            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              We regularly publish new articles on Hindu spirituality, philosophy, and practical guidance
              for modern living. Subscribe to stay updated with fresh insights and timeless wisdom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="outline" className="px-6 py-2">
                <Calendar className="mr-2" size={18} />
                Notify Me of New Articles
              </Button>
              <span className="text-muted-foreground text-sm">or</span>
              <Button variant="ghost" className="px-6 py-2 text-primary hover:text-primary/80">
                Browse All Categories
              </Button>
            </div>
          </CardContent>
        </Card>
        </>
        )}
        </div>
      </div>
    </div>
  )
}
