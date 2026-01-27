'use client'

import { useState, useEffect } from 'react'
import { useServices } from '../../hooks/useServices'
import { trackServiceView } from '../../lib/analytics-tracker'
import { shouldTrackAnalytics } from '../../lib/analytics-utils'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Clock, CheckCircle, Package, Star, CurrencyDollar, Info, BookOpen, FlowerLotus, Calendar, MapPin, Heart, Users, Sparkle, FilePdf, FileDoc, DownloadSimple, Printer, MagnifyingGlass, X, ArrowRight, CircleNotch, CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight } from '@phosphor-icons/react'
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

  // Package navigation state - track parent package when viewing included service
  const [parentPackage, setParentPackage] = useState<Service | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // SEO Configuration
  usePageMetadata('services')

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory as Service['category'] | 'all')
    }
  }, [initialCategory])

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, endIndex)

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setIsDetailsOpen(true)
    setParentPackage(null) // Clear parent package when opening a new service

    // Track service view (only in production, not localhost/development)
    if (shouldTrackAnalytics() && service.id) {
      trackServiceView(service.id, service.name).catch(err => {
        console.error('Failed to track service view:', err)
      })
    }
  }

  // Handle clicking on a service within a package
  const handleIncludedServiceClick = (serviceSlug: string, packageService: Service) => {
    // Find the full service details
    const fullService = services.find(s => s.id === serviceSlug)
    if (fullService) {
      setParentPackage(packageService) // Remember the package we came from
      setSelectedService(fullService)

      // Track service view
      if (shouldTrackAnalytics() && fullService.id) {
        trackServiceView(fullService.id, fullService.name).catch(err => {
          console.error('Failed to track service view:', err)
        })
      }
    }
  }

  // Go back to the parent package
  const handleBackToPackage = () => {
    if (parentPackage) {
      setSelectedService(parentPackage)
      setParentPackage(null)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of services section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
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

        {!searchQuery && filteredServices.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startIndex + 1}-{Math.min(endIndex, filteredServices.length)}</span> of <span className="font-semibold text-foreground">{filteredServices.length}</span> services
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <CircleNotch className="animate-spin text-primary" size={48} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading && paginatedServices.map((service, index) => {
            // Calculate the actual index for display
            const displayIndex = startIndex + index
            return (
            <Card
              key={service.id}
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 bg-linear-to-br from-white via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/30 flex flex-col"
              onClick={() => handleServiceClick(service)}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 shrink-0">
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                {service.imageUrl && (
                  <img 
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 px-4 py-2 rounded-full shadow-lg border border-white/30 backdrop-blur-sm">
                    <FlowerLotus size={14} weight="fill" />
                    {categoryNames[service.category]}
                  </span>
                  {/* Package Badge */}
                  {service.isPackage && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-linear-to-r from-purple-600 via-pink-600 to-purple-700 px-4 py-2 rounded-full shadow-lg border border-white/30 backdrop-blur-sm animate-pulse">
                      <Package size={14} weight="fill" />
                      Multi-Service Package
                    </span>
                  )}
                </div>
                {/* Number Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center font-black text-amber-700 dark:text-amber-400 shadow-lg border border-amber-200 dark:border-amber-800">
                    {String(displayIndex + 1).padStart(2, '0')}
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/40">
                  <Clock className="text-amber-600" size={14} weight="fill" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{service.duration}</span>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-6 relative flex flex-col grow">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-amber-100/50 to-transparent dark:from-amber-900/20 rounded-bl-full"></div>
                
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                  {service.name}
                </h3>
                
                <div
                  className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 prose prose-sm max-w-none grow"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
                
                {/* Package Info */}
                {service.isPackage && service.includedServices && service.includedServices.length > 0 && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                      <Package size={16} weight="fill" />
                      <span>Includes {service.includedServices.length} Services</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {service.isPackage ? (
                        <Package className="text-purple-700 dark:text-purple-400" size={18} weight="fill" />
                      ) : (
                        <FlowerLotus className="text-amber-700 dark:text-amber-400" size={18} weight="fill" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {service.isPackage ? 'Service Package' : 'Sacred Ritual'}
                    </span>
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
          )})}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found in this category.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {/* First Page */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="h-10 w-10"
              >
                <CaretDoubleLeft size={16} weight="bold" />
              </Button>

              {/* Previous Page */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10"
              >
                <CaretLeft size={16} weight="bold" />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and adjacent pages
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  // Show ellipsis
                  if (!showPage) {
                    // Show ellipsis before current page range
                    if (page === currentPage - 2 && currentPage > 3) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    // Show ellipsis after current page range
                    if (page === currentPage + 2 && currentPage < totalPages - 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => goToPage(page)}
                      className={`h-10 w-10 ${
                        currentPage === page 
                          ? "bg-primary text-primary-foreground" 
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              {/* Next Page */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10"
              >
                <CaretRight size={16} weight="bold" />
              </Button>

              {/* Last Page */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-10 w-10"
              >
                <CaretDoubleRight size={16} weight="bold" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Service Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
            {selectedService && (
              <>
                {/* Header with Image and Title */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Image Section */}
                  {selectedService.imageUrl && (
                    <div className="w-full md:w-auto shrink-0">
                      <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
                        <img 
                          src={selectedService.imageUrl}
                          alt={selectedService.name}
                          style={{ width: '400px', height: 'auto' }}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title and Info Section */}
                  <div className="flex-1">
                    {/* Back to Package Button */}
                    {parentPackage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToPackage}
                        className="mb-4 gap-2 hover:bg-purple-100 text-purple-700"
                      >
                        <CaretLeft size={16} weight="bold" />
                        <Package size={16} weight="fill" />
                        Back to {parentPackage.name}
                      </Button>
                    )}

                    <div className="mb-3">
                      <Badge className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white border-white/30">
                        <FlowerLotus size={14} weight="fill" className="mr-1.5" />
                        {categoryNames[selectedService.category]}
                      </Badge>
                    </div>
                    <DialogTitle className="font-heading text-3xl mb-3">{selectedService.name}</DialogTitle>
                    <DialogDescription asChild>
                      <div
                        className="text-muted-foreground text-base prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedService.description }}
                      />
                    </DialogDescription>
                  </div>
                </div>

                <div className="space-y-6">
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

                  {/* Package-Specific Sections */}
                  {selectedService.isPackage && (
                    <>
                      {/* Package Savings */}
                      {selectedService.packageSavingsText && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-full">
                              <Sparkle size={20} className="text-white" weight="fill" />
                            </div>
                            <p className="text-green-800 font-semibold text-lg">
                              {selectedService.packageSavingsText}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Package Highlights */}
                      {selectedService.packageHighlights && selectedService.packageHighlights.length > 0 && (
                        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                          <CardContent className="p-6">
                            <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                              <Star className="text-primary" size={24} weight="fill" />
                              Package Highlights
                            </h3>
                            <ul className="space-y-3">
                              {selectedService.packageHighlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle className="text-primary mt-0.5 shrink-0" size={20} weight="fill" />
                                  <span className="text-muted-foreground">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Included Services */}
                      {selectedService.includedServices && selectedService.includedServices.length > 0 && (
                        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                          <CardContent className="p-6">
                            <h3 className="font-heading font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                              <Package className="text-primary" size={28} weight="fill" />
                              Services Included in This Package
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              This package includes {selectedService.includedServices.length} carefully curated services:
                            </p>
                            <div className="space-y-4">
                              {selectedService.includedServices.map((includedService, index) => (
                                <div
                                  key={includedService.id}
                                  onClick={() => handleIncludedServiceClick(includedService.id, selectedService)}
                                  className="group p-5 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                                >
                                  <div className="flex items-start gap-4">
                                    {/* Service Number Badge */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                                      {index + 1}
                                    </div>

                                    {/* Service Image (if available) */}
                                    {includedService.imageUrl && (
                                      <div className="flex-shrink-0">
                                        <img
                                          src={includedService.imageUrl}
                                          alt={includedService.name}
                                          className="w-20 h-20 object-cover rounded-lg border-2 border-orange-300 group-hover:border-orange-500 transition-colors"
                                        />
                                      </div>
                                    )}

                                    {/* Service Details */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-heading font-bold text-lg mb-2 text-foreground group-hover:text-orange-600 transition-colors">
                                          {includedService.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-orange-600 text-sm font-semibold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <span className="text-xs">View Details</span>
                                          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {includedService.description}
                                      </p>
                                      <div className="flex flex-wrap gap-3 text-sm">
                                        {includedService.duration && (
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock size={16} className="text-primary" weight="bold" />
                                            <span>{includedService.duration}</span>
                                          </div>
                                        )}
                                        {includedService.price && (
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <CurrencyDollar size={16} className="text-primary" weight="bold" />
                                            <span>
                                              {!includedService.price.includes('€') && /^\d+/.test(includedService.price)
                                                ? `€${includedService.price}`
                                                : includedService.price}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Click Hint */}
                                  <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-center gap-2 text-xs text-muted-foreground group-hover:text-orange-600 transition-colors">
                                    <Info size={14} weight="fill" />
                                    <span>Click to view full service details</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Package Summary */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="text-green-600" size={24} weight="fill" />
                                  <span className="font-semibold text-foreground">
                                    All {selectedService.includedServices.length} services included
                                  </span>
                                </div>
                                {selectedService.price && (
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Package Price</p>
                                    <p className="text-2xl font-bold text-primary">
                                      {!selectedService.price.includes('€') && /^\d+/.test(selectedService.price)
                                        ? `€${selectedService.price}`
                                        : selectedService.price}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

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
