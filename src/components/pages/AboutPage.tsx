import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { FlowerLotus, Book, GraduationCap, Heart, Users, Trophy, Sparkle, Pencil, Briefcase, HandHeart, Lightbulb, MedalMilitary, BookOpen, Atom } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'

export default function AboutPage() {
  // SEO Configuration
  usePageSEO({
    title: 'About Rajesh Joshi "eYogi Raj" | Industrialist, Scholar, Pandit & Author',
    description: 'Rajesh Joshi "eYogi Raj" - Indian-Irish Industrialist, Hindu scholar, author of multiple books, founder of eYogi Gurukul, and spiritual guide. ME in Electronics Engineering from DCU. 200+ poojas performed, 100+ poems composed.',
    keywords: 'Rajesh Joshi, eYogi Raj, Hindu priest Ireland, eYogi Gurukul, Hindu scholar, Sanatana Dharma, meditation teacher, Irish industrialist, Vedic poojas, motivational speaker',
    canonicalUrl: 'https://panditrajesh.com/about'
  })

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-4">
            <img
              src="/Raj ji.jpg"
              alt="Pandit Rajesh Joshi"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-foreground">
            About <span className="text-primary">Rajesh Joshi</span> "eYogi Raj"
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</div>
            <div className="text-sm text-muted-foreground font-medium">Poojas Performed</div>
            <div className="text-xs text-muted-foreground/70 mt-1">Since 2001</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
            <div className="text-sm text-muted-foreground font-medium">Poems Composed</div>
            <div className="text-xs text-muted-foreground/70 mt-1">Hindi Poetry</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-sm text-muted-foreground font-medium">Years Teaching</div>
            <div className="text-xs text-muted-foreground/70 mt-1">eYogi Gurukul</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground font-medium">Published Books</div>
            <div className="text-xs text-muted-foreground/70 mt-1">On Hinduism</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Spiritual Journey */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expertise Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center">
                <GraduationCap className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">Academic Excellence</h3>
                <p className="text-muted-foreground text-sm">
                  ME in Electronics Engineering from Dublin City University, Ireland
                </p>
                <Badge variant="secondary" className="mt-3">DCU Graduate</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-6 text-center">
                <Briefcase className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">Irish Industrialist</h3>
                <p className="text-muted-foreground text-sm">
                  Successful industrial career alongside spiritual pursuits and community service
                </p>
                <Badge variant="secondary" className="mt-3">Business Leader</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10">
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

        {/* Interests Section */}
        <Card className="mb-16 border-0 shadow-lg bg-gradient-to-br from-accent/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="text-primary" size={24} weight="fill" />
              </div>
              <h2 className="font-heading font-semibold text-2xl">Areas of Interest & Expertise</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <Atom className="mr-2" size={16} />
                Quantum Mechanics
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <Book className="mr-2" size={16} />
                Ancient Scriptures
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <BookOpen className="mr-2" size={16} />
                Indian History
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <Heart className="mr-2" size={16} weight="fill" />
                Positive Psychology
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <Pencil className="mr-2" size={16} />
                Poetry
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <FlowerLotus className="mr-2" size={16} weight="fill" />
                Yoga & Meditation
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <MedalMilitary className="mr-2" size={16} />
                Astronomy
              </Badge>
              <Badge variant="outline" className="justify-center py-3 text-sm">
                <Sparkle className="mr-2" size={16} weight="fill" />
                Sanatana Dharma
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Books Section */}
        <Card className="mb-16 border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Book className="text-primary" size={24} />
              </div>
              <h2 className="font-heading font-semibold text-2xl">Literary Contributions</h2>
            </div>

            <div className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                Rajesh Ji has written multiple books on Indian culture and Sanatana Dharma, connecting ancient
                wisdom to modern science. His books are published with hundreds of physical copies in circulation
                across Ireland and India. He has also composed over <span className="font-semibold text-foreground">100 Hindi poems</span>,
                recited at prestigious stages in Ireland and USA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-lg border border-primary/20">
                  <Book className="text-primary mb-3" size={28} />
                  <h4 className="font-semibold text-foreground mb-2">Hinduism Basics for All</h4>
                  <p className="text-sm text-muted-foreground">Foundational understanding of Hindu philosophy</p>
                </div>

                <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-5 rounded-lg border border-accent/20">
                  <Atom className="text-primary mb-3" size={28} />
                  <h4 className="font-semibold text-foreground mb-2">Hinduism and Science</h4>
                  <p className="text-sm text-muted-foreground">Bridging ancient wisdom and modern knowledge</p>
                </div>

                <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 rounded-lg border border-secondary/20">
                  <FlowerLotus className="text-primary mb-3" size={28} weight="fill" />
                  <h4 className="font-semibold text-foreground mb-2">eYogi Yoga & Meditation Guide</h4>
                  <p className="text-sm text-muted-foreground">His own meditation methodology for beginners</p>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-5 rounded-lg border border-primary/20">
                  <Sparkle className="text-primary mb-3" size={28} weight="fill" />
                  <h4 className="font-semibold text-foreground mb-2">Navaratri: The Bhakti of Shakti</h4>
                  <p className="text-sm text-muted-foreground">Deep dive into the festival of divine feminine</p>
                </div>

                <div className="bg-gradient-to-br from-accent/5 to-secondary/5 p-5 rounded-lg border border-accent/20">
                  <Trophy className="text-primary mb-3" size={28} weight="fill" />
                  <h4 className="font-semibold text-foreground mb-2">Diwali: The Oldest Festival</h4>
                  <p className="text-sm text-muted-foreground">History and significance of the festival of lights</p>
                </div>

                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-5 rounded-lg border border-secondary/20">
                  <GraduationCap className="text-primary mb-3" size={28} />
                  <h4 className="font-semibold text-foreground mb-2">Leaving Cert Guide</h4>
                  <p className="text-sm text-muted-foreground">Co-authored with Dr. Hanumantha Rao & Dr. Reeta Joshi</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mt-6">
                <div className="flex items-start gap-4">
                  <Pencil className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Poetry & Public Speaking</h4>
                    <p className="text-sm text-muted-foreground">
                      Composed 100+ Hindi poems, regularly recited at various prestigious stages in Ireland and USA.
                      As a motivational speaker, Rajesh Ji weaves ancient wisdom into inspiring talks that resonate
                      with modern audiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Expect Section */}
        <Card className="mb-16 border-0 shadow-xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
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
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-lg border border-accent/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 rounded-lg border border-secondary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-accent/5 to-secondary/5 p-6 rounded-lg border border-accent/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-6 rounded-lg border border-secondary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
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

              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/20 md:col-span-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
        <Card className="border-0 shadow-xl bg-gradient-to-br from-accent/5 to-primary/5">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <HandHeart size={16} weight="fill" />
                Community Service
              </div>
              <h2 className="font-heading font-semibold text-2xl mb-4">Seva and Social Impact</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <BookOpen className="text-primary flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">One Notary One Gita Project</h3>
                    <p className="text-muted-foreground">
                      A unique community service initiative aimed at spreading the wisdom of the Bhagavad Gita
                      to communities across Ireland, making ancient wisdom accessible to all.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-lg border border-accent/20">
                <div className="flex items-start gap-4">
                  <Heart className="text-primary flex-shrink-0 mt-1" size={32} weight="fill" />
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
    </div>
  )
}
