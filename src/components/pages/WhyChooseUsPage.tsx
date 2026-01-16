import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Heart, GraduationCap, FlowerLotus, ListChecks, UsersFour, Globe, Sparkle, BookOpen, CheckCircle } from '@phosphor-icons/react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useWhyChooseContent } from '../../hooks/useCmsContent'

export default function WhyChooseUsPage() {
  // CMS Content
  const { content: cmsContent } = useWhyChooseContent()

  // SEO Configuration
  usePageMetadata('why-choose-us')

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-1-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-2-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
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
              <Sparkle size={18} weight="fill" className="animate-pulse" />
              Excellence in Service
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {cmsContent.hero.title.includes('Pandit') ? (
                <>Why Choose <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Pandit Rajesh Joshi</span></>
              ) : (
                cmsContent.hero.title
              )}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium mb-8">
              {cmsContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cmsContent.quickBenefits.map((benefit, index) => {
              const iconMap: Record<string, React.ReactNode> = {
                'Heart': <Heart className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />,
                'GraduationCap': <GraduationCap className="mx-auto mb-2 text-amber-400" size={32} />,
                'FlowerLotus': <FlowerLotus className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />,
                'ListChecks': <ListChecks className="mx-auto mb-2 text-amber-400" size={32} />,
                'UsersFour': <UsersFour className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />,
                'Globe': <Globe className="mx-auto mb-2 text-amber-400" size={32} />
              }
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  {iconMap[benefit.icon] || <Sparkle className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />}
                  <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{benefit.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12 px-4 md:px-8 lg:px-12">

        {/* Main Reasons */}
        <div className="space-y-8">
          {cmsContent.reasons.map((reason, index) => {
            const getIcon = () => {
              if (reason.title.toLowerCase().includes('passion') || reason.title.toLowerCase().includes('devotion')) return Heart
              if (reason.title.toLowerCase().includes('experience') || reason.title.toLowerCase().includes('scholar')) return GraduationCap
              if (reason.title.toLowerCase().includes('authentic') || reason.title.toLowerCase().includes('vedic')) return FlowerLotus
              if (reason.title.toLowerCase().includes('range') || reason.title.toLowerCase().includes('service')) return ListChecks
              if (reason.title.toLowerCase().includes('personalised') || reason.title.toLowerCase().includes('regional')) return UsersFour
              if (reason.title.toLowerCase().includes('online') || reason.title.toLowerCase().includes('e-pooja')) return Globe
              return Sparkle
            }

            const getGradient = () => {
              const gradients = ['from-red-50 to-pink-50', 'from-blue-50 to-indigo-50', 'from-amber-50 to-orange-50', 'from-green-50 to-emerald-50', 'from-purple-50 to-violet-50', 'from-cyan-50 to-sky-50']
              return gradients[index % gradients.length]
            }

            const getBorderColor = () => {
              const colors = ['border-red-200', 'border-blue-200', 'border-amber-200', 'border-green-200', 'border-purple-200', 'border-cyan-200']
              return colors[index % colors.length]
            }

            const getIconBg = () => {
              const backgrounds = ['bg-red-100', 'bg-blue-100', 'bg-amber-100', 'bg-green-100', 'bg-purple-100', 'bg-cyan-100']
              return backgrounds[index % backgrounds.length]
            }

            const Icon = getIcon()

            return (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-lg transition-all duration-300 bg-linear-to-br ${getGradient()}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon Section */}
                    <div className="shrink-0">
                      <div className={`w-16 h-16 ${getIconBg()} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-primary" size={32} weight="fill" />
                      </div>
                      <Badge variant="outline" className="mt-4 text-xs">{index + 1} of {cmsContent.reasons.length}</Badge>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <h2 className="font-heading font-bold text-2xl mb-4 text-foreground">
                        {reason.title}
                      </h2>

                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        {reason.description}
                      </p>

                      <div className={`bg-white/50 border ${getBorderColor()} rounded-lg p-4 mb-4`}>
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-semibold">Impact:</span> {reason.impact}
                        </p>
                      </div>

                      {/* Highlights */}
                      {reason.highlights && reason.highlights.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {reason.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="text-primary shrink-0 mt-0.5" size={18} weight="fill" />
                              <span className="text-sm text-muted-foreground">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Shloka */}
                      {reason.shloka && (
                        <div className="mt-6 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <BookOpen className="text-primary shrink-0 mt-1" size={24} />
                            <div className="flex-1">
                              <p className="text-base font-sanskrit text-foreground leading-relaxed mb-2">
                                {reason.shloka.sanskrit}
                              </p>
                              <Badge variant="secondary" className="mb-3 text-xs">{reason.shloka.reference}</Badge>
                              <p className="text-sm text-muted-foreground italic mb-2">
                                {reason.shloka.hindi}
                              </p>
                              <p className="text-sm text-foreground">
                                {reason.shloka.english}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 border-0 shadow-lg bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <Sparkle className="mx-auto mb-4 text-primary" size={48} weight="fill" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-foreground">
              {cmsContent.ctaSection.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              {cmsContent.ctaSection.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {cmsContent.ctaSection.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`inline-flex items-center justify-center gap-2 ${
                    button.variant === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  } px-6 py-3 rounded-lg font-semibold transition-colors`}
                >
                  {button.text.toLowerCase().includes('service') ? (
                    <ListChecks size={20} />
                  ) : (
                    <Heart size={20} weight="fill" />
                  )}
                  {button.text}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

