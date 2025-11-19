import { Card, CardContent } from '../ui/card'
import { FlowerLotus, Book, GraduationCap, Heart } from '@phosphor-icons/react'

export default function AboutPage() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <FlowerLotus className="mx-auto mb-6 text-primary" size={64} weight="fill" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">About Pandit Rajesh Joshi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A dedicated spiritual guide serving the Hindu community with traditional knowledge and modern understanding
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="font-heading font-semibold text-2xl mb-4">Spiritual Journey</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Pandit Rajesh Joshi is a distinguished Hindu priest with deep roots in Vedic traditions and a comprehensive understanding of Hindu philosophy, scriptures, and rituals. His spiritual journey began at a young age, learning from traditional scholars and immersing himself in the study of sacred texts.
                </p>
                <p>
                  With years of dedicated service to the community, Pandit Ji has performed thousands of ceremonies ranging from joyful celebrations like weddings and naming ceremonies to solemn rituals and spiritual consultations. His approach combines traditional authenticity with sensitivity to modern needs, making sacred practices accessible and meaningful for all generations.
                </p>
                <p>
                  Beyond performing rituals, Pandit Rajesh Joshi is passionate about education and spreading awareness about Hindu dharma. Through lectures, workshops, and personal consultations, he helps individuals and families understand the deeper significance of their spiritual practices and find practical wisdom for contemporary life.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <GraduationCap className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-lg mb-2">Scholarly Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Extensive training in Vedic scriptures, Sanskrit, and Hindu philosophy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-lg mb-2">Community Service</h3>
                <p className="text-sm text-muted-foreground">
                  Years of dedicated service to Hindu communities worldwide
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Book className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-lg mb-2">Author & Speaker</h3>
                <p className="text-sm text-muted-foreground">
                  Published works and regular talks on Hindu dharma and spirituality
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="font-heading font-semibold text-2xl mb-4">Books by Rajesh Ji</h2>
              <p className="text-muted-foreground mb-4">
                Pandit Rajesh Joshi has authored several works on Hindu philosophy, spirituality, and practical guidance for modern living. His writings bridge ancient wisdom with contemporary concerns, making timeless teachings accessible to today's seekers.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Book titles and detailed information available upon request.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <h2 className="font-heading font-semibold text-2xl mb-4">Philosophy & Approach</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Authenticity:</span> Every ceremony is performed according to proper Vedic procedures while being explained in a way that makes the meaning clear and relevant.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Inclusivity:</span> Services are offered with respect and openness to all, regardless of background, helping everyone connect with Hindu spiritual traditions.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Education:</span> Each ritual becomes a learning opportunity, empowering families to understand and appreciate the depth of their spiritual heritage.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Compassion:</span> Special attention to the spiritual and emotional needs of each family, ensuring ceremonies are meaningful and comforting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
