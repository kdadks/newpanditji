import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { Star, Quotes, Sparkle, Heart, Trophy, Users } from '@phosphor-icons/react'
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
  const { content: cmsContent } = useTestimonialsContent()
  usePageMetadata('testimonials')

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 overflow-hidden">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-card to-card/80">
                <CardContent className="relative p-6">
                  <div className="animate-pulse">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-muted rounded"></div>
                      ))}
                    </div>
                    <div className="h-20 bg-muted rounded mb-6"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-8"></div>
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
            testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-linear-to-br from-card to-card/80 hover:scale-102 cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardContent className="relative p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-primary/20">
                    <Quotes size={24} weight="fill" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight="fill" className={i < (testimonial.rating || 5) ? "text-accent" : "text-muted"} />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-foreground mb-6 leading-relaxed italic text-lg">
                    "{testimonial.testimonial_text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.client_name}</p>
                      {testimonial.service_name && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {testimonial.service_name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-primary/60 text-lg font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute bottom-4 left-4 text-primary/10">
                    <Sparkle size={20} weight="fill" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
