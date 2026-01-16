import type {
  HomePageContent,
  AboutPageContent,
  WhyChooseContent,
  BooksPageContent,
  ContactPageContent,
  CharityPageContent,
  DakshinaPageContent,
  HeaderContent,
  FooterContent,
  MenuItem
} from '../types/cms-types'

export const defaultHomeContent: HomePageContent = {
  hero: {
    title: 'Experience Authentic Hindu Ceremonies',
    subtitle: 'Traditional Hindu Priest & Spiritual Guide',
    description: 'Discover the profound beauty of traditional Hindu rituals performed with devotion, wisdom, and centuries-old knowledge by Pandit Rajesh Joshi.',
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png',
      '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png'
    ],
    profileImage: '/images/Logo/Raj ji.png',
    statistics: [
      { label: 'Poojas', value: '500+' },
      { label: 'Clients', value: '250+' },
      { label: 'Years', value: '15+' },
      { label: 'Books', value: '5' }
    ],
    ctaButtons: [
      { text: 'About Us', link: '/about', variant: 'primary' },
      { text: 'Why Choose Us', link: '/why-choose-us', variant: 'outline' },
      { text: 'Explore Services', link: '/services', variant: 'outline' }
    ]
  },
  photoGallery: {
    badge: 'Our Journey',
    title: 'Moments of Devotion & Service',
    description: 'Glimpses of sacred ceremonies and spiritual gatherings',
    images: [
      '/images/Raj 1.jpg',
      '/images/Pooja 1.jpg',
      '/images/Raj 2.jpg',
      '/images/Pooja 2.jpg',
      '/images/Raj 3.jpg',
      '/images/Pooja 3.jpg'
    ]
  },
  services: {
    badge: 'Our Sacred Services',
    title: 'Comprehensive Spiritual Services',
    description: 'From birth ceremonies to final rites, we provide authentic Hindu rituals and spiritual guidance for every sacred moment in life.',
    buttonText: 'View All 40+ Services'
  },
  sacredSpaces: {
    badge: 'Sacred Spaces',
    title: 'Divine Temples & Sacred Altars',
    description: 'Experience the beauty and serenity of traditional Hindu temples and ceremonial spaces',
    spaces: [
      { image: '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png', title: 'Divine Vaidyanath Temple', subtitle: 'Sacred Hindu Architecture' },
      { image: '/images/Golden Temples of Devotion.png', title: 'Golden Temples', subtitle: 'Places of Worship & Devotion' },
      { image: '/images/South Asian Temple Complex.png', title: 'Temple Complex', subtitle: 'Traditional Sacred Grounds' },
      { image: '/images/Traditional Altar with Marigold Flowers.png', title: 'Sacred Altar', subtitle: 'Adorned with Marigold Flowers' }
    ]
  },
  featureCards: [
    { title: 'Deep Knowledge', description: 'Extensive understanding of Hindu scriptures, rituals, and traditions passed through generations', icon: 'BookOpenText' },
    { title: 'Devotional Service', description: 'Every ceremony performed with genuine devotion, care, and respect for sacred traditions', icon: 'Heart' },
    { title: 'Community Focused', description: 'Dedicated to serving families and communities with accessible spiritual guidance', icon: 'Users' }
  ],
  ctaSection: {
    title: 'Ready to Begin Your Spiritual Journey?',
    description: 'Contact us to discuss your ceremony needs or for spiritual consultation',
    ctaButtons: [
      { text: 'Get in Touch', link: '/contact', variant: 'primary' }
    ]
  }
}

export const defaultAboutContent: AboutPageContent = {
  hero: {
    title: 'Meet Rajesh Joshi',
    subtitle: '"eYogi Raj"',
    description: 'Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker bridging ancient wisdom with modern life.',
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png',
      '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png'
    ]
  },
  profileImage: '/images/Logo/Raj ji.png',
  badge: 'Hindu Scholar & Spiritual Guide',
  name: 'Rajesh Joshi',
  title: '"eYogi Raj"',
  shortBio: 'Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker bridging ancient wisdom with modern life.',
  statistics: [
    { label: 'Poojas', value: '200+' },
    { label: 'Poems', value: '100+' },
    { label: 'Years Teaching', value: '10+' },
    { label: 'Books', value: '6' }
  ],
  ctaButtons: [
    { text: 'Published Books', link: '/books', variant: 'primary' },
    { text: 'Charity Work', link: '/charity', variant: 'outline' },
    { text: 'Testimonials', link: '/testimonials', variant: 'outline' }
  ],
  spiritualJourney: {
    title: 'The Spiritual Journey',
    content: `<p>Over a decade ago, Rajesh Ji's life took a transformative turn when he experienced stress-induced high blood pressure. Understanding that the root cause was stress and anxiety, he embraced the path of spirituality and Sanatana Dharma. Beginning with meditation, he experienced immediate benefits that revealed the profound science behind the Indian Knowledge System.</p>
<p>This awakening led him to explore the vast ocean of 10 million scriptures within the Indian Knowledge System.</p>
<p>Realizing that ancient wisdom of the Indian subcontinent holds solutions for two-thirds of human mind's problems, he immersed himself in Hindu scriptures: Vedas, Upanishads, Ramayana, Mahabharata, Puranas, Yogic literature, Agama Tantras, and modern interpretations of ancient knowledge. This deep study led him to create his own meditation methodology, the <strong>"eYogi Yoga and Meditation Guide"</strong> for beginners.</p>
<p>Rajesh Ji has conducted <strong>200+ poojas since 2001</strong> alongside his industrial career, performing all ceremonies without any monetary gain. His commitment to Karma Kanda (Daily Rituals) and the power of Bhakti has made him a beacon of authentic Vedic traditions.</p>`,
    meditationPrograms: [
      'Art of Living Sudarshan Kriya',
      'Isha Kriya',
      'Dalai Lama Meditation Programs',
      'Dzogchen Longchen Nyingtik',
      'S.N. Goenka Dhamma Deepa (10 Days)',
      'Ramakrishna Mission Retreats'
    ],
    literaryContributions: {
      title: 'Literary Contributions',
      description: 'Rajesh Ji has written multiple books on Indian culture and Sanatana Dharma, connecting ancient wisdom to modern science. His books are published with hundreds of physical copies in circulation across Ireland and India.',
      books: [
        'Hinduism Basics for All',
        'Hinduism and Science',
        'eYogi Yoga & Meditation Guide',
        'Navaratri: The Bhakti of Shakti',
        'Diwali: The Oldest Festival',
        'Leaving Cert Guide (co-authored)'
      ]
    },
    poetrySection: {
      title: 'Poetry & Public Speaking',
      description: 'Composed 100+ Hindi poems, regularly recited at various prestigious stages in Ireland and USA. As a motivational speaker, Rajesh Ji weaves ancient wisdom into inspiring talks that resonate with modern audiences.'
    }
  },
  expertiseAreas: [
    'Quantum Mechanics',
    'Ancient Scriptures',
    'Indian History',
    'Positive Psychology',
    'Poetry',
    'Yoga & Meditation',
    'Astronomy',
    'Sanatana Dharma'
  ],
  academicCard: {
    title: 'Academic Excellence',
    description: 'ME in Electronics Engineering from Dublin City University, Ireland',
    badge: 'DCU Graduate'
  },
  industrialistCard: {
    title: 'Irish Industrialist',
    description: 'Successful industrial career alongside spiritual pursuits and community service',
    badge: 'Business Leader'
  },
  gurukulCard: {
    title: 'eYogi Gurukul',
    description: 'Founded volunteer-based non-profit charity for Indic studies in Ireland (2017)',
    badge: 'Founder'
  },
  photoGallery: {
    badge: 'Our Journey',
    title: 'Moments of Devotion & Service',
    description: 'Glimpses of sacred ceremonies, spiritual gatherings, and community service performed with devotion and authenticity',
    images: [
      { src: '/images/Raj 1.jpg', alt: 'Rajesh Joshi Ji' },
      { src: '/images/Pooja 1.jpg', alt: 'Traditional Pooja Ceremony' },
      { src: '/images/Raj 2.jpg', alt: 'Spiritual Guidance' },
      { src: '/images/Pooja 2.jpg', alt: 'Hindu Ritual' },
      { src: '/images/Raj 3.jpg', alt: 'Religious Ceremony' },
      { src: '/images/Pooja 3.jpg', alt: 'Sacred Ritual' }
    ]
  },
  whatToExpect: {
    badge: 'What Makes Rajesh Ji Unique',
    title: 'What to Expect When You Invite Rajesh Ji',
    description: 'When you invite Rajesh Ji to perform a pooja, he comes as a complete package - blending deep scholarship, authentic rituals, and modern relevance in a way that touches hearts and minds.',
    features: [
      { title: 'Deep Knowledge of Sanatana Dharma', description: 'Scholar of Indian Knowledge System with extensive study of Vedas, Upanishads, Puranas, and Itihasas. He quotes exact references and explains the meaning and context.' },
      { title: 'Ancient Wisdom Meets Modern Science', description: 'Bridges ancient spiritual practices with quantum mechanics, astronomy, and positive psychology, making traditions relevant for contemporary understanding.' },
      { title: 'Complete Pooja Explanation', description: 'Every step of the pooja is explained - why we do it, what it means, and how it relates to modern life. No ritual is performed without understanding.' },
      { title: 'Special Connection with Children', description: 'Having taught hundreds of children (ages 4-18) through eYogi Gurukul, he knows how to engage young minds. Kids are typically glued to the pooja in his presence.' },
      { title: 'Authentic Vedic Rituals', description: "Performs poojas as per Shastras with exact scriptural references. You'll know which verse comes from which scripture and its precise meaning." },
      { title: 'Motivational & Inspiring', description: 'As a motivational speaker, his subtle messages bind families together. He weaves words with examples that rejuvenate relationships and inspire spiritual growth.' },
      { title: 'Creating Sacred Environments', description: 'Rajesh Ji creates an atmosphere of purity, bhakti, and devotion that leaves forever imprints in the minds of the Yajamana (host). His presence brings families and friends together, encouraging spiritual growth while fostering harmony and understanding.' }
    ]
  },
  communityService: {
    badge: 'Community Service',
    title: 'Seva and Social Impact',
    services: [
      { title: 'One Notary One Gita Project', description: 'A unique community service initiative aimed at spreading the wisdom of the Bhagavad Gita to communities across Ireland, making ancient wisdom accessible to all.' },
      { title: 'Seva Without Monetary Gain', description: 'Rajesh Ji strongly believes in the power of Bhakti and selfless service. All 200+ poojas performed since 2001 have been conducted alongside his industrial career without taking any monetary gains for himself - a true testament to his dedication to spiritual service.' }
    ]
  }
}

export const defaultWhyChooseContent: WhyChooseContent = {
  hero: {
    title: 'Why Choose Pandit Rajesh Joshi',
    subtitle: 'Experience the perfect blend of authentic Vedic traditions, scholarly wisdom, and heartfelt devotion',
    description: '',
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png',
      '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png'
    ]
  },
  quickBenefits: [
    { icon: 'Heart', label: 'Genuine Bhakti' },
    { icon: 'GraduationCap', label: '20+ Years' },
    { icon: 'FlowerLotus', label: '100% Vedic' },
    { icon: 'ListChecks', label: '30+ Poojas' },
    { icon: 'UsersFour', label: 'Personalized' },
    { icon: 'Globe', label: 'E-Pooja' }
  ],
  reasons: [
    {
      title: 'Passion – Devotion That Flows From the Heart',
      description: "Every pooja performed by Rajesh Ji is rooted in genuine bhakti, compassion, and a lifelong commitment to Sanatana Dharma. His spiritual journey began when stress and anxiety once touched his life, leading him towards meditation, scriptures, and inner transformation. This awakening created an unshakeable passion to serve, guide, and uplift families.",
      impact: "When you invite Rajesh Ji, you receive a priest who brings love, sincerity, and a pure intention into your home—making every ritual emotionally meaningful and spiritually elevating.",
      highlights: [],
      shloka: {
        sanskrit: 'मन: प्रसाद: सौम्यत्वं मौनमात्मविनिग्रह: | भावसंशुद्धिरित्येतत्तपो मानसमुच्यते ||',
        reference: 'Bhagavad Gita 17.16',
        hindi: 'मन की शांति, विनम्रता, मौन, आत्म-संयम और पवित्रता को मन की तपस्या कहा जाता है।',
        english: 'Tranquillity of mind, gentleness, silence, self-control and purity of purpose are known as austerities of the mind.'
      }
    },
    {
      title: 'Experience & a Scholarly Mind – 20+ Years of Jnana & Seva',
      description: "Rajesh Ji has been performing poojas since 2001 and is recognised as a scholar of Hinduism and the Indian Knowledge System. With deep study of Vedas, Upanishads, the Puranas, Itihasas, Yogic literature, Tantra texts and 10,000+ years of Indian wisdom, he brings unmatched authenticity to every ritual.",
      impact: "He doesn't just perform—he explains the origin of slokas, the meaning behind mantras, and the exact shastric references, blending ancient spiritual wisdom with modern scientific understanding. His experience also comes from teaching hundreds of students, giving lectures, writing books, and sharing knowledge across Ireland and beyond.",
      highlights: [
        '200+ poojas performed since 2001',
        'Scholar of Vedas, Upanishads, Puranas & Itihasas',
        'Published author of 5+ books on Hinduism',
        'Taught hundreds of students through eYogi Gurukul',
        'Bridges ancient wisdom with modern science'
      ]
    },
    {
      title: 'Authentic & Vedic – No Shortcuts, Only Purity',
      description: "In an age where many rituals are shortened or diluted, Rajesh Ji stands firm in offering complete, traditional, and Vedic poojas. Every step—from sankalpa to samarpan—is performed with precision, clarity, and devotion.",
      impact: "He never rushes or skips mantras. Instead, he performs rituals exactly as prescribed in the scriptures, ensuring that the energy, sanctity, and blessings reach your home in their fullest essence. His presence creates an atmosphere of purity, peace, and divine connection that stays with the family long after the pooja ends.",
      highlights: [
        'Complete traditional Vedic rituals',
        'Every mantra chanted with precision',
        'Follows scriptural procedures exactly',
        'No shortcuts or dilution of practices',
        'Creates lasting spiritual atmosphere'
      ]
    },
    {
      title: 'Wide Range of Services – Over 30+ Pooja Offerings',
      description: "From Griha Pravesh to Naamkaran, Satyanarayana Katha to Durga Puja, Lakshmi Puja to Rudrabhishek, Rajesh Ji performs over 30 different poojas and samskaras according to Vedic tradition.",
      impact: "Whether you want a spiritual ceremony for your family, a sacred function, or a community-level group pooja, you benefit from his broad expertise, clear guidance, and calm leadership. Each ritual is conducted with care, ensuring that every family receives the exact blessings they seek.",
      highlights: [
        '30+ different poojas and samskaras',
        'Family ceremonies to community events',
        'Life cycle rituals from birth to marriage',
        'Festival poojas for all major occasions',
        'Custom ceremonies based on needs'
      ]
    },
    {
      title: 'Convenient & Personalised Rituals – Regional Traditions Honoured',
      description: "Every Hindu family carries unique customs, regional practices, and ancestral traditions. Rajesh Ji fully respects this diversity. Before each ceremony, he collaborates with the Yajamana (host) to understand their background—North Indian, South Indian, Nepali, Marathi, Gujarati, Tamil, Bengali, or mixed traditions.",
      impact: "He then personalises the pooja accordingly, ensuring the rituals feel familiar, comfortable, and authentic to your family's roots. His warm connection with children, elders, and guests ensures that everyone participates, learns, and feels blessed.",
      highlights: [
        'Respects all regional traditions',
        'Customizes rituals to family customs',
        'North Indian, South Indian & all regions',
        'Engages children, elders & all guests',
        'Makes everyone feel included'
      ]
    },
    {
      title: 'E-Pooja & Online Options – Connecting Families Worldwide',
      description: "Distance is no barrier to devotion. For families across Ireland, Europe, India, or anywhere in the world, Rajesh Ji offers E-Pooja (Online Pooja) options. With clear instructions, digital guidance, and live chanting, families can participate from their home, even if unable to attend physically.",
      impact: "Online poojas are conducted with the same sincerity and shastric authenticity, making spiritual connection accessible to all.",
      highlights: [
        'Students living abroad can participate',
        'Families spread across multiple locations',
        'Health or travel restrictions accommodated',
        'Same authenticity as in-person ceremonies',
        'Available worldwide with digital guidance'
      ]
    }
  ],
  ctaSection: {
    title: 'Experience the Difference',
    description: "When you choose Rajesh Ji, you're not just booking a priest—you're inviting a scholar, a devotee, and a guide who will make your spiritual ceremony truly unforgettable. Every pooja is performed with authenticity, explained with wisdom, and infused with genuine bhakti.",
    buttons: [
      { text: 'View All Services', link: '/services', variant: 'primary' },
      { text: 'Book a Consultation', link: '/contact', variant: 'outline' }
    ]
  }
}

export const defaultBooksContent: BooksPageContent = {
  hero: {
    title: 'Books by Rajesh Joshi Ji',
    subtitle: 'Wisdom & Knowledge',
    description: 'Explore enlightening works on Hinduism, Yoga, Meditation, and spirituality.',
    backgroundImages: []
  }
}

export const defaultContactContent: ContactPageContent = {
  hero: {
    title: "Let's Begin Your Sacred Journey",
    subtitle: 'Connect With Us',
    description: "Whether you're planning a traditional ceremony or seeking spiritual guidance, we're here to serve.",
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png',
      '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png'
    ]
  },
  email: 'panditjoshirajesh@gmail.com',
  phone: '+353 123 456 789',
  whatsapp: '+353 123 456 789',
  address: 'Serving communities worldwide'
}

export const defaultCharityContent: CharityPageContent = {
  hero: {
    badge: 'Serving Since 2001',
    title: 'eYogi Gurukul',
    subtitle: 'Spreading Sanatan Dharma, One Heart at a Time',
    description: 'Founded by Rajesh Joshi ji, eYogi Gurukul is dedicated to preserving and propagating the timeless wisdom of Sanatan Dharma through education, service, and community development.',
    logoImage: '/images/Logo/Raj ji.jpg',
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png',
      '/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png'
    ],
    statistics: [
      { value: '500+', label: 'Students Taught' },
      { value: '10+', label: 'Countries Reached' },
      { value: '5+', label: 'Published Books' },
      { value: '1000+', label: 'Lives Impacted' }
    ],
    ctaButtons: [
      { text: 'Join Our Mission', link: '/contact', variant: 'primary' },
      { text: 'Learn More', link: '#mission', variant: 'outline' }
    ]
  },
  impactSection: {
    badge: 'Our Impact',
    title: 'Transforming Lives Through Dharma',
    description: 'Through dedicated service and authentic spiritual education, eYogi Gurukul has touched thousands of lives across the globe, creating a ripple effect of positive change.',
    statistics: [
      { value: '500+', label: 'Students Taught', subtext: 'Ages 4-18' },
      { value: '10+', label: 'Countries Reached', subtext: 'Worldwide presence' },
      { value: '5,000+', label: 'Sacred Texts Distributed', subtext: 'Bhagavad Gita, Ramayana & more' },
      { value: '1,000+', label: 'Lives Transformed', subtext: 'Through spiritual guidance' }
    ]
  },
  featuredProjects: {
    badge: 'Our Mission',
    title: 'Spreading the Light of Dharma',
    description: 'eYogi Gurukul offers free spiritual education, distributes sacred texts, and supports temple activities—empowering seekers from all backgrounds to connect with their spiritual roots.',
    videoUrl: 'https://www.youtube.com/watch?v=D4f3cGX9iNg',
    stats: [
      { value: '10+', label: 'Years of Service' },
      { value: '24/7', label: 'Spiritual Support' },
      { value: '100%', label: 'Free Education' }
    ]
  },
  serviceAreas: {
    badge: 'What We Do',
    title: 'Our Service Areas',
    description: 'Dedicated to serving the community through comprehensive spiritual education, sacred text distribution, and heartfelt support.',
    areas: [
      {
        icon: 'BookOpenText',
        title: 'Scripture Distribution',
        description: 'Distributing sacred Hindu texts including Bhagavad Gita, Ramayana, and Upanishads to temples, institutions, and individuals worldwide.',
        stats: '5,000+ Texts'
      },
      {
        icon: 'GraduationCap',
        title: 'Community Education',
        description: 'Online and offline classes on Vedic scriptures, Sanskrit mantras, meditation techniques, and Hindu philosophy for all ages.',
        stats: '500+ Students'
      },
      {
        icon: 'Heart',
        title: 'Spiritual Support',
        description: 'Providing free spiritual counselling, guidance for religious ceremonies, and support during life transitions and challenging times.',
        stats: 'Always Available'
      }
    ]
  },
  impactStories: {
    badge: 'Real Stories',
    title: 'Lives We\'ve Touched',
    description: 'Hear from the hearts of those whose lives have been transformed through our spiritual education and community service.',
    stories: [
      {
        name: 'Priya Sharma',
        role: 'Student',
        story: 'eYogi Gurukul introduced me to the profound wisdom of the Bhagavad Gita. The classes helped me find peace and direction during a challenging phase in my life. The teachings are practical, relatable, and life-changing.',
        image: '/images/Raj 1.jpg',
        location: 'Dublin, Ireland'
      },
      {
        name: 'Anil Kapoor',
        role: 'Parent',
        story: 'My children have been attending eYogi Gurukul classes for two years. They have developed a deep respect for our culture and traditions. Rajesh Ji\'s ability to engage children is remarkable.',
        image: '/images/Raj 2.jpg',
        location: 'Cork, Ireland'
      },
      {
        name: 'Lakshmi Patel',
        role: 'Devotee',
        story: 'The free spiritual counseling I received during a difficult time was invaluable. The guidance was rooted in scriptures yet completely relevant to modern life challenges. I am forever grateful.',
        image: '/images/Raj 3.jpg',
        location: 'Galway, Ireland'
      }
    ]
  },
  missionVision: {
    badge: 'Our Purpose',
    missionTitle: 'Our Mission',
    missionDescription: 'To preserve, propagate, and make the transformative knowledge of Sanatan Dharma accessible to everyone, regardless of background or means, through authentic education and selfless service.',
    visionTitle: 'Our Vision',
    visionDescription: 'A world where the timeless wisdom of Vedic knowledge enlightens hearts and minds, creating a global community rooted in dharma, compassion, and spiritual growth.',
    coreValues: [
      {
        icon: 'Sparkle',
        title: 'Authenticity',
        description: 'We stay true to the authentic Vedic teachings and scriptural knowledge passed down through generations.'
      },
      {
        icon: 'Heart',
        title: 'Seva (Selfless Service)',
        description: 'All our educational services are offered freely as an act of devotion and commitment to the community.'
      },
      {
        icon: 'Globe',
        title: 'Inclusivity',
        description: 'We welcome seekers from all backgrounds and make spiritual knowledge accessible to everyone.'
      },
      {
        icon: 'BookOpenText',
        title: 'Education',
        description: 'We believe in empowering individuals through knowledge, understanding, and practical application of dharma.'
      }
    ]
  },
  waysToContribute: {
    badge: 'Get Involved',
    title: 'Ways to Support Our Mission',
    description: 'Your contribution, whether through donations, volunteering, or partnership, helps us continue spreading the light of dharma and supporting spiritual seekers worldwide.',
    options: [
      {
        icon: 'HandHeart',
        title: 'Make a Donation',
        description: 'Support our free educational programs, sacred text distribution, and community service initiatives.',
        buttonText: 'Donate Now',
        buttonLink: '/contact',
        features: [
          'Fund free spiritual education',
          'Support sacred text distribution',
          'Sponsor community events',
          'Help maintain resources'
        ]
      },
      {
        icon: 'Users',
        title: 'Volunteer With Us',
        description: 'Share your time and skills to help organize classes, events, and outreach programs.',
        buttonText: 'Join as Volunteer',
        buttonLink: '/contact',
        features: [
          'Teach or assist in classes',
          'Help with event organization',
          'Support online initiatives',
          'Contribute your expertise'
        ]
      },
      {
        icon: 'Handshake',
        title: 'Partner With Us',
        description: 'Collaborate with eYogi Gurukul to spread dharma through joint initiatives and programs.',
        buttonText: 'Become a Partner',
        buttonLink: '/contact',
        features: [
          'Institutional collaborations',
          'Temple partnerships',
          'Educational programs',
          'Community outreach'
        ]
      },
      {
        icon: 'Gift',
        title: 'Sponsor a Program',
        description: 'Sponsor specific programs like book distribution, student scholarships, or festival celebrations.',
        buttonText: 'Sponsor Now',
        buttonLink: '/contact',
        features: [
          'Book distribution campaigns',
          'Student sponsorships',
          'Festival celebrations',
          'Special workshops'
        ]
      }
    ]
  },
  ctaSection: {
    title: 'Join Us in Spreading the Light of Dharma',
    description: 'Together, we can preserve the sacred wisdom of Sanatan Dharma and empower future generations with spiritual knowledge that transforms lives.',
    buttons: [
      { text: 'Get Involved Today', link: '/contact', variant: 'primary' },
      { text: 'Explore Our Work', link: '#mission', variant: 'outline' }
    ],
    backgroundImage: '/images/Golden Temples of Devotion.png'
  }
}

export const defaultHeaderContent: HeaderContent = {
  logoUrl: '/Raj ji.jpg',
  siteName: 'Pandit Rajesh Joshi',
  tagline: 'Hindu Priest & Spiritual Guide',
  ctaText: 'Book Consultation',
  ctaLink: '/contact'
}

export const defaultFooterContent: FooterContent = {
  description: 'Traditional Hindu religious services, spiritual consultations, and cultural education serving the community with authenticity and devotion.',
  copyrightText: '© {year} Pandit Rajesh Joshi. All rights reserved.',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  pinterestUrl: ''
}

export const defaultDakshinaContent: DakshinaPageContent = {
  hero: {
    subtitle: 'Sacred Economics',
    title: 'Understanding Dakshina',
    description: 'In Hindu tradition, Dakshina represents the sacred exchange of energy between spiritual service and gratitude. It is not merely payment, but a blessing that sustains the continuity of spiritual knowledge and service.',
    backgroundImages: [
      '/images/South Asian Temple Complex.png',
      '/images/Golden Temples of Devotion.png',
      '/images/Traditional Altar with Marigold Flowers.png'
    ]
  },
  whatIsDakshina: {
    title: 'What is Dakshina?',
    subtitle: 'The Sacred Exchange of Spiritual Service',
    content: '<p>In Hindu tradition, Dakshina (दक्षिणा) is a fundamental concept that goes beyond monetary transaction. It represents the sacred exchange between spiritual knowledge and service, and the gratitude of those who receive it.</p><p>The word "Dakshina" comes from the Sanskrit "dakṣiṇā" meaning "gift" or "offering to the right." In ancient times, when knowledge was transmitted orally, students would offer their teacher a gift with their right hand as a token of respect and gratitude.</p><p>Today, Dakshina serves multiple purposes: it sustains the priest\'s livelihood, ensures the continuity of spiritual traditions, and creates positive karma for both the giver and receiver.</p>',
    keyPoints: [
      {
        title: 'Sacred Exchange',
        description: 'Dakshina is not payment for services, but a sacred exchange of spiritual energy and gratitude.'
      },
      {
        title: 'Teacher\'s Sustenance',
        description: 'It ensures that spiritual teachers and priests can dedicate their lives to service without material concerns.'
      },
      {
        title: 'Karma Creation',
        description: 'Giving Dakshina creates positive karma and strengthens the bond between teacher and student.'
      }
    ]
  },
  pricingSection: {
    badge: 'Transparent Pricing',
    title: 'Our Dakshina Guidelines',
    description: 'We believe in transparent and fair pricing that reflects the time, preparation, and spiritual dedication required for each ceremony.',
    services: [
      {
        name: 'Simple Pooja (1-2 hours)',
        description: 'Basic ceremonies like daily worship, small blessings',
        duration: '1-2 hours',
        price: '50-100'
      },
      {
        name: 'Special Ceremony (2-4 hours)',
        description: 'Festive poojas, naming ceremonies, house warming',
        duration: '2-4 hours',
        price: '150-300'
      },
      {
        name: 'Major Rituals (4-8 hours)',
        description: 'Weddings, funerals, major life cycle events',
        duration: '4-8 hours',
        price: '400-800'
      },
      {
        name: 'Extended Services (Multiple days)',
        description: 'Multi-day ceremonies, special consultations',
        duration: 'Varies',
        price: '1000+'
      }
    ],
    notes: [
      'Prices are guidelines and may vary based on specific requirements and materials needed',
      'Travel expenses may be additional for ceremonies outside Dublin area',
      'All prices include preparation time, materials, and post-ceremony guidance',
      'Payment can be made via bank transfer, cash, or traditional offerings'
    ]
  },
  ctaSection: {
    title: 'Ready to Begin Your Spiritual Journey?',
    description: 'Contact us today to discuss your ceremony needs and receive personalized guidance for your spiritual practices.',
    primaryButtonText: 'Contact Us',
    secondaryButtonText: 'View Services'
  }
}

export const defaultMenuItems: MenuItem[] = [
  { label: 'Home', url: '/', order: 1 },
  { label: 'About', url: '/about', order: 2 },
  { label: 'Services', url: '/services', order: 3 },
  { label: 'Gallery', url: '/gallery', order: 4 },
  { label: 'Testimonials', url: '/testimonials', order: 5 },
  { label: 'Contact', url: '/contact', order: 6 }
]
