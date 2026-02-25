import { useState } from 'react'
import { useAdminServices } from '../../hooks/useServices'
import { sanitizeHTML } from '../../utils/sanitize'
import { usePhotos, usePhotoCategories, findCategoryByKeyword } from '../../hooks/usePhotos'
import { useAuth } from '../../hooks/useAuth'
import { QuillEditor } from '../ui/quill-editor'
import {
  Plus, PencilSimple, Trash, FloppyDisk, X, MagnifyingGlass, FunnelSimple, Spinner, Package,
  Image as ImageIcon, Clock, CaretLeft, CaretRight, CaretUp, CaretDown, GlobeSimple,
  CheckCircle, Star, Heart, ShieldCheck, ArrowRight, Lightning, Crown, Leaf, Bell, Diamond,
  Users, User, MapPin, CalendarBlank, Gift, Fire, Eye, Sun, Moon, BookOpen, Phone, Sparkle,
  Check, Asterisk, Flame, Flower, HandsPraying, SealCheck, MedalMilitary, EyeSlash
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { categoryNames } from '../../lib/constants'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import type { AdminServiceRow } from '../../lib/supabase'
import { generateSlug, supabase } from '../../lib/supabase'

type ServiceCategory = 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness' | 'packages'

const SECTION_COLORS = [
  { label: 'Default',   value: '' },
  { label: 'Saffron',   value: '#FFF8F0' },
  { label: 'Purple',    value: '#FAF5FF' },
  { label: 'Sky Blue',  value: '#EFF6FF' },
  { label: 'Green',     value: '#F0FFF4' },
  { label: 'Gold',      value: '#FFFBEB' },
  { label: 'Rose',      value: '#FFF1F2' },
  { label: 'Dark',      value: '#0F172A' },
]

const genId = () => Math.random().toString(36).slice(2, 9)

const DEFAULT_BG_COLORS = ['#FFF8F0', '#FAF5FF', '#EFF6FF', '#F0FFF4', '#FFFBEB', '#FFF1F2']

const getYTThumbnail = (url: string): string => {
  const m = url.match(/(?:v=|\/embed\/|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg` : ''
}

const makeBullet = (): BulletItem => ({ id: genId(), icon: 'CheckCircle', text: '' })

const makeSection = (idx?: number): ContentSection => ({
  id: genId(),
  icon: '',
  enabled: true,
  title: '',
  description: '',
  bullets: [],
  images: ['', '', ''],
  videos: [{ url: '', thumbnail: '' }, { url: '', thumbnail: '' }, { url: '', thumbnail: '' }],
  bgColor: idx !== undefined ? DEFAULT_BG_COLORS[idx % DEFAULT_BG_COLORS.length] : '',
})

const BULLET_ICONS: { name: string; Component: React.FC<any>; label: string }[] = [
  { name: 'CheckCircle',   Component: CheckCircle,   label: 'Check Circle' },
  { name: 'Check',         Component: Check,         label: 'Check' },
  { name: 'SealCheck',     Component: SealCheck,     label: 'Seal Check' },
  { name: 'Star',          Component: Star,          label: 'Star' },
  { name: 'Sparkle',       Component: Sparkle,       label: 'Sparkle' },
  { name: 'Heart',         Component: Heart,         label: 'Heart' },
  { name: 'Diamond',       Component: Diamond,       label: 'Diamond' },
  { name: 'Crown',         Component: Crown,         label: 'Crown' },
  { name: 'MedalMilitary', Component: MedalMilitary, label: 'Medal' },
  { name: 'ShieldCheck',   Component: ShieldCheck,   label: 'Shield' },
  { name: 'Lightning',     Component: Lightning,     label: 'Lightning' },
  { name: 'Fire',          Component: Fire,          label: 'Fire' },
  { name: 'Flame',         Component: Flame,         label: 'Flame' },
  { name: 'Sun',           Component: Sun,           label: 'Sun' },
  { name: 'Moon',          Component: Moon,          label: 'Moon' },
  { name: 'Eye',           Component: Eye,           label: 'Eye' },
  { name: 'Flower',        Component: Flower,        label: 'Flower' },
  { name: 'Leaf',          Component: Leaf,          label: 'Leaf' },
  { name: 'HandsPraying',  Component: HandsPraying,  label: 'Praying' },
  { name: 'Bell',          Component: Bell,          label: 'Bell' },
  { name: 'ArrowRight',    Component: ArrowRight,    label: 'Arrow' },
  { name: 'Asterisk',      Component: Asterisk,      label: 'Asterisk' },
  { name: 'BookOpen',      Component: BookOpen,      label: 'Book' },
  { name: 'Gift',          Component: Gift,          label: 'Gift' },
  { name: 'Phone',         Component: Phone,         label: 'Phone' },
  { name: 'MapPin',        Component: MapPin,        label: 'Map Pin' },
  { name: 'CalendarBlank', Component: CalendarBlank, label: 'Calendar' },
  { name: 'Users',         Component: Users,         label: 'Group' },
  { name: 'User',          Component: User,          label: 'Person' },
]

const BulletIconRenderer = ({ iconName, size = 16, className = '' }: { iconName: string; size?: number; className?: string }) => {
  const found = BULLET_ICONS.find(i => i.name === iconName)
  if (!found) return <CheckCircle size={size} className={className} weight="fill" />
  return <found.Component size={size} className={className} weight="fill" />
}

interface VideoItem {
  url: string
  thumbnail: string
}

interface BulletItem {
  id: string
  icon: string
  text: string
}

interface ContentSection {
  id: string
  icon: string
  enabled: boolean
  title: string
  description: string
  bullets: BulletItem[]
  images: string[]
  videos: VideoItem[]
  bgColor: string
}

interface BlogLink {
  title: string
  url: string
}

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface ServiceFormData {
  id: string
  name: string
  category: ServiceCategory
  duration: string
  description: string
  dakshina: string
  featuredImageUrl: string
  contentSections: ContentSection[]
  blogLinks: BlogLink[]
  faqs: FaqItem[]
  bookingButtonName: string
  bookingButtonUrl: string
}

export default function AdminServicesNew() {
  const { services, isLoading, createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useAdminServices()
  const { isAuthenticated } = useAuth()
  const [editingService, setEditingService] = useState<AdminServiceRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | ServiceCategory>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [activeImagePicker, setActiveImagePicker] = useState<{ sectionId: string; slot: number } | null>(null)
  const [activeBulletIconPicker, setActiveBulletIconPicker] = useState<string | null>(null) // `${sectionId}__${bulletId}`
  const [activeSectionIconPicker, setActiveSectionIconPicker] = useState<string | null>(null) // sectionId
  const [imagePickerCategory, setImagePickerCategory] = useState<string>('all')

  // Accurate categories + counts from the same source as AdminPhotos (site_metadata)
  const { categories: mediaCategories } = usePhotoCategories()

  // Images for the picker grid — re-fetches when the selected category changes
  const { photos: pickerPhotos, isLoading: pickerLoading } = usePhotos({
    category: imagePickerCategory === 'all' ? undefined : imagePickerCategory,
    limit: 500,
    enabled: isAuthenticated,
  })

  const getServicesImagePickerCategory = () => findCategoryByKeyword(mediaCategories, 'service')

  const openImagePicker = (args: { sectionId: string; slot: number }) => {
    setImagePickerCategory(getServicesImagePickerCategory())
    setActiveImagePicker(args)
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<AdminServiceRow | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  const emptyForm = (): ServiceFormData => ({
    id: '',
    name: '',
    category: 'pooja',
    duration: '',
    description: '',
    dakshina: '',
    featuredImageUrl: '',
    contentSections: [],
    blogLinks: [],
    faqs: [],
    bookingButtonName: '',
    bookingButtonUrl: '',
  })
  const [formData, setFormData] = useState<ServiceFormData>(emptyForm())

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
    setFormData(emptyForm())
    setEditingService(null)
    setActiveImagePicker(null)
    setImagePickerCategory(getServicesImagePickerCategory())
    setIsDialogOpen(true)
  }

  const handleEdit = (service: AdminServiceRow) => {
    // Parse content sections — supports both new format (has images/videos) and legacy (title/content)
    let contentSections: ContentSection[] = []
    const rawAspects = service.core_aspects as any
    if (Array.isArray(rawAspects) && rawAspects.length > 0) {
      contentSections = 'images' in rawAspects[0]
        ? (rawAspects as any[]).map((a: any, i: number) => ({ ...makeSection(i), ...a, bgColor: a.bgColor || DEFAULT_BG_COLORS[i % DEFAULT_BG_COLORS.length], bullets: Array.isArray(a.bullets) ? a.bullets : [], icon: a.icon || '', enabled: a.enabled !== false }))
        : rawAspects.map((a: any, i: number) => ({ ...makeSection(i), title: a.title || '', description: a.content || '' }))
    }

    // Parse blog links from special_notes
    let blogLinks: BlogLink[] = []
    const rawNotes = service.special_notes as any
    if (Array.isArray(rawNotes) && rawNotes.length > 0 && typeof rawNotes[0] === 'object' && 'url' in rawNotes[0]) {
      blogLinks = rawNotes as BlogLink[]
    }

    setFormData({
      id: service.id,
      name: service.name,
      category: service.category as ServiceCategory,
      duration: service.duration || '',
      description: service.description || '',
      dakshina: service.price || '',
      featuredImageUrl: service.featured_image_url || '',
      contentSections,
      blogLinks,
      ...(() => {
        const raw = service.where_and_who || ''
        try {
          const p = JSON.parse(raw)
          return {
            bookingButtonName: p.name || '',
            bookingButtonUrl: p.url || '',
            faqs: Array.isArray(p.faqs) ? p.faqs : [],
          }
        } catch { return { bookingButtonName: '', bookingButtonUrl: raw, faqs: [] } }
      })(),
    })
    setEditingService(service)
    setActiveImagePicker(null)
    setImagePickerCategory(getServicesImagePickerCategory())
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.duration || !formData.description) {
      toast.error('Please fill in all required fields (Name, Duration, Description)')
      return
    }

    try {
      setIsUploading(true)

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
          duration: formData.duration,
          price: formData.dakshina || null,
          featured_image_url: formData.featuredImageUrl || null,
          is_package: formData.category === 'packages',
          core_aspects: formData.contentSections.length > 0 ? (formData.contentSections as any) : null,
          special_notes: formData.blogLinks.length > 0 ? (formData.blogLinks as any) : null,
          where_and_who: (formData.bookingButtonName || formData.bookingButtonUrl || formData.faqs.length > 0) ? JSON.stringify({ name: formData.bookingButtonName, url: formData.bookingButtonUrl, faqs: formData.faqs.length > 0 ? formData.faqs : undefined }) : null,
        })
      } else {
        const newService: any = {
          name: formData.name,
          slug: generateSlug(formData.name),
          category_id,
          short_description: formData.description,
          duration: formData.duration,
          price: formData.dakshina || null,
          featured_image_url: formData.featuredImageUrl || null,
          is_package: formData.category === 'packages',
          is_popular: false,
          is_published: true,
          core_aspects: formData.contentSections.length > 0 ? (formData.contentSections as any) : null,
          special_notes: formData.blogLinks.length > 0 ? (formData.blogLinks as any) : null,
          where_and_who: (formData.bookingButtonName || formData.bookingButtonUrl || formData.faqs.length > 0) ? JSON.stringify({ name: formData.bookingButtonName, url: formData.bookingButtonUrl, faqs: formData.faqs.length > 0 ? formData.faqs : undefined }) : null,
        }
        await createService(newService)
      }

      setIsDialogOpen(false)
      setEditingService(null)
      setActiveImagePicker(null)
      toast.success(editingService ? 'Service updated successfully!' : 'Service created successfully!')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error?.message || 'Failed to save service')
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
                   dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }}
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
                  {service.core_aspects && (service.core_aspects as any[]).length > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">✨</span> {(service.core_aspects as any[]).length} sections
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

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={isDialogOpen && !activeImagePicker} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[72vw]! max-w-[72vw]! max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0 border shadow-2xl bg-white">

          {/* Header */}
          <DialogHeader className="relative px-7 pt-6 pb-5 bg-linear-to-r from-primary/10 via-accent/5 to-secondary/10 border-b shrink-0">
            <div className="absolute top-0 right-0 w-56 h-56 bg-linear-to-br from-primary/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/25 shrink-0">
                {editingService
                  ? <PencilSimple size={22} className="text-white" weight="bold" />
                  : <Plus size={22} className="text-white" weight="bold" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-heading font-bold">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                  {editingService
                    ? `Updating "${editingService.name}"`
                    : 'Build your service with a fixed details card and unlimited dynamic content sections'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto bg-muted/20 min-h-0">
            <div className="p-6 space-y-5">

              {/* ▸ FIXED DETAILS CARD */}
              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-2 border-b bg-linear-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-primary">Service Details</h3>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {/* Name + Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="svc-name" className="text-sm font-medium">
                        Service Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="svc-name"
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Satyanarayana Pooja"
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="svc-cat" className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        key={`cat-${editingService?.id ?? 'new'}`}
                        value={formData.category}
                        onValueChange={v => setFormData(f => ({ ...f, category: v as ServiceCategory }))}
                      >
                        <SelectTrigger id="svc-cat" className="h-11 bg-background">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pooja">🪔 Poojas</SelectItem>
                          <SelectItem value="sanskar">🎊 Sanskars</SelectItem>
                          <SelectItem value="paath">📿 Paath / Recitations</SelectItem>
                          <SelectItem value="consultation">🔮 Consultations</SelectItem>
                          <SelectItem value="wellness">🧘 Meditation & Yoga</SelectItem>
                          <SelectItem value="packages">📦 Service Packages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Duration + Dakshina */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="svc-dur" className="text-sm font-medium flex items-center gap-1.5">
                        <Clock size={14} className="text-muted-foreground" />
                        Duration <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="svc-dur"
                        value={formData.duration}
                        onChange={e => setFormData(f => ({ ...f, duration: e.target.value }))}
                        placeholder="e.g., 2-3 hours"
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="svc-dakshina" className="text-sm font-medium">
                        Dakshina (दक्षिणा)
                      </Label>
                      <Input
                        id="svc-dakshina"
                        value={formData.dakshina}
                        onChange={e => setFormData(f => ({ ...f, dakshina: e.target.value }))}
                        placeholder="e.g., €150 or 'Contact for pricing'"
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>

                  {/* Short description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="svc-desc" className="text-sm font-medium">
                      Short Description <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">Shown on listing cards (1-2 sentences)</p>
                    <Textarea
                      id="svc-desc"
                      value={formData.description}
                      onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                      placeholder="Brief overview of this service..."
                      rows={2}
                      className="bg-background resize-none"
                    />
                  </div>

                  {/* Featured Image */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Featured Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.featuredImageUrl ? (
                        <div className="relative group shrink-0">
                          <img
                            src={formData.featuredImageUrl}
                            alt="Featured"
                            className="w-28 h-28 object-cover rounded-xl border-2 border-primary/20 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openImagePicker({ sectionId: 'featured', slot: 0 })}
                              className="p-1.5 bg-white rounded-lg text-primary hover:scale-110 transition-transform"
                            >
                              <PencilSimple size={13} weight="bold" />
                            </button>
                            <button
                              onClick={() => setFormData(f => ({ ...f, featuredImageUrl: '' }))}
                              className="p-1.5 bg-white rounded-lg text-destructive hover:scale-110 transition-transform"
                            >
                              <Trash size={13} weight="bold" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => openImagePicker({ sectionId: 'featured', slot: 0 })}
                          className="w-28 h-28 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shrink-0"
                        >
                          <ImageIcon size={22} />
                          <span className="text-xs font-medium">Add Image</span>
                        </button>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Appears on the service listing card and at the top of the service detail page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ▸ DYNAMIC CONTENT SECTIONS */}
              {formData.contentSections.map((section, secIdx) => (
                <div
                  key={section.id}
                  className={`rounded-lg border border-border/40 shadow-sm overflow-hidden transition-shadow hover:shadow-md ${!section.enabled ? 'opacity-50' : ''}`}
                  style={{ backgroundColor: section.bgColor || undefined }}
                >
                  {/* Section header bar */}
                  <div className={`px-5 pt-4 pb-3 border-b flex items-start gap-3 ${section.bgColor ? '' : 'bg-card'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5">

                        {/* ── Section icon picker ── */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setActiveSectionIconPicker(activeSectionIconPicker === section.id ? null : section.id)}
                            title="Choose section icon"
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              section.icon
                                ? 'bg-primary/15 border-primary/40 text-primary hover:bg-primary/25'
                                : 'bg-muted/60 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            {section.icon
                              ? <BulletIconRenderer iconName={section.icon} size={14} />
                              : <Asterisk size={13} />}
                          </button>
                          {activeSectionIconPicker === section.id && (
                            <div className="absolute z-50 top-9 left-0 bg-popover border border-border rounded-xl shadow-xl p-2 w-56">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 px-1">Section Icon</div>
                              <div className="grid grid-cols-7 gap-1">
                                {/* None option */}
                                <button
                                  title="No icon"
                                  onClick={() => {
                                    setFormData(f => ({ ...f, contentSections: f.contentSections.map(s => s.id === section.id ? { ...s, icon: '' } : s) }))
                                    setActiveSectionIconPicker(null)
                                  }}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-[10px] font-bold ${
                                    section.icon === '' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                                  }`}
                                >—</button>
                                {BULLET_ICONS.map(ico => (
                                  <button
                                    key={ico.name}
                                    title={ico.label}
                                    onClick={() => {
                                      setFormData(f => ({ ...f, contentSections: f.contentSections.map(s => s.id === section.id ? { ...s, icon: ico.name } : s) }))
                                      setActiveSectionIconPicker(null)
                                    }}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                                      section.icon === ico.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground/70'
                                    }`}
                                  >
                                    <ico.Component size={14} weight="fill" />
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => setActiveSectionIconPicker(null)} className="mt-2 w-full text-[10px] text-muted-foreground hover:text-foreground text-center py-0.5">Close</button>
                            </div>
                          )}
                        </div>

                        <Input
                          value={section.title}
                          onChange={e => setFormData(f => ({
                            ...f,
                            contentSections: f.contentSections.map(s =>
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            )
                          }))}
                          placeholder="Section title (optional)…"
                          className="h-8 text-sm font-semibold border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:font-normal placeholder:text-muted-foreground/60"
                        />
                        {!section.enabled && (
                          <Badge variant="outline" className="text-[10px] shrink-0 border-orange-400/60 text-orange-500 bg-orange-50/50">Hidden</Badge>
                        )}
                        <span className="text-xs text-muted-foreground/60 shrink-0 font-mono">#{secIdx + 1}</span>
                      </div>
                      {/* Color palette */}
                      <div className="flex items-center gap-1.5 flex-wrap pl-3">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mr-0.5">BG:</span>
                        {SECTION_COLORS.map(color => (
                          <button
                            key={color.value}
                            title={color.label}
                            onClick={() => setFormData(f => ({
                              ...f,
                              contentSections: f.contentSections.map(s =>
                                s.id === section.id ? { ...s, bgColor: color.value } : s
                              )
                            }))}
                            className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
                              section.bgColor === color.value
                                ? 'border-primary ring-2 ring-primary/30 scale-110'
                                : 'border-border/60 hover:border-border'
                            }`}
                            style={{
                              backgroundColor: color.value || 'var(--card)',
                              ...(color.value === '#0F172A' && { borderColor: '#475569' }),
                            }}
                          />
                        ))}
                        {/* Native color picker */}
                        <label
                          title="Pick custom color"
                          className="w-5 h-5 rounded-full border-2 border-border/60 overflow-hidden cursor-pointer hover:scale-110 transition-all hover:border-border shrink-0"
                          style={{ backgroundColor: section.bgColor || 'var(--card)' }}
                        >
                          <input
                            type="color"
                            value={section.bgColor || '#ffffff'}
                            onChange={e => setFormData(f => ({
                              ...f,
                              contentSections: f.contentSections.map(s =>
                                s.id === section.id ? { ...s, bgColor: e.target.value } : s
                              )
                            }))}
                            className="opacity-0 w-0 h-0 absolute"
                          />
                        </label>
                        {/* Hex code input */}
                        <input
                          type="text"
                          value={section.bgColor || ''}
                          onChange={e => {
                            const val = e.target.value
                            if (val === '' || /^#([0-9A-Fa-f]{0,6})$/.test(val)) {
                              setFormData(f => ({
                                ...f,
                                contentSections: f.contentSections.map(s =>
                                  s.id === section.id ? { ...s, bgColor: val } : s
                                )
                              }))
                            }
                          }}
                          placeholder="#ffffff"
                          maxLength={7}
                          className="h-5 w-[72px] text-[10px] font-mono px-1.5 rounded border border-border/60 bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      {/* Enable/disable toggle */}
                      <button
                        onClick={() => setFormData(f => ({
                          ...f,
                          contentSections: f.contentSections.map(s =>
                            s.id === section.id ? { ...s, enabled: !s.enabled } : s
                          )
                        }))}
                        className={`p-1.5 rounded-lg transition-all ${
                          section.enabled
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-50'
                        }`}
                        title={section.enabled ? 'Visible on site — click to hide' : 'Hidden from site — click to show'}
                      >
                        {section.enabled ? <Eye size={15} /> : <EyeSlash size={15} />}
                      </button>
                      {/* Move up */}
                      <button
                        onClick={() => setFormData(f => {
                          const arr = [...f.contentSections]
                          const i = arr.findIndex(s => s.id === section.id)
                          if (i <= 0) return f
                          ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
                          return { ...f, contentSections: arr }
                        })}
                        disabled={secIdx === 0}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move section up"
                      >
                        <CaretUp size={15} weight="bold" />
                      </button>
                      {/* Move down */}
                      <button
                        onClick={() => setFormData(f => {
                          const arr = [...f.contentSections]
                          const i = arr.findIndex(s => s.id === section.id)
                          if (i >= arr.length - 1) return f
                          ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                          return { ...f, contentSections: arr }
                        })}
                        disabled={secIdx === formData.contentSections.length - 1}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move section down"
                      >
                        <CaretDown size={15} weight="bold" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setFormData(f => ({ ...f, contentSections: f.contentSections.filter(s => s.id !== section.id) }))}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Remove section"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Section body */}
                  <div className={`p-5 space-y-5 ${section.bgColor ? '' : 'bg-card'}`}>

                    {/* Description – rich text */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</Label>
                      <QuillEditor
                        value={section.description}
                        onChange={val => setFormData(f => ({
                          ...f,
                          contentSections: f.contentSections.map(s =>
                            s.id === section.id ? { ...s, description: val } : s
                          )
                        }))}
                        placeholder="Write section content here…"
                        minHeight="140px"
                        className="bg-background/80"
                      />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bullet Points</Label>
                        <button
                          onClick={() => setFormData(f => ({
                            ...f,
                            contentSections: f.contentSections.map(s =>
                              s.id === section.id ? { ...s, bullets: [...s.bullets, makeBullet()] } : s
                            )
                          }))}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          <Plus size={12} weight="bold" />
                          Add Bullet
                        </button>
                      </div>

                      {section.bullets.length === 0 && (
                        <p className="text-xs text-muted-foreground/50 italic pl-1">No bullets yet — click "Add Bullet" to start.</p>
                      )}

                      <div className="space-y-2">
                        {section.bullets.map(bullet => {
                          const pickerKey = `${section.id}__${bullet.id}`
                          const isPickerOpen = activeBulletIconPicker === pickerKey
                          return (
                            <div key={bullet.id} className="relative">
                              <div className="flex items-center gap-2">
                                {/* Icon selector button */}
                                <div className="relative shrink-0">
                                  <button
                                    onClick={() => setActiveBulletIconPicker(isPickerOpen ? null : pickerKey)}
                                    title="Change icon"
                                    className="w-8 h-8 rounded-lg border border-border/60 bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                  >
                                    <BulletIconRenderer iconName={bullet.icon} size={15} />
                                  </button>
                                  {/* Icon picker dropdown */}
                                  {isPickerOpen && (
                                    <div className="absolute z-50 top-9 left-0 bg-popover border border-border rounded-xl shadow-xl p-2 w-56">
                                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 px-1">Choose Icon</div>
                                      <div className="grid grid-cols-7 gap-1">
                                        {BULLET_ICONS.map(ico => (
                                          <button
                                            key={ico.name}
                                            title={ico.label}
                                            onClick={() => {
                                              setFormData(f => ({
                                                ...f,
                                                contentSections: f.contentSections.map(s =>
                                                  s.id === section.id
                                                    ? { ...s, bullets: s.bullets.map(b => b.id === bullet.id ? { ...b, icon: ico.name } : b) }
                                                    : s
                                                )
                                              }))
                                              setActiveBulletIconPicker(null)
                                            }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                                              bullet.icon === ico.name
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-foreground/70'
                                            }`}
                                          >
                                            <ico.Component size={14} weight="fill" />
                                          </button>
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => setActiveBulletIconPicker(null)}
                                        className="mt-2 w-full text-[10px] text-muted-foreground hover:text-foreground text-center py-0.5"
                                      >
                                        Close
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {/* Text input */}
                                <Input
                                  value={bullet.text}
                                  onChange={e => setFormData(f => ({
                                    ...f,
                                    contentSections: f.contentSections.map(s =>
                                      s.id === section.id
                                        ? { ...s, bullets: s.bullets.map(b => b.id === bullet.id ? { ...b, text: e.target.value } : b) }
                                        : s
                                    )
                                  }))}
                                  placeholder="Bullet point text…"
                                  className="h-8 text-sm bg-background/80 border-border/50 flex-1"
                                />
                                {/* Remove bullet */}
                                <button
                                  onClick={() => setFormData(f => ({
                                    ...f,
                                    contentSections: f.contentSections.map(s =>
                                      s.id === section.id ? { ...s, bullets: s.bullets.filter(b => b.id !== bullet.id) } : s
                                    )
                                  }))}
                                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all shrink-0"
                                >
                                  <X size={13} weight="bold" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Images – 3 slots */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Images (up to 3)</Label>
                      <div className="flex flex-wrap gap-3">
                        {[0, 1, 2].map(slot => {
                          const imgUrl = section.images[slot] || ''
                          return (
                            <div key={slot} className="relative group w-[200px] h-[200px] shrink-0">
                              {imgUrl ? (
                                <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-primary/20 bg-muted">
                                  <img src={imgUrl} alt={`img ${slot + 1}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => openImagePicker({ sectionId: section.id, slot })}
                                      className="p-1.5 bg-white rounded-lg text-primary hover:scale-110 transition-transform"
                                    >
                                      <PencilSimple size={13} weight="bold" />
                                    </button>
                                    <button
                                      onClick={() => setFormData(f => ({
                                        ...f,
                                        contentSections: f.contentSections.map(s =>
                                          s.id === section.id
                                            ? { ...s, images: s.images.map((img, i) => i === slot ? '' : img) }
                                            : s
                                        )
                                      }))}
                                      className="p-1.5 bg-white rounded-lg text-destructive hover:scale-110 transition-transform"
                                    >
                                      <Trash size={13} weight="bold" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openImagePicker({ sectionId: section.id, slot })}
                                  className="w-full h-full rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all bg-background/60"
                                >
                                  <ImageIcon size={17} />
                                  <span className="text-xs">Image {slot + 1}</span>
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Videos – 3 slots */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">YouTube Videos (up to 3)</Label>
                      <div className="flex flex-wrap gap-3">
                        {[0, 1, 2].map(slot => {
                          const video = section.videos[slot] || { url: '', thumbnail: '' }
                          return (
                            <div key={slot} className="space-y-1.5 w-[200px] shrink-0">
                              <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border-2 border-border/40 bg-muted/50 flex items-center justify-center">
                                {video.thumbnail ? (
                                  <>
                                    <img src={video.thumbnail} alt={`video ${slot + 1}`} className="w-full h-full object-cover opacity-90" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-9 h-9 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xs font-bold ml-0.5">▶</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setFormData(f => ({
                                        ...f,
                                        contentSections: f.contentSections.map(s =>
                                          s.id === section.id
                                            ? { ...s, videos: s.videos.map((v, i) => i === slot ? { url: '', thumbnail: '' } : v) }
                                            : s
                                        )
                                      }))}
                                      className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-lg text-destructive hover:scale-110 transition-transform"
                                    >
                                      <X size={11} weight="bold" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-0.5 text-muted-foreground/40">
                                    <span className="text-xl">▶</span>
                                    <span className="text-[10px]">Video {slot + 1}</span>
                                  </div>
                                )}
                              </div>
                              <Input
                                value={video.url}
                                onChange={e => {
                                  const url = e.target.value
                                  const thumbnail = getYTThumbnail(url)
                                  setFormData(f => ({
                                    ...f,
                                    contentSections: f.contentSections.map(s =>
                                      s.id === section.id
                                        ? { ...s, videos: s.videos.map((v, i) => i === slot ? { url, thumbnail } : v) }
                                        : s
                                    )
                                  }))
                                }}
                                placeholder="YouTube URL…"
                                className="h-7 text-xs bg-background/80"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* ▸ ADD SECTION button */}
              <button
                onClick={() => setFormData(f => ({ ...f, contentSections: [...f.contentSections, makeSection(f.contentSections.length)] }))}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/25 flex items-center justify-center gap-3 text-primary/60 hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all group"
              >
                <div className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={14} weight="bold" />
                </div>
                <span className="text-sm font-medium">Add Content Section</span>
              </button>

              {/* ▸ BLOG LINKS */}
              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-2 border-b bg-linear-to-r from-blue-500/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-500 rounded-full" />
                      <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-blue-600 dark:text-blue-400">Related Blog Links</h3>
                    </div>
                    <button
                      onClick={() => setFormData(f => ({ ...f, blogLinks: [...f.blogLinks, { title: '', url: '' }] }))}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/5 transition-all"
                    >
                      <Plus size={13} weight="bold" />
                      Add Link
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  {formData.blogLinks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      No blog links yet — click <strong>Add Link</strong> to reference related articles.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {formData.blogLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={link.title}
                            onChange={e => setFormData(f => ({
                              ...f,
                              blogLinks: f.blogLinks.map((l, i) => i === idx ? { ...l, title: e.target.value } : l)
                            }))}
                            placeholder="Link title…"
                            className="h-9 flex-1 bg-background"
                          />
                          <Input
                            value={link.url}
                            onChange={e => setFormData(f => ({
                              ...f,
                              blogLinks: f.blogLinks.map((l, i) => i === idx ? { ...l, url: e.target.value } : l)
                            }))}
                            placeholder="https://…"
                            className="h-9 flex-1 bg-background"
                          />
                          <button
                            onClick={() => setFormData(f => ({ ...f, blogLinks: f.blogLinks.filter((_, i) => i !== idx) }))}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all shrink-0"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ▸ FAQs */}
              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-2 border-b bg-linear-to-r from-amber-500/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-amber-500 rounded-full" />
                      <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-amber-600 dark:text-amber-400">FAQs</h3>
                    </div>
                    <button
                      onClick={() => setFormData(f => ({ ...f, faqs: [...f.faqs, { id: genId(), question: '', answer: '' }] }))}
                      className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/5 transition-all"
                    >
                      <Plus size={13} weight="bold" />
                      Add FAQ
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  {formData.faqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      No FAQs yet — click <strong>Add FAQ</strong> to add questions &amp; answers.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.faqs.map((faq, idx) => (
                        <div key={faq.id} className="rounded-lg border border-border/50 bg-background p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 w-4">Q{idx + 1}</span>
                            <Input
                              value={faq.question}
                              onChange={e => setFormData(f => ({ ...f, faqs: f.faqs.map((item, i) => i === idx ? { ...item, question: e.target.value } : item) }))}
                              placeholder="Question…"
                              className="h-8 text-sm flex-1 bg-background"
                            />
                            <button
                              onClick={() => setFormData(f => ({ ...f, faqs: f.faqs.filter((_, i) => i !== idx) }))}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 w-4 mt-2">A</span>
                            <div className="flex-1">
                              <QuillEditor
                                value={faq.answer}
                                onChange={val => setFormData(f => ({ ...f, faqs: f.faqs.map((item, i) => i === idx ? { ...item, answer: val } : item) }))}
                                placeholder="Answer…"
                                minHeight="100px"
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>{/* end inner padding div */}
          </div>{/* end scroll area */}

          {/* ── FOOTER ── */}
          <div className="shrink-0 px-6 py-4 border-t bg-card/80 backdrop-blur-sm">
            {/* Booking CTA */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/40">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <GlobeSimple size={17} className="text-primary" weight="fill" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                    Button Label
                  </Label>
                  <Input
                    value={formData.bookingButtonName}
                    onChange={e => setFormData(f => ({ ...f, bookingButtonName: e.target.value }))}
                    placeholder="e.g. Book Now"
                    className="h-9 text-sm bg-background"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                    Button Link
                  </Label>
                  <Input
                    value={formData.bookingButtonUrl}
                    onChange={e => setFormData(f => ({ ...f, bookingButtonUrl: e.target.value }))}
                    placeholder="https://… or /contact"
                    className="h-9 text-sm bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground hidden sm:block">
                {formData.contentSections.length} section{formData.contentSections.length !== 1 ? 's' : ''}
                {formData.blogLinks.length > 0 && ` · ${formData.blogLinks.length} blog link${formData.blogLinks.length !== 1 ? 's' : ''}`}
              </p>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                  className="px-5"
                >
                  <X size={15} className="mr-1.5" />
                  Close
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 bg-linear-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isSaving ? (
                    <><Spinner size={15} className="mr-1.5 animate-spin" />Saving…</>
                  ) : (
                    <><FloppyDisk size={15} className="mr-1.5" />Save Service</>
                  )}
                </Button>
              </div>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {/* ── Image Picker Overlay ── */}
      {activeImagePicker && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          style={{ zIndex: 9999 }}
          onMouseDown={e => { if (e.target === e.currentTarget) setActiveImagePicker(null) }}
        >
          <div
            className="bg-background rounded-2xl max-w-4xl w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Picker header */}
            <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-primary/5 to-accent/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon size={18} className="text-primary" weight="fill" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-base">Select Image</p>
                  <p className="text-xs text-muted-foreground">
                    {activeImagePicker.sectionId === 'featured'
                      ? 'Choose the featured image for this service'
                      : `Section image slot ${activeImagePicker.slot + 1}`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveImagePicker(null)} className="rounded-full">
                <X size={19} />
              </Button>
            </div>

            {/* Category filter */}
            <div className="px-5 py-3 border-b bg-muted/30 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium">Category:</Label>
                <Select value={imagePickerCategory} onValueChange={setImagePickerCategory}>
                  <SelectTrigger className="w-[200px]" onMouseDown={e => e.stopPropagation()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 10000 }}>
                    <SelectItem value="all">All ({mediaCategories.reduce((s, c) => s + c.count, 0)})</SelectItem>
                    {mediaCategories.map(({ value: cat, label, count }) => (
                      <SelectItem key={cat} value={cat}>
                        {label} ({count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary" className="text-xs">
                {pickerPhotos.length} images
              </Badge>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              {pickerLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (() => {
                return pickerPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {pickerPhotos.map(photo => (
                      <div
                        key={photo.id}
                        className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                          if (!activeImagePicker) return
                          if (activeImagePicker.sectionId === 'featured') {
                            setFormData(f => ({ ...f, featuredImageUrl: photo.url }))
                          } else {
                            setFormData(f => ({
                              ...f,
                              contentSections: f.contentSections.map(s =>
                                s.id === activeImagePicker.sectionId
                                  ? { ...s, images: s.images.map((img, i) => i === activeImagePicker.slot ? photo.url : img) }
                                  : s
                              )
                            }))
                          }
                          setActiveImagePicker(null)
                          toast.success('Image selected')
                        }}
                      >
                        <img src={photo.url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <span className="bg-white text-primary font-semibold px-3 py-1.5 rounded-full text-xs shadow-lg">Select</span>
                        </div>
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 capitalize">{photo.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ImageIcon size={40} className="mb-3 text-muted-foreground" />
                    <p className="font-medium text-muted-foreground">No images found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {imagePickerCategory === 'all'
                        ? 'Upload images in the Media section first.'
                        : `No images in "${imagePickerCategory}". Try "All".`}
                    </p>
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
