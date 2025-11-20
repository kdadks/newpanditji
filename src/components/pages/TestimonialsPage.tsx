import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { usePageSEO } from '../../hooks/usePageSEO'
import { Star, Quotes, Sparkle, Heart, Trophy, Users } from '@phosphor-icons/react'
import { testimonials } from '../../lib/data'

export default function TestimonialsPage() {
  usePageSEO({
    title: 'Client Reviews & Testimonials | Pandit Rajesh Joshi Hindu Services',
    description: 'Read testimonials from satisfied clients about their pooja ceremonies and spiritual services. Genuine reviews of Hindu rituals performed in Ireland and UK.',
    keywords: 'client testimonials, pooja reviews, service reviews, customer feedback, spiritual services reviews, Hindu ceremony feedback',
    canonicalUrl: 'https://panditrajesh.ie/testimonials'
  })

  return (
    <div className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl scale-110"></div>
            <Quotes className="relative text-primary" size={80} weight="fill" />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
              <Sparkle size={16} weight="fill" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart size={16} weight="fill" />
            Voices of Devotion
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
            What Our <span className="text-primary">Community</span> Says
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the heartfelt experiences of families who have found spiritual guidance,
            peace, and sacred moments through our traditional Hindu ceremonies.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">250+</div>
            <div className="text-sm text-muted-foreground">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Ceremonies Performed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Years of Service</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardContent className="relative p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary/20">
                  <Quotes size={24} weight="fill" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} weight="fill" className="text-accent" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 leading-relaxed italic text-lg">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {testimonial.service}
                    </Badge>
                  </div>
                  <div className="text-primary/60 text-lg font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-4 left-4 text-primary/10">
                  <Sparkle size={20} weight="fill" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Share Your Experience */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 mb-16">
          <CardContent className="p-8 md:p-12 text-center">
            <Heart className="mx-auto mb-6 text-primary" size={48} weight="fill" />

            <h2 className="font-heading font-semibold text-3xl mb-4">Share Your Sacred Experience</h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Your testimonial helps others discover the beauty of traditional Hindu ceremonies
              and guides families in their spiritual journey. We would be honored to hear your story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Quotes className="mr-2" size={20} weight="fill" />
                Write a Testimonial
              </Button>
              <span className="text-muted-foreground text-sm hidden sm:inline">or</span>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Star className="mr-2" size={20} weight="fill" />
                Leave a Review
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Share your experience on:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.google.com/search?q=pandit+rajesh+joshi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Reviews
                </a>
                <a
                  href="mailto:panditjoshirajesh@gmail.com?subject=Testimonial"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Quotes size={18} />
                  Email Testimonial
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl mb-4">Why Families Choose Us</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Trophy className="text-primary" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl">Authentic Traditions</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Every ceremony is performed according to proper Vedic procedures with genuine devotion
                  and traditional knowledge passed through generations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="text-primary" size={24} weight="fill" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl">Personalized Service</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Each ceremony is adapted to your family's unique needs, traditions, and preferences
                  while maintaining sacred authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Heart className="text-primary" size={24} weight="fill" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl">Compassionate Guidance</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We approach every family with genuine care, understanding, and spiritual sensitivity
                  to ensure meaningful and comforting experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkle className="text-primary" size={24} weight="fill" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl">Educational Experience</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Every ritual becomes a learning opportunity, helping families understand and appreciate
                  the deeper meaning of Hindu spiritual traditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
