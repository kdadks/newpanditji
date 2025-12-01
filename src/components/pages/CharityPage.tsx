import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePageSEO } from '../../hooks/usePageSEO'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Heart, Book, Users, HandHeart, Sparkle, Target, Globe, Trophy } from '@phosphor-icons/react'

interface CharityProject {
  id: string
  title: string
  description: string
  videoUrl?: string
  category: string
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split('youtu.be/')[1]?.split('?')[0] || url.split('v=')[1]?.split('&')[0]
  return `https://www.youtube.com/embed/${videoId}`
}

export default function CharityPage() {
  usePageSEO({
    title: 'Hindu Community Charity Work & Social Service | Pandit Rajesh Joshi',
    description: 'Explore our Hindu community charity initiatives, spiritual education programs, and social service projects. Supporting communities in Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu charity, community service, spiritual education, charity work, social service, Hindu community Ireland, Bhagavad Gita distribution',
    canonicalUrl: 'https://panditrajesh.ie/charity'
  })

  const [adminProjects] = useLocalStorage<CharityProject[]>('admin-charity', [
    {
      id: 'one-rotary-gita',
      title: 'One Rotary One Gita Project',
      description: 'A groundbreaking initiative to distribute the Bhagavad Gita to communities worldwide, making this sacred wisdom accessible to all. Through partnership with Rotary clubs and community organizations, we aim to spread the universal teachings of the Gita across cultures and continents. This project represents our commitment to sharing timeless spiritual wisdom that transcends boundaries and brings people together through shared values of duty, devotion, and dharma.',
      videoUrl: 'https://youtu.be/92VjrCUL1K8',
      category: 'Scripture Distribution'
    }
  ])
  const projects = adminProjects || []

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
        </div>
        
        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>
        
        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>
        
        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-2xl scale-110"></div>
              <Heart className="relative text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" size={80} weight="fill" />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                <Sparkle size={16} weight="fill" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-xl">
              <Target size={16} />
              Service to Humanity
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Charity <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">& Compassion</span>
            </h1>

            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Serving humanity through spiritual education and community initiatives,
              making sacred wisdom accessible to all who seek enlightenment and peace.
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">1000+</span> Gitas Distributed
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">50+</span> Communities
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">25+</span> Rotary Clubs
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className="font-bold text-amber-400">24/7</span> Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12">

        {/* Featured Projects */}
        <div className="space-y-12 mb-16">
          {projects.map((project, index) => (
            <Card key={project.id} className="border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Book className="text-primary" size={20} />
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {project.category}
                      </Badge>
                    </div>

                    <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6 leading-tight">
                      {project.title}
                    </h2>

                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary" className="px-3 py-1">
                        <Globe size={14} className="mr-1" />
                        Global Impact
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1">
                        <Users size={14} className="mr-1" />
                        Community Focused
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1">
                        <Trophy size={14} className="mr-1" />
                        Spiritual Growth
                      </Badge>
                    </div>
                  </div>

                  <div className={`order-1 lg:order-2 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    {project.videoUrl ? (
                      <div className="aspect-video">
                        <iframe
                          src={getYouTubeEmbedUrl(project.videoUrl)}
                          title={project.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-center">
                          <Book className="text-primary/60 mx-auto mb-4" size={64} />
                          <p className="text-primary/60 font-medium">Sacred Wisdom</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 text-center">
            <CardContent className="p-8">
              <Book className="mx-auto mb-6 text-primary" size={48} />
              <h3 className="font-heading font-semibold text-xl mb-4">Scripture Distribution</h3>
              <p className="text-muted-foreground mb-4">
                Providing sacred Hindu texts to individuals and institutions worldwide through our
                partnerships with Rotary clubs and community organizations.
              </p>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Bhagavad Gita Initiative
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10 text-center">
            <CardContent className="p-8">
              <Users className="mx-auto mb-6 text-primary" size={48} weight="fill" />
              <h3 className="font-heading font-semibold text-xl mb-4">Community Education</h3>
              <p className="text-muted-foreground mb-4">
                Free workshops and lectures on Hindu philosophy and spirituality, making ancient
                wisdom accessible to modern seekers everywhere.
              </p>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                Knowledge Sharing
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10 text-center">
            <CardContent className="p-8">
              <HandHeart className="mx-auto mb-6 text-primary" size={48} weight="fill" />
              <h3 className="font-heading font-semibold text-xl mb-4">Spiritual Support</h3>
              <p className="text-muted-foreground mb-4">
                Complimentary guidance and counseling for those facing life's challenges,
                offering spiritual wisdom and compassionate support.
              </p>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                Compassionate Care
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Target size={16} />
                Our Sacred Mission
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">Why We Serve</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Universal Access</h3>
                    <p className="text-muted-foreground">
                      Making spiritual wisdom available to everyone, regardless of background or location.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="text-primary" size={20} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Compassionate Service</h3>
                    <p className="text-muted-foreground">
                      Serving with genuine care and understanding for the spiritual well-being of all.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Cultural Preservation</h3>
                    <p className="text-muted-foreground">
                      Preserving and sharing the rich heritage of Hindu spiritual traditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-8">
                    <Heart className="text-primary mx-auto" size={64} weight="fill" />
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 italic">
                  "Service to humanity is service to divinity"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-8 md:p-12 text-center">
            <HandHeart className="mx-auto mb-6 text-primary" size={48} weight="fill" />

            <h2 className="font-heading font-semibold text-3xl mb-4">Support Our Mission</h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Your contribution helps us continue our work of spreading spiritual wisdom and supporting
              communities worldwide. Every act of generosity creates ripples of positive change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="mr-2" size={20} weight="fill" />
                Make a Donation
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Users className="mr-2" size={20} />
                Volunteer With Us
              </Button>
              <Button variant="ghost" size="lg" className="px-8 py-3">
                <Book className="mr-2" size={20} />
                Learn More
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              All charitable contributions are used directly for educational materials, community programs,
              and spiritual support services. Your generosity makes a real difference.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
