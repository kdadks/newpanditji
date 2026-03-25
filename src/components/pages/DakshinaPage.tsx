'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sanitizeHTML } from '../../utils/sanitize'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { FlowerLotus, CurrencyDollar, Heart, Sparkle, CheckCircle, HandHeart, ArrowRight, Images, YoutubeLogo, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useDakshinaContent } from '../../hooks/useCmsContent'
import { AppPage } from '../../lib/types'
import { renderHighlightedTitle, stripHighlightTags } from '../../utils/renderHighlight'

interface DakshinaPageProps {
}

const FAQ_BG_COLORS = [
  '#EFF6FF', // sky blue
  '#F0FFF4', // mint green
]

export default function DakshinaPage({ }: DakshinaPageProps) {
  const router = useRouter()
  const [faqOpenItems, setFaqOpenItems] = useState<string[]>([])
  const photoScrollRef = useRef<HTMLDivElement>(null)
  const videoScrollRef = useRef<HTMLDivElement>(null)
  const [photoCanScrollLeft, setPhotoCanScrollLeft] = useState(false)
  const [photoCanScrollRight, setPhotoCanScrollRight] = useState(false)
  const [videoCanScrollLeft, setVideoCanScrollLeft] = useState(false)
  const [videoCanScrollRight, setVideoCanScrollRight] = useState(false)

  const updateScrollState = (
    el: HTMLDivElement,
    setLeft: (v: boolean) => void,
    setRight: (v: boolean) => void
  ) => {
    setLeft(el.scrollLeft > 4)
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  const handleNavigate = (page: AppPage) => {
    router.push(page === 'home' ? '/' : `/${page}`)
  }

  const { content: cmsContent, isLoading: cmsLoading } = useDakshinaContent()

  // Re-check scroll state whenever content loads/changes
  useEffect(() => {
    requestAnimationFrame(() => {
      if (photoScrollRef.current)
        updateScrollState(photoScrollRef.current, setPhotoCanScrollLeft, setPhotoCanScrollRight)
      if (videoScrollRef.current)
        updateScrollState(videoScrollRef.current, setVideoCanScrollLeft, setVideoCanScrollRight)
    })
  }, [cmsContent])

  // Attach ongoing scroll listeners
  useEffect(() => {
    const photoEl = photoScrollRef.current
    if (photoEl) {
      const handler = () => updateScrollState(photoEl, setPhotoCanScrollLeft, setPhotoCanScrollRight)
      photoEl.addEventListener('scroll', handler, { passive: true })
      return () => photoEl.removeEventListener('scroll', handler)
    }
  }, [cmsContent])

  useEffect(() => {
    const videoEl = videoScrollRef.current
    if (videoEl) {
      const handler = () => updateScrollState(videoEl, setVideoCanScrollLeft, setVideoCanScrollRight)
      videoEl.addEventListener('scroll', handler, { passive: true })
      return () => videoEl.removeEventListener('scroll', handler)
    }
  }, [cmsContent])


  // SEO Configuration
  usePageMetadata('dakshina')

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

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-8 md:pt-16 pb-6 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-1-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-2-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            ))}
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <CurrencyDollar size={18} weight="fill" className="animate-pulse" />
              {cmsContent.hero.subtitle}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {renderHighlightedTitle(cmsContent.hero.title)}
            </h1>

            <p className="text-lg md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {cmsContent.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-16 px-4 md:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">

        {/* What is Dakshina Section */}
        <Card className="mb-12 md:mb-16 border-0 shadow-2xl bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-hidden">
          <CardContent className="p-6 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-linear-to-br from-primary to-accent rounded-2xl shadow-xl">
                <FlowerLotus className="text-white" size={32} weight="fill" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl md:text-4xl">{cmsContent.whatIsDakshina.title}</h2>
                <p className="text-muted-foreground mt-1">{cmsContent.whatIsDakshina.subtitle}</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-base md:text-lg leading-relaxed text-muted-foreground space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(cmsContent.whatIsDakshina.content) }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
              {cmsContent.whatIsDakshina.keyPoints.map((point, index) => (
                <div key={index} className="bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 rounded-xl border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0 mt-1" weight="fill" />
                    <div>
                      <h3 className="font-semibold text-base md:text-lg mb-2">{point.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dakshina Guideline Header */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-bold mb-6">
            <Sparkle size={18} weight="fill" />
            {cmsContent.pricingSection.badge}
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">{cmsContent.pricingSection.title}</h2>
          <div
            className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto prose prose-sm dark:prose-invert text-left"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(cmsContent.pricingSection.description || '') }}
          />
        </div>

        {/* Photos Section */}
        {cmsContent.photosSection?.enabled && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 md:p-3 bg-linear-to-br from-primary to-accent rounded-2xl shadow-xl">
                <Images className="text-white" size={22} weight="fill" />
              </div>
              <h2 className="font-heading font-bold text-xl md:text-3xl">
                {cmsContent.photosSection.sectionTitle || 'Pooja Vedi Setup'}
              </h2>
            </div>
            {cmsContent.photosSection.photos.length > 0 ? (
              <div className="relative">
                {/* Left button */}
                <button
                  onClick={() => scrollCarousel(photoScrollRef, 'left')}
                  aria-label="Scroll photos left"
                  style={{ backgroundColor: '#111827' }}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white hover:opacity-80 transition-opacity duration-200 shadow-xl ${photoCanScrollLeft ? 'flex' : 'hidden'}`}
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                {/* Scroll container */}
                <div
                  ref={photoScrollRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                >
                  {cmsContent.photosSection.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="shrink-0 snap-start w-72 rounded-2xl overflow-hidden border border-primary/10 bg-card"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || cmsContent.photosSection.sectionTitle}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {photo.caption && (
                        <div className="px-3 py-2.5 md:px-4 md:py-3">
                          <p className="text-xs md:text-sm text-muted-foreground font-medium text-center">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Right button */}
                <button
                  onClick={() => scrollCarousel(photoScrollRef, 'right')}
                  aria-label="Scroll photos right"
                  style={{ backgroundColor: '#111827' }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white hover:opacity-80 transition-opacity duration-200 shadow-xl ${photoCanScrollRight ? 'flex' : 'hidden'}`}
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Photos will appear here once added via the admin panel.</p>
            )}
          </div>
        )}

        {/* Videos Section */}
        {cmsContent.videosSection?.enabled && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 md:p-3 bg-linear-to-br from-red-500 to-red-700 rounded-2xl shadow-xl">
                <YoutubeLogo className="text-white" size={22} weight="fill" />
              </div>
              <h2 className="font-heading font-bold text-xl md:text-3xl">
                {cmsContent.videosSection.sectionTitle || 'Pooja Setup Videos'}
              </h2>
            </div>
            {cmsContent.videosSection.videos.length > 0 ? (
              <div className="relative">
                {/* Left button */}
                <button
                  onClick={() => scrollCarousel(videoScrollRef, 'left')}
                  aria-label="Scroll videos left"
                  style={{ backgroundColor: '#111827' }}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white hover:opacity-80 transition-opacity duration-200 shadow-xl ${videoCanScrollLeft ? 'flex' : 'hidden'}`}
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                {/* Scroll container */}
                <div
                  ref={videoScrollRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                >
                  {cmsContent.videosSection.videos.map((video) => {
                    const videoId = video.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&\s]+)/)?.[1]
                    return (
                      <div
                        key={video.id}
                        className="shrink-0 snap-start w-80 rounded-2xl overflow-hidden border border-red-200 dark:border-red-900 bg-card"
                      >
                        {videoId ? (
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title || 'Pooja Video'}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              loading="lazy"
                              className="absolute inset-0 w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-muted flex items-center justify-center">
                            <YoutubeLogo size={40} className="text-muted-foreground" />
                          </div>
                        )}
                        {video.title && (
                          <div className="px-3 py-2.5 md:px-4 md:py-3">
                            <p className="text-xs md:text-sm font-semibold text-center">{video.title}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* Right button */}
                <button
                  onClick={() => scrollCarousel(videoScrollRef, 'right')}
                  aria-label="Scroll videos right"
                  style={{ backgroundColor: '#111827' }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white hover:opacity-80 transition-opacity duration-200 shadow-xl ${videoCanScrollRight ? 'flex' : 'hidden'}`}
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Videos will appear here once added via the admin panel.</p>
            )}
          </div>
        )}

        {/* Pricing Table */}
        <div className="mb-12 md:mb-16">

          {/* Pricing Table - Desktop */}
          <div className="hidden md:block overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-primary via-accent to-primary text-white">
                    <th className="px-4 md:px-6 py-4 md:py-5 text-left font-bold text-base md:text-lg border-r border-white/30 w-2/5 min-w-[280px]">{cmsContent.pricingSection.columnHeaders?.col1 || 'Service/Package'}</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 text-left font-bold text-base md:text-lg border-r border-white/30">{cmsContent.pricingSection.columnHeaders?.col2 || 'Pooja Duration'}</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 text-left font-bold text-base md:text-lg border-r border-white/30">{cmsContent.pricingSection.columnHeaders?.col3 || 'Preparation Time'}</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 text-left font-bold text-base md:text-lg border-r border-white/30">{cmsContent.pricingSection.columnHeaders?.col4 || 'Total Engagement Time'}</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 text-right font-bold text-base md:text-lg">{cmsContent.pricingSection.columnHeaders?.col5 || 'Dakshina'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {cmsContent.pricingSection.services.map((service, index) => (
                    <tr
                      key={index}
                      className="hover:bg-linear-to-r hover:from-primary/5 hover:to-accent/5 transition-colors duration-200 group"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5 border-r border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <FlowerLotus size={20} className="text-primary" weight="duotone" />
                          </div>
                          <div>
                            <div className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                              {service.name}
                            </div>
                            {service.description && (
                              <div
                                className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 border-r border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-muted-foreground whitespace-normal">
                          {service.poojaTime || '—'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 border-r border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-muted-foreground whitespace-normal">
                          {service.preparationTime || '—'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 border-r border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-muted-foreground whitespace-normal">
                          {service.totalEngagementTime || '—'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                        {service.priceNote && (
                          <div className="text-xs text-muted-foreground mb-1">{service.priceNote}</div>
                        )}
                        <div className="font-bold text-xl text-primary">
                          {service.price}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {cmsContent.pricingSection.services.map((service, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FlowerLotus size={20} className="text-primary" weight="duotone" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base mb-1 text-primary">
                        {service.name}
                      </div>
                      {service.description && (
                        <div
                          className="text-sm text-muted-foreground mb-2 prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    {service.poojaTime && (
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">{cmsContent.pricingSection.columnHeaders?.col2 || 'Pooja Duration'}</div>
                        <div>{service.poojaTime}</div>
                      </div>
                    )}
                    {service.preparationTime && (
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">{cmsContent.pricingSection.columnHeaders?.col3 || 'Preparation Time'}</div>
                        <div>{service.preparationTime}</div>
                      </div>
                    )}
                    {service.totalEngagementTime && (
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground font-medium">{cmsContent.pricingSection.columnHeaders?.col4 || 'Total Engagement Time'}</div>
                        <div>{service.totalEngagementTime}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="text-sm text-muted-foreground">{cmsContent.pricingSection.columnHeaders?.col5 || 'Dakshina'}</div>
                    <div className="text-right">
                      {service.priceNote && (
                        <div className="text-xs text-muted-foreground mb-1">{service.priceNote}</div>
                      )}
                      <div className="font-bold text-xl text-primary">
                        {service.price}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          {cmsContent.pricingSection.faqs && cmsContent.pricingSection.faqs.length > 0 && (
            <div className="mt-8 rounded-lg border border-border/40 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b bg-linear-to-r from-amber-500/10 to-amber-50/30 dark:to-amber-950/20">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-amber-500 rounded-full shrink-0" />
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFaqOpenItems(cmsContent.pricingSection.faqs!.map((_, i) => `faq-${i}`))}
                    className="text-xs text-amber-600 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                  >
                    Expand All
                  </button>
                  <span className="text-border">|</span>
                  <button
                    onClick={() => setFaqOpenItems([])}
                    className="text-xs text-amber-600 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
              <div className="py-0">
                <Accordion type="multiple" value={faqOpenItems} onValueChange={setFaqOpenItems} className="space-y-0">
                  {cmsContent.pricingSection.faqs.map((faq, i) => (
                    <AccordionItem
                      key={faq.id || i}
                      value={`faq-${i}`}
                      className="border-b border-border/60 last:border-b-0 px-5 transition-colors"
                      style={{ backgroundColor: FAQ_BG_COLORS[i % FAQ_BG_COLORS.length] }}
                    >
                      <AccordionTrigger className="text-base font-bold text-foreground py-2.5 hover:no-underline text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(faq.answer) }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-linear-to-r from-primary to-accent text-white overflow-hidden">
          <CardContent className="p-5 md:p-7">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <HandHeart size={28} className="text-white/80 shrink-0" weight="fill" />
                <div>
                  <p className="font-heading font-bold text-lg md:text-xl leading-tight">{cmsContent.ctaSection.title}</p>
                  {cmsContent.ctaSection.description && (
                    <p className="text-white/80 text-sm mt-0.5">{cmsContent.ctaSection.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleNavigate('contact')}
                  className="font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-200 hover:scale-105"
                >
                  <Heart className="mr-1.5" size={16} weight="fill" />
                  {cmsContent.ctaSection.primaryButtonText}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNavigate('services')}
                  className="font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  {cmsContent.ctaSection.secondaryButtonText}
                  <ArrowRight className="ml-1.5" size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  )
}
