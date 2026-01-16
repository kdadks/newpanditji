'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FlowerLotus, CurrencyDollar, Heart, Sparkle, CheckCircle, Info, HandHeart, GraduationCap, ArrowRight } from '@phosphor-icons/react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useDakshinaContent } from '../../hooks/useCmsContent'
import { AppPage } from '../../lib/types'
import { renderHighlightedTitle, stripHighlightTags } from '../../utils/renderHighlight'

interface DakshinaPageProps {
}

export default function DakshinaPage({ }: DakshinaPageProps) {
  const router = useRouter()

  const handleNavigate = (page: AppPage) => {
    router.push(page === 'home' ? '/' : `/${page}`)
  }
  // CMS Content
  const { content: cmsContent } = useDakshinaContent()

  // SEO Configuration
  usePageMetadata('dakshina')

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
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

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {renderHighlightedTitle(cmsContent.hero.title)}
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {cmsContent.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">

        {/* What is Dakshina Section */}
        <Card className="mb-16 border-0 shadow-2xl bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-linear-to-br from-primary to-accent rounded-2xl shadow-xl">
                <FlowerLotus className="text-white" size={32} weight="fill" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl">{cmsContent.whatIsDakshina.title}</h2>
                <p className="text-muted-foreground mt-1">{cmsContent.whatIsDakshina.subtitle}</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-base md:text-lg leading-relaxed text-muted-foreground space-y-4"
                dangerouslySetInnerHTML={{ __html: cmsContent.whatIsDakshina.content }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {cmsContent.whatIsDakshina.keyPoints.map((point, index) => (
                <div key={index} className="bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-primary shrink-0 mt-1" weight="fill" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-bold mb-6">
              <Sparkle size={18} weight="fill" />
              {cmsContent.pricingSection.badge}
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">{cmsContent.pricingSection.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {cmsContent.pricingSection.description}
            </p>
          </div>

          {/* Pricing Table */}
          <div className="overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-primary via-accent to-primary text-white">
                    <th className="px-6 py-5 text-left font-bold text-lg">Service/Package Name</th>
                    <th className="px-6 py-5 text-left font-bold text-lg hidden md:table-cell">Duration</th>
                    <th className="px-6 py-5 text-right font-bold text-lg">Dakshina</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {cmsContent.pricingSection.services.map((service, index) => (
                    <tr
                      key={index}
                      className="hover:bg-linear-to-r hover:from-primary/5 hover:to-accent/5 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <FlowerLotus size={20} className="text-primary" weight="duotone" />
                          </div>
                          <div>
                            <div className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                              {service.name}
                            </div>
                            {service.description && (
                              <div className="text-sm text-muted-foreground">{service.description}</div>
                            )}
                            {service.duration && (
                              <div className="text-xs text-muted-foreground mt-1 md:hidden flex items-center gap-1">
                                <CheckCircle size={12} weight="fill" />
                                {service.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <Badge variant="outline" className="text-sm">
                          {service.duration || 'Varies'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-bold text-xl text-primary">
                          €{service.price}
                        </div>
                        {service.priceNote && (
                          <div className="text-xs text-muted-foreground mt-1">{service.priceNote}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Notes */}
          {cmsContent.pricingSection.notes && cmsContent.pricingSection.notes.length > 0 && (
            <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-1" weight="fill" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                    {cmsContent.pricingSection.notes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle size={16} weight="fill" className="shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-2xl bg-linear-to-br from-primary via-accent to-secondary text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
          <CardContent className="p-12 md:p-16 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HandHeart size={40} className="text-white" weight="fill" />
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              {cmsContent.ctaSection.title}
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {cmsContent.ctaSection.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleNavigate('contact')}
                className="font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30 text-lg px-8 py-6"
              >
                <Heart className="mr-2" size={24} weight="fill" />
                {cmsContent.ctaSection.primaryButtonText}
              </Button>
              <Button
                size="lg"
                onClick={() => handleNavigate('services')}
                className="font-semibold bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-stone-900/50 transition-all duration-300 hover:scale-105 border-2 border-stone-600/30 text-lg px-8 py-6"
              >
                <GraduationCap className="mr-2" size={24} weight="duotone" />
                {cmsContent.ctaSection.secondaryButtonText}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  )
}
