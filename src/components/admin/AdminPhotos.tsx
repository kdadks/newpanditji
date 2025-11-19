import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, Trash, Upload } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'

interface Photo {
  id: string
  url: string
  title: string
  category: string
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useKV<Photo[]>('admin-photos', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Photo>({
    id: '',
    url: '',
    title: '',
    category: 'ceremony'
  })

  const handleAdd = () => {
    setFormData({
      id: `photo-${Date.now()}`,
      url: '',
      title: '',
      category: 'ceremony'
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.url || !formData.title) {
      toast.error('Please fill in all fields')
      return
    }

    setPhotos((currentPhotos) => [...(currentPhotos || []), formData])
    toast.success('Photo added successfully')
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setPhotos((currentPhotos) => (currentPhotos || []).filter(p => p.id !== id))
      toast.success('Photo deleted successfully')
    }
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
          {!photos || photos.length === 0 ? (
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
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{photo.title}</h3>
                      <span className="text-xs text-muted-foreground">{photo.category}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash size={16} className="mr-2" />
                        Delete
                      </Button>
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
            <DialogTitle>Add New Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Photo Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Wedding Ceremony 2024"
              />
            </div>
            <div>
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground mt-1">Enter the full URL of the image</p>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., ceremony, pooja, wedding"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
