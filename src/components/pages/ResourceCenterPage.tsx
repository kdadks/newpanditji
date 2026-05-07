'use client'

/**
 * Public renderer for the Pandit Resource Center page.
 *
 * Reads the modular content composed by admins via {@link useResourceCenter}
 * and renders an SEO-friendly, accessible, responsive page. Each module
 * follows the layout rules from the spec:
 *  - Rich-text spans the full width.
 *  - Media gallery uses a 2-column grid on desktop (videos left, photos right)
 *    and stacks on mobile.
 *  - File attachments display as a vertical list with download buttons.
 *
 * Images and YouTube embeds are lazy-loaded for performance.
 */

import {
  useResourceCenter,
  ResourceModule,
  TextContent,
  MediaGalleryContent,
  FileAttachmentsContent,
  extractYouTubeId,
} from '../../hooks/useResourceCenter'
import { sanitizeHTML } from '../../utils/sanitize'
import { DownloadSimple, FilePdf, FileDoc, FileXls, FilePpt, FileZip, FileText } from '@phosphor-icons/react'

function fileIconFor(mime?: string) {
  if (!mime) return <FileText size={28} />
  if (mime.includes('pdf')) return <FilePdf size={28} className="text-red-600" />
  if (mime.includes('wordprocessingml')) return <FileDoc size={28} className="text-blue-600" />
  if (mime.includes('spreadsheetml')) return <FileXls size={28} className="text-green-600" />
  if (mime.includes('presentationml')) return <FilePpt size={28} className="text-orange-600" />
  if (mime.includes('zip')) return <FileZip size={28} className="text-purple-600" />
  return <FileText size={28} />
}

function formatBytes(bytes?: number) {
  if (typeof bytes !== 'number') return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ResourceCenterPage() {
  const { content, isLoading } = useResourceCenter()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    )
  }

  if (!content || !content.isPublished) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Available</h1>
          <p className="text-gray-600">This page is currently being prepared.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Page header */}
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {content.title}
          </h1>
          {content.metaDescription && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {content.metaDescription}
            </p>
          )}
        </header>

        {/* Modules */}
        <div className="space-y-10">
          {content.modules.length === 0 ? (
            <p className="text-center text-gray-500">No content yet. Check back soon.</p>
          ) : (
            content.modules.map((m) => <Module key={m.id} module={m} />)
          )}
        </div>
      </div>
    </main>
  )
}

function Module({ module: m }: { module: ResourceModule }) {
  return (
    <section
      aria-labelledby={`mod-${m.id}-title`}
      className="bg-white rounded-xl shadow-md p-6 md:p-10"
    >
      <header className="mb-6">
        <h2 id={`mod-${m.id}-title`} className="text-2xl md:text-3xl font-bold text-gray-900">
          {m.title}
        </h2>
        {m.subtitle && (
          <p className="mt-2 text-base md:text-lg text-gray-600">{m.subtitle}</p>
        )}
      </header>

      {m.type === 'text' && <TextBlock content={m.content as TextContent} />}
      {m.type === 'mediaGallery' && <MediaBlock content={m.content as MediaGalleryContent} />}
      {m.type === 'fileAttachments' && <FilesBlock content={m.content as FileAttachmentsContent} />}
    </section>
  )
}

function TextBlock({ content }: { content: TextContent }) {
  if (!content.html) return null
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700"
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(content.html) }}
    />
  )
}

function MediaBlock({ content }: { content: MediaGalleryContent }) {
  const hasVideos = content.videos.length > 0
  const hasPhotos = content.photos.length > 0
  if (!hasVideos && !hasPhotos) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {hasVideos && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Videos</h3>
          <ul className="space-y-5" role="list">
            {content.videos.map((v, i) => {
              const id = extractYouTubeId(v.url)
              if (!id) return null
              return (
                <li key={i}>
                  <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                  <h4 className="font-medium mt-2 text-gray-900">{v.title}</h4>
                  {v.caption && <p className="text-sm text-gray-600">{v.caption}</p>}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {hasPhotos && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
          <ul className="space-y-5" role="list">
            {content.photos.map((p, i) => (
              <li key={i}>
                <figure>
                  <img
                    src={p.src}
                    alt={p.alt || p.title}
                    loading="lazy"
                    className="w-full aspect-square object-cover rounded-lg shadow-sm"
                  />
                  <figcaption className="mt-2">
                    <span className="font-medium text-gray-900 block">{p.title}</span>
                    {p.caption && <span className="text-sm text-gray-600">{p.caption}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function FilesBlock({ content }: { content: FileAttachmentsContent }) {
  if (!content.files.length) return null

  return (
    <ul className="space-y-3" role="list">
      {content.files.map((f, i) => (
        <li
          key={i}
          className="flex flex-wrap items-center gap-4 border rounded-lg p-4 hover:border-orange-300 transition"
        >
          <div className="flex-shrink-0">{fileIconFor(f.mimeType)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{f.title}</h4>
            {f.description && (
              <p className="text-sm text-gray-600 mt-0.5">{f.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">{formatBytes(f.sizeBytes)}</p>
          </div>
          <a
            href={f.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition focus:outline-2 focus:outline-offset-2 focus:outline-orange-700"
            aria-label={`Download ${f.title}`}
          >
            <DownloadSimple size={18} />
            <span>Download</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
