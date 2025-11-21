import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Clock, CheckCircle, Package, Star, CurrencyDollar, Info, BookOpen, FlowerLotus, Calendar, MapPin, Heart, Users, Sparkle, FilePdf, FileDoc, DownloadSimple, Printer } from '@phosphor-icons/react'
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
                <div
                  className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
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
          <DialogContent className="max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
            {selectedService && (
              <>
                <DialogHeader>
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categoryNames[selectedService.category]}
                    </Badge>
                  </div>
                  <DialogTitle className="font-heading text-3xl mb-2">{selectedService.name}</DialogTitle>
                  <div
                    className="text-muted-foreground text-base prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedService.description }}
                  />
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Quick Info Bar */}
                  <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
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
                    {selectedService.samagriFile && (
                      <div className="flex-1 flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = `data:${selectedService.samagriFile!.type};base64,${selectedService.samagriFile!.data}`
                            link.download = selectedService.samagriFile!.name
                            link.click()
                          }}
                          className="gap-2"
                        >
                          <DownloadSimple size={16} weight="bold" />
                          Download Samagri List
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const blob = new Blob(
                              [Uint8Array.from(atob(selectedService.samagriFile!.data), c => c.charCodeAt(0))],
                              { type: selectedService.samagriFile!.type }
                            )
                            const url = URL.createObjectURL(blob)
                            const printWindow = window.open(url, '_blank')
                            if (printWindow) {
                              printWindow.onload = () => {
                                printWindow.print()
                              }
                            }
                          }}
                          className="gap-2"
                        >
                          <Printer size={16} weight="bold" />
                          Print
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Deity Information */}
                  {selectedService.details?.deity && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <FlowerLotus className="text-primary flex-shrink-0 mt-1" size={32} weight="fill" />
                          <div>
                            <h3 className="font-heading font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                              Who is {selectedService.details.deity.name}?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                              {selectedService.details.deity.description}
                            </p>
                            <div className="bg-white/50 border border-amber-200 rounded-lg p-4">
                              <p className="text-sm text-foreground leading-relaxed italic">
                                {selectedService.details.deity.significance}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Nature and Purpose */}
                  {selectedService.details?.nature && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <BookOpen className="text-primary" size={24} />
                          Nature and Purpose of the Pooja
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {selectedService.details.nature}
                        </p>
                        {selectedService.details.purpose && selectedService.details.purpose.length > 0 && (
                          <ul className="space-y-2">
                            {selectedService.details.purpose.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                                <span className="text-muted-foreground text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Pooja Samagri Section */}
                  {selectedService.samagriFile && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-rose-50 to-pink-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Package className="text-primary" size={24} weight="fill" />
                          Pooja Samagri (Required Materials)
                        </h3>
                        <div className="bg-white/60 border border-rose-200 rounded-lg p-5 space-y-4">
                          <div className="flex items-start gap-4">
                            {selectedService.samagriFile.type.includes('pdf') ? (
                              <FilePdf size={48} className="text-red-500 flex-shrink-0" weight="fill" />
                            ) : (
                              <FileDoc size={48} className="text-blue-500 flex-shrink-0" weight="fill" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-foreground mb-2">
                                {selectedService.samagriFile.name}
                              </p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Download or print the complete list of materials required for this pooja. This will help you prepare everything in advance.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement('a')
                                    link.href = `data:${selectedService.samagriFile!.type};base64,${selectedService.samagriFile!.data}`
                                    link.download = selectedService.samagriFile!.name
                                    link.click()
                                  }}
                                  className="gap-2"
                                >
                                  <DownloadSimple size={18} weight="bold" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const blob = new Blob(
                                      [Uint8Array.from(atob(selectedService.samagriFile!.data), c => c.charCodeAt(0))],
                                      { type: selectedService.samagriFile!.type }
                                    )
                                    const url = URL.createObjectURL(blob)
                                    const printWindow = window.open(url, '_blank')
                                    if (printWindow) {
                                      printWindow.onload = () => {
                                        printWindow.print()
                                      }
                                    }
                                  }}
                                  className="gap-2"
                                >
                                  <Printer size={18} weight="bold" />
                                  Print
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Significance and Benefits */}
                  {selectedService.details?.significance && selectedService.details.significance.length > 0 && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Star className="text-primary" size={24} weight="fill" />
                          Significance and Benefits
                        </h3>
                        <ul className="space-y-3">
                          {selectedService.details.significance.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Sparkle className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                              <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Scriptural Roots */}
                  {selectedService.details?.scripturalRoots && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <BookOpen className="text-primary" size={24} />
                          Scriptural Roots
                        </h3>
                        <Badge variant="outline" className="mb-3">
                          {selectedService.details.scripturalRoots.source}
                        </Badge>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {selectedService.details.scripturalRoots.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* When to Perform */}
                  {selectedService.details?.whenToPerform && selectedService.details.whenToPerform.length > 0 && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-50 to-sky-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Calendar className="text-primary" size={24} />
                          When to Perform
                        </h3>
                        <ul className="space-y-2">
                          {selectedService.details.whenToPerform.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                              <span className="text-muted-foreground text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Where and Who */}
                  {selectedService.details?.whereAndWho && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-rose-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <MapPin className="text-primary" size={24} />
                          Where and Who Can Perform?
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {selectedService.details.whereAndWho}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Special for NRIs */}
                  {selectedService.details?.specialForNRIs && selectedService.details.specialForNRIs.length > 0 && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Heart className="text-primary" size={24} weight="fill" />
                          Why This Pooja Is Especially Meaningful for Families Living Abroad (NRIs)
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          For many families living outside India, life is busy, scattered across work, school, and different time zones. We may feel connected to our deities in the heart, but regular, structured worship can become difficult. This pooja offers a beautiful way to reconnect as a family and as a community:
                        </p>
                        <ul className="space-y-3">
                          {selectedService.details.specialForNRIs.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Users className="text-primary mt-0.5 flex-shrink-0" size={18} weight="fill" />
                              <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Legacy sections for services without detailed info */}
                  {!selectedService.details && (
                    <>
                      {/* Description */}
                      {selectedService.detailedDescription && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Info className="text-primary" size={20} />
                            About This Service
                          </h3>
                          <div
                            className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedService.detailedDescription }}
                          />
                        </div>
                      )}

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
                    </>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border flex gap-3">
                  <Button className="flex-1" onClick={() => {
                    setIsDetailsOpen(false)
                    window.location.href = '/contact'
                  }}>
                    Book This Service
                  </Button>
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
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
