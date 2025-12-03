import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'
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

  const { photos, isLoading, refetch } = usePhotos()

  // Get unique categories from photos
  const categories = useMemo(() => {
    const cats = new Set<string>()
    photos.forEach(photo => {
      if (photo.category) cats.add(photo.category)
    })
    return ['all', ...Array.from(cats).sort()]
  }, [photos])

  // Filter photos based on search and category
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const matchesSearch = !searchQuery || 
        photo.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        photo.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [photos, searchQuery, selectedCategory])

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
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon size={24} className="text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'library' | 'upload')} className="flex-1 flex flex-col min-h-0">
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

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 mt-4">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4 mb-4 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image Grid */}
            <ScrollArea className="flex-1 min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="animate-spin text-primary" size={32} />
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <p>No images found</p>
                  {searchQuery && <p className="text-sm">Try adjusting your search</p>}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1">
                  {filteredPhotos.map(photo => (
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

            {/* Selected Preview */}
            {tempSelectedUrl && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-3 shrink-0">
                <img
                  src={tempSelectedUrl}
                  alt="Selected"
                  className="w-16 h-16 object-cover rounded"
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

        <DialogFooter className="shrink-0 mt-4">
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
