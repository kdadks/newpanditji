import { useState } from 'react'
import { useCharity, convertLegacyProject } from '../../hooks/useCharity'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Heart, HandHeart, FolderSimple, VideoCamera, TextAlignLeft } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { QuillEditor } from '../ui/quill-editor'
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
  const [currentTab, setCurrentTab] = useState('basic')
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
    setCurrentTab('basic')
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
    setCurrentTab('basic')
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 !bg-background">
          {/* Gradient Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-6 py-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <HandHeart className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingProject ? 'Edit Charity Project' : 'Create New Project'}
                </DialogTitle>
                <p className="text-pink-100 text-sm mt-0.5">
                  {editingProject ? 'Update project details and information' : 'Add a new charitable initiative'}
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { id: 'basic', label: 'Project Info', icon: FolderSimple },
                { id: 'description', label: 'Description', icon: TextAlignLeft }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    currentTab === step.id
                      ? 'bg-white text-pink-700 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <step.icon className="h-3.5 w-3.5" weight="bold" />
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Form Content */}
          <div className="flex flex-col h-[calc(90vh-180px)]">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Basic Info Tab */}
              {currentTab === 'basic' && (
                <div className="space-y-5">
                  {/* Project Title */}
                  <Card className="border-2 border-rose-100 !bg-background">
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
                          <Heart className="h-4 w-4 text-rose-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-rose-900">Project Details</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Project Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., One Rotary One Gita Project"
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g., Scripture Distribution, Community Education"
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {['Community Service', 'Scripture Distribution', 'Education', 'Health & Wellness', 'Spiritual Guidance'].map((cat) => (
                            <Badge 
                              key={cat}
                              variant="outline" 
                              className={`cursor-pointer transition-all hover:bg-rose-50 ${
                                formData.category === cat ? 'bg-rose-100 border-rose-300 text-rose-700' : ''
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
                  
                  {/* Video URL */}
                  <Card className="border-2 border-fuchsia-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-100">
                          <VideoCamera className="h-4 w-4 text-fuchsia-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-fuchsia-900">Media (Optional)</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="videoUrl" className="text-sm font-medium">
                          Video URL
                        </Label>
                        <Input
                          id="videoUrl"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">
                          Add a YouTube video link to showcase the project
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Description Tab */}
              {currentTab === 'description' && (
                <div className="space-y-5">
                  <Card className="border-2 border-pink-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100">
                          <TextAlignLeft className="h-4 w-4 text-pink-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-pink-900">Project Description</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Full Description <span className="text-red-500">*</span>
                          </Label>
                          <span className={`text-xs ${formData.description.length > 5000 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {formData.description.replace(/<[^>]*>/g, '').length} / 5,000 characters
                          </span>
                        </div>
                        <QuillEditor
                          value={formData.description}
                          onChange={(value) => setFormData({ ...formData, description: value })}
                          placeholder="Describe your charity project in detail. Include goals, impact, and how people can contribute..."
                          minHeight="250px"
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use the formatting toolbar to add headings, lists, and emphasis to your description.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Writing Tips */}
                  <div className="rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 p-4 border border-rose-100">
                    <h4 className="font-medium text-rose-800 text-sm mb-2">💡 Tips for a Great Description</h4>
                    <ul className="text-xs text-rose-700 space-y-1">
                      <li>• Explain the purpose and mission of the project</li>
                      <li>• Describe the impact on the community</li>
                      <li>• Share any milestones or achievements</li>
                      <li>• Include a call to action for supporters</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentTab !== 'basic' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('basic')}
                      className="gap-2"
                    >
                      ← Back
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  
                  {currentTab === 'basic' ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('description')}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    >
                      Continue to Description →
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving || formData.description.replace(/<[^>]*>/g, '').length > 5000}
                      className="gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
                    >
                      {isSaving ? (
                        <Spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk className="h-4 w-4" weight="bold" />
                      )}
                      {editingProject ? 'Update Project' : 'Save Project'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
