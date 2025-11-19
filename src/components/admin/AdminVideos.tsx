import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PencilSimple, Trash, FloppyDisk, X } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import { videos as defaultVideos } from '../../lib/data'

interface Video {
  id: string
  title: string
  category: 'educational' | 'poetry' | 'charity' | 'podcast'
  url: string
}

export default function AdminVideos() {
  const [videos, setVideos] = useKV<Video[]>('admin-videos', defaultVideos as Video[])
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Video>({
    id: '',
    title: '',
    category: 'educational',
    url: ''
  })

  const handleAdd = () => {
    setFormData({
      id: `video-${Date.now()}`,
      title: '',
      category: 'educational',
      url: ''
    })
    setEditingVideo(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (video: Video) => {
    setFormData({ ...video })
    setEditingVideo(video)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title || !formData.url) {
      toast.error('Please fill in all fields')
      return
    }

    setVideos((currentVideos) => {
      const videoList = currentVideos || []
      if (editingVideo) {
        return videoList.map(v => v.id === editingVideo.id ? formData : v)
      } else {
        return [...videoList, formData]
      }
    })

    toast.success(editingVideo ? 'Video updated successfully' : 'Video added successfully')
    setIsDialogOpen(false)
    setEditingVideo(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos((currentVideos) => (currentVideos || []).filter(v => v.id !== id))
      toast.success('Video deleted successfully')
    }
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
          <div className="space-y-4">
            {(videos || []).map((video) => (
              <Card key={video.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{video.title}</h3>
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground break-all">{video.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                        <PencilSimple size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Video['category']) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                  <SelectItem value="charity">Charity Work</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
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
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <FloppyDisk size={18} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
