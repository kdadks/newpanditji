'use client'

import { usePageSEO } from '../../hooks/usePageSEO'
import { useCharity } from '../../hooks/useCharity'
import { useCharityContent } from '../../hooks/useCmsContent'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Heart,
  Book,
  Users,
  HandHeart,
  Sparkle,
  Target,
  Globe,
  CircleNotch,
  BookOpenText,
  GraduationCap,
  Handshake,
  Gift
} from '@phosphor-icons/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { getOptimizedImageProps } from '../../utils/imageOptimization'
import { useDisableAnimations } from '../../hooks/useMediaQuery'

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

const getIconComponent = (iconName?: string, size: number = 48, className?: string) => {
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
    'Handshake': Handshake,
    'Gift': Gift
  }

  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent className={className || 'text-primary'} size={size} weight="fill" /> : null
}

// Animation variants for reusable animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1
  }
}

// Animated Counter Component
function AnimatedCounter({ value, label, subtext, disableAnimation = false }: { value: string; label: string; subtext?: string; disableAnimation?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (disableAnimation) {
    return (
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          {value}
        </div>
        <div className="text-lg md:text-xl font-semibold text-foreground mb-1">{label}</div>
        {subtext && <div className="text-sm text-muted-foreground">{subtext}</div>}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.div
        className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-lg md:text-xl font-semibold text-foreground mb-1">{label}</div>
      {subtext && <div className="text-sm text-muted-foreground">{subtext}</div>}
    </motion.div>
  )
}

export default function CharityPage() {
  const { content: cmsContent } = useCharityContent()
  const { projects, isLoading } = useCharity()
  const disableAnimations = useDisableAnimations()

  usePageSEO({
    title: 'Hindu Community Charity Work & Social Service | Pandit Rajesh Joshi',
    description: 'Explore our Hindu community charity initiatives, spiritual education programs, and social service projects. Supporting communities in Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu charity, community service, spiritual education, charity work, social service, Hindu community Ireland, Bhagavad Gita distribution',
    canonicalUrl: 'https://panditrajesh.ie/charity'
  })

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Sunrise Theme */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Featured Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-amber-300/30 to-orange-300/30 rounded-3xl blur-2xl scale-110"></div>
                <img
                  {...getOptimizedImageProps({
                    src: cmsContent.hero.logoImage || cmsContent.hero.backgroundImages[0] || '/images/charity-hero.jpg',
                    alt: 'Charity Project Logo',
                    priority: true,
                    className: 'relative w-full max-w-[320px] md:max-w-md h-64 md:h-80 lg:h-96 rounded-3xl object-cover border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300'
                  })}
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-2 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide">
                <HandHeart size={18} weight="fill" className="animate-pulse" />
                {cmsContent.hero.badge}
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
                {cmsContent.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl font-semibold bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-6 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {cmsContent.hero.subtitle}
              </p>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/95 font-medium mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {cmsContent.hero.description}
              </p>

              {/* Statistics - Compact inline */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8 max-w-2xl mx-auto lg:mx-0">
                {cmsContent.hero.statistics.map((stat, index) => (
                  <span key={index} className="text-base md:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap text-center lg:text-left">
                    <span className="font-extrabold text-transparent bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">{stat.value}</span>{' '}
                    <span className="font-semibold text-white/95">{stat.label}</span>
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {cmsContent.hero.ctaButtons.map((button, index) => (
                  <Button
                    key={index}
                    size="lg"
                    onClick={() => window.location.href = button.link}
                    className={`text-base px-8 py-3 transition-all duration-300 hover:scale-105 font-semibold shadow-2xl ${
                      button.variant === 'primary'
                        ? 'bg-gradient-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-amber-900/50 hover:shadow-3xl border-2 border-amber-700/30'
                        : 'bg-gradient-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-stone-900/50 hover:shadow-3xl border-2 border-stone-600/30'
                    }`}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="pt-0 pb-0 bg-background">


        {/* Featured Projects */}
        <section className="mb-10 md:mb-16 bg-gradient-to-b from-primary/5 to-transparent py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {disableAnimations ? (
              <div className="text-center mb-12">
                <div className="mb-4">
                  <Badge className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium border-primary/20">
                    <Target size={16} className="mr-2" />
                    {cmsContent.featuredProjects.badge}
                  </Badge>
                </div>
                <h2 className="font-heading font-black text-4xl md:text-6xl mb-6">
                  {cmsContent.featuredProjects.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  {cmsContent.featuredProjects.description}
                </p>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="text-center mb-12"
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Badge className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium border-primary/20">
                    <Target size={16} className="mr-2" />
                    {cmsContent.featuredProjects.badge}
                  </Badge>
                </motion.div>
                <motion.h2
                  variants={fadeInUp}
                  className="font-heading font-black text-4xl md:text-6xl mb-6"
                >
                  {cmsContent.featuredProjects.title}
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
                >
                  {cmsContent.featuredProjects.description}
                </motion.p>
              </motion.div>
            )}

            {/* Featured Video Card - Compact Design */}
            {disableAnimations ? (
              <div className="max-w-5xl mx-auto mb-16">
                <Card className="border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden group">
                  <CardContent className="p-6 md:p-8">
                    {/* Video Container - Reduced Size */}
                    {cmsContent.featuredProjects.videoUrl ? (
                      <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
                        <div className="aspect-video bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(cmsContent.featuredProjects.videoUrl)}
                            title={cmsContent.featuredProjects.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        {/* Decorative Border Accent */}
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-xl pointer-events-none group-hover:border-primary/40 transition-colors duration-300"></div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-xl">
                        <Book className="text-primary/60" size={80} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={scaleIn}
                className="max-w-5xl mx-auto mb-16"
              >
                <Card className="border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden group">
                  <CardContent className="p-6 md:p-8">
                    {/* Video Container - Reduced Size */}
                    {cmsContent.featuredProjects.videoUrl ? (
                      <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
                        <div className="aspect-video bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(cmsContent.featuredProjects.videoUrl)}
                            title={cmsContent.featuredProjects.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        {/* Decorative Border Accent */}
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-xl pointer-events-none group-hover:border-primary/40 transition-colors duration-300"></div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-xl">
                        <Book className="text-primary/60" size={80} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Database Projects - Compact Grid Layout */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <CircleNotch className="animate-spin text-primary" size={64} />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={fadeInUp}
                  >
                    <Card className="border-2 border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-primary/5 overflow-hidden group h-full flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Video Section - Top */}
                        {project.video_url ? (
                          <div className="relative">
                            <div className="aspect-video bg-black">
                              <iframe
                                src={getYouTubeEmbedUrl(project.video_url)}
                                title={project.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            {/* Category Badge Overlay */}
                            {project.category && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-gradient-to-r from-primary/95 to-accent/95 text-white border-0 shadow-lg px-3 py-1.5 backdrop-blur-sm">
                                  {project.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                            <Book className="text-primary/40" size={80} />
                            {project.category && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5">
                                  {project.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content Section - Bottom */}
                        <div className="p-6 flex flex-col flex-1">
                          {/* Icon & Title */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="mt-1 p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                              <Book className="text-primary" size={20} weight="fill" />
                            </div>
                            <h3 className="font-heading font-bold text-xl lg:text-2xl leading-tight group-hover:text-primary transition-colors duration-300">
                              {project.title}
                            </h3>
                          </div>

                          {/* Description */}
                          <div className="flex-1 mb-4">
                            {project.full_description ? (
                              <div
                                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none line-clamp-4"
                                dangerouslySetInnerHTML={{ __html: project.full_description }}
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                {project.short_description}
                              </p>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                            <Badge variant="secondary" className="text-xs px-2.5 py-1">
                              <Globe size={12} className="mr-1" />
                              Global Impact
                            </Badge>
                            <Badge variant="secondary" className="text-xs px-2.5 py-1">
                              <Users size={12} className="mr-1" />
                              Community
                            </Badge>
                            <Badge variant="secondary" className="text-xs px-2.5 py-1">
                              <Heart size={12} className="mr-1" weight="fill" />
                              Spiritual
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </section>





        {/* Mission & Vision */}
        <section className="-mt-3 md:-mt-4 mb-5 md:mb-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-4"
            >
              <motion.div variants={fadeInUp} className="mb-4">
                <Badge className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium border-primary/20">
                  <Target size={16} className="mr-2" />
                  {cmsContent.missionVision.badge}
                </Badge>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
              {/* Mission */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 h-full">
                  <CardContent className="p-2 md:p-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-4">
                      <Target className="text-primary" size={24} weight="fill" />
                    </div>
                    <h3 className="font-heading font-black text-2xl md:text-3xl mb-4">
                      {cmsContent.missionVision.missionTitle}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {cmsContent.missionVision.missionDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-accent/5 to-primary/5 h-full">
                  <CardContent className="p-2 md:p-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl mb-4">
                      <Sparkle className="text-primary" size={24} weight="fill" />
                    </div>
                    <h3 className="font-heading font-black text-2xl md:text-3xl mb-4">
                      {cmsContent.missionVision.visionTitle}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {cmsContent.missionVision.visionDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Core Values */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
            >
              {cmsContent.missionVision.coreValues.map((value, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 h-full text-center group hover:-translate-y-1">
                    <CardContent className="p-2">
                      <div className="mb-3 inline-block p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {getIconComponent(value.icon, 24, 'text-primary')}
                      </div>
                      <h4 className="font-heading font-bold text-lg mb-2">{value.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>



        {/* Final CTA Section */}
        <section className="relative overflow-hidden py-12 md:py-16">
          {/* Background Image */}
          {cmsContent.ctaSection.backgroundImage && (
            <div className="absolute inset-0">
              <img
                src={cmsContent.ctaSection.backgroundImage}
                alt=""
                className="w-full h-full object-cover opacity-20"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-primary/90"></div>
            </div>
          )}

          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center text-white"
            >
              <motion.div variants={scaleIn} className="mb-6">
                <HandHeart className="mx-auto text-white/90" size={48} weight="fill" />
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="font-heading font-black text-3xl md:text-4xl lg:text-5xl mb-4 drop-shadow-lg"
              >
                {cmsContent.ctaSection.title}
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md max-w-2xl mx-auto"
              >
                {cmsContent.ctaSection.description}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                {cmsContent.ctaSection.buttons.map((button, index) => (
                  <Button
                    key={index}
                    size="lg"
                    className={`px-8 py-3 text-base font-semibold ${
                      button.variant === 'primary'
                        ? 'bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl'
                        : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-2 border-white/30 shadow-lg'
                    } transition-all duration-300 hover:scale-105`}
                    onClick={() => window.location.href = button.link}
                  >
                    {button.text}
                  </Button>
                ))}
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xs md:text-sm text-white/70 mt-6 drop-shadow-sm"
              >
                All contributions directly support our educational programs and community service initiatives
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
