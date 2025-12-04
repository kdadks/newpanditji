import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FlowerLotus, Book, GraduationCap, Heart, Users, Trophy, Sparkle, Pencil, Briefcase, HandHeart, Lightbulb, MedalMilitary, BookOpen, Atom, ArrowRight, ChatCircleDots } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useAboutContent } from '../../hooks/useCmsContent'
import { Page } from '../../App'

interface AboutPageProps {
  onNavigate?: (page: Page) => void
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  // CMS Content
  const { content: cmsContent } = useAboutContent()

  // SEO Configuration
  usePageSEO({
    title: 'About Rajesh Joshi "eYogi Raj" | Industrialist, Scholar, Pandit & Author',
    description: 'Rajesh Joshi "eYogi Raj" - Indian-Irish Industrialist, Hindu scholar, author of multiple books, founder of eYogi Gurukul, and spiritual guide. ME in Electronics Engineering from DCU. 200+ poojas performed, 100+ poems composed.',
    keywords: 'Rajesh Joshi, eYogi Raj, Hindu priest Ireland, eYogi Gurukul, Hindu scholar, Sanatana Dharma, meditation teacher, Irish industrialist, Vedic poojas, motivational speaker',
    canonicalUrl: 'https://panditrajesh.com/about'
  })

  return (
    <div className="w-full">
      {/* Hero Section with Rolling Background */}
      <section className="relative pt-8 md:pt-12 pb-6 md:pb-8 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-cover opacity-40" />
            ))}
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-2-${index}`} src={img} alt="" className="h-full w-auto object-cover opacity-40" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left side - Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110"></div>
                <img
                  src={cmsContent.profileImage}
                  alt="Pandit Rajesh Joshi"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                  loading="eager"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-2 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
                <FlowerLotus size={16} weight="fill" />
                {cmsContent.badge}
              </div>

              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {cmsContent.hero.title} <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{cmsContent.name}</span> {cmsContent.title}
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium mb-4 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {cmsContent.shortBio}
              </p>

              {/* Statistics - Compact inline version */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-6">
                {cmsContent.statistics.map((stat, index) => (
                  <span key={index}>
                    {index > 0 && <span className="text-white/50 mr-6">•</span>}
                    <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      <span className="font-bold text-amber-400">{stat.value}</span> {stat.label}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => onNavigate?.('books')} className="text-sm md:text-base px-6 md:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  <BookOpen className="mr-2" size={18} weight="fill" />
                  Published Books
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate?.('charity')} className="text-sm md:text-base px-6 md:px-8 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto">
                  <HandHeart className="mr-2" size={18} weight="fill" />
                  Charity Work
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate?.('testimonials')} className="text-sm md:text-base px-6 md:px-8 py-3 border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 w-full sm:w-auto">
                  <ChatCircleDots className="mr-2" size={18} weight="fill" />
                  Testimonials
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pt-12 md:pt-16 pb-8 md:pb-12 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">

        {/* Main Content Grid - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Spiritual Journey (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-lg bg-linear-to-br from-card to-card/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FlowerLotus className="text-primary" size={24} weight="fill" />
                  </div>
                  <h2 className="font-heading font-semibold text-2xl">The Spiritual Journey</h2>
                </div>

                <div className="space-y-5 text-muted-foreground">
                  <p className="text-base leading-relaxed">
                    Over a decade ago, Rajesh Ji's life took a transformative turn when he experienced stress-induced
                    high blood pressure. Understanding that the root cause was stress and anxiety, he embraced the path
                    of spirituality and Sanatana Dharma. Beginning with meditation, he experienced immediate benefits
                    that revealed the profound science behind the Indian Knowledge System.
                  </p>

                  <p className="text-base leading-relaxed">
                    This awakening led him to explore the vast ocean of 10 million scriptures within the Indian Knowledge
                    System. He participated in numerous meditation programs including:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                    <Badge variant="outline" className="justify-start py-2">Art of Living Sudarshan Kriya</Badge>
                    <Badge variant="outline" className="justify-start py-2">Isha Kriya</Badge>
                    <Badge variant="outline" className="justify-start py-2">Dalai Lama Meditation Programs</Badge>
                    <Badge variant="outline" className="justify-start py-2">Dzogchen Longchen Nyingtik</Badge>
                    <Badge variant="outline" className="justify-start py-2">S.N. Goenka Dhamma Deepa (10 Days)</Badge>
                    <Badge variant="outline" className="justify-start py-2">Ramakrishna Mission Retreats</Badge>
                  </div>

                  <p className="text-base leading-relaxed">
                    Realizing that ancient wisdom of the Indian subcontinent holds solutions for two-thirds of human
                    mind's problems, he immersed himself in Hindu scriptures: Vedas, Upanishads, Ramayana, Mahabharata,
                    Puranas, Yogic literature, Agama Tantras, and modern interpretations of ancient knowledge. This deep
                    study led him to create his own meditation methodology, the <span className="font-semibold text-foreground">"eYogi Yoga
                    and Meditation Guide"</span> for beginners.
                  </p>

                  <p className="text-base leading-relaxed">
                    Rajesh Ji has conducted <span className="font-semibold text-foreground">200+ poojas since 2001</span> alongside his industrial
                    career, performing all ceremonies without any monetary gain. His commitment to Karma Kanda (Daily
                    Rituals) and the power of Bhakti has made him a beacon of authentic Vedic traditions.
                  </p>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mt-6">
                    <div className="flex items-start gap-4">
                      <Book className="text-primary shrink-0 mt-1" size={24} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Literary Contributions</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Rajesh Ji has written multiple books on Indian culture and Sanatana Dharma, connecting ancient
                          wisdom to modern science. His books are published with hundreds of physical copies in circulation
                          across Ireland and India, including <span className="font-semibold text-foreground">Hinduism Basics for All</span>,
                          <span className="font-semibold text-foreground"> Hinduism and Science</span>,
                          <span className="font-semibold text-foreground"> eYogi Yoga & Meditation Guide</span>,
                          <span className="font-semibold text-foreground"> Navaratri: The Bhakti of Shakti</span>,
                          <span className="font-semibold text-foreground"> Diwali: The Oldest Festival</span>, and
                          <span className="font-semibold text-foreground"> Leaving Cert Guide</span> (co-authored).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-5 mt-4">
                    <div className="flex items-start gap-4">
                      <Pencil className="text-primary shrink-0 mt-1" size={24} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Poetry & Public Speaking</h4>
                        <p className="text-sm text-muted-foreground">
                          Composed <span className="font-semibold text-foreground">100+ Hindi poems</span>, regularly recited at various prestigious stages in Ireland and USA.
                          As a motivational speaker, Rajesh Ji weaves ancient wisdom into inspiring talks that resonate
                          with modern audiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Combined Cards (Takes 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Areas of Interest & Expertise Card */}
            <Card className="border-0 shadow-lg bg-linear-to-br from-accent/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="text-primary" size={24} weight="fill" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl">Areas of Interest & Expertise</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <Atom className="mr-2" size={14} />
                    Quantum Mechanics
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <Book className="mr-2" size={14} />
                    Ancient Scriptures
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <BookOpen className="mr-2" size={14} />
                    Indian History
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <Heart className="mr-2" size={14} weight="fill" />
                    Positive Psychology
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <Pencil className="mr-2" size={14} />
                    Poetry
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <FlowerLotus className="mr-2" size={14} weight="fill" />
                    Yoga & Meditation
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <MedalMilitary className="mr-2" size={14} />
                    Astronomy
                  </Badge>
                  <Badge variant="outline" className="justify-start py-2 text-xs">
                    <Sparkle className="mr-2" size={14} weight="fill" />
                    Sanatana Dharma
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Academic Excellence Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center">
                <GraduationCap className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">Academic Excellence</h3>
                <p className="text-muted-foreground text-sm">
                  ME in Electronics Engineering from Dublin City University, Ireland
                </p>
                <Badge variant="secondary" className="mt-3">DCU Graduate</Badge>
              </CardContent>
            </Card>

            {/* Irish Industrialist Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-accent/5 to-accent/10">
              <CardContent className="p-6 text-center">
                <Briefcase className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">Irish Industrialist</h3>
                <p className="text-muted-foreground text-sm">
                  Successful industrial career alongside spiritual pursuits and community service
                </p>
                <Badge variant="secondary" className="mt-3">Business Leader</Badge>
              </CardContent>
            </Card>

            {/* eYogi Gurukul Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-6 text-center">
                <HandHeart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-xl mb-3">eYogi Gurukul</h3>
                <p className="text-muted-foreground text-sm">
                  Founded volunteer-based non-profit charity for Indic studies in Ireland (2017)
                </p>
                <Badge variant="secondary" className="mt-3">Founder</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="mb-16 overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="text-primary" size={16} weight="fill" />
              Our Journey
            </div>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl mb-4">Moments of Devotion & Service</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Glimpses of sacred ceremonies, spiritual gatherings, and community service performed with devotion and authenticity
            </p>
          </div>

          {/* Rolling Gallery */}
          <div className="relative w-full h-64 md:h-80">
            <div className="absolute inset-0 flex gap-4">
              <div className="flex gap-4 animate-scroll-left">
                <img src="/images/Raj 1.jpg" alt="Rajesh Joshi Ji" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 1.jpg" alt="Traditional Pooja Ceremony" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Raj 2.jpg" alt="Spiritual Guidance" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 2.jpg" alt="Hindu Ritual" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Raj 3.jpg" alt="Religious Ceremony" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 3.jpg" alt="Sacred Ritual" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
              </div>
              <div className="flex gap-4 animate-scroll-left" aria-hidden="true">
                <img src="/images/Raj 1.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 1.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Raj 2.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 2.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Raj 3.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
                <img src="/images/Pooja 3.jpg" alt="" className="h-64 md:h-80 w-auto object-cover rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect Section */}
        <Card className="mb-16 border-0 shadow-xl bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkle size={16} weight="fill" />
                What Makes Rajesh Ji Unique
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">What to Expect When You Invite Rajesh Ji</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                When you invite Rajesh Ji to perform a pooja, he comes as a complete package - blending deep
                scholarship, authentic rituals, and modern relevance in a way that touches hearts and minds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Deep Knowledge of Sanatana Dharma</h3>
                    <p className="text-muted-foreground text-sm">
                      Scholar of Indian Knowledge System with extensive study of Vedas, Upanishads, Puranas,
                      and Itihasas. He quotes exact references and explains the meaning and context.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-accent/5 to-accent/10 p-6 rounded-lg border border-accent/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Atom className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Ancient Wisdom Meets Modern Science</h3>
                    <p className="text-muted-foreground text-sm">
                      Bridges ancient spiritual practices with quantum mechanics, astronomy, and positive
                      psychology, making traditions relevant for contemporary understanding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-secondary/5 to-secondary/10 p-6 rounded-lg border border-secondary/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <FlowerLotus className="text-primary" size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Complete Pooja Explanation</h3>
                    <p className="text-muted-foreground text-sm">
                      Every step of the pooja is explained - why we do it, what it means, and how it
                      relates to modern life. No ritual is performed without understanding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary" size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Special Connection with Children</h3>
                    <p className="text-muted-foreground text-sm">
                      Having taught hundreds of children (ages 4-18) through eYogi Gurukul, he knows how to
                      engage young minds. Kids are typically glued to the pooja in his presence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-accent/5 to-secondary/5 p-6 rounded-lg border border-accent/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Book className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Authentic Vedic Rituals</h3>
                    <p className="text-muted-foreground text-sm">
                      Performs poojas as per Shastras with exact scriptural references. You'll know which
                      verse comes from which scripture and its precise meaning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-secondary/5 to-primary/5 p-6 rounded-lg border border-secondary/20">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="text-primary" size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Motivational & Inspiring</h3>
                    <p className="text-muted-foreground text-sm">
                      As a motivational speaker, his subtle messages bind families together. He weaves
                      words with examples that rejuvenate relationships and inspire spiritual growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/20 md:col-span-2">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="text-primary" size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Creating Sacred Environments</h3>
                    <p className="text-muted-foreground text-sm">
                      Rajesh Ji creates an atmosphere of purity, bhakti, and devotion that leaves forever imprints
                      in the minds of the Yajamana (host). His presence brings families and friends together,
                      encouraging spiritual growth while fostering harmony and understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Service */}
        <Card className="border-0 shadow-xl bg-linear-to-br from-accent/5 to-primary/5">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <HandHeart size={16} weight="fill" />
                Community Service
              </div>
              <h2 className="font-heading font-semibold text-2xl mb-4">Seva and Social Impact</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-linear-to-r from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <BookOpen className="text-primary shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">One Notary One Gita Project</h3>
                    <p className="text-muted-foreground">
                      A unique community service initiative aimed at spreading the wisdom of the Bhagavad Gita
                      to communities across Ireland, making ancient wisdom accessible to all.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-accent/5 to-secondary/5 p-6 rounded-lg border border-accent/20">
                <div className="flex items-start gap-4">
                  <Heart className="text-primary shrink-0 mt-1" size={32} weight="fill" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Seva Without Monetary Gain</h3>
                    <p className="text-muted-foreground">
                      Rajesh Ji strongly believes in the power of Bhakti and selfless service. All 200+ poojas
                      performed since 2001 have been conducted alongside his industrial career without taking
                      any monetary gains for himself - a true testament to his dedication to spiritual service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </section>
    </div>
  )
}
