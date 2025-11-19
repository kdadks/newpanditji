import { Card, CardContent } from '../ui/card'
import { Heart, Book, Users, HandHeart } from '@phosphor-icons/react'

export default function CharityPage() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Heart className="mx-auto mb-6 text-primary" size={64} weight="fill" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Charity Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Serving humanity through spiritual education and community initiatives
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/92VjrCUL1K8"
                  title="One Rotary One Gita Project"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-8">
                <h2 className="font-heading font-semibold text-2xl mb-3">One Rotary One Gita Project</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  A groundbreaking initiative to distribute the Bhagavad Gita to communities worldwide, making this sacred wisdom accessible to all. Through partnership with Rotary clubs and community organizations, we aim to spread the universal teachings of the Gita across cultures and continents.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This project represents our commitment to sharing timeless spiritual wisdom that transcends boundaries and brings people together through shared values of duty, devotion, and dharma.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Book className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-heading font-semibold text-lg mb-2">Scripture Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Providing sacred texts to individuals and institutions worldwide
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-lg mb-2">Community Education</h3>
                <p className="text-sm text-muted-foreground">
                  Free workshops and lectures on Hindu philosophy and spirituality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <HandHeart className="mx-auto mb-4 text-primary" size={48} weight="fill" />
                <h3 className="font-heading font-semibold text-lg mb-2">Spiritual Support</h3>
                <p className="text-sm text-muted-foreground">
                  Complimentary guidance for those in need of spiritual counseling
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <h2 className="font-heading font-semibold text-2xl mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We believe that spiritual wisdom should be accessible to all, regardless of background or means. Through our charity initiatives, we work to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Make sacred Hindu texts available to communities worldwide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Provide free educational programs on Hindu philosophy and practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Offer spiritual guidance and support to those facing life challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Foster interfaith understanding and cultural appreciation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Support community well-being through meditation and yoga programs</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="font-heading font-semibold text-2xl mb-4">Support Our Work</h2>
              <p className="text-muted-foreground mb-4">
                If you would like to contribute to our charitable initiatives or learn more about how you can help spread spiritual wisdom in your community, please contact us.
              </p>
              <p className="text-sm text-muted-foreground italic">
                All charitable contributions are used directly for educational materials, community programs, and spiritual support services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
