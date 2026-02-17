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
import { categoryNames } from '../../lib/constants'
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
  bestFor: string[]
  dakshina: string
  imageUrl?: string
  samagriFile?: { name: string; data: string; type: string }
  samagriFileUrl?: string
  // Package-specific fields
  isPackage?: boolean
  packageSavingsText?: string
  packageHighlights?: string[]
  packageServices?: PackageServiceItem[]
  // Advanced Detail fields
  deityName?: string
  deityDescription?: string
  deitySignificance?: string
  nature?: string
  purpose?: string[]
  significance?: string[]
  scripturalSource?: string
  scripturalDescription?: string
  whenToPerform?: string[]
  whereAndWho?: string
  specialForNRIs?: string[]
  specialForNRIsTitle?: string
  specialForNRIsIntro?: string
  coreAspects?: Array<{ title: string; content: string }>
  sectionTitles?: {
    deity?: string
    nature?: string
    samagri?: string
    samagriDescription?: string
    significance?: string
    scriptural?: string
    when?: string
    where?: string
    nri?: string
    includes?: string
    requirements?: string
    bestFor?: string
  }
}

export default function AdminServicesNew() {
  const { services, isLoading, createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useAdminServices()
  const { photos } = usePhotos({ limit: 1000 }) // Load more photos for image picker
  const [editingService, setEditingService] = useState<AdminServiceRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | ServiceCategory>('all')
  const [currentTab, setCurrentTab] = useState('basic')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSamagriFile, setSelectedSamagriFile] = useState<File | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [imagePickerCategory, setImagePickerCategory] = useState<string>('all')
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
    bestFor: [],
    dakshina: '',
    imageUrl: '',
    sectionTitles: {}
  })

  // Helper states for array inputs
  const [benefitInput, setBenefitInput] = useState('')
  const [includesInput, setIncludesInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [bestForInput, setBestForInput] = useState('')

  // Package-specific states
  const [packageHighlightInput, setPackageHighlightInput] = useState('')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [showServiceSelector, setShowServiceSelector] = useState(false)

  // Advanced detail states
  const [purposeInput, setPurposeInput] = useState('')
  const [significanceInput, setSignificanceInput] = useState('')
  const [whenToPerformInput, setWhenToPerformInput] = useState('')
  const [specialForNRIsInput, setSpecialForNRIsInput] = useState('')
  const [coreAspectTitleInput, setCoreAspectTitleInput] = useState('')
  const [coreAspectContentInput, setCoreAspectContentInput] = useState('')

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
      bestFor: [],
      dakshina: '',
      imageUrl: '',
      isPackage: false,
      packageSavingsText: '',
      packageHighlights: [],
      packageServices: [],
      // Initialize advanced details
      deityName: '',
      deityDescription: '',
      deitySignificance: '',
      nature: '',
      purpose: [],
      significance: [],
      scripturalSource: '',
      scripturalDescription: '',
      whenToPerform: [],
      whereAndWho: '',
      specialForNRIs: [],
      specialForNRIsTitle: '',
      specialForNRIsIntro: '',
      coreAspects: [],
      sectionTitles: {}
    })
    setBenefitInput('')
    setIncludesInput('')
    setRequirementInput('')
    setBestForInput('')
    setPackageHighlightInput('')
    setPurposeInput('')
    setSignificanceInput('')
    setWhenToPerformInput('')
    setSpecialForNRIsInput('')
    setCoreAspectTitleInput('')
    setCoreAspectContentInput('')
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

    // Parse deity_info JSON
    const deityInfo = service.deity_info as any
    // Parse scriptural_roots JSON
    const scripturalRoots = service.scriptural_roots as any
    // Parse core_aspects JSON
    const coreAspects = service.core_aspects as any

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
      bestFor: service.best_for || [],
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
      })) || [],
      // Load advanced details
      deityName: deityInfo?.name || '',
      deityDescription: deityInfo?.description || '',
      deitySignificance: deityInfo?.significance || '',
      nature: service.nature || '',
      purpose: service.purpose || [],
      significance: service.significance || [],
      scripturalSource: scripturalRoots?.source || '',
      scripturalDescription: scripturalRoots?.description || '',
      whenToPerform: service.when_to_perform || [],
      whereAndWho: service.where_and_who || '',
      specialForNRIs: service.special_notes || [],
      specialForNRIsTitle: service.special_for_nris_title || '',
      specialForNRIsIntro: service.special_for_nris_intro || '',
      coreAspects: coreAspects || [],
      sectionTitles: service.section_titles as ServiceFormData['sectionTitles'] || {}
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

      // Look up category_id based on category slug (with auto-create fallback)
      const categoryMeta: Record<string, { name: string; icon: string; sortOrder: number }> = {
        pooja: { name: 'Poojas', icon: 'pray', sortOrder: 0 },
        sanskar: { name: 'Sanskars', icon: 'heart', sortOrder: 1 },
        paath: { name: 'Paath/Recitations', icon: 'book', sortOrder: 2 },
        consultation: { name: 'Consultations', icon: 'users', sortOrder: 3 },
        wellness: { name: 'Meditation & Yoga', icon: 'lotus', sortOrder: 4 },
        packages: { name: 'Service Packages', icon: 'package', sortOrder: 5 },
      }

      let category_id: string | null = null

      // First, try to find the category by slug
      const { data: categoryData, error: categoryLookupError } = await supabase
        .from('service_categories')
        .select('id')
        .eq('slug', formData.category)
        .maybeSingle()

      if (categoryLookupError) {
        console.error('Category lookup error:', categoryLookupError)
        if (categoryLookupError.code === '42P01') {
          throw new Error('Database table "service_categories" not found. Check that NEXT_PUBLIC_SUPABASE_URL in .env.local points to your remote Supabase project.')
        }
      }

      if (categoryData) {
        category_id = categoryData.id
      } else {
        // Category slug not found — auto-create it so the admin form always works
        console.log(`Category '${formData.category}' not found in DB, auto-creating...`)
        const meta = categoryMeta[formData.category] || {
          name: categoryNames[formData.category] || formData.category,
          icon: 'star',
          sortOrder: 99,
        }

        const { data: newCat, error: createCatError } = await supabase
          .from('service_categories')
          .upsert(
            {
              name: meta.name,
              slug: formData.category,
              description: `${meta.name} services`,
              icon: meta.icon,
              sort_order: meta.sortOrder,
              is_active: true,
            },
            { onConflict: 'slug' }
          )
          .select('id')
          .single()

        if (createCatError || !newCat) {
          console.error('Failed to auto-create category:', createCatError)
          // Fallback: reuse existing category_id when editing
          if (editingService?.category_id) {
            console.log('Falling back to existing category_id:', editingService.category_id)
            category_id = editingService.category_id
          } else {
            throw new Error(`Category '${formData.category}' not found and could not be created: ${createCatError?.message || 'Unknown error'}`)
          }
        } else {
          category_id = newCat.id
          console.log('Auto-created category:', { slug: formData.category, id: category_id })
        }
      }

      if (editingService) {
        console.log('About to update service:', {
          serviceId: editingService.id,
          serviceName: formData.name,
          category_id: category_id
        })
        
        await updateService({
          id: editingService.id,
          name: formData.name,
          slug: generateSlug(formData.name),
          category_id: category_id,
          short_description: formData.description,
          full_description: formData.detailedDescription || null,
          duration: formData.duration,
          benefits: formData.benefits.length > 0 ? formData.benefits : null,
          includes: formData.includes.length > 0 ? formData.includes : null,
          requirements: formData.requirements.length > 0 ? formData.requirements : null,
          best_for: formData.bestFor.length > 0 ? formData.bestFor : null,
          price: formData.dakshina || null,
          featured_image_url: formData.imageUrl || null,
          samagri_file_url: samagriFileUrl,
          is_package: formData.category === 'packages',
          package_savings_text: formData.packageSavingsText || null,
          package_highlights: formData.packageHighlights && formData.packageHighlights.length > 0 ? formData.packageHighlights : null,
          // Add advanced details
          deity_info: (formData.deityName || formData.deityDescription || formData.deitySignificance) ? {
            name: formData.deityName || '',
            description: formData.deityDescription || '',
            significance: formData.deitySignificance || ''
          } : null,
          nature: formData.nature || null,
          purpose: formData.purpose && formData.purpose.length > 0 ? formData.purpose : null,
          significance: formData.significance && formData.significance.length > 0 ? formData.significance : null,
          scriptural_roots: (formData.scripturalSource || formData.scripturalDescription) ? {
            source: formData.scripturalSource || '',
            description: formData.scripturalDescription || ''
          } : null,
          when_to_perform: formData.whenToPerform && formData.whenToPerform.length > 0 ? formData.whenToPerform : null,
          where_and_who: formData.whereAndWho || null,
          special_notes: formData.specialForNRIs && formData.specialForNRIs.length > 0 ? formData.specialForNRIs : null,
          special_for_nris_title: formData.specialForNRIsTitle || null,
          special_for_nris_intro: formData.specialForNRIsIntro || null,
          core_aspects: formData.coreAspects && formData.coreAspects.length > 0 ? formData.coreAspects : null,
          section_titles: formData.sectionTitles && Object.keys(formData.sectionTitles).length > 0 ? formData.sectionTitles : null
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
          bestFor: formData.bestFor
        })
        newService.category_id = category_id
        newService.featured_image_url = formData.imageUrl || null
        if (samagriFileUrl) {
          newService.samagri_file_url = samagriFileUrl
        }
        newService.is_package = formData.category === 'packages'
        newService.package_savings_text = formData.packageSavingsText || null
        newService.package_highlights = formData.packageHighlights && formData.packageHighlights.length > 0 ? formData.packageHighlights : null
        // Add advanced details
        newService.deity_info = (formData.deityName || formData.deityDescription || formData.deitySignificance) ? {
          name: formData.deityName || '',
          description: formData.deityDescription || '',
          significance: formData.deitySignificance || ''
        } : null
        newService.nature = formData.nature || null
        newService.purpose = formData.purpose && formData.purpose.length > 0 ? formData.purpose : null
        newService.significance = formData.significance && formData.significance.length > 0 ? formData.significance : null
        newService.scriptural_roots = (formData.scripturalSource || formData.scripturalDescription) ? {
          source: formData.scripturalSource || '',
          description: formData.scripturalDescription || ''
        } : null
        newService.when_to_perform = formData.whenToPerform && formData.whenToPerform.length > 0 ? formData.whenToPerform : null
        newService.where_and_who = formData.whereAndWho || null
        newService.special_notes = formData.specialForNRIs && formData.specialForNRIs.length > 0 ? formData.specialForNRIs : null
        newService.special_for_nris_title = formData.specialForNRIsTitle || null
        newService.special_for_nris_intro = formData.specialForNRIsIntro || null
        newService.core_aspects = formData.coreAspects && formData.coreAspects.length > 0 ? formData.coreAspects : null
        newService.section_titles = formData.sectionTitles && Object.keys(formData.sectionTitles).length > 0 ? formData.sectionTitles : null

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
      toast.success(editingService ? 'Service updated successfully!' : 'Service created successfully!')
    } catch (error: any) {
      console.error('=== SAVE ERROR ===')
      console.error('Error object:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      console.error('Error keys:', error ? Object.keys(error) : 'null')
      console.error('Error string:', String(error))
      console.error('Error JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      
      let errorMessage = 'Failed to save service'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.error('Final error message:', errorMessage)
      toast.error(errorMessage)
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
      <Dialog open={isDialogOpen && !showImagePicker} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[70vw]! max-w-[70vw]! max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-background! border shadow-2xl">
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
                { id: 'advanced', label: 'Advanced', icon: '🕉️', step: 3 },
                { id: 'media', label: 'Media', icon: '🖼️', step: 4 }
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
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                      ['basic', 'details', 'advanced', 'media'].indexOf(currentTab) > index 
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
                          key={`category-${editingService?.id || 'new'}-${formData.category}`}
                          value={formData.category}
                          onValueChange={(value: ServiceCategory) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger id="category" className="w-full h-12 bg-background border-border/50">
                            <SelectValue placeholder="Select a category" />
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
                              <button
                                type="button"
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  benefits: formData.benefits.filter((_, i) => i !== index)
                                })}
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

                {/* Includes Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleIncludes" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleIncludes"
                        value={formData.sectionTitles?.includes || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, includes: e.target.value }
                        })}
                        placeholder="e.g., What's Included"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
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
                              <button
                                type="button"
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  includes: formData.includes.filter((_, i) => i !== index)
                                })}
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

                {/* Requirements Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-amber-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleRequirements" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleRequirements"
                        value={formData.sectionTitles?.requirements || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, requirements: e.target.value }
                        })}
                        placeholder="e.g., Requirements"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
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
                              <button
                                type="button"
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  requirements: formData.requirements.filter((_, i) => i !== index)
                                })}
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

                {/* Best For Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleBestFor" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleBestFor"
                        value={formData.sectionTitles?.bestFor || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, bestFor: e.target.value }
                        })}
                        placeholder="e.g., Best For"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={bestForInput}
                        onChange={(e) => setBestForInput(e.target.value)}
                        placeholder="e.g., New parents, Career growth..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && bestForInput.trim()) {
                            setFormData({ ...formData, bestFor: [...formData.bestFor, bestForInput.trim()] })
                            setBestForInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          if (bestForInput.trim()) {
                            setFormData({ ...formData, bestFor: [...formData.bestFor, bestForInput.trim()] })
                            setBestForInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[80px] p-4 border border-dashed border-purple-500/30 rounded-xl bg-purple-500/5">
                      {formData.bestFor.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Press Enter or click + to add target audience
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.bestFor.map((item, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20 transition-colors group"
                            >
                              <span className="mr-1">🎯</span>
                              {item}
                              <button
                                type="button"
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  bestFor: formData.bestFor.filter((_, i) => i !== index)
                                })}
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
              </TabsContent>

              {/* Advanced Details Tab */}
              <TabsContent value="advanced" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <span className="text-lg">🕉️</span>
                    <span><strong>Advanced Details:</strong> These additional fields provide comprehensive spiritual and cultural context for your services. All fields are optional but enhance the user experience.</span>
                  </p>
                </div>

                {/* Deity Information */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-orange-200">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sectionTitleDeity" className="text-sm font-semibold flex items-center gap-2">
                          <span className="text-2xl">🙏</span>
                          Section Title (displayed on live page)
                        </Label>
                        <Input
                          id="sectionTitleDeity"
                          value={formData.sectionTitles?.deity || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sectionTitles: { ...formData.sectionTitles, deity: e.target.value }
                          })}
                          placeholder="e.g., Who is Lord Ganesha?"
                          className="mt-2 font-semibold"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave blank to hide this section's title</p>
                      </div>
                      <div>
                        <Label htmlFor="deityName">Deity Name</Label>
                        <Input
                          id="deityName"
                          value={formData.deityName || ''}
                          onChange={(e) => setFormData({ ...formData, deityName: e.target.value })}
                          placeholder="e.g., Lord Ganesha, Goddess Lakshmi..."
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="deityDescription">Deity Description</Label>
                        <Textarea
                          id="deityDescription"
                          value={formData.deityDescription || ''}
                          onChange={(e) => setFormData({ ...formData, deityDescription: e.target.value })}
                          placeholder="Who is this deity? Brief introduction..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="deitySignificance">Deity Significance</Label>
                        <Textarea
                          id="deitySignificance"
                          value={formData.deitySignificance || ''}
                          onChange={(e) => setFormData({ ...formData, deitySignificance: e.target.value })}
                          placeholder="Spiritual significance and symbolism..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nature and Purpose */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-blue-200">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sectionTitleNature" className="text-sm font-semibold flex items-center gap-2">
                          <span className="text-2xl">📖</span>
                          Section Title (displayed on live page)
                        </Label>
                        <Input
                          id="sectionTitleNature"
                          value={formData.sectionTitles?.nature || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sectionTitles: { ...formData.sectionTitles, nature: e.target.value }
                          })}
                          placeholder="e.g., Nature and Purpose of the Pooja"
                          className="mt-2 font-semibold"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave blank to hide this section's title</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="nature">Nature of the Service</Label>
                        <Textarea
                          id="nature"
                          value={formData.nature || ''}
                          onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                          placeholder="Describe the essential nature and character of this service..."
                          className="mt-2 min-h-[120px]"
                        />
                      </div>
                      
                      <div>
                        <Label>Purpose (Multiple items)</Label>
                        <div className="flex gap-3 mt-2">
                          <Input
                            value={purposeInput}
                            onChange={(e) => setPurposeInput(e.target.value)}
                            placeholder="Add a purpose or objective..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && purposeInput.trim()) {
                                setFormData({ ...formData, purpose: [...(formData.purpose || []), purposeInput.trim()] })
                                setPurposeInput('')
                                e.preventDefault()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (purposeInput.trim()) {
                                setFormData({ ...formData, purpose: [...(formData.purpose || []), purposeInput.trim()] })
                                setPurposeInput('')
                              }
                            }}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {(formData.purpose || []).map((item, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-blue-500/10 text-blue-700 dark:text-blue-400 mr-2"
                            >
                              {item}
                              <button
                                type="button"
                                className="ml-2 cursor-pointer hover:text-destructive shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  purpose: (formData.purpose || []).filter((_, i) => i !== index)
                                })}
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Significance */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-green-200">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-linear-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleSignificance" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleSignificance"
                        value={formData.sectionTitles?.significance || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, significance: e.target.value }
                        })}
                        placeholder="e.g., Significance and Benefits"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={significanceInput}
                        onChange={(e) => setSignificanceInput(e.target.value)}
                        placeholder="Add a significance point..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && significanceInput.trim()) {
                            setFormData({ ...formData, significance: [...(formData.significance || []), significanceInput.trim()] })
                            setSignificanceInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (significanceInput.trim()) {
                            setFormData({ ...formData, significance: [...(formData.significance || []), significanceInput.trim()] })
                            setSignificanceInput('')
                          }
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(formData.significance || []).map((item, index) => (
                        <Badge 
                          key={index} 
                          className="py-2 px-4 bg-green-500/10 text-green-700 dark:text-green-400 mr-2"
                        >
                          {item}
                          <button
                            type="button"
                            className="ml-2 cursor-pointer hover:text-destructive shrink-0"
                            onClick={() => setFormData({
                              ...formData,
                              significance: (formData.significance || []).filter((_, i) => i !== index)
                            })}
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scriptural Roots */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-purple-200">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleScriptural" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-2xl">📜</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleScriptural"
                        value={formData.sectionTitles?.scriptural || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, scriptural: e.target.value }
                        })}
                        placeholder="e.g., Scriptural Roots"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="scripturalSource">Source</Label>
                        <Input
                          id="scripturalSource"
                          value={formData.scripturalSource || ''}
                          onChange={(e) => setFormData({ ...formData, scripturalSource: e.target.value })}
                          placeholder="e.g., Vedas, Puranas, Upanishads..."
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="scripturalDescription">Description</Label>
                        <Textarea
                          id="scripturalDescription"
                          value={formData.scripturalDescription || ''}
                          onChange={(e) => setFormData({ ...formData, scripturalDescription: e.target.value })}
                          placeholder="Explain the scriptural basis and references..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* When to Perform */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-cyan-200">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleWhen" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleWhen"
                        value={formData.sectionTitles?.when || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, when: e.target.value }
                        })}
                        placeholder="e.g., When to Perform"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={whenToPerformInput}
                        onChange={(e) => setWhenToPerformInput(e.target.value)}
                        placeholder="e.g., On Mondays, During Kartik month..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && whenToPerformInput.trim()) {
                            setFormData({ ...formData, whenToPerform: [...(formData.whenToPerform || []), whenToPerformInput.trim()] })
                            setWhenToPerformInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (whenToPerformInput.trim()) {
                            setFormData({ ...formData, whenToPerform: [...(formData.whenToPerform || []), whenToPerformInput.trim()] })
                            setWhenToPerformInput('')
                          }
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(formData.whenToPerform || []).map((item, index) => (
                        <Badge 
                          key={index} 
                          className="py-2 px-4 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 mr-2"
                        >
                          {item}
                          <button
                            type="button"
                            className="ml-2 cursor-pointer hover:text-destructive shrink-0"
                            onClick={() => setFormData({
                              ...formData,
                              whenToPerform: (formData.whenToPerform || []).filter((_, i) => i !== index)
                            })}
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Where and Who */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-pink-200">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-pink-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div>
                      <Label htmlFor="sectionTitleWhere" className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-2xl">📍</span>
                        Section Title (displayed on live page)
                      </Label>
                      <Input
                        id="sectionTitleWhere"
                        value={formData.sectionTitles?.where || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sectionTitles: { ...formData.sectionTitles, where: e.target.value }
                        })}
                        placeholder="e.g., Where and Who Can Perform?"
                        className="mt-2 mb-2 font-semibold"
                      />
                      <p className="text-xs text-muted-foreground mb-4">Leave blank to hide this section's title</p>
                    </div>
                    
                    <Textarea
                      value={formData.whereAndWho || ''}
                      onChange={(e) => setFormData({ ...formData, whereAndWho: e.target.value })}
                      placeholder="Where can this be performed and who can perform it..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Special Notes for NRIs */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-indigo-200">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-indigo-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <span className="text-2xl">✈️</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Special Notes for NRIs</h3>
                        <p className="text-xs text-muted-foreground">Information for devotees living abroad</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Section Title</label>
                        <Input
                          value={formData.specialForNRIsTitle || ''}
                          onChange={(e) => setFormData({ ...formData, specialForNRIsTitle: e.target.value })}
                          placeholder="e.g., Special Notes for NRIs"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Introduction Paragraph</label>
                        <Textarea
                          value={formData.specialForNRIsIntro || ''}
                          onChange={(e) => setFormData({ ...formData, specialForNRIsIntro: e.target.value })}
                          placeholder="Introductory text that appears before the bullet points..."
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Key Points (Bullet List)</label>
                      <div className="flex gap-3">
                        <Input
                          value={specialForNRIsInput}
                          onChange={(e) => setSpecialForNRIsInput(e.target.value)}
                          placeholder="Add a note for NRIs..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && specialForNRIsInput.trim()) {
                              setFormData({ ...formData, specialForNRIs: [...(formData.specialForNRIs || []), specialForNRIsInput.trim()] })
                              setSpecialForNRIsInput('')
                              e.preventDefault()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (specialForNRIsInput.trim()) {
                              setFormData({ ...formData, specialForNRIs: [...(formData.specialForNRIs || []), specialForNRIsInput.trim()] })
                              setSpecialForNRIsInput('')
                            }
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(formData.specialForNRIs || []).map((item, index) => (
                        <Badge 
                          key={index} 
                          className="py-2 px-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 mr-2"
                        >
                          {item}
                          <button
                            type="button"
                            className="ml-2 cursor-pointer hover:text-destructive shrink-0"
                            onClick={() => setFormData({
                              ...formData,
                              specialForNRIs: (formData.specialForNRIs || []).filter((_, i) => i !== index)
                            })}
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Core Aspects */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm border-amber-200">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-amber-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Core Aspects</h3>
                        <p className="text-xs text-muted-foreground">Key components with title and description</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={coreAspectTitleInput}
                          onChange={(e) => setCoreAspectTitleInput(e.target.value)}
                          placeholder="Aspect title..."
                        />
                        <Input
                          value={coreAspectContentInput}
                          onChange={(e) => setCoreAspectContentInput(e.target.value)}
                          placeholder="Aspect content..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && coreAspectTitleInput.trim() && coreAspectContentInput.trim()) {
                              setFormData({ 
                                ...formData, 
                                coreAspects: [...(formData.coreAspects || []), { title: coreAspectTitleInput.trim(), content: coreAspectContentInput.trim() }] 
                              })
                              setCoreAspectTitleInput('')
                              setCoreAspectContentInput('')
                              e.preventDefault()
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          if (coreAspectTitleInput.trim() && coreAspectContentInput.trim()) {
                            setFormData({ 
                              ...formData, 
                              coreAspects: [...(formData.coreAspects || []), { title: coreAspectTitleInput.trim(), content: coreAspectContentInput.trim() }] 
                            })
                            setCoreAspectTitleInput('')
                            setCoreAspectContentInput('')
                          }
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Core Aspect
                      </Button>
                      
                      <div className="mt-4 space-y-3">
                        {(formData.coreAspects || []).map((aspect, index) => (
                          <div key={index} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{aspect.title}</h4>
                                <p className="text-xs text-muted-foreground">{aspect.content}</p>
                              </div>
                              <button
                                type="button"
                                className="cursor-pointer text-muted-foreground hover:text-destructive ml-2 shrink-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  coreAspects: (formData.coreAspects || []).filter((_, i) => i !== index)
                                })}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setImagePickerCategory('all')
                                setShowImagePicker(true)
                              }}
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
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setImagePickerCategory('all')
                          setShowImagePicker(true)
                        }}
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
        </DialogContent>
      </Dialog>

      {/* Image Picker Modal */}
      {showImagePicker && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
              style={{ zIndex: 9999 }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setShowImagePicker(false)
                }
              }}
            >
              <div 
                className="bg-background rounded-2xl max-w-4xl w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-primary/5 to-accent/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ImageIcon size={20} className="text-primary" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Select Image</h3>
                      <p className="text-xs text-muted-foreground">Choose from your media library</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowImagePicker(false)}
                    className="rounded-full"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <div className="p-5 border-b bg-muted/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label className="text-sm font-medium">Filter by Category:</Label>
                      <Select value={imagePickerCategory} onValueChange={setImagePickerCategory}>
                        <SelectTrigger className="w-[200px]" onMouseDown={(e) => e.stopPropagation()}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ zIndex: 10000 }}>
                          <SelectItem value="all">All Categories ({photos.length})</SelectItem>
                          <SelectItem value="books">📚 Books ({photos.filter(p => p.category === 'books').length})</SelectItem>
                          <SelectItem value="gallery">🖼️ Gallery ({photos.filter(p => p.category === 'gallery').length})</SelectItem>
                          <SelectItem value="ceremony">🪔 Ceremony ({photos.filter(p => p.category === 'ceremony').length})</SelectItem>
                          <SelectItem value="pooja">🙏 Pooja ({photos.filter(p => p.category === 'pooja').length})</SelectItem>
                          <SelectItem value="wedding">💒 Wedding ({photos.filter(p => p.category === 'wedding').length})</SelectItem>
                          <SelectItem value="charity">❤️ Charity ({photos.filter(p => p.category === 'charity').length})</SelectItem>
                          <SelectItem value="events">🎉 Events ({photos.filter(p => p.category === 'events').length})</SelectItem>
                          <SelectItem value="general">📁 General ({photos.filter(p => p.category === 'general').length})</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {photos.filter(photo => imagePickerCategory === 'all' ? true : photo.category === imagePickerCategory).length} images
                    </Badge>
                  </div>
                </div>
                <div className="p-5 overflow-y-auto flex-1 min-h-0">
                  {(() => {
                    const filteredPhotos = imagePickerCategory === 'all' 
                      ? photos 
                      : photos.filter(photo => photo.category === imagePickerCategory)
                    return filteredPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {filteredPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: photo.url })
                          setShowImagePicker(false)
                          toast.success('Image selected')
                        }}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="bg-white text-primary font-semibold px-3 py-1.5 rounded-full text-xs shadow-lg">
                            Select
                          </div>
                        </div>
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 capitalize">
                            {photo.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white text-[10px] font-medium truncate drop-shadow-lg">{photo.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon size={32} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-2">No images found</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {imagePickerCategory === 'all' 
                          ? 'No images available. Upload images in the Media section first.'
                          : `No images in the "${imagePickerCategory}" category. Try selecting "All Categories" or upload images first.`
                        }
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/admin', '_blank')}
                      >
                        Go to Media Section
                      </Button>
                    </div>
                  )
                  })()}
                </div>
              </div>
            </div>
          )}

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
