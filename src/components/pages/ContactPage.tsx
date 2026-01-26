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
  CheckCircle
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  if (isLoading || !cmsContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 z-0">
          {cmsContent.hero.backgroundImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                transform: `scale(${1 + index * 0.05})`,
                animation: `float ${20 + index * 5}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkle size={16} weight="fill" />
              {cmsContent.hero.badge}
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
              {renderHighlightedTitle(cmsContent.hero.title)}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {cmsContent.hero.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {cmsContent.hero.quickActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  variant={index === 0 ? 'default' : 'outline'}
                >
                  <a href={action.link}>
                    <EnvelopeSimple size={20} className="mr-2" />
                    {action.text}
                  </a>
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {cmsContent.hero.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary" weight="fill" />
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{indicator.title}:</span> {indicator.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="font-heading font-semibold text-3xl mb-2">{cmsContent.hero.subtitle}</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and I'll get back to you within 24 hours
                  </p>

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
                          placeholder="Your full name"
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
            <div className="space-y-6">
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
                      <Badge key={index} variant="secondary" className="text-xs">{badge}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq-section" className="max-w-6xl mx-auto mt-16">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Questions Column */}
                  <div className="space-y-4">
                    {cmsContent.faqSection.faqs.map((faq, index) => (
                      <div
                        key={faq.id}
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
                      <div className="bg-white/50 rounded-lg p-8 border-2 border-dashed border-primary/30 min-h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground text-center">
                          <Sparkle size={32} className="mx-auto mb-4 text-primary" weight="fill" />
                          Click on a question to see the answer
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
