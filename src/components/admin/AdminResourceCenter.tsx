'use client'

import { useState, useEffect, useRef } from 'react'
import {
  useResourceSections,
  generateUniqueSlug,
  validateSlug,
  type ResourceSection,
  type ResourceSectionInsert,
  type ResourceFileLink,
} from '../../hooks/useResourceSections'
import { generateSlug } from '../../lib/supabase'
import { usePhotos, usePhotoCategories } from '../../hooks/usePhotos'
import { sanitizeHTML } from '../../utils/sanitize'
import { uploadFile, deleteFileByUrl, BUCKETS } from '../../lib/storage'
import {
  Plus, PencilSimple, Trash, X, Spinner, Newspaper, Tag, FileText,
  Image as ImageIcon, Eye, CheckCircle, WarningCircle, Link, ArrowLeft,
  FilePdf, FileDoc, FileXls, FilePpt, PaperclipHorizontal, UploadSimple,
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { QuillEditor } from '../ui/quill-editor'
import { toast } from 'sonner'
import DeleteConfirmDialog from './DeleteConfirmDialog'

// ─── Form state ────────────────────────────────────────────────────────────

interface FormData {
  title: string
  slug: string
  description: string
  image_urls: [string, string, string]
  video_links: [string, string, string]
  file_links: ResourceFileLink[]
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
}

const EMPTY_FORM: FormData = {
  title: '',
  slug: '',
  description: '',
  image_urls: ['', '', ''],
  video_links: ['', '', ''],
  file_links: [],
  status: 'draft',
  meta_title: '',
  meta_description: '',
}

const MAX_FILES = 3

const FILE_TYPE_MAP: Record<string, ResourceFileLink['type']> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'application/msword': 'word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
  'application/vnd.ms-excel': 'excel',
}

const ALLOWED_FILE_TYPES = Object.keys(FILE_TYPE_MAP)

function guessTypeFromUrl(url: string): ResourceFileLink['type'] {
  const lower = url.toLowerCase()
  if (lower.includes('.pdf')) return 'pdf'
  if (lower.includes('.ppt') || lower.includes('.pptx')) return 'ppt'
  if (lower.includes('.doc') || lower.includes('.docx')) return 'word'
  if (lower.includes('.xls') || lower.includes('.xlsx')) return 'excel'
  return 'other'
}

function FileTypeIcon({ type, size = 18 }: { type: ResourceFileLink['type']; size?: number }) {
  if (type === 'pdf')   return <FilePdf   size={size} className="text-red-500" />
  if (type === 'ppt')   return <FilePpt   size={size} className="text-orange-500" />
  if (type === 'word')  return <FileDoc   size={size} className="text-blue-600" />
  if (type === 'excel') return <FileXls   size={size} className="text-green-600" />
  return <PaperclipHorizontal size={size} className="text-muted-foreground" />
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function isValidUrl(url: string): boolean {
  if (!url.trim()) return true
  try { new URL(url); return true } catch { return false }
}

// ─── Image Picker sub-component ────────────────────────────────────────────

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label: string
}

function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [pickerCategory, setPickerCategory] = useState('all')
  const { categories } = usePhotoCategories()
  const { photos, isLoading } = usePhotos({
    category: pickerCategory === 'all' ? undefined : pickerCategory,
    limit: 500,
  })
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2 items-start">
        {value ? (
          <div className="relative group w-24 h-24 rounded-lg overflow-hidden border bg-muted shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed bg-muted/40 flex items-center justify-center shrink-0">
            <ImageIcon size={24} className="text-muted-foreground" />
          </div>
        )}
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs">
          {value ? 'Change' : 'Pick from Gallery'}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[80vw]! max-w-[80vw]! max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b">
            <DialogTitle>Select Image from Gallery</DialogTitle>
            <DialogDescription className="sr-only">Choose an image from your media library</DialogDescription>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setPickerCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${pickerCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setPickerCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${pickerCategory === cat.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner className="animate-spin text-primary" size={32} />
              </div>
            ) : photos.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No images found.</p>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => { onChange(photo.url); setOpen(false) }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${value === photo.url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function AdminResourceCenter() {
  const {
    sections, isLoading,
    createSection, updateSection, deleteSection,
    isCreating, isUpdating, isDeleting,
  } = useResourceSections(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState<'basic' | 'images' | 'videos' | 'files' | 'content' | 'seo'>('basic')
  const [editingSection, setEditingSection] = useState<ResourceSection | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const [isValidatingSlug, setIsValidatingSlug] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<ResourceSection | null>(null)
  const [previewSection, setPreviewSection] = useState<ResourceSection | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [uploadingFileIdx, setUploadingFileIdx] = useState<number | null>(null)
  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-generate slug from title unless admin manually edited it
  useEffect(() => {
    if (!slugEdited && formData.title) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }))
    }
  }, [formData.title, slugEdited])

  // Debounced slug validation
  useEffect(() => {
    if (!formData.slug) { setSlugError(null); return }
    if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current)
    setIsValidatingSlug(true)
    slugDebounceRef.current = setTimeout(async () => {
      const err = await validateSlug(formData.slug, editingSection?.id)
      setSlugError(err)
      setIsValidatingSlug(false)
    }, 400)
    return () => { if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current) }
  }, [formData.slug, editingSection?.id])

  const openAdd = () => {
    setFormData(EMPTY_FORM)
    setEditingSection(null)
    setCurrentTab('basic')
    setSlugEdited(false)
    setSlugError(null)
    setIsDialogOpen(true)
  }

  const openEdit = (section: ResourceSection) => {
    const imgs = [...section.image_urls] as string[]
    while (imgs.length < 3) imgs.push('')
    const vids = [...section.video_links] as string[]
    while (vids.length < 3) vids.push('')
    setFormData({
      title: section.title,
      slug: section.slug,
      description: section.description,
      image_urls: imgs as [string, string, string],
      video_links: vids as [string, string, string],
      file_links: section.file_links ?? [],
      status: section.status,
      meta_title: section.meta_title ?? '',
      meta_description: section.meta_description ?? '',
    })
    setEditingSection(section)
    setCurrentTab('basic')
    setSlugEdited(true)
    setSlugError(null)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) { toast.error('Title is required'); setCurrentTab('basic'); return }
    if (!formData.slug.trim()) { toast.error('Slug is required'); setCurrentTab('basic'); return }
    if (!formData.description.trim() || formData.description === '<p><br></p>') {
      toast.error('Description is required'); setCurrentTab('content'); return
    }
    const videoErrors = formData.video_links.filter(v => v && !isValidUrl(v))
    if (videoErrors.length > 0) { toast.error('One or more video links are invalid URLs'); setCurrentTab('videos'); return }

    const slugErr = await validateSlug(formData.slug.trim(), editingSection?.id)
    if (slugErr) { setSlugError(slugErr); setCurrentTab('basic'); return }

    const payload: ResourceSectionInsert = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description,
      image_urls: formData.image_urls.filter(u => u.trim()),
      video_links: formData.video_links.filter(u => u.trim()),
      file_links: formData.file_links.filter(f => f.url.trim() && f.label.trim()),
      status: formData.status,
      sort_order: editingSection?.sort_order ?? sections.length,
      meta_title: formData.meta_title.trim() || null,
      meta_description: formData.meta_description.trim() || null,
    }

    try {
      if (editingSection) {
        await updateSection({ id: editingSection.id, ...payload })
      } else {
        await createSection(payload)
      }
      setIsDialogOpen(false)
      setEditingSection(null)
    } catch {
      // toast handled by hook
    }
  }

  const openDelete = (section: ResourceSection) => {
    setSectionToDelete(section)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!sectionToDelete) return
    try {
      await deleteSection(sectionToDelete.id)
      setDeleteDialogOpen(false)
      setSectionToDelete(null)
    } catch {
      // toast handled by hook
    }
  }

  const isSaving = isCreating || isUpdating

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading resource sections…</span>
      </div>
    )
  }

  const TABS = ['basic', 'images', 'videos', 'files', 'content', 'seo'] as const
  type TabId = typeof TABS[number]

  const handleFileUpload = async (idx: number, file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Unsupported file type. Allowed: PDF, PPT, Word, Excel.')
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      toast.error('File too large (max 30 MB).')
      return
    }
    setUploadingFileIdx(idx)
    try {
      // If replacing an existing uploaded file, delete the old one first
      const existing = formData.file_links[idx]
      if (existing?.url) {
        await deleteFileByUrl(existing.url, BUCKETS.DOCUMENTS).catch(() => {})
      }
      const { url } = await uploadFile(BUCKETS.DOCUMENTS, file, 'resource-center')
      const type = FILE_TYPE_MAP[file.type] ?? 'other'
      const next = [...formData.file_links]
      next[idx] = { url, label: file.name.replace(/\.[^.]+$/, ''), type, fileName: file.name, sizeBytes: file.size }
      setFormData(prev => ({ ...prev, file_links: next }))
      toast.success('File uploaded successfully')
    } catch (err: unknown) {
      toast.error((err instanceof Error ? err.message : null) ?? 'Upload failed')
    } finally {
      setUploadingFileIdx(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resource Center Sections</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage resource sections (Kundali, Vedi Making, etc.)
            </p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus size={18} />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Newspaper size={48} className="mx-auto mb-4" />
              <p>No sections yet. Click "Add Section" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => (
                <Card key={section.id} className="border-l-4 border-l-primary/30 hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4">
                    {section.image_urls[0] && (
                      <div className="mb-3 rounded-lg overflow-hidden h-40 bg-muted">
                        <img src={section.image_urls[0]} alt={section.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-lg line-clamp-2 mb-2">{section.title}</h3>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {section.status === 'published' ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                              <CheckCircle size={12} weight="fill" /> Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <WarningCircle size={12} weight="fill" /> Draft
                            </Badge>
                          )}
                          {section.image_urls.filter(Boolean).length > 0 && (
                            <Badge variant="outline" className="gap-1">
                              <ImageIcon size={12} /> {section.image_urls.filter(Boolean).length} img
                            </Badge>
                          )}
                          {section.video_links.filter(Boolean).length > 0 && (
                            <Badge variant="outline" className="gap-1">
                              <Link size={12} /> {section.video_links.filter(Boolean).length} video
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">/{section.slug}</p>
                      </div>
                      <div className="flex flex-row gap-1.5 lg:flex-col">
                        <Button variant="outline" size="sm" onClick={() => { setPreviewSection(section); setIsPreviewOpen(true) }} title="Preview" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                          <Eye size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(section)} title="Edit" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
                          <PencilSimple size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDelete(section)} disabled={isDeleting} title="Delete" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
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

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[70vw]! max-w-[70vw]! max-h-[90vh] overflow-hidden p-0 flex flex-col">
          <div className="relative overflow-hidden shrink-0 bg-linear-to-r from-primary via-primary/90 to-accent px-6 py-6">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur ring-2 ring-white/30">
                <Newspaper className="h-7 w-7 text-white" weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingSection ? 'Edit Section' : 'Create New Section'}
                </DialogTitle>
                <DialogDescription className="text-white/90 text-sm mt-0.5">
                  {editingSection ? 'Update section content and details' : 'Add a new resource center section'}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {([
                { id: 'basic' as TabId,   label: 'Details',   Icon: Tag },
                { id: 'images' as TabId,  label: 'Images',    Icon: ImageIcon },
                { id: 'videos' as TabId,  label: 'Videos',    Icon: Link },
                { id: 'files' as TabId,   label: 'Files',     Icon: PaperclipHorizontal },
                { id: 'content' as TabId, label: 'Content',   Icon: FileText },
                { id: 'seo' as TabId,     label: 'SEO',       Icon: Eye },
              ]).map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => setCurrentTab(id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentTab === id ? 'bg-white text-primary shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <Icon className="h-3.5 w-3.5" weight="bold" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {currentTab === 'basic' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rc-title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
                      <Input id="rc-title" value={formData.title}
                        onChange={(e) => { setFormData(prev => ({ ...prev, title: e.target.value })); setSlugEdited(false) }}
                        placeholder="e.g. Kundali Reading" className="h-11" disabled={isSaving} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rc-slug" className="text-sm font-medium">URL Slug <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground shrink-0 hidden sm:inline">/pandit-resource-center/</span>
                        <div className="flex-1 relative">
                          <Input id="rc-slug" value={formData.slug}
                            onChange={(e) => {
                              const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-')
                              setFormData(prev => ({ ...prev, slug: val }))
                              setSlugEdited(true)
                            }}
                            placeholder="kundali-reading"
                            className={`h-11 font-mono text-sm pr-8 ${slugError ? 'border-red-500' : ''}`}
                            disabled={isSaving}
                          />
                          {isValidatingSlug && <Spinner className="absolute right-2 top-3 animate-spin text-muted-foreground" size={16} />}
                        </div>
                        <Button type="button" variant="outline" size="sm" disabled={isSaving || !formData.title}
                          onClick={async () => {
                            const unique = await generateUniqueSlug(formData.title, editingSection?.id)
                            setFormData(prev => ({ ...prev, slug: unique }))
                            setSlugEdited(true)
                          }} title="Auto-generate unique slug">Auto</Button>
                      </div>
                      {slugError && <p className="text-xs text-red-500">{slugError}</p>}
                      {!slugError && formData.slug && !isValidatingSlug && <p className="text-xs text-green-600">Slug is available ✓</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex gap-3">
                        {(['draft', 'published'] as const).map(s => (
                          <button key={s} type="button" onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formData.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}>
                            {s === 'draft' ? '📝 Draft' : '✅ Published'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent></Card>
                </div>
              )}

              {currentTab === 'images' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5 space-y-6">
                    <p className="text-sm text-muted-foreground">Select up to 3 images from your media gallery. The first image is used as the thumbnail.</p>
                    {([0, 1, 2] as const).map((i) => (
                      <ImagePicker key={i}
                        label={`Image ${i + 1}${i === 0 ? ' (thumbnail)' : ''}`}
                        value={formData.image_urls[i]}
                        onChange={(url) => {
                          const next = [...formData.image_urls] as [string, string, string]
                          next[i] = url
                          setFormData(prev => ({ ...prev, image_urls: next }))
                        }}
                      />
                    ))}
                  </CardContent></Card>
                </div>
              )}

              {currentTab === 'videos' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5 space-y-4">
                    <p className="text-sm text-muted-foreground">Add up to 3 external video links (YouTube, Vimeo, etc.). Each link opens in a new tab.</p>
                    {([0, 1, 2] as const).map((i) => (
                      <div key={i} className="space-y-1">
                        <Label className="text-sm font-medium">Video Link {i + 1}</Label>
                        <Input value={formData.video_links[i]}
                          onChange={(e) => {
                            const next = [...formData.video_links] as [string, string, string]
                            next[i] = e.target.value
                            setFormData(prev => ({ ...prev, video_links: next }))
                          }}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`h-11 ${formData.video_links[i] && !isValidUrl(formData.video_links[i]) ? 'border-red-500' : ''}`}
                          disabled={isSaving}
                        />
                        {formData.video_links[i] && !isValidUrl(formData.video_links[i]) && (
                          <p className="text-xs text-red-500">Invalid URL</p>
                        )}
                      </div>
                    ))}
                  </CardContent></Card>
                </div>
              )}

              {currentTab === 'files' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Attach up to {MAX_FILES} files (PDF, PPT, Word, Excel). Upload from your device or paste a URL.
                    </p>
                    {formData.file_links.length >= MAX_FILES && (
                      <p className="text-xs text-amber-600 font-medium">Maximum of {MAX_FILES} files reached.</p>
                    )}

                    {Array.from({ length: MAX_FILES }).map((_, i) => {
                      const entry = formData.file_links[i]
                      const isUploading = uploadingFileIdx === i
                      return (
                        <div key={i} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">File {i + 1}</span>
                            {entry && (
                              <button type="button" onClick={async () => {
                                const next = [...formData.file_links]
                                next.splice(i, 1)
                                setFormData(prev => ({ ...prev, file_links: next }))
                                // Delete from Supabase Storage if it was uploaded there
                                await deleteFileByUrl(entry.url, BUCKETS.DOCUMENTS).catch(() => {})
                              }} className="text-red-500 hover:text-red-700" aria-label="Remove file">
                                <X size={15} />
                              </button>
                            )}
                          </div>

                          {entry ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileTypeIcon type={entry.type} size={20} />
                                <span className="text-xs text-muted-foreground truncate flex-1" title={entry.fileName ?? entry.url}>
                                  {entry.fileName ?? entry.url}
                                </span>
                                {typeof entry.sizeBytes === 'number' && (
                                  <Badge variant="outline" className="text-xs shrink-0">{(entry.sizeBytes / 1024 / 1024).toFixed(1)} MB</Badge>
                                )}
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Display label</Label>
                                <Input
                                  value={entry.label}
                                  maxLength={80}
                                  onChange={(e) => {
                                    const next = [...formData.file_links]
                                    next[i] = { ...entry, label: e.target.value }
                                    setFormData(prev => ({ ...prev, file_links: next }))
                                  }}
                                  placeholder="e.g. Kundali Reading Guide"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">File type</Label>
                                <div className="flex gap-2 flex-wrap">
                                  {(['pdf', 'ppt', 'word', 'excel', 'other'] as ResourceFileLink['type'][]).map(t => (
                                    <button key={t} type="button"
                                      onClick={() => {
                                        const next = [...formData.file_links]
                                        next[i] = { ...entry, type: t }
                                        setFormData(prev => ({ ...prev, file_links: next }))
                                      }}
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                                        entry.type === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'
                                      }`}
                                    >
                                      <FileTypeIcon type={t} size={13} />
                                      {t.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Upload from device */}
                              <div>
                                <label className="w-full cursor-pointer">
                                  <div className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 text-sm transition-colors ${
                                    isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-accent/30'
                                  }`}>
                                    {isUploading
                                      ? <><Spinner size={16} className="animate-spin" /> Uploading…</>
                                      : <><UploadSimple size={16} /> Upload file (PDF, PPT, Word, Excel)</>}
                                  </div>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                                    disabled={isUploading}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handleFileUpload(i, file)
                                      e.target.value = ''
                                    }}
                                  />
                                </label>
                              </div>
                              {/* Or paste URL */}
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Or paste a URL</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="https://…/document.pdf"
                                    className="h-8 text-sm"
                                    onBlur={(e) => {
                                      const url = e.target.value.trim()
                                      if (!url) return
                                      if (!isValidUrl(url)) { toast.error('Invalid URL'); return }
                                      const next = [...formData.file_links]
                                      next[i] = { url, label: url.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'File', type: guessTypeFromUrl(url) }
                                      setFormData(prev => ({ ...prev, file_links: next }))
                                      e.target.value = ''
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent></Card>
                </div>
              )}

              {currentTab === 'content' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description <span className="text-red-500">*</span></Label>
                      <QuillEditor value={formData.description}
                        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                        placeholder="Describe this section in detail…"
                        minHeight="300px"
                      />
                    </div>
                  </CardContent></Card>
                </div>
              )}

              {currentTab === 'seo' && (
                <div className="space-y-5">
                  <Card><CardContent className="pt-5 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Meta Title</Label>
                      <Input value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder={formData.title || 'Page title for search engines'} disabled={isSaving} />
                      <p className="text-xs text-muted-foreground">Defaults to the section title if blank.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Meta Description</Label>
                      <Input value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Brief description for search engines (150–160 chars)" disabled={isSaving} />
                      <p className={`text-xs ${formData.meta_description.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {formData.meta_description.length}/160 characters
                      </p>
                    </div>
                  </CardContent></Card>
                </div>
              )}
            </div>

            <div className="border-t px-6 py-4 flex items-center justify-between bg-background">
              <div className="flex gap-2">
                {currentTab !== 'basic' && (
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => {
                      const i = TABS.indexOf(currentTab)
                      if (i > 0) setCurrentTab(TABS[i - 1])
                    }}>
                    <ArrowLeft size={14} className="mr-1" /> Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button type="button" onClick={handleSave} disabled={isSaving || !!slugError || isValidatingSlug} className="gap-2 min-w-[130px]">
                  {isSaving ? <Spinner className="animate-spin" size={16} /> : null}
                  {isSaving ? 'Saving…' : editingSection ? 'Save Changes' : 'Create Section'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-[70vw]! max-w-[70vw]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {previewSection?.title}</DialogTitle>
            <DialogDescription>
              <a href={`/pandit-resource-center/${previewSection?.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">
                Open live page →
              </a>
            </DialogDescription>
          </DialogHeader>
          {previewSection && (
            <div className="space-y-6 mt-2">
              <h2 className="font-heading text-2xl font-bold">{previewSection.title}</h2>
              {previewSection.image_urls.filter(Boolean).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {previewSection.image_urls.filter(Boolean).map((url, i) => (
                    <div key={i} className="rounded-lg overflow-hidden aspect-video bg-muted">
                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(previewSection.description) }} />
              {previewSection.video_links.filter(Boolean).length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Video Resources</h3>
                  {previewSection.video_links.filter(Boolean).map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block text-primary underline text-sm truncate">{link}</a>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Section"
        description={`Are you sure you want to delete "${sectionToDelete?.title}"? This cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  )
}

