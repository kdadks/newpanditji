'use client'

import Link from 'next/link'
import { useResourceSections } from '../../hooks/useResourceSections'
import { sanitizeHTML } from '../../utils/sanitize'
import { CircleNotch, Images, Link as LinkIcon, Newspaper } from '@phosphor-icons/react'

export default function ResourceCenterPage() {
  const { sections, isLoading } = useResourceSections(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <CircleNotch className="animate-spin text-orange-500 mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page header */}
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Pandit Resource Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Curated resources, guides, and learning materials for sacred rituals and Vedic practices.
          </p>
        </header>

        {sections.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Newspaper size={56} className="mx-auto mb-4 text-orange-300" />
            <p className="text-lg">No sections available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/pandit-resource-center/${section.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                {section.image_urls[0] ? (
                  <div className="relative h-48 bg-orange-50 overflow-hidden">
                    <img
                      src={section.image_urls[0]}
                      alt={section.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-linear-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                    <Newspaper size={48} className="text-orange-300" />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-heading font-semibold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {section.title}
                  </h2>

                  {/* Strip HTML for excerpt */}
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                    {section.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
                  </p>

                  {/* Meta badges */}
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                    {section.image_urls.filter(Boolean).length > 0 && (
                      <span className="flex items-center gap-1">
                        <Images size={13} /> {section.image_urls.filter(Boolean).length} image{section.image_urls.filter(Boolean).length > 1 ? 's' : ''}
                      </span>
                    )}
                    {section.video_links.filter(Boolean).length > 0 && (
                      <span className="flex items-center gap-1">
                        <LinkIcon size={13} /> {section.video_links.filter(Boolean).length} video{section.video_links.filter(Boolean).length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-sm font-medium text-orange-600 group-hover:underline">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

