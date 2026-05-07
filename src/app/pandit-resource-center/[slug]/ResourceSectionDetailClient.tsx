'use client'

import Link from 'next/link'
import { useResourceSectionBySlug } from '../../../hooks/useResourceSections'
import { sanitizeHTML } from '../../../utils/sanitize'
import { ArrowLeft, CircleNotch, Images, Link as LinkIcon, Newspaper, FilePdf, FileDoc, FileXls, FilePpt, PaperclipHorizontal, DownloadSimple } from '@phosphor-icons/react'
import type { ResourceFileLink } from '../../../hooks/useResourceSections'

interface Props {
  slug: string
}

export default function ResourceSectionDetailClient({ slug }: Props) {
  const { data: section, isLoading } = useResourceSectionBySlug(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-white">
        <CircleNotch className="animate-spin text-orange-500" size={48} />
      </div>
    )
  }

  if (!section) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-linear-to-b from-orange-50 to-white">
        <Newspaper className="text-orange-300 mb-4" size={64} />
        <h1 className="font-heading text-2xl font-bold mb-2">Section Not Found</h1>
        <p className="text-muted-foreground mb-6">This resource section doesn't exist or is not yet published.</p>
        <Link
          href="/pandit-resource-center"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Resource Center
        </Link>
      </div>
    )
  }

  const images = section.image_urls.filter(Boolean)
  const videos = section.video_links.filter(Boolean)
  const files = (section.file_links ?? []).filter(f => f.url && f.label)

  function FileIcon({ type }: { type: ResourceFileLink['type'] }) {
    if (type === 'pdf')   return <FilePdf   size={22} className="text-red-500" />
    if (type === 'ppt')   return <FilePpt   size={22} className="text-orange-500" />
    if (type === 'word')  return <FileDoc   size={22} className="text-blue-600" />
    if (type === 'excel') return <FileXls   size={22} className="text-green-600" />
    return <PaperclipHorizontal size={22} className="text-gray-500" />
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back link */}
        <Link
          href="/pandit-resource-center"
          className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Resource Center
        </Link>

        {/* Hero image */}
        {images[0] && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video bg-muted">
            <img
              src={images[0]}
              alt={section.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {section.title}
        </h1>

        {/* Description (rich text) */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700 mb-10"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.description) }}
        />

        {/* Additional images */}
        {images.length > 1 && (
          <section className="mb-10" aria-label="Gallery">
            <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Images size={22} className="text-orange-500" />
              Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.slice(1).map((url, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-muted shadow-md">
                  <img
                    src={url}
                    alt={`${section.title} — image ${i + 2}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Video links */}
        {videos.length > 0 && (
          <section className="mb-10" aria-label="Video Resources">
            <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <LinkIcon size={22} className="text-orange-500" />
              Video Resources
            </h2>
            <ul className="space-y-3">
              {videos.map((link, i) => (
                <li key={i}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <LinkIcon size={18} weight="bold" />
                    </div>
                    <span className="text-sm text-gray-700 truncate group-hover:text-orange-600 transition-colors">
                      {link}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 shrink-0">Opens in new tab ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Downloadable files */}
        {files.length > 0 && (
          <section className="mb-10" aria-label="Downloads">
            <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DownloadSimple size={22} className="text-orange-500" />
              Downloads
            </h2>
            <ul className="space-y-3">
              {files.map((file, i) => (
                <li key={i}>
                  <a
                    href={file.url}
                    download={file.fileName ?? file.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 shrink-0 group-hover:bg-orange-100 transition-colors">
                      <FileIcon type={file.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                        {file.label}
                      </p>
                      {file.sizeBytes && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(file.sizeBytes / 1024 / 1024).toFixed(1)} MB · {file.type.toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-orange-600 group-hover:text-orange-700">
                      <DownloadSimple size={16} />
                      Download
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
