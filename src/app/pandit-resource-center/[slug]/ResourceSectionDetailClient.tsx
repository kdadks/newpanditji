'use client'

import Link from 'next/link'
import { useResourceSectionBySlug } from '../../../hooks/useResourceSections'
import { sanitizeHTML } from '../../../utils/sanitize'
import {
  ArrowLeft, CircleNotch, Images, Link as LinkIcon, Newspaper,
  FilePdf, FileDoc, FileXls, FilePpt, PaperclipHorizontal, DownloadSimple,
  Sparkle, Phone,
} from '@phosphor-icons/react'
import { Badge } from '../../../components/ui/badge'
import type { ResourceFileLink } from '../../../hooks/useResourceSections'

interface Props {
  slug: string
}

function FileIcon({ type }: { type: ResourceFileLink['type'] }) {
  if (type === 'pdf')   return <FilePdf   size={22} className="text-red-500" />
  if (type === 'ppt')   return <FilePpt   size={22} className="text-orange-500" />
  if (type === 'word')  return <FileDoc   size={22} className="text-blue-600" />
  if (type === 'excel') return <FileXls   size={22} className="text-green-600" />
  return <PaperclipHorizontal size={22} className="text-gray-500" />
}

export default function ResourceSectionDetailClient({ slug }: Props) {
  const { data: section, isLoading } = useResourceSectionBySlug(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleNotch className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (!section) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Newspaper className="text-muted-foreground mb-4" size={64} />
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

  return (
    <div className="w-full">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        {/* Animated scrolling temple background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/South Asian Temple Complex.png" alt="" aria-hidden="true" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Golden Temples of Devotion.png" alt="" aria-hidden="true" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" aria-hidden="true" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" aria-hidden="true" className="h-full w-auto object-contain opacity-40 shrink-0" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays"
          style={{ background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251,191,36,0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251,191,36,0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251,191,36,0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251,191,36,0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251,191,36,0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251,191,36,0.3) 160deg, transparent 170deg, transparent 180deg)' }} />

        {/* Mobile layout */}
        {images[0] ? (
          <div className="md:hidden relative z-10 h-[55vw] min-h-[220px] max-h-[360px]">
            <img src={images[0]} alt={section.title} className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute top-3 left-4 z-10">
              <Badge asChild className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm cursor-pointer">
                <Link href="/pandit-resource-center"><ArrowLeft size={12} /> Back to Resource Center</Link>
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {section.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="md:hidden relative z-10 px-4 pt-10 pb-8">
            <div className="mb-4">
              <Badge asChild className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm cursor-pointer">
                <Link href="/pandit-resource-center"><ArrowLeft size={12} /> Back to Resource Center</Link>
              </Badge>
            </div>
            <h1 className="font-heading font-bold text-3xl leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {section.title}
            </h1>
          </div>
        )}

        {/* Mobile meta strip — below hero, matching blog style */}
        {(files.length > 0 || videos.length > 0 || images.length > 1) && (
          <div className="md:hidden relative z-10 flex flex-wrap justify-center items-center gap-3 px-4 py-3 text-xs text-amber-950 bg-amber-50/60 border-b border-amber-200/60">
            {files.length > 0 && <div className="flex items-center gap-1"><PaperclipHorizontal size={12} /><span>{files.length} download{files.length > 1 ? 's' : ''}</span></div>}
            {videos.length > 0 && <div className="flex items-center gap-1"><LinkIcon size={12} /><span>{videos.length} video{videos.length > 1 ? 's' : ''}</span></div>}
            {images.length > 1 && <div className="flex items-center gap-1"><Images size={12} /><span>{images.length} images</span></div>}
          </div>
        )}

        {/* Desktop layout */}
        <div className="hidden md:block relative z-10">
          <div className="container mx-auto max-w-7xl px-8 py-12 lg:py-16">
            <div className="mb-8">
              <Badge asChild className="bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white border-orange-600/30 backdrop-blur-sm cursor-pointer">
                <Link href="/pandit-resource-center"><ArrowLeft size={12} /> Back to Resource Center</Link>
              </Badge>
            </div>
            {images[0] ? (
              <div className="flex items-center gap-12 lg:gap-16">
                <div className="flex-1 min-w-0">
                  <h1 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {section.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {files.length > 0 && <div className="flex items-center gap-2"><PaperclipHorizontal size={14} /><span>{files.length} download{files.length > 1 ? 's' : ''}</span></div>}
                    {videos.length > 0 && <div className="flex items-center gap-2"><LinkIcon size={14} /><span>{videos.length} video{videos.length > 1 ? 's' : ''}</span></div>}
                    {images.length > 1 && <div className="flex items-center gap-2"><Images size={14} /><span>{images.length} images</span></div>}
                  </div>
                </div>
                <div className="w-1/2 lg:w-[520px] xl:w-xl shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  <img src={images[0]} alt={section.title} className="w-full aspect-3/2 object-cover object-center" />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-5xl mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                  {section.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {files.length > 0 && <div className="flex items-center gap-2"><PaperclipHorizontal size={14} /><span>{files.length} download{files.length > 1 ? 's' : ''}</span></div>}
                  {videos.length > 0 && <div className="flex items-center gap-2"><LinkIcon size={14} /><span>{videos.length} video{videos.length > 1 ? 's' : ''}</span></div>}
                  {images.length > 1 && <div className="flex items-center gap-2"><Images size={14} /><span>{images.length} images</span></div>}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* ── Main column ── */}
            <div className="lg:col-span-8">

              {/* Subtitle / summary */}
              {section.meta_description && (
                <div className="mb-10">
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 italic">
                    {section.meta_description}
                  </p>
                </div>
              )}

              {/* Description */}
              <article
                className="prose prose-lg md:prose-xl max-w-none
                  prose-headings:font-heading prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4
                  prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:text-muted-foreground prose-li:text-base prose-li:md:text-lg prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-8
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-muted prose-pre:rounded-xl prose-pre:p-6
                  prose-hr:my-12 prose-hr:border-border"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.description) }}
              />

              {/* Additional gallery images */}
              {images.length > 1 && (
                <div className="mt-12" id="gallery">
                  <h2 className="font-heading text-2xl font-semibold mb-5 flex items-center gap-2">
                    <Images size={22} className="text-primary" />
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
                </div>
              )}

              {/* Video links */}
              {videos.length > 0 && (
                <div className="mt-12" id="videos">
                  <h2 className="font-heading text-2xl font-semibold mb-5 flex items-center gap-2">
                    <LinkIcon size={22} className="text-primary" />
                    Video Resources
                  </h2>
                  <ul className="space-y-3">
                    {videos.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <LinkIcon size={18} weight="bold" />
                          </div>
                          <span className="text-sm text-muted-foreground truncate group-hover:text-primary transition-colors flex-1">
                            {link}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground/60 shrink-0">Opens in new tab ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Downloads */}
              {files.length > 0 && (
                <div className="mt-12" id="downloads">
                  <h2 className="font-heading text-2xl font-semibold mb-5 flex items-center gap-2">
                    <DownloadSimple size={22} className="text-primary" />
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
                          className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 shrink-0 group-hover:bg-primary/10 transition-colors">
                            <FileIcon type={file.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {file.label}
                            </p>
                            {file.sizeBytes && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {(file.sizeBytes / 1024 / 1024).toFixed(1)} MB · {file.type.toUpperCase()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-primary group-hover:text-primary/80">
                            <DownloadSimple size={16} />
                            Download
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Link
                  href="/pandit-resource-center"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Resource Center
                </Link>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Sparkle size={16} className="text-primary" />
                  <span className="italic">May this wisdom guide your spiritual journey</span>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">

                {/* Quick-jump on-this-page */}
                {(images.length > 1 || videos.length > 0 || files.length > 0) && (
                  <div className="bg-card rounded-xl p-6 shadow-lg border">
                    <h3 className="font-heading font-semibold text-base mb-4">On This Page</h3>
                    <ul className="space-y-2 text-sm">
                      {images.length > 1 && (
                        <li>
                          <a href="#gallery" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Images size={14} className="text-primary shrink-0" /> Gallery
                          </a>
                        </li>
                      )}
                      {videos.length > 0 && (
                        <li>
                          <a href="#videos" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <LinkIcon size={14} className="text-primary shrink-0" /> Video Resources
                          </a>
                        </li>
                      )}
                      {files.length > 0 && (
                        <li>
                          <a href="#downloads" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <DownloadSimple size={14} className="text-primary shrink-0" /> Downloads
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Downloads summary */}
                {files.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-lg border">
                    <h3 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                      <DownloadSimple size={16} className="text-primary" /> Downloads
                    </h3>
                    <ul className="space-y-3">
                      {files.map((file, i) => (
                        <li key={i}>
                          <a
                            href={file.url}
                            download={file.fileName ?? file.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                          >
                            <FileIcon type={file.type} />
                            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors truncate flex-1">
                              {file.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Need guidance card */}
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="font-heading font-semibold text-base mb-2">Need Personalised Guidance?</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Speak with Pandit Rajesh Joshi for expert advice on rituals, ceremonies, and Vedic practices tailored to your needs.
                  </p>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone size={14} />
                    Get in Touch
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
