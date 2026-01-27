/**
 * SEO Utility Functions
 * Handles meta tags, structured data, and SEO optimization
 */

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  robots?: string
  author?: string
  schema?: Record<string, any>
}

/**
 * Update document meta tags for SEO
 */
export function updateMetaTags(config: SEOConfig) {
  // Update title
  document.title = config.title

  // Update or create meta description
  updateMetaTag('description', config.description)
  
  // Update or create keywords
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords)
  }

  // Update Open Graph tags
  if (config.ogTitle) {
    updateMetaTag('og:title', config.ogTitle, 'property')
  }
  if (config.ogDescription) {
    updateMetaTag('og:description', config.ogDescription, 'property')
  }
  if (config.ogImage) {
    updateMetaTag('og:image', config.ogImage, 'property')
  }

  // Update canonical URL
  if (config.canonicalUrl) {
    updateCanonicalTag(config.canonicalUrl)
  }

  // Update robots
  if (config.robots) {
    updateMetaTag('robots', config.robots)
  }

  // Update author
  if (config.author) {
    updateMetaTag('author', config.author)
  }

  // Update structured data
  if (config.schema) {
    updateStructuredData(config.schema)
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string, attribute = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  
  tag.setAttribute('content', content)
}

/**
 * Update or create canonical tag
 */
function updateCanonicalTag(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  
  link.href = url
}

/**
 * Update structured data (JSON-LD)
 */
function updateStructuredData(schema: Record<string, any>) {
  // Remove existing script tag
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Create and add new script tag
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.innerHTML = JSON.stringify(schema)
  document.head.appendChild(script)
}

/**
 * SEO Configuration for each page
 * Optimized for target keywords: Hindu Pooja, Hindu ritual, Hindu Pandit,
 * Pandit for pooja, Irish Hindu Pandit, authentic Pooja, Sanatan dharma
 * Geo-targeted for Ireland and UK markets
 */
export const pageSEOConfig = {
  home: {
    title: 'Hindu Pooja Ireland | Authentic Hindu Pandit for Rituals & Ceremonies - Sanatan Dharma',
    description: 'Expert Hindu Pandit for authentic Pooja, rituals, and Sanatan Dharma ceremonies in Ireland & UK. Irish Hindu Pandit Rajesh Joshi - 15+ years experience in traditional Hindu rituals, Vedic ceremonies, and spiritual guidance.',
    keywords: 'Hindu Pooja, Hindu ritual, Hindu Pandit, Pandit for pooja, Irish Hindu Pandit, authentic Pooja, Sanatan dharma, Hindu ceremonies Ireland, Hindu priest Ireland, Pooja services Ireland, Hindu rituals Ireland, Vedic ceremonies Ireland, Hindu Pandit UK, authentic Hindu rituals, traditional Pooja Ireland',
    ogTitle: 'Hindu Pooja Ireland | Authentic Irish Hindu Pandit - Sanatan Dharma Services',
    ogDescription: 'Authentic Hindu Pooja and Sanatan Dharma ceremonies by experienced Irish Hindu Pandit. Traditional Hindu rituals, Vedic ceremonies in Ireland & UK.',
  },
  services: {
    title: 'Hindu Pooja Services Ireland | Authentic Rituals by Hindu Pandit - Sanatan Dharma',
    description: 'Complete Hindu Pooja services: Lakshmi Puja, Durga Puja, Hanuman Puja, Ganesh Puja & Sanatan Dharma rituals. Authentic Hindu ceremonies by experienced Pandit in Ireland, UK & Northern Ireland.',
    keywords: 'Hindu Pooja services, authentic Pooja, Hindu ritual, Pandit for pooja, Hindu ceremonies Ireland, Lakshmi puja Ireland, Durga puja UK, Hanuman puja, Ganesh Puja, Sanatan dharma rituals, Hindu Pandit Ireland, traditional Hindu rituals, Vedic Pooja services, Hindu priest for ceremonies',
  },
  about: {
    title: 'About Hindu Pandit Rajesh Joshi | Irish Hindu Priest & Sanatan Dharma Expert',
    description: 'Meet Pandit Rajesh Joshi - Irish Hindu Pandit with 15+ years experience in authentic Hindu Pooja, Sanatan Dharma rituals, Vedic ceremonies, and spiritual guidance. Expert in traditional Hindu rituals across Ireland & UK.',
    keywords: 'Hindu Pandit, Irish Hindu Pandit, Pandit for pooja, Hindu priest Ireland, Sanatan dharma expert, Vedic priest, spiritual guide Ireland, Hindu scholar, traditional Pandit Ireland, authentic Hindu priest',
  },
  gallery: {
    title: 'Hindu Pooja Gallery | Authentic Hindu Rituals & Ceremonies in Ireland',
    description: 'View authentic Hindu Pooja ceremonies, Sanatan Dharma rituals, and traditional Hindu ceremonies performed in Ireland & UK. Photo & video gallery of Hindu rituals.',
    keywords: 'Hindu Pooja, Hindu ceremonies, authentic Pooja photos, Hindu ritual videos, Sanatan dharma ceremonies, Hindu traditions Ireland, Pooja gallery, Hindu priest ceremonies',
  },
  blog: {
    title: 'Hindu Pooja Guide | Sanatan Dharma Wisdom & Authentic Hindu Rituals',
    description: 'Learn about authentic Hindu Pooja, Sanatan Dharma principles, significance of Hindu rituals, Vedic traditions, and spiritual practices. Expert insights on traditional Hindu ceremonies.',
    keywords: 'Hindu Pooja significance, Sanatan dharma, Hindu ritual meaning, authentic Pooja guide, Vedic wisdom, Hindu traditions, spiritual practices, Hindu ceremony guide',
  },
  books: {
    title: 'Hindu Philosophy Books | Sanatan Dharma, Yoga & Vedic Wisdom',
    description: 'Explore enlightening books on Hinduism, Sanatan Dharma, Yoga, Meditation, and spiritual practices. Ancient Vedic wisdom with modern scientific understanding by Pandit Rajesh Joshi.',
    keywords: 'Hindu books, Sanatan dharma books, Yoga guide, Vedic wisdom, Hindu philosophy, Meditation books, Hinduism and Science, spiritual books, Bhagavad Gita, Vedanta',
  },
  charity: {
    title: 'Hindu Charity Ireland | Sanatan Dharma Community Service & Education',
    description: 'Community initiatives promoting Hindu education, Sanatan Dharma awareness, and spiritual guidance in Ireland and UK. Hindu cultural programs and charitable work.',
    keywords: 'Hindu charity Ireland, Sanatan dharma education, community service, Hindu awareness, Hindu cultural programs Ireland, spiritual education',
  },
  testimonials: {
    title: 'Hindu Pooja Reviews | Authentic Ceremonies Testimonials Ireland',
    description: 'Read testimonials from families who experienced authentic Hindu Pooja, Sanatan Dharma ceremonies, and traditional Hindu rituals in Ireland & UK.',
    keywords: 'Hindu Pooja reviews, client testimonials, authentic Pooja feedback, Hindu ceremonies reviews, Pandit reviews Ireland, Hindu services Ireland',
  },
  contact: {
    title: 'Contact Hindu Pandit | Book Authentic Hindu Pooja in Ireland & UK',
    description: 'Contact Irish Hindu Pandit Rajesh Joshi to book authentic Hindu Pooja, Sanatan Dharma ceremonies, and traditional Hindu rituals in Ireland, UK & Northern Ireland.',
    keywords: 'contact Hindu Pandit, book Hindu Pooja, Pandit for pooja Ireland, book authentic Pooja, Hindu priest contact Ireland, Hindu ceremony booking',
  },
  dakshina: {
    title: 'Hindu Pooja Dakshina | Traditional Offerings for Authentic Ceremonies',
    description: 'Understand Dakshina (priestly offering) in Hindu Pooja and Sanatan Dharma traditions. Transparent pricing for authentic Hindu ceremonies in Ireland.',
    keywords: 'Hindu Pooja dakshina, priest offering, Hindu ceremony cost, Pooja pricing Ireland, authentic Hindu rituals cost, Pandit fees',
  },
  'why-choose-us': {
    title: 'Why Choose Our Hindu Pandit | Authentic Pooja & Sanatan Dharma Expert',
    description: 'Choose experienced Irish Hindu Pandit for authentic Pooja, traditional Sanatan Dharma rituals, and genuine Hindu ceremonies. 15+ years serving Ireland & UK.',
    keywords: 'authentic Hindu Pandit, best Hindu priest Ireland, experienced Pandit, traditional Hindu rituals, genuine Pooja services, Sanatan dharma expert',
  },
}

/**
 * Generate Organization Schema
 * Enhanced for local SEO in Ireland and UK
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ReligiousOrganization'],
    name: 'Pandit Rajesh Joshi - Hindu Pooja & Sanatan Dharma Services Ireland',
    alternateName: 'Irish Hindu Pandit - Rajesh Joshi',
    url: 'https://panditrajesh.ie',
    logo: 'https://panditrajesh.ie/images/Logo/Raj ji.png',
    description: 'Authentic Hindu Pooja services, Sanatan Dharma rituals, and traditional Hindu ceremonies by experienced Irish Hindu Pandit. Serving Ireland, UK, and Northern Ireland with 15+ years of expertise in Vedic traditions and Hindu rituals.',
    foundingDate: '2009',
    slogan: 'Authentic Hindu Pooja & Sanatan Dharma Ceremonies in Ireland',
    keywords: 'Hindu Pooja, Hindu ritual, Hindu Pandit, Pandit for pooja, Irish Hindu Pandit, authentic Pooja, Sanatan dharma, Hindu ceremonies Ireland',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'panditjoshirajesh@gmail.com',
      availableLanguage: ['English', 'Hindi', 'Sanskrit'],
      areaServed: ['IE', 'GB', 'Northern Ireland', 'Ireland', 'United Kingdom']
    },
    sameAs: [
      'https://www.facebook.com/panditrajesh',
      'https://www.instagram.com/panditrajesh',
      'https://www.youtube.com/@panditrajesh',
      'https://www.linkedin.com/in/panditrajesh'
    ],
    serviceArea: [
      {
        '@type': 'Country',
        name: 'Ireland',
        '@id': 'https://en.wikipedia.org/wiki/Ireland'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
        '@id': 'https://en.wikipedia.org/wiki/United_Kingdom'
      },
      {
        '@type': 'State',
        name: 'Northern Ireland'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hindu Pooja Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hindu Pooja Ceremonies',
            description: 'Authentic Hindu Pooja and Sanatan Dharma rituals'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hindu Wedding Ceremonies',
            description: 'Traditional Hindu wedding rituals and ceremonies'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hindu Rituals',
            description: 'All types of Hindu rituals and Sanskars'
          }
        }
      ]
    }
  }
}

/**
 * Generate Service Schema for individual services
 */
export function generateServiceSchema(serviceName: string, description: string, category: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    serviceType: `Hindu ${category}`,
    provider: {
      '@type': 'Person',
      name: 'Pandit Rajesh Joshi'
    },
    areaServed: [
      {
        '@type': 'Place',
        name: 'Ireland'
      },
      {
        '@type': 'Place',
        name: 'United Kingdom'
      },
      {
        '@type': 'Place',
        name: 'Northern Ireland'
      }
    ]
  }
}

/**
 * Generate Local Business Schema
 * Enhanced with detailed location and service information
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'ReligiousOrganization'],
    name: 'Pandit Rajesh Joshi - Hindu Pandit Ireland',
    alternateName: 'Irish Hindu Pandit',
    image: [
      'https://panditrajesh.ie/images/Logo/Raj ji.png',
      'https://panditrajesh.ie/images/Raj%201.jpg',
      'https://panditrajesh.ie/images/Pooja%201.jpg'
    ],
    description: 'Authentic Hindu Pooja services and Sanatan Dharma ceremonies by experienced Irish Hindu Pandit. Traditional Hindu rituals, Vedic ceremonies, and spiritual guidance in Ireland, UK, and Northern Ireland.',
    url: 'https://panditrajesh.ie',
    telephone: '+353-XXX-XXXX',
    email: 'panditjoshirajesh@gmail.com',
    priceRange: '€€',
    paymentAccepted: ['Cash', 'Bank Transfer'],
    currenciesAccepted: 'EUR, GBP',
    availableLanguage: ['English', 'Hindi', 'Sanskrit'],
    sameAs: [
      'https://www.facebook.com/panditrajesh',
      'https://www.instagram.com/panditrajesh',
      'https://www.youtube.com/@panditrajesh',
      'https://www.linkedin.com/in/panditrajesh'
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'Ireland',
        '@id': 'https://en.wikipedia.org/wiki/Ireland'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
        '@id': 'https://en.wikipedia.org/wiki/United_Kingdom'
      },
      {
        '@type': 'State',
        name: 'Northern Ireland'
      }
    ],
    serviceArea: [
      {
        '@type': 'City',
        name: 'Dublin',
        containedInPlace: {
          '@type': 'Country',
          name: 'Ireland'
        }
      },
      {
        '@type': 'City',
        name: 'Cork',
        containedInPlace: {
          '@type': 'Country',
          name: 'Ireland'
        }
      },
      {
        '@type': 'City',
        name: 'Galway',
        containedInPlace: {
          '@type': 'Country',
          name: 'Ireland'
        }
      },
      {
        '@type': 'City',
        name: 'Belfast',
        containedInPlace: {
          '@type': 'State',
          name: 'Northern Ireland'
        }
      },
      {
        '@type': 'City',
        name: 'London',
        containedInPlace: {
          '@type': 'Country',
          name: 'United Kingdom'
        }
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hindu Pooja & Ritual Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lakshmi Puja',
            description: 'Authentic Lakshmi Pooja for prosperity and wealth',
            provider: {
              '@type': 'Person',
              name: 'Pandit Rajesh Joshi'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Durga Puja',
            description: 'Traditional Durga Pooja for divine protection',
            provider: {
              '@type': 'Person',
              name: 'Pandit Rajesh Joshi'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hanuman Puja',
            description: 'Hanuman Pooja for strength and courage',
            provider: {
              '@type': 'Person',
              name: 'Pandit Rajesh Joshi'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Ganesh Puja',
            description: 'Ganesh Pooja for removing obstacles',
            provider: {
              '@type': 'Person',
              name: 'Pandit Rajesh Joshi'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hindu Wedding Ceremonies',
            description: 'Traditional Hindu wedding rituals and Vivah Sanskar',
            provider: {
              '@type': 'Person',
              name: 'Pandit Rajesh Joshi'
            }
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5',
      worstRating: '1'
    }
  }
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

/**
 * Generate FAQ Schema
 * Optimized for featured snippets with target keywords
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generate Person Schema for Pandit Rajesh Joshi
 * Enhanced for personal branding and authority
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rajesh Joshi',
    alternateName: ['Pandit Rajesh Joshi', 'Irish Hindu Pandit', 'Pandit Ji'],
    jobTitle: 'Hindu Pandit & Spiritual Guide',
    description: 'Experienced Hindu Pandit specializing in authentic Pooja, Sanatan Dharma ceremonies, and Vedic rituals. Serving the Hindu community in Ireland, UK, and Northern Ireland with traditional Hindu ceremonies and spiritual guidance.',
    url: 'https://panditrajesh.ie',
    image: 'https://panditrajesh.ie/images/Logo/Raj ji.png',
    email: 'panditjoshirajesh@gmail.com',
    knowsAbout: [
      'Hindu Pooja',
      'Hindu Rituals',
      'Sanatan Dharma',
      'Vedic Ceremonies',
      'Hindu Weddings',
      'Spiritual Guidance',
      'Vedic Astrology',
      'Sanskrit',
      'Hindu Philosophy',
      'Yoga',
      'Meditation'
    ],
    knowsLanguage: ['English', 'Hindi', 'Sanskrit'],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Hindu Priest',
      description: 'Hindu Pandit performing authentic Pooja and Sanatan Dharma ceremonies',
      occupationLocation: {
        '@type': 'Country',
        name: 'Ireland'
      },
      skills: 'Hindu Pooja, Hindu Rituals, Vedic Ceremonies, Spiritual Guidance, Sanskrit Mantras'
    },
    alumniOf: 'Traditional Vedic Studies',
    workLocation: [
      {
        '@type': 'Country',
        name: 'Ireland'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      },
      {
        '@type': 'State',
        name: 'Northern Ireland'
      }
    ],
    memberOf: {
      '@type': 'Organization',
      name: 'Hindu Community Ireland'
    },
    sameAs: [
      'https://www.facebook.com/panditrajesh',
      'https://www.instagram.com/panditrajesh',
      'https://www.youtube.com/@panditrajesh',
      'https://www.linkedin.com/in/panditrajesh'
    ]
  }
}

/**
 * Generate keyword-rich FAQ for Hindu Pooja services
 * Optimized for featured snippets and voice search
 */
export function generateHinduPoojaFAQs() {
  return generateFAQSchema([
    {
      question: 'What is Hindu Pooja and why is it important?',
      answer: 'Hindu Pooja is a sacred ritual of worship in Sanatan Dharma where devotees honor deities through mantras, offerings, and traditional ceremonies. Hindu Pooja is important because it connects us with divine energies, brings peace, prosperity, and spiritual growth to our lives.'
    },
    {
      question: 'Where can I find an authentic Hindu Pandit in Ireland?',
      answer: 'You can find an authentic Hindu Pandit in Ireland through Pandit Rajesh Joshi, an experienced Irish Hindu Pandit with 15+ years of expertise in traditional Hindu Pooja, Sanatan Dharma ceremonies, and Vedic rituals. He serves all of Ireland, UK, and Northern Ireland with authentic Hindu ceremonies.'
    },
    {
      question: 'What types of Hindu Pooja services are available in Ireland?',
      answer: 'In Ireland, you can get complete Hindu Pooja services including Lakshmi Puja for prosperity, Durga Puja for protection, Hanuman Puja for strength, Ganesh Puja for removing obstacles, Satyanarayana Pooja for family harmony, Hindu wedding ceremonies, housewarming rituals (Griha Pravesh), and all Sanatan Dharma Sanskars.'
    },
    {
      question: 'How do I book a Hindu Pandit for Pooja in Ireland or UK?',
      answer: 'To book a Hindu Pandit for Pooja in Ireland or UK, contact Pandit Rajesh Joshi through the website contact form, WhatsApp, or email. He provides authentic Hindu Pooja services across Ireland, Northern Ireland, and UK with flexible scheduling for all Hindu rituals and Sanatan Dharma ceremonies.'
    },
    {
      question: 'What is Sanatan Dharma and how is it related to Hindu Pooja?',
      answer: 'Sanatan Dharma (meaning "eternal law") is the ancient name for Hinduism. Hindu Pooja is an essential practice in Sanatan Dharma that helps followers connect with the divine, maintain dharma (righteousness), and achieve spiritual growth through traditional Vedic rituals and ceremonies.'
    },
    {
      question: 'Are the Hindu Pooja ceremonies performed in Ireland authentic?',
      answer: 'Yes, all Hindu Pooja ceremonies performed by Pandit Rajesh Joshi in Ireland are completely authentic and follow traditional Sanatan Dharma practices. He uses proper Vedic mantras, follows traditional rituals, and maintains the sanctity of Hindu ceremonies as prescribed in ancient scriptures.'
    },
    {
      question: 'How much does a Hindu Pooja ceremony cost in Ireland?',
      answer: 'Hindu Pooja ceremony costs in Ireland vary depending on the type of Pooja, duration, and requirements. Pandit Rajesh Joshi offers transparent pricing and flexible Dakshina (offering) options to make authentic Hindu rituals accessible to all families in Ireland, UK, and Northern Ireland.'
    },
    {
      question: 'Can I get Hindu Pooja services in Northern Ireland and UK?',
      answer: 'Yes, Pandit Rajesh Joshi provides Hindu Pooja services throughout Ireland, Northern Ireland, and the United Kingdom. He travels to perform authentic Hindu rituals, Sanatan Dharma ceremonies, and traditional Pooja in Belfast, London, and other UK cities.'
    }
  ])
}
