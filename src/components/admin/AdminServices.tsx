import { useState, useRef } from 'react'
import { useAdminServices, convertLegacyService } from '../../hooks/useServices'
import { uploadDocument, deleteFile, BUCKETS, extractPathFromUrl, isSupabaseStorageUrl } from '../../lib/storage'
import { Plus, PencilSimple, Trash, FloppyDisk, X, MagnifyingGlass, FunnelSimple, UploadSimple, FilePdf, FileDoc, Spinner, Package, CloudArrowUp } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { QuillEditor } from '../ui/quill-editor'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { categoryNames } from '../../lib/data'
import type { AdminServiceRow } from '../../lib/supabase'
import { generateSlug } from '../../lib/supabase'

type ServiceCategory = 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness'

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
  price: string
  bestFor: string[]
  details?: {
    deity?: { name: string; description: string; significance: string }
    nature?: string
    purpose?: string[]
    significance?: string[]
    scripturalRoots?: { source: string; description: string }
    whenToPerform?: string[]
    whereAndWho?: string
    specialForNRIs?: string[]
  }
  samagriFile?: { name: string; data: string; type: string }
  samagriFileUrl?: string
}

export default function AdminServices() {
  const { services, isLoading, createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useAdminServices()
  const [editingService, setEditingService] = useState<AdminServiceRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | ServiceCategory>('all')
  const [currentTab, setCurrentTab] = useState('basic')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSamagriFile, setSelectedSamagriFile] = useState<File | null>(null)
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
    price: '',
    bestFor: []
  })

  // Helper states for array inputs
  const [benefitInput, setBenefitInput] = useState('')
  const [includesInput, setIncludesInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [bestForInput, setBestForInput] = useState('')

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

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
      price: '',
      bestFor: []
    })
    setBenefitInput('')
    setIncludesInput('')
    setRequirementInput('')
    setBestForInput('')
    setEditingService(null)
    setCurrentTab('basic')
    setSelectedSamagriFile(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (service: AdminServiceRow) => {
    setFormData({
      id: service.id,
      name: service.name,
      category: service.category,
      duration: service.duration,
      description: service.description,
      detailedDescription: service.detailed_description || '',
      benefits: service.benefits || [],
      includes: service.includes || [],
      requirements: service.requirements || [],
      price: service.price || '',
      bestFor: service.best_for || [],
      details: {
        deity: service.deity_info as ServiceFormData['details']['deity'] | undefined,
        nature: undefined,
        purpose: undefined,
        significance: undefined,
        scripturalRoots: service.scriptural_roots as ServiceFormData['details']['scripturalRoots'] | undefined,
        whenToPerform: service.when_to_perform || undefined,
        whereAndWho: service.where_and_who || undefined,
        specialForNRIs: service.special_for_nris || undefined
      },
      samagriFileUrl: service.samagri_file_url || undefined,
      samagriFile: service.samagri_file_url ? {
        name: service.samagri_file_name || 'Samagri List',
        type: service.samagri_file_url.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
        data: '' // Not needed for display
      } : undefined
    })
    setEditingService(service)
    setCurrentTab('basic')
    setSelectedSamagriFile(null)
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
      let samagriFileName = formData.samagriFile?.name || null

      // Upload new samagri file if selected
      if (selectedSamagriFile) {
        const result = await uploadDocument(selectedSamagriFile, 'samagri')
        samagriFileUrl = result.url
        samagriFileName = result.fileName

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
          category: formData.category,
          duration: formData.duration,
          description: formData.description,
          detailed_description: formData.detailedDescription || null,
          benefits: formData.benefits.length > 0 ? formData.benefits : null,
          includes: formData.includes.length > 0 ? formData.includes : null,
          requirements: formData.requirements.length > 0 ? formData.requirements : null,
          price: formData.price || null,
          best_for: formData.bestFor.length > 0 ? formData.bestFor : null,
          deity_info: formData.details?.deity || null,
          scriptural_roots: formData.details?.scripturalRoots || null,
          when_to_perform: formData.details?.whenToPerform || null,
          where_and_who: formData.details?.whereAndWho || null,
          special_for_nris: formData.details?.specialForNRIs || null,
          samagri_file_url: samagriFileUrl,
          samagri_file_name: samagriFileName
        })
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
          price: formData.price,
          bestFor: formData.bestFor,
          details: formData.details,
          samagriFile: formData.samagriFile
        })
        // Override with storage URL if we uploaded
        if (samagriFileUrl) {
          newService.samagri_file_url = samagriFileUrl
          newService.samagri_file_name = samagriFileName
        }
        await createService(newService)
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        await deleteService(id)
      } catch {
        // Error toast is handled by the hook
      }
    }
  }

  const handleDuplicate = async (service: AdminServiceRow) => {
    const duplicated = convertLegacyService({
      name: `${service.name} (Copy)`,
      category: service.category,
      duration: service.duration,
      description: service.description,
      detailedDescription: service.detailed_description || undefined,
      benefits: service.benefits || undefined,
      includes: service.includes || undefined,
      requirements: service.requirements || undefined,
      price: service.price || undefined,
      bestFor: service.best_for || undefined
    })
    try {
      await createService(duplicated)
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as 'all' | ServiceCategory)}>
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> of{' '}
            <span className="font-semibold text-foreground">{services.length}</span> services
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
                <Button onClick={() => { setSearchQuery(''); setFilterCategory('all') }} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-xl">{service.name}</h3>
                      {service.deity_info && (
                        <Badge variant="secondary" className="text-xs">
                          📚 Detailed
                        </Badge>
                      )}
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

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">⏱️</span> {service.duration}
                  </span>
                  {service.price && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">💰</span> {service.price}
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(service)}
                    disabled={isCreating}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
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

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98vw] lg:max-w-[1600px] max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-heading">
              {editingService ? `Edit: ${editingService.name}` : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <div className="sticky top-0 bg-background z-10 pb-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-muted/50 p-2">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    📝 Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    ✨ Benefits & Lists
                  </TabsTrigger>
                  <TabsTrigger value="comprehensive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    📚 Spiritual Details
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    👁️ Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Essential Information</CardTitle>
                    <CardDescription>Core details that appear on service cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">Service Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Satyanarayana Pooja"
                          className="text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-base">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value: Service['category']) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger id="category" className="text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pooja">Poojas</SelectItem>
                            <SelectItem value="sanskar">Sanskars</SelectItem>
                            <SelectItem value="paath">Paath/Recitations</SelectItem>
                            <SelectItem value="consultation">Consultations</SelectItem>
                            <SelectItem value="wellness">Meditation & Yoga</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-base">Duration *</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="e.g., 2.5 hours"
                          className="text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-base">Price</Label>
                        <Input
                          id="price"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g., €150 or 'Contact for pricing'"
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base">Short Description *</Label>
                      <QuillEditor
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        placeholder="Brief description shown on service cards (1-2 sentences)..."
                        minHeight="120px"
                      />
                      <p className="text-xs text-muted-foreground">This appears on the service card preview. Use formatting to highlight key points.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detailedDescription" className="text-base">Detailed Description</Label>
                      <QuillEditor
                        value={formData.detailedDescription || ''}
                        onChange={(value) => setFormData({ ...formData, detailedDescription: value })}
                        placeholder="Full description shown in the service modal. Add headings, lists, and formatting as needed..."
                        minHeight="250px"
                      />
                      <p className="text-xs text-muted-foreground">Full description with rich formatting for the service detail modal</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details & Lists Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits</CardTitle>
                    <CardDescription>List the spiritual and practical benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="Add a benefit..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && benefitInput.trim()) {
                            setFormData({ ...formData, benefits: [...(formData.benefits || []), benefitInput.trim()] })
                            setBenefitInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (benefitInput.trim()) {
                            setFormData({ ...formData, benefits: [...(formData.benefits || []), benefitInput.trim()] })
                            setBenefitInput('')
                          }
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/30">
                      {(formData.benefits || []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No benefits added yet</p>
                      ) : (
                        (formData.benefits || []).map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="py-2 px-3 text-sm">
                            {benefit}
                            <X
                              size={14}
                              className="ml-2 cursor-pointer hover:text-destructive"
                              onClick={() => setFormData({
                                ...formData,
                                benefits: (formData.benefits || []).filter((_, i) => i !== index)
                              })}
                            />
                          </Badge>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">What's Included</CardTitle>
                    <CardDescription>Items and elements included in the service</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={includesInput}
                        onChange={(e) => setIncludesInput(e.target.value)}
                        placeholder="Add an included item..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && includesInput.trim()) {
                            setFormData({ ...formData, includes: [...(formData.includes || []), includesInput.trim()] })
                            setIncludesInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (includesInput.trim()) {
                            setFormData({ ...formData, includes: [...(formData.includes || []), includesInput.trim()] })
                            setIncludesInput('')
                          }
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/30">
                      {(formData.includes || []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No items added yet</p>
                      ) : (
                        (formData.includes || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="py-2 px-3 text-sm">
                            {item}
                            <X
                              size={14}
                              className="ml-2 cursor-pointer hover:text-destructive"
                              onClick={() => setFormData({
                                ...formData,
                                includes: (formData.includes || []).filter((_, i) => i !== index)
                              })}
                            />
                          </Badge>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Requirements</CardTitle>
                      <CardDescription>What participants need to prepare</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={requirementInput}
                          onChange={(e) => setRequirementInput(e.target.value)}
                          placeholder="Add a requirement..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && requirementInput.trim()) {
                              setFormData({ ...formData, requirements: [...(formData.requirements || []), requirementInput.trim()] })
                              setRequirementInput('')
                              e.preventDefault()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (requirementInput.trim()) {
                              setFormData({ ...formData, requirements: [...(formData.requirements || []), requirementInput.trim()] })
                              setRequirementInput('')
                            }
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/30">
                        {(formData.requirements || []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No requirements added yet</p>
                        ) : (
                          (formData.requirements || []).map((req, index) => (
                            <Badge key={index} variant="secondary" className="py-2 px-3 text-sm">
                              {req}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer hover:text-destructive"
                                onClick={() => setFormData({
                                  ...formData,
                                  requirements: (formData.requirements || []).filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Best For (Tags)</CardTitle>
                      <CardDescription>Suitable occasions or people</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={bestForInput}
                          onChange={(e) => setBestForInput(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && bestForInput.trim()) {
                              setFormData({ ...formData, bestFor: [...(formData.bestFor || []), bestForInput.trim()] })
                              setBestForInput('')
                              e.preventDefault()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (bestForInput.trim()) {
                              setFormData({ ...formData, bestFor: [...(formData.bestFor || []), bestForInput.trim()] })
                              setBestForInput('')
                            }
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/30">
                        {(formData.bestFor || []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No tags added yet</p>
                        ) : (
                          (formData.bestFor || []).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="py-2 px-3 text-sm">
                              {tag}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer hover:text-destructive"
                                onClick={() => setFormData({
                                  ...formData,
                                  bestFor: (formData.bestFor || []).filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pooja Samagri File Upload */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">📋 Pooja Samagri (Materials List)</CardTitle>
                    <CardDescription>Upload a PDF or DOCX file with the list of required materials for this pooja</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                      {(formData.samagriFile || formData.samagriFileUrl || selectedSamagriFile) ? (
                        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                          <div className="flex items-center gap-3">
                            {(selectedSamagriFile?.type || formData.samagriFile?.type || '').includes('pdf') || formData.samagriFileUrl?.endsWith('.pdf') ? (
                              <FilePdf size={32} className="text-red-500" weight="fill" />
                            ) : (
                              <FileDoc size={32} className="text-blue-500" weight="fill" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{selectedSamagriFile?.name || formData.samagriFile?.name || 'Samagri List'}</p>
                                {formData.samagriFileUrl && isSupabaseStorageUrl(formData.samagriFileUrl) && (
                                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CloudArrowUp size={10} />
                                    Stored
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {selectedSamagriFile 
                                  ? `${(selectedSamagriFile.size / 1024).toFixed(0)} KB - Ready to upload`
                                  : formData.samagriFileUrl 
                                    ? 'Stored in cloud'
                                    : formData.samagriFile?.data 
                                      ? `${(formData.samagriFile.data.length * 0.75 / 1024).toFixed(0)} KB`
                                      : ''
                                }
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormData({ ...formData, samagriFile: undefined, samagriFileUrl: undefined })
                                setSelectedSamagriFile(null)
                              }}
                            >
                              <Trash size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-lg p-8 text-center space-y-3 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => samagriFileInputRef.current?.click()}
                        >
                          <input
                            ref={samagriFileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                          <div className="flex justify-center">
                            <UploadSimple size={48} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Click to Upload Samagri List</p>
                            <p className="text-xs text-muted-foreground">PDF or DOCX files accepted (max 50MB)</p>
                            <p className="text-xs text-primary mt-2">Files are stored securely in the cloud</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Spiritual Details Tab */}
              <TabsContent value="comprehensive" className="space-y-6 mt-6">
                <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    💡 Spiritual & Scriptural Details
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This section is for adding comprehensive spiritual information about the deity, scriptural references,
                    when to perform the pooja, and why it's meaningful for families abroad. This creates a rich, educational
                    experience that helps families understand the deeper significance of each service.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Formatting Tips:</strong></p>
                    <p>• Use line breaks to separate paragraphs</p>
                    <p>• For lists, enter one item per line</p>
                    <p>• Use "–" (dash) to separate titles from descriptions in significance points</p>
                    <p>• Keep language clear and accessible for all audiences</p>
                    <p>• Leave fields empty if not applicable to this service</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Deity Information */}
                  <Card className="border-amber-200 bg-linear-to-br from-amber-50/50 to-orange-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        🕉️ Deity Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deity-name">Deity Name</Label>
                        <Input
                          id="deity-name"
                          value={formData.details?.deity?.name || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              deity: {
                                ...formData.details?.deity,
                                name: e.target.value,
                                description: formData.details?.deity?.description || '',
                                significance: formData.details?.deity?.significance || ''
                              }
                            }
                          })}
                          placeholder="e.g., Sri Satyanarayana Swamy"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deity-description">Description</Label>
                        <Textarea
                          id="deity-description"
                          value={formData.details?.deity?.description || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              deity: {
                                ...formData.details?.deity,
                                name: formData.details?.deity?.name || '',
                                description: e.target.value,
                                significance: formData.details?.deity?.significance || ''
                              }
                            }
                          })}
                          placeholder="Brief introduction..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deity-significance">Significance</Label>
                        <Textarea
                          id="deity-significance"
                          value={formData.details?.deity?.significance || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              deity: {
                                ...formData.details?.deity,
                                name: formData.details?.deity?.name || '',
                                description: formData.details?.deity?.description || '',
                                significance: e.target.value
                              }
                            }
                          })}
                          placeholder="Deeper meaning..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nature and Purpose */}
                  <Card className="border-blue-200 bg-linear-to-br from-blue-50/50 to-indigo-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📖 Nature & Purpose
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nature">Nature of Pooja</Label>
                        <Textarea
                          id="nature"
                          value={formData.details?.nature || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: { ...formData.details, nature: e.target.value }
                          })}
                          placeholder="What is this pooja about..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Purpose Points (one per line)</Label>
                        <Textarea
                          value={(formData.details?.purpose || []).join('\n')}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              purpose: e.target.value.split('\n').filter(line => line.trim())
                            }
                          })}
                          placeholder="Health and long life&#10;Success in endeavours&#10;Prosperity"
                          rows={6}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Significance */}
                  <Card className="border-green-200 bg-linear-to-br from-green-50/50 to-emerald-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        ⭐ Significance & Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Label>Significance Points (one per line)</Label>
                      <Textarea
                        value={(formData.details?.significance || []).join('\n')}
                        onChange={(e) => setFormData({
                          ...formData,
                          details: {
                            ...formData.details,
                            significance: e.target.value.split('\n').filter(line => line.trim())
                          }
                        })}
                        placeholder="Removal of obstacles – Clears blockages&#10;Success – Supports goals"
                        rows={10}
                      />
                      <p className="text-xs text-muted-foreground">Use "–" to separate title and description</p>
                    </CardContent>
                  </Card>

                  {/* Scriptural Roots */}
                  <Card className="border-purple-200 bg-linear-to-br from-purple-50/50 to-violet-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📜 Scriptural Roots
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="scriptural-source">Source</Label>
                        <Input
                          id="scriptural-source"
                          value={formData.details?.scripturalRoots?.source || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              scripturalRoots: {
                                source: e.target.value,
                                description: formData.details?.scripturalRoots?.description || ''
                              }
                            }
                          })}
                          placeholder="e.g., Skanda Purana"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scriptural-description">Description</Label>
                        <Textarea
                          id="scriptural-description"
                          value={formData.details?.scripturalRoots?.description || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            details: {
                              ...formData.details,
                              scripturalRoots: {
                                source: formData.details?.scripturalRoots?.source || '',
                                description: e.target.value
                              }
                            }
                          })}
                          placeholder="Scriptural background..."
                          rows={7}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* When to Perform */}
                  <Card className="border-cyan-200 bg-linear-to-br from-cyan-50/50 to-sky-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📅 When to Perform
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Label>Auspicious Times (one per line)</Label>
                      <Textarea
                        value={(formData.details?.whenToPerform || []).join('\n')}
                        onChange={(e) => setFormData({
                          ...formData,
                          details: {
                            ...formData.details,
                            whenToPerform: e.target.value.split('\n').filter(line => line.trim())
                          }
                        })}
                        placeholder="Purnima (Full Moon)&#10;Ekadashi&#10;Life milestones"
                        rows={10}
                      />
                    </CardContent>
                  </Card>

                  {/* Where and Who */}
                  <Card className="border-pink-200 bg-linear-to-br from-pink-50/50 to-rose-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📍 Where & Who
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Label htmlFor="where-who">Description</Label>
                      <Textarea
                        id="where-who"
                        value={formData.details?.whereAndWho || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          details: { ...formData.details, whereAndWho: e.target.value }
                        })}
                        placeholder="Where pooja can be conducted and who can participate..."
                        rows={10}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Special for NRIs - Full Width */}
                <Card className="border-orange-200 bg-linear-to-br from-orange-50/50 to-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      ❤️ Special for NRIs / Families Abroad
                    </CardTitle>
                    <CardDescription>Why this service is meaningful for families living outside India</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Label>Reasons (one per line)</Label>
                    <Textarea
                      value={(formData.details?.specialForNRIs || []).join('\n')}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: {
                          ...formData.details,
                          specialForNRIs: e.target.value.split('\n').filter(line => line.trim())
                        }
                      })}
                      placeholder="Simple to perform at home&#10;Brings family together&#10;Teaches children tradition"
                      rows={8}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Service Preview</CardTitle>
                    <CardDescription>How your service will appear to users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border rounded-lg p-6 bg-linear-to-br from-primary/5 to-accent/5">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-heading font-bold">{formData.name || 'Service Name'}</h3>
                        <Badge>{categoryNames[formData.category]}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{formData.description || 'No description yet'}</p>
                      <div className="flex gap-4 text-sm">
                        <span>⏱️ {formData.duration || 'Duration not set'}</span>
                        {formData.price && <span>💰 {formData.price}</span>}
                      </div>
                    </div>

                    {(formData.benefits && formData.benefits.length > 0) && (
                      <div>
                        <h4 className="font-semibold mb-3">Benefits</h4>
                        <div className="space-y-2">
                          {formData.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.details?.deity && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">🕉️ {formData.details.deity.name}</h4>
                        <p className="text-sm text-muted-foreground">{formData.details.deity.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t bg-background">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="min-w-[120px]" disabled={isSaving}>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
