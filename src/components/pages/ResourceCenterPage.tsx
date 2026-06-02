'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useResourceSections } from '../../hooks/useResourceSections'
import { usePageSections } from '../../hooks/usePageContent'
import { CircleNotch, Images, Link as LinkIcon, Newspaper, MagnifyingGlass, PaperclipHorizontal, X } from '@phosphor-icons/react'

const PAGE_SIZE = 12
const SLUG = 'pandit-resource-center'

export default function ResourceCenterPage() {
  const { sections, isLoading } = useResourceSections(false)
  const { sections: pageSections } = usePageSections(SLUG)
  const heroSection = pageSections.find(s => s.section_key === 'hero')
  const pageTitle = heroSection?.title ?? ''
  const pageDescription = heroSection?.subtitle ?? ''
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections.filter(s => {
      const plainDesc = s.description.replace(/<[^>]+>/g, ' ').toLowerCase()
      const fileLabels = (s.file_links ?? []).map(f => f.label).join(' ').toLowerCase()
      return (
        s.title.toLowerCase().includes(q) ||
        plainDesc.includes(q) ||
        fileLabels.includes(q)
      )
    })
  }, [sections, query])

  // Reset to page 1 whenever the search query changes
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
        {(pageTitle || pageDescription) && (
          <header className="text-center mb-10 md:mb-14">
            {pageTitle && (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {pageTitle}
              </h1>
            )}
            {pageDescription && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {pageDescription}
              </p>
            )}
          </header>
        )}

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto mb-10">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <input
            type="search"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search resources, topics, file names…"
            aria-label="Search resource center"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setPage(1) }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {filtered.length === 0 && !isLoading ? (
          <div className="text-center py-20 text-gray-500">
            <Newspaper size={56} className="mx-auto mb-4 text-orange-300" />
            {query
              ? <><p className="text-lg">No results for <strong>"{query}"</strong>.</p><button className="mt-3 text-sm text-orange-600 underline" onClick={() => { setQuery(''); setPage(1) }}>Clear search</button></>
              : <p className="text-lg">No sections available yet. Check back soon.</p>
            }
          </div>
        ) : (
          <>
            {query && (
              <p className="text-sm text-gray-500 mb-6 text-center">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for <strong>"{query}"</strong>
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((section) => (
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

                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                      {section.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
                    </p>

                    {/* Meta badges */}
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400 flex-wrap">
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
                      {(section.file_links ?? []).filter(f => f.url).length > 0 && (
                        <span className="flex items-center gap-1">
                          <PaperclipHorizontal size={13} /> {(section.file_links ?? []).filter(f => f.url).length} file{(section.file_links ?? []).filter(f => f.url).length > 1 ? 's' : ''}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-2 mt-12"
              >
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === safePage ? 'page' : undefined}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      n === safePage
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  )
}

