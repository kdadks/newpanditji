import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Clock, CheckCircle, Package, Star, CurrencyDollar, Info } from '@phosphor-icons/react'
import { services as defaultServices, categoryNames, Service } from '../../lib/data'
import { usePageSEO } from '../../hooks/usePageSEO'

interface ServicesPageProps {
  initialCategory?: string
}

export default function ServicesPage({ initialCategory = 'all' }: ServicesPageProps) {
  const [adminServices] = useLocalStorage<Service[]>('admin-services', defaultServices)
  const services = adminServices || defaultServices
  const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>(initialCategory as Service['category'] | 'all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // SEO Configuration
  usePageSEO({
    title: 'Hindu Poojas, Sanskars & Rituals | Professional Services in Ireland, UK, Northern Ireland',
    description: 'Complete Hindu pooja services including Lakshmi Puja, Durga Puja, Hanuman Puja, wedding ceremonies, housewarming rituals, and spiritual consultations. Serving Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu pooja services, Lakshmi puja, Durga puja, Hanuman puja, Hindu rituals, Indian pooja, pooja in Ireland, UK pooja services, Northern Ireland ceremonies, Hindu priest',
    canonicalUrl: 'https://panditrajesh.com/services'
  })

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory as Service['category'] | 'all')
    }
  }, [initialCategory])

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory)

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setIsDetailsOpen(true)
  }

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of traditional Hindu religious services, ceremonies, and spiritual guidance offerings
          </p>
        </div>

        <Tabs value={selectedCategory} className="mb-12" onValueChange={(v) => setSelectedCategory(v as Service['category'] | 'all')}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Services
            </TabsTrigger>
            <TabsTrigger value="pooja" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Poojas
            </TabsTrigger>
            <TabsTrigger value="sanskar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sanskars
            </TabsTrigger>
            <TabsTrigger value="paath" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Paath
            </TabsTrigger>
            <TabsTrigger value="consultation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Consultations
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Wellness
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <Card
              key={service.id}
              className="hover:shadow-lg transition-all hover:border-primary/30 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <CardContent className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {categoryNames[service.category]}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2" size={16} />
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found in this category.</p>
          </div>
        )}

        <section className="mt-16 pt-16 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl mb-4">Why Choose Our Services?</h2>
            <div className="space-y-4 text-left">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Authentic Traditional Knowledge</h3>
                  <p className="text-muted-foreground">
                    All ceremonies are performed according to Vedic scriptures and traditional practices, ensuring authenticity and spiritual efficacy.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Personalized Approach</h3>
                  <p className="text-muted-foreground">
                    Each service is tailored to your family's specific needs, traditions, and preferences while maintaining ritual sanctity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Educational Guidance</h3>
                  <p className="text-muted-foreground">
                    Every ritual is explained in detail, helping you understand the significance and meaning behind each sacred practice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedService && (
              <>
                <DialogHeader>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {categoryNames[selectedService.category]}
                    </span>
                  </div>
                  <DialogTitle className="font-heading text-2xl">{selectedService.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Duration and Price */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary" size={20} />
                      <span className="font-medium">{selectedService.duration}</span>
                    </div>
                    {selectedService.price && (
                      <div className="flex items-center gap-2 text-sm">
                        <CurrencyDollar className="text-primary" size={20} />
                        <span className="font-medium">
                          {!selectedService.price.includes('€') && /^\d+/.test(selectedService.price)
                            ? `€${selectedService.price}`
                            : selectedService.price}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Info className="text-primary" size={20} />
                      About This Service
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedService.detailedDescription || selectedService.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  {selectedService.benefits && selectedService.benefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Star className="text-primary" size={20} />
                        Benefits
                      </h3>
                      <ul className="space-y-2">
                        {selectedService.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What's Included */}
                  {selectedService.includes && selectedService.includes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Package className="text-primary" size={20} />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {selectedService.includes.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedService.requirements && selectedService.requirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {selectedService.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">• {req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Best For */}
                  {selectedService.bestFor && selectedService.bestFor.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Best For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.bestFor.map((item, index) => (
                          <span
                            key={index}
                            className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
