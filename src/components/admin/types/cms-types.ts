// CMS Content Type Definitions

export type PageKey = 'home' | 'about' | 'whyChoose' | 'books' | 'contact' | 'charity' | 'dakshina'
export type SectionKey = 'header' | 'footer' | 'menu'

// Base Interfaces
export interface HeroContent {
  title: string
  subtitle: string
  description: string
  backgroundImages: string[]
  logoImage?: string
  profileImage?: string
  ctaText?: string
  ctaLink?: string
}

export interface StatisticItem {
  label: string
  value: string
  subtext?: string
}

export interface CTAButton {
  text: string
  link: string
  icon?: string
  variant?: 'primary' | 'outline'
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface SacredSpaceCard {
  image: string
  title: string
  subtitle: string
}

export interface FeatureCard {
  title: string
  description: string
  icon?: string
}

export interface SidebarCard {
  title: string
  description: string
  badge: string
}

export interface CommunityServiceItem {
  title: string
  description: string
}

// Page Content Interfaces
export interface HomePageContent {
  hero: HeroContent & { statistics: StatisticItem[]; ctaButtons: CTAButton[] }
  photoGallery: {
    badge: string
    title: string
    description: string
    images: string[]
  }
  services: {
    badge: string
    title: string
    description: string
    buttonText: string
  }
  sacredSpaces: {
    badge: string
    title: string
    description: string
    spaces: {
      title: string
      image: string
      subtitle?: string
    }[]
  }
  featureCards: {
    title: string
    description: string
    icon?: string
  }[]
  ctaSection: {
    title: string
    description: string
    ctaButtons: CTAButton[]
  }
}

export interface AboutPageContent {
  hero: HeroContent
  profileImage: string
  badge: string
  name: string
  title: string
  shortBio: string
  statistics: StatisticItem[]
  ctaButtons: CTAButton[]
  spiritualJourney: {
    title: string
    content: string
    meditationPrograms: string[]
    literaryContributions: {
      title: string
      description: string
      books: string[]
    }
    poetrySection: {
      title: string
      description: string
    }
  }
  expertiseAreas: string[]
  academicCard: SidebarCard
  industrialistCard: SidebarCard
  gurukulCard: SidebarCard
  photoGallery: {
    badge: string
    title: string
    description: string
    images: { src: string; alt: string }[]
  }
  whatToExpect: {
    badge: string
    title: string
    description: string
    features: FeatureCard[]
  }
  communityService: {
    badge: string
    title: string
    services: CommunityServiceItem[]
  }
}

export interface WhyChooseReason {
  title: string
  description: string
  impact: string
  highlights: string[]
  shloka?: {
    sanskrit: string
    reference: string
    hindi: string
    english: string
  }
}

export interface WhyChooseContent {
  hero: HeroContent
  quickBenefits: { icon: string; label: string }[]
  reasons: WhyChooseReason[]
  ctaSection: {
    title: string
    description: string
    buttons: CTAButton[]
  }
}

export interface BooksPageContent {
  hero: HeroContent
}

export interface ContactPageContent {
  hero: HeroContent
  email: string
  phone: string
  whatsapp: string
  address: string
}

export interface CharityServiceArea {
  title: string
  description: string
  icon?: string
  stats?: string
}

export interface CharityMissionFeature {
  title: string
  description: string
  icon?: string
}

export interface CharityImpactStory {
  name: string
  role: string
  story: string
  image?: string
  location?: string
}

export interface CharityContributionOption {
  title: string
  description: string
  icon: string
  buttonText: string
  buttonLink: string
  features?: string[]
}

export interface CharityPageContent {
  hero: HeroContent & {
    badge?: string
    statistics: StatisticItem[]
    ctaButtons: CTAButton[]
  }
  impactSection: {
    badge: string
    title: string
    description: string
    statistics: StatisticItem[]
  }
  featuredProjects: {
    badge: string
    title: string
    description: string
    videoUrl?: string
    stats: StatisticItem[]
  }
  serviceAreas: {
    badge: string
    title: string
    description: string
    areas: CharityServiceArea[]
  }
  impactStories: {
    badge: string
    title: string
    description: string
    stories: CharityImpactStory[]
  }
  missionVision: {
    badge: string
    missionTitle: string
    missionDescription: string
    visionTitle: string
    visionDescription: string
    coreValues: CharityMissionFeature[]
  }
  waysToContribute: {
    badge: string
    title: string
    description: string
    options: CharityContributionOption[]
  }
  ctaSection: {
    title: string
    description: string
    buttons: CTAButton[]
    backgroundImage?: string
  }
}

export interface DakshinaService {
  name: string
  description?: string
  duration?: string
  price: string
  priceNote?: string
}

export interface DakshinaPageContent {
  hero: {
    subtitle: string
    title: string
    description: string
    backgroundImages: string[]
  }
  whatIsDakshina: {
    title: string
    subtitle: string
    content: string
    keyPoints: {
      title: string
      description: string
    }[]
  }
  pricingSection: {
    badge: string
    title: string
    description: string
    services: DakshinaService[]
    notes?: string[]
  }
  ctaSection: {
    title: string
    description: string
    primaryButtonText: string
    secondaryButtonText: string
  }
}

// Section Content Interfaces
export interface HeaderContent {
  logoUrl: string
  siteName: string
  tagline: string
  ctaText: string
  ctaLink: string
}

export interface FooterContent {
  description: string
  copyrightText: string
  facebookUrl: string
  instagramUrl: string
  youtubeUrl: string
  linkedinUrl: string
  twitterUrl: string
  pinterestUrl: string
}

export interface MenuItem {
  id?: string
  label: string
  url: string
  order: number
}

// CMS Context Type
export interface CmsContentState {
  homeContent: HomePageContent
  aboutContent: AboutPageContent
  whyChooseContent: WhyChooseContent
  booksContent: BooksPageContent
  contactContent: ContactPageContent
  charityContent: CharityPageContent
  headerContent: HeaderContent
  footerContent: FooterContent
  menuItems: MenuItem[]
}

export interface CmsContentActions {
  setHomeContent: React.Dispatch<React.SetStateAction<HomePageContent>>
  setAboutContent: React.Dispatch<React.SetStateAction<AboutPageContent>>
  setWhyChooseContent: React.Dispatch<React.SetStateAction<WhyChooseContent>>
  setBooksContent: React.Dispatch<React.SetStateAction<BooksPageContent>>
  setContactContent: React.Dispatch<React.SetStateAction<ContactPageContent>>
  setCharityContent: React.Dispatch<React.SetStateAction<CharityPageContent>>
  setHeaderContent: React.Dispatch<React.SetStateAction<HeaderContent>>
  setFooterContent: React.Dispatch<React.SetStateAction<FooterContent>>
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  handleSavePageContent: (pageKey: PageKey) => Promise<void>
  handleSaveHeader: () => Promise<void>
  handleSaveFooter: () => Promise<void>
  handleSaveMenu: () => Promise<void>
  isSaving: boolean
}

// Editor Props Types
export interface PageEditorProps {
  content: any
  setContent: React.Dispatch<React.SetStateAction<any>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export interface ImageGridProps {
  images: string[]
  setter: React.Dispatch<React.SetStateAction<any>>
  label: string
}
