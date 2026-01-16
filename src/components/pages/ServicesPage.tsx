'use client'

import { useState, useEffect } from 'react'
import { useServices } from '../../hooks/useServices'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Clock, CheckCircle, Package, Star, CurrencyDollar, Info, BookOpen, FlowerLotus, Calendar, MapPin, Heart, Users, Sparkle, FilePdf, FileDoc, DownloadSimple, Printer, MagnifyingGlass, X, ArrowRight, CircleNotch } from '@phosphor-icons/react'
import { services as defaultServices, categoryNames, Service } from '../../lib/data'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { AppPage, AppNavigationData } from '../../lib/types'

interface ServicesPageProps {
  initialCategory?: string
  onNavigate?: (pageOrData: AppPage | AppNavigationData) => void
}

export default function ServicesPage({ initialCategory = 'all', onNavigate }: ServicesPageProps) {
  const { services: dbServices, isLoading } = useServices()
  // Use database services if available, otherwise fall back to defaults
  const services = (dbServices && dbServices.length > 0) ? dbServices : defaultServices
  const [selectedCategory, setSelectedCategory] = useState<Service['category'] | 'all'>(initialCategory as Service['category'] | 'all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // SEO Configuration
  usePageMetadata('services')

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
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images - Service Related */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {['/images/Pooja 1.jpg', '/images/Pooja 2.jpg', '/images/Pooja 3.jpg', '/images/Traditional Altar with Marigold Flowers.png'].map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {['/images/Pooja 1.jpg', '/images/Pooja 2.jpg', '/images/Pooja 3.jpg', '/images/Traditional Altar with Marigold Flowers.png'].map((img, index) => (
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <FlowerLotus size={18} weight="fill" className="animate-pulse" />
              Sacred Services & Ceremonies
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              Our <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Services</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              Discover our comprehensive range of traditional Hindu religious services, ceremonies, and spiritual guidance offerings
            </p>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate?.('why-choose-us')}
                className="group px-8 py-4 text-lg font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30"
              >
                <Sparkle className="mr-3 group-hover:scale-110 transition-transform" size={20} weight="fill" />
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 h-auto gap-2 bg-muted/50 p-2">
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
            <TabsTrigger value="package" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Packages ({services.filter(s => s.category === 'package').length})
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

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <CircleNotch className="animate-spin text-primary" size={48} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading && filteredServices.map((service, index) => (
            <Card
              key={service.id}
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 bg-linear-to-br from-white via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/30 flex flex-col"
              onClick={() => handleServiceClick(service)}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 flex-shrink-0">
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img 
                  src={`/images/Pooja ${(index % 3) + 1}.jpg`}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/Traditional Altar with Marigold Flowers.png';
                  }}
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 px-4 py-2 rounded-full shadow-lg border border-white/30 backdrop-blur-sm">
                    <FlowerLotus size={14} weight="fill" />
                    {categoryNames[service.category]}
                  </span>
                </div>
                {/* Number Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center font-black text-amber-700 dark:text-amber-400 shadow-lg border border-amber-200 dark:border-amber-800">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/40">
                  <Clock className="text-amber-600" size={14} weight="fill" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{service.duration}</span>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-6 relative flex flex-col flex-grow">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-amber-100/50 to-transparent dark:from-amber-900/20 rounded-bl-full"></div>
                
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                  {service.name}
                </h3>
                
                <div
                  className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 prose prose-sm max-w-none flex-grow"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
                
                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <FlowerLotus className="text-amber-700 dark:text-amber-400" size={18} weight="fill" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Sacred Ritual</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold text-sm group-hover:gap-2 transition-all duration-300 whitespace-nowrap">
                    <span>View Details</span>
                    <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-t from-amber-500/10 via-transparent to-transparent"></div>
              </div>
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
                  <DialogDescription asChild>
                    <div
                      className="text-muted-foreground text-base prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedService.description }}
                    />
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Quick Info Bar */}
                  <div className="flex flex-wrap gap-4 p-4 bg-linear-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
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
                            // Handle both URL-based and base64-based files
                            if (selectedService.samagriFile!.url) {
                              window.open(selectedService.samagriFile!.url, '_blank')
                            } else if (selectedService.samagriFile!.data) {
                              const link = document.createElement('a')
                              link.href = `data:${selectedService.samagriFile!.type};base64,${selectedService.samagriFile!.data}`
                              link.download = selectedService.samagriFile!.name
                              link.click()
                            }
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
                            // Handle both URL-based and base64-based files
                            if (selectedService.samagriFile!.url) {
                              const printWindow = window.open(selectedService.samagriFile!.url, '_blank')
                              if (printWindow) {
                                printWindow.onload = () => printWindow.print()
                              }
                            } else if (selectedService.samagriFile!.data) {
                              const blob = new Blob(
                                [Uint8Array.from(atob(selectedService.samagriFile!.data), c => c.charCodeAt(0))],
                                { type: selectedService.samagriFile!.type }
                              )
                              const url = URL.createObjectURL(blob)
                              const printWindow = window.open(url, '_blank')
                              if (printWindow) {
                                printWindow.onload = () => printWindow.print()
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-amber-50 to-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <FlowerLotus className="text-primary shrink-0 mt-1" size={32} weight="fill" />
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-blue-50 to-indigo-50">
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
                                <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-rose-50 to-pink-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Package className="text-primary" size={24} weight="fill" />
                          Pooja Samagri (Required Materials)
                        </h3>
                        <div className="bg-white/60 border border-rose-200 rounded-lg p-5 space-y-4">
                          <div className="flex items-start gap-4">
                            {selectedService.samagriFile.type.includes('pdf') ? (
                              <FilePdf size={48} className="text-red-500 shrink-0" weight="fill" />
                            ) : (
                              <FileDoc size={48} className="text-blue-500 shrink-0" weight="fill" />
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
                                    // Handle both URL-based and base64-based files
                                    if (selectedService.samagriFile!.url) {
                                      window.open(selectedService.samagriFile!.url, '_blank')
                                    } else if (selectedService.samagriFile!.data) {
                                      const link = document.createElement('a')
                                      link.href = `data:${selectedService.samagriFile!.type};base64,${selectedService.samagriFile!.data}`
                                      link.download = selectedService.samagriFile!.name
                                      link.click()
                                    }
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
                                    // Handle both URL-based and base64-based files
                                    if (selectedService.samagriFile!.url) {
                                      const printWindow = window.open(selectedService.samagriFile!.url, '_blank')
                                      if (printWindow) {
                                        printWindow.onload = () => printWindow.print()
                                      }
                                    } else if (selectedService.samagriFile!.data) {
                                      const blob = new Blob(
                                        [Uint8Array.from(atob(selectedService.samagriFile!.data), c => c.charCodeAt(0))],
                                        { type: selectedService.samagriFile!.type }
                                      )
                                      const url = URL.createObjectURL(blob)
                                      const printWindow = window.open(url, '_blank')
                                      if (printWindow) {
                                        printWindow.onload = () => printWindow.print()
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Star className="text-primary" size={24} weight="fill" />
                          Significance and Benefits
                        </h3>
                        <ul className="space-y-3">
                          {selectedService.details.significance.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Sparkle className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
                              <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Scriptural Roots */}
                  {selectedService.details?.scripturalRoots && (
                    <Card className="border-0 shadow-md bg-linear-to-br from-purple-50 to-violet-50">
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-cyan-50 to-sky-50">
                      <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                          <Calendar className="text-primary" size={24} />
                          When to Perform
                        </h3>
                        <ul className="space-y-2">
                          {selectedService.details.whenToPerform.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
                              <span className="text-muted-foreground text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Where and Who */}
                  {selectedService.details?.whereAndWho && (
                    <Card className="border-0 shadow-md bg-linear-to-br from-pink-50 to-rose-50">
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
                    <Card className="border-0 shadow-md bg-linear-to-br from-orange-50 to-red-50">
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
                              <Users className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
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
                                <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
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
                                <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} weight="fill" />
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
