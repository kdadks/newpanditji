import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent } from '../ui/card'
import { 
  EnvelopeSimple, 
  WhatsappLogo, 
  MapPin, 
  Phone, 
  Clock,
  Sparkle,
  CheckCircle,
  Heart,
  Shield
} from '@phosphor-icons/react'
import { Badge } from '../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useContactContent } from '@/hooks/useCmsContent'
import { renderHighlightedTitle } from '@/utils/renderHighlight'
import { toast } from 'sonner'
import { usePageMetadata } from '@/hooks/usePageMetadata'

interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export default function ContactPage() {
  const { content: cmsContent, isLoading } = useContactContent()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // SEO Configuration
  usePageMetadata('contact')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    const mailtoLink = `mailto:${cmsContent.email}?subject=Service Inquiry: ${formData.service || 'General'}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AService Interest: ${formData.service}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`
    window.location.href = mailtoLink

    toast.success('Opening your email client...')

    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
  }

  const toggleItem = (itemId: string) => {
    console.log('Toggling FAQ item:', itemId, 'Current expanded:', expandedItem)
    setExpandedItem(prev => prev === itemId ? null : itemId)
  }

  if (isLoading || !cmsContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const renderFAQAccordion = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Questions Column */}
      <div className="space-y-4">
        {cmsContent.faqSection.faqs.map((faq, index) => (
          <div
            key={faq.id || `faq-${index}`}
            className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
              expandedItem === faq.id
                ? 'bg-primary/10 border-2 border-primary shadow-lg'
                : 'bg-white/50 border-2 border-transparent hover:bg-white/70 hover:border-primary/30'
            }`}
            onClick={() => toggleItem(faq.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                expandedItem === faq.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}>
                <span className="font-semibold text-sm">{index + 1}</span>
              </div>
              <h3 className={`font-semibold text-lg transition-colors ${
                expandedItem === faq.id ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}>
                {faq.question}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Column */}
      <div className="lg:sticky lg:top-8">
        {expandedItem ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border-2 border-primary/20 shadow-lg min-h-[300px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="text-primary" size={24} weight="fill" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-primary">
                Answer
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {cmsContent.faqSection.faqs.find(faq => faq.id === expandedItem)?.answer}
            </p>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 border-2 border-dashed border-primary/30 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Sparkle className="mx-auto mb-4 text-primary/50" size={48} weight="fill" />
              <p className="text-muted-foreground text-lg">
                Click on a question to see the answer here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-1-${index}-${img.substring(img.lastIndexOf('/') + 1)}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {cmsContent.hero.backgroundImages.map((img, index) => (
              <img key={`bg-2-${index}-${img.substring(img.lastIndexOf('/') + 1)}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" />
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
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <Heart size={18} weight="fill" className="animate-pulse" />
              {cmsContent.hero.badge}
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {renderHighlightedTitle(cmsContent.hero.title)}
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {cmsContent.hero.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {cmsContent.hero.quickActions.map((action, index) => (
                <Button
                  key={`action-${index}-${action.text.replace(/\s+/g, '-')}`}
                  size="lg"
                  className={`group px-8 py-4 text-lg font-semibold ${
                    index === 0 
                      ? 'bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-amber-900/50'
                      : index === 1
                      ? 'bg-linear-to-r from-green-700 via-emerald-700 to-green-800 text-white hover:from-green-800 hover:via-emerald-800 hover:to-green-900 shadow-green-800/50'
                      : 'bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white hover:from-blue-800 hover:via-indigo-800 hover:to-blue-900 shadow-blue-800/50'
                  } shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 ${
                    index === 0 ? 'border-amber-700/30' : index === 1 ? 'border-green-600/40' : 'border-blue-600/40'
                  }`}
                  onClick={() => {
                    if (action.link.startsWith('#')) {
                      document.getElementById(action.link.substring(1))?.scrollIntoView({ behavior: 'smooth' })
                    } else if (action.link.startsWith('http')) {
                      window.open(action.link, '_blank', 'noopener,noreferrer')
                    } else {
                      window.location.href = action.link
                    }
                  }}
                >
                  {index === 0 ? <EnvelopeSimple size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" /> :
                   index === 1 ? <WhatsappLogo size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" /> :
                   <Sparkle size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />}
                  {action.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            {cmsContent.hero.trustIndicators.map((indicator, index) => (
              <div key={`trust-${index}-${indicator.title.replace(/\s+/g, '-')}`} className="flex items-center justify-center gap-3 p-6">
                {index === 0 ? <Clock size={28} className="text-amber-400 shrink-0" weight="fill" /> :
                 index === 1 ? <Shield size={28} className="text-amber-400 shrink-0" weight="fill" /> :
                 <Sparkle size={28} className="text-amber-400 shrink-0" weight="fill" />}
                <div className="text-left">
                  <div className="font-bold text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{indicator.title}</div>
                  <div className="text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{indicator.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Contact Form & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Enhanced Contact Form */}
            <div id="contact-form" className="order-2 lg:order-1">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-linear-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                      <EnvelopeSimple className="text-white" size={28} weight="fill" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-3xl text-primary">{cmsContent.hero.subtitle}</h2>
                      <p className="text-muted-foreground">Let's start your spiritual journey together</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-primary flex items-center gap-2">
                          <span>{cmsContent.form.nameLabel}</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          className="h-12 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-primary flex items-center gap-2">
                          <span>{cmsContent.form.emailLabel}</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="h-12 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-primary">
                        {cmsContent.form.phoneLabel} <span className="text-muted-foreground font-normal">({cmsContent.form.phoneOptional})</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+353 XX XXX XXXX"
                        className="h-12 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-sm font-semibold text-primary">
                        {cmsContent.form.serviceLabel}
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm">
                          <SelectValue placeholder={cmsContent.form.servicePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="pooja">Pooja Ceremony</SelectItem>
                          <SelectItem value="wedding">Wedding Ceremony</SelectItem>
                          <SelectItem value="funeral">Funeral Rites</SelectItem>
                          <SelectItem value="consultation">Spiritual Consultation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-primary flex items-center gap-2">
                        <span>{cmsContent.form.messageLabel}</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={cmsContent.form.messagePlaceholder}
                        className="min-h-32 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <EnvelopeSimple size={20} className="mr-3" />
                      {cmsContent.form.submitButtonText}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      {cmsContent.form.responseText}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2 space-y-6">
              <Card className="border-0 shadow-xl bg-linear-to-br from-primary/5 to-primary/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <h2 className="font-heading font-semibold text-2xl">Get in Touch</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <EnvelopeSimple size={24} className="text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold mb-1 text-foreground">{cmsContent.contactInfoCard.emailLabel}</p>
                        <a href={`mailto:${cmsContent.email}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          {cmsContent.email}
                        </a>
                        <Badge variant="secondary" className="ml-2 text-xs">{cmsContent.contactInfoCard.emailBadge}</Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <WhatsappLogo size={24} className="text-primary mt-1 shrink-0" weight="fill" />
                      <div>
                        <p className="font-semibold mb-1 text-foreground">{cmsContent.contactInfoCard.whatsappLabel}</p>
                        <a href={`https://wa.me/${cmsContent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          {cmsContent.whatsapp}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">{cmsContent.contactInfoCard.whatsappText}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <MapPin size={24} className="text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold mb-1 text-foreground">{cmsContent.contactInfoCard.serviceAreaLabel}</p>
                        <p className="text-muted-foreground text-sm">
                          {cmsContent.contactInfoCard.serviceAreaText}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">{cmsContent.contactInfoCard.serviceAreaBadge}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-linear-to-r from-accent/10 via-primary/5 to-secondary/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl">{cmsContent.responseGuarantee.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {cmsContent.responseGuarantee.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cmsContent.responseGuarantee.badges.map((badge, index) => (
                      <Badge key={`badge-${index}-${badge.replace(/\s+/g, '-')}`} variant="secondary" className="text-xs">{badge}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq-section" className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkle size={16} weight="fill" />
                {cmsContent.faqSection.badge}
              </div>
              <h2 className="font-heading font-semibold text-3xl mb-4">{cmsContent.faqSection.title}</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <Card className="border-0 shadow-xl bg-linear-to-br from-card to-card/80">
              <CardContent className="p-8">
                {renderFAQAccordion()}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
