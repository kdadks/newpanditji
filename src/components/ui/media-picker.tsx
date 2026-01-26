import { useState, useMemo, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { ScrollArea } from './scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Image as ImageIcon, MagnifyingGlass, Check, X, Upload, FolderOpen, Spinner } from '@phosphor-icons/react'
import { usePhotos } from '../../hooks/usePhotos'
import { uploadImage, BUCKETS } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  selectedUrl?: string
  title?: string
  allowUpload?: boolean
}

export function MediaPicker({ 
  open, 
  onOpenChange, 
  onSelect, 
  selectedUrl,
  title = 'Select Image',
  allowUpload = true
}: MediaPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [tempSelectedUrl, setTempSelectedUrl] = useState<string | null>(selectedUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<string[]>(['all'])
  const pageSize = 25

  // Only fetch photos when modal is open
  const { photos, isLoading, refetch, total, totalPages } = usePhotos({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    enabled: open // Only fetch when modal is open
  })

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1)
      setSearchQuery('')
      setSelectedCategory('all')
      setTempSelectedUrl(selectedUrl || null) // Reset to current selectedUrl when opening
    }
  }, [open, selectedUrl])

  // Fetch categories only once when modal opens
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const { data, error } = await supabase
            .from('media_files')
            .select('folder')
            .eq('file_type', 'image')
            .not('folder', 'is', null)

          if (error) throw error

          const uniqueFolders = new Set<string>()
          data?.forEach((item) => {
            if (item.folder) uniqueFolders.add(item.folder)
          })

          setCategories(['all', ...Array.from(uniqueFolders).sort()])
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      }

      fetchCategories()
    }
  }, [open])

  // Reset to page 1 when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSelect = () => {
    if (tempSelectedUrl) {
      onSelect(tempSelectedUrl)
      onOpenChange(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Upload to storage using the existing uploadImage function
      const result = await uploadImage(file, 'uploads')

      // Create entry in media_files table
      const { data, error } = await supabase
        .from('media_files')
        .insert({
          file_name: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          original_name: file.name,
          file_type: 'image',
          mime_type: file.type,
          file_size: file.size,
          file_url: result.url,
          thumbnail_url: result.thumbnailUrl || result.url,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          folder: 'uploads',
          tags: ['uploaded']
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Image uploaded successfully')
      
      // Refresh the photos list
      await refetch()
      
      // Select the newly uploaded image
      setTempSelectedUrl(result.url)
      setActiveTab('library')
      setCurrentPage(1) // Go to first page to see the newly uploaded image
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col gap-4">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon size={24} className="text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Choose an image from your media library or upload a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'library' | 'upload')} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="library">
              <FolderOpen size={16} className="mr-2" />
              Media Library
            </TabsTrigger>
            {allowUpload && (
              <TabsTrigger value="upload">
                <Upload size={16} className="mr-2" />
                Upload New
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4 mb-4 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="animate-spin text-primary" size={32} />
                  </div>
                ) : photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <p>No images found</p>
                    {searchQuery && <p className="text-sm">Try adjusting your search</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1 pb-4">
                    {photos.map(photo => (
                      <div
                        key={photo.id}
                        className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          tempSelectedUrl === photo.url 
                            ? 'border-primary ring-2 ring-primary/30' 
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => setTempSelectedUrl(photo.url)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-white text-xs truncate w-full">{photo.title}</span>
                        </div>
                        {/* Selection indicator */}
                        {tempSelectedUrl === photo.url && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check size={14} weight="bold" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Pagination Controls - Outside ScrollArea */}
              {!isLoading && photos.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 pt-2 border-t shrink-0">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} of {total} images
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first, last, and pages around current
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            className="w-9 h-9 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {allowUpload && (
            <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center mt-4">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 text-center w-full max-w-md">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="animate-spin text-primary" size={48} />
                    <p className="text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload an Image</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG, GIF, WEBP up to 5MB
                    </p>
                    <Label htmlFor="media-upload" className="cursor-pointer">
                      <Input
                        id="media-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                      />
                      <Button asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                  </>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Selected Preview - Outside Tabs */}
        {tempSelectedUrl && (
          <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3 shrink-0">
            <img
              src={tempSelectedUrl}
              alt="Selected"
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Selected Image</p>
              <p className="text-xs text-muted-foreground truncate">{tempSelectedUrl}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTempSelectedUrl(null)}
            >
              <X size={16} />
            </Button>
          </div>
        )}

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!tempSelectedUrl}>
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Compact version for inline use
interface MediaPickerInputProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  label?: string
}

export function MediaPickerInput({ value, onChange, placeholder = 'Select image...', label }: MediaPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          {value && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onChange('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          title="Browse Media Library"
        >
          <ImageIcon size={18} />
        </Button>
      </div>
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview"
            className="max-h-24 rounded border"
          />
        </div>
      )}
      <MediaPicker
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelect={onChange}
        selectedUrl={value}
      />
    </div>
  )
}
