import { useState } from 'react'
import { Page, NavigationData } from '../../App'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { FlowerLotus, BookOpen, Heart, Users, Sparkle } from '@phosphor-icons/react'
import { services, categoryNames, Service } from '../../lib/data'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useServices } from '../../hooks/useServices'
import { useHomeContent } from '../../hooks/useCmsContent'

interface HomePageProps {
  onNavigate: (pageOrData: Page | NavigationData) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { services: dbServices } = useServices()
  // Use database services if available, otherwise fall back to defaults
  const allServices = (dbServices && dbServices.length > 0) ? dbServices : services
  const featuredServices = allServices.slice(0, 12) // Get more services for the carousel
  
  // CMS Content from database
  const { content: cmsContent, isLoading: cmsLoading } = useHomeContent()
  
  // Service carousel pause state on hover
  const [isPaused, setIsPaused] = useState(false)

  // SEO Configuration
  usePageSEO({
    title: 'Hindu Pooja & Rituals in Ireland | Expert Ceremonies & Spiritual Guidance',
    description: 'Professional Hindu pooja services, rituals, and spiritual guidance in Ireland, UK, and Northern Ireland. Authentic ceremonies by Pandit Rajesh Joshi. 15+ years experience.',
    keywords: 'Hindu pooja, Hindu ritual, Indian pooja, pooja in Ireland, Hindu priest Ireland, Hindu ceremonies, Lakshmi puja, Durga puja, Hindu priest UK, Northern Ireland pooja',
    canonicalUrl: 'https://panditrajesh.com/'
  })

  return (
    <div className="w-full">
      <section className="relative pt-8 md:pt-12 pb-6 md:pb-8 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img 
                key={`bg-1-${index}`}
                src={img} 
                alt="" 
                className="h-full w-auto object-cover opacity-40"
              />
            ))}
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img 
                key={`bg-2-${index}`}
                src={img} 
                alt="" 
                className="h-full w-auto object-cover opacity-40"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left side - Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110"></div>
                <img
                  src={cmsContent.hero.profileImage}
                  alt="Pandit Rajesh Joshi"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300"
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
              <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
                <FlowerLotus size={16} weight="fill" />
                {cmsContent.hero.subtitle}
              </div>

              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {cmsContent.hero.title.split(' ').map((word, i) => 
                  word.toLowerCase() === 'authentic' ? (
                    <span key={i} className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h1>

              <p className="text-lg md:text-xl text-white/95 font-medium mb-4 leading-relaxed max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {cmsContent.hero.description}
              </p>

              {/* Statistics - Compact inline version */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-6">
                {cmsContent.hero.statistics.map((stat, index) => (
                  <span key={index}>
                    {index > 0 && <span className="text-white/50 mr-6">•</span>}
                    <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      <span className="font-bold text-amber-400">{stat.value}</span> {stat.label}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {cmsContent.hero.ctaButtons.map((btn, index) => (
                  <Button 
                    key={index}
                    size="lg" 
                    variant={btn.variant === 'primary' ? 'default' : 'outline'}
                    onClick={() => onNavigate(btn.link.replace('/', '') as Page || 'home')} 
                    className={`text-base px-8 py-3 ${btn.variant === 'primary' ? 'shadow-lg hover:shadow-xl' : 'border-2 hover:bg-primary hover:text-primary-foreground'} transition-all duration-300`}
                  >
                    {index === 0 && <Users className="mr-2" size={20} />}
                    {index === 1 && <Sparkle className="mr-2" size={20} weight="fill" />}
                    {index === 2 && <BookOpen className="mr-2" size={20} />}
                    {btn.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Rolling Photo Gallery - Between Hero and Services */}
      <div className="relative w-full h-48 md:h-64 z-20 overflow-hidden">
        <div className="absolute inset-0 flex gap-4">
          <div className="flex gap-4 animate-scroll-left">
            {cmsContent.photoGallery.images.map((img, index) => (
              <img key={`gallery-1-${index}`} src={img} alt="Sacred Ceremony" className="h-48 md:h-64 w-auto object-cover rounded-lg shadow-2xl" />
            ))}
          </div>
          <div className="flex gap-4 animate-scroll-left" aria-hidden="true">
            {cmsContent.photoGallery.images.map((img, index) => (
              <img key={`gallery-2-${index}`} src={img} alt="" className="h-48 md:h-64 w-auto object-cover rounded-lg shadow-2xl" />
            ))}
          </div>
        </div>
      </div>

      <section className="pt-12 md:pt-16 pb-2 md:pb-4 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FlowerLotus size={16} weight="fill" />
              {cmsContent.services.badge}
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-4">{cmsContent.services.title}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {cmsContent.services.description}
            </p>
          </div>
        </div>

        {/* Rolling Services Carousel */}
        <div 
          className="relative w-full overflow-x-auto md:overflow-hidden py-4 scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className={`flex gap-6 px-4 md:px-0 ${isPaused ? '' : 'md:animate-scroll-services'}`}>
            {/* First set of cards */}
            {featuredServices.map((service, index) => (
              <Card 
                key={`${service.id}-1`}
                onClick={() => onNavigate({ page: 'services', category: service.category })}
                className="group relative shrink-0 w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-card to-card/80 hover:scale-105 cursor-pointer"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-6 flex flex-col h-full min-h-[280px]">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {categoryNames[service.category]}
                    </span>
                    <div className="text-primary/60 text-lg font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed grow line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FlowerLotus size={14} className="mr-1 text-primary/60" />
                      Duration: {service.duration}
                    </div>
                    <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Duplicate set for seamless loop */}
            {featuredServices.map((service, index) => (
              <Card 
                key={`${service.id}-2`}
                onClick={() => onNavigate({ page: 'services', category: service.category })}
                className="group relative shrink-0 w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-card to-card/80 hover:scale-105 cursor-pointer"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-6 flex flex-col h-full min-h-[280px]">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {categoryNames[service.category]}
                    </span>
                    <div className="text-primary/60 text-lg font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed grow line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FlowerLotus size={14} className="mr-1 text-primary/60" />
                      Duration: {service.duration}
                    </div>
                    <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mt-8">
            <Button
              onClick={() => onNavigate('services')}
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="mr-2" size={20} />
              {cmsContent.services.buttonText}
            </Button>
          </div>
        </div>
      </section>

      {/* Sacred Spaces Gallery Section */}
      <section className="py-8 md:py-12 bg-linear-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-3">
              <FlowerLotus size={16} weight="fill" />
              {cmsContent.sacredSpaces.badge}
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-2">{cmsContent.sacredSpaces.title}</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              {cmsContent.sacredSpaces.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cmsContent.sacredSpaces.spaces.map((space, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{space.title}</h3>
                    <p className="text-white/80 text-xs">{space.subtitle}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cmsContent.featureCards.map((card, index) => {
              // Icon mapping for feature cards
              const iconMap: Record<string, React.ReactNode> = {
                'BookOpen': <BookOpen className="mx-auto mb-3 text-primary" size={40} />,
                'Heart': <Heart className="mx-auto mb-3 text-primary" size={40} weight="fill" />,
                'Users': <Users className="mx-auto mb-3 text-primary" size={40} weight="fill" />
              }
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    {iconMap[card.icon] || <FlowerLotus className="mx-auto mb-3 text-primary" size={40} weight="fill" />}
                    <h3 className="font-heading font-semibold text-lg mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="font-heading font-semibold text-2xl md:text-3xl mb-4">{cmsContent.ctaSection.title}</h2>
          <p className="text-muted-foreground text-base mb-6 max-w-2xl mx-auto">
            {cmsContent.ctaSection.description}
          </p>
          <Button size="lg" onClick={() => onNavigate('contact')}>
            {cmsContent.ctaSection.ctaButtons[0]?.text || 'Get in Touch'}
          </Button>
        </div>
      </section>
    </div>
  )
}
