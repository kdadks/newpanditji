'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FlowerLotus, Book, GraduationCap, Heart, Users, Trophy, Sparkle, Pencil, Briefcase, HandHeart, Lightbulb, MedalMilitary, BookOpen, Atom, ArrowRight, ChatCircleDots } from '@phosphor-icons/react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useAboutContent } from '../../hooks/useCmsContent'
import { AppPage } from '../../lib/types'

interface AboutPageProps {
}

export default function AboutPage({ }: AboutPageProps) {
  const router = useRouter()

  const handleNavigate = (page: AppPage) => {
    router.push(page === 'home' ? '/' : `/${page}`)
  }
  // CMS Content
  const { content: cmsContent } = useAboutContent()

  // SEO Configuration
  usePageMetadata('about')

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-2-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-amber-300/30 to-orange-300/30 rounded-full blur-2xl scale-110"></div>
                <img
                  src={cmsContent.profileImage}
                  alt="Pandit Rajesh Joshi"
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                  loading="eager"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-2 lg:order-2 text-center lg:text-left">
              <div className="flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
                <FlowerLotus size={18} weight="fill" className="animate-pulse" />
                {cmsContent.badge}
              </div>

              <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
                {cmsContent.hero.title} <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">{cmsContent.name}</span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-white/95 font-medium mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {cmsContent.shortBio}
              </p>

              {/* Statistics - Compact inline version */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-6">
                {cmsContent.statistics.map((stat, index) => (
                  <span key={index}>
                    {index > 0 && <span className="text-white/50 mr-6">•</span>}
                    <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      <span className="font-bold text-amber-400">{stat.value}</span> {stat.label}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => handleNavigate('books')} className="text-sm md:text-base px-6 md:px-8 py-3 font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto border-2 border-amber-700/30">
                  <BookOpen className="mr-2" size={18} weight="fill" />
                  Published Books
                </Button>
                <Button size="lg" onClick={() => handleNavigate('charity')} className="text-sm md:text-base px-6 md:px-8 py-3 font-semibold bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-stone-900/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto border-2 border-stone-600/30">
                  <HandHeart className="mr-2" size={18} weight="fill" />
                  Charity Work
                </Button>
                <Button size="lg" onClick={() => handleNavigate('testimonials')} className="text-sm md:text-base px-6 md:px-8 py-3 font-semibold bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-stone-900/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto border-2 border-stone-600/30">
                  <ChatCircleDots className="mr-2" size={18} weight="fill" />
                  Testimonials
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pt-12 md:pt-16 pb-8 md:pb-12 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">

        {/* Main Content Grid - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Spiritual Journey (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-lg bg-linear-to-br from-card to-card/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FlowerLotus className="text-primary" size={24} weight="fill" />
                  </div>
                  <h2 className="font-heading font-semibold text-2xl">{cmsContent.spiritualJourney.title}</h2>
                </div>

                <div className="space-y-5 text-muted-foreground">
                  <div 
                    className="prose prose-base max-w-none text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: cmsContent.spiritualJourney.content }}
                  />

                  {cmsContent.spiritualJourney.meditationPrograms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                      {cmsContent.spiritualJourney.meditationPrograms.map((program, index) => (
                        <Badge key={index} variant="outline" className="justify-start py-2">{program}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Combined Cards (Takes 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Areas of Interest & Expertise Card */}
            {cmsContent.expertiseAreas.length > 0 && (
              <Card className="border-0 shadow-lg bg-linear-to-br from-accent/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lightbulb className="text-primary" size={24} weight="fill" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl">Areas of Interest & Expertise</h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {cmsContent.expertiseAreas.map((area, index) => {
                      const getIcon = () => {
                        if (area.toLowerCase().includes('quantum')) return <Atom className="mr-2" size={14} />
                        if (area.toLowerCase().includes('scripture')) return <Book className="mr-2" size={14} />
                        if (area.toLowerCase().includes('history')) return <BookOpen className="mr-2" size={14} />
                        if (area.toLowerCase().includes('psychology')) return <Heart className="mr-2" size={14} weight="fill" />
                        if (area.toLowerCase().includes('poetry')) return <Pencil className="mr-2" size={14} />
                        if (area.toLowerCase().includes('yoga') || area.toLowerCase().includes('meditation')) return <FlowerLotus className="mr-2" size={14} weight="fill" />
                        if (area.toLowerCase().includes('astronomy')) return <MedalMilitary className="mr-2" size={14} />
                        if (area.toLowerCase().includes('dharma')) return <Sparkle className="mr-2" size={14} weight="fill" />
                        return <Book className="mr-2" size={14} />
                      }
                      return (
                        <Badge key={index} variant="outline" className="justify-start py-2 text-xs">
                          {getIcon()}
                          {area}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Academic Excellence Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center">
                <GraduationCap className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">{cmsContent.academicCard.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {cmsContent.academicCard.description}
                </p>
                <Badge variant="secondary" className="mt-3">{cmsContent.academicCard.badge}</Badge>
              </CardContent>
            </Card>

            {/* Irish Industrialist Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-accent/5 to-accent/10">
              <CardContent className="p-6 text-center">
                <Briefcase className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">{cmsContent.industrialistCard.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {cmsContent.industrialistCard.description}
                </p>
                <Badge variant="secondary" className="mt-3">{cmsContent.industrialistCard.badge}</Badge>
              </CardContent>
            </Card>

            {/* eYogi Gurukul Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-6 text-center">
                <HandHeart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-xl mb-3">{cmsContent.gurukulCard.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {cmsContent.gurukulCard.description}
                </p>
                <Badge variant="secondary" className="mt-3">{cmsContent.gurukulCard.badge}</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="mb-16 overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="text-primary" size={16} weight="fill" />
              {cmsContent.photoGallery.badge}
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-4">{cmsContent.photoGallery.title}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {cmsContent.photoGallery.description}
            </p>
          </div>

          {/* Rolling Gallery */}
          <div className="relative w-full h-64 md:h-80">
            <div className="absolute inset-0 flex gap-4">
              <div className="flex gap-4 animate-scroll-left">
                {cmsContent.photoGallery.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image.src} 
                    alt={image.alt} 
                    className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" 
                  />
                ))}
              </div>
              <div className="flex gap-4 animate-scroll-left" aria-hidden="true">
                {cmsContent.photoGallery.images.map((image, index) => (
                  <img 
                    key={`dup-${index}`}
                    src={image.src} 
                    alt="" 
                    className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect Section */}
        <Card className="mb-16 border-0 shadow-xl bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkle size={16} weight="fill" />
                {cmsContent.whatToExpect.badge}
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.whatToExpect.title}</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {cmsContent.whatToExpect.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsContent.whatToExpect.features.map((feature, index) => {
                const getIcon = () => {
                  if (feature.title.toLowerCase().includes('knowledge')) return <BookOpen className="text-primary" size={24} />
                  if (feature.title.toLowerCase().includes('science')) return <Atom className="text-primary" size={24} />
                  if (feature.title.toLowerCase().includes('pooja')) return <FlowerLotus className="text-primary" size={24} weight="fill" />
                  if (feature.title.toLowerCase().includes('children')) return <Users className="text-primary" size={24} weight="fill" />
                  if (feature.title.toLowerCase().includes('vedic') || feature.title.toLowerCase().includes('authentic')) return <Book className="text-primary" size={24} />
                  if (feature.title.toLowerCase().includes('motivational')) return <Lightbulb className="text-primary" size={24} weight="fill" />
                  if (feature.title.toLowerCase().includes('sacred') || feature.title.toLowerCase().includes('environment')) return <Heart className="text-primary" size={24} weight="fill" />
                  return <Sparkle className="text-primary" size={24} weight="fill" />
                }

                const getColorScheme = () => {
                  const schemes = [
                    'bg-linear-to-br from-primary/5 to-primary/10 border-primary/20',
                    'bg-linear-to-br from-accent/5 to-accent/10 border-accent/20',
                    'bg-linear-to-br from-secondary/5 to-secondary/10 border-secondary/20',
                    'bg-linear-to-br from-primary/5 to-accent/5 border-primary/20',
                    'bg-linear-to-br from-accent/5 to-secondary/5 border-accent/20',
                    'bg-linear-to-br from-secondary/5 to-primary/5 border-secondary/20',
                  ]
                  return schemes[index % schemes.length]
                }

                return (
                  <div 
                    key={index}
                    className={`${getColorScheme()} p-6 rounded-lg border ${index === cmsContent.whatToExpect.features.length - 1 && cmsContent.whatToExpect.features.length % 2 !== 0 ? 'md:col-span-2' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getIcon()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Community Service */}
        {cmsContent.communityService.services.length > 0 && (
          <Card className="border-0 shadow-xl bg-linear-to-br from-accent/5 to-primary/5">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <HandHeart size={16} weight="fill" />
                  {cmsContent.communityService.badge}
                </div>
                <h2 className="font-heading font-semibold text-2xl mb-4">{cmsContent.communityService.title}</h2>
              </div>

              <div className="space-y-6">
                {cmsContent.communityService.services.map((service, index) => (
                  <div 
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-linear-to-r from-primary/5 to-accent/5 border-primary/20' : 'bg-linear-to-r from-accent/5 to-secondary/5 border-accent/20'} p-6 rounded-lg border`}
                  >
                    <div className="flex items-start gap-4">
                      {index === 0 ? (
                        <BookOpen className="text-primary shrink-0 mt-1" size={32} />
                      ) : (
                        <Heart className="text-primary shrink-0 mt-1" size={32} weight="fill" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{service.title}</h3>
                        <p className="text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </section>
    </div>
  )
}
