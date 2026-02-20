import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useState } from 'react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { Sparkle, Heart, Trophy, Users, CheckCircle, MapPin, CalendarBlank, Tag, Star, Quotes, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { usePublishedTestimonials } from '../../hooks/useTestimonials'
import { useTestimonialsContent } from '../../hooks/useCmsContent'
import { renderHighlightedTitle } from '../../utils/renderHighlight'

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number; weight?: 'fill' | 'regular' }>> = {
  Trophy,
  Users,
  Heart,
  Sparkle,
}

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = usePublishedTestimonials()
  const { content: cmsContent, isLoading: cmsLoading } = useTestimonialsContent()
  usePageMetadata('testimonials')

  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE)
  const pagedTestimonials = testimonials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show loading state while fetching content
  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Get icon component by name
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Trophy
  }

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        {cmsContent.hero.backgroundImages.filter(img => img).length > 0 && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="flex gap-0 animate-scroll-left w-max h-full">
              {cmsContent.hero.backgroundImages.filter(img => img).map((img, index) => (
                <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
              ))}
              {cmsContent.hero.backgroundImages.filter(img => img).map((img, index) => (
                <img key={`bg-2-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" />
              ))}
            </div>
          </div>
        )}

        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>

        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>

        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-8">
            {cmsContent.hero.badge && (
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
                <Heart size={18} weight="fill" className="animate-pulse" />
                {cmsContent.hero.badge}
              </div>
            )}

            {cmsContent.hero.title && (
              <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
                {renderHighlightedTitle(cmsContent.hero.title)}
              </h1>
            )}

            {cmsContent.hero.description && (
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
                {cmsContent.hero.description}
              </p>
            )}

            {/* Stats - Compact inline version */}
            {cmsContent.hero.statistics.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {cmsContent.hero.statistics.map((stat, index) => (
                  <span key={index} className="text-base md:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[110px] text-center" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    <span className="font-extrabold text-transparent bg-linear-to-br from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">{stat.value}</span>{' '}
                    <span className="font-semibold text-white/95">{stat.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12 px-4 md:px-8 lg:px-12">

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-16">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-card to-card/80">
                <CardContent className="relative p-4">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-[300px] h-[300px] bg-muted rounded-lg shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-32 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-28 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-20 mb-4"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground text-lg">No testimonials available yet.</p>
            </div>
          ) : (
            pagedTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-linear-to-br from-card to-card/80">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-4">
                  {/* Float image + meta left so text wraps around it */}
                  <div className="float-left mr-4 mb-2 w-[300px] flex flex-col gap-1.5">
                    {testimonial.client_image_url ? (
                      <img
                        src={testimonial.client_image_url}
                        alt={testimonial.client_name}
                        className="w-[300px] h-auto rounded-lg object-cover shadow-lg border-2 border-primary/15"
                      />
                    ) : (
                      <div className="w-[300px] h-[300px] rounded-lg bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-lg border-2 border-primary/10">
                        <span className="text-4xl font-bold text-primary/40">{testimonial.client_name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <p className="font-semibold text-foreground text-sm leading-tight text-center">{testimonial.client_name}</p>
                    {testimonial.client_location && (
                      <div className="flex items-start gap-1 text-xs text-muted-foreground pl-[15px]">
                        <MapPin size={11} weight="fill" className="text-primary/50 shrink-0 mt-[2px]" />
                        <span>{testimonial.client_location}</span>
                      </div>
                    )}
                    {testimonial.service_name && (
                      <div className="flex items-start gap-1 text-xs text-muted-foreground pl-[15px]">
                        <Tag size={11} weight="fill" className="text-primary/50 shrink-0 mt-[2px]" />
                        <span className="font-bold">{testimonial.service_name}</span>
                      </div>
                    )}
                    {testimonial.created_at && (
                      <div className="flex items-start gap-1 text-xs text-muted-foreground pl-[15px]">
                        <CalendarBlank size={11} weight="fill" className="text-primary/50 shrink-0 mt-[2px]" />
                        <span>{new Date(testimonial.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Text flows around the float */}
                  <div className="inline-flex items-center gap-1.5 mb-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    <CheckCircle size={13} weight="fill" className="shrink-0" />
                    Verified
                  </div>
                  <p className="text-foreground leading-relaxed text-sm text-justify">{testimonial.testimonial_text}</p>
                  <div className="clear-both"></div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="gap-1"
            >
              <CaretLeft size={16} weight="bold" />
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToPage(p)}
                className={p === page ? 'bg-linear-to-r from-amber-600 to-orange-600 text-white border-0' : ''}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="gap-1"
            >
              Next
              <CaretRight size={16} weight="bold" />
            </Button>
          </div>
        )}

        {/* Share Your Experience */}
        {(cmsContent.shareExperience.title || cmsContent.shareExperience.description) && (
          <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5 mb-16">
            <CardContent className="p-8 md:p-12 text-center">
              <Heart className="mx-auto mb-6 text-primary" size={48} weight="fill" />

              {cmsContent.shareExperience.title && (
                <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.shareExperience.title}</h2>
              )}

              {cmsContent.shareExperience.description && (
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  {cmsContent.shareExperience.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {cmsContent.shareExperience.primaryButtonText && (
                  <Button size="lg" className="px-8 py-3 font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30">
                    <Quotes className="mr-2" size={20} weight="fill" />
                    {cmsContent.shareExperience.primaryButtonText}
                  </Button>
                )}
                {cmsContent.shareExperience.primaryButtonText && cmsContent.shareExperience.secondaryButtonText && (
                  <span className="text-muted-foreground text-sm hidden sm:inline">or</span>
                )}
                {cmsContent.shareExperience.secondaryButtonText && (
                  <Button size="lg" className="px-8 py-3 font-semibold bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-stone-900/50 transition-all duration-300 hover:scale-105 border-2 border-stone-600/30">
                    <Star className="mr-2" size={20} weight="fill" />
                    {cmsContent.shareExperience.secondaryButtonText}
                  </Button>
                )}
              </div>

              {(cmsContent.shareExperience.shareText || cmsContent.shareExperience.googleReviewUrl || cmsContent.shareExperience.email) && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  {cmsContent.shareExperience.shareText && (
                    <p className="text-sm text-muted-foreground mb-4">{cmsContent.shareExperience.shareText}</p>
                  )}
                  <div className="flex flex-wrap justify-center gap-4">
                    {cmsContent.shareExperience.googleReviewUrl && (
                      <a
                        href={cmsContent.shareExperience.googleReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google Reviews
                      </a>
                    )}
                    {cmsContent.shareExperience.email && (
                      <a
                        href={`mailto:${cmsContent.shareExperience.email}?subject=${encodeURIComponent(cmsContent.shareExperience.emailSubject || 'Testimonial')}`}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Quotes size={18} />
                        Email Testimonial
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Why Choose Us */}
        {(cmsContent.whyChooseUs.title || cmsContent.whyChooseUs.cards.length > 0) && (
          <div className="mb-16">
            {cmsContent.whyChooseUs.title && (
              <div className="text-center mb-12">
                <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.whyChooseUs.title}</h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
              </div>
            )}

            {cmsContent.whyChooseUs.cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cmsContent.whyChooseUs.cards.map((card, index) => {
                  const IconComponent = getIcon(card.icon)
                  const bgClasses = [
                    'bg-linear-to-br from-primary/5 to-primary/10',
                    'bg-linear-to-br from-accent/5 to-accent/10',
                    'bg-linear-to-br from-secondary/5 to-secondary/10',
                    'bg-linear-to-br from-primary/5 to-accent/5',
                  ]
                  const iconBgClasses = [
                    'bg-primary/10',
                    'bg-accent/10',
                    'bg-secondary/10',
                    'bg-primary/10',
                  ]
                  return (
                    <Card key={index} className={`border-0 shadow-lg hover:shadow-lg transition-all duration-300 ${bgClasses[index % bgClasses.length]}`}>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-lg ${iconBgClasses[index % iconBgClasses.length]}`}>
                            <IconComponent className="text-primary" size={24} weight="fill" />
                          </div>
                          <h3 className="font-heading font-semibold text-xl">{card.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {card.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
