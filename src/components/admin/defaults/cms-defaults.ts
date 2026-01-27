import type {
  HomePageContent,
  AboutPageContent,
  WhyChooseContent,
  BooksPageContent,
  ContactPageContent,
  CharityPageContent,
  DakshinaPageContent,
  GalleryPageContent,
  TestimonialsPageContent,
  HeaderContent,
  FooterContent,
  MenuItem
} from '../types/cms-types'

// Empty defaults - Admin must fill content via CMS

export const defaultHomeContent: HomePageContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    profileImage: '',
    backgroundImages: [],
    statistics: [],
    ctaButtons: []
  },
  photoGallery: {
    badge: '',
    title: '',
    description: '',
    images: []
  },
  services: {
    badge: '',
    title: '',
    description: '',
    buttonText: ''
  },
  sacredSpaces: {
    badge: '',
    title: '',
    description: '',
    spaces: []
  },
  featureCardsHeader: {
    badge: '',
    title: '',
    description: ''
  },
  featureCards: [],
  ctaSection: {
    title: '',
    description: '',
    ctaButtons: []
  }
}

export const defaultAboutContent: AboutPageContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: []
  },
  profileImage: '',
  badge: '',
  title: '',
  shortBio: '',
  statistics: [],
  ctaButtons: [],
  spiritualJourney: {
    title: '',
    content: '',
    meditationPrograms: [],
    literaryContributions: {
      title: '',
      description: '',
      books: []
    },
    poetrySection: {
      title: '',
      description: ''
    }
  },
  expertiseAreas: [],
  academicCard: { title: '', description: '', badge: '' },
  industrialistCard: { title: '', description: '', badge: '' },
  gurukulCard: { title: '', description: '', badge: '' },
  photoGallery: {
    badge: '',
    title: '',
    description: '',
    images: []
  },
  whatToExpect: {
    badge: '',
    title: '',
    description: '',
    features: []
  },
  communityService: {
    badge: '',
    title: '',
    services: []
  }
}

export const defaultWhyChooseContent: WhyChooseContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: []
  },
  quickBenefits: [],
  reasons: [],
  ctaSection: {
    title: '',
    description: '',
    buttons: []
  }
}

export const defaultBooksContent: BooksPageContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: []
  },
  stats: [],
  cta: {
    title: '',
    description: '',
    buttonText: '',
    buttonLink: ''
  }
}

export const defaultContactContent: ContactPageContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: [],
    badge: '',
    quickActions: [],
    trustIndicators: []
  },
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  contactInfoCard: {
    emailLabel: '',
    emailBadge: '',
    whatsappLabel: '',
    whatsappText: '',
    serviceAreaLabel: '',
    serviceAreaText: '',
    serviceAreaBadge: ''
  },
  responseGuarantee: {
    title: '',
    description: '',
    badges: []
  },
  faqSection: {
    badge: '',
    title: '',
    faqs: []
  },
  form: {
    nameLabel: '',
    emailLabel: '',
    phoneLabel: '',
    phoneOptional: '',
    serviceLabel: '',
    servicePlaceholder: '',
    messageLabel: '',
    messagePlaceholder: '',
    submitButtonText: '',
    responseText: ''
  }
}

export const defaultCharityContent: CharityPageContent = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: [],
    statistics: [],
    ctaButtons: []
  },
  impactSection: {
    badge: '',
    title: '',
    description: '',
    statistics: []
  },
  featuredProjects: {
    badge: '',
    title: '',
    description: '',
    stats: []
  },
  serviceAreas: {
    badge: '',
    title: '',
    description: '',
    areas: []
  },
  impactStories: {
    badge: '',
    title: '',
    description: '',
    stories: []
  },
  missionVision: {
    badge: '',
    missionTitle: '',
    missionDescription: '',
    visionTitle: '',
    visionDescription: '',
    coreValues: []
  },
  waysToContribute: {
    badge: '',
    title: '',
    description: '',
    options: []
  },
  ctaSection: {
    title: '',
    description: '',
    buttons: []
  }
}

export const defaultDakshinaContent: DakshinaPageContent = {
  hero: {
    subtitle: '',
    title: '',
    description: '',
    backgroundImages: []
  },
  whatIsDakshina: {
    title: '',
    subtitle: '',
    content: '',
    keyPoints: []
  },
  pricingSection: {
    badge: '',
    title: '',
    description: '',
    services: [],
    notes: []
  },
  ctaSection: {
    title: '',
    description: '',
    primaryButtonText: '',
    secondaryButtonText: ''
  }
}

export const defaultGalleryContent: GalleryPageContent = {
  hero: {
    badge: '',
    title: '',
    subtitle: '',
    description: '',
    backgroundImages: [],
    statistics: [],
    ctaButtons: []
  }
}

export const defaultTestimonialsContent: TestimonialsPageContent = {
  hero: {
    badge: 'Voices of Devotion',
    title: 'What Our <highlight>Community</highlight> Says',
    description: 'Discover the heartfelt experiences of families who have found spiritual guidance, peace, and sacred moments through our traditional Hindu ceremonies.',
    backgroundImages: [],
    statistics: [
      { value: '250+', label: 'Families' },
      { value: '500+', label: 'Ceremonies' },
      { value: '4.9/5', label: 'Rating' },
      { value: '15+', label: 'Years' }
    ]
  },
  shareExperience: {
    title: 'Share Your Sacred Experience',
    description: 'Your testimonial helps others discover the beauty of traditional Hindu ceremonies and guides families in their spiritual journey. We would be honored to hear your story.',
    primaryButtonText: 'Write a Testimonial',
    secondaryButtonText: 'Leave a Review',
    shareText: 'Share your experience on:',
    googleReviewUrl: 'https://www.google.com/search?q=pandit+rajesh+joshi',
    email: 'panditjoshirajesh@gmail.com',
    emailSubject: 'Testimonial'
  },
  whyChooseUs: {
    title: 'Why Families Choose Us',
    cards: [
      { icon: 'Trophy', title: 'Authentic Traditions', description: 'Every ceremony is performed according to proper Vedic procedures with genuine devotion and traditional knowledge passed through generations.' },
      { icon: 'Users', title: 'Personalized Service', description: 'Each ceremony is adapted to your family\'s unique needs, traditions, and preferences while maintaining sacred authenticity.' },
      { icon: 'Heart', title: 'Compassionate Guidance', description: 'We approach every family with genuine care, understanding, and spiritual sensitivity to ensure meaningful and comforting experiences.' },
      { icon: 'Sparkle', title: 'Educational Experience', description: 'Every ritual becomes a learning opportunity, helping families understand and appreciate the deeper meaning of Hindu spiritual traditions.' }
    ]
  }
}

export const defaultMenuItems: MenuItem[] = []

export const defaultHeaderContent: HeaderContent = {
  logoUrl: '',
  siteName: '',
  tagline: '',
  ctaText: '',
  ctaLink: ''
}

export const defaultFooterContent: FooterContent = {
  description: '',
  copyrightText: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  pinterestUrl: ''
}
