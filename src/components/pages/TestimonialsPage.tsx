import { Card, CardContent } from '../ui/card'
import { Star, Quotes } from '@phosphor-icons/react'
import { testimonials } from '../../lib/data'

export default function TestimonialsPage() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Quotes className="mx-auto mb-6 text-primary" size={64} weight="fill" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Testimonials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from families who have experienced our services
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} weight="fill" className="text-accent" />
                  ))}
                </div>
                <p className="text-lg text-foreground mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 max-w-3xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="font-heading font-semibold text-2xl mb-4">Share Your Experience</h2>
            <p className="text-muted-foreground mb-6">
              If you have experienced our services, we would be honored to hear about your experience. Your feedback helps us serve the community better and guides others in their spiritual journey.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Please share your review on:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <a 
                  href="https://www.google.com/search?q=pandit+rajesh+joshi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Google Reviews
                </a>
                <span className="hidden sm:inline">•</span>
                <a 
                  href="mailto:panditjoshirajesh@gmail.com?subject=Testimonial"
                  className="text-primary hover:underline font-medium"
                >
                  Email Your Testimonial
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16 pt-16 border-t border-border max-w-3xl mx-auto">
          <h2 className="font-heading font-semibold text-2xl mb-6 text-center">What Makes Our Services Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Authentic Rituals</h3>
                <p className="text-sm text-muted-foreground">
                  All ceremonies performed according to traditional Vedic practices with proper mantras and procedures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Patient Explanation</h3>
                <p className="text-sm text-muted-foreground">
                  Every ritual step explained clearly so families understand the significance and meaning
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Flexible & Accommodating</h3>
                <p className="text-sm text-muted-foreground">
                  Services adapted to your family's needs, schedule, and specific traditions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Spiritual Depth</h3>
                <p className="text-sm text-muted-foreground">
                  Ceremonies conducted with genuine devotion and spiritual consciousness
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
