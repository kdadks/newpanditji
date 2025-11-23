import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Clock, CheckCircle, Package, Star, CurrencyDollar, Info, BookOpen, FlowerLotus, Calendar, MapPin, Heart, Users, Sparkle, FilePdf, FileDoc, DownloadSimple, Printer, MagnifyingGlass, X, ArrowRight } from '@phosphor-icons/react'
import { services as defaultServices, categoryNames, Service } from '../../lib/data'
import { usePageSEO } from '../../hooks/usePageSEO'
import { Page, NavigationData } from '../../App'

interface ServicesPageProps {
  initialCategory?: string
  onNavigate?: (pageOrData: Page | NavigationData) => void
}

export default function ServicesPage({ initialCategory = 'all', onNavigate }: ServicesPageProps) {
  const [adminServices] = useLocalStorage<Service[]>('admin-services', defaultServices)
  const services = adminServices || defaultServices
  const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>(initialCategory as Service['category'] | 'all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredServices = services.filter(service => {
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory

    // Filter by search query
    const matchesSearch = searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.detailedDescription && service.detailedDescription.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setIsDetailsOpen(true)
  }

  return (
    <div className="w-full">
      {/* Hero Section with Rolling Background */}
      <section className="relative pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            <img
              src="/images/Traditional Altar with Marigold Flowers.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/South Asian Temple Complex.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/Golden Temples of Devotion.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img
              src="/images/Traditional Altar with Marigold Flowers.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/South Asian Temple Complex.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/Golden Temples of Devotion.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
            <img
              src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
              alt=""
              className="h-full w-auto object-cover opacity-60"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="lg:flex lg:justify-between lg:items-start">
            <div className="text-center lg:flex-1">
              <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-slate-900">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto mb-6 lg:mb-0">
                Discover our comprehensive range of traditional Hindu religious services, ceremonies, and spiritual guidance offerings
              </p>

              {/* Why Choose Us CTA Button - Centered on Mobile */}
              <div className="lg:hidden flex justify-center">
                <Button
                  size="default"
                  variant="outline"
                  onClick={() => onNavigate?.('why-choose-us')}
                  className="text-base px-6 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Sparkle className="mr-2" size={20} weight="fill" />
                  Why Choose Us
                </Button>
              </div>
            </div>

            {/* Why Choose Us CTA Button - Right Aligned on Desktop */}
            <div className="hidden lg:block ml-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate?.('why-choose-us')}
                className="text-base px-8 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Sparkle className="mr-2" size={20} weight="fill" />
                Why Choose Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Content Section */}
      <div className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search services by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <Tabs value={selectedCategory} className="mb-8" onValueChange={(v) => setSelectedCategory(v as Service['category'] | 'all')}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Services ({services.length})
            </TabsTrigger>
            <TabsTrigger value="pooja" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Poojas ({services.filter(s => s.category === 'pooja').length})
            </TabsTrigger>
            <TabsTrigger value="sanskar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sanskars ({services.filter(s => s.category === 'sanskar').length})
            </TabsTrigger>
            <TabsTrigger value="paath" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Paath ({services.filter(s => s.category === 'paath').length})
            </TabsTrigger>
            <TabsTrigger value="consultation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Consultations ({services.filter(s => s.category === 'consultation').length})
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Wellness ({services.filter(s => s.category === 'wellness').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> result{filteredServices.length !== 1 ? 's' : ''} for "<span className="font-semibold text-foreground">{searchQuery}</span>"
            </p>
          </div>
        )}

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
    </div>
  )
}
