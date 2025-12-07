import { useState } from 'react'
import { useVideos, convertLegacyVideo, type Video } from '../../hooks/useVideos'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Video as VideoIcon, MagnifyingGlass, Eye, Play } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'

type VideoCategory = 'educational' | 'poetry' | 'charity' | 'podcast' | 'ceremony' | 'other'

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : ''
}

interface VideoFormData {
  id: string
  title: string
  category: VideoCategory
  url: string
}

export default function AdminVideos() {
  const { videos, isLoading, createVideo, updateVideo, deleteVideo, isCreating, isUpdating, isDeleting } = useVideos()
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [formData, setFormData] = useState<VideoFormData>({
    id: '',
    title: '',
    category: 'educational',
    url: ''
  })

  // Get unique categories from videos
  const categories = Array.from(new Set(videos.map(v => v.category).filter(Boolean)))

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setFormData({
      id: '',
      title: '',
      category: 'educational',
      url: ''
    })
    setEditingVideo(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (video: Video) => {
    setFormData({
      id: video.id,
      title: video.title,
      category: video.category,
      url: video.url
    })
    setEditingVideo(video)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      if (editingVideo) {
        const legacyData = convertLegacyVideo({
          title: formData.title,
          url: formData.url,
          category: formData.category
        })
        await updateVideo({
          id: editingVideo.id,
          title: legacyData.title,
          video_url: legacyData.video_url,
          thumbnail_url: legacyData.thumbnail_url,
          category: legacyData.category
        })
      } else {
        const newVideo = convertLegacyVideo({
          title: formData.title,
          url: formData.url,
          category: formData.category
        })
        await createVideo(newVideo)
      }
      setIsDialogOpen(false)
      setEditingVideo(null)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const openDeleteDialog = (video: Video) => {
    setVideoToDelete(video)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!videoToDelete) return
    try {
      await deleteVideo(videoToDelete.id)
      setDeleteDialogOpen(false)
      setVideoToDelete(null)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const isSaving = isCreating || isUpdating

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading videos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Videos</h2>
          <p className="text-sm text-muted-foreground">{videos.length} videos</p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
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

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {videos.length === 0 ? (
            <>
              <VideoIcon size={32} className="mx-auto mb-2" />
              <p className="text-sm">No videos yet. Click "Add" to get started.</p>
            </>
          ) : (
            <>
              <VideoIcon size={32} className="mx-auto mb-2" />
              <p className="text-sm mb-2">No videos found</p>
              <Button onClick={() => { setSearchQuery(''); setFilterCategory('all') }} variant="outline" size="sm">
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="group relative rounded-lg overflow-hidden border bg-card cursor-pointer"
              onClick={() => setPreviewVideo(video)}
            >
              <div className="aspect-video bg-muted relative">
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/320x180?text=Video'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoIcon size={24} className="text-muted-foreground" />
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Play size={20} weight="fill" className="text-white ml-0.5" />
                  </div>
                </div>
              </div>
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setPreviewVideo(video); }}
                    title="Preview"
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleEdit(video); }}
                    title="Edit"
                  >
                    <PencilSimple size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); openDeleteDialog(video); }}
                    disabled={isDeleting}
                    title="Delete"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
                <div className="text-white text-xs truncate">{video.title}</div>
              </div>
              {/* Category badge */}
              <div className="absolute bottom-1.5 left-1.5 group-hover:opacity-0 transition-opacity pointer-events-none">
                <span className="bg-white/90 text-gray-800 text-[10px] font-medium px-1.5 py-0.5 rounded truncate block">
                  {video.category ? video.category.charAt(0).toUpperCase() + video.category.slice(1) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Hinduism and Science Lecture"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: VideoCategory) => setFormData({ ...formData, category: value })}
                disabled={isSaving}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                  <SelectItem value="charity">Charity Work</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtu.be/..."
                disabled={isSaving}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner className="mr-2 animate-spin" size={18} />
                    Saving...
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

      {/* Preview Modal */}
      <Dialog open={!!previewVideo} onOpenChange={(open) => !open && setPreviewVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 bg-black/50 hover:bg-black/70 text-white cursor-pointer"
              onClick={() => setPreviewVideo(null)}
            >
              <X size={18} />
            </Button>
            {previewVideo && (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(previewVideo.url)}?autoplay=1`}
                  title={previewVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {previewVideo && (
              <div className="p-4 bg-background">
                <h3 className="font-semibold">{previewVideo.title}</h3>
                <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-0.5 rounded mt-2 inline-block">
                  {previewVideo.category ? previewVideo.category.charAt(0).toUpperCase() + previewVideo.category.slice(1) : ''}
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Video"
        itemName={videoToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  )
}
