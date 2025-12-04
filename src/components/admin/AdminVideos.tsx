import { useState } from 'react'
import { useVideos, convertLegacyVideo, type Video } from '../../hooks/useVideos'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Video as VideoIcon } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'

type VideoCategory = 'educational' | 'poetry' | 'charity' | 'podcast' | 'ceremony' | 'other'

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
  const [formData, setFormData] = useState<VideoFormData>({
    id: '',
    title: '',
    category: 'educational',
    url: ''
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Videos</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Video
          </Button>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <VideoIcon size={48} className="mx-auto mb-4" />
              <p>No videos yet. Click "Add Video" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {video.thumbnail_url && (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-heading font-semibold text-lg">{video.title}</h3>
                            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                              {video.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground break-all">{video.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                          <PencilSimple size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => openDeleteDialog(video)}
                          disabled={isDeleting}
                        >
                          <Trash size={16} />
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
