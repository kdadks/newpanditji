import { useState } from 'react'
import { useCharity, convertLegacyProject } from '../../hooks/useCharity'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Heart } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import type { CharityProjectRow } from '../../lib/supabase'

interface CharityFormData {
  id: string
  title: string
  description: string
  videoUrl: string
  category: string
}

export default function AdminCharity() {
  const { projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating, isDeleting } = useCharity()
  const [editingProject, setEditingProject] = useState<CharityProjectRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CharityFormData>({
    id: '',
    title: '',
    description: '',
    videoUrl: '',
    category: 'Community Service'
  })

  const handleAdd = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      videoUrl: '',
      category: 'Community Service'
    })
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (project: CharityProjectRow) => {
    setFormData({
      id: project.id,
      title: project.name,
      description: project.full_description,
      videoUrl: project.video_url || '',
      category: project.category
    })
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          name: formData.title,
          short_description: formData.description.substring(0, 200),
          full_description: formData.description,
          video_url: formData.videoUrl || null,
          category: formData.category
        })
      } else {
        const newProject = convertLegacyProject({
          title: formData.title,
          description: formData.description,
          videoUrl: formData.videoUrl,
          category: formData.category
        })
        await createProject(newProject)
      }
      setIsDialogOpen(false)
      setEditingProject(null)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this charity project?')) {
      try {
        await deleteProject(id)
      } catch {
        // Error toast is handled by the hook
      }
    }
  }

  const isSaving = isCreating || isUpdating

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading charity projects...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Charity Projects</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart size={48} className="mx-auto mb-4" />
              <p>No charity projects yet. Click "Add Project" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-heading font-semibold text-lg">{project.name}</h3>
                          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                            {project.category}
                          </span>
                          {project.is_active ? (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.short_description}</p>
                        {project.video_url && (
                          <p className="text-xs text-muted-foreground">Video: {project.video_url}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          <PencilSimple size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(project.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Charity Project' : 'Add New Charity Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., One Rotary One Gita Project"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Scripture Distribution, Community Education"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the charity project..."
                rows={4}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
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
    </div>
  )
}
