import { useState } from 'react'
import { usePhotos } from '../../hooks/usePhotos'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks/useBooks'
import { BookRow } from '../../lib/supabase'
import { Plus, PencilSimple, Trash, FloppyDisk, X, Spinner, BookOpen, Image as ImageIcon, Tag, Users, FileText, ListBullets } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'

interface BookFormData {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  coverImage: string
  chapters: string[]
  keyTopics: string[]
  targetAudience: string
  fullDescription: string
}

export default function AdminBooks() {
  const { photos } = usePhotos()
  
  // Database hooks
  const { data: books = [], isLoading } = useBooks()
  const createBookMutation = useCreateBook()
  const updateBookMutation = useUpdateBook()
  const deleteBookMutation = useDeleteBook()

  const [editingBook, setEditingBook] = useState<BookRow | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [currentTab, setCurrentTab] = useState('basic')

  const [formData, setFormData] = useState<BookFormData>({
    id: '',
    title: '',
    subtitle: '',
    category: '',
    description: '',
    coverImage: '',
    chapters: [],
    keyTopics: [],
    targetAudience: '',
    fullDescription: ''
  })

  // Helper states for array inputs
  const [chapterInput, setChapterInput] = useState('')
  const [keyTopicInput, setKeyTopicInput] = useState('')

  const handleAdd = () => {
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      category: '',
      description: '',
      coverImage: '',
      chapters: [],
      keyTopics: [],
      targetAudience: '',
      fullDescription: ''
    })
    setChapterInput('')
    setKeyTopicInput('')
    setEditingBook(null)
    setShowImagePicker(false)
    setCurrentTab('basic')
    setIsDialogOpen(true)
  }

  const handleEdit = (book: BookRow) => {
    setFormData({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle || '',
      category: book.category,
      description: book.description,
      coverImage: book.cover_image_url || '',
      chapters: book.chapter_list || [],
      keyTopics: book.key_topics || [],
      targetAudience: book.target_audience || '',
      fullDescription: book.full_description || ''
    })
    setChapterInput('')
    setKeyTopicInput('')
    setEditingBook(book)
    setShowImagePicker(false)
    setCurrentTab('basic')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields (Title, Category, Description)')
      return
    }

    setIsSaving(true)
    try {
      if (editingBook) {
        await updateBookMutation.mutateAsync({
          id: editingBook.id,
          title: formData.title,
          subtitle: formData.subtitle || null,
          category: formData.category,
          description: formData.description,
          full_description: formData.fullDescription || null,
          cover_image_url: formData.coverImage || null,
          chapter_list: formData.chapters.length > 0 ? formData.chapters : null,
          key_topics: formData.keyTopics.length > 0 ? formData.keyTopics : null,
          target_audience: formData.targetAudience || null,
        })
        toast.success('Book updated successfully')
      } else {
        await createBookMutation.mutateAsync({
          title: formData.title,
          subtitle: formData.subtitle || null,
          author: 'Rajesh Joshi',
          isbn: null,
          category: formData.category,
          description: formData.description,
          full_description: formData.fullDescription || null,
          cover_image_url: formData.coverImage || null,
          preview_pdf_url: null,
          chapter_list: formData.chapters.length > 0 ? formData.chapters : null,
          key_topics: formData.keyTopics.length > 0 ? formData.keyTopics : null,
          target_audience: formData.targetAudience || null,
          amazon_url: null,
          flipkart_url: null,
          other_purchase_urls: null,
          publication_date: null,
          page_count: null,
          language: 'English',
          is_published: true,
          is_featured: false,
          sort_order: 0,
          created_by: null,
        })
        toast.success('Book added successfully')
      }
      setIsDialogOpen(false)
      setEditingBook(null)
    } catch (error) {
      toast.error('Failed to save book')
      console.error('Error saving book:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      await deleteBookMutation.mutateAsync(id)
      toast.success('Book deleted successfully')
    } catch (error) {
      toast.error('Failed to delete book')
      console.error('Error deleting book:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading">Books Management</CardTitle>
              <CardDescription className="mt-2">
                Manage your published books and spiritual literature
              </CardDescription>
            </div>
            <Button onClick={handleAdd} className="gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus size={20} weight="bold" />
              Add New Book
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card className="col-span-full border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Spinner size={48} className="mx-auto mb-4 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground mb-4">Loading books...</p>
            </CardContent>
          </Card>
        ) : books.length === 0 ? (
          <Card className="col-span-full border-dashed border-2">
            <CardContent className="p-12 text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No books yet. Click "Add New Book" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          books.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={book.cover_image_url || '/images/books/placeholder.jpeg'}
                  alt={book.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant="secondary" className="text-xs shadow-lg">
                    {book.category}
                  </Badge>
                  {book.is_featured && (
                    <Badge variant="default" className="text-xs shadow-lg">
                      ⭐ Featured
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {book.subtitle || book.description}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book)}
                    className="flex-1"
                  >
                    <PencilSimple size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit/Add Dialog - Modern Stunning UX */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 bg-background! border shadow-2xl">
          {/* Stunning Header */}
          <DialogHeader className="relative px-8 pt-8 pb-6 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 border-b bg-background">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-orange-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/25">
                {editingBook ? (
                  <PencilSimple size={28} className="text-white" weight="bold" />
                ) : (
                  <Plus size={28} className="text-white" weight="bold" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-heading font-bold">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingBook 
                    ? `Updating "${editingBook.title}"` 
                    : 'Share your spiritual wisdom with readers'
                  }
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="relative mt-6 flex items-center justify-between">
              {[
                { id: 'basic', label: 'Basic Info', icon: '📚', step: 1 },
                { id: 'content', label: 'Content', icon: '📖', step: 2 },
                { id: 'media', label: 'Cover', icon: '🖼️', step: 3 }
              ].map((tab, index) => (
                <div key={tab.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      currentTab === tab.id 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-300 ${currentTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </span>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs opacity-70">Step {tab.step}</div>
                      <div className="font-medium text-sm">{tab.label}</div>
                    </div>
                  </button>
                  {index < 2 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                      ['basic', 'content', 'media'].indexOf(currentTab) > index 
                        ? 'bg-amber-500' 
                        : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-background">
            {/* Basic Info Tab */}
            {currentTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Book Identity Section */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <BookOpen size={20} className="text-amber-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Book Identity</h3>
                        <p className="text-xs text-muted-foreground">Core details about your book</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                          Book Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Hinduism Basics for All"
                          className="h-12 bg-background border-border/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-sm font-medium">
                          Subtitle / Tagline
                        </Label>
                        <Input
                          id="subtitle"
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="Brief subtitle that describes the book"
                          className="h-12 bg-background border-border/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                            Category <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger id="category" className="h-12 bg-background border-border/50">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hinduism Fundamentals">📿 Hinduism Fundamentals</SelectItem>
                              <SelectItem value="Science & Philosophy">🔬 Science & Philosophy</SelectItem>
                              <SelectItem value="Festival & Culture">🎊 Festival & Culture</SelectItem>
                              <SelectItem value="Festival & Spirituality">🪔 Festival & Spirituality</SelectItem>
                              <SelectItem value="Yoga & Meditation">🧘 Yoga & Meditation</SelectItem>
                              <SelectItem value="Education">📖 Education</SelectItem>
                              <SelectItem value="Spiritual Literature">✨ Spiritual Literature</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="targetAudience" className="text-sm font-medium flex items-center gap-2">
                            <Users size={14} className="text-muted-foreground" />
                            Target Audience
                          </Label>
                          <Input
                            id="targetAudience"
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            placeholder="Who should read this book..."
                            className="h-12 bg-background border-border/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descriptions Section */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <FileText size={20} className="text-orange-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Descriptions</h3>
                        <p className="text-xs text-muted-foreground">Tell readers what to expect</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                          Short Description <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">Brief overview shown on the book card</p>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description for the card view..."
                          rows={3}
                          className="bg-background border-border/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullDescription" className="text-sm font-medium">
                          Full Description
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">Complete description for the book detail page</p>
                        <Textarea
                          id="fullDescription"
                          value={formData.fullDescription}
                          onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                          placeholder="Comprehensive book description with key insights..."
                          rows={6}
                          className="bg-background border-border/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {currentTab === 'content' && (
              <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Chapters Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <ListBullets size={20} className="text-blue-600" weight="bold" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Chapters</h3>
                        <p className="text-xs text-muted-foreground">List the chapters in order</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={chapterInput}
                        onChange={(e) => setChapterInput(e.target.value)}
                        placeholder="e.g., Introduction to Vedic Wisdom..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && chapterInput.trim()) {
                            setFormData({ ...formData, chapters: [...formData.chapters, chapterInput.trim()] })
                            setChapterInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if (chapterInput.trim()) {
                            setFormData({ ...formData, chapters: [...formData.chapters, chapterInput.trim()] })
                            setChapterInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[120px] p-4 border border-dashed border-blue-500/30 rounded-xl bg-blue-500/5">
                      {formData.chapters.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Press Enter or click + to add chapters
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {formData.chapters.map((chapter, index) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 group hover:bg-blue-500/15 transition-colors"
                            >
                              <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg font-bold text-sm">
                                {index + 1}
                              </span>
                              <span className="flex-1 text-sm font-medium">{chapter}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-50 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setFormData({
                                  ...formData,
                                  chapters: formData.chapters.filter((_, i) => i !== index)
                                })}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Topics Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Tag size={20} className="text-emerald-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Key Topics</h3>
                        <p className="text-xs text-muted-foreground">Main subjects covered in the book</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Input
                        value={keyTopicInput}
                        onChange={(e) => setKeyTopicInput(e.target.value)}
                        placeholder="e.g., Vedic Philosophy, Mantras..."
                        className="h-12 flex-1 bg-background"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && keyTopicInput.trim()) {
                            setFormData({ ...formData, keyTopics: [...formData.keyTopics, keyTopicInput.trim()] })
                            setKeyTopicInput('')
                            e.preventDefault()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          if (keyTopicInput.trim()) {
                            setFormData({ ...formData, keyTopics: [...formData.keyTopics, keyTopicInput.trim()] })
                            setKeyTopicInput('')
                          }
                        }}
                      >
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[80px] p-4 border border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5">
                      {formData.keyTopics.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Press Enter or click + to add key topics
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.keyTopics.map((topic, index) => (
                            <Badge 
                              key={index} 
                              className="py-2 px-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors group"
                            >
                              <span className="mr-1">✦</span>
                              {topic}
                              <X
                                size={14}
                                className="ml-2 cursor-pointer opacity-50 group-hover:opacity-100 hover:text-destructive transition-all"
                                onClick={() => setFormData({
                                  ...formData,
                                  keyTopics: formData.keyTopics.filter((_, i) => i !== index)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {currentTab === 'media' && (
              <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                {/* Cover Image */}
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <ImageIcon size={20} className="text-purple-600" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Book Cover</h3>
                        <p className="text-xs text-muted-foreground">Select a stunning cover image</p>
                      </div>
                    </div>
                    
                    {formData.coverImage ? (
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="relative group rounded-xl overflow-hidden border-2 border-purple-500/20 shadow-lg max-w-xs">
                          <img
                            src={formData.coverImage}
                            alt="Book cover"
                            className="w-full h-80 object-contain bg-muted transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1 bg-white/90 hover:bg-white"
                              onClick={() => setShowImagePicker(true)}
                            >
                              <PencilSimple size={14} className="mr-2" />
                              Change
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setFormData({ ...formData, coverImage: '' })}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                            <h4 className="font-medium text-sm mb-2">📌 Cover Image Tips</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• Use high-resolution images (at least 600x900px)</li>
                              <li>• Ensure text is readable on the cover</li>
                              <li>• Portrait orientation works best for book covers</li>
                              <li>• Keep important content away from edges</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 group"
                        onClick={() => setShowImagePicker(true)}
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <BookOpen size={40} className="text-purple-500" weight="duotone" />
                        </div>
                        <p className="font-medium text-foreground mb-1">Select Book Cover</p>
                        <p className="text-sm text-muted-foreground mb-4">Choose from your media library</p>
                        <Badge variant="outline" className="text-xs">
                          Click to browse images with 'books' category
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stunning Footer */}
          <div className="relative px-8 py-5 border-t bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {currentTab === 'basic' && '📚 Add the essential book information'}
                {currentTab === 'content' && '📖 List chapters and key topics'}
                {currentTab === 'media' && '🖼️ Select a beautiful cover image'}
              </div>
              <div className="flex gap-3 ml-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  disabled={isSaving}
                  className="px-6"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="min-w-[140px] bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner className="mr-2 animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FloppyDisk size={18} className="mr-2" />
                      Save Book
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Image Picker Modal */}
          {showImagePicker && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-5 border-b flex items-center justify-between bg-linear-to-r from-purple-500/5 to-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <ImageIcon size={20} className="text-purple-600" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Select Book Cover</h3>
                      <p className="text-xs text-muted-foreground">Choose from your media library</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowImagePicker(false)} className="rounded-full">
                    <X size={20} />
                  </Button>
                </div>
                <div className="p-5 overflow-y-auto">
                  {photos.filter(photo => photo.category === 'books').length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photos.filter(photo => photo.category === 'books').map((photo) => (
                        <div
                          key={photo.id}
                          className="cursor-pointer group relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-lg"
                          onClick={() => {
                            setFormData({ ...formData, coverImage: photo.url })
                            setShowImagePicker(false)
                            toast.success('Book cover selected')
                          }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-full text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              Select
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-xs font-medium truncate drop-shadow-lg">{photo.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon size={32} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-2">No book covers found</p>
                      <p className="text-sm text-muted-foreground">
                        Upload book cover images to the Media section with category 'books'
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
