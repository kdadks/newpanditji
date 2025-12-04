import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BookOpen, BookBookmark, FlowerLotus, Atom, GraduationCap, Lightbulb, Sparkle, Heart, Calendar, Users } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useBooksPageContent } from '../../hooks/useCmsContent'

interface Book {
  id: number
  title: string
  subtitle: string
  category: string
  description: string
  coverImage: string
  coverColor: string
  icon: any
  chapters?: string[]
  keyTopics: string[]
  targetAudience: string
  fullDescription: string
}

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // CMS Content
  const { content: cmsContent } = useBooksPageContent()

  // SEO Configuration
  usePageSEO({
    title: 'Books by Rajesh Joshi Ji | Hindu Philosophy, Yoga, Meditation & Spirituality',
    description: 'Explore enlightening books by Rajesh Joshi Ji on Hinduism, Yoga, Meditation, Diwali, Navaratri, and spiritual practices. Learn about ancient wisdom, science-based spirituality, and practical guides for modern life.',
    keywords: 'Hindu books, Yoga guide, Meditation books, Hinduism and Science, Diwali book, Navaratri guide, Bhagavad Gita, Vedanta, spiritual books, Rajesh Joshi books',
    canonicalUrl: 'https://panditrajesh.com/books'
  })

  const books: Book[] = [
    {
      id: 1,
      title: "Hinduism Basics for All",
      subtitle: "An Introduction to Hindu Scriptures, Basic Mantras, Hinduism History, Moral Stories, Frequently Asked Questions and their Scientific Answers",
      category: "Hinduism Fundamentals",
      description: "A comprehensive introduction to Hinduism covering scriptures, mantras, history, and FAQs with scientific explanations. Perfect for students and beginners.",
      coverImage: "/images/books/hinduism-basics-for-all.jpeg",
      coverColor: "from-orange-50 to-amber-50",
      icon: FlowerLotus,
      keyTopics: [
        "Hinduism and its History",
        "Core Scriptures of Hinduism",
        "Frequently Asked Questions and Answers about Hinduism",
        "Daily Mantras for Daily Chanting",
        "Commonly used Moral stories"
      ],
      targetAudience: "Students, beginners, and anyone wanting to learn about the basics of Hinduism",
      fullDescription: "Hinduism is the oldest living religion on this planet, with its roots going back 15,000 years and more. It has one billion followers, and every 7th person on this planet is a Hindu. Hinduism is not only a religion but also a 'Way of life.' While the rest of the world is trying to find happiness using materialistic means and looking outward, Hinduism from the east believes happiness is an inner experience and provides means to achieve with self-exploration or looking inward. Yoga and Meditation techniques are an example of this, helping millions of people overcome stress, anxiety, depression, and other mind-related diseases. This book is developed as a coursebook for students to learn about Hinduism and is currently used for teaching. It uses a presentation style color format to provide simple and to-the-point explanations."
    },
    {
      id: 2,
      title: "Hinduism and Science",
      subtitle: "An Introduction to Science of Hinduism, Bhagavad Gita, Hindu School of Philosophies, Yoga, Meditation, Vedanta, Mantras and their Scientific Answers and Morale Stories",
      category: "Science & Philosophy",
      description: "Explore the scientific foundations of Hinduism, covering Bhagavad Gita, philosophies, Yoga, Meditation, and Vedanta with logical explanations.",
      coverImage: "/images/books/hinduism-and-science.jpeg",
      coverColor: "from-blue-50 to-indigo-50",
      icon: Atom,
      keyTopics: [
        "Hinduism and Science",
        "Bhagavad Gita and School of Hindu Philosophies",
        "Yoga, Meditation and Vedanta",
        "Vedic Mantras",
        "Frequently Asked Questions and Answers about Hinduism",
        "Naitik Shiksha – Moral Stories"
      ],
      targetAudience: "Knowledge seekers interested in the scientific aspects of Hinduism and philosophy",
      fullDescription: "Science and logic are the foundations of Hinduism. As with science, Hinduism also encourages you to question everything. Hindu scriptures are usually based on questions asked to learned people. The sages of Hinduism have explored the possibilities of the human mind and examined all facets of life. The last 10,000 years have produced more than 10 million scriptures documenting these learnings. One of the highest virtues of Hinduism is knowing thyself. While the west is trying to find happiness using materialistic means and looking outward, Hinduism from the east believes happiness is an inner experience and provides means to achieve it with self-exploration or looking inward. Yoga and Meditation techniques are an example of this, helping millions of people overcome stress, anxiety, depression, and other mind-related problems."
    },
    {
      id: 3,
      title: "Diwali - The Oldest Festival on The Planet",
      subtitle: "Rama the Ideal Man - A Short Book for Speakers",
      category: "Festival & Culture",
      description: "A concise guide to understanding Diwali and Lord Rama's significance, perfect for public speakers and those wanting to learn about this ancient festival.",
      coverImage: "/images/books/diwali.jpeg",
      coverColor: "from-yellow-50 to-orange-50",
      icon: Sparkle,
      chapters: [
        "What is Diwali",
        "Ramayana",
        "Cultural Influence of Ramayana",
        "Ramayana Versions across the globe",
        "Why Lord Rama is Relevant Today"
      ],
      keyTopics: [
        "Significance of Diwali",
        "Lord Rama - The Ideal Man (Maryada Purushottama)",
        "Ramayana epic and its global influence",
        "Cultural impact across civilizations",
        "Relevance in modern times"
      ],
      targetAudience: "Public speakers, students, and anyone interested in understanding Diwali and Ramayana",
      fullDescription: "On the day of Diwali, one of the primary deities of Hinduism, Lord Rama, returned to his kingdom after defeating the evil king Ravana, who kidnapped his wife. Rama is the ideal man who walked on this planet, demonstrating the highest virtue of life as a human who always upheld righteousness or Dharma. Life tested him in nearly all extremely harsh circumstances, but he remained calm, kind, brave, and upholding human values. Lord Rama emerges as the embodiment of perfection in various roles—be it as an Ideal man, Ideal Son, Ideal husband, Ideal brother, Ideal friend, Ideal Enemy, Ideal Political Leader, Ideal Strategist, Ideal Architect, and Ideal King. This concise book is crafted to facilitate a 30-minute speech and provide essential insights into the subject matter."
    },
    {
      id: 4,
      title: "Navaratri: Science and The Bhakti of Shakti",
      subtitle: "Understanding the Scientific and Spiritual Significance of Navaratri",
      category: "Festival & Spirituality",
      description: "Discover the scientific reasoning behind Navaratri traditions and learn how to worship the Divine Mother, Goddess Shakti.",
      coverImage: "/images/books/navaratri.jpeg",
      coverColor: "from-pink-50 to-rose-50",
      icon: Heart,
      keyTopics: [
        "Scientific basis of Navaratri traditions",
        "Four Navaratris aligned with seasonal changes",
        "Detoxification and health benefits",
        "Story of Goddess Durga",
        "Shiva and Shakti philosophy",
        "Complete worship guide for Divine Mother",
        "Durga Saptashati significance"
      ],
      targetAudience: "Devotees and those interested in understanding the science behind Hindu festivals",
      fullDescription: "Hinduism is a science-based religion. All rituals and traditions of Ancient India have deep science behind them. The tradition of Navaratri also has a scientific and spiritual background. 'Nav' means 9, 'Ra' = that gives Solace, 'Tri' = 3 types of Solace. Navaratri or 9 nights when one seeks Solace from all sufferings and gets rejuvenated. Most people do not know that there are 4 Navaratris, which are aligned with four seasonal changes. Flu seasons naturally occur when the weather transitions. Navaratri, in essence, is preparing ourselves for the seasonal change to help our body to adopt the new season. Simple, less spicy and vegetarian food is eaten, more water and juices are consumed for detoxification, and high standards of hygiene are practiced. This book explores both the scientific and spiritual aspects of Navaratri."
    },
    {
      id: 5,
      title: "eYogi Yoga and Meditation Guide",
      subtitle: "A Beginner's Guide to Yoga and Meditation",
      category: "Yoga & Meditation",
      description: "A comprehensive beginner's guide to Yoga and Meditation, covering history, techniques, and various forms from ancient to modern times.",
      coverImage: "/images/books/eyogi-yoga-meditation.jpeg",
      coverColor: "from-green-50 to-emerald-50",
      icon: Users,
      keyTopics: [
        "What is Yoga",
        "Yoga in Hindu Scriptures (Vedas, Upanishads, Bhagavad Gita, Puran)",
        "Timeline history of Yogic Science (10,000 years)",
        "Patanjali Ashtanga Yoga",
        "Hatha Yoga techniques",
        "Classical Yoga (Karma, Bhakti, Jnana, Raja, Hatha, Laya, Japa, Kriya, Tantra)",
        "Modern Yoga (Vinyasa, Sivananda, Iyengar, Inner Engineering, etc.)",
        "How to Choose a Technique",
        "eYogi Meditation Technique"
      ],
      targetAudience: "Beginners seeking a comprehensive guide to Yoga and Meditation practices",
      fullDescription: "Yoga is a spiritual discipline based on a very subtle science. Yoga is believed to have originated with the dawn of civilisation. Shiva is seen as the first yogi, Adiyogi, and the first guru, Adi Guru, in yogic lore. Yoga is a holistic practice integrating physical movements, breathing exercises, and meditation to promote overall health, well-being and mind control. The author has attended and studied various Yoga and Meditation programs like Vipassana, Tibetan Buddhist meditation, Isha Kriya, Sudarshan Kriya, Raj Yoga of Brahmakumari, Patanjali Ashtanga Yoga and others. This guide helps beginners navigate the ocean of knowledge and various forms of Yoga and Gurus available today, providing basic information before they choose a Guru or form of Yoga."
    },
    {
      id: 6,
      title: "Leaving Cert Guide",
      subtitle: "625 Days of Sthitprajna to Achieve 625 Points - A Complete Guide to Leaving Cert Students and Parents",
      category: "Education",
      description: "A comprehensive guide for Leaving Certificate students and parents, covering exam preparation, medicine admissions, and the concept of Sthitprajna.",
      coverImage: "/images/books/leaving-cert-guide.jpeg",
      coverColor: "from-purple-50 to-violet-50",
      icon: GraduationCap,
      keyTopics: [
        "Leaving Certificate Examination – complete overview",
        "Admission to Medicine in Ireland, UK and Europe",
        "Sthitprajna – Complete guide for exam preparation",
        "Mental preparation and focus techniques",
        "Structured study approach",
        "College course guidance"
      ],
      targetAudience: "Leaving Certificate students and their parents seeking structured guidance for exam success",
      fullDescription: "The authors of this book have experienced many challenges while preparing their kids for the Leaving Certificate and admissions to medicine in Ireland, the UK and Europe. They realised that most parents and students go through a painful process due to a lack of information and awareness. Many students could qualify for better courses and college based on their intellectual abilities, but due to lack of guidance to prepare for leaving cert, they suffer in their academic career, significantly impacting their personal life. This book provides a structured guide to support students and parents in three key areas: Leaving Certificate Examination overview, Admission to Medicine, and Sthitprajna (a state of steady wisdom) – a complete guide for examination and entrance test preparation."
    }
  ]

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsDetailsOpen(true)
  }

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling book cover images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            <img src="/images/books/hinduism-basics-for-all.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/hinduism-and-science.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/diwali.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/navaratri.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/eyogi-yoga-meditation.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/leaving-cert-guide.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img src="/images/books/hinduism-basics-for-all.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/hinduism-and-science.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/diwali.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/navaratri.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/eyogi-yoga-meditation.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/books/leaving-cert-guide.jpeg" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
        </div>
        
        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>
        
        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>
        
        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
              <Sparkle size={16} weight="fill" />
              Wisdom & Knowledge
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Books by <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Rajesh Joshi Ji</span>
            </h1>

            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Explore enlightening works on Hinduism, Yoga, Meditation, and spirituality. Ancient wisdom presented with modern scientific understanding.
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">6</span> Books Published
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

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => {
              return (
                <Card
                  key={book.id}
                  className="hover:shadow-xl transition-all hover:border-primary/30 hover:-translate-y-2 cursor-pointer overflow-hidden group flex flex-col h-full"
                  onClick={() => handleBookClick(book)}
                >
                  {/* Book Cover Image */}
                  <div className="relative h-80 overflow-hidden bg-linear-to-br from-muted/50 to-muted shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs shadow-lg">
                        {book.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col grow">
                    <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 grow">
                      {book.subtitle}
                    </p>

                    <Button variant="ghost" size="sm" className="w-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto">
                      View Details →
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 rounded-lg bg-linear-to-br from-primary/5 to-accent/5 border border-primary/10">
            <BookOpen className="mx-auto mb-4 text-primary" size={48} weight="fill" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
              Interested in These Books?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              To learn more about these books or to inquire about availability, please feel free to contact us.
            </p>
            <Button size="lg" onClick={() => window.location.href = '/contact'}>
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
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="w-full h-auto rounded-lg shadow-lg border border-border"
                    />
                  </div>

                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {selectedBook.category}
                    </Badge>
                    <DialogTitle className="font-heading text-2xl md:text-3xl mb-2">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                      {selectedBook.subtitle}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Full Description */}
                <Card className="border-0 shadow-md bg-linear-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                      <BookOpen className="text-primary" size={24} />
                      About This Book
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {selectedBook.fullDescription}
                    </p>
                  </CardContent>
                </Card>

                {/* Chapters */}
                {selectedBook.chapters && selectedBook.chapters.length > 0 && (
                  <Card className="border-0 shadow-md bg-linear-to-br from-purple-50 to-violet-50">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                        <BookBookmark className="text-primary" size={24} weight="fill" />
                        Chapters
                      </h3>
                      <ul className="space-y-2">
                        {selectedBook.chapters.map((chapter, index) => (
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
                <Card className="border-0 shadow-md bg-linear-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                      <Lightbulb className="text-primary" size={24} weight="fill" />
                      Key Topics Covered
                    </h3>
                    <ul className="space-y-2">
                      {selectedBook.keyTopics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Sparkle className="text-primary mt-0.5 shrink-0" size={16} weight="fill" />
                          <span className="text-muted-foreground text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Target Audience */}
                <Card className="border-0 shadow-md bg-linear-to-br from-orange-50 to-amber-50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                      <Users className="text-primary" size={24} weight="fill" />
                      Who Should Read This Book
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedBook.targetAudience}
                    </p>
                  </CardContent>
                </Card>
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
