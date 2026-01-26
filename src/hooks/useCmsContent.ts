'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type PageRow, type PageSectionRow } from '../lib/supabase'
import { toast } from 'sonner'

// Import CMS types
import type {
  HomePageContent,
  AboutPageContent,
  WhyChooseContent,
  BooksPageContent,
  ContactPageContent,
  CharityPageContent,
  DakshinaPageContent,
  HeaderContent,
  FooterContent
} from '../components/admin/types/cms-types'

// Import defaults for fallback
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultWhyChooseContent,
  defaultBooksContent,
  defaultContactContent,
  defaultCharityContent,
  defaultDakshinaContent,
  defaultHeaderContent,
  defaultFooterContent
} from '../components/admin/defaults/cms-defaults'

// Query keys
const CMS_PAGES_KEY = ['cms_pages']
const CMS_SECTIONS_KEY = ['cms_sections']

// Page slug mapping
export type CmsPageSlug = 'home' | 'about' | 'why-choose-us' | 'books' | 'contact' | 'charity' | 'dakshina'

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Fetch a page by slug
 */
async function fetchPageBySlug(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching page:', error)
    throw error
  }

  return data
}

/**
 * Fetch all sections for a page
 */
async function fetchPageSections(pageId: string): Promise<PageSectionRow[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching page sections:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch page with all its sections by slug
 */
async function fetchPageWithSections(slug: string): Promise<{ page: PageRow; sections: PageSectionRow[] } | null> {
  const page = await fetchPageBySlug(slug)
  if (!page) return null

  const sections = await fetchPageSections(page.id)
  return { page, sections }
}

/**
 * Update a page section's content
 */
async function updatePageSection(
  pageId: string,
  sectionKey: string,
  content: Record<string, unknown>,
  sectionType?: string
): Promise<PageSectionRow> {
  // First try to update existing section
  const { data: existing } = await supabase
    .from('page_sections')
    .select('id, section_type')
    .eq('page_id', pageId)
    .eq('section_key', sectionKey)
    .single()

  if (existing) {
    // Update existing section
    const { data, error } = await supabase
      .from('page_sections')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating page section:', error)
      throw error
    }
    return data
  } else {
    // Insert new section
    const { data, error } = await supabase
      .from('page_sections')
      .insert({
        page_id: pageId,
        section_key: sectionKey,
        section_type: sectionType || sectionKey.replace('_', '-'),
        content,
        sort_order: 0,
        is_visible: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting page section:', error)
      throw error
    }
    return data
  }
}

/**
 * Batch update all sections for a page
 */
async function batchUpdatePageSections(
  pageId: string,
  sections: { sectionKey: string; content: Record<string, unknown>; sectionType?: string }[]
): Promise<PageSectionRow[]> {
  const results: PageSectionRow[] = []
  
  for (const section of sections) {
    const result = await updatePageSection(pageId, section.sectionKey, section.content, section.sectionType)
    results.push(result)
  }
  
  return results
}

// ============================================================================
// Content Type Mapping
// ============================================================================

/**
 * Convert database sections to HomePageContent
 */
function sectionsToHomeContent(sections: PageSectionRow[]): HomePageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  
  const heroSection = getSection('hero') as Record<string, unknown>
  const gallerySection = getSection('photo_gallery') as Record<string, unknown>
  const servicesSection = getSection('services_preview') as Record<string, unknown>
  const spacesSection = getSection('sacred_spaces') as Record<string, unknown>
  const featuresSection = getSection('feature_cards') as Record<string, unknown>
  const ctaSection = getSection('cta_section') as Record<string, unknown>
  
  return {
    hero: {
      title: (heroSection.title as string) || defaultHomeContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultHomeContent.hero.subtitle,
      description: (heroSection.description as string) || defaultHomeContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultHomeContent.hero.backgroundImages,
      profileImage: (heroSection.profileImage as string) || defaultHomeContent.hero.profileImage,
      statistics: (heroSection.statistics as typeof defaultHomeContent.hero.statistics) || defaultHomeContent.hero.statistics,
      ctaButtons: (heroSection.ctaButtons as typeof defaultHomeContent.hero.ctaButtons) || defaultHomeContent.hero.ctaButtons,
    },
    photoGallery: {
      badge: (gallerySection.badge as string) || defaultHomeContent.photoGallery.badge,
      title: (gallerySection.title as string) || defaultHomeContent.photoGallery.title,
      description: (gallerySection.description as string) || defaultHomeContent.photoGallery.description,
      images: (gallerySection.images as string[]) || defaultHomeContent.photoGallery.images,
    },
    services: {
      badge: (servicesSection.badge as string) || defaultHomeContent.services.badge,
      title: (servicesSection.title as string) || defaultHomeContent.services.title,
      description: (servicesSection.description as string) || defaultHomeContent.services.description,
      buttonText: (servicesSection.buttonText as string) || defaultHomeContent.services.buttonText,
    },
    sacredSpaces: {
      badge: (spacesSection.badge as string) || defaultHomeContent.sacredSpaces.badge,
      title: (spacesSection.title as string) || defaultHomeContent.sacredSpaces.title,
      description: (spacesSection.description as string) || defaultHomeContent.sacredSpaces.description,
      spaces: (spacesSection.spaces as typeof defaultHomeContent.sacredSpaces.spaces) || defaultHomeContent.sacredSpaces.spaces,
    },
    featureCards: (featuresSection.cards as typeof defaultHomeContent.featureCards) || defaultHomeContent.featureCards,
    ctaSection: {
      title: (ctaSection.title as string) || defaultHomeContent.ctaSection.title,
      description: (ctaSection.description as string) || defaultHomeContent.ctaSection.description,
      ctaButtons: (ctaSection.ctaButtons as typeof defaultHomeContent.ctaSection.ctaButtons) || defaultHomeContent.ctaSection.ctaButtons,
    },
  }
}

/**
 * Convert HomePageContent to database sections
 */
function homeContentToSections(content: HomePageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
        profileImage: content.hero.profileImage,
        statistics: content.hero.statistics,
        ctaButtons: content.hero.ctaButtons,
      }
    },
    {
      sectionKey: 'photo_gallery',
      content: {
        badge: content.photoGallery.badge,
        title: content.photoGallery.title,
        description: content.photoGallery.description,
        images: content.photoGallery.images,
      }
    },
    {
      sectionKey: 'services_preview',
      content: {
        badge: content.services.badge,
        title: content.services.title,
        description: content.services.description,
        buttonText: content.services.buttonText,
      }
    },
    {
      sectionKey: 'sacred_spaces',
      content: {
        badge: content.sacredSpaces.badge,
        title: content.sacredSpaces.title,
        description: content.sacredSpaces.description,
        spaces: content.sacredSpaces.spaces,
      }
    },
    {
      sectionKey: 'feature_cards',
      content: { cards: content.featureCards }
    },
    {
      sectionKey: 'cta_section',
      content: {
        title: content.ctaSection.title,
        description: content.ctaSection.description,
        ctaButtons: content.ctaSection.ctaButtons,
      }
    }
  ]
}

/**
 * Convert database sections to AboutPageContent
 */
function sectionsToAboutContent(sections: PageSectionRow[]): AboutPageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  
  const heroSection = getSection('hero') as Record<string, unknown>
  const profileSection = getSection('profile') as Record<string, unknown>
  const journeySection = getSection('spiritual_journey') as Record<string, unknown>
  const expertiseSection = getSection('expertise_areas') as Record<string, unknown>
  const cardsSection = getSection('info_cards') as Record<string, unknown>
  const gallerySection = getSection('photo_gallery') as Record<string, unknown>
  const expectSection = getSection('what_to_expect') as Record<string, unknown>
  const serviceSection = getSection('community_service') as Record<string, unknown>
  
  const cards = (cardsSection.cards as Array<{ title: string; description: string; badge: string }>) || []
  
  return {
    hero: {
      title: (heroSection.title as string) || defaultAboutContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultAboutContent.hero.subtitle,
      description: (heroSection.description as string) || defaultAboutContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultAboutContent.hero.backgroundImages,
    },
    profileImage: (profileSection.profileImage as string) || defaultAboutContent.profileImage,
    badge: (profileSection.badge as string) || defaultAboutContent.badge,
    name: (profileSection.name as string) || defaultAboutContent.name,
    title: (profileSection.title as string) || defaultAboutContent.title,
    shortBio: (profileSection.shortBio as string) || defaultAboutContent.shortBio,
    statistics: (profileSection.statistics as typeof defaultAboutContent.statistics) || defaultAboutContent.statistics,
    ctaButtons: (profileSection.ctaButtons as typeof defaultAboutContent.ctaButtons) || defaultAboutContent.ctaButtons,
    spiritualJourney: {
      title: (journeySection.title as string) || defaultAboutContent.spiritualJourney.title,
      content: (journeySection.content as string) || defaultAboutContent.spiritualJourney.content,
      meditationPrograms: (journeySection.meditationPrograms as string[]) || defaultAboutContent.spiritualJourney.meditationPrograms,
      literaryContributions: (journeySection.literaryContributions as typeof defaultAboutContent.spiritualJourney.literaryContributions) || defaultAboutContent.spiritualJourney.literaryContributions,
      poetrySection: (journeySection.poetrySection as typeof defaultAboutContent.spiritualJourney.poetrySection) || defaultAboutContent.spiritualJourney.poetrySection,
    },
    expertiseAreas: (expertiseSection.areas as string[]) || defaultAboutContent.expertiseAreas,
    academicCard: cards[0] || defaultAboutContent.academicCard,
    industrialistCard: cards[1] || defaultAboutContent.industrialistCard,
    gurukulCard: cards[2] || defaultAboutContent.gurukulCard,
    photoGallery: {
      badge: (gallerySection.badge as string) || defaultAboutContent.photoGallery.badge,
      title: (gallerySection.title as string) || defaultAboutContent.photoGallery.title,
      description: (gallerySection.description as string) || defaultAboutContent.photoGallery.description,
      images: (gallerySection.images as typeof defaultAboutContent.photoGallery.images) || defaultAboutContent.photoGallery.images,
    },
    whatToExpect: {
      badge: (expectSection.badge as string) || defaultAboutContent.whatToExpect.badge,
      title: (expectSection.title as string) || defaultAboutContent.whatToExpect.title,
      description: (expectSection.description as string) || defaultAboutContent.whatToExpect.description,
      features: (expectSection.features as typeof defaultAboutContent.whatToExpect.features) || defaultAboutContent.whatToExpect.features,
    },
    communityService: {
      badge: (serviceSection.badge as string) || defaultAboutContent.communityService.badge,
      title: (serviceSection.title as string) || defaultAboutContent.communityService.title,
      services: (serviceSection.services as typeof defaultAboutContent.communityService.services) || defaultAboutContent.communityService.services,
    },
  }
}

/**
 * Convert AboutPageContent to database sections
 */
function aboutContentToSections(content: AboutPageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
      }
    },
    {
      sectionKey: 'profile',
      content: {
        profileImage: content.profileImage,
        badge: content.badge,
        name: content.name,
        title: content.title,
        shortBio: content.shortBio,
        statistics: content.statistics,
        ctaButtons: content.ctaButtons,
      }
    },
    {
      sectionKey: 'spiritual_journey',
      content: {
        title: content.spiritualJourney.title,
        content: content.spiritualJourney.content,
        meditationPrograms: content.spiritualJourney.meditationPrograms,
        literaryContributions: content.spiritualJourney.literaryContributions,
        poetrySection: content.spiritualJourney.poetrySection,
      }
    },
    {
      sectionKey: 'expertise_areas',
      content: { areas: content.expertiseAreas }
    },
    {
      sectionKey: 'info_cards',
      content: {
        cards: [content.academicCard, content.industrialistCard, content.gurukulCard]
      }
    },
    {
      sectionKey: 'photo_gallery',
      content: {
        badge: content.photoGallery.badge,
        title: content.photoGallery.title,
        description: content.photoGallery.description,
        images: content.photoGallery.images,
      }
    },
    {
      sectionKey: 'what_to_expect',
      content: {
        badge: content.whatToExpect.badge,
        title: content.whatToExpect.title,
        description: content.whatToExpect.description,
        features: content.whatToExpect.features,
      }
    },
    {
      sectionKey: 'community_service',
      content: {
        badge: content.communityService.badge,
        title: content.communityService.title,
        services: content.communityService.services,
      }
    }
  ]
}

/**
 * Convert database sections to WhyChooseContent
 */
function sectionsToWhyChooseContent(sections: PageSectionRow[]): WhyChooseContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  
  const heroSection = getSection('hero') as Record<string, unknown>
  const benefitsSection = getSection('quick_benefits') as Record<string, unknown>
  const reasonsSection = getSection('reasons') as Record<string, unknown>
  const ctaSection = getSection('cta_section') as Record<string, unknown>
  
  return {
    hero: {
      title: (heroSection.title as string) || defaultWhyChooseContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultWhyChooseContent.hero.subtitle,
      description: (heroSection.description as string) || defaultWhyChooseContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultWhyChooseContent.hero.backgroundImages,
    },
    quickBenefits: (benefitsSection.benefits as typeof defaultWhyChooseContent.quickBenefits) || defaultWhyChooseContent.quickBenefits,
    reasons: (reasonsSection.reasons as typeof defaultWhyChooseContent.reasons) || defaultWhyChooseContent.reasons,
    ctaSection: {
      title: (ctaSection.title as string) || defaultWhyChooseContent.ctaSection.title,
      description: (ctaSection.description as string) || defaultWhyChooseContent.ctaSection.description,
      buttons: (ctaSection.buttons as typeof defaultWhyChooseContent.ctaSection.buttons) || defaultWhyChooseContent.ctaSection.buttons,
    },
  }
}

/**
 * Convert WhyChooseContent to database sections
 */
function whyChooseContentToSections(content: WhyChooseContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
      }
    },
    {
      sectionKey: 'quick_benefits',
      content: { benefits: content.quickBenefits }
    },
    {
      sectionKey: 'reasons',
      content: { reasons: content.reasons }
    },
    {
      sectionKey: 'cta_section',
      content: {
        title: content.ctaSection.title,
        description: content.ctaSection.description,
        buttons: content.ctaSection.buttons,
      }
    }
  ]
}

/**
 * Convert database sections to BooksPageContent
 */
function sectionsToBooksContent(sections: PageSectionRow[]): BooksPageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  const heroSection = getSection('hero') as Record<string, unknown>
  const statsSection = getSection('stats') as Record<string, unknown>
  const ctaSection = getSection('cta') as Record<string, unknown>
  
  return {
    hero: {
      title: (heroSection.title as string) || defaultBooksContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultBooksContent.hero.subtitle,
      description: (heroSection.description as string) || defaultBooksContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultBooksContent.hero.backgroundImages,
    },
    stats: (statsSection.items as any[]) || defaultBooksContent.stats,
    cta: {
      title: (ctaSection.title as string) || defaultBooksContent.cta.title,
      description: (ctaSection.description as string) || defaultBooksContent.cta.description,
      buttonText: (ctaSection.buttonText as string) || defaultBooksContent.cta.buttonText,
      buttonLink: (ctaSection.buttonLink as string) || defaultBooksContent.cta.buttonLink,
    }
  }
}

/**
 * Convert BooksPageContent to database sections
 */
function booksContentToSections(content: BooksPageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
      }
    },
    {
      sectionKey: 'stats',
      content: {
        items: content.stats
      }
    },
    {
      sectionKey: 'cta',
      content: {
        title: content.cta.title,
        description: content.cta.description,
        buttonText: content.cta.buttonText,
        buttonLink: content.cta.buttonLink
      }
    }
  ]
}

/**
 * Convert database sections to ContactPageContent
 */
function sectionsToContactContent(sections: PageSectionRow[]): ContactPageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  
  const heroSection = getSection('hero') as Record<string, unknown>
  const contactSection = getSection('contact_info') as Record<string, unknown>
  const contactCardSection = getSection('contact_info_card') as Record<string, unknown>
  const responseSection = getSection('response_guarantee') as Record<string, unknown>
  const faqSection = getSection('faq_section') as Record<string, unknown>
  const formSection = getSection('form_labels') as Record<string, unknown>
  
  return {
    hero: {
      title: (heroSection.title as string) || defaultContactContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultContactContent.hero.subtitle,
      description: (heroSection.description as string) || defaultContactContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultContactContent.hero.backgroundImages,
      badge: (heroSection.badge as string) || defaultContactContent.hero.badge,
      quickActions: (heroSection.quickActions as Array<{ text: string; link: string; icon?: string }>) || defaultContactContent.hero.quickActions,
      trustIndicators: (heroSection.trustIndicators as Array<{ title: string; description: string }>) || defaultContactContent.hero.trustIndicators,
    },
    email: (contactSection.email as string) || defaultContactContent.email,
    phone: (contactSection.phone as string) || defaultContactContent.phone,
    whatsapp: (contactSection.whatsapp as string) || defaultContactContent.whatsapp,
    address: (contactSection.address as string) || defaultContactContent.address,
    contactInfoCard: {
      emailLabel: (contactCardSection.emailLabel as string) || defaultContactContent.contactInfoCard.emailLabel,
      emailBadge: (contactCardSection.emailBadge as string) || defaultContactContent.contactInfoCard.emailBadge,
      whatsappLabel: (contactCardSection.whatsappLabel as string) || defaultContactContent.contactInfoCard.whatsappLabel,
      whatsappText: (contactCardSection.whatsappText as string) || defaultContactContent.contactInfoCard.whatsappText,
      serviceAreaLabel: (contactCardSection.serviceAreaLabel as string) || defaultContactContent.contactInfoCard.serviceAreaLabel,
      serviceAreaText: (contactCardSection.serviceAreaText as string) || defaultContactContent.contactInfoCard.serviceAreaText,
      serviceAreaBadge: (contactCardSection.serviceAreaBadge as string) || defaultContactContent.contactInfoCard.serviceAreaBadge,
    },
    responseGuarantee: {
      title: (responseSection.title as string) || defaultContactContent.responseGuarantee.title,
      description: (responseSection.description as string) || defaultContactContent.responseGuarantee.description,
      badges: (responseSection.badges as string[]) || defaultContactContent.responseGuarantee.badges,
    },
    faqSection: {
      badge: (faqSection.badge as string) || defaultContactContent.faqSection.badge,
      title: (faqSection.title as string) || defaultContactContent.faqSection.title,
      faqs: (faqSection.faqs as Array<{ id: string; question: string; answer: string }>) || defaultContactContent.faqSection.faqs,
    },
    form: {
      nameLabel: (formSection.nameLabel as string) || defaultContactContent.form.nameLabel,
      emailLabel: (formSection.emailLabel as string) || defaultContactContent.form.emailLabel,
      phoneLabel: (formSection.phoneLabel as string) || defaultContactContent.form.phoneLabel,
      phoneOptional: (formSection.phoneOptional as string) || defaultContactContent.form.phoneOptional,
      serviceLabel: (formSection.serviceLabel as string) || defaultContactContent.form.serviceLabel,
      servicePlaceholder: (formSection.servicePlaceholder as string) || defaultContactContent.form.servicePlaceholder,
      messageLabel: (formSection.messageLabel as string) || defaultContactContent.form.messageLabel,
      messagePlaceholder: (formSection.messagePlaceholder as string) || defaultContactContent.form.messagePlaceholder,
      submitButtonText: (formSection.submitButtonText as string) || defaultContactContent.form.submitButtonText,
      responseText: (formSection.responseText as string) || defaultContactContent.form.responseText,
    },
  }
}

/**
 * Convert ContactPageContent to database sections
 */
function contactContentToSections(content: ContactPageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
        badge: content.hero.badge,
        quickActions: content.hero.quickActions,
        trustIndicators: content.hero.trustIndicators,
      }
    },
    {
      sectionKey: 'contact_info',
      content: {
        email: content.email,
        phone: content.phone,
        whatsapp: content.whatsapp,
        address: content.address,
      }
    },
    {
      sectionKey: 'contact_info_card',
      content: {
        emailLabel: content.contactInfoCard.emailLabel,
        emailBadge: content.contactInfoCard.emailBadge,
        whatsappLabel: content.contactInfoCard.whatsappLabel,
        whatsappText: content.contactInfoCard.whatsappText,
        serviceAreaLabel: content.contactInfoCard.serviceAreaLabel,
        serviceAreaText: content.contactInfoCard.serviceAreaText,
        serviceAreaBadge: content.contactInfoCard.serviceAreaBadge,
      }
    },
    {
      sectionKey: 'response_guarantee',
      content: {
        title: content.responseGuarantee.title,
        description: content.responseGuarantee.description,
        badges: content.responseGuarantee.badges,
      }
    },
    {
      sectionKey: 'faq_section',
      content: {
        badge: content.faqSection.badge,
        title: content.faqSection.title,
        faqs: content.faqSection.faqs,
      }
    },
    {
      sectionKey: 'form_labels',
      content: {
        nameLabel: content.form.nameLabel,
        emailLabel: content.form.emailLabel,
        phoneLabel: content.form.phoneLabel,
        phoneOptional: content.form.phoneOptional,
        serviceLabel: content.form.serviceLabel,
        servicePlaceholder: content.form.servicePlaceholder,
        messageLabel: content.form.messageLabel,
        messagePlaceholder: content.form.messagePlaceholder,
        submitButtonText: content.form.submitButtonText,
        responseText: content.form.responseText,
      }
    }
  ]
}

/**
 * Convert database sections to CharityPageContent
 */
function sectionsToCharityContent(sections: PageSectionRow[]): CharityPageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}

  const heroSection = getSection('hero') as Record<string, unknown>
  const impactSection = getSection('impact_section') as Record<string, unknown>
  const projectsSection = getSection('featured_projects') as Record<string, unknown>
  const areasSection = getSection('service_areas') as Record<string, unknown>
  const storiesSection = getSection('impact_stories') as Record<string, unknown>
  const missionVisionSection = getSection('mission_vision') as Record<string, unknown>
  const contributeSection = getSection('ways_to_contribute') as Record<string, unknown>
  const ctaSection = getSection('cta_section') as Record<string, unknown>

  return {
    hero: {
      badge: (heroSection.badge as string) || defaultCharityContent.hero.badge,
      title: (heroSection.title as string) || defaultCharityContent.hero.title,
      subtitle: (heroSection.subtitle as string) || defaultCharityContent.hero.subtitle,
      description: (heroSection.description as string) || defaultCharityContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultCharityContent.hero.backgroundImages,
      logoImage: (heroSection.logoImage as string) || defaultCharityContent.hero.logoImage,
      statistics: (heroSection.statistics as typeof defaultCharityContent.hero.statistics) || defaultCharityContent.hero.statistics,
      ctaButtons: (heroSection.ctaButtons as typeof defaultCharityContent.hero.ctaButtons) || defaultCharityContent.hero.ctaButtons,
    },
    impactSection: {
      badge: (impactSection.badge as string) || defaultCharityContent.impactSection.badge,
      title: (impactSection.title as string) || defaultCharityContent.impactSection.title,
      description: (impactSection.description as string) || defaultCharityContent.impactSection.description,
      statistics: (impactSection.statistics as typeof defaultCharityContent.impactSection.statistics) || defaultCharityContent.impactSection.statistics,
    },
    featuredProjects: {
      badge: (projectsSection.badge as string) || defaultCharityContent.featuredProjects.badge,
      title: (projectsSection.title as string) || defaultCharityContent.featuredProjects.title,
      description: (projectsSection.description as string) || defaultCharityContent.featuredProjects.description,
      videoUrl: (projectsSection.videoUrl as string) || defaultCharityContent.featuredProjects.videoUrl,
      stats: (projectsSection.stats as typeof defaultCharityContent.featuredProjects.stats) || defaultCharityContent.featuredProjects.stats,
    },
    serviceAreas: {
      badge: (areasSection.badge as string) || defaultCharityContent.serviceAreas.badge,
      title: (areasSection.title as string) || defaultCharityContent.serviceAreas.title,
      description: (areasSection.description as string) || defaultCharityContent.serviceAreas.description,
      areas: (areasSection.areas as typeof defaultCharityContent.serviceAreas.areas) || defaultCharityContent.serviceAreas.areas,
    },
    impactStories: {
      badge: (storiesSection.badge as string) || defaultCharityContent.impactStories.badge,
      title: (storiesSection.title as string) || defaultCharityContent.impactStories.title,
      description: (storiesSection.description as string) || defaultCharityContent.impactStories.description,
      stories: (storiesSection.stories as typeof defaultCharityContent.impactStories.stories) || defaultCharityContent.impactStories.stories,
    },
    missionVision: {
      badge: (missionVisionSection.badge as string) || defaultCharityContent.missionVision.badge,
      missionTitle: (missionVisionSection.missionTitle as string) || defaultCharityContent.missionVision.missionTitle,
      missionDescription: (missionVisionSection.missionDescription as string) || defaultCharityContent.missionVision.missionDescription,
      visionTitle: (missionVisionSection.visionTitle as string) || defaultCharityContent.missionVision.visionTitle,
      visionDescription: (missionVisionSection.visionDescription as string) || defaultCharityContent.missionVision.visionDescription,
      coreValues: (missionVisionSection.coreValues as typeof defaultCharityContent.missionVision.coreValues) || defaultCharityContent.missionVision.coreValues,
    },
    waysToContribute: {
      badge: (contributeSection.badge as string) || defaultCharityContent.waysToContribute.badge,
      title: (contributeSection.title as string) || defaultCharityContent.waysToContribute.title,
      description: (contributeSection.description as string) || defaultCharityContent.waysToContribute.description,
      options: (contributeSection.options as typeof defaultCharityContent.waysToContribute.options) || defaultCharityContent.waysToContribute.options,
    },
    ctaSection: {
      title: (ctaSection.title as string) || defaultCharityContent.ctaSection.title,
      description: (ctaSection.description as string) || defaultCharityContent.ctaSection.description,
      buttons: (ctaSection.buttons as typeof defaultCharityContent.ctaSection.buttons) || defaultCharityContent.ctaSection.buttons,
      backgroundImage: (ctaSection.backgroundImage as string) || defaultCharityContent.ctaSection.backgroundImage,
    },
  }
}

/**
 * Convert CharityPageContent to database sections
 */
function charityContentToSections(content: CharityPageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        badge: content.hero.badge,
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
        logoImage: content.hero.logoImage,
        statistics: content.hero.statistics,
        ctaButtons: content.hero.ctaButtons,
      }
    },
    {
      sectionKey: 'impact_section',
      content: {
        badge: content.impactSection.badge,
        title: content.impactSection.title,
        description: content.impactSection.description,
        statistics: content.impactSection.statistics,
      }
    },
    {
      sectionKey: 'featured_projects',
      content: {
        badge: content.featuredProjects.badge,
        title: content.featuredProjects.title,
        description: content.featuredProjects.description,
        videoUrl: content.featuredProjects.videoUrl,
        stats: content.featuredProjects.stats,
      }
    },
    {
      sectionKey: 'service_areas',
      content: {
        badge: content.serviceAreas.badge,
        title: content.serviceAreas.title,
        description: content.serviceAreas.description,
        areas: content.serviceAreas.areas,
      }
    },
    {
      sectionKey: 'impact_stories',
      content: {
        badge: content.impactStories.badge,
        title: content.impactStories.title,
        description: content.impactStories.description,
        stories: content.impactStories.stories,
      }
    },
    {
      sectionKey: 'mission_vision',
      content: {
        badge: content.missionVision.badge,
        missionTitle: content.missionVision.missionTitle,
        missionDescription: content.missionVision.missionDescription,
        visionTitle: content.missionVision.visionTitle,
        visionDescription: content.missionVision.visionDescription,
        coreValues: content.missionVision.coreValues,
      }
    },
    {
      sectionKey: 'ways_to_contribute',
      content: {
        badge: content.waysToContribute.badge,
        title: content.waysToContribute.title,
        description: content.waysToContribute.description,
        options: content.waysToContribute.options,
      }
    },
    {
      sectionKey: 'cta_section',
      content: {
        title: content.ctaSection.title,
        description: content.ctaSection.description,
        buttons: content.ctaSection.buttons,
        backgroundImage: content.ctaSection.backgroundImage,
      }
    }
  ]
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Generic hook for CMS page content
 */
export function useCmsContent<T>(
  pageSlug: CmsPageSlug,
  sectionsToContent: (sections: PageSectionRow[]) => T,
  contentToSections: (content: T) => { sectionKey: string; content: Record<string, unknown> }[],
  defaultContent: T
) {
  const queryClient = useQueryClient()
  const queryKey = [...CMS_SECTIONS_KEY, pageSlug]

  // Fetch page and sections
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await fetchPageWithSections(pageSlug)
      if (!result) return { pageId: null, content: defaultContent }
      
      const content = sectionsToContent(result.sections)
      return { pageId: result.page.id, content }
    },
    staleTime: 5 * 60 * 1000,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (content: T) => {
      const pageId = query.data?.pageId
      if (!pageId) throw new Error('Page not found in database')
      
      const sections = contentToSections(content)
      return batchUpdatePageSections(pageId, sections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success('Content saved successfully')
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`)
    }
  })

  return {
    content: query.data?.content || defaultContent,
    pageId: query.data?.pageId,
    isLoading: query.isLoading,
    error: query.error,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    refetch: query.refetch,
  }
}

/**
 * Hook for Home page content
 */
export function useHomeContent() {
  return useCmsContent(
    'home',
    sectionsToHomeContent,
    homeContentToSections,
    defaultHomeContent
  )
}

/**
 * Hook for About page content
 */
export function useAboutContent() {
  return useCmsContent(
    'about',
    sectionsToAboutContent,
    aboutContentToSections,
    defaultAboutContent
  )
}

/**
 * Hook for Why Choose Us page content
 */
export function useWhyChooseContent() {
  return useCmsContent(
    'why-choose-us',
    sectionsToWhyChooseContent,
    whyChooseContentToSections,
    defaultWhyChooseContent
  )
}

/**
 * Hook for Books page content
 */
export function useBooksPageContent() {
  return useCmsContent(
    'books',
    sectionsToBooksContent,
    booksContentToSections,
    defaultBooksContent
  )
}

/**
 * Hook for Contact page content
 */
export function useContactContent() {
  return useCmsContent(
    'contact',
    sectionsToContactContent,
    contactContentToSections,
    defaultContactContent
  )
}

/**
 * Hook for Charity page content
 */
export function useCharityContent() {
  return useCmsContent(
    'charity',
    sectionsToCharityContent,
    charityContentToSections,
    defaultCharityContent
  )
}

/**
 * Convert database sections to DakshinaPageContent
 */
function sectionsToDakshinaContent(sections: PageSectionRow[]): DakshinaPageContent {
  const getSection = (key: string) => sections.find(s => s.section_key === key)?.content || {}
  
  const heroSection = getSection('hero') as Record<string, unknown>
  const whatIsDakshinaSection = getSection('what_is_dakshina') as Record<string, unknown>
  const pricingSection = getSection('pricing_section') as Record<string, unknown>
  const ctaSection = getSection('cta_section') as Record<string, unknown>
  
  return {
    hero: {
      subtitle: (heroSection.subtitle as string) || defaultDakshinaContent.hero.subtitle,
      title: (heroSection.title as string) || defaultDakshinaContent.hero.title,
      description: (heroSection.description as string) || defaultDakshinaContent.hero.description,
      backgroundImages: (heroSection.backgroundImages as string[]) || defaultDakshinaContent.hero.backgroundImages,
    },
    whatIsDakshina: {
      title: (whatIsDakshinaSection.title as string) || defaultDakshinaContent.whatIsDakshina.title,
      subtitle: (whatIsDakshinaSection.subtitle as string) || defaultDakshinaContent.whatIsDakshina.subtitle,
      content: (whatIsDakshinaSection.content as string) || defaultDakshinaContent.whatIsDakshina.content,
      keyPoints: (whatIsDakshinaSection.keyPoints as typeof defaultDakshinaContent.whatIsDakshina.keyPoints) || defaultDakshinaContent.whatIsDakshina.keyPoints,
    },
    pricingSection: {
      badge: (pricingSection.badge as string) || defaultDakshinaContent.pricingSection.badge,
      title: (pricingSection.title as string) || defaultDakshinaContent.pricingSection.title,
      description: (pricingSection.description as string) || defaultDakshinaContent.pricingSection.description,
      services: ((pricingSection.services as any[]) || defaultDakshinaContent.pricingSection.services).map(service => ({
        name: service.name || '',
        description: service.description || '',
        duration: service.duration || '',
        price: service.price || service.suggested || '',
        priceNote: service.priceNote || ''
      })),
      notes: (pricingSection.notes as string[]) || defaultDakshinaContent.pricingSection.notes,
    },
    ctaSection: {
      title: (ctaSection.title as string) || defaultDakshinaContent.ctaSection.title,
      description: (ctaSection.description as string) || defaultDakshinaContent.ctaSection.description,
      primaryButtonText: (ctaSection.primaryButtonText as string) || defaultDakshinaContent.ctaSection.primaryButtonText,
      secondaryButtonText: (ctaSection.secondaryButtonText as string) || defaultDakshinaContent.ctaSection.secondaryButtonText,
    },
  }
}

/**
 * Convert DakshinaPageContent to database sections
 */
function dakshinaContentToSections(content: DakshinaPageContent): { sectionKey: string; content: Record<string, unknown> }[] {
  return [
    {
      sectionKey: 'hero',
      content: {
        subtitle: content.hero.subtitle,
        title: content.hero.title,
        description: content.hero.description,
        backgroundImages: content.hero.backgroundImages,
      }
    },
    {
      sectionKey: 'what_is_dakshina',
      content: {
        title: content.whatIsDakshina.title,
        subtitle: content.whatIsDakshina.subtitle,
        content: content.whatIsDakshina.content,
        keyPoints: content.whatIsDakshina.keyPoints,
      }
    },
    {
      sectionKey: 'pricing_section',
      content: {
        badge: content.pricingSection.badge,
        title: content.pricingSection.title,
        description: content.pricingSection.description,
        services: content.pricingSection.services,
        notes: content.pricingSection.notes,
      }
    },
    {
      sectionKey: 'cta_section',
      content: {
        title: content.ctaSection.title,
        description: content.ctaSection.description,
        primaryButtonText: content.ctaSection.primaryButtonText,
        secondaryButtonText: content.ctaSection.secondaryButtonText,
      }
    }
  ]
}

/**
 * Hook for Dakshina page content
 */
export function useDakshinaContent() {
  return useCmsContent(
    'dakshina',
    sectionsToDakshinaContent,
    dakshinaContentToSections,
    defaultDakshinaContent
  )
}

// ============================================================================
// Header/Footer Content (uses site_settings)
// ============================================================================

interface ExtendedSiteSettings {
  site_logo_url: string | null
  site_name: string | null
  site_tagline: string | null
  header_cta_text: string | null
  header_cta_link: string | null
  footer_text: string | null
  copyright_text: string | null
  facebook_page_url: string | null
  instagram_url: string | null
  youtube_channel_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  pinterest_url: string | null
}

/**
 * Fetch site settings for header/footer
 */
async function fetchSiteSettingsForCms(): Promise<ExtendedSiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('site_logo_url, site_name, site_tagline, header_cta_text, header_cta_link, footer_text, copyright_text, facebook_page_url, instagram_url, youtube_channel_url, linkedin_url, twitter_url, pinterest_url')
    .eq('singleton_guard', true)
    .maybeSingle()

  if (error) {
    // Silently return null if settings not found - will use default values
    return null
  }

  return data
}

/**
 * Update site settings for header
 */
async function updateHeaderSettings(settings: Partial<ExtendedSiteSettings>): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .update(settings)
    .eq('singleton_guard', true)

  if (error) {
    console.error('Error updating header settings:', error)
    throw error
  }
}

/**
 * Hook for Header content (from site_settings)
 */
export function useHeaderContent() {
  const queryClient = useQueryClient()
  const queryKey = ['cms_header_content']

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const settings = await fetchSiteSettingsForCms()
      if (!settings) return defaultHeaderContent
      
      return {
        logoUrl: settings.site_logo_url || defaultHeaderContent.logoUrl,
        siteName: settings.site_name || defaultHeaderContent.siteName,
        tagline: settings.site_tagline || defaultHeaderContent.tagline,
        ctaText: settings.header_cta_text || defaultHeaderContent.ctaText,
        ctaLink: settings.header_cta_link || defaultHeaderContent.ctaLink,
      } as HeaderContent
    },
    staleTime: 5 * 60 * 1000,
  })

  const saveMutation = useMutation({
    mutationFn: async (content: HeaderContent) => {
      await updateHeaderSettings({
        site_logo_url: content.logoUrl,
        site_name: content.siteName,
        site_tagline: content.tagline,
        header_cta_text: content.ctaText,
        header_cta_link: content.ctaLink,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success('Header settings saved')
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`)
    }
  })

  return {
    content: query.data || defaultHeaderContent,
    isLoading: query.isLoading,
    error: query.error,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    refetch: query.refetch,
  }
}

/**
 * Hook for Footer content (from site_settings)
 */
export function useFooterContent() {
  const queryClient = useQueryClient()
  const queryKey = ['cms_footer_content']

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const settings = await fetchSiteSettingsForCms()
      if (!settings) return defaultFooterContent
      
      return {
        description: settings.footer_text || defaultFooterContent.description,
        copyrightText: settings.copyright_text || defaultFooterContent.copyrightText,
        facebookUrl: settings.facebook_page_url || defaultFooterContent.facebookUrl,
        instagramUrl: settings.instagram_url || defaultFooterContent.instagramUrl,
        youtubeUrl: settings.youtube_channel_url || defaultFooterContent.youtubeUrl,
        linkedinUrl: settings.linkedin_url || defaultFooterContent.linkedinUrl,
        twitterUrl: settings.twitter_url || defaultFooterContent.twitterUrl,
        pinterestUrl: settings.pinterest_url || defaultFooterContent.pinterestUrl,
      } as FooterContent
    },
    staleTime: 5 * 60 * 1000,
  })

  const saveMutation = useMutation({
    mutationFn: async (content: FooterContent) => {
      await updateHeaderSettings({
        footer_text: content.description,
        copyright_text: content.copyrightText,
        facebook_page_url: content.facebookUrl,
        instagram_url: content.instagramUrl,
        youtube_channel_url: content.youtubeUrl,
        linkedin_url: content.linkedinUrl,
        twitter_url: content.twitterUrl,
        pinterest_url: content.pinterestUrl,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success('Footer settings saved')
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`)
    }
  })

  return {
    content: query.data || defaultFooterContent,
    isLoading: query.isLoading,
    error: query.error,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    refetch: query.refetch,
  }
}
