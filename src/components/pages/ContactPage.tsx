import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Badge } from '../ui/badge'
import { EnvelopeSimple, Phone, WhatsappLogo, MapPin, Clock, Shield, Heart, Sparkle, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { categoryNames } from '../../lib/data'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useContactContent } from '../../hooks/useCmsContent'

export default function ContactPage() {
  // CMS Content
  const { content: cmsContent } = useContactContent()

  // SEO Configuration
  usePageSEO({
    title: 'Contact Pandit Rajesh Joshi | Book Hindu Pooja Services in Ireland, UK, Northern Ireland',
    description: 'Contact Pandit Rajesh Joshi to book authentic Hindu poojas, ceremonies, and spiritual consultations in Ireland, UK, and Northern Ireland. Quick response within 24 hours.',
    keywords: 'contact pandit, book pooja, Hindu priest contact, book Hindu ceremony, pooja booking, spiritual consultation booking, contact Hindu priest Ireland',
    canonicalUrl: 'https://panditrajesh.com/contact'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    const mailtoLink = `mailto:panditjoshirajesh@gmail.com?subject=Service Inquiry: ${formData.service || 'General'}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AService Interest: ${formData.service}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`

    window.location.href = mailtoLink

    toast.success('Opening your email client...')

    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {['/images/Raj 1.jpg', '/images/Raj 3.jpg', '/images/Pooja 2.jpg', '/images/Traditional Altar with Marigold Flowers.png'].map((img, index) => (
              <img key={`bg-1-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" />
            ))}
            {['/images/Raj 1.jpg', '/images/Raj 3.jpg', '/images/Pooja 2.jpg', '/images/Traditional Altar with Marigold Flowers.png'].map((img, index) => (
              <img key={`bg-2-${index}`} src={img} alt="" className="h-full w-auto object-contain opacity-40 shrink-0" aria-hidden="true" />
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
              Connect with Divine Guidance
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              Get in <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Touch</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              Ready to begin your spiritual journey? Let's connect and discuss how I can guide you through sacred Hindu traditions and ceremonies.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="group px-8 py-4 text-lg font-semibold bg-linear-to-r from-amber-800 via-orange-900 to-amber-950 text-white hover:from-amber-900 hover:via-orange-950 hover:to-black shadow-2xl hover:shadow-3xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-700/30"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <EnvelopeSimple size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                Send Message
              </Button>
              <Button
                size="lg"
                className="group px-8 py-4 text-lg font-semibold bg-linear-to-r from-green-700 via-emerald-700 to-green-800 text-white hover:from-green-800 hover:via-emerald-800 hover:to-green-900 shadow-2xl hover:shadow-3xl shadow-green-800/50 transition-all duration-300 hover:scale-105 border-2 border-green-600/40"
                onClick={() => window.open('https://wa.me/353876927927', '_blank')}
              >
                <WhatsappLogo size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                WhatsApp Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-8 bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-linear-to-br from-primary/10 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Clock size={28} className="text-primary shrink-0" weight="fill" />
              <div className="text-left">
                <div className="font-bold text-primary text-lg">24/7 Response</div>
                <div className="text-sm text-muted-foreground">Quick replies</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-linear-to-br from-accent/10 to-primary/5 backdrop-blur-sm border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Shield size={28} className="text-accent shrink-0" weight="fill" />
              <div className="text-left">
                <div className="font-bold text-primary text-lg">Confidential</div>
                <div className="text-sm text-muted-foreground">Private & secure</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-linear-to-br from-primary/10 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkle size={28} className="text-primary shrink-0" weight="fill" />
              <div className="text-left">
                <div className="font-bold text-primary text-lg">Personalized</div>
                <div className="text-sm text-muted-foreground">Tailored guidance</div>
              </div>
            </div>
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
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-linear-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                      <EnvelopeSimple className="text-white" size={28} weight="fill" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-3xl text-primary">Send a Message</h2>
                      <p className="text-muted-foreground">Let's start your spiritual journey together</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-primary flex items-center gap-2">
                          <span>Full Name</span>
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
                          <span>Email Address</span>
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
                        Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
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
                        Service of Interest
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary/50 transition-colors shadow-sm">
                          <SelectValue placeholder="Select a service (optional)" />
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
                        <span>Your Message</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share your thoughts, questions, or how I can help you on your spiritual journey..."
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
                      Send Sacred Message
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      I typically respond within 24 hours. For urgent matters, please call directly.
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
                      <p className="font-semibold mb-1 text-foreground">Email</p>
                      <a href="mailto:panditjoshirajesh@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        panditjoshirajesh@gmail.com
                      </a>
                      <Badge variant="secondary" className="ml-2 text-xs">Primary Contact</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <WhatsappLogo size={24} className="text-primary mt-1 shrink-0" weight="fill" />
                    <div>
                      <p className="font-semibold mb-1 text-foreground">WhatsApp</p>
                      <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        +353 123 456 789
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">Click to chat directly • Instant response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <MapPin size={24} className="text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold mb-1 text-foreground">Service Area</p>
                      <p className="text-muted-foreground text-sm">
                        Serving communities worldwide with in-person and virtual ceremonies
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">Global Reach</Badge>
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
                  <h3 className="font-heading font-semibold text-xl">Quick Response Guarantee</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  We typically respond to inquiries within 24 hours. For urgent ceremony needs,
                  please contact us directly via WhatsApp or phone for immediate assistance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">24hr Response</Badge>
                  <Badge variant="secondary" className="text-xs">Weekend Available</Badge>
                  <Badge variant="secondary" className="text-xs">Emergency Support</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkle size={16} weight="fill" />
              Common Questions
            </div>
            <h2 className="font-heading font-semibold text-3xl mb-4">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <Card className="border-0 shadow-xl bg-linear-to-br from-card to-card/80">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">1</span>
                      </div>
                      How do I book a ceremony?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    Simply contact us through the form above, WhatsApp, or email with your ceremony requirements.
                    We'll discuss the details, date, and arrangements to ensure everything is perfect for your sacred occasion.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">2</span>
                      </div>
                      Do you provide the pooja materials (samagri)?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    Yes, we can provide all necessary pooja materials and samagri for ceremonies. We can also guide you
                    on what to arrange if you prefer to gather items yourself. This will be discussed during booking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">3</span>
                      </div>
                      What is the dakshina/fee structure?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    Dakshina varies based on the type and duration of ceremony. We believe in transparent and fair pricing.
                    Please contact us to discuss specific ceremony costs. We work with families to ensure sacred services are accessible.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">4</span>
                      </div>
                      Can ceremonies be performed virtually?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    Yes, we offer virtual ceremony options for families who cannot attend in person. While in-person is preferred
                    for traditional rituals, we've adapted to serve devotees worldwide through video consultations and guided virtual ceremonies.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">5</span>
                      </div>
                      How far in advance should I book?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    For major ceremonies like weddings and large poojas, we recommend booking 2-4 weeks in advance.
                    For smaller ceremonies and consultations, we can often accommodate requests within a few days.
                    Contact us as early as possible for your preferred date.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-sm">6</span>
                      </div>
                      Do you explain the rituals during ceremonies?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11 leading-relaxed">
                    Absolutely! We believe understanding enhances the spiritual experience. Each step and mantra is explained
                    in a way that helps participants connect with the deeper meaning of the ceremony.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      </section>
    </div>
  )
}

