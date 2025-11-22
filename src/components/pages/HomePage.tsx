import { Page, NavigationData } from '../../App'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { FlowerLotus, BookOpen, Heart, Users, Phone, Sparkle } from '@phosphor-icons/react'
import { services, categoryNames } from '../../lib/data'
import { usePageSEO } from '../../hooks/usePageSEO'

interface HomePageProps {
  onNavigate: (pageOrData: Page | NavigationData) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const featuredServices = services.slice(0, 6)

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
            <img 
              src="/images/South Asian Temple Complex.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/Golden Temples of Devotion.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/Traditional Altar with Marigold Flowers.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img 
              src="/images/South Asian Temple Complex.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/Golden Temples of Devotion.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/Traditional Altar with Marigold Flowers.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
            <img 
              src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" 
              alt="" 
              className="h-full w-auto object-cover opacity-40"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left side - Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110"></div>
                <img
                  src="/Raj ji.jpg"
                  alt="Pandit Rajesh Joshi"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-8 border-white/80 shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-2 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
                <FlowerLotus size={16} weight="fill" />
                Traditional Hindu Priest & Spiritual Guide
              </div>

              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8)'}}>
                Experience <span className="text-primary" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(255,255,255,0.9)'}}>Authentic</span> Hindu Ceremonies
              </h1>

              <p className="text-lg md:text-xl text-gray-900 font-semibold mb-8 leading-relaxed max-w-2xl" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7), -1px -1px 2px rgba(255,255,255,0.8)'}}>
                Discover the profound beauty of traditional Hindu rituals performed with devotion, wisdom, and centuries-old knowledge by Pandit Rajesh Joshi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" onClick={() => onNavigate('about')} className="text-base px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="mr-2" size={20} />
                  About Us
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('why-choose-us')} className="text-base px-8 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  <Sparkle className="mr-2" size={20} weight="fill" />
                  Why Choose Us
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('services')} className="text-base px-8 py-3 border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <BookOpen className="mr-2" size={20} />
                  Explore Services
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8)'}}>500+</div>
                  <div className="text-sm font-semibold text-gray-900" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.7)'}}>Poojas Performed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8)'}}>250+</div>
                  <div className="text-sm font-semibold text-gray-900" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.7)'}}>Happy Clients</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8)'}}>15+</div>
                  <div className="text-sm font-semibold text-gray-900" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.7)'}}>Years Experience</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8)'}}>5</div>
                  <div className="text-sm font-semibold text-gray-900" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.7)'}}>Books Written</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6 md:pt-10 pb-2 md:pb-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FlowerLotus size={16} weight="fill" />
              Our Sacred Services
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-4">Comprehensive Spiritual Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From birth ceremonies to final rites, we provide authentic Hindu rituals and spiritual guidance
              for every sacred moment in life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredServices.map((service, index) => (
              <Card key={service.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 hover:scale-105 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-6 flex flex-col h-full">
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

                  <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FlowerLotus size={14} className="mr-1 text-primary/60" />
                      Duration: {service.duration}
                    </div>
                    <button 
                      onClick={() => onNavigate({ page: 'services', category: service.category })}
                      className="text-primary font-medium text-sm hover:translate-x-1 transition-transform duration-300 cursor-pointer hover:text-primary/80"
                    >
                      Learn More →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => onNavigate('services')}
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="mr-2" size={20} />
              View All 40+ Services
            </Button>
          </div>
        </div>
      </section>

      {/* Sacred Spaces Gallery Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-3">
              <FlowerLotus size={16} weight="fill" />
              Sacred Spaces
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-2">Divine Temples & Sacred Altars</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Experience the beauty and serenity of traditional Hindu temples and ceremonial spaces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
                  alt="Divine Vaidyanath Temple"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Divine Vaidyanath Temple</h3>
                  <p className="text-white/80 text-xs">Sacred Hindu Architecture</p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/Golden Temples of Devotion.png"
                  alt="Golden Temples"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Golden Temples</h3>
                  <p className="text-white/80 text-xs">Places of Worship & Devotion</p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/South Asian Temple Complex.png"
                  alt="South Asian Temple Complex"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Temple Complex</h3>
                  <p className="text-white/80 text-xs">Traditional Sacred Grounds</p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/Traditional Altar with Marigold Flowers.png"
                  alt="Traditional Altar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Sacred Altar</h3>
                  <p className="text-white/80 text-xs">Adorned with Marigold Flowers</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <BookOpen className="mx-auto mb-3 text-primary" size={40} />
                <h3 className="font-heading font-semibold text-lg mb-2">Deep Knowledge</h3>
                <p className="text-muted-foreground text-sm">
                  Extensive understanding of Hindu scriptures, rituals, and traditions passed through generations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="mx-auto mb-3 text-primary" size={40} weight="fill" />
                <h3 className="font-heading font-semibold text-lg mb-2">Devotional Service</h3>
                <p className="text-muted-foreground text-sm">
                  Every ceremony performed with genuine devotion, care, and respect for sacred traditions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="mx-auto mb-3 text-primary" size={40} weight="fill" />
                <h3 className="font-heading font-semibold text-lg mb-2">Community Focused</h3>
                <p className="text-muted-foreground text-sm">
                  Dedicated to serving families and communities with accessible spiritual guidance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="font-heading font-semibold text-2xl md:text-3xl mb-4">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-muted-foreground text-base mb-6 max-w-2xl mx-auto">
            Contact us to discuss your ceremony needs or for spiritual consultation
          </p>
          <Button size="lg" onClick={() => onNavigate('contact')}>
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  )
}
