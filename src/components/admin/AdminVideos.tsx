import { useState, useEffect } from 'react'
import { useVideos, convertLegacyVideo, NO_CATEGORY_VALUE, bulkReassignCategory, type Video } from '../../hooks/useVideos'
import { supabase } from '../../lib/supabase'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Video as VideoIcon, MagnifyingGlass, Eye, Play, CaretLeft, CaretRight, GearSix, FolderSimple } from '@phosphor-icons/react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : ''
}

interface VideoFormData {
  id: string
  title: string
  category: string
  url: string
}

export default function AdminVideos() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const itemsPerPage = 25
  
  // Fetch videos with pagination from server
  const { videos, total, totalPages, isLoading, createVideo, updateVideo, deleteVideo, isCreating, isUpdating, isDeleting } = useVideos({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    category: filterCategory !== 'all' ? filterCategory : undefined
  })
  
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState<VideoFormData>({
    id: '',
    title: '',
    category: NO_CATEGORY_VALUE,
    url: ''
  })

  // ── Category management ──────────────────────────────────────────────────
  const INITIAL_CATEGORIES = [
    { value: 'educational', label: '🎓 Educational' },
    { value: 'poetry',      label: '📝 Poetry' },
    { value: 'charity',     label: '❤️ Charity' },
    { value: 'podcast',     label: '🎙️ Podcast' },
    { value: 'ceremony',    label: '🪔 Ceremony' },
    { value: 'other',       label: '📁 Other' },
  ]
  const CATEGORIES_KEY = 'video_categories'

  const [categories, setCategories] = useState<{ value: string; label: string }[]>(INITIAL_CATEGORIES)

  // Sort categories A-Z by label (case-insensitive), ignoring leading emoji
  const stripLeadingEmoji = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase()
  const sortCats = (cats: { value: string; label: string }[]) =>
    [...cats].sort((a, b) => stripLeadingEmoji(a.label).localeCompare(stripLeadingEmoji(b.label)))

  // Load categories from Supabase on mount
  useEffect(() => {
    supabase
      .from('site_metadata')
      .select('setting_value')
      .eq('setting_key', CATEGORIES_KEY)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.setting_value) {
          try { setCategories(sortCats(JSON.parse(data.setting_value))) } catch { /* ignore */ }
        }
      })
  }, [])

  // The permanent "No Category" entry – always present, never deletable
  const NO_CATEGORY_ENTRY = { value: NO_CATEGORY_VALUE, label: '🏷️ No Category' }

  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false)
  const [catEditIndex, setCatEditIndex] = useState<number | null>(null)
  const [catEditIcon, setCatEditIcon] = useState('')
  const [catEditName, setCatEditName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('')
  const [newCatName, setNewCatName] = useState('')
  const [catDeleting, setCatDeleting] = useState<number | null>(null)

  // Common emoji presets for quick picking
  const ICON_PRESETS = ['🎓','📝','❤️','🎙️','🪔','📁','🎊','🌸','🕉️','🔱','🪷','🏛️','🎭','🌺','📿','🪅','🎆','🏔️','🌄','🌟','🎶','🛕','🌼','🌻','🎑','🎐','🎇','🪬','🎬','📹']

  const persistCategories = async (cats: { value: string; label: string }[]) => {
    const sorted = sortCats(cats)
    setCategories(sorted)
    const payload = JSON.stringify(sorted)
    try {
      const { data: existing } = await supabase
        .from('site_metadata')
        .select('id')
        .eq('setting_key', CATEGORIES_KEY)
        .maybeSingle()

      if (existing?.id) {
        await supabase
          .from('site_metadata')
          .update({ setting_value: payload, updated_at: new Date().toISOString() })
          .eq('setting_key', CATEGORIES_KEY)
      } else {
        await supabase
          .from('site_metadata')
          .insert({ setting_key: CATEGORIES_KEY, setting_value: payload, setting_type: 'json', category: 'videos', description: 'Video categories for media management' })
      }
    } catch (err) {
      console.error('[persistCategories] failed:', err)
      toast.error('Failed to save categories to database')
    }
  }

  const buildLabel = (icon: string, name: string) =>
    icon.trim() ? `${icon.trim()} ${name.trim()}` : name.trim()

  const splitLabel = (label: string): { icon: string; name: string } => {
    const match = label.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u)
    if (match) return { icon: match[0].trimEnd(), name: label.slice(match[0].length) }
    return { icon: '', name: label }
  }

  const handleAddCategory = async () => {
    const name = newCatName.trim()
    if (!name) { toast.error('Category name is required'); return }
    const val = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    if (!val) { toast.error('Category name must contain letters or numbers'); return }
    if (categories.some(c => c.value === val)) { toast.error('Category already exists'); return }
    const lbl = buildLabel(newCatIcon, name)
    await persistCategories([...categories, { value: val, label: lbl }])
    setNewCatIcon('')
    setNewCatName('')
    toast.success(`Category "${lbl}" added`)
  }

  const handleStartEditCat = (idx: number) => {
    const parts = splitLabel(categories[idx].label)
    setCatEditIndex(idx)
    setCatEditIcon(parts.icon)
    setCatEditName(parts.name)
  }

  const handleSaveEditCat = async (idx: number) => {
    const name = catEditName.trim()
    if (!name) { toast.error('Category name is required'); return }
    const val = categories[idx].value
    const lbl = buildLabel(catEditIcon, name)
    const updated = categories.map((c, i) => i === idx ? { value: val, label: lbl } : c)
    await persistCategories(updated)
    setCatEditIndex(null)
    toast.success('Category updated')
  }

  const handleDeleteCat = async (idx: number) => {
    const cat = categories[idx]
    if (cat.value === NO_CATEGORY_VALUE) return
    setCatDeleting(idx)
    try {
      const moved = await bulkReassignCategory(cat.value, NO_CATEGORY_VALUE)
      await persistCategories(categories.filter((_, i) => i !== idx))
      toast.success(
        moved > 0
          ? `Category "${cat.label}" deleted. ${moved} video(s) moved to "No Category" — assign them a new category anytime.`
          : `Category "${cat.label}" deleted.`
      )
    } catch {
      toast.error('Failed to delete category. Please try again.')
    } finally {
      setCatDeleting(null)
    }
  }

  // Get display label for a category value
  const getCategoryLabel = (cat: string) => {
    if (!cat || cat === NO_CATEGORY_VALUE) return NO_CATEGORY_ENTRY.label
    return categories.find(c => c.value === cat)?.label ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
  }
  // ─────────────────────────────────────────────────────────────────────────

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
      title: '',
      category: NO_CATEGORY_VALUE,
      url: ''
    })
    setEditingVideo(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (video: Video) => {
    setFormData({
      id: video.id,
      title: video.title,
      category: video.category || NO_CATEGORY_VALUE,
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
          <p className="text-sm text-muted-foreground">{total} videos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCatManagerOpen(true)} variant="outline" size="sm" className="gap-1.5" title="Manage Categories">
            <GearSix size={16} weight="bold" />
            Categories
          </Button>
          <Button onClick={handleAdd} size="sm" className="gap-1.5">
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48 h-9">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value={NO_CATEGORY_VALUE}>{NO_CATEGORY_ENTRY.label}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Videos Grid */}
      {total === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {!searchQuery && filterCategory === 'all' ? (
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
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group relative rounded-lg overflow-hidden border bg-card cursor-pointer"
              onClick={() => setPreviewVideo(video)}
            >
              <div className="aspect-video bg-muted relative">
                {(() => {
                  const thumbSrc = video.thumbnail_url || (getYouTubeId(video.url) ? `https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg` : null)
                  return thumbSrc ? (
                    <img
                      src={thumbSrc}
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
                  )
                })()}
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
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate block max-w-[90px] ${
                  !video.category || video.category === NO_CATEGORY_VALUE
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-white/90 text-gray-800'
                }`}>
                  {getCategoryLabel(video.category)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, total)} of {total} videos
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
                    <>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span key={`ellipsis-${page}`} className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    </>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {editingVideo ? 'Update video details and settings' : 'Add a new YouTube video to your collection'}
            </DialogDescription>
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
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isSaving}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY_VALUE}>{NO_CATEGORY_ENTRY.label}</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
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
          <DialogTitle className="sr-only">
            {previewVideo?.title || 'Video Preview'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Video preview player for {previewVideo?.title || 'selected video'}
          </DialogDescription>
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
                  src={`https://www.youtube.com/embed/${getYouTubeId(previewVideo.url)}?autoplay=1&mute=1&playsinline=1`}
                  title={previewVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
            {previewVideo && (
              <div className="p-4 bg-background">
                <h3 className="font-semibold">{previewVideo.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded inline-block border ${
                  !previewVideo.category || previewVideo.category === NO_CATEGORY_VALUE
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-white/90 text-gray-800 border-transparent'
                }`}>
                  {getCategoryLabel(previewVideo.category)}
                </span>
                  <a
                    href={previewVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
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

      {/* ── Category Manager Dialog ──────────────────────────────────────────── */}
      <Dialog open={isCatManagerOpen} onOpenChange={setIsCatManagerOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden p-0 bg-background">
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 px-6 py-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <GearSix className="h-6 w-6 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">Manage Video Categories</DialogTitle>
                <DialogDescription className="text-purple-100 text-sm">
                  Add, rename or remove video categories
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden" style={{ maxHeight: 'calc(85vh - 120px)' }}>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* ── Add New Category ── */}
              <Card className="border-2 border-green-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
                      <Plus className="h-4 w-4 text-green-600" weight="bold" />
                    </div>
                    <h3 className="font-semibold text-green-900 text-sm">Add New Category</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Icon picker */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Icon <span className="font-normal">(pick or type any emoji)</span>
                      </Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {ICON_PRESETS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNewCatIcon(emoji)}
                            className={`text-lg rounded p-0.5 transition-all hover:scale-110 ${newCatIcon === emoji ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-muted'}`}
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <Input
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        placeholder="Or type any emoji…"
                        className="h-9 text-lg"
                        maxLength={8}
                      />
                    </div>
                    {/* Name */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Category Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Devotional"
                        className="h-9"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      {newCatName.trim() && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Preview: <span className="font-medium">{buildLabel(newCatIcon, newCatName)}</span>
                          &nbsp;·&nbsp;key: <code className="bg-muted px-1 rounded">{newCatName.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'')}</code>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleAddCategory}
                      size="sm"
                      className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus size={14} weight="bold" />
                      Add Category
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ── Existing Categories ── */}
              <Card className="border-2 border-violet-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                      <FolderSimple className="h-4 w-4 text-violet-600" weight="duotone" />
                    </div>
                    <h3 className="font-semibold text-violet-900 text-sm flex-1">
                      Existing Categories <span className="ml-1 text-muted-foreground font-normal">({categories.length + 1})</span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {/* No Category – permanent, non-deletable */}
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium">{NO_CATEGORY_ENTRY.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{NO_CATEGORY_ENTRY.value}</span>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-medium shrink-0">default fallback</span>
                      </div>
                    </div>

                    {categories.map((cat, idx) => (
                      <div key={cat.value} className="rounded-lg border bg-muted/30 px-3 py-2 transition-colors">
                        {catEditIndex === idx ? (
                          /* Edit mode */
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1 mb-1">
                              {ICON_PRESETS.slice(0, 15).map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setCatEditIcon(emoji)}
                                  className={`text-base rounded p-0.5 transition-all hover:scale-110 ${catEditIcon === emoji ? 'ring-2 ring-violet-400 bg-violet-50' : 'hover:bg-muted'}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <Input
                                value={catEditIcon}
                                onChange={(e) => setCatEditIcon(e.target.value)}
                                placeholder="Icon"
                                className="h-8 text-sm w-16 text-center"
                                maxLength={8}
                              />
                              <Input
                                value={catEditName}
                                onChange={(e) => setCatEditName(e.target.value)}
                                placeholder="Category name"
                                className="h-8 text-sm flex-1"
                                autoFocus
                              />
                            </div>
                            <div className="flex gap-1.5 pt-1">
                              <Button
                                size="sm"
                                className="h-7 gap-1 flex-1 text-xs"
                                onClick={() => handleSaveEditCat(idx)}
                              >
                                <FloppyDisk size={12} weight="bold" /> Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-xs"
                                onClick={() => setCatEditIndex(null)}
                              >
                                <X size={12} /> Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* View mode */
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium">{cat.label}</span>
                              <span className="ml-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{cat.value}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-violet-600 hover:bg-violet-50"
                                onClick={() => handleStartEditCat(idx)}
                                title="Rename"
                                disabled={catDeleting === idx}
                              >
                                <PencilSimple size={13} weight="bold" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteCat(idx)}
                                title="Delete – videos will be moved to No Category"
                                disabled={catDeleting !== null}
                              >
                                {catDeleting === idx
                                  ? <Spinner size={13} className="animate-spin" />
                                  : <Trash size={13} weight="bold" />}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setIsCatManagerOpen(false)}>
                <X className="h-4 w-4 mr-2" /> Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
