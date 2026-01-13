import { useState, useRef } from 'react'
import { usePhotos, convertLegacyPhoto, type Photo } from '../../hooks/usePhotos'
import { uploadImage, deleteFile, BUCKETS, extractPathFromUrl, isSupabaseStorageUrl, fileToBase64 } from '../../lib/storage'
import { Plus, Trash, Upload, PencilSimple, FloppyDisk, X, Spinner, Image as ImageIcon, CloudArrowUp, MagnifyingGlass, Package, Camera, FolderSimple, FileImage, Link, CheckCircle, WarningCircle, Images, Eye, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Progress } from '../ui/progress'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface PhotoFormData {
  id: string
  url: string
  title: string
  category: string
}

interface FileUploadItem {
  file: File
  preview: string
  title: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function AdminPhotos() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const itemsPerPage = 25
  
  // Fetch photos with pagination from server
  const { photos, total, totalPages, isLoading, createPhoto, updatePhoto, deletePhoto, isCreating, isUpdating, isDeleting } = usePhotos({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    category: filterCategory !== 'all' ? filterCategory : undefined
  })
  
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
  const [selectedFiles, setSelectedFiles] = useState<FileUploadItem[]>([])
  const [currentTab, setCurrentTab] = useState('upload')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [bulkCategory, setBulkCategory] = useState('gallery')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingCount, setUploadingCount] = useState({ current: 0, total: 0 })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  // Get unique categories - need to fetch separately or use a cached list
  const categories = Array.from(new Set(photos.map(p => p.category).filter(Boolean)))

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value)
    setCurrentPage(1)
  }

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
    setSelectedFiles([])
    setCurrentTab('upload')
    setIsBulkMode(false)
    setIsDialogOpen(true)
  }

  const handleBulkAdd = () => {
    setFormData({
      id: '',
      url: '',
      title: '',
      category: 'gallery'
    })
    setEditingPhoto(null)
    setPreviewUrl(null)
    setSelectedFile(null)
    setSelectedFiles([])
    setBulkCategory('gallery')
    setCurrentTab('upload')
    setIsBulkMode(true)
    setUploadProgress(0)
    setUploadingCount({ current: 0, total: 0 })
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

  const handleMultiFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const maxSize = 10 * 1024 * 1024 // 10MB
    const newFiles: FileUploadItem[] = []
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`)
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 10MB)`)
        continue
      }

      try {
        const base64 = await fileToBase64(file)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        
        newFiles.push({
          file,
          preview: base64,
          title: nameWithoutExt,
          status: 'pending'
        })
      } catch (error) {
        errors.push(`${file.name}: Failed to process`)
      }
    }

    if (errors.length > 0) {
      toast.error(`Some files were skipped:\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? `\n...and ${errors.length - 3} more` : ''}`)
    }

    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles])
      toast.success(`${newFiles.length} file(s) added to upload queue`)
    }

    // Reset input
    if (bulkFileInputRef.current) {
      bulkFileInputRef.current.value = ''
    }
  }

  const removeFileFromQueue = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const updateFileTitle = (index: number, title: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, title } : item
    ))
  }

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    const filesToUpload = selectedFiles.filter(f => f.status === 'pending')
    if (filesToUpload.length === 0) {
      toast.error('No pending files to upload')
      return
    }

    setIsUploading(true)
    setUploadingCount({ current: 0, total: filesToUpload.length })
    setUploadProgress(0)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i]
      if (item.status !== 'pending') continue

      // Update status to uploading
      setSelectedFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading' as const } : f
      ))
      setUploadingCount(prev => ({ ...prev, current: prev.current + 1 }))

      try {
        // Upload the file
        const result = await uploadImage(item.file, bulkCategory)
        
        // Create the photo record
        const newPhoto = convertLegacyPhoto({
          title: item.title || item.file.name,
          url: result.url,
          category: bulkCategory
        })
        await createPhoto(newPhoto)

        // Update status to success
        setSelectedFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success' as const } : f
        ))
        successCount++
      } catch (error) {
        // Update status to error
        setSelectedFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' } : f
        ))
        errorCount++
      }

      // Update progress
      const progress = Math.round(((i + 1) / selectedFiles.length) * 100)
      setUploadProgress(progress)
    }

    setIsUploading(false)

    if (successCount > 0 && errorCount === 0) {
      toast.success(`Successfully uploaded ${successCount} photo(s)`)
      setIsDialogOpen(false)
      setSelectedFiles([])
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`Uploaded ${successCount} photo(s), ${errorCount} failed`)
    } else {
      toast.error('All uploads failed')
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
        const result = await uploadImage(selectedFile, formData.category || 'gallery')
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
          folder: formData.category || undefined
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

  const openDeleteDialog = (photo: Photo) => {
    setPhotoToDelete(photo)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!photoToDelete) return

    try {
      // Delete file from storage if it's a Supabase Storage file
      if (isSupabaseStorageUrl(photoToDelete.url)) {
        const path = extractPathFromUrl(photoToDelete.url, BUCKETS.MEDIA)
        if (path) {
          try {
            await deleteFile(BUCKETS.MEDIA, path)
          } catch (error) {
            console.warn('Failed to delete image from storage:', error)
          }
        }
      }

      await deletePhoto(photoToDelete.id)
      setDeleteDialogOpen(false)
      setPhotoToDelete(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Photo Gallery</h2>
          <p className="text-sm text-muted-foreground">{total} photos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkAdd} variant="outline" size="sm" className="gap-1.5">
            <Images size={16} weight="bold" />
            Bulk
          </Button>
          <Button onClick={handleAdd} size="sm" className="gap-1.5">
            <Plus size={16} weight="bold" />
            Add
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="All" />
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

      {/* Photos Grid */}
      {total === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {!searchQuery && filterCategory === 'all' ? (
            <>
              <Upload size={32} className="mx-auto mb-2" />
              <p className="text-sm">No photos yet. Click "Add" to get started.</p>
            </>
          ) : (
            <>
              <Package size={32} className="mx-auto mb-2" />
              <p className="text-sm mb-2">No photos found</p>
              <Button onClick={() => { setSearchQuery(''); setFilterCategory('all') }} variant="outline" size="sm">
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="group relative rounded-lg overflow-hidden border bg-card cursor-pointer"
              onClick={() => setPreviewPhoto(photo)}
            >
              <div className="aspect-square bg-muted">
                <img 
                  src={photo.url} 
                  alt={photo.title || ''} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Error'
                  }}
                />
              </div>
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setPreviewPhoto(photo); }}
                    title="Preview"
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleEdit(photo); }}
                    title="Edit"
                  >
                    <PencilSimple size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); openDeleteDialog(photo); }}
                    disabled={isDeleting}
                    title="Delete"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
                <div className="text-white text-xs truncate">{photo.title}</div>
              </div>
              {/* Category badge */}
              <div className="absolute bottom-1.5 left-1.5 group-hover:opacity-0 transition-opacity pointer-events-none">
                <span className="bg-white/90 text-gray-800 text-[10px] font-medium px-1.5 py-0.5 rounded truncate block">
                  {photo.category ? photo.category.charAt(0).toUpperCase() + photo.category.slice(1) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, total)} of {total} photos
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
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
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
        </>
      )}

      {/* Modern Redesigned Photo Modal */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open && !isUploading) {
          setIsDialogOpen(false)
          setSelectedFile(null)
          setPreviewUrl(null)
          setSelectedFiles([])
        }
      }}>
        <DialogContent className={`max-h-[90vh] overflow-hidden p-0 bg-background! ${isBulkMode ? 'max-w-4xl' : 'max-w-3xl'}`}>
          {/* Gradient Header */}
          <div className="relative overflow-hidden bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 px-6 py-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                {isBulkMode ? (
                  <Images className="h-7 w-7 text-white" weight="duotone" />
                ) : (
                  <Camera className="h-7 w-7 text-white" weight="duotone" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {isBulkMode ? 'Bulk Upload Photos' : editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                </DialogTitle>
                <p className="text-cyan-100 text-sm mt-0.5">
                  {isBulkMode 
                    ? 'Upload multiple photos at once' 
                    : editingPhoto 
                      ? 'Update photo details and image' 
                      : 'Upload a new photo to your gallery'}
                </p>
              </div>
            </div>
            
            {/* Progress Steps - Only for single mode */}
            {!isBulkMode && (
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
            )}
          </div>
          
          {/* Form Content */}
          <div className="flex flex-col h-[calc(90vh-180px)]">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* BULK UPLOAD MODE */}
              {isBulkMode ? (
                <div className="space-y-5">
                  {/* Category Selection for Bulk */}
                  <Card className="border-2 border-indigo-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <FolderSimple className="h-4 w-4 text-indigo-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-indigo-900">Category for All Photos</h3>
                      </div>
                      
                      <Select
                        value={bulkCategory}
                        onValueChange={setBulkCategory}
                        disabled={isUploading}
                      >
                        <SelectTrigger className="h-11 bg-background">
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
                    </CardContent>
                  </Card>

                  {/* Bulk Upload Area */}
                  <Card className="border-2 border-teal-100 bg-background!">
                    <CardContent className="pt-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                            <CloudArrowUp className="h-4 w-4 text-teal-600" weight="duotone" />
                          </div>
                          <h3 className="font-semibold text-teal-900">Select Multiple Images</h3>
                        </div>
                        {selectedFiles.length > 0 && (
                          <Badge variant="secondary">
                            {selectedFiles.length} file(s) selected
                          </Badge>
                        )}
                      </div>
                      
                      <div 
                        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all border-gray-200 hover:border-teal-400 hover:bg-teal-50/30"
                        onClick={() => bulkFileInputRef.current?.click()}
                      >
                        <input
                          ref={bulkFileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                          onChange={handleMultiFileSelect}
                          className="hidden"
                          multiple
                          disabled={isUploading}
                        />
                        
                        <div className="py-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mx-auto mb-4">
                            <Images className="h-8 w-8 text-teal-600" weight="duotone" />
                          </div>
                          <p className="font-medium text-gray-700">
                            Click to select multiple images
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            JPEG, PNG, GIF, WebP, SVG (max 10MB each)
                          </p>
                          <p className="text-xs text-teal-600 mt-1">
                            You can select multiple files at once
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upload Queue */}
                  {selectedFiles.length > 0 && (
                    <Card className="border-2 border-cyan-100 bg-background!">
                      <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100">
                              <FileImage className="h-4 w-4 text-cyan-600" weight="duotone" />
                            </div>
                            <h3 className="font-semibold text-cyan-900">Upload Queue</h3>
                          </div>
                          {!isUploading && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFiles([])}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {isUploading && (
                          <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Uploading {uploadingCount.current} of {uploadingCount.total}
                              </span>
                              <span className="font-medium">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {selectedFiles.map((item, index) => (
                            <div 
                              key={index} 
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                item.status === 'success' 
                                  ? 'bg-green-50 border-green-200' 
                                  : item.status === 'error'
                                    ? 'bg-red-50 border-red-200'
                                    : item.status === 'uploading'
                                      ? 'bg-blue-50 border-blue-200'
                                      : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <img 
                                src={item.preview} 
                                alt={item.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                {item.status === 'pending' && !isUploading ? (
                                  <Input
                                    value={item.title}
                                    onChange={(e) => updateFileTitle(index, e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="Enter title..."
                                  />
                                ) : (
                                  <p className="text-sm font-medium truncate">{item.title}</p>
                                )}
                                {item.error && (
                                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {item.status === 'pending' && (
                                  <Badge variant="outline" className="text-xs">Pending</Badge>
                                )}
                                {item.status === 'uploading' && (
                                  <Spinner className="h-4 w-4 animate-spin text-blue-500" />
                                )}
                                {item.status === 'success' && (
                                  <CheckCircle className="h-5 w-5 text-green-500" weight="fill" />
                                )}
                                {item.status === 'error' && (
                                  <WarningCircle className="h-5 w-5 text-red-500" weight="fill" />
                                )}
                                {item.status === 'pending' && !isUploading && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFileFromQueue(index)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                /* SINGLE UPLOAD MODE */
                <>
                  {/* Upload Tab */}
                  {currentTab === 'upload' && (
                    <div className="space-y-5">
                      {/* Image Upload Area */}
                      <Card className="border-2 border-teal-100 bg-background!">
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
                      <Card className="border-2 border-blue-100 bg-background!">
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
                      <Card className="border-2 border-cyan-100 bg-background!">
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
                      <Card className="border-2 border-indigo-100 bg-background!">
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
                        <div className="rounded-xl bg-linear-to-r from-cyan-50 to-blue-50 p-4 border border-cyan-200">
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
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isBulkMode && currentTab !== 'upload' && (
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
                      setSelectedFiles([])
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  
                  {isBulkMode ? (
                    <Button 
                      onClick={handleBulkUpload} 
                      disabled={isUploading || selectedFiles.filter(f => f.status === 'pending').length === 0}
                      className="gap-2 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    >
                      {isUploading ? (
                        <>
                          <Spinner className="h-4 w-4 animate-spin" />
                          Uploading {uploadingCount.current}/{uploadingCount.total}...
                        </>
                      ) : (
                        <>
                          <CloudArrowUp className="h-4 w-4" weight="bold" />
                          Upload {selectedFiles.filter(f => f.status === 'pending').length} Photo(s)
                        </>
                      )}
                    </Button>
                  ) : currentTab === 'upload' ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('details')}
                      className="bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      disabled={!previewUrl && !formData.url}
                    >
                      Continue to Details →
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="gap-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
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

      {/* Image Preview Modal */}
      <Dialog open={!!previewPhoto} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 bg-black/50 hover:bg-black/70 text-white cursor-pointer"
              onClick={() => setPreviewPhoto(null)}
            >
              <X size={18} />
            </Button>
            {previewPhoto && (
              <>
                <div className="flex items-center justify-center bg-black min-h-[300px] max-h-[70vh]">
                  <img
                    src={previewPhoto.url}
                    alt={previewPhoto.title || ''}
                    className="max-w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Image+Not+Found'
                    }}
                  />
                </div>
                <div className="p-4 bg-background">
                  <h3 className="font-semibold">{previewPhoto.title}</h3>
                  <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-0.5 rounded mt-2 inline-block border">
                    {previewPhoto.category ? previewPhoto.category.charAt(0).toUpperCase() + previewPhoto.category.slice(1) : ''}
                  </span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Photo"
        itemName={photoToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  )
}
