import { usePageSEO } from '../../hooks/usePageSEO'
import { useCharity } from '../../hooks/useCharity'
import { useCharityContent } from '../../hooks/useCmsContent'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Heart, Book, Users, HandHeart, Sparkle, Target, Globe, Trophy, CircleNotch, BookOpenText, GraduationCap } from '@phosphor-icons/react'

interface CharityProject {
  id: string
  title: string
  short_description: string
  full_description?: string | null
  video_url?: string | null
  category?: string | null
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split('youtu.be/')[1]?.split('?')[0] || url.split('v=')[1]?.split('&')[0]
  return `https://www.youtube.com/embed/${videoId}`
}

const getIconComponent = (iconName?: string, size: number = 48) => {
  if (!iconName) return null
  
  const iconMap: Record<string, any> = {
    'BookOpenText': BookOpenText,
    'GraduationCap': GraduationCap,
    'Heart': Heart,
    'Book': Book,
    'Users': Users,
    'HandHeart': HandHeart,
    'Sparkle': Sparkle,
    'Target': Target,
    'Globe': Globe,
    'Trophy': Trophy
  }
  
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent className="mx-auto text-primary" size={size} weight="fill" /> : null
}

export default function CharityPage() {
  // CMS Content
  const { content: cmsContent } = useCharityContent()

  usePageSEO({
    title: 'Hindu Community Charity Work & Social Service | Pandit Rajesh Joshi',
    description: 'Explore our Hindu community charity initiatives, spiritual education programs, and social service projects. Supporting communities in Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu charity, community service, spiritual education, charity work, social service, Hindu community Ireland, Bhagavad Gita distribution',
    canonicalUrl: 'https://panditrajesh.ie/charity'
  })

  const { projects, isLoading } = useCharity()

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {cmsContent.hero.backgroundImages.map((img, index) => (
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
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <HandHeart size={18} weight="fill" className="animate-pulse" />
              {cmsContent.hero.badge}
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {cmsContent.hero.title} <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">{cmsContent.hero.subtitle}</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {cmsContent.hero.description}
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {cmsContent.statistics.map((stat, index) => (
                <span key={index}>
                  {index > 0 && <span className="text-white/50 mr-6">•</span>}
                  <span className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <span className="font-bold text-amber-400">{stat.value}</span> {stat.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12">
        {/* Featured Projects Section Header (from CMS) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkle size={16} />
              {cmsContent.featuredProjects.badge}
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              {cmsContent.featuredProjects.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {cmsContent.featuredProjects.description}
            </p>
          </div>

          {/* Featured Projects Video and Stats */}
          <Card className="border-0 shadow-2xl bg-linear-to-br from-card via-card to-primary/5 overflow-hidden mb-8">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {/* Video - Centered */}
                <div className="w-full max-w-4xl mx-auto">
                  {cmsContent.featuredProjects.videoUrl ? (
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(cmsContent.featuredProjects.videoUrl)}
                        title={cmsContent.featuredProjects.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <div className="text-center">
                        <Book className="text-primary/60 mx-auto mb-4" size={64} />
                        <p className="text-primary/60 font-medium">Featured Content</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats - Below Video */}
                {cmsContent.featuredProjects.stats && cmsContent.featuredProjects.stats.length > 0 && (
                  <div className="p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {cmsContent.featuredProjects.stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto mb-3">
                            <Trophy className="text-primary" size={24} />
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                          <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <div className="space-y-12 mb-16">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CircleNotch className="animate-spin text-primary" size={48} />
            </div>
          ) : !projects || projects.length === 0 ? (
            <Card className="border-0 shadow-2xl bg-linear-to-br from-card via-card to-primary/5 overflow-hidden">
              <CardContent className="p-12 text-center">
                <HandHeart className="mx-auto mb-4 text-muted-foreground" size={64} />
                <h3 className="font-heading font-semibold text-2xl mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground">Check back soon for updates on our charity initiatives.</p>
              </CardContent>
            </Card>
          ) : projects.map((project, index) => (
            <Card key={project.id} className="border-0 shadow-2xl bg-linear-to-br from-card via-card to-primary/5 overflow-hidden">
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

                    {project.full_description ? (
                      <div 
                        className="text-lg text-muted-foreground mb-6 leading-relaxed prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: project.full_description }}
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {project.short_description}
                      </p>
                    )}

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
                    {project.video_url ? (
                      <div className="aspect-video">
                        <iframe
                          src={getYouTubeEmbedUrl(project.video_url)}
                          title={project.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
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
          {cmsContent.serviceAreas.map((area, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-primary/5 to-primary/10 text-center">
              <CardContent className="p-8">
                <div className="mb-6">{getIconComponent(area.icon)}</div>
                <h3 className="font-heading font-semibold text-xl mb-4">{area.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {area.description}
                </p>
                {area.stats && (
                  <Badge variant="secondary">
                    {area.stats}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <Card className="border-0 shadow-xl bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5 mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Target size={16} />
                {cmsContent.missionStatement.title}
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.missionStatement.title}</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{cmsContent.missionStatement.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
              <div className="space-y-6">
                {cmsContent.missionStatement.features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {feature.icon === 'Globe' && <Globe className="text-primary" size={20} />}
                      {feature.icon === 'Heart' && <Heart className="text-primary" size={20} weight="fill" />}
                      {feature.icon === 'Sparkle' && <Sparkle className="text-primary" size={20} />}
                      {feature.icon === 'Trophy' && <Trophy className="text-primary" size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110"></div>
                  <div className="relative bg-linear-to-br from-primary/10 to-accent/10 rounded-full p-8">
                    <Heart className="text-primary mx-auto" size={64} weight="fill" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-linear-to-br from-primary/10 to-accent/10">
          <CardContent className="p-8 md:p-12 text-center">
            <HandHeart className="mx-auto mb-6 text-primary" size={48} weight="fill" />

            <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.ctaSection.title}</h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {cmsContent.ctaSection.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {cmsContent.ctaSection.buttons.map((button, index) => (
                <Button
                  key={index}
                  size="lg"
                  className={`px-8 py-3 font-semibold ${
                    button.variant === 'primary'
                      ? 'bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 border-2 border-amber-700/30'
                      : 'bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-stone-900/50 border-2 border-stone-600/30'
                  } transition-all duration-300 hover:scale-105`}
                  onClick={() => window.location.href = button.link}
                >
                  {button.text === 'Make a Donation' && <Heart className="mr-2" size={20} weight="fill" />}
                  {button.text === 'Volunteer With Us' && <Users className="mr-2" size={20} />}
                  {button.text === 'Learn More' && <Book className="mr-2" size={20} />}
                  {button.text}
                </Button>
              ))}
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
