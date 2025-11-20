import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { FlowerLotus, Book, GraduationCap, Heart, Users, Trophy, Sparkle } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'

export default function AboutPage() {
  // SEO Configuration
  usePageSEO({
    title: 'About Pandit Rajesh Joshi | Expert Hindu Priest & Spiritual Guide',
    description: 'Learn about Pandit Rajesh Joshi - 15+ years experience as a Hindu priest, expert in Vedic traditions, Sanskrit scholar, and spiritual guide. Serving communities in Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu priest, Pandit, spiritual guide, Hindu priest Ireland, temple priest, Hindu scholar, Vedic knowledge, spiritual guidance',
    canonicalUrl: 'https://panditrajesh.com/about'
  })

  return (
    <div className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl scale-110"></div>
            <img
              src="/Raj ji.jpg"
              alt="Pandit Rajesh Joshi"
              className="relative w-32 h-32 rounded-full object-cover border-6 border-white shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
              <FlowerLotus size={16} weight="fill" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkle size={14} weight="fill" />
            Spiritual Guide & Hindu Priest
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 text-foreground">
            Pandit <span className="text-primary">Rajesh Joshi</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A distinguished spiritual guide bridging ancient Vedic wisdom with modern understanding,
            serving communities with authentic Hindu ceremonies and profound spiritual insights.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Poojas Performed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">250+</div>
            <div className="text-sm text-muted-foreground">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5</div>
            <div className="text-sm text-muted-foreground">Published Books</div>
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
                  <h2 className="font-heading font-semibold text-2xl">Spiritual Journey</h2>
                </div>

                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Pandit Rajesh Joshi's spiritual journey began at a young age, immersed in the study of
                    Vedic scriptures and Hindu philosophy under traditional scholars. His deep understanding
                    of ancient texts combined with modern insights makes him uniquely qualified to guide
                    contemporary seekers.
                  </p>

                  <p className="text-lg leading-relaxed">
                    With thousands of ceremonies performed, from joyous weddings to solemn memorial services,
                    Pandit Ji has touched countless lives. His approach seamlessly blends traditional authenticity
                    with contemporary relevance, making sacred practices accessible and meaningful for all generations.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Beyond rituals, he is passionate about spiritual education through workshops, lectures,
                    and personal consultations, helping individuals discover practical wisdom for modern living
                    while honoring timeless traditions.
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
                <h3 className="font-heading font-semibold text-xl mb-3">Scholarly Excellence</h3>
                <p className="text-muted-foreground">
                  Extensive training in Vedic scriptures, Sanskrit literature, and Hindu philosophy from renowned scholars.
                </p>
                <Badge variant="secondary" className="mt-3">PhD in Sanskrit</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-6 text-center">
                <Heart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-xl mb-3">Compassionate Service</h3>
                <p className="text-muted-foreground">
                  Years of dedicated service to Hindu communities worldwide with genuine care and devotion.
                </p>
                <Badge variant="secondary" className="mt-3">Community Leader</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-6 text-center">
                <Book className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-xl mb-3">Author & Educator</h3>
                <p className="text-muted-foreground">
                  Published author and regular speaker on Hindu dharma, spirituality, and modern living.
                </p>
                <Badge variant="secondary" className="mt-3">Published Author</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Books Section */}
        <Card className="mb-16 border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Book className="text-primary" size={24} />
              </div>
              <h2 className="font-heading font-semibold text-2xl">Literary Contributions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  Pandit Rajesh Joshi has authored several influential works that bridge ancient Hindu wisdom
                  with contemporary challenges. His books offer practical guidance for modern spiritual living
                  while preserving the depth of traditional teachings.
                </p>
                <p className="text-muted-foreground italic">
                  "Ancient Wisdom for Modern Times" • "The Path of Dharma" • "Spiritual Living Today" and more...
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-32 bg-gradient-to-b from-primary/20 to-primary/10 rounded-lg shadow-lg mb-4">
                  <Book className="text-primary" size={32} />
                </div>
                <p className="text-sm text-muted-foreground">Book titles and detailed information available upon request</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Trophy size={16} weight="fill" />
                Guiding Philosophy
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">Our Approach to Spiritual Service</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FlowerLotus className="text-primary" size={20} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Authenticity First</h3>
                    <p className="text-muted-foreground">
                      Every ceremony follows proper Vedic procedures while being explained in contemporary language.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary" size={20} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Inclusive Service</h3>
                    <p className="text-muted-foreground">
                      Open and respectful services for everyone, helping all connect with Hindu spiritual traditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Educational Focus</h3>
                    <p className="text-muted-foreground">
                      Each ritual becomes a learning opportunity, deepening understanding of spiritual heritage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="text-primary" size={20} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Compassionate Care</h3>
                    <p className="text-muted-foreground">
                      Special attention to emotional and spiritual needs, ensuring meaningful and comforting experiences.
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
