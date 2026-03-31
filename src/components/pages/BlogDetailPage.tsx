import { useEffect, useLayoutEffect } from 'react'
import { useBlogs } from '../../hooks/useBlogs'
import { sanitizeHTML } from '../../utils/sanitize'
import { useBlogSidebarContent } from '../../hooks/useCmsContent'
import { updateMetaTags, generateOrganizationSchema } from '../../utils/seo'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { BookOpen, Calendar, User, Sparkle, CircleNotch, ArrowLeft } from '@phosphor-icons/react'
import { Page } from '../../App'
import { buildGradientCSS, type GradientConfig } from '../admin/editors/BlogHeroStyleEditor'

interface BlogDetailPageProps {
  blogId: string
  onNavigate: (page: Page) => void
}

export default function BlogDetailPage({ blogId, onNavigate }: BlogDetailPageProps) {
  const { blogs, isLoading } = useBlogs()
  const { content: sidebarContent } = useBlogSidebarContent()
  
  // Find the blog by slug (not ID)
  const blog = blogs?.find(b => b.slug === blogId)
  
  // Apply blog-specific SEO metadata from database
  useLayoutEffect(() => {
    if (blog) {
      updateMetaTags({
        title: blog.meta_title || `${blog.title} | Spiritual Wisdom Blog`,
        description: blog.meta_description || blog.excerpt || 'Read spiritual wisdom and insights from Pandit Rajesh Joshi.',
        keywords: blog.meta_keywords ? (Array.isArray(blog.meta_keywords) ? blog.meta_keywords.join(', ') : blog.meta_keywords) : 'Hindu spirituality, pooja blog, spiritual practices, Vedic wisdom',
        ogTitle: blog.meta_title || blog.title,
        ogDescription: blog.meta_description || blog.excerpt || undefined,
        ogImage: blog.featured_image_url || undefined,
        canonicalUrl: blog.canonical_url || `https://panditrajesh.ie/blog/${blogId}`,
        schema: generateOrganizationSchema(),
        robots: 'index, follow'
      })
    }
  }, [blog, blogId])

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [blogId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleNotch className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <BookOpen className="text-muted-foreground mb-4" size={64} />
        <h1 className="font-heading text-2xl font-bold mb-2">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The blog article you're looking for doesn't exist.</p>
        <Button onClick={() => onNavigate('blog')}>
          <ArrowLeft className="mr-2" size={18} />
          Back to Blog
        </Button>
      </div>
    )
  }

  const categoryName = blog.category_name || 'Article'

  // ── Hero style helpers (global CMS setting, not per-post) ──────────────────
  const heroStyle = sidebarContent?.heroStyle
  const bgType = heroStyle?.hero_bg_type ?? 'default'
  const isDefaultBg = bgType === 'default' || !bgType

  // Compute the CSS background value for non-default types
  let heroBgStyle: React.CSSProperties = {}
  if (bgType === 'solid' && heroStyle?.hero_bg_value) {
    heroBgStyle = { background: heroStyle.hero_bg_value }
  } else if (bgType === 'gradient' && heroStyle?.hero_bg_value) {
    try {
      const cfg = JSON.parse(heroStyle.hero_bg_value) as GradientConfig
      if (cfg?.direction && Array.isArray(cfg?.stops)) {
        heroBgStyle = { background: buildGradientCSS(cfg) }
      }
    } catch {
      // fallback to default
    }
  }

  // Shadow presets map
  const SHADOW_PRESET_CSS: Record<string, string> = {
    default: '0 4px 8px rgba(0,0,0,0.9)',
    light:   '0 2px 4px rgba(0,0,0,0.5)',
    medium:  '0 3px 6px rgba(0,0,0,0.7)',
    none:    'none',
  }
  const rawShadow = heroStyle?.hero_title_shadow ?? 'default'
  const titleShadowCSS = SHADOW_PRESET_CSS[rawShadow] ?? rawShadow

  const titleColor = heroStyle?.hero_title_color ?? '#ffffff'
  const metaColor  = heroStyle?.hero_meta_color  ?? undefined  // leave undefined to use Tailwind class when null

  // Tailwind drop-shadow class used when bg is default (matches blog listing page)
  const defaultTitleShadowClass = 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'

  // Inline style for title when custom colours are set
  const titleStyle: React.CSSProperties = {
    color: titleColor,
    textShadow: isDefaultBg ? undefined : (titleShadowCSS === 'none' ? 'none' : titleShadowCSS),
  }
  const metaStyle: React.CSSProperties = metaColor ? { color: metaColor } : {}
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Hero Section with Featured Image */}
      {blog.featured_image_url ? (
        <section className="relative w-full overflow-hidden" style={isDefaultBg ? {} : heroBgStyle}>
          {/* Default sunrise background — only shown when no custom bg is set */}
          {isDefaultBg && (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <div className="flex gap-0 animate-scroll-left w-max h-full">
                  <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>
            </>
          )}
          {/* Mobile: image full width with title overlay + fixed back badge */}
          <div className="md:hidden relative z-10 h-[55vw] min-h-[220px] max-h-[360px]">
            {/* Full-bleed image */}
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Back to Blog badge — top left over image */}
            <div className="absolute top-3 left-4 z-10">
              <Badge
                onClick={() => onNavigate('blog')}
                className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 cursor-pointer transition-colors"
              >
                <ArrowLeft size={12} />
                Back to Blog
              </Badge>
            </div>

            {/* Title + category overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
              <Badge className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 mb-2">
                {categoryName}
              </Badge>
              <h1
                className={`font-heading font-bold text-xl sm:text-2xl leading-tight${isDefaultBg ? ' text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : ''}`}
                style={isDefaultBg ? {} : { ...titleStyle, textShadow: titleShadowCSS === 'none' ? 'none' : titleShadowCSS }}
              >
                {blog.title}
              </h1>
            </div>
          </div>

          {/* Meta row — below image, centered, dark theme */}
          <div className="md:hidden relative z-10 flex flex-wrap justify-center items-center gap-3 px-4 py-3 text-xs text-amber-950 bg-amber-50/60 border-b border-amber-200/60">
            <div className="flex items-center gap-1" style={metaStyle}><User size={12} /><span>Pandit Rajesh Joshi</span></div>
            {blog.reading_time_minutes && <div className="flex items-center gap-1" style={metaStyle}><BookOpen size={12} /><span>{blog.reading_time_minutes} min read</span></div>}
            {blog.published_at && <div className="flex items-center gap-1" style={metaStyle}><Calendar size={12} /><span>{new Date(blog.published_at).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>}
          </div>

          {/* Desktop: side-by-side layout */}
          <div className="hidden md:block relative z-10">
            <div className="container mx-auto max-w-7xl px-8 py-12 lg:py-16">
              {/* Desktop Back to Blog badge */}
              <div className="mb-8">
                <Badge
                  onClick={() => onNavigate('blog')}
                  className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 cursor-pointer transition-colors"
                >
                  <ArrowLeft size={12} />
                  Back to Blog
                </Badge>
              </div>

              <div className="flex items-center gap-12 lg:gap-16">
                {/* Text column */}
                <div className="flex-1 min-w-0">
                  <Badge className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 mb-5">
                    {categoryName}
                  </Badge>
                  <h1
                    className={`font-heading font-bold text-4xl lg:text-4xl xl:text-5xl leading-tight mb-6${isDefaultBg ? ` text-white ${defaultTitleShadowClass}` : ''}`}
                    style={isDefaultBg ? {} : titleStyle}
                  >
                    {blog.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2" style={isDefaultBg ? {} : metaStyle}><User size={14} /><span>Pandit Rajesh Joshi</span></div>
                    {blog.reading_time_minutes && <div className="flex items-center gap-2" style={isDefaultBg ? {} : metaStyle}><BookOpen size={14} /><span>{blog.reading_time_minutes} min read</span></div>}
                    {blog.published_at && <div className="flex items-center gap-2" style={isDefaultBg ? {} : metaStyle}><Calendar size={14} /><span>{new Date(blog.published_at).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>}
                  </div>
                </div>

                {/* Image column */}
                <div className="w-1/2 lg:w-[520px] xl:w-xl shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  <img
                    src={blog.featured_image_url}
                    alt={blog.title}
                    className="w-full aspect-3/2 object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Header without image */
        <section className="relative py-12 md:py-16 overflow-hidden" style={isDefaultBg ? {} : heroBgStyle}>
          {/* Default sunrise background — only shown when no custom bg is set */}
          {isDefaultBg && (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <div className="flex gap-0 animate-scroll-left w-max h-full">
                  <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
                  <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                  <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>
            </>
          )}
          {/* Mobile-only fixed Back to Blog badge */}
          <div className="fixed top-[60px] left-0 right-0 z-40 flex justify-start px-4 md:hidden">
            <Badge
              onClick={() => onNavigate('blog')}
              className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 cursor-pointer transition-colors"
            >
              <ArrowLeft size={12} />
              Back to Blog
            </Badge>
          </div>
          <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-10 md:pt-0 relative z-10">
            <div className="hidden md:flex justify-start mb-6">
              <Badge
                onClick={() => onNavigate('blog')}
                className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 cursor-pointer transition-colors"
              >
                <ArrowLeft size={12} />
                Back to Blog
              </Badge>
            </div>
            
            <Badge className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm mb-4">
              {categoryName}
            </Badge>
            
            <h1
              className={`font-heading font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-5xl mb-6${isDefaultBg ? ` text-white ${defaultTitleShadowClass}` : ''}`}
              style={isDefaultBg ? {} : titleStyle}
            >
              {blog.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4">
              <div className={`flex items-center gap-2${isDefaultBg ? ' text-amber-200/80' : ''}`} style={isDefaultBg ? {} : metaStyle}>
                <User size={16} />
                <span>Pandit Rajesh Joshi</span>
              </div>
              {blog.reading_time_minutes && (
                <div className={`flex items-center gap-2${isDefaultBg ? ' text-amber-200/80' : ''}`} style={isDefaultBg ? {} : metaStyle}>
                  <BookOpen size={16} />
                  <span>{blog.reading_time_minutes} min read</span>
                </div>
              )}
              {blog.published_at && (
                <div className={`flex items-center gap-2${isDefaultBg ? ' text-amber-200/80' : ''}`} style={isDefaultBg ? {} : metaStyle}>
                  <Calendar size={16} />
                  <span>{new Date(blog.published_at).toLocaleDateString('en-IE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Excerpt/Summary */}
              <div className="mb-10">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 italic">
                  {blog.excerpt}
                </p>
              </div>

              {/* Full Content */}
              {blog.content ? (
                <article 
                  className="blog-content prose prose-lg md:prose-xl max-w-none
                    prose-headings:font-heading prose-headings:text-foreground
                    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4
                    prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-6
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:text-muted-foreground prose-li:text-base prose-li:md:text-lg prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-8
                    prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:rounded-xl prose-pre:p-6
                    prose-hr:my-12 prose-hr:border-border"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content) }}
                />
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-xl">
                  <BookOpen className="mx-auto mb-6 text-primary/60" size={64} />
                  <h3 className="font-heading font-semibold text-2xl mb-3">Full Article Coming Soon</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    The complete content for this article is being prepared. Please check back soon for the full wisdom and insights.
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('blog')}
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Back to All Articles
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkle size={18} className="text-primary" />
                  <span className="italic">May this wisdom guide your spiritual journey</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Author Card — only render when DB has content */}
                {sidebarContent.authorCard.name && (
                <div className="bg-card rounded-xl p-6 shadow-lg border">
                  <h3 className="font-heading font-semibold text-lg mb-4">{sidebarContent.authorCard.title}</h3>
                  <div className="flex items-start gap-4">
                    {sidebarContent.authorCard.image && (
                      <img 
                        src={sidebarContent.authorCard.image} 
                        alt={sidebarContent.authorCard.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    )}
                    <div>
                      <p className="font-medium">{sidebarContent.authorCard.name}</p>
                      {sidebarContent.authorCard.role && (
                        <p className="text-sm text-muted-foreground">{sidebarContent.authorCard.role}</p>
                      )}
                    </div>
                  </div>
                  {sidebarContent.authorCard.bio && (
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {sidebarContent.authorCard.bio}
                    </p>
                  )}
                </div>
                )}

                {/* Guidance Card — only render when DB has content */}
                {sidebarContent.guidanceCard.title && (
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">{sidebarContent.guidanceCard.title}</h3>
                  {sidebarContent.guidanceCard.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {sidebarContent.guidanceCard.description}
                    </p>
                  )}
                  {sidebarContent.guidanceCard.ctaButtons.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {sidebarContent.guidanceCard.ctaButtons.map((btn, index) => (
                        <Button
                          key={index}
                          className="w-full"
                          onClick={() => {
                            if (btn.link.startsWith('http')) {
                              window.open(btn.link, '_blank', 'noopener,noreferrer')
                            } else {
                              const page = btn.link.replace(/^\//, '') as Page
                              onNavigate(page)
                            }
                          }}
                        >
                          {btn.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
