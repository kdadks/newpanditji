import { Page } from '../../App'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { FlowerLotus, BookOpen, Heart, Users, Phone } from '@phosphor-icons/react'
import { services, categoryNames } from '../../lib/data'

interface HomePageProps {
  onNavigate: (page: Page) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const featuredServices = services.slice(0, 6)

  return (
    <div className="w-full">
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <FlowerLotus className="mx-auto mb-6 text-primary" size={64} weight="fill" />
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
              Welcome to Traditional Hindu Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience authentic Hindu ceremonies, spiritual guidance, and sacred rituals performed with devotion and traditional knowledge by Pandit Rajesh Joshi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => onNavigate('services')} className="text-base">
                Explore Services
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('contact')} className="text-base">
                <Phone className="mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive religious and spiritual services for all of life's sacred moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredServices.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-all hover:border-accent/50">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {categoryNames[service.category]}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">Duration: {service.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => onNavigate('services')} variant="outline" size="lg">
              View All 40+ Services
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <BookOpen className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-2">Deep Knowledge</h3>
                <p className="text-muted-foreground">
                  Extensive understanding of Hindu scriptures, rituals, and traditions passed through generations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Heart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-xl mb-2">Devotional Service</h3>
                <p className="text-muted-foreground">
                  Every ceremony performed with genuine devotion, care, and respect for sacred traditions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-xl mb-2">Community Focused</h3>
                <p className="text-muted-foreground">
                  Dedicated to serving families and communities with accessible spiritual guidance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-6">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
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
