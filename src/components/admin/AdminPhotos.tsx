import { useState, useRef } from 'react'
import { usePhotos, convertLegacyPhoto, type Photo } from '../../hooks/usePhotos'
import { uploadImage, deleteFile, BUCKETS, extractPathFromUrl, isSupabaseStorageUrl, fileToBase64 } from '../../lib/storage'
import { Plus, Trash, Upload, PencilSimple, FloppyDisk, X, Spinner, Image as ImageIcon, CloudArrowUp } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
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
  const [formData, setFormData] = useState<PhotoFormData>({
    id: '',
    url: '',
    title: '',
    category: 'ceremony'
  })
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Photos</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Photo
          </Button>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Upload size={48} className="mx-auto mb-4" />
              <p>No photos yet. Click "Add Photo" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
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
                      <span className="text-xs text-muted-foreground">{photo.category}</span>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div>
              <Label>Photo Image</Label>
              <div 
                className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
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
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedFile ? selectedFile.name : 'Click to change image'}
                    </p>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="mx-auto text-muted-foreground mb-2" size={48} />
                    <p className="text-sm text-muted-foreground">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG, GIF, WebP, SVG (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Or use URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter URL</span>
              </div>
            </div>

            <div>
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value })
                  if (e.target.value && !selectedFile) {
                    setPreviewUrl(e.target.value)
                  }
                }}
                placeholder="https://..."
                disabled={isSaving || !!selectedFile}
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Clear the uploaded file to use a URL instead
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Photo Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Wedding Ceremony 2024"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., ceremony, pooja, wedding"
                disabled={isSaving}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }} 
                disabled={isSaving}
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner className="mr-2 animate-spin" size={18} />
                    {isUploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <FloppyDisk size={18} className="mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
