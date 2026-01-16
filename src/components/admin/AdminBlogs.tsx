import { useState, useEffect } from 'react'
import { useBlogs } from '../../hooks/useBlogs'
import { usePhotos } from '../../hooks/usePhotos'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, Article, Tag, FileText, Notebook, Image as ImageIcon, Upload, Eye, Clock, CheckCircle, WarningCircle, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { QuillEditor } from '../ui/quill-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { supabase, generateSlug, type BlogPostRow, type BlogPostInsert } from '../../lib/supabase'

interface BlogCategory {
  id: string
  name: string
  slug: string
}

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  category_id: string | null
  featured_image_url: string | null
  status: 'draft' | 'published' | 'archived'
  reading_time_minutes: number | null
  meta_title: string
  meta_description: string
}

export default function AdminBlogs() {
  const { blogs, isLoading, createBlog, updateBlog, deleteBlog, isCreating, isUpdating, isDeleting } = useBlogs(true) // Pass true to fetch all blogs including drafts
  const { photos } = usePhotos()
  const [editingBlog, setEditingBlog] = useState<BlogPostRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [currentTab, setCurrentTab] = useState('basic')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<BlogPostRow | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    category_id: null,
    featured_image_url: null,
    status: 'draft',
    reading_time_minutes: null,
    meta_title: '',
    meta_description: ''
  })

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  // Calculate reading time based on content
  const calculateReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '') // Strip HTML
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / 200) // Average reading speed: 200 words per minute
  }

  const handleAdd = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category_id: categories[0]?.id || null,
      featured_image_url: null,
      status: 'draft',
      reading_time_minutes: null,
      meta_title: '',
      meta_description: ''
    })
    setEditingBlog(null)
    setCurrentTab('basic')
    setIsDialogOpen(true)
  }

  const handleEdit = (blog: BlogPostRow) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category_id: blog.category_id,
      featured_image_url: blog.featured_image_url,
      status: blog.status,
      reading_time_minutes: blog.reading_time_minutes,
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || ''
    })
    setEditingBlog(blog)
    setCurrentTab('basic')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in title, excerpt, and content')
      return
    }

    const contentLength = formData.content.replace(/<[^>]*>/g, '').trim().length
    if (contentLength > 15000) {
      toast.error(`Article content exceeds maximum limit. Current: ${contentLength.toLocaleString()} / 15,000 characters`)
      return
    }

    try {
      // Calculate reading time
      const readingTime = calculateReadingTime(formData.content)

      const blogData: BlogPostInsert = {
        title: formData.title,
        slug: generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: formData.category_id,
        featured_image_url: formData.featured_image_url,
        status: formData.status,
        reading_time_minutes: readingTime,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        meta_keywords: null,
        canonical_url: null,
        view_count: 0,
        is_featured: false,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      }

      if (editingBlog) {
        await updateBlog({
          id: editingBlog.id,
          ...blogData
        })
      } else {
        await createBlog(blogData as BlogPostInsert)
      }

      setIsDialogOpen(false)
      setEditingBlog(null)
    } catch (error) {
      console.error('Error saving blog:', error)
      // Error toast is handled by the hook
    }
  }

  const openDeleteDialog = (blog: BlogPostRow) => {
    setBlogToDelete(blog)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!blogToDelete) return
    try {
      await deleteBlog(blogToDelete.id)
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
    } catch {
      // Error toast is handled by the hook
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
          <div>
            <CardTitle>Manage Blog Articles</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage spiritual wisdom articles
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Article
          </Button>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Article size={48} className="mx-auto mb-4" />
              <p>No blog articles yet. Click "Add Article" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="border-l-4 border-l-primary/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Featured Image */}
                    {blog.featured_image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden h-40 bg-muted">
                        <img
                          src={blog.featured_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-lg line-clamp-2 flex-1">
                            {blog.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {blog.status === 'published' ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                              <CheckCircle size={12} weight="fill" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <WarningCircle size={12} weight="fill" />
                              Draft
                            </Badge>
                          )}
                          {blog.reading_time_minutes && (
                            <Badge variant="outline" className="gap-1">
                              <Clock size={12} />
                              {blog.reading_time_minutes} min
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {blog.excerpt}
                        </p>

                        {blog.published_at && (
                          <p className="text-xs text-muted-foreground">
                            Published {new Date(blog.published_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                          <PencilSimple size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => openDeleteDialog(blog)}
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

      {/* Enhanced Blog CMS Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-r from-primary via-primary/90 to-accent px-6 py-6">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur ring-2 ring-white/30">
                <Article className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
                </DialogTitle>
                <p className="text-white/90 text-sm mt-0.5">
                  {editingBlog ? 'Update your article content and details' : 'Share spiritual wisdom with your readers'}
                </p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { id: 'basic', label: 'Details', icon: Tag },
                { id: 'image', label: 'Image', icon: ImageIcon },
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'seo', label: 'SEO', icon: Eye }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    currentTab === step.id
                      ? 'bg-white text-primary shadow-lg'
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
          <div className="flex flex-col h-[calc(90vh-200px)]">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Basic Info Tab */}
              {currentTab === 'basic' && (
                <div className="space-y-5">
                  <Card>
                    <CardContent className="pt-5 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Article Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a compelling title..."
                          className="h-11"
                          disabled={isSaving}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium">
                            Category <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category_id || undefined}
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                            disabled={isSaving || isLoadingCategories}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-sm font-medium">
                            Status <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}
                            disabled={isSaving}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-medium">
                          Excerpt <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          placeholder="Brief summary for article previews..."
                          rows={3}
                          className="resize-none"
                          disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">
                          Appears in article cards and search results
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Featured Image Tab */}
              {currentTab === 'image' && (
                <div className="space-y-5">
                  <Card>
                    <CardContent className="pt-5">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Featured Image
                          </Label>
                          <p className="text-xs text-muted-foreground mb-4">
                            Choose a hero image for your article from the media library
                          </p>

                          {/* Image Preview */}
                          {formData.featured_image_url ? (
                            <div className="relative mb-4 rounded-lg overflow-hidden border">
                              <img
                                src={formData.featured_image_url}
                                alt="Featured"
                                className="w-full h-64 object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setFormData({ ...formData, featured_image_url: null })
                                }}
                                disabled={isSaving}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                              onClick={() => setShowImagePicker(true)}
                            >
                              <ImageIcon className="mx-auto mb-3 text-muted-foreground" size={32} weight="duotone" />
                              <p className="text-sm font-medium mb-1">
                                Select from Media Library
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Choose from uploaded images
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Content Tab */}
              {currentTab === 'content' && (
                <div className="space-y-5">
                  <Card>
                    <CardContent className="pt-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Article Content <span className="text-red-500">*</span>
                          </Label>
                          <div className="text-xs">
                            <span className={`font-medium ${
                              formData.content.replace(/<[^>]*>/g, '').trim().length > 15000
                                ? 'text-red-500'
                                : 'text-green-600'
                            }`}>
                              {formData.content.replace(/<[^>]*>/g, '').trim().length.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground"> / 15,000 characters max</span>
                          </div>
                        </div>
                        <QuillEditor
                          value={formData.content}
                          onChange={(value) => setFormData({ ...formData, content: value })}
                          placeholder="Write your article content here..."
                          minHeight="400px"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Use formatting tools to structure your content with headings, lists, and emphasis
                          </span>
                          <span className="text-muted-foreground">
                            {formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* SEO Tab */}
              {currentTab === 'seo' && (
                <div className="space-y-5">
                  <Card>
                    <CardContent className="pt-5 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-1">Search Engine Optimization</h3>
                        <p className="text-xs text-muted-foreground">
                          Optimize your article for search engines and social media
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta_title" className="text-sm font-medium">
                          Meta Title
                        </Label>
                        <Input
                          id="meta_title"
                          value={formData.meta_title}
                          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                          placeholder="SEO title (defaults to article title if empty)"
                          className="h-11"
                          disabled={isSaving}
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.meta_title.length}/60 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta_description" className="text-sm font-medium">
                          Meta Description
                        </Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                          placeholder="SEO description (defaults to excerpt if empty)"
                          rows={3}
                          className="resize-none"
                          disabled={isSaving}
                          maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.meta_description.length}/160 characters
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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
                      onClick={() => {
                        const tabs = ['basic', 'image', 'content', 'seo']
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex > 0) {
                          setCurrentTab(tabs[currentIndex - 1] as typeof currentTab)
                        }
                      }}
                      className="gap-2"
                      disabled={isSaving}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  
                  {currentTab === 'seo' ? (
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving || !formData.title || !formData.content || !formData.excerpt || !formData.category_id || formData.content.replace(/<[^>]*>/g, '').trim().length > 15000}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Spinner className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FloppyDisk size={16} weight="bold" />
                          {editingBlog ? 'Update Article' : 'Publish Article'}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'image', 'content', 'seo']
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex < tabs.length - 1) {
                          setCurrentTab(tabs[currentIndex + 1] as typeof currentTab)
                        }
                      }}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      Next
                      <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Picker Modal - Inside DialogContent */}
          {showImagePicker && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-background rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-blue-500/5 to-purple-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ImageIcon size={20} className="text-blue-600" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Select Featured Image</h3>
                      <p className="text-xs text-muted-foreground">Choose from your media library</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowImagePicker(false)} className="rounded-full">
                    <X size={20} />
                  </Button>
                </div>
                <div className="p-5 overflow-y-auto flex-1">
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="cursor-pointer group relative aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg"
                          onClick={() => {
                            setFormData({ ...formData, featured_image_url: photo.url })
                            setShowImagePicker(false)
                            toast.success('Featured image selected')
                          }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-full text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              Select
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-xs font-medium truncate drop-shadow-lg">{photo.title}</p>
                            {photo.category && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {photo.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon size={32} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-2">No images found</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload images to the Media section first
                      </p>
                      <Button onClick={() => setShowImagePicker(false)} variant="outline">
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Blog Article"
        itemName={blogToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  )
}
