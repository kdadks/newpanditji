import { useState } from 'react'
import { useBlogs, convertLegacyBlog } from '../../hooks/useBlogs'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Article } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import type { BlogPostRow } from '../../lib/supabase'

interface BlogFormData {
  id: string
  title: string
  excerpt: string
  category: string
  content: string
}

export default function AdminBlogs() {
  const { blogs, isLoading, createBlog, updateBlog, deleteBlog, isCreating, isUpdating, isDeleting } = useBlogs()
  const [editingBlog, setEditingBlog] = useState<BlogPostRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    id: '',
    title: '',
    excerpt: '',
    category: 'Spiritual Practice',
    content: ''
  })

  const handleAdd = () => {
    setFormData({
      id: '',
      title: '',
      excerpt: '',
      category: 'Spiritual Practice',
      content: ''
    })
    setEditingBlog(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (blog: BlogPostRow) => {
    setFormData({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      content: blog.content
    })
    setEditingBlog(blog)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      if (editingBlog) {
        await updateBlog({
          id: editingBlog.id,
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content || formData.excerpt,
          category: formData.category
        })
      } else {
        const newBlog = convertLegacyBlog({
          title: formData.title,
          excerpt: formData.excerpt,
          category: formData.category,
          content: formData.content
        })
        await createBlog(newBlog)
      }
      setIsDialogOpen(false)
      setEditingBlog(null)
    } catch {
      // Error toast is handled by the hook
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      try {
        await deleteBlog(id)
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
        <span className="ml-2 text-muted-foreground">Loading blogs...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Blog Articles</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Blog
          </Button>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Article size={48} className="mx-auto mb-4" />
              <p>No blog articles yet. Click "Add Blog" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-heading font-semibold text-lg">{blog.title}</h3>
                          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                            {blog.category}
                          </span>
                          {blog.is_published ? (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Published
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                        {blog.read_time_minutes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {blog.read_time_minutes} min read
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                          <PencilSimple size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(blog.id)}
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
            <DialogTitle>{editingBlog ? 'Edit Blog Article' : 'Add New Blog Article'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., The Significance of Regular Pooja"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Spiritual Practice, Hindu Traditions"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt (Brief Summary)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary of the article..."
                rows={3}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article content..."
                rows={6}
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
