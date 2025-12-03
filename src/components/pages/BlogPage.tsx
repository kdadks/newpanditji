import { usePageSEO } from '../../hooks/usePageSEO'
import { useBlogs } from '../../hooks/useBlogs'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { BookOpen, CaretRight, Calendar, User, Sparkle, CircleNotch } from '@phosphor-icons/react'
import { blogArticles as defaultBlogs } from '../../lib/data'

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  category: string
  content?: string
}

export default function BlogPage() {
  usePageSEO({
    title: 'Hindu Spirituality & Philosophy | Blog on Rituals, Traditions & Vedic Wisdom',
    description: 'Discover insights on Hindu spirituality, pooja significance, and Vedic traditions. Learn about spiritual practices and sacred rituals in modern life.',
    keywords: 'Hindu spirituality, pooja blog, spiritual practices, Vedic wisdom, Hindu traditions, spiritual guidance, ritual significance',
    canonicalUrl: 'https://panditrajesh.ie/blog'
  })

  const { blogs: dbBlogs, isLoading } = useBlogs()
  // Use database blogs if available, otherwise fall back to defaults
  const blogArticles = (dbBlogs && dbBlogs.length > 0) ? dbBlogs : defaultBlogs

  // Get unique categories (filter out undefined/null values)
  const categories = [...new Set(blogArticles.map(article => article.category).filter((c): c is string => Boolean(c)))]

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
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
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
              <Sparkle size={16} weight="fill" />
              Spiritual Wisdom & Insights
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Spiritual <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Wisdom</span> Blog
            </h1>

            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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
                        {blogArticles[0].category}
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

                    <Button className="w-fit shadow-lg hover:shadow-xl transition-all duration-300">
                      <BookOpen className="mr-2" size={18} />
                      Read Full Article
                      <CaretRight className="ml-2" size={16} />
                    </Button>
                  </div>

                  <div className="bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center p-8 lg:p-12">
                    <div className="text-center">
                      <BookOpen className="text-primary/60 mx-auto mb-4" size={80} />
                      <p className="text-primary/60 font-medium">Spiritual Wisdom</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogArticles.slice(1).map((article, index) => (
            <Card key={article.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-card to-card/80 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
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
