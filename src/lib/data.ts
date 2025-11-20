export interface Service {
  id: string
  name: string
  category: 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness'
  duration: string
  description: string
  // Detailed information (optional)
  detailedDescription?: string
  benefits?: string[]
  includes?: string[]
  requirements?: string[]
  price?: string
  bestFor?: string[]
}

export const services: Service[] = [
  {
    id: 'satyanarayana-pooja',
    name: 'Satyanarayana Pooja',
    category: 'pooja',
    duration: '2.5 hours',
    description: 'Worship of Lord Satyanarayana for prosperity, peace, and fulfillment of wishes. One of the most popular Hindu ceremonies for family well-being.'
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi Pooja',
    category: 'pooja',
    duration: '2 hours',
    description: 'Festival worship of Lord Ganesha, the remover of obstacles and bestower of success. Celebrated with devotion and joy.'
  },
  {
    id: 'navagraha-pooja',
    name: 'Navagraha Pooja/Havana',
    category: 'pooja',
    duration: '2 hours',
    description: 'Worship of the nine planets to mitigate negative planetary influences and enhance positive energies in life.'
  },
  {
    id: 'vastu-shanti',
    name: 'Vastu Shanti/Griha Pravesh',
    category: 'pooja',
    duration: '2.5 hours',
    description: 'Home blessing and housewarming ceremony to invoke positive energies, peace, and prosperity in a new residence.'
  },
  {
    id: 'lakshmi-puja',
    name: 'Maha Lakshmi Puja - Deepawali Pooja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Goddess Lakshmi for wealth, prosperity, and abundance. Traditionally performed during Deepawali festival.'
  },
  {
    id: 'durga-puja',
    name: 'Durga Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of the powerful Mother Goddess Durga for strength, protection, and victory over negativity.'
  },
  {
    id: 'hanuman-puja',
    name: 'Hanuman Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Lord Hanuman for courage, strength, devotion, and protection from negative energies.'
  },
  {
    id: 'shiva-puja',
    name: 'Shiva Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Lord Shiva, the supreme consciousness, for spiritual growth, peace, and liberation.'
  },
  {
    id: 'krishna-janmashtami',
    name: 'Krishna Janmashtami Puja',
    category: 'pooja',
    duration: '2.5 hours',
    description: 'Celebration of Lord Krishna\'s birthday with devotional worship, bhajans, and spiritual joy.'
  },
  {
    id: 'surya-puja',
    name: 'Surya Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of the Sun deity for health, vitality, success, and removal of health-related issues.'
  },
  {
    id: 'saraswati-puja',
    name: 'Saraswati Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Goddess Saraswati for learning, knowledge, wisdom, and success in education and arts.'
  },
  {
    id: 'vara-lakshmi',
    name: 'Vara Lakshmi Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Special worship for married women seeking blessings of prosperity and family well-being.'
  },
  {
    id: 'venkatesha-puja',
    name: 'Venkatesha Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Lord Venkateswara (Balaji) for wealth, success, and spiritual fulfillment.'
  },
  {
    id: 'dhanvantari-puja',
    name: 'Dhanvantari Puja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of Lord Dhanvantari, the deity of health and Ayurveda, for healing and well-being.'
  },
  {
    id: 'tulasi-pooja',
    name: 'Tulasi Pooja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Worship of the sacred Tulasi plant for purification, health, and spiritual benefits.'
  },
  {
    id: 'mahamrityunjay',
    name: 'Mahamrityunjay Jaap/Yajna',
    category: 'pooja',
    duration: '2 hours',
    description: 'Powerful mantra recitation for protection from negative energies, health issues, and obstacles.'
  },
  {
    id: 'rudrabhishek',
    name: 'Shiva Rudrabhishek Pooja',
    category: 'pooja',
    duration: '2 hours',
    description: 'Special elaborate worship of Lord Shiva with sacred abhishek (bathing) ritual for blessings and peace.'
  },
  {
    id: 'gayatri-jaap',
    name: 'Gayatri Jaap/Yajna',
    category: 'pooja',
    duration: '2 hours',
    description: 'Recitation of the sacred Gayatri mantra for spiritual illumination, wisdom, and purification.'
  },
  {
    id: 'bhoomi-pooja',
    name: 'Bhoomi Pooja',
    category: 'pooja',
    duration: '1.5 hours',
    description: 'Land blessing ceremony performed before construction to seek permission from Earth deity and ensure success.'
  },
  {
    id: 'car-pooja',
    name: 'Car Pooja (Vastu Pooja)',
    category: 'pooja',
    duration: '1 hour',
    description: 'Vehicle blessing ceremony for safety, protection, and auspicious journeys.'
  },
  {
    id: 'business-opening',
    name: 'Business Opening Pooja',
    category: 'pooja',
    duration: '2 hours',
    description: 'Auspicious ceremony for new business ventures to invoke success, prosperity, and positive energy.'
  },
  {
    id: 'kul-devi-devata',
    name: 'Gram/Ishta/Kul Devi-Devata Pooja',
    category: 'pooja',
    duration: '2 hours',
    description: 'Worship of local, personal, and family deities for ancestral blessings and protection.'
  },
  {
    id: 'namakaran',
    name: 'Namakaran',
    category: 'sanskar',
    duration: '1.5 hours',
    description: 'Traditional naming ceremony for newborns, performed to bestow auspicious name and blessings.'
  },
  {
    id: 'anna-prasana',
    name: 'Anna Prasana',
    category: 'sanskar',
    duration: '1.5 hours',
    description: 'First feeding ceremony marking the introduction of solid food to the baby with divine blessings.'
  },
  {
    id: 'mundan-sanskar',
    name: 'Chuda Karma/Mundan Sanskar',
    category: 'sanskar',
    duration: '1.5 hours',
    description: 'First haircut ceremony for children, symbolizing purification and new beginnings.'
  },
  {
    id: 'sagai',
    name: 'Sagai',
    category: 'sanskar',
    duration: '1.5 hours',
    description: 'Engagement ceremony marking the formal commitment between bride and groom with family blessings.'
  },
  {
    id: 'vivah',
    name: 'Vivah',
    category: 'sanskar',
    duration: '4 hours',
    description: 'Complete Hindu wedding ceremony with sacred rituals uniting two souls in divine matrimony.'
  },
  {
    id: 'antim-sanskar',
    name: 'Antim Sanskar or Daha Sanskar',
    category: 'sanskar',
    duration: '1+1 hours',
    description: 'Last rites ceremony performed with reverence and proper rituals for the departed soul\'s journey.'
  },
  {
    id: 'sraddha',
    name: 'Sraddha Pooja',
    category: 'sanskar',
    duration: '2 hours',
    description: 'Ancestor worship ceremony to honor and seek blessings from departed family members.'
  },
  {
    id: 'garun-puran-short',
    name: 'Garun Puran Short',
    category: 'paath',
    duration: '2 hours',
    description: 'Recitation of sacred text providing guidance for the departed soul and family peace.'
  },
  {
    id: 'garun-puran-full',
    name: 'Garun Puran Full',
    category: 'paath',
    duration: '2 x 3 hours',
    description: 'Complete recitation of Garuda Purana, comprehensive spiritual guidance for death rituals.'
  },
  {
    id: 'sundar-kanda',
    name: 'Sundar Kanda Paath and Pooja',
    category: 'paath',
    duration: '3 hours',
    description: 'Recitation of the beautiful Ramayana chapter describing Hanuman\'s devotion and valor.'
  },
  {
    id: 'ramayana-complete',
    name: 'Sampurna Ramayana Paath/Havana',
    category: 'paath',
    duration: '24 hours',
    description: 'Complete recitation of the sacred Ramayana epic over multiple sessions for divine blessings.'
  },
  {
    id: 'bhagavatam-short',
    name: 'Srimad Bhagavatam Paath Short',
    category: 'paath',
    duration: '2 hours',
    description: 'Recitation of selected chapters from the sacred Bhagavata Purana about Lord Krishna.'
  },
  {
    id: 'bhagavatam-complete',
    name: 'Srimad Bhagavatam Paath Complete',
    category: 'paath',
    duration: 'Multiple days',
    description: 'Complete recitation of all twelve cantos of Srimad Bhagavatam for profound spiritual benefit.'
  },
  {
    id: 'dharma-speech',
    name: 'Motivational Speech on Dharma',
    category: 'consultation',
    duration: '15 min to 1.5 hours',
    description: 'Inspiring discourse on dharma, duty, and righteous living based on Hindu philosophy and scriptures.'
  },
  {
    id: 'family-guidance',
    name: 'Guidance to Family with Issues',
    category: 'consultation',
    duration: '1 hour',
    description: 'Compassionate spiritual counseling for families facing challenges, providing wisdom and practical guidance.'
  },
  {
    id: 'stress-management',
    name: 'Stress/Anxiety/Depression Management',
    category: 'consultation',
    duration: '1 hour',
    description: 'Holistic consultation combining spiritual wisdom and practical techniques for mental wellness.'
  },
  {
    id: 'guided-meditation',
    name: 'Guided Meditation',
    category: 'wellness',
    duration: '1 hour plus',
    description: 'Peaceful meditation sessions guided by traditional techniques for inner calm and spiritual growth.'
  },
  {
    id: 'yoga-asana',
    name: 'Yoga (Asana and Pranayama)',
    category: 'wellness',
    duration: '1 hour plus',
    description: 'Traditional yoga practice including physical postures and breath control for holistic well-being.'
  }
]

export const videos = [
  {
    id: 'hinduism-science',
    title: 'Hinduism and Science Lecture',
    category: 'educational',
    url: 'https://youtu.be/O8spP86OTTg'
  },
  {
    id: 'hinduism-basics',
    title: 'Hinduism Basics for Irish Students',
    category: 'educational',
    url: 'https://youtu.be/YeHE8a3m_hg'
  },
  {
    id: 'hindu-scriptures',
    title: 'Hindu Scriptures Overview',
    category: 'educational',
    url: 'https://youtu.be/4YIkfX-OY6k'
  },
  {
    id: 'navaratri-science',
    title: 'Navaratri Science',
    category: 'educational',
    url: 'https://youtu.be/DAVeXgfBprw'
  },
  {
    id: 'hinduism-15min',
    title: 'Hinduism in 15 minutes',
    category: 'educational',
    url: 'https://youtu.be/FwSWgnAzfSM'
  },
  {
    id: 'pathar-ki-pratiksha',
    title: 'Pathar Ki Pratiksha Poem',
    category: 'poetry',
    url: 'https://youtu.be/r99sntvoD5Q'
  },
  {
    id: 'loved-and-lived',
    title: 'Loved and Lived Poem',
    category: 'poetry',
    url: 'https://youtu.be/SWHnlJNkLYo'
  },
  {
    id: 'mere-ghar-ek-beti',
    title: 'Mere Ghar Ek Beti Hai',
    category: 'poetry',
    url: 'https://youtu.be/uETVb822KTw'
  },
  {
    id: 'one-rotary-gita',
    title: 'One Rotary One Gita Project',
    category: 'charity',
    url: 'https://youtu.be/92VjrCUL1K8'
  },
  {
    id: 'hare-krishna-ireland',
    title: 'Hare Krishna Movement in Ireland',
    category: 'podcast',
    url: 'https://youtu.be/KB_fvzis8VM'
  },
  {
    id: 'indian-food-ireland',
    title: 'Indian Food in Ireland',
    category: 'podcast',
    url: 'https://youtu.be/N4tA-Gt8pfs'
  },
  {
    id: 'stress-killer',
    title: 'Stress the Killer',
    category: 'podcast',
    url: 'https://youtu.be/0-vCRP3i-mY'
  },
  {
    id: 'business-vedanta',
    title: 'Business to Vedanta',
    category: 'podcast',
    url: 'https://youtu.be/Ld9oWNtRT8E'
  },
  {
    id: '1980s-ireland',
    title: '1980s Ireland',
    category: 'podcast',
    url: 'https://youtu.be/uN1afFk_Tgw'
  }
]

export const categoryNames = {
  pooja: 'Poojas',
  sanskar: 'Sanskars',
  paath: 'Paath/Recitations',
  consultation: 'Consultations',
  wellness: 'Meditation & Yoga'
}

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    text: 'Pandit Rajesh Ji performed our housewarming ceremony with such devotion and knowledge. Every ritual was explained beautifully. We felt truly blessed.',
    service: 'Griha Pravesh'
  },
  {
    id: 2,
    name: 'Amit Patel',
    text: 'The wedding ceremony was perfect! Pandit Ji made sure both families understood each ritual and created such a sacred atmosphere. Highly recommended.',
    service: 'Vivah'
  },
  {
    id: 3,
    name: 'Lakshmi Iyer',
    text: 'Excellent knowledge of scriptures and very patient in explaining everything. The Satyanarayana Pooja at our home brought so much peace to our family.',
    service: 'Satyanarayana Pooja'
  }
]

export const blogArticles = [
  {
    id: 'significance-pooja',
    title: 'The Significance of Regular Pooja in Modern Life',
    excerpt: 'Discover how ancient pooja practices remain relevant and beneficial in contemporary living, bringing peace and spiritual connection.',
    category: 'Spiritual Practice'
  },
  {
    id: 'understanding-sanskars',
    title: 'Understanding Hindu Sanskars: Life\'s Sacred Milestones',
    excerpt: 'An exploration of the sixteen sanskars that mark important transitions in a Hindu\'s spiritual journey from birth to beyond.',
    category: 'Hindu Traditions'
  },
  {
    id: 'vedic-astrology',
    title: 'Vedic Astrology and Navagraha Worship',
    excerpt: 'Learn how the nine planets influence our lives and the spiritual remedies prescribed in ancient Vedic wisdom.',
    category: 'Astrology'
  }
]
