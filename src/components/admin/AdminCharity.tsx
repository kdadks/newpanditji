import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PencilSimple, Trash, FloppyDisk, X } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'

interface CharityProject {
  id: string
  title: string
  description: string
  videoUrl?: string
  category: string
}

export default function AdminCharity() {
  const [projects, setProjects] = useKV<CharityProject[]>('admin-charity', [
    {
      id: 'one-rotary-gita',
      title: 'One Rotary One Gita Project',
      description: 'A groundbreaking initiative to distribute the Bhagavad Gita to communities worldwide, making this sacred wisdom accessible to all.',
      videoUrl: 'https://youtu.be/92VjrCUL1K8',
      category: 'Scripture Distribution'
    }
  ])
  const [editingProject, setEditingProject] = useState<CharityProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CharityProject>({
    id: '',
    title: '',
    description: '',
    videoUrl: '',
    category: 'Community Service'
  })

  const handleAdd = () => {
    setFormData({
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      videoUrl: '',
      category: 'Community Service'
    })
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (project: CharityProject) => {
    setFormData({ ...project })
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields')
      return
    }

    setProjects((currentProjects) => {
      const projectList = currentProjects || []
      if (editingProject) {
        return projectList.map(p => p.id === editingProject.id ? formData : p)
      } else {
        return [...projectList, formData]
      }
    })

    toast.success(editingProject ? 'Project updated successfully' : 'Project added successfully')
    setIsDialogOpen(false)
    setEditingProject(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this charity project?')) {
      setProjects((currentProjects) => (currentProjects || []).filter(p => p.id !== id))
      toast.success('Project deleted successfully')
    }
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
          <div className="space-y-4">
            {(projects || []).map((project) => (
              <Card key={project.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{project.title}</h3>
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      {project.videoUrl && (
                        <p className="text-xs text-muted-foreground">Video: {project.videoUrl}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <PencilSimple size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
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
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Scripture Distribution, Community Education"
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
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
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
