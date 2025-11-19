import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { EnvelopeSimple, Phone, WhatsappLogo, MapPin } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { categoryNames } from '../../lib/data'

export default function ContactPage() {
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
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch to discuss your ceremony needs or for spiritual guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="font-heading font-semibold text-2xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+353 123 456 789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Service of Interest</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger id="service">
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

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your ceremony needs or inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-heading font-semibold text-2xl mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <EnvelopeSimple size={24} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a href="mailto:panditjoshirajesh@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                        panditjoshirajesh@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <WhatsappLogo size={24} className="text-primary mt-1 flex-shrink-0" weight="fill" />
                    <div>
                      <p className="font-semibold mb-1">WhatsApp</p>
                      <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        +353 123 456 789
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">Click to chat directly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin size={24} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Service Area</p>
                      <p className="text-muted-foreground">
                        Serving communities worldwide with in-person and virtual ceremonies
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10">
              <CardContent className="p-8">
                <h3 className="font-heading font-semibold text-xl mb-3">Quick Response</h3>
                <p className="text-muted-foreground mb-4">
                  We typically respond to inquiries within 24 hours. For urgent ceremony needs, please contact us directly via WhatsApp or phone.
                </p>
                <p className="text-sm text-muted-foreground">
                  Available for consultations and bookings throughout the week. Weekend ceremony bookings should be made in advance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="font-heading font-semibold text-2xl mb-6 text-center">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">How do I book a ceremony?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Simply contact us through the form above, WhatsApp, or email with your ceremony requirements. We'll discuss the details, date, and arrangements to ensure everything is perfect for your sacred occasion.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Do you provide the pooja materials (samagri)?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, we can provide all necessary pooja materials and samagri for ceremonies. We can also guide you on what to arrange if you prefer to gather items yourself. This will be discussed during booking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">What is the dakshina/fee structure?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Dakshina varies based on the type and duration of ceremony. We believe in transparent and fair pricing. Please contact us to discuss specific ceremony costs. We work with families to ensure sacred services are accessible.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Can ceremonies be performed virtually?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, we offer virtual ceremony options for families who cannot attend in person. While in-person is preferred for traditional rituals, we've adapted to serve devotees worldwide through video consultations and guided virtual ceremonies.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">How far in advance should I book?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    For major ceremonies like weddings and large poojas, we recommend booking 2-4 weeks in advance. For smaller ceremonies and consultations, we can often accommodate requests within a few days. Contact us as early as possible for your preferred date.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">Do you explain the rituals during ceremonies?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! We believe understanding enhances the spiritual experience. Each step and mantra is explained in a way that helps participants connect with the deeper meaning of the ceremony.
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
