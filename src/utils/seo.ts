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
 */
export const pageSEOConfig = {
  home: {
    title: 'Hindu Pooja & Rituals in Ireland | Pandit Rajesh Joshi',
    description: 'Expert Hindu pooja services, rituals, and spiritual guidance in Ireland, UK, and Northern Ireland. Authentic ceremonies by experienced Pandit Rajesh Joshi.',
    keywords: 'Hindu pooja, Hindu ritual, Indian pooja, pooja in Ireland, Hindu priest Ireland, Hindu ceremonies',
    ogTitle: 'Hindu Pooja Services & Rituals in Ireland - Pandit Rajesh Joshi',
    ogDescription: 'Authentic Hindu poojas, sanskars, and spiritual consultations in Ireland. 15+ years experience.',
  },
  services: {
    title: 'Hindu Poojas, Sanskars & Rituals | Professional Services in Ireland',
    description: 'Complete Hindu pooja services including Lakshmi Puja, Durga Puja, Hanuman Puja, and traditional rituals. Serving Ireland, UK, and Northern Ireland.',
    keywords: 'Hindu pooja services, Lakshmi puja, Durga puja, Hanuman puja, Hindu rituals, Indian pooja, pooja in Ireland, UK pooja services',
  },
  about: {
    title: 'About Pandit Rajesh Joshi | Hindu Priest & Spiritual Guide',
    description: 'Learn about Pandit Rajesh Joshi - 15+ years experience in Hindu ceremonies, rituals, and spiritual guidance. Expert in Vedic traditions.',
    keywords: 'Hindu priest, Pandit, spiritual guide, Hindu priest Ireland, temple priest, Hindu scholar',
  },
  gallery: {
    title: 'Hindu Ceremonies & Rituals Gallery | Pooja Photos & Videos',
    description: 'View gallery of authentic Hindu poojas, ceremonies, and spiritual events. Educational content on Hindu traditions and rituals.',
    keywords: 'Hindu ceremonies, pooja photos, ritual videos, Hindu traditions, Indian rituals',
  },
  blog: {
    title: 'Hindu Spirituality & Pooja Guide | Spiritual Wisdom Blog',
    description: 'Learn about the significance of Hindu poojas, sanskars, vedic astrology, and spiritual practices in modern life.',
    keywords: 'Hindu pooja significance, spiritual practices, vedic wisdom, Hindu traditions, spiritual guidance',
  },
  charity: {
    title: 'Hindu Charity & Community Service | Spiritual Education',
    description: 'Community initiatives and charitable work promoting Hindu education and spiritual awareness in Ireland and beyond.',
    keywords: 'Hindu charity, community service, spiritual education, Hindu awareness, community initiatives',
  },
  testimonials: {
    title: 'Client Testimonials | Hindu Pooja Services Reviews',
    description: 'Read testimonials from families who experienced authentic Hindu ceremonies and spiritual guidance services.',
    keywords: 'client testimonials, pooja reviews, Hindu services reviews, customer feedback',
  },
  contact: {
    title: 'Contact Pandit Rajesh Joshi | Book Hindu Pooja Services',
    description: 'Contact Pandit Rajesh Joshi to book Hindu poojas, ceremonies, and spiritual consultations in Ireland, UK, Northern Ireland.',
    keywords: 'contact pandit, book pooja, Hindu priest contact, spiritual consultation booking',
  },
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pandit Rajesh Joshi - Hindu Religious Services',
    url: 'https://panditrajesh.com',
    logo: 'https://panditrajesh.com/Raj ji.jpg',
    description: 'Professional Hindu pooja services, rituals, and spiritual guidance. 15+ years experience serving communities worldwide.',
    foundingDate: '2009',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'panditjoshirajesh@gmail.com',
      areaServed: ['IE', 'GB', 'Northern Ireland']
    },
    sameAs: [
      'https://www.facebook.com/panditrajesh',
      'https://www.instagram.com/panditrajesh',
      'https://www.youtube.com/@panditrajesh'
    ],
    serviceArea: {
      '@type': 'Place',
      name: 'Ireland, UK, Northern Ireland'
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
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pandit Rajesh Joshi',
    image: 'https://panditrajesh.com/Raj ji.jpg',
    description: 'Hindu priest providing authentic poojas, ceremonies, and spiritual guidance',
    url: 'https://panditrajesh.com',
    telephone: '+353-XXXX-XXXX',
    email: 'panditjoshirajesh@gmail.com',
    priceRange: '$$',
    sameAs: [
      'https://www.facebook.com/panditrajesh',
      'https://www.instagram.com/panditrajesh'
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Ireland, UK, Northern Ireland'
    },
    serviceArea: [
      {
        '@type': 'City',
        name: 'Dublin, Ireland'
      },
      {
        '@type': 'Country',
        name: 'Ireland'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      }
    ]
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
