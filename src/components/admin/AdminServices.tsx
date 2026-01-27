import { useState, useRef } from 'react'
import { useAdminServices, convertLegacyService } from '../../hooks/useServices'
import { usePhotos } from '../../hooks/usePhotos'
import { uploadDocument, deleteFile, BUCKETS, extractPathFromUrl, isSupabaseStorageUrl } from '../../lib/storage'
import { Plus, PencilSimple, Trash, FloppyDisk, X, MagnifyingGlass, FunnelSimple, UploadSimple, FilePdf, FileDoc, Spinner, Package, CloudArrowUp, Image as ImageIcon, Clock, CaretLeft, CaretRight, Sparkle } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { QuillEditor } from '../ui/quill-editor'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { categoryNames } from '../../lib/data'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import type { AdminServiceRow, AdminPackageRow } from '../../lib/supabase'
import { generateSlug, supabase } from '../../lib/supabase'

type ServiceCategory = 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness' | 'packages'

interface PackageServiceItem {
  service_id: string
  sort_order: number
  package_price_override?: string
  notes?: string
}

interface ServiceFormData {
  id: string
  name: string
  category: ServiceCategory
  duration: string
  description: string
  detailedDescription: string
  benefits: string[]
  includes: string[]
  requirements: string[]
  dakshina: string
  imageUrl?: string
  samagriFile?: { name: string; data: string; type: string }
  samagriFileUrl?: string
  // Package-specific fields
  isPackage?: boolean
  packageSavingsText?: string
  packageHighlights?: string[]
  packageServices?: PackageServiceItem[]
}

export default function AdminServicesNew() {
  const { services, isLoading, createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useAdminServices()
  const { photos } = usePhotos()
  const [editingService, setEditingService] = useState<AdminServiceRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | ServiceCategory>('all')
  const [currentTab, setCurrentTab] = useState('basic')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSamagriFile, setSelectedSamagriFile] = useState<File | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<AdminServiceRow | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25
  const samagriFileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ServiceFormData>({
    id: '',
    name: '',
    category: 'pooja',
    duration: '',
    description: '',
    detailedDescription: '',
    benefits: [],
    includes: [],
    requirements: [],
    dakshina: '',
    imageUrl: ''
  })

  // Helper states for array inputs
  const [benefitInput, setBenefitInput] = useState('')
  const [includesInput, setIncludesInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')

  // Package-specific states
  const [packageHighlightInput, setPackageHighlightInput] = useState('')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [showServiceSelector, setShowServiceSelector] = useState(false)

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: 'all' | ServiceCategory) => {
    setFilterCategory(value)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      category: 'pooja',
      duration: '',
      description: '',
      detailedDescription: '',
      benefits: [],
      includes: [],
      requirements: [],
      dakshina: '',
      imageUrl: '',
      isPackage: false,
      packageSavingsText: '',
      packageHighlights: [],
      packageServices: []
    })
    setBenefitInput('')
    setIncludesInput('')
    setRequirementInput('')
    setPackageHighlightInput('')
    setSelectedServices(new Set())
    setEditingService(null)
    setCurrentTab('basic')
    setSelectedSamagriFile(null)
    setShowImagePicker(false)
    setShowServiceSelector(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (service: AdminServiceRow) => {
    const packageService = service as AdminPackageRow
    const packageServiceIds = packageService.included_services?.map(s => s.id) || []

    setFormData({
      id: service.id,
      name: service.name,
      category: service.category,
      duration: service.duration || '',
      description: service.description,
      detailedDescription: service.detailed_description || '',
      benefits: service.benefits || [],
      includes: service.includes || [],
      requirements: service.requirements || [],
      dakshina: service.price || '',
      imageUrl: service.featured_image_url || '',
      samagriFileUrl: service.samagri_file_url || undefined,
      samagriFile: service.samagri_file_url ? {
        name: 'Samagri List',
        type: service.samagri_file_url.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
        data: ''
      } : undefined,
      isPackage: service.is_package,
      packageSavingsText: service.package_savings_text || '',
      packageHighlights: service.package_highlights || [],
      packageServices: packageService.included_services?.map(s => ({
        service_id: s.id,
        sort_order: s.sort_order,
        package_price_override: s.package_price_override || undefined,
        notes: s.notes || undefined
      })) || []
    })
    setSelectedServices(new Set(packageServiceIds))
    setEditingService(service)
    setCurrentTab('basic')
    setSelectedSamagriFile(null)
    setShowImagePicker(false)
    setShowServiceSelector(false)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.duration || !formData.description) {
      toast.error('Please fill in all required fields (Name, Duration, Description)')
      return
    }

    try {
      setIsUploading(true)
      let samagriFileUrl = formData.samagriFileUrl || null

      // Upload new samagri file if selected
      if (selectedSamagriFile) {
        const result = await uploadDocument(selectedSamagriFile, 'samagri')
        samagriFileUrl = result.url

        // Delete old file from storage if it was a Supabase Storage file
        if (editingService?.samagri_file_url && isSupabaseStorageUrl(editingService.samagri_file_url)) {
          const oldPath = extractPathFromUrl(editingService.samagri_file_url, BUCKETS.DOCUMENTS)
          if (oldPath) {
            try {
              await deleteFile(BUCKETS.DOCUMENTS, oldPath)
            } catch (error) {
              console.warn('Failed to delete old samagri file:', error)
            }
          }
        }
      }

      if (editingService) {
        await updateService({
          id: editingService.id,
          name: formData.name,
          slug: generateSlug(formData.name),
          short_description: formData.description,
          full_description: formData.detailedDescription || null,
          duration: formData.duration,
          benefits: formData.benefits.length > 0 ? formData.benefits : null,
          includes: formData.includes.length > 0 ? formData.includes : null,
          requirements: formData.requirements.length > 0 ? formData.requirements : null,
          price: formData.dakshina || null,
          featured_image_url: formData.imageUrl || null,
          samagri_file_url: samagriFileUrl,
          is_package: formData.category === 'packages',
          package_savings_text: formData.packageSavingsText || null,
          package_highlights: formData.packageHighlights && formData.packageHighlights.length > 0 ? formData.packageHighlights : null
        })

        // Handle package items if this is a package
        if (formData.category === 'packages' && formData.packageServices) {
          // Delete existing package items
          await supabase
            .from('service_package_items')
            .delete()
            .eq('package_id', editingService.id)

          // Insert new package items
          if (formData.packageServices.length > 0) {
            const packageItems = formData.packageServices.map((item, index) => ({
              package_id: editingService.id,
              service_id: item.service_id,
              sort_order: index,
              package_price_override: item.package_price_override || null,
              notes: item.notes || null,
              service_snapshot: null // Will be populated by trigger or application logic
            }))

            const { error: itemsError } = await supabase
              .from('service_package_items')
              .insert(packageItems)

            if (itemsError) {
              console.error('Error saving package items:', itemsError)
              toast.error('Package saved but error adding services')
            }
          }
        }
      } else {
        const newService = convertLegacyService({
          name: formData.name,
          category: formData.category,
          duration: formData.duration,
          description: formData.description,
          detailedDescription: formData.detailedDescription,
          benefits: formData.benefits,
          includes: formData.includes,
          requirements: formData.requirements,
          price: formData.dakshina,
          bestFor: []
        })
        newService.featured_image_url = formData.imageUrl || null
        if (samagriFileUrl) {
          newService.samagri_file_url = samagriFileUrl
        }
        newService.is_package = formData.category === 'packages'
        newService.package_savings_text = formData.packageSavingsText || null
        newService.package_highlights = formData.packageHighlights && formData.packageHighlights.length > 0 ? formData.packageHighlights : null

        // Create the service first to get its ID
        const createdService = await createService(newService)

        // Handle package items if this is a package
        if (formData.category === 'packages' && formData.packageServices && formData.packageServices.length > 0 && createdService) {
          // Get the created service ID from the response
          const { data: createdServices } = await supabase
            .from('services')
            .select('id')
            .eq('slug', generateSlug(formData.name))
            .single()

          if (createdServices) {
            const packageItems = formData.packageServices.map((item, index) => ({
              package_id: createdServices.id,
              service_id: item.service_id,
              sort_order: index,
              package_price_override: item.package_price_override || null,
              notes: item.notes || null,
              service_snapshot: null
            }))

            const { error: itemsError } = await supabase
              .from('service_package_items')
              .insert(packageItems)

            if (itemsError) {
              console.error('Error saving package items:', itemsError)
              toast.error('Package created but error adding services')
            }
          }
        }
      }
      setIsDialogOpen(false)
      setEditingService(null)
      setSelectedSamagriFile(null)
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save service')
    } finally {
      setIsUploading(false)
    }
  }

  const openDeleteDialog = (service: AdminServiceRow) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    try {
      await deleteService(serviceToDelete.id)
      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const isSaving = isCreating || isUpdating || isUploading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading services...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading">Service Management</CardTitle>
              <CardDescription className="mt-2">
                Manage your Hindu pooja services, sanskars, and consultations
              </CardDescription>
            </div>
            <Button onClick={handleAdd} className="gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus size={20} weight="bold" />
              Add New Service
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search services by name or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={(v) => handleCategoryChange(v as 'all' | ServiceCategory)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <FunnelSimple size={16} />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pooja">Poojas</SelectItem>
                  <SelectItem value="sanskar">Sanskars</SelectItem>
                  <SelectItem value="paath">Paath/Recitations</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="wellness">Meditation & Yoga</SelectItem>
                  <SelectItem value="packages">📦 Service Packages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{paginatedServices.length}</span> of{' '}
            <span className="font-semibold text-foreground">{filteredServices.length}</span> services
            {filteredServices.length !== services.length && (
              <span> (filtered from {services.length} total)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.length === 0 ? (
          <Card className="col-span-full border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {services.length === 0
                  ? 'No services yet. Click "Add New Service" to get started.'
                  : 'No services found matching your criteria'}
              </p>
              {services.length > 0 && (
                <Button onClick={() => { handleSearchChange(''); handleCategoryChange('all') }} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          paginatedServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {service.featured_image_url && (
                    <img
                      src={service.featured_image_url}
                      alt={service.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-primary/20"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-xl">{service.name}</h3>
                      {service.is_popular && (
                        <Badge variant="default" className="text-xs">
                          ⭐ Popular
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-3">
                      {categoryNames[service.category]}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: service.description }}
                />

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">⏱️</span> {service.duration}
                  </span>
                  {service.price && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">🪔</span> Dakshina: {service.price}
                    </span>
                  )}
                  {service.benefits && service.benefits.length > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">✨</span> {service.benefits.length} benefits
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="flex-1"
                  >
                    <PencilSimple size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(service)}
                    disabled={isDeleting}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredServices.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <CaretLeft size={14} />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (page === 1 || page === totalPages) return true
                  if (Math.abs(page - currentPage) <= 1) return true
                  return false
                })
                .map((page, idx, arr) => (
                  <div key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <CaretRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Edit/Add Dialog - Modern Stunning UX */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 bg-background! border shadow-2xl">
          {/* Stunning Header */}
          <DialogHeader className="relative px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 via-accent/5 to-secondary/10 border-b bg-background">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-accent/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-linear-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/25">
                {editingService ? (
                  <PencilSimple size={28} className="text-white" weight="bold" />
                ) : (
                  <Plus size={28} className="text-white" weight="bold" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-heading font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {editingService 
                    ? `Updating "${editingService.name}"` 
                    : 'Add a new pooja, sanskar, or spiritual service'
                  }
                </DialogDescription>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="relative mt-6 flex items-center justify-between">
              {[
                { id: 'basic', label: 'Basic Info', icon: '📝', step: 1 },
                { id: 'details', label: 'Details', icon: '✨', step: 2 },
                { id: 'media', label: 'Media', icon: '🖼️', step: 3 }
              ].map((tab, index) => (
                <div key={tab.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      currentTab === tab.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-300 ${currentTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </span>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs opacity-70">Step {tab.step}</div>
                      <div className="font-medium text-sm">{tab.label}</div>
                    </div>
                  </button>
                  {index < 2 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                      ['basic', 'details', 'media'].indexOf(currentTab) > index 
                        ? 'bg-primary' 
                        : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>

          {/* Content Area with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent bg-background">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Service Identity Section */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Service Identity</h3>
                        <p className="text-xs text-muted-foreground">Define the core details of your service</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                          Service Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Satyanarayana Pooja"
                          className="h-12 bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value: ServiceCategory) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger id="category" className="h-12 bg-background border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pooja">🪔 Poojas</SelectItem>
                            <SelectItem value="sanskar">🎊 Sanskars</SelectItem>
                            <SelectItem value="paath">📿 Paath/Recitations</SelectItem>
                            <SelectItem value="consultation">🔮 Consultations</SelectItem>
                            <SelectItem value="wellness">🧘 Meditation & Yoga</SelectItem>
                            <SelectItem value="packages">📦 Service Packages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Duration Section */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-accent/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Clock size={20} className="text-primary" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Duration & Dakshina</h3>
                        <p className="text-xs text-muted-foreground">Time and traditional offering details</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                          Duration <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="e.g., 2-3 hours"
                          className="h-12 bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dakshina" className="text-sm font-medium">
                          Dakshina (दक्षिणा)
                        </Label>
                        <Input
                          id="dakshina"
                          value={formData.dakshina || ''}
                          onChange={(e) => setFormData({ ...formData, dakshina: e.target.value })}
                          placeholder="e.g., €150 or 'Contact for pricing'"
                          className="h-12 bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>🪔</span> Traditional offering amount for the ceremony
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descriptions Section */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-secondary/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <FileDoc size={20} className="text-primary" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Descriptions</h3>
                        <p className="text-xs text-muted-foreground">Tell devotees about this sacred service</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                          Short Description <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">Brief overview shown on service cards (1-2 sentences)</p>
                        <QuillEditor
                          value={formData.description}
                          onChange={(value) => setFormData({ ...formData, description: value })}
                          placeholder="Brief description shown on service cards..."
                          minHeight="120px"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detailedDescription" className="text-sm font-medium">
                          Detailed Description
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">Full description with rich formatting for the service page</p>
                        <QuillEditor
                          value={formData.detailedDescription || ''}
                          onChange={(value) => setFormData({ ...formData, detailedDescription: value })}
                          placeholder="Comprehensive details about this sacred ceremony..."
                          minHeight="200px"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package-Specific Section - Only show when category is 'packages' */}
                {formData.category === 'packages' && (
                  <>
                    {/* Package Services Selection */}
                    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-primary/20">
                      <div className="absolute top-0 left-0 w-40 h-40 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Package size={20} className="text-primary" weight="fill" />
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg">Included Services</h3>
                              <p className="text-xs text-muted-foreground">Select services included in this package</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowServiceSelector(!showServiceSelector)}
                            className="gap-2"
                          >
                            <Plus size={16} />
                            Add Services
                          </Button>
                        </div>

                        {/* Service Selector */}
                        {showServiceSelector && (
                          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                            <p className="text-sm font-medium mb-3">Select services to include:</p>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                              {services
                                .filter(s => s.category !== 'packages' && s.id !== formData.id)
                                .map(service => (
                                  <label
                                    key={service.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent/50 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedServices.has(service.id)}
                                      onChange={(e) => {
                                        const newSelected = new Set(selectedServices)
                                        if (e.target.checked) {
                                          newSelected.add(service.id)
                                        } else {
                                          newSelected.delete(service.id)
                                        }
                                        setSelectedServices(newSelected)

                                        // Update formData packageServices
                                        const currentServices = formData.packageServices || []
                                        if (e.target.checked) {
                                          setFormData({
                                            ...formData,
                                            packageServices: [
                                              ...currentServices,
                                              {
                                                service_id: service.id,
                                                sort_order: currentServices.length
                                              }
                                            ]
                                          })
                                        } else {
                                          setFormData({
                                            ...formData,
                                            packageServices: currentServices.filter(s => s.service_id !== service.id)
                                          })
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{service.name}</p>
                                      <p className="text-xs text-muted-foreground">{service.category} • {service.duration}</p>
                                    </div>
                                    {service.price && (
                                      <Badge variant="secondary" className="text-xs">{service.price}</Badge>
                                    )}
                                  </label>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Selected Services List */}
                        {selectedServices.size > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Selected Services ({selectedServices.size}):</p>
                            <div className="space-y-2">
                              {Array.from(selectedServices).map((serviceId, index) => {
                                const service = services.find(s => s.id === serviceId)
                                if (!service) return null

                                return (
                                  <div key={serviceId} className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                                    <span className="text-sm text-muted-foreground font-medium w-8">{index + 1}.</span>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{service.name}</p>
                                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                                    </div>
                                    {service.price && (
                                      <span className="text-sm text-muted-foreground">{service.price}</span>
                                    )}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newSelected = new Set(selectedServices)
                                        newSelected.delete(serviceId)
                                        setSelectedServices(newSelected)
                                        setFormData({
                                          ...formData,
                                          packageServices: (formData.packageServices || []).filter(s => s.service_id !== serviceId)
                                        })
                                      }}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {selectedServices.size === 0 && !showServiceSelector && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No services selected yet</p>
                            <p className="text-xs">Click "Add Services" to include services in this package</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-accent/10 to-transparent rounded-full blur-2xl" />
                      <div className="relative p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-accent/10 rounded-lg">
                            <Sparkle size={20} className="text-primary" weight="fill" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-lg">Package Details</h3>
                            <p className="text-xs text-muted-foreground">Additional package information</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="packageSavings" className="text-sm font-medium">
                              Savings Text
                            </Label>
                            <Input
                              id="packageSavings"
                              value={formData.packageSavingsText || ''}
                              onChange={(e) => setFormData({ ...formData, packageSavingsText: e.target.value })}
                              placeholder="e.g., Save €50 when you book this package"
                              className="h-12 bg-background border-border/50"
                            />
                            <p className="text-xs text-muted-foreground">Marketing text explaining package savings</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Package Highlights</Label>
                            <p className="text-xs text-muted-foreground mb-2">Key benefits of booking this package</p>
                            <div className="flex gap-2">
                              <Input
                                value={packageHighlightInput}
                                onChange={(e) => setPackageHighlightInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (packageHighlightInput.trim()) {
                                      setFormData({
                                        ...formData,
                                        packageHighlights: [...(formData.packageHighlights || []), packageHighlightInput.trim()]
                                      })
                                      setPackageHighlightInput('')
                                    }
                                  }
                                }}
                                placeholder="Enter a highlight and press Enter"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (packageHighlightInput.trim()) {
                                    setFormData({
                                      ...formData,
                                      packageHighlights: [...(formData.packageHighlights || []), packageHighlightInput.trim()]
                                    })
                                    setPackageHighlightInput('')
                                  }
                                }}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            {formData.packageHighlights && formData.packageHighlights.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {formData.packageHighlights.map((highlight, index) => (
                                  <Badge key={index} variant="secondary" className="gap-2 py-2">
                                    <span>{highlight}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          packageHighlights: formData.packageHighlights?.filter((_, i) => i !== index)
                                        })
                                      }}
                                      className="hover:text-destructive"
                                    >
                                      <X size={14} />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Benefits Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <span className="text-xl">✨</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Spiritual Benefits</h3>
                        <p className="text-xs text-muted-foreground">What devotees gain from this service</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="e.g., Inner peace and harmony..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && benefitInput.trim()) {
                            setFormData({ ...formData, benefits: [...formData.benefits, benefitInput.trim()] })
                            setBenefitInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (benefitInput.trim()) {
                            setFormData({ ...formData, benefits: [...formData.benefits, benefitInput.trim()] })
                            setBenefitInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[80px] p-4 border border-dashed border-green-500/30 rounded-xl bg-green-500/5">
                      {formData.benefits.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Press Enter or click + to add benefits
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.benefits.map((benefit, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors group"
                            >
                              <span className="mr-1">✓</span>
                              {benefit}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all"
                                onClick={() => setFormData({
                                  ...formData,
                                  benefits: formData.benefits.filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Includes Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <span className="text-xl">📦</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">What's Included</h3>
                        <p className="text-xs text-muted-foreground">Items and services provided</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={includesInput}
                        onChange={(e) => setIncludesInput(e.target.value)}
                        placeholder="e.g., All pooja samagri included..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && includesInput.trim()) {
                            setFormData({ ...formData, includes: [...formData.includes, includesInput.trim()] })
                            setIncludesInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if (includesInput.trim()) {
                            setFormData({ ...formData, includes: [...formData.includes, includesInput.trim()] })
                            setIncludesInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[80px] p-4 border border-dashed border-blue-500/30 rounded-xl bg-blue-500/5">
                      {formData.includes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Press Enter or click + to add included items
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.includes.map((item, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
                            >
                              <span className="mr-1">📌</span>
                              {item}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all"
                                onClick={() => setFormData({
                                  ...formData,
                                  includes: formData.includes.filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirements Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-amber-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <span className="text-xl">📋</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Requirements</h3>
                        <p className="text-xs text-muted-foreground">What devotees need to prepare</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="e.g., Clean pooja area..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && requirementInput.trim()) {
                            setFormData({ ...formData, requirements: [...formData.requirements, requirementInput.trim()] })
                            setRequirementInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          if (requirementInput.trim()) {
                            setFormData({ ...formData, requirements: [...formData.requirements, requirementInput.trim()] })
                            setRequirementInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[80px] p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5">
                      {formData.requirements.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Press Enter or click + to add requirements
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.requirements.map((req, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors group"
                            >
                              <span className="mr-1">⚡</span>
                              {req}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all"
                                onClick={() => setFormData({
                                  ...formData,
                                  requirements: formData.requirements.filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Media & Files Tab */}
              <TabsContent value="media" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Service Image */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <ImageIcon size={20} className="text-purple-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Service Image</h3>
                        <p className="text-xs text-muted-foreground">Visual representation of your service</p>
                      </div>
                    </div>
                    
                    {formData.imageUrl ? (
                      <div className="space-y-4">
                        <div className="relative group rounded-xl overflow-hidden border-2 border-purple-500/20 max-w-md">
                          <img
                            src={formData.imageUrl}
                            alt="Service"
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1 bg-white/90 hover:bg-white"
                              onClick={() => setShowImagePicker(true)}
                            >
                              <PencilSimple size={14} className="mr-2" />
                              Change
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 group"
                        onClick={() => setShowImagePicker(true)}
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon size={32} className="text-purple-500" weight="duotone" />
                        </div>
                        <p className="font-medium text-foreground mb-1">Select Image from Library</p>
                        <p className="text-sm text-muted-foreground">Click to browse your media collection</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Samagri File Upload */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-rose-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-rose-500/10 rounded-lg">
                        <FilePdf size={20} className="text-rose-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Pooja Samagri List</h3>
                        <p className="text-xs text-muted-foreground">Upload PDF or DOCX file (max 50MB)</p>
                      </div>
                    </div>
                    
                    {(formData.samagriFile || formData.samagriFileUrl || selectedSamagriFile) ? (
                      <div className="border border-rose-500/20 rounded-xl p-5 bg-linear-to-r from-rose-500/5 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-rose-500/10 rounded-xl">
                            {(selectedSamagriFile?.type || formData.samagriFile?.type || '').includes('pdf') || formData.samagriFileUrl?.endsWith('.pdf') ? (
                              <FilePdf size={36} className="text-rose-500" weight="fill" />
                            ) : (
                              <FileDoc size={36} className="text-blue-500" weight="fill" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {selectedSamagriFile?.name || formData.samagriFile?.name || 'Samagri List'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedSamagriFile
                                ? `${(selectedSamagriFile.size / 1024).toFixed(0)} KB • Ready to upload`
                                : '✓ Stored in cloud'
                              }
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setFormData({ ...formData, samagriFile: undefined, samagriFileUrl: undefined })
                              setSelectedSamagriFile(null)
                            }}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-rose-500/30 rounded-xl p-12 text-center cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-300 group"
                        onClick={() => samagriFileInputRef.current?.click()}
                      >
                        <input
                          ref={samagriFileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 50 * 1024 * 1024) {
                                toast.error('File size must be less than 50MB')
                                return
                              }
                              setSelectedSamagriFile(file)
                              toast.success('File selected! Save to upload.')
                            }
                          }}
                          className="hidden"
                          disabled={isSaving}
                        />
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <CloudArrowUp size={32} className="text-rose-500" weight="duotone" />
                        </div>
                        <p className="font-medium text-foreground mb-1">Upload Samagri Document</p>
                        <p className="text-sm text-muted-foreground">PDF or DOCX • Drag & drop or click to browse</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Stunning Footer */}
          <div className="relative px-8 py-5 border-t bg-muted/50">
            <div className="relative flex items-center justify-between">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {currentTab === 'basic' && '📝 Fill in the essential service details'}
                {currentTab === 'details' && '✨ Add benefits, includes, and requirements'}
                {currentTab === 'media' && '🖼️ Upload images and documents'}
              </div>
              <div className="flex gap-3 ml-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  disabled={isSaving}
                  className="px-6"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="min-w-[140px] bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner className="mr-2 animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FloppyDisk size={18} className="mr-2" />
                      Save Service
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Image Picker Modal */}
          {showImagePicker && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ImageIcon size={20} className="text-primary" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Select Image</h3>
                      <p className="text-xs text-muted-foreground">Choose from your media library</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowImagePicker(false)} className="rounded-full">
                    <X size={20} />
                  </Button>
                </div>
                <div className="p-5 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="cursor-pointer group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg"
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: photo.url })
                          setShowImagePicker(false)
                          toast.success('Image selected')
                        }}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white text-primary font-semibold px-4 py-2 rounded-full text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            Select
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-xs font-medium truncate drop-shadow-lg">{photo.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Service"
        itemName={serviceToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}
