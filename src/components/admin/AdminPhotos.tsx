import { useState, useRef } from 'react'
import { usePhotos, convertLegacyPhoto, type Photo } from '../../hooks/usePhotos'
import { uploadImage, deleteFile, BUCKETS, extractPathFromUrl, isSupabaseStorageUrl, fileToBase64 } from '../../lib/storage'
import { Plus, Trash, Upload, PencilSimple, FloppyDisk, X, Spinner, Image as ImageIcon, CloudArrowUp, MagnifyingGlass, FunnelSimple, Package, Camera, FolderSimple, FileImage, Link } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'

interface PhotoFormData {
  id: string
  url: string
  title: string
  category: string
}

export default function AdminPhotos() {
  const { photos, isLoading, createPhoto, updatePhoto, deletePhoto, isCreating, isUpdating, isDeleting } = usePhotos()
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [formData, setFormData] = useState<PhotoFormData>({
    id: '',
    url: '',
    title: '',
    category: 'ceremony'
  })
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentTab, setCurrentTab] = useState('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get unique categories from photos
  const categories = Array.from(new Set(photos.map(p => p.category).filter(Boolean)))

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = filterCategory === 'all' || photo.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setFormData({
      id: '',
      url: '',
      title: '',
      category: 'ceremony'
    })
    setEditingPhoto(null)
    setPreviewUrl(null)
    setSelectedFile(null)
    setCurrentTab('upload')
    setIsDialogOpen(true)
  }

  const handleEdit = (photo: Photo) => {
    setFormData({
      id: photo.id,
      url: photo.url,
      title: photo.title || '',
      category: photo.category || 'ceremony'
    })
    setEditingPhoto(photo)
    setPreviewUrl(photo.url)
    setSelectedFile(null)
    setCurrentTab('upload')
    setIsDialogOpen(true)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast.error('Please select an image file (JPEG, PNG, GIF, WebP, or SVG)')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 10MB')
      return
    }

    setSelectedFile(file)
    
    // Generate preview
    try {
      const base64 = await fileToBase64(file)
      setPreviewUrl(base64)
      // Auto-fill title from filename if empty
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setFormData(prev => ({ ...prev, title: nameWithoutExt }))
      }
    } catch (error) {
      console.error('Preview error:', error)
    }
  }

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Please enter a title')
      return
    }

    if (!selectedFile && !formData.url) {
      toast.error('Please upload an image or enter an image URL')
      return
    }

    try {
      setIsUploading(true)
      let imageUrl = formData.url

      // Upload new file if selected
      if (selectedFile) {
        const result = await uploadImage(selectedFile, 'gallery')
        imageUrl = result.url

        // Delete old file from storage if it was a Supabase Storage file
        if (editingPhoto && isSupabaseStorageUrl(editingPhoto.url)) {
          const oldPath = extractPathFromUrl(editingPhoto.url, BUCKETS.MEDIA)
          if (oldPath) {
            try {
              await deleteFile(BUCKETS.MEDIA, oldPath)
            } catch (error) {
              console.warn('Failed to delete old image:', error)
            }
          }
        }
      }

      if (editingPhoto) {
        await updatePhoto({
          id: editingPhoto.id,
          alt_text: formData.title,
          original_name: formData.title,
          file_url: imageUrl,
          folder: formData.category || null
        })
      } else {
        const newPhoto = convertLegacyPhoto({
          title: formData.title,
          url: imageUrl,
          category: formData.category
        })
        await createPhoto(newPhoto)
      }

      setIsDialogOpen(false)
      setEditingPhoto(null)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save photo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      // Delete file from storage if it's a Supabase Storage file
      if (isSupabaseStorageUrl(photo.url)) {
        const path = extractPathFromUrl(photo.url, BUCKETS.MEDIA)
        if (path) {
          try {
            await deleteFile(BUCKETS.MEDIA, path)
          } catch (error) {
            console.warn('Failed to delete image from storage:', error)
          }
        }
      }

      await deletePhoto(photo.id)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const isSaving = isCreating || isUpdating || isUploading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading photos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading">Photo Gallery</CardTitle>
              <CardDescription className="mt-2">
                All images from books, gallery, and other sources
              </CardDescription>
            </div>
            <Button onClick={handleAdd} className="gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus size={20} weight="bold" />
              Add Photo
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
                placeholder="Search photos by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-56">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <FunnelSimple size={16} />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredPhotos.length}</span> of{' '}
              <span className="font-semibold text-foreground">{photos.length}</span> photos
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {categories.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{categories.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <Card>
        <CardContent className="p-6">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {photos.length === 0 ? (
                <>
                  <Upload size={48} className="mx-auto mb-4" />
                  <p>No photos yet. Click "Add Photo" to get started.</p>
                </>
              ) : (
                <>
                  <Package size={48} className="mx-auto mb-4" />
                  <p className="mb-4">No photos found matching your criteria</p>
                  <Button onClick={() => { setSearchQuery(''); setFilterCategory('all') }} variant="outline">
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={photo.url} 
                        alt={photo.title || ''} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+Not+Found'
                        }}
                      />
                      {isSupabaseStorageUrl(photo.url) && (
                        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CloudArrowUp size={12} />
                          Stored
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{photo.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {photo.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(photo)}
                        >
                          <PencilSimple size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDelete(photo)}
                          disabled={isDeleting}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modern Redesigned Photo Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 !bg-background">
          {/* Gradient Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 px-6 py-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <Camera className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                </DialogTitle>
                <p className="text-cyan-100 text-sm mt-0.5">
                  {editingPhoto ? 'Update photo details and image' : 'Upload a new photo to your gallery'}
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { id: 'upload', label: 'Upload Image', icon: FileImage },
                { id: 'details', label: 'Photo Details', icon: FolderSimple }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    currentTab === step.id
                      ? 'bg-white text-cyan-700 shadow-lg'
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
              {/* Upload Tab */}
              {currentTab === 'upload' && (
                <div className="space-y-5">
                  {/* Image Upload Area */}
                  <Card className="border-2 border-teal-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                          <CloudArrowUp className="h-4 w-4 text-teal-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-teal-900">Upload Image</h3>
                      </div>
                      
                      <div 
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          previewUrl 
                            ? 'border-teal-300 bg-teal-50/50' 
                            : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50/30'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={isSaving}
                        />
                        
                        {previewUrl ? (
                          <div className="relative">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-h-56 mx-auto rounded-lg object-contain shadow-md"
                            />
                            <div className="mt-3 flex items-center justify-center gap-2">
                              <Badge variant="outline" className="bg-teal-100 border-teal-300">
                                <FileImage className="h-3 w-3 mr-1" />
                                {selectedFile ? selectedFile.name : 'Current image'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mx-auto mb-4">
                              <CloudArrowUp className="h-8 w-8 text-teal-600" weight="duotone" />
                            </div>
                            <p className="font-medium text-gray-700">
                              Click to upload an image
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              JPEG, PNG, GIF, WebP, SVG (max 10MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Or use URL */}
                  <Card className="border-2 border-blue-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Link className="h-4 w-4 text-blue-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Or Use Image URL</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-sm font-medium">
                          External Image URL
                        </Label>
                        <Input
                          id="url"
                          value={formData.url}
                          onChange={(e) => {
                            setFormData({ ...formData, url: e.target.value })
                            if (e.target.value && !selectedFile) {
                              setPreviewUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="h-11 bg-background"
                          disabled={isSaving || !!selectedFile}
                        />
                        {selectedFile && (
                          <p className="text-xs text-amber-600">
                            ℹ️ Clear the uploaded file to use a URL instead
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Details Tab */}
              {currentTab === 'details' && (
                <div className="space-y-5">
                  {/* Photo Title */}
                  <Card className="border-2 border-cyan-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100">
                          <ImageIcon className="h-4 w-4 text-cyan-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-cyan-900">Photo Information</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Photo Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Wedding Ceremony 2024"
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">
                          A descriptive title helps organize and find your photos
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Category Selection */}
                  <Card className="border-2 border-indigo-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <FolderSimple className="h-4 w-4 text-indigo-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-indigo-900">Category / Folder</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-sm font-medium">
                          Select Category
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          disabled={isSaving}
                        >
                          <SelectTrigger id="category" className="h-11 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="books">📚 Books</SelectItem>
                            <SelectItem value="gallery">🖼️ Gallery</SelectItem>
                            <SelectItem value="ceremony">🪔 Ceremony</SelectItem>
                            <SelectItem value="pooja">🙏 Pooja</SelectItem>
                            <SelectItem value="wedding">💒 Wedding</SelectItem>
                            <SelectItem value="charity">❤️ Charity</SelectItem>
                            <SelectItem value="events">🎉 Events</SelectItem>
                            <SelectItem value="general">📁 General</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {['books', 'gallery', 'ceremony', 'pooja', 'wedding', 'charity', 'events', 'general'].map((cat) => (
                            <Badge 
                              key={cat}
                              variant="outline" 
                              className={`cursor-pointer transition-all capitalize ${
                                formData.category === cat 
                                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                                  : 'hover:bg-indigo-50'
                              }`}
                              onClick={() => setFormData({ ...formData, category: cat })}
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Preview */}
                  {previewUrl && formData.title && (
                    <div className="rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border border-cyan-200">
                      <h4 className="font-medium text-cyan-800 text-sm mb-3">👁️ Preview</h4>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex gap-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-24 h-24 rounded-lg object-cover shadow-sm"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{formData.title}</h4>
                            <Badge variant="outline" className="mt-2 capitalize">
                              {formData.category}
                            </Badge>
                            {selectedFile && (
                              <p className="text-xs text-muted-foreground mt-2">
                                📤 Will be uploaded to cloud storage
                              </p>
                            )}
                          </div>
                        </div>
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
                  {currentTab !== 'upload' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('upload')}
                      className="gap-2"
                    >
                      ← Back
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  
                  {currentTab === 'upload' ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('details')}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      disabled={!previewUrl && !formData.url}
                    >
                      Continue to Details →
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      {isSaving ? (
                        <Spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk className="h-4 w-4" weight="bold" />
                      )}
                      {isUploading ? 'Uploading...' : editingPhoto ? 'Update Photo' : 'Save Photo'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
