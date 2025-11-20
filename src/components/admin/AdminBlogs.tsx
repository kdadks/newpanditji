import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Plus, PencilSimple, Trash, FloppyDisk, X } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import { blogArticles as defaultBlogs } from '../../lib/data'

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  category: string
  content?: string
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useLocalStorage<BlogArticle[]>('admin-blogs', defaultBlogs)
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<BlogArticle>({
    id: '',
    title: '',
    excerpt: '',
    category: 'Spiritual Practice',
    content: ''
  })

  const handleAdd = () => {
    setFormData({
      id: `blog-${Date.now()}`,
      title: '',
      excerpt: '',
      category: 'Spiritual Practice',
      content: ''
    })
    setEditingBlog(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (blog: BlogArticle) => {
    setFormData({ ...blog })
    setEditingBlog(blog)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title || !formData.excerpt) {
      toast.error('Please fill in required fields')
      return
    }

    setBlogs((currentBlogs) => {
      const blogList = currentBlogs || []
      if (editingBlog) {
        return blogList.map(b => b.id === editingBlog.id ? formData : b)
      } else {
        return [...blogList, formData]
      }
    })

    toast.success(editingBlog ? 'Blog updated successfully' : 'Blog added successfully')
    setIsDialogOpen(false)
    setEditingBlog(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      setBlogs((currentBlogs) => (currentBlogs || []).filter(b => b.id !== id))
      toast.success('Blog deleted successfully')
    }
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
          <div className="space-y-4">
            {(blogs || []).map((blog) => (
              <Card key={blog.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{blog.title}</h3>
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                        <PencilSimple size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}>
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
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Spiritual Practice, Hindu Traditions"
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
              />
            </div>
            <div>
              <Label htmlFor="content">Full Content (Optional)</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article content..."
                rows={6}
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
