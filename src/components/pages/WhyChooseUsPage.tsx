import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Heart, GraduationCap, FlowerLotus, ListChecks, UsersFour, Globe, Sparkle, BookOpen, CheckCircle } from '@phosphor-icons/react'
import { usePageSEO } from '../../hooks/usePageSEO'

export default function WhyChooseUsPage() {
  // SEO Configuration
  usePageSEO({
    title: 'Why Choose Rajesh Joshi | Authentic Vedic Poojas with Heart & Knowledge',
    description: '6 compelling reasons to choose Rajesh Ji for your spiritual ceremonies: 20+ years experience, authentic Vedic rituals, scholarly expertise, personalized service, 30+ pooja offerings, and online E-Pooja options available worldwide.',
    keywords: 'why choose Hindu priest, authentic Vedic poojas, experienced pandit, personalized rituals, online pooja, E-pooja Ireland, traditional Hindu ceremonies, Vedic priest Ireland',
    canonicalUrl: 'https://panditrajesh.com/why-choose-us'
  })

  const reasons = [
    {
      icon: Heart,
      title: "Passion – Devotion That Flows From the Heart",
      gradient: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      description: "Every pooja performed by Rajesh Ji is rooted in genuine bhakti, compassion, and a lifelong commitment to Sanatana Dharma. His spiritual journey began when stress and anxiety once touched his life, leading him towards meditation, scriptures, and inner transformation. This awakening created an unshakeable passion to serve, guide, and uplift families.",
      impact: "When you invite Rajesh Ji, you receive a priest who brings love, sincerity, and a pure intention into your home—making every ritual emotionally meaningful and spiritually elevating.",
      shloka: {
        sanskrit: "मन: प्रसाद: सौम्यत्वं मौनमात्मविनिग्रह: | भावसंशुद्धिरित्येतत्तपो मानसमुच्यते ||",
        reference: "Bhagavad Gita 17.16",
        hindi: "मन की शांति, विनम्रता, मौन, आत्म-संयम और पवित्रता को मन की तपस्या कहा जाता है।",
        english: "Tranquillity of mind, gentleness, silence, self-control and purity of purpose are known as austerities of the mind."
      }
    },
    {
      icon: GraduationCap,
      title: "Experience & a Scholarly Mind – 20+ Years of Jnana & Seva",
      gradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      description: "Rajesh Ji has been performing poojas since 2001 and is recognised as a scholar of Hinduism and the Indian Knowledge System. With deep study of Vedas, Upanishads, the Puranas, Itihasas, Yogic literature, Tantra texts and 10,000+ years of Indian wisdom, he brings unmatched authenticity to every ritual.",
      impact: "He doesn't just perform—he explains the origin of slokas, the meaning behind mantras, and the exact shastric references, blending ancient spiritual wisdom with modern scientific understanding. His experience also comes from teaching hundreds of students, giving lectures, writing books, and sharing knowledge across Ireland and beyond.",
      highlights: [
        "200+ poojas performed since 2001",
        "Scholar of Vedas, Upanishads, Puranas & Itihasas",
        "Published author of 5+ books on Hinduism",
        "Taught hundreds of students through eYogi Gurukul",
        "Bridges ancient wisdom with modern science"
      ]
    },
    {
      icon: FlowerLotus,
      title: "Authentic & Vedic – No Shortcuts, Only Purity",
      gradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      description: "In an age where many rituals are shortened or diluted, Rajesh Ji stands firm in offering complete, traditional, and Vedic poojas. Every step—from sankalpa to samarpan—is performed with precision, clarity, and devotion.",
      impact: "He never rushes or skips mantras. Instead, he performs rituals exactly as prescribed in the scriptures, ensuring that the energy, sanctity, and blessings reach your home in their fullest essence. His presence creates an atmosphere of purity, peace, and divine connection that stays with the family long after the pooja ends.",
      highlights: [
        "Complete traditional Vedic rituals",
        "Every mantra chanted with precision",
        "Follows scriptural procedures exactly",
        "No shortcuts or dilution of practices",
        "Creates lasting spiritual atmosphere"
      ]
    },
    {
      icon: ListChecks,
      title: "Wide Range of Services – Over 30+ Pooja Offerings",
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      description: "From Griha Pravesh to Naamkaran, Satyanarayana Katha to Durga Puja, Lakshmi Puja to Rudrabhishek, Rajesh Ji performs over 30 different poojas and samskaras according to Vedic tradition.",
      impact: "Whether you want a spiritual ceremony for your family, a sacred function, or a community-level group pooja, you benefit from his broad expertise, clear guidance, and calm leadership. Each ritual is conducted with care, ensuring that every family receives the exact blessings they seek.",
      highlights: [
        "30+ different poojas and samskaras",
        "Family ceremonies to community events",
        "Life cycle rituals from birth to marriage",
        "Festival poojas for all major occasions",
        "Custom ceremonies based on needs"
      ]
    },
    {
      icon: UsersFour,
      title: "Convenient & Personalised Rituals – Regional Traditions Honoured",
      gradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      description: "Every Hindu family carries unique customs, regional practices, and ancestral traditions. Rajesh Ji fully respects this diversity. Before each ceremony, he collaborates with the Yajamana (host) to understand their background—North Indian, South Indian, Nepali, Marathi, Gujarati, Tamil, Bengali, or mixed traditions.",
      impact: "He then personalises the pooja accordingly, ensuring the rituals feel familiar, comfortable, and authentic to your family's roots. His warm connection with children, elders, and guests ensures that everyone participates, learns, and feels blessed.",
      highlights: [
        "Respects all regional traditions",
        "Customizes rituals to family customs",
        "North Indian, South Indian & all regions",
        "Engages children, elders & all guests",
        "Makes everyone feel included"
      ]
    },
    {
      icon: Globe,
      title: "E-Pooja & Online Options – Connecting Families Worldwide",
      gradient: "from-cyan-50 to-sky-50",
      borderColor: "border-cyan-200",
      iconBg: "bg-cyan-100",
      description: "Distance is no barrier to devotion. For families across Ireland, Europe, India, or anywhere in the world, Rajesh Ji offers E-Pooja (Online Pooja) options. With clear instructions, digital guidance, and live chanting, families can participate from their home, even if unable to attend physically.",
      impact: "Online poojas are conducted with the same sincerity and shastric authenticity, making spiritual connection accessible to all.",
      highlights: [
        "Students living abroad can participate",
        "Families spread across multiple locations",
        "Health or travel restrictions accommodated",
        "Same authenticity as in-person ceremonies",
        "Available worldwide with digital guidance"
      ]
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 flex">
          <div className="flex animate-scroll-left">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
          </div>
          <div className="flex animate-scroll-left" aria-hidden="true">
            <img src="/images/South Asian Temple Complex.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Golden Temples of Devotion.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/Traditional Altar with Marigold Flowers.png" alt="" className="h-full w-auto object-cover opacity-40" />
            <img src="/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png" alt="" className="h-full w-auto object-cover opacity-40" />
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
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Why Choose <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Pandit Rajesh Joshi</span>
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Experience the perfect blend of authentic Vedic traditions, scholarly wisdom, and heartfelt devotion
            </p>
          </div>

          {/* Quick Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <Heart className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Genuine Bhakti</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <GraduationCap className="mx-auto mb-2 text-amber-400" size={32} />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">20+ Years</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <FlowerLotus className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">100% Vedic</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <ListChecks className="mx-auto mb-2 text-amber-400" size={32} />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">30+ Poojas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <UsersFour className="mx-auto mb-2 text-amber-400" size={32} weight="fill" />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Personalized</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <Globe className="mx-auto mb-2 text-amber-400" size={32} />
              <p className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">E-Pooja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-8 md:py-12">

        {/* Main Reasons */}
        <div className="space-y-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br ${reason.gradient}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon Section */}
                    <div className="shrink-0">
                      <div className={`w-16 h-16 ${reason.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-primary" size={32} weight="fill" />
                      </div>
                      <Badge variant="outline" className="mt-4 text-xs">{index + 1} of 6</Badge>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <h2 className="font-heading font-bold text-2xl mb-4 text-foreground">
                        {reason.title}
                      </h2>

                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        {reason.description}
                      </p>

                      <div className={`bg-white/50 border ${reason.borderColor} rounded-lg p-4 mb-4`}>
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-semibold">Impact:</span> {reason.impact}
                        </p>
                      </div>

                      {/* Highlights */}
                      {reason.highlights && (
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
        <Card className="mt-12 border-0 shadow-xl bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <Sparkle className="mx-auto mb-4 text-primary" size={48} weight="fill" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-foreground">
              Experience the Difference
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              When you choose Rajesh Ji, you're not just booking a priest—you're inviting a scholar, a
              devotee, and a guide who will make your spiritual ceremony truly unforgettable. Every pooja
              is performed with authenticity, explained with wisdom, and infused with genuine bhakti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <ListChecks size={20} />
                View All Services
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                <Heart size={20} weight="fill" />
                Book a Consultation
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
