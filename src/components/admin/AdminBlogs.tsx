import { useState } from 'react'
import { useBlogs, convertLegacyBlog } from '../../hooks/useBlogs'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Article, Tag, FileText, Notebook } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { QuillEditor } from '../ui/quill-editor'
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
  const [currentTab, setCurrentTab] = useState('basic')
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
    setCurrentTab('basic')
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
    setCurrentTab('basic')
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

      {/* Modern Redesigned Blog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 !bg-background">
          {/* Gradient Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <Article className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-0.5">
                  {editingBlog ? 'Update your article content and details' : 'Share your knowledge with readers'}
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { id: 'basic', label: 'Article Info', icon: Tag },
                { id: 'content', label: 'Content', icon: FileText }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    currentTab === step.id
                      ? 'bg-white text-indigo-700 shadow-lg'
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
                  {/* Title Field */}
                  <Card className="border-2 border-blue-100 !bg-background">
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Notebook className="h-4 w-4 text-blue-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Article Details</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Article Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a compelling title for your article..."
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
                          placeholder="e.g., Spiritual Practice, Vedic Knowledge, Astrology"
                          className="h-11 bg-background"
                          disabled={isSaving}
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {['Spiritual Practice', 'Vedic Knowledge', 'Astrology', 'Rituals', 'Life Guidance'].map((cat) => (
                            <Badge 
                              key={cat}
                              variant="outline" 
                              className={`cursor-pointer transition-all hover:bg-blue-50 ${
                                formData.category === cat ? 'bg-blue-100 border-blue-300 text-blue-700' : ''
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
                  
                  {/* Excerpt Field */}
                  <Card className="border-2 border-purple-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                          <FileText className="h-4 w-4 text-purple-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-purple-900">Article Excerpt</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-medium">
                          Short Summary <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          placeholder="Write a brief summary that will appear in article previews..."
                          rows={3}
                          className="resize-none bg-background"
                          disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">
                          This appears in search results and article cards. Keep it concise and engaging.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Content Tab */}
              {currentTab === 'content' && (
                <div className="space-y-5">
                  <Card className="border-2 border-indigo-100 !bg-background">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <Article className="h-4 w-4 text-indigo-600" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-indigo-900">Full Article Content</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Article Body <span className="text-red-500">*</span>
                          </Label>
                          <span className={`text-xs ${formData.content.replace(/<[^>]*>/g, '').length > 10000 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {formData.content.replace(/<[^>]*>/g, '').length} / 10,000 characters
                          </span>
                        </div>
                        <QuillEditor
                          value={formData.content}
                          onChange={(value) => setFormData({ ...formData, content: value })}
                          placeholder="Write your full article content here. Use the formatting tools to add headings, lists, bold text, and more..."
                          minHeight="300px"
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use the formatting toolbar to structure your article with headings, lists, and text styling.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Writing Tips */}
                  <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                    <h4 className="font-medium text-indigo-800 text-sm mb-2">✨ Writing Tips</h4>
                    <ul className="text-xs text-indigo-700 space-y-1">
                      <li>• Use H2 and H3 headings to structure your content</li>
                      <li>• Break content into clear paragraphs for readability</li>
                      <li>• Use bullet points for lists of items or steps</li>
                      <li>• Bold key terms and important information</li>
                      <li>• End with a meaningful conclusion or call to action</li>
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
                      onClick={() => setCurrentTab('content')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Continue to Content →
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving || formData.content.replace(/<[^>]*>/g, '').length > 10000}
                      className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isSaving ? (
                        <Spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk className="h-4 w-4" weight="bold" />
                      )}
                      {editingBlog ? 'Update Article' : 'Publish Article'}
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
