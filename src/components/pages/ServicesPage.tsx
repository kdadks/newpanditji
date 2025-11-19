import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Clock } from '@phosphor-icons/react'
import { services as defaultServices, categoryNames, Service } from '../../lib/data'

export default function ServicesPage() {
  const [adminServices] = useKV<Service[]>('admin-services', defaultServices)
  const services = adminServices || defaultServices
  const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>('all')

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of traditional Hindu religious services, ceremonies, and spiritual guidance offerings
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12" onValueChange={(v) => setSelectedCategory(v as Service['category'] | 'all')}>
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
            <Card key={service.id} className="hover:shadow-lg transition-all hover:border-primary/30 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {categoryNames[service.category]}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <div className="flex items-center text-sm text-muted-foreground pt-3 border-t border-border">
                  <Clock className="mr-2" size={16} />
                  <span className="font-medium">{service.duration}</span>
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
      </div>
    </div>
  )
}
