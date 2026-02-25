import { useState } from 'react'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, ChatCircleText, Star, User, MapPin, Certificate, Quotes, CalendarBlank, Image as ImageIcon } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { usePhotos, usePhotoCategories, findCategoryByKeyword } from '../../hooks/usePhotos'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../../hooks/useTestimonials'
import { TestimonialRow } from '../../lib/supabase'
import { supabase } from '../../lib/supabase'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface TestimonialFormData {
  id: string
  name: string
  location: string
  service: string
  rating: number
  content: string
  verified: boolean
  imageUrl: string
  publishedDate: string
}

export default function AdminTestimonials() {
  // Database hooks
  const { data: testimonials = [], isLoading, refetch: refetchTestimonials } = useTestimonials()
  const createTestimonialMutation = useCreateTestimonial()
  const updateTestimonialMutation = useUpdateTestimonial()
  const deleteTestimonialMutation = useDeleteTestimonial()

  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [imagePickerCategory, setImagePickerCategory] = useState<string>('all')

  // Photo categories (same source as AdminPhotos) and category-scoped picker images
  const { categories: mediaCategories } = usePhotoCategories()
  const { photos: pickerPhotos, isLoading: pickerLoading } = usePhotos({
    category: imagePickerCategory === 'all' ? undefined : imagePickerCategory,
    limit: 500,
  })
  const getTestimonialsImagePickerCategory = () => findCategoryByKeyword(mediaCategories, 'testimonial')
  const [isSaving, setIsSaving] = useState(false)
  const [currentTab, setCurrentTab] = useState('customer')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<TestimonialRow | null>(null)
  const [formData, setFormData] = useState<TestimonialFormData>({
    id: '',
    name: '',
    location: '',
    service: '',
    rating: 5,
    content: '',
    verified: false,
    imageUrl: '',
    publishedDate: new Date().toISOString().slice(0, 10)
  })

  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      location: '',
      service: '',
      rating: 5,
      content: '',
      verified: false,
      imageUrl: '',
      publishedDate: new Date().toISOString().slice(0, 10)
    })
    setEditingTestimonial(null)
    setCurrentTab('customer')
    setImagePickerCategory(getTestimonialsImagePickerCategory())
    setIsDialogOpen(true)
  }

  const handleEdit = (testimonial: TestimonialRow) => {
    setFormData({
      id: testimonial.id,
      name: testimonial.client_name,
      location: testimonial.client_location || '',
      service: testimonial.service_name || '',
      rating: testimonial.rating || 5,
      content: testimonial.testimonial_text,
      verified: testimonial.is_approved,
      imageUrl: testimonial.client_image_url || '',
      publishedDate: testimonial.created_at ? testimonial.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
    })
    setEditingTestimonial(testimonial)
    setCurrentTab('customer')
    setImagePickerCategory(getTestimonialsImagePickerCategory())
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error('Please fill in required fields (Name and Content)')
      return
    }

    setIsSaving(true)
    try {
      if (editingTestimonial) {
        await updateTestimonialMutation.mutateAsync({
          id: editingTestimonial.id,
          client_name: formData.name,
          client_location: formData.location || null,
          client_image_url: formData.imageUrl || null,
          service_name: formData.service || null,
          rating: formData.rating,
          testimonial_text: formData.content,
          is_approved: formData.verified,
          is_published: formData.verified, // Publish when approved
        })
        // Update created_at (published date) separately as it's not in TestimonialUpdate
        if (formData.publishedDate) {
          await supabase
            .from('testimonials')
            .update({ created_at: new Date(formData.publishedDate).toISOString() })
            .eq('id', editingTestimonial.id)
          await refetchTestimonials()
        }
        toast.success('Testimonial updated successfully')
      } else {
        await createTestimonialMutation.mutateAsync({
          client_name: formData.name,
          client_location: formData.location || null,
          client_image_url: formData.imageUrl || null,
          service_name: formData.service || null,
          service_id: null,
          testimonial_text: formData.content,
          rating: formData.rating,
          is_approved: formData.verified,
          is_featured: false,
          is_published: formData.verified, // Publish when approved
          source: 'admin',
          approved_by: null,
          approved_at: formData.verified ? new Date().toISOString() : null,
        })
        toast.success('Testimonial added successfully')
      }
      setIsDialogOpen(false)
      setEditingTestimonial(null)
    } catch (error) {
      toast.error('Failed to save testimonial')
      console.error('Error saving testimonial:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const openDeleteDialog = (testimonial: TestimonialRow) => {
    setTestimonialToDelete(testimonial)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!testimonialToDelete) return

    try {
      await deleteTestimonialMutation.mutateAsync(testimonialToDelete.id)
      toast.success('Testimonial deleted successfully')
      setDeleteDialogOpen(false)
      setTestimonialToDelete(null)
    } catch (error) {
      toast.error('Failed to delete testimonial')
      console.error('Error deleting testimonial:', error)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            weight={star <= rating ? 'fill' : 'regular'}
            className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
          />
        ))}
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
              <CardTitle className="text-2xl font-heading">Testimonials Management</CardTitle>
              <CardDescription className="mt-2">
                Manage customer reviews and testimonials
              </CardDescription>
            </div>
            <Button onClick={handleAdd} className="gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus size={20} weight="bold" />
              Add Testimonial
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Spinner size={48} className="mx-auto mb-4 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground mb-4">Loading testimonials...</p>
            </CardContent>
          </Card>
        ) : testimonials.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <ChatCircleText size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No testimonials yet. Click "Add Testimonial" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {testimonial.client_image_url && (
                        <img src={testimonial.client_image_url} alt={testimonial.client_name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-200" />
                      )}
                      <h3 className="font-heading font-semibold text-lg">{testimonial.client_name}</h3>
                      {testimonial.is_approved && (
                        <Badge variant="default" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      {testimonial.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          ⭐ Featured
                        </Badge>
                      )}
                      {renderStars(testimonial.rating || 5)}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span>📍 {testimonial.client_location || 'Location not specified'}</span>
                      <span>•</span>
                      <span>🕉️ {testimonial.service_name || 'General'}</span>
                      <span>•</span>
                      <span>📅 {new Date(testimonial.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-foreground/90">
                      "{testimonial.testimonial_text}"
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(testimonial)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modern Redesigned Testimonial Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 bg-background!">
          {/* Gradient Header */}
          <div className="relative overflow-hidden bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <Quotes className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </DialogTitle>
                <DialogDescription className="text-amber-100 text-sm mt-0.5">
                  {editingTestimonial ? 'Update customer review details' : 'Add a new customer testimonial'}
                </DialogDescription>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { id: 'customer', label: 'Customer Info', icon: User },
                { id: 'review', label: 'Review', icon: Star }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    currentTab === step.id
                      ? 'bg-white text-orange-700 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <step.icon className="h-3.5 w-3.5" weight="bold" />
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Form Content */}
          <div className="flex flex-col h-[calc(90vh-180px)]">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Customer Info Tab */}
              {currentTab === 'customer' && (
                <div className="space-y-5">
                  {/* Customer Details */}
                  <Card className="border-2 border-amber-100 bg-background!">
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                          <User className="h-4 w-4 text-amber-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-amber-900">Customer Details</h3>
                      </div>
                      
                      {/* Customer Photo */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Customer Photo</Label>
                        {formData.imageUrl ? (
                          <div className="relative mb-2 rounded-lg overflow-hidden border w-40 h-40">
                            <img
                              src={formData.imageUrl}
                              alt="Customer"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setFormData({ ...formData, imageUrl: '' })}
                              disabled={isSaving}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all w-40 h-40 flex flex-col items-center justify-center"
                            onClick={() => {
                              setImagePickerCategory(getTestimonialsImagePickerCategory())
                              setShowImagePicker(true)
                            }}
                          >
                            <ImageIcon className="mb-2 text-muted-foreground" size={28} weight="duotone" />
                            <p className="text-xs font-medium">Select Photo</p>
                            <p className="text-xs text-muted-foreground mt-0.5">From media library</p>
                          </div>
                        )}
                        {formData.imageUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setImagePickerCategory(getTestimonialsImagePickerCategory())
                              setShowImagePicker(true)
                            }}
                            disabled={isSaving}
                          >
                            Change Photo
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Customer Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Rajesh Kumar"
                            className="h-11 bg-background"
                            disabled={isSaving}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium">
                            Location
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="e.g., Amsterdam, Netherlands"
                              className="h-11 bg-background pl-10"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-sm font-medium">
                          Service Used
                        </Label>
                        <Input
                          id="service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          placeholder="e.g., Griha Pravesh Pooja"
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {['Griha Pravesh', 'Wedding Ceremony', 'Satyanarayan Pooja', 'Mundan Ceremony', 'Other'].map((svc) => (
                            <Badge 
                              key={svc}
                              variant="outline" 
                              className={`cursor-pointer transition-all hover:bg-amber-50 ${
                                formData.service === svc ? 'bg-amber-100 border-amber-300 text-amber-700' : ''
                              }`}
                              onClick={() => setFormData({ ...formData, service: svc })}
                            >
                              {svc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Verification Status */}
                  <Card className="border-2 border-green-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                          <Certificate className="h-4 w-4 text-green-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-green-900">Verification Status</h3>
                      </div>
                      
                      <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-green-200 hover:border-green-300 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={formData.verified}
                          onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          disabled={isSaving}
                        />
                        <div>
                          <span className="font-medium text-green-800">Mark as Verified Testimonial</span>
                          <p className="text-xs text-green-600 mt-0.5">Verified testimonials show a badge indicating authenticity</p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>

                  {/* Published Date */}
                  <Card className="border-2 border-blue-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <CalendarBlank className="h-4 w-4 text-blue-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Published Date</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishedDate" className="text-sm font-medium">Date shown on testimonial</Label>
                        <Input
                          id="publishedDate"
                          type="date"
                          value={formData.publishedDate}
                          onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Review Tab */}
              {currentTab === 'review' && (
                <div className="space-y-5">
                  {/* Rating */}
                  <Card className="border-2 border-yellow-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                          <Star className="h-4 w-4 text-yellow-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-yellow-900">Customer Rating</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">How would you rate the experience?</Label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className={`cursor-pointer p-2 rounded-lg transition-all ${
                                star <= formData.rating 
                                  ? 'bg-yellow-100 text-yellow-500 scale-110' 
                                  : 'bg-gray-100 text-gray-300 hover:bg-yellow-50'
                              }`}
                              disabled={isSaving}
                            >
                              <Star 
                                size={28} 
                                weight={star <= formData.rating ? 'fill' : 'regular'}
                              />
                            </button>
                          ))}
                          <span className="ml-3 text-sm font-medium text-yellow-700">
                            {formData.rating === 5 ? 'Excellent!' : 
                             formData.rating === 4 ? 'Very Good' : 
                             formData.rating === 3 ? 'Good' : 
                             formData.rating === 2 ? 'Fair' : 'Poor'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Review Content */}
                  <Card className="border-2 border-orange-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                          <Quotes className="h-4 w-4 text-orange-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-orange-900">Testimonial Content</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-medium">
                          Customer Review <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Enter the customer's testimonial content..."
                          rows={6}
                          className="resize-none bg-background leading-relaxed"
                          disabled={isSaving}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Write the customer's experience in their own words</span>
                          <span>{formData.content.length} characters</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Preview */}
                  {formData.name && formData.content && (
                    <div className="rounded-xl bg-linear-to-r from-amber-50 to-orange-50 p-4 border border-amber-200">
                      <h4 className="font-medium text-amber-800 text-sm mb-3">👁️ Preview</h4>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt={formData.name} className="w-10 h-10 rounded-full object-cover border border-amber-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-amber-500" />
                            </div>
                          )}
                          <span className="font-semibold text-sm">{formData.name}</span>
                          {formData.verified && (
                            <Badge variant="default" className="text-xs bg-green-500">✓ Verified</Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              weight={star <= formData.rating ? 'fill' : 'regular'}
                              className={star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 italic">"{formData.content}"</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          📍 {formData.location || 'Location'} • 🕉️ {formData.service || 'Service'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentTab !== 'customer' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('customer')}
                      className="gap-2"
                    >
                      ← Back
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  
                  {currentTab === 'customer' ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('review')}
                      className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Continue to Review →
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="gap-2 bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                    >
                      {isSaving ? (
                        <Spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk className="h-4 w-4" weight="bold" />
                      )}
                      {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Picker Modal */}
          {showImagePicker && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-background rounded-2xl max-w-5xl w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-blue-500/5 to-purple-500/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ImageIcon size={20} className="text-blue-600" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Select Customer Photo</h3>
                      <p className="text-xs text-muted-foreground">Choose from your media library</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowImagePicker(false)} className="rounded-full">
                    <X size={20} />
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="px-5 pt-4 pb-2 border-b shrink-0">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Category</Label>
                  <Select value={imagePickerCategory} onValueChange={setImagePickerCategory}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent style={{ zIndex: 10000 }}>
                      <SelectItem value="all">
                        All Categories ({mediaCategories.reduce((s, c) => s + c.count, 0)})
                      </SelectItem>
                      {mediaCategories.map(({ value: cat, label, count }) => (
                        <SelectItem key={cat} value={cat}>
                          {label} ({count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-5 overflow-y-auto flex-1 min-h-0">
                  {pickerLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : pickerPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {pickerPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: photo.url })
                            setShowImagePicker(false)
                            toast.success('Photo selected')
                          }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <span className="bg-white text-primary font-semibold px-3 py-1.5 rounded-full text-xs shadow-lg">Select</span>
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
                      <p className="text-sm text-muted-foreground mb-4">
                        {imagePickerCategory === 'all'
                          ? 'Upload images to the Media section first'
                          : `No images in the "${imagePickerCategory}" category`}
                      </p>
                      <Button onClick={() => setShowImagePicker(false)} variant="outline">Close</Button>
                    </div>
                  )}
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
        title="Delete Testimonial"
        itemName={testimonialToDelete?.client_name}
        isDeleting={deleteTestimonialMutation.isPending}
      />
    </div>
  )
}
