'use client'

/**
 * ResourceCenterEditor
 * --------------------
 * Drag‑and‑drop CMS editor for the public Pandit Resource Center page.
 *
 * The page is composed of an ordered list of "modules". Each module can be one
 * of three types — text (rich‑text), mediaGallery (videos + photos) or
 * fileAttachments. Admins add modules via a "+" button, reorder via drag handle
 * (mouse) or the up/down keyboard buttons (a11y), and remove via the trash icon.
 *
 * Persistence is delegated to {@link useResourceCenter}; this component only
 * mutates local state and calls `save()` on demand.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Trash,
  DotsSixVertical,
  ArrowUp,
  ArrowDown,
  TextT,
  Images,
  PaperclipHorizontal,
  UploadSimple,
  Spinner,
  YoutubeLogo,
  FilePdf,
  FileDoc,
  FileXls,
  FilePpt,
  FileZip,
  FileText as FileTextIcon,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { QuillEditor } from '../../ui/quill-editor'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { toast } from 'sonner'
import {
  ResourceModule,
  ResourceCenterContent,
  ModuleType,
  VideoEntry,
  PhotoEntry,
  FileEntry,
  defaultContentForType,
  extractYouTubeId,
  youTubeThumbnail,
  TextContent,
  MediaGalleryContent,
  FileAttachmentsContent,
} from '../../../hooks/useResourceCenter'
import { uploadFile, BUCKETS } from '../../../lib/storage'

// ─── Constants & validators ─────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_FILE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_VIDEOS_PER_MODULE = 3
const MAX_PHOTOS_PER_MODULE = 3
const MAX_FILES_PER_MODULE = 10

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png']
const ALLOWED_DOC_MIME: Record<string, { label: string; ext: string }> = {
  'application/pdf': { label: 'PDF', ext: 'pdf' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPTX', ext: 'pptx' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', ext: 'docx' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLSX', ext: 'xlsx' },
  'application/zip': { label: 'ZIP', ext: 'zip' },
  'application/x-zip-compressed': { label: 'ZIP', ext: 'zip' },
}

async function sha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fileIconFor(mime?: string) {
  if (!mime) return <FileTextIcon size={20} />
  if (mime.includes('pdf')) return <FilePdf size={20} className="text-red-600" />
  if (mime.includes('wordprocessingml')) return <FileDoc size={20} className="text-blue-600" />
  if (mime.includes('spreadsheetml')) return <FileXls size={20} className="text-green-600" />
  if (mime.includes('presentationml')) return <FilePpt size={20} className="text-orange-600" />
  if (mime.includes('zip')) return <FileZip size={20} className="text-purple-600" />
  return <FileTextIcon size={20} />
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ResourceCenterEditorProps {
  content: ResourceCenterContent | null
  isLoading: boolean
  isSaving: boolean
  onSave: (next: ResourceCenterContent) => Promise<void> | void
  makeLocalId: () => string
}

export default function ResourceCenterEditor({
  content,
  isLoading,
  isSaving,
  onSave,
  makeLocalId,
}: ResourceCenterEditorProps) {
  const [local, setLocal] = useState<ResourceCenterContent | null>(content)
  const [statusMsg, setStatusMsg] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)

  useEffect(() => {
    setLocal(content)
  }, [content])

  if (isLoading || !local) {
    return <div className="p-8 text-center text-gray-500">Loading Resource Center…</div>
  }

  // ── Mutators ──────────────────────────────────────────────────────────────
  const updatePage = (patch: Partial<ResourceCenterContent>) =>
    setLocal(prev => (prev ? { ...prev, ...patch } : prev))

  const updateModule = (id: string, patch: Partial<ResourceModule>) =>
    setLocal(prev => {
      if (!prev) return prev
      return {
        ...prev,
        modules: prev.modules.map(m => (m.id === id ? { ...m, ...patch } : m)),
      }
    })

  const addModule = (type: ModuleType) => {
    setLocal(prev => {
      if (!prev) return prev
      const m: ResourceModule = {
        id: makeLocalId(),
        type,
        title: type === 'text'
          ? 'New Text Section'
          : type === 'mediaGallery'
            ? 'New Media Gallery'
            : 'New Attachments',
        subtitle: '',
        sortOrder: prev.modules.length,
        content: defaultContentForType(type),
      }
      setStatusMsg(`Added ${type} module`)
      return { ...prev, modules: [...prev.modules, m] }
    })
  }

  const removeModule = (id: string) => {
    if (!confirm('Delete this module? This cannot be undone after saving.')) return
    setLocal(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== id) } : prev)
    setStatusMsg('Module removed')
  }

  const moveModule = (id: string, dir: -1 | 1) => {
    setLocal(prev => {
      if (!prev) return prev
      const idx = prev.modules.findIndex(m => m.id === id)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.modules.length) return prev
      const next = [...prev.modules]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      setStatusMsg(`Module moved to position ${target + 1}`)
      return { ...prev, modules: next }
    })
  }

  const reorderTo = (sourceId: string, targetId: string) => {
    setLocal(prev => {
      if (!prev || sourceId === targetId) return prev
      const arr = [...prev.modules]
      const from = arr.findIndex(m => m.id === sourceId)
      const to = arr.findIndex(m => m.id === targetId)
      if (from < 0 || to < 0) return prev
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      setStatusMsg(`Reordered to position ${to + 1}`)
      return { ...prev, modules: arr }
    })
  }

  const handleSave = async () => {
    if (!local) return
    // Validate titles
    for (const m of local.modules) {
      if (!m.title || m.title.trim().length === 0) {
        toast.error('Every module must have a title')
        return
      }
      if (m.title.length > 100) {
        toast.error('Module title must be ≤ 100 characters')
        return
      }
    }
    await onSave(local)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Live region for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">{statusMsg}</div>

      {/* Top bar */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Pandit Resource Center</h3>
              <p className="text-sm text-gray-500">
                Public URL: <code className="bg-gray-100 px-2 py-0.5 rounded">/pandit-resource-center</code>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="rc-publish" className="text-sm">
                  {local.isPublished ? <Eye size={16} className="inline mr-1" /> : <EyeSlash size={16} className="inline mr-1" />}
                  Published
                </Label>
                <Switch
                  id="rc-publish"
                  checked={local.isPublished}
                  onCheckedChange={(c) => updatePage({ isPublished: c })}
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving} aria-label="Save Resource Center">
                {isSaving ? (<><Spinner className="animate-spin mr-2" size={16} /> Saving…</>) : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rc-title">Page Title</Label>
              <Input
                id="rc-title"
                value={local.title}
                maxLength={120}
                onChange={(e) => updatePage({ title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rc-meta-title">Meta Title (SEO)</Label>
              <Input
                id="rc-meta-title"
                value={local.metaTitle || ''}
                maxLength={160}
                onChange={(e) => updatePage({ metaTitle: e.target.value })}
                placeholder={local.title}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="rc-meta-desc">Meta Description (SEO)</Label>
              <Input
                id="rc-meta-desc"
                value={local.metaDescription || ''}
                maxLength={300}
                onChange={(e) => updatePage({ metaDescription: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Modules ({local.modules.length})</h3>
          <AddModuleButton onAdd={addModule} />
        </div>

        {local.modules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <p className="mb-4">No modules yet. Build your first one!</p>
              <AddModuleButton onAdd={addModule} />
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-4" role="list">
            {local.modules.map((m, idx) => (
              <li
                key={m.id}
                draggable
                onDragStart={(e) => {
                  setDragId(m.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragId) reorderTo(dragId, m.id)
                  setDragId(null)
                }}
                onDragEnd={() => setDragId(null)}
                className={dragId === m.id ? 'opacity-60' : ''}
              >
                <ModuleCard
                  module={m}
                  index={idx}
                  total={local.modules.length}
                  onChange={(patch) => updateModule(m.id, patch)}
                  onRemove={() => removeModule(m.id)}
                  onMoveUp={() => moveModule(m.id, -1)}
                  onMoveDown={() => moveModule(m.id, 1)}
                />
              </li>
            ))}
          </ul>
        )}

        {local.modules.length > 0 && (
          <div className="flex justify-end">
            <AddModuleButton onAdd={addModule} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function AddModuleButton({ onAdd }: { onAdd: (t: ModuleType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" aria-label="Add module">
          <Plus size={16} className="mr-2" /> Add Module
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAdd('text')}>
          <TextT size={16} className="mr-2" /> Rich‑text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('mediaGallery')}>
          <Images size={16} className="mr-2" /> Media Gallery
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('fileAttachments')}>
          <PaperclipHorizontal size={16} className="mr-2" /> File Attachments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ModuleCardProps {
  module: ResourceModule
  index: number
  total: number
  onChange: (patch: Partial<ResourceModule>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function ModuleCard({ module: m, index, total, onChange, onRemove, onMoveUp, onMoveDown }: ModuleCardProps) {
  const typeLabel = m.type === 'text' ? 'Rich‑text' : m.type === 'mediaGallery' ? 'Media Gallery' : 'File Attachments'

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardContent className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-700 focus:outline-2 focus:outline-primary rounded"
            aria-label={`Drag handle for module ${index + 1}. Use the up and down buttons to reorder.`}
            title="Drag to reorder"
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') { e.preventDefault(); onMoveUp() }
              if (e.key === 'ArrowDown') { e.preventDefault(); onMoveDown() }
            }}
          >
            <DotsSixVertical size={20} />
          </button>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{typeLabel}</Badge>
              <span className="text-xs text-gray-400">Position {index + 1} of {total}</span>
            </div>
            <div>
              <Label htmlFor={`title-${m.id}`} className="sr-only">Module Title</Label>
              <Input
                id={`title-${m.id}`}
                value={m.title}
                maxLength={100}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Module title (required, ≤ 100 chars)"
                aria-label="Module title"
                className="text-lg font-semibold"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{m.title.length}/100</div>
            </div>
            <div>
              <Label htmlFor={`subtitle-${m.id}`} className="sr-only">Module Subtitle</Label>
              <Input
                id={`subtitle-${m.id}`}
                value={m.subtitle || ''}
                maxLength={200}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder="Optional subtitle"
                aria-label="Module subtitle"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={index === 0}
              aria-label="Move module up"
            >
              <ArrowUp size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={index === total - 1}
              aria-label="Move module down"
            >
              <ArrowDown size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label="Delete module"
              className="text-red-600 hover:text-red-700"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        {/* Type-specific content editor */}
        <div className="pt-2 border-t">
          {m.type === 'text' && (
            <TextModuleEditor
              content={m.content as TextContent}
              onChange={(c) => onChange({ content: c })}
            />
          )}
          {m.type === 'mediaGallery' && (
            <MediaGalleryEditor
              moduleId={m.id}
              content={m.content as MediaGalleryContent}
              onChange={(c) => onChange({ content: c })}
            />
          )}
          {m.type === 'fileAttachments' && (
            <FileAttachmentsEditor
              moduleId={m.id}
              content={m.content as FileAttachmentsContent}
              onChange={(c) => onChange({ content: c })}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Text module ────────────────────────────────────────────────────────────

function TextModuleEditor({ content, onChange }: { content: TextContent; onChange: (c: TextContent) => void }) {
  return (
    <div>
      <Label className="mb-2 block">Rich Text Content</Label>
      <QuillEditor
        value={content.html || ''}
        onChange={(html) => onChange({ html })}
        placeholder="Write your content. Use the toolbar for headings, lists, tables, links and more…"
        minHeight="240px"
      />
    </div>
  )
}

// ─── Media gallery module ───────────────────────────────────────────────────

function MediaGalleryEditor({
  moduleId,
  content,
  onChange,
}: {
  moduleId: string
  content: MediaGalleryContent
  onChange: (c: MediaGalleryContent) => void
}) {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoCaption, setVideoCaption] = useState('')
  const [photoBusy, setPhotoBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addVideo = () => {
    if (content.videos.length >= MAX_VIDEOS_PER_MODULE) {
      toast.error(`Maximum ${MAX_VIDEOS_PER_MODULE} videos per module`)
      return
    }
    const id = extractYouTubeId(videoUrl.trim())
    if (!id) {
      toast.error('Please enter a valid YouTube URL')
      return
    }
    if (!videoTitle.trim()) {
      toast.error('Video title is required')
      return
    }
    if (videoTitle.length > 80) {
      toast.error('Video title must be ≤ 80 characters')
      return
    }
    if (videoCaption.length > 150) {
      toast.error('Caption must be ≤ 150 characters')
      return
    }
    if (content.videos.some(v => extractYouTubeId(v.url) === id)) {
      toast.warning('This video has already been added to this module')
      return
    }
    const entry: VideoEntry = {
      url: videoUrl.trim(),
      title: videoTitle.trim(),
      caption: videoCaption.trim() || undefined,
      thumbnail: youTubeThumbnail(videoUrl),
    }
    onChange({ ...content, videos: [...content.videos, entry] })
    setVideoUrl(''); setVideoTitle(''); setVideoCaption('')
  }

  const removeVideo = (i: number) =>
    onChange({ ...content, videos: content.videos.filter((_, idx) => idx !== i) })

  const updateVideo = (i: number, patch: Partial<VideoEntry>) =>
    onChange({
      ...content,
      videos: content.videos.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (content.photos.length + files.length > MAX_PHOTOS_PER_MODULE) {
      toast.error(`Maximum ${MAX_PHOTOS_PER_MODULE} photos per module`)
      e.target.value = ''
      return
    }

    setPhotoBusy(true)
    try {
      const newPhotos: PhotoEntry[] = []
      for (const f of Array.from(files)) {
        if (!ALLOWED_IMAGE_MIME.includes(f.type)) {
          toast.error(`${f.name}: only JPEG/PNG allowed`)
          continue
        }
        if (f.size > MAX_IMAGE_BYTES) {
          toast.error(`${f.name}: image must be ≤ 5 MB`)
          continue
        }
        const result = await uploadFile(BUCKETS.RESOURCES, f, `module_${moduleId}/photos`)
        newPhotos.push({
          src: result.url,
          title: f.name.replace(/\.[^.]+$/, '').slice(0, 80),
          alt: '',
          caption: '',
          sizeBytes: f.size,
        })
      }
      if (newPhotos.length > 0) {
        onChange({ ...content, photos: [...content.photos, ...newPhotos] })
        toast.success(`${newPhotos.length} photo(s) uploaded`)
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message || err}`)
    } finally {
      setPhotoBusy(false)
      e.target.value = ''
    }
  }

  const removePhoto = (i: number) =>
    onChange({ ...content, photos: content.photos.filter((_, idx) => idx !== i) })

  const updatePhoto = (i: number, patch: Partial<PhotoEntry>) =>
    onChange({
      ...content,
      photos: content.photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Videos column */}
      <section aria-labelledby={`videos-${moduleId}`}>
        <h4 id={`videos-${moduleId}`} className="font-semibold mb-3 flex items-center gap-2">
          <YoutubeLogo size={20} className="text-red-600" />
          Videos ({content.videos.length}/{MAX_VIDEOS_PER_MODULE})
        </h4>

        <div className="space-y-3">
          {content.videos.map((v, i) => (
            <div key={i} className="border rounded-md p-3 space-y-2 bg-muted/30">
              <div className="flex gap-3">
                {v.thumbnail && (
                  <img
                    src={v.thumbnail}
                    alt={`${v.title} thumbnail`}
                    className="w-24 h-16 object-cover rounded flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <Input
                    value={v.title}
                    maxLength={80}
                    onChange={(e) => updateVideo(i, { title: e.target.value })}
                    placeholder="Title (≤ 80 chars)"
                    aria-label="Video title"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={v.caption || ''}
                    maxLength={150}
                    onChange={(e) => updateVideo(i, { caption: e.target.value })}
                    placeholder="Optional caption (≤ 150 chars)"
                    aria-label="Video caption"
                    className="h-8 text-sm"
                  />
                  <div className="text-xs text-gray-500 truncate" title={v.url}>{v.url}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideo(i)}
                  aria-label={`Remove video ${v.title}`}
                  className="text-red-600 flex-shrink-0"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {content.videos.length < MAX_VIDEOS_PER_MODULE && (
          <div className="mt-3 border border-dashed rounded-md p-3 space-y-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL (https://youtube.com/watch?v=…)"
              aria-label="New video YouTube URL"
              className="h-8 text-sm"
            />
            <Input
              value={videoTitle}
              maxLength={80}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Title (required, ≤ 80 chars)"
              aria-label="New video title"
              className="h-8 text-sm"
            />
            <Input
              value={videoCaption}
              maxLength={150}
              onChange={(e) => setVideoCaption(e.target.value)}
              placeholder="Optional caption (≤ 150 chars)"
              aria-label="New video caption"
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={addVideo} className="w-full">
              <Plus size={14} className="mr-1" /> Add Video
            </Button>
          </div>
        )}
      </section>

      {/* Photos column */}
      <section aria-labelledby={`photos-${moduleId}`}>
        <h4 id={`photos-${moduleId}`} className="font-semibold mb-3 flex items-center gap-2">
          <Images size={20} className="text-emerald-600" />
          Photos ({content.photos.length}/{MAX_PHOTOS_PER_MODULE})
        </h4>

        <div className="space-y-3">
          {content.photos.map((p, i) => (
            <div key={i} className="border rounded-md p-3 space-y-2 bg-muted/30">
              <div className="flex gap-3">
                <img
                  src={p.src}
                  alt={p.alt || p.title}
                  className="w-24 h-24 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <Input
                    value={p.title}
                    maxLength={80}
                    onChange={(e) => updatePhoto(i, { title: e.target.value })}
                    placeholder="Title (≤ 80 chars)"
                    aria-label="Photo title"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={p.alt}
                    maxLength={125}
                    onChange={(e) => updatePhoto(i, { alt: e.target.value })}
                    placeholder="Alt text (required, ≤ 125 chars)"
                    aria-label="Photo alt text"
                    aria-required="true"
                    className={`h-8 text-sm ${!p.alt ? 'border-red-400' : ''}`}
                  />
                  <Input
                    value={p.caption || ''}
                    maxLength={150}
                    onChange={(e) => updatePhoto(i, { caption: e.target.value })}
                    placeholder="Optional caption (≤ 150 chars)"
                    aria-label="Photo caption"
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remove photo ${p.title}`}
                  className="text-red-600 flex-shrink-0"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {content.photos.length < MAX_PHOTOS_PER_MODULE && (
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              hidden
              onChange={handlePhotoUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoBusy}
              className="w-full border-dashed"
              aria-label="Upload photos"
            >
              {photoBusy
                ? (<><Spinner className="animate-spin mr-2" size={14} /> Uploading…</>)
                : (<><UploadSimple className="mr-2" size={14} /> Upload Photo (JPEG/PNG, ≤ 5 MB)</>)
              }
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── File attachments module ────────────────────────────────────────────────

function FileAttachmentsEditor({
  moduleId,
  content,
  onChange,
}: {
  moduleId: string
  content: FileAttachmentsContent
  onChange: (c: FileAttachmentsContent) => void
}) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (content.files.length + files.length > MAX_FILES_PER_MODULE) {
      toast.error(`Maximum ${MAX_FILES_PER_MODULE} files per module`)
      e.target.value = ''
      return
    }

    setBusy(true)
    try {
      const additions: FileEntry[] = []
      const existingHashes = new Set(content.files.map(f => f.hash).filter(Boolean) as string[])

      for (const f of Array.from(files)) {
        if (!ALLOWED_DOC_MIME[f.type]) {
          toast.error(`${f.name}: format not allowed (PDF, PPTX, DOCX, XLSX or ZIP only)`)
          continue
        }
        if (f.size > MAX_FILE_BYTES) {
          toast.error(`${f.name}: must be ≤ 20 MB`)
          continue
        }
        const hash = await sha256Hex(f)
        if (existingHashes.has(hash)) {
          toast.warning(`${f.name}: duplicate file skipped`)
          continue
        }
        existingHashes.add(hash)

        const result = await uploadFile(BUCKETS.RESOURCES, f, `module_${moduleId}/files`)
        additions.push({
          url: result.url,
          title: f.name.replace(/\.[^.]+$/, '').slice(0, 100),
          description: '',
          mimeType: f.type,
          sizeBytes: f.size,
          hash,
        })
      }

      if (additions.length > 0) {
        onChange({ files: [...content.files, ...additions] })
        toast.success(`${additions.length} file(s) uploaded`)
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message || err}`)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const removeFile = (i: number) =>
    onChange({ files: content.files.filter((_, idx) => idx !== i) })

  const updateFile = (i: number, patch: Partial<FileEntry>) =>
    onChange({
      files: content.files.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    })

  return (
    <section aria-labelledby={`files-${moduleId}`}>
      <h4 id={`files-${moduleId}`} className="font-semibold mb-3 flex items-center gap-2">
        <PaperclipHorizontal size={20} />
        Attachments ({content.files.length}/{MAX_FILES_PER_MODULE})
      </h4>

      <ul className="space-y-3" role="list">
        {content.files.map((f, i) => (
          <li key={i} className="border rounded-md p-3 bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">{fileIconFor(f.mimeType)}</div>
              <div className="flex-1 space-y-2 min-w-0">
                <Input
                  value={f.title}
                  maxLength={100}
                  onChange={(e) => updateFile(i, { title: e.target.value })}
                  placeholder="Title (required, ≤ 100 chars)"
                  aria-label="File title"
                  className="h-8 text-sm font-medium"
                />
                <Input
                  value={f.description || ''}
                  maxLength={200}
                  onChange={(e) => updateFile(i, { description: e.target.value })}
                  placeholder="Optional description (≤ 200 chars)"
                  aria-label="File description"
                  className="h-8 text-sm"
                />
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {f.mimeType && <Badge variant="outline">{ALLOWED_DOC_MIME[f.mimeType]?.label || 'FILE'}</Badge>}
                  {typeof f.sizeBytes === 'number' && <span>{(f.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>}
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline truncate">
                    Preview
                  </a>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(i)}
                aria-label={`Remove file ${f.title}`}
                className="text-red-600 flex-shrink-0"
              >
                <Trash size={16} />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {content.files.length < MAX_FILES_PER_MODULE && (
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.pptx,.docx,.xlsx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
            multiple
            hidden
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="w-full border-dashed"
            aria-label="Upload files"
          >
            {busy
              ? (<><Spinner className="animate-spin mr-2" size={14} /> Uploading…</>)
              : (<><UploadSimple className="mr-2" size={14} /> Add Files (PDF, PPTX, DOCX, XLSX, ZIP — ≤ 20 MB each)</>)
            }
          </Button>
        </div>
      )}
    </section>
  )
}
