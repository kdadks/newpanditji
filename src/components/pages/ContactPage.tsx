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

export default function ContactPage() {
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
    <div className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl scale-110"></div>
            <EnvelopeSimple className="relative text-primary" size={60} weight="fill" />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
              <Sparkle size={14} weight="fill" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Heart size={14} weight="fill" />
            Connect With Us
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 text-foreground">
            Let's Begin Your <span className="text-primary">Sacred Journey</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you're planning a traditional ceremony or seeking spiritual guidance,
            we're here to serve your family's sacred needs with devotion and expertise.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary" size={24} weight="fill" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Trusted Service</div>
            <div className="text-xs text-muted-foreground">15+ Years Experience</div>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-primary" size={24} weight="fill" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Authentic Rituals</div>
            <div className="text-xs text-muted-foreground">Vedic Traditions</div>
          </div>
          <div className="text-center">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-primary" size={24} weight="fill" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Quick Response</div>
            <div className="text-xs text-muted-foreground">Within 24 Hours</div>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary" size={24} weight="fill" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Personal Care</div>
            <div className="text-xs text-muted-foreground">Family-Focused</div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {/* Contact Form */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <EnvelopeSimple className="text-primary" size={24} />
                </div>
                <h2 className="font-heading font-semibold text-2xl">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+353 123 456 789"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-sm font-medium">Service of Interest</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger className="mt-2 h-10">
                        <SelectValue placeholder="Select a service category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryNames).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your ceremony needs or inquiry..."
                    rows={6}
                    className="mt-2 resize-none"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <EnvelopeSimple className="mr-2" size={20} />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <h2 className="font-heading font-semibold text-2xl">Get in Touch</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <EnvelopeSimple size={24} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1 text-foreground">Email</p>
                      <a href="mailto:panditjoshirajesh@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        panditjoshirajesh@gmail.com
                      </a>
                      <Badge variant="secondary" className="ml-2 text-xs">Primary Contact</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <WhatsappLogo size={24} className="text-primary mt-1 flex-shrink-0" weight="fill" />
                    <div>
                      <p className="font-semibold mb-1 text-foreground">WhatsApp</p>
                      <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        +353 123 456 789
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">Click to chat directly • Instant response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <MapPin size={24} className="text-primary mt-1 flex-shrink-0" />
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

            <Card className="border-0 shadow-lg bg-gradient-to-r from-accent/10 via-primary/5 to-secondary/10">
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

          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border-0 bg-white/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
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
    </div>
  )
}
