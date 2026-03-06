import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { BookOpen, BookBookmark, FlowerLotus, Atom, GraduationCap, Lightbulb, Sparkle, Heart, Calendar, Users, CircleNotch, AmazonLogo } from '@phosphor-icons/react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useBooksPageContent } from '../../hooks/useCmsContent'
import { usePublishedBooks } from '../../hooks/useBooks'
import { renderHighlightedTitle } from '../../utils/renderHighlight'
import { sanitizeHTML } from '../../utils/sanitize'
import type { BookRow } from '../../lib/supabase'

// Renders book description - handles both HTML (from rich text editor) and plain text
function renderBookDescription(text: string): React.ReactNode {
  if (!text) return null
  // If it looks like HTML (contains tags), sanitize and render as HTML
  if (/<[a-z][\s\S]*?>/i.test(text)) {
    return (
      <div
        className="prose text-muted-foreground leading-relaxed text-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }}
      />
    )
  }
  // Plain text: parse into paragraphs, numbered lists, and bullet lists
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }
    // Numbered list block
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ''))
        i++
      }
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="list-decimal pl-5 mb-2 space-y-0.5 text-sm text-muted-foreground">
          {items.map((it, idx) => <li key={idx}>{it}</li>)}
        </ol>
      )
      continue
    }
    // Bullet list block (• or o prefix)
    if (/^[•o]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[•o]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[•o]\s*/, ''))
        i++
      }
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="list-disc pl-5 mb-2 space-y-0.5 text-sm text-muted-foreground">
          {items.map((it, idx) => <li key={idx}>{it}</li>)}
        </ul>
      )
      continue
    }
    // Regular paragraph
    nodes.push(<p key={`p-${nodes.length}`} className="mb-2 text-sm text-muted-foreground leading-relaxed">{line}</p>)
    i++
  }
  return <>{nodes}</>
}

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<BookRow | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // CMS Content
  const { content: cmsContent, isLoading: cmsLoading } = useBooksPageContent()
  
  // Fetch published books from database
  const { data: books, isLoading } = usePublishedBooks()

  // SEO Configuration
  usePageMetadata('books')

  // Show loading state while fetching content
  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Icon mapping - matches database category to icon
  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, any> = {
      'Hinduism Fundamentals': FlowerLotus,
      'Science & Philosophy': Atom,
      'Festival & Culture': Sparkle,
      'Festival & Spirituality': Heart,
      'Yoga & Meditation': Users,
      'Education': GraduationCap,
    }
    return categoryMap[category] || BookOpen
  }

  // Color mapping - matches database category to gradient
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Hinduism Fundamentals': 'from-orange-50 to-amber-50',
      'Science & Philosophy': 'from-blue-50 to-indigo-50',
      'Festival & Culture': 'from-yellow-50 to-orange-50',
      'Festival & Spirituality': 'from-pink-50 to-rose-50',
      'Yoga & Meditation': 'from-green-50 to-emerald-50',
      'Education': 'from-purple-50 to-violet-50',
    }
    return colorMap[category] || 'from-gray-50 to-slate-50'
  }

  const handleBookClick = (book: BookRow) => {
    setSelectedBook(book)
    setIsDetailsOpen(true)
  }

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling book cover images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent?.hero?.backgroundImages?.map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {cmsContent?.hero?.backgroundImages?.map((img, index) => (
              <img key={`bg-2-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>

        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>

        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <BookOpen size={18} weight="fill" className="animate-pulse" />
              {cmsContent?.hero?.subtitle}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {renderHighlightedTitle(cmsContent?.hero?.title)}
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {cmsContent?.hero?.description}
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {cmsContent?.stats?.map((stat, idx) => (
                <span key={idx} className="text-base md:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[110px] text-center" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  <span className="font-extrabold text-transparent bg-linear-to-br from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">{stat.value}</span>{' '}
                  <span className="font-semibold text-white/95">{stat.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid Section */}
      <div className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <CircleNotch className="animate-spin text-primary" size={48} />
            </div>
          )}

          {/* Books Grid */}
          {!isLoading && books && books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => {
                const Icon = getCategoryIcon(book.category)
                const purchaseUrls = (book.other_purchase_urls as Record<string, string>) || {}
                
                return (
                  <Card
                    key={book.id}
                    className="hover:shadow-xl transition-all border-2 border-transparent overflow-hidden group flex flex-col h-full relative"
                  >
                    {/* Book Cover Image */}
                    <div 
                      className="relative h-52 sm:h-64 md:h-80 overflow-hidden bg-linear-to-br from-muted/50 to-muted shrink-0 cursor-pointer"
                      onClick={() => handleBookClick(book)}
                    >
                      {book.cover_image_url ? (
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon size={64} className="text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs shadow-lg">
                          {book.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 flex flex-col grow">
                      {/* Amazon Purchase Icons */}
                      {(purchaseUrls.amazonIndia || purchaseUrls.amazonEU || purchaseUrls.amazonUK) && (
                        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border/50 mb-1\">
                          {purchaseUrls.amazonIndia && (
                            <a
                              href={purchaseUrls.amazonIndia}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all border-2 border-transparent hover:border-amber-400 group/link text-xs"
                              title="Buy on Amazon India"
                            >
                              <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-3.5 h-3.5 object-contain" />
                              <span className="font-medium">India</span>
                            </a>
                          )}
                          {purchaseUrls.amazonEU && (
                            <a
                              href={purchaseUrls.amazonEU}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all border-2 border-transparent hover:border-blue-400 group/link text-xs"
                              title="Buy on Amazon EU"
                            >
                              <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-3.5 h-3.5 object-contain" />
                              <span className="font-medium">EU</span>
                            </a>
                          )}
                          {purchaseUrls.amazonUK && (
                            <a
                              href={purchaseUrls.amazonUK}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all border-2 border-transparent hover:border-red-400 group/link text-xs"
                              title="Buy on Amazon UK"
                            >
                              <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-3.5 h-3.5 object-contain" />
                              <span className="font-medium">UK</span>
                            </a>
                          )}
                        </div>
                      )}

                      <h3 
                        className="font-heading font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                        onClick={() => handleBookClick(book)}
                      >
                        {book.title}
                      </h3>

                      {book.subtitle && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 grow">
                          {book.subtitle}
                        </p>
                      )}

                      <div className="flex-1" />

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs h-8"
                        onClick={() => handleBookClick(book)}
                      >
                        View Details →
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!books || books.length === 0) && (
            <div className="text-center py-12">
              <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No books available at the moment.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 rounded-lg bg-linear-to-br from-primary/5 to-accent/5 border border-primary/10">
            <BookOpen className="mx-auto mb-4 text-primary" size={48} weight="fill" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
              {cmsContent?.cta?.title}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {cmsContent?.cta?.description}
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = cmsContent?.cta?.buttonLink} 
              className="px-8 py-3 font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30"
            >
              {cmsContent?.cta?.buttonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <Badge variant="secondary" className="text-xs mb-1 w-fit">
                  {selectedBook.category}
                </Badge>
                <DialogTitle className="font-heading text-xl md:text-2xl mb-1">
                  {selectedBook.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  {selectedBook.subtitle || 'Detailed information about this book'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                {/* Full Description with floated cover image */}
                <Card className="border-0 shadow-md bg-linear-to-br from-blue-50 to-indigo-50">
                  <CardContent className="px-4 pb-4" style={{ paddingTop: '5px' }}>
                    {selectedBook.cover_image_url && (
                      <img
                        src={selectedBook.cover_image_url}
                        alt={selectedBook.title}
                        className="w-full max-w-[280px] mx-auto md:float-left md:mr-4 md:mb-2 md:mx-0 rounded-lg shadow-lg border border-border h-auto md:max-w-[45%]"
                      />
                    )}
                    {selectedBook.full_description && (
                      <>
                        <h3 className="font-heading font-bold text-base mb-2 text-foreground flex items-center gap-2">
                          <BookOpen className="text-primary" size={18} />
                          About This Book
                        </h3>
                        {renderBookDescription(selectedBook.full_description)}
                      </>
                    )}
                    <div className="clear-both" />
                  </CardContent>
                </Card>

                {/* Chapters */}
                {selectedBook.chapter_list && selectedBook.chapter_list.length > 0 && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-purple-50 to-violet-50">
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold text-base mb-2 text-foreground flex items-center gap-2">
                        <BookBookmark className="text-primary" size={18} weight="fill" />
                        Chapters
                      </h3>
                      <ul className="space-y-1">
                        {selectedBook.chapter_list.map((chapter, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary font-semibold min-w-[2rem]">{index + 1}.</span>
                            <span className="text-muted-foreground text-sm">{chapter}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Key Topics */}
                {selectedBook.key_topics && selectedBook.key_topics.length > 0 && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold text-base mb-2 text-foreground flex items-center gap-2">
                        <Lightbulb className="text-primary" size={18} weight="fill" />
                        Key Topics Covered
                      </h3>
                      <ul className="space-y-1">
                        {selectedBook.key_topics.map((topic, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Sparkle className="text-primary mt-0.5 shrink-0" size={16} weight="fill" />
                            <span className="text-muted-foreground text-sm">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Target Audience */}
                {selectedBook.target_audience && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-orange-50 to-amber-50">
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold text-base mb-2 text-foreground flex items-center gap-2">
                        <Users className="text-primary" size={18} weight="fill" />
                        Who Should Read This Book
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {selectedBook.target_audience}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Purchase Links */}
                {selectedBook.other_purchase_urls && (() => {
                  const purchaseUrls = selectedBook.other_purchase_urls as Record<string, string>
                  return (purchaseUrls.amazonIndia || purchaseUrls.amazonEU || purchaseUrls.amazonUK)
                })() && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-amber-50 to-yellow-50">
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold text-base mb-2 text-foreground flex items-center gap-2">
                        <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-5 h-5 object-contain" />
                        Get This Book on Amazon
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const purchaseUrls = selectedBook.other_purchase_urls as Record<string, string>
                          return (
                            <>
                              {purchaseUrls.amazonIndia && (
                                <a 
                                  href={purchaseUrls.amazonIndia} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded transition-all border-2 border-transparent hover:border-amber-400"
                                  title="Buy on Amazon India"
                                >
                                  <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-6 h-6 object-contain" />
                                  <span className="text-sm font-medium">Amazon India</span>
                                </a>
                              )}
                              {purchaseUrls.amazonEU && (
                                <a 
                                  href={purchaseUrls.amazonEU} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded transition-all border-2 border-transparent hover:border-blue-400"
                                  title="Buy on Amazon EU"
                                >
                                  <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-6 h-6 object-contain" />
                                  <span className="text-sm font-medium">Amazon EU</span>
                                </a>
                              )}
                              {purchaseUrls.amazonUK && (
                                <a 
                                  href={purchaseUrls.amazonUK} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded transition-all border-2 border-transparent hover:border-red-400"
                                  title="Buy on Amazon UK"
                                >
                                  <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-6 h-6 object-contain" />
                                  <span className="text-sm font-medium">Amazon UK</span>
                                </a>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex gap-3">
                <Button className="flex-1" onClick={() => {
                  setIsDetailsOpen(false)
                  window.location.href = '/contact'
                }}>
                  Inquire About This Book
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
