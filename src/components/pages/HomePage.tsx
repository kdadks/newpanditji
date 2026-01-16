'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppPage, AppNavigationData } from '../../lib/types'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { FlowerLotus, BookOpen, Heart, Users, Sparkle } from '@phosphor-icons/react'
import { services, categoryNames, Service } from '../../lib/data'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useServices } from '../../hooks/useServices'
import { useHomeContent } from '../../hooks/useCmsContent'
import { getOptimizedImageProps } from '../../utils/imageOptimization'

interface HomePageProps {
}

export default function HomePage({ }: HomePageProps) {
  const router = useRouter()

  const handleNavigate = (pageOrData: AppPage | AppNavigationData) => {
    if (typeof pageOrData === 'string') {
      router.push(pageOrData === 'home' ? '/' : `/${pageOrData}`)
    } else {
      // Handle AppNavigationData object
      const { page, blogSlug } = pageOrData
      if (page === 'blog-detail' && blogSlug) {
        router.push(`/blog/${blogSlug}`)
      } else {
        router.push(page === 'home' ? '/' : `/${page}`)
      }
    }
  }
  const { services: dbServices } = useServices()
  // Use database services if available, otherwise fall back to defaults
  const allServices = (dbServices && dbServices.length > 0) ? dbServices : services
  const featuredServices = allServices.slice(0, 12) // Get more services for the carousel
  
  // CMS Content from database
  const { content: cmsContent, isLoading: cmsLoading } = useHomeContent()
  
  // Service carousel pause state on hover
  const [isPaused, setIsPaused] = useState(false)

  // SEO Configuration - Fetched from database
  usePageMetadata('home')

  return (
    <div className="w-full">
      <section className="relative pt-4 md:pt-6 pb-2 md:pb-4 overflow-hidden">
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
            {/* Left side - Image */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-amber-300/30 to-orange-300/30 rounded-full blur-2xl scale-110"></div>
                <img
                  {...getOptimizedImageProps({
                    src: cmsContent.hero.profileImage || '/images/Logo/Raj ji.png',
                    alt: 'Pandit Rajesh Joshi',
                    priority: true,
                    className: 'relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer'
                  })}
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-2 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
                <FlowerLotus size={18} weight="fill" className="animate-pulse" />
                {cmsContent.hero.subtitle}
              </div>

              <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.15] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe max-w-[700px] mx-auto lg:mx-0">
                {cmsContent.hero.title.includes('Authentic') ? (
                  <>
                    {cmsContent.hero.title.split('Authentic')[0]}
                    <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Authentic</span>
                    {cmsContent.hero.title.split('Authentic')[1]}
                  </>
                ) : (
                  cmsContent.hero.title
                )}
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)] tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                {cmsContent.hero.description}
              </p>

              {/* Statistics - Compact inline version */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8 max-w-2xl mx-auto lg:mx-0">
                {cmsContent.hero.statistics.map((stat, index) => (
                  <span key={index} className="text-base md:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[110px] text-center lg:text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    <span className="font-extrabold text-transparent bg-linear-to-br from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">{stat.value}</span>{' '}
                    <span className="font-semibold text-white/95">{stat.label}</span>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {cmsContent.hero.ctaButtons.map((btn, index) => (
                  <Button
                    key={index}
                    size="lg"
                    onClick={() => handleNavigate(btn.link.replace('/', '') as AppPage || 'home')}
                    className={`text-base px-8 py-3 transition-all duration-300 hover:scale-105 font-semibold shadow-2xl ${
                      btn.variant === 'primary'
                        ? 'bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-amber-900/50 hover:shadow-3xl border-2 border-amber-700/30'
                        : 'bg-linear-to-r from-stone-700 via-amber-900 to-stone-900 text-white hover:from-stone-800 hover:via-amber-950 hover:to-black shadow-stone-900/50 hover:shadow-3xl border-2 border-stone-600/30'
                    }`}
                  >
                    {index === 0 && <Users className="mr-2" size={20} />}
                    {index === 1 && <Sparkle className="mr-2" size={20} weight="fill" />}
                    {index === 2 && <BookOpen className="mr-2" size={20} />}
                    {btn.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stunning Modern Photo Carousel Gallery */}
      <div className="relative w-full py-8 md:py-12 overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* Section Header */}
        <div className="container mx-auto px-4 max-w-7xl relative z-10 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500/10 to-orange-500/10 text-orange-700 dark:text-orange-300 px-6 py-2.5 rounded-full text-sm font-semibold mb-4 border border-amber-300/30 backdrop-blur-sm shadow-lg">
              <FlowerLotus size={18} weight="fill" className="animate-pulse" />
              {cmsContent.photoGallery.badge || 'Sacred Moments'}
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              {cmsContent.photoGallery.title || 'Captured Blessings'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {cmsContent.photoGallery.description || 'Witness the divine moments and sacred ceremonies we\'ve had the honor to conduct'}
            </p>
          </div>
        </div>

        {/* Straight Line Carousel - No 3D transforms on container */}
        <div
          className="relative z-20 overflow-x-auto md:overflow-hidden scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main carousel track */}
          <div
            className={`flex gap-6 md:gap-8 py-8 px-4 md:px-0 ${isPaused ? '' : 'md:animate-scroll-services'}`}
            style={{
              willChange: 'transform'
            }}
          >
            {/* First set of images */}
            {cmsContent.photoGallery.images.map((img, index) => (
              <div
                key={`gallery-1-${index}`}
                className="group relative shrink-0 w-72 md:w-96 h-64 md:h-80 cursor-pointer transition-all duration-500 hover:scale-105 hover:z-30"
              >
                {/* Glassmorphism card */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-amber-500/30 transition-shadow duration-500">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl p-[2px] bg-linear-to-br from-amber-400 via-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900"></div>
                  </div>

                  {/* Image with overlay */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={img}
                      alt="Sacred Ceremony"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Glassmorphism info panel */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-xl p-4 border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-2 text-white">
                          <FlowerLotus size={20} weight="fill" className="text-amber-300" />
                          <span className="font-semibold text-sm">Sacred Moment #{index + 1}</span>
                        </div>
                        <p className="text-white/90 text-xs mt-2 line-clamp-2">
                          A blessed ceremony filled with devotion and spiritual energy
                        </p>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>

                {/* 3D depth shadow */}
                <div className="absolute -inset-4 bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {cmsContent.photoGallery.images.map((img, index) => (
              <div
                key={`gallery-2-${index}`}
                className="group relative shrink-0 w-72 md:w-96 h-64 md:h-80 cursor-pointer transition-all duration-500 hover:scale-105 hover:z-30"
                aria-hidden="true"
              >
                {/* Glassmorphism card */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-amber-500/30 transition-shadow duration-500">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl p-[2px] bg-linear-to-br from-amber-400 via-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900"></div>
                  </div>

                  {/* Image with overlay */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Glassmorphism info panel */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-xl p-4 border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-2 text-white">
                          <FlowerLotus size={20} weight="fill" className="text-amber-300" />
                          <span className="font-semibold text-sm">Sacred Moment #{index + 1}</span>
                        </div>
                        <p className="text-white/90 text-xs mt-2 line-clamp-2">
                          A blessed ceremony filled with devotion and spiritual energy
                        </p>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>

                {/* 3D depth shadow */}
                <div className="absolute -inset-4 bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none"></div>
      </div>

      {/* Our Sacred Services - Premium Redesign */}
      <section className="relative pt-6 md:pt-8 pb-8 md:pb-12 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50/50 to-pink-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-pink-950/30"></div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-linear-to-br from-orange-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-linear-to-br from-pink-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-[25%] w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Premium Section Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 text-orange-700 dark:text-orange-300 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-orange-300/30 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Sparkle size={20} weight="fill" className="animate-pulse relative z-10" />
              <span className="relative z-10">{cmsContent.services.badge}</span>
            </div>

            <h2 className="font-heading font-black text-4xl md:text-6xl mb-6 bg-linear-to-r from-amber-700 via-orange-600 to-pink-600 dark:from-amber-400 dark:via-orange-300 dark:to-pink-400 bg-clip-text text-transparent leading-tight animate-breathe">
              {cmsContent.services.title}
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {cmsContent.services.description}
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-20 bg-linear-to-r from-transparent via-amber-500 to-transparent"></div>
              <FlowerLotus size={16} weight="fill" className="text-orange-500" />
              <div className="h-px w-20 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Premium 3D-style Carousel */}
        <div
          className="relative w-full overflow-x-auto md:overflow-hidden scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className={`flex gap-6 py-8 px-4 md:px-0 ${isPaused ? '' : 'md:animate-scroll-services'}`}>
            {/* First set of cards */}
            {featuredServices.map((service, index) => (
              <Card
                key={`${service.id}-1`}
                onClick={() => handleNavigate({ page: 'services', category: service.category })}
                className="group relative shrink-0 w-80 overflow-hidden border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer"
              >
                {/* Gradient border animation */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-amber-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-amber-500/40 group-hover:via-orange-500/40 group-hover:to-pink-500/40 transition-all duration-700 p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl"></div>
                </div>

                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                <CardContent className="relative p-0 flex flex-col">
                  {/* Service Image */}
                  <div className="relative h-40 overflow-hidden bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950">
                    <img
                      src={`/images/Pooja ${(index % 3) + 1}.jpg`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 3 ? 'high' : 'auto'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/Traditional Altar with Marigold Flowers.png';
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Category badge on image */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        {categoryNames[service.category]}
                      </span>
                    </div>

                    {/* Number badge on image */}
                    <div className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-amber-500/90 to-orange-500/90 backdrop-blur-sm shadow-lg">
                      <span className="text-base font-black text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col grow">
                    {/* Service Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/10 via-orange-500/10 to-pink-500/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md -mt-9 relative z-10 border-2 border-white dark:border-slate-900">
                      <FlowerLotus size={24} weight="fill" className="text-orange-600 dark:text-orange-400" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:bg-linear-to-r group-hover:from-amber-600 group-hover:to-orange-600 dark:group-hover:from-amber-400 dark:group-hover:to-orange-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 grow line-clamp-2">
                      {service.description}
                    </p>

                    {/* Footer with duration and CTA */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Sparkle size={14} weight="fill" className="text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {service.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                          <span>Explore</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                </CardContent>

                {/* 3D glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-amber-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-amber-500/30 group-hover:via-orange-500/30 group-hover:to-pink-500/30 rounded-xl blur-2xl -z-10 transition-all duration-700"></div>
              </Card>
            ))}

            {/* Duplicate set for seamless loop */}
            {featuredServices.map((service, index) => (
              <Card
                key={`${service.id}-2`}
                onClick={() => handleNavigate({ page: 'services', category: service.category })}
                className="group relative shrink-0 w-80 overflow-hidden border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer"
                aria-hidden="true"
              >
                {/* Gradient border animation */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-amber-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-amber-500/40 group-hover:via-orange-500/40 group-hover:to-pink-500/40 transition-all duration-700 p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl"></div>
                </div>

                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                <CardContent className="relative p-0 flex flex-col">
                  {/* Service Image */}
                  <div className="relative h-40 overflow-hidden bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950">
                    <img
                      src={`/images/Pooja ${(index % 3) + 1}.jpg`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 3 ? 'high' : 'auto'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/Traditional Altar with Marigold Flowers.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        {categoryNames[service.category]}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-amber-500/90 to-orange-500/90 backdrop-blur-sm shadow-lg">
                      <span className="text-base font-black text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/10 via-orange-500/10 to-pink-500/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md -mt-9 relative z-10 border-2 border-white dark:border-slate-900">
                      <FlowerLotus size={24} weight="fill" className="text-orange-600 dark:text-orange-400" />
                    </div>

                    <h3 className="font-heading font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:bg-linear-to-r group-hover:from-amber-600 group-hover:to-orange-600 dark:group-hover:from-amber-400 dark:group-hover:to-orange-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight">
                      {service.name}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 grow line-clamp-2">
                      {service.description}
                    </p>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Sparkle size={14} weight="fill" className="text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {service.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                          <span>Explore</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                </CardContent>

                <div className="absolute -inset-1 bg-linear-to-r from-amber-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-amber-500/30 group-hover:via-orange-500/30 group-hover:to-pink-500/30 rounded-xl blur-2xl -z-10 transition-all duration-700"></div>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium CTA Button */}
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mt-12">
            <Button
              onClick={() => handleNavigate('services')}
              size="lg"
              className="group relative px-10 py-6 bg-linear-to-r from-amber-600 via-orange-600 to-pink-600 hover:from-amber-700 hover:via-orange-700 hover:to-pink-700 text-white font-bold text-base rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-105 border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3">
                <BookOpen className="transition-transform duration-300 group-hover:rotate-12" size={24} weight="bold" />
                <span>{cmsContent.services.buttonText}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - Redesigned */}
      <section className="py-8 md:py-14 relative overflow-hidden bg-linear-to-br from-amber-50/30 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-linear-to-br from-amber-200/20 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-linear-to-br from-orange-200/20 to-pink-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500/10 to-orange-500/10 text-orange-700 dark:text-orange-300 px-6 py-2.5 rounded-full text-sm font-semibold mb-4 border border-amber-300/30 backdrop-blur-sm shadow-lg">
              <Sparkle size={18} weight="fill" className="animate-pulse" />
              Why Choose Us
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Your Trusted Spiritual Guide
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Experience authentic Hindu ceremonies with dedication, expertise, and compassion
            </p>
          </div>

          {/* Modern Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cmsContent.featureCards.map((card, index) => {
              // Icon mapping for feature cards
              const iconMap: Record<string, React.ReactNode> = {
                'BookOpen': <BookOpen className="text-amber-600 dark:text-amber-400" size={48} weight="duotone" />,
                'Heart': <Heart className="text-amber-600 dark:text-amber-400" size={48} weight="fill" />,
                'Users': <Users className="text-amber-600 dark:text-amber-400" size={48} weight="duotone" />
              }

              const gradients = [
                'from-amber-500/10 to-orange-500/10',
                'from-orange-500/10 to-pink-500/10',
                'from-pink-500/10 to-purple-500/10'
              ]

              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-linear-to-br ${gradients[index % 3]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <CardContent className="relative p-8 text-center">
                    {/* Icon with gradient background */}
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <div className="absolute inset-0 bg-linear-to-br from-amber-400/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      {(card.icon && iconMap[card.icon]) || <FlowerLotus className="text-amber-600 dark:text-amber-400" size={48} weight="fill" />}
                    </div>

                    {/* Card number badge */}
                    <div className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {card.title}
                    </h3>

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-0.5 w-8 bg-linear-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
                      <FlowerLotus size={12} weight="fill" className="text-amber-500" />
                      <div className="h-0.5 w-8 bg-linear-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {card.description}
                    </p>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>

                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-linear-to-r from-amber-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-amber-500/20 group-hover:via-orange-500/20 group-hover:to-pink-500/20 rounded-lg blur-xl -z-10 transition-all duration-500"></div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="font-heading font-semibold text-2xl md:text-3xl mb-4">{cmsContent.ctaSection.title}</h2>
          <p className="text-muted-foreground text-base mb-6 max-w-2xl mx-auto">
            {cmsContent.ctaSection.description}
          </p>
          <Button size="lg" onClick={() => handleNavigate('contact')} className="px-8 py-3 font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30">
            {cmsContent.ctaSection.ctaButtons[0]?.text || 'Get in Touch'}
          </Button>
        </div>
      </section>
    </div>
  )
}
