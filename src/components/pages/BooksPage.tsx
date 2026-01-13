import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BookOpen, BookBookmark, FlowerLotus, Atom, GraduationCap, Lightbulb, Sparkle, Heart, Calendar, Users, CircleNotch, AmazonLogo } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useBooksPageContent } from '../../hooks/useCmsContent'
import { usePublishedBooks } from '../../hooks/useBooks'
import type { BookRow } from '../../lib/supabase'

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<BookRow | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // CMS Content
  const { content: cmsContent } = useBooksPageContent()
  
  // Fetch published books from database
  const { data: books, isLoading } = usePublishedBooks()

  // SEO Configuration
  usePageSEO({
    title: 'Books by Rajesh Joshi Ji | Hindu Philosophy, Yoga, Meditation & Spirituality',
    description: 'Explore enlightening books by Rajesh Joshi Ji on Hinduism, Yoga, Meditation, Diwali, Navaratri, and spiritual practices. Learn about ancient wisdom, science-based spirituality, and practical guides for modern life.',
    keywords: 'Hindu books, Yoga guide, Meditation books, Hinduism and Science, Diwali book, Navaratri guide, Bhagavad Gita, Vedanta, spiritual books, Rajesh Joshi books',
    canonicalUrl: 'https://panditrajesh.com/books'
  })

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
            {['/images/books/hinduism-basics-for-all.jpeg', '/images/books/hinduism-and-science.jpeg', '/images/books/diwali.jpeg', '/images/books/navaratri.jpeg'].map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {['/images/books/hinduism-basics-for-all.jpeg', '/images/books/hinduism-and-science.jpeg', '/images/books/diwali.jpeg', '/images/books/navaratri.jpeg'].map((img, index) => (
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
              Wisdom & Knowledge
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              Books by <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Rajesh Joshi Ji</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              Explore enlightening works on Hinduism, Yoga, Meditation, and spirituality. Ancient wisdom presented with modern scientific understanding.
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">{books?.length || 0}</span> Books Published
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">15K+</span> Years of Wisdom
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">Multiple</span> Topics Covered
              </span>
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
                      className="relative h-80 overflow-hidden bg-linear-to-br from-muted/50 to-muted shrink-0 cursor-pointer"
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
              Interested in These Books?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              To learn more about these books or to inquire about availability, please feel free to contact us.
            </p>
            <Button size="lg" onClick={() => window.location.href = '/contact'} className="px-8 py-3 font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30">
              Contact Us for More Information
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
                <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
                  {/* Book Cover Image */}
                  <div className="w-full md:w-48 shrink-0">
                    {selectedBook.cover_image_url ? (
                      <img
                        src={selectedBook.cover_image_url}
                        alt={selectedBook.title}
                        className="w-full h-auto rounded-lg shadow-lg border border-border"
                      />
                    ) : (
                      <div className="w-full aspect-2/3 rounded-lg shadow-lg border border-border bg-muted flex items-center justify-center">
                        <BookOpen size={48} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {selectedBook.category}
                    </Badge>
                    <DialogTitle className="font-heading text-2xl md:text-3xl mb-2">
                      {selectedBook.title}
                    </DialogTitle>
                    {selectedBook.subtitle && (
                      <p className="text-muted-foreground text-sm">
                        {selectedBook.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Full Description */}
                {selectedBook.full_description && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                        <BookOpen className="text-primary" size={24} />
                        About This Book
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {selectedBook.full_description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Chapters */}
                {selectedBook.chapter_list && selectedBook.chapter_list.length > 0 && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-purple-50 to-violet-50">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                        <BookBookmark className="text-primary" size={24} weight="fill" />
                        Chapters
                      </h3>
                      <ul className="space-y-2">
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
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                        <Lightbulb className="text-primary" size={24} weight="fill" />
                        Key Topics Covered
                      </h3>
                      <ul className="space-y-2">
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
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                        <Users className="text-primary" size={24} weight="fill" />
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
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                        <img src="/images/amazon-a-logo.jpg" alt="Amazon" className="w-6 h-6 object-contain" />
                        Get This Book on Amazon
                      </h3>
                      <div className="flex flex-wrap gap-3">
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

              <div className="mt-6 pt-6 border-t border-border flex gap-3">
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
