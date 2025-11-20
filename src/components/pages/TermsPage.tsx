import { Card, CardContent } from '../ui/card'
import { usePageSEO } from '../../hooks/usePageSEO'
import { FileText } from '@phosphor-icons/react'

export default function TermsPage() {
  usePageSEO({
    title: 'Terms & Conditions | Pandit Rajesh Joshi',
    description: 'Read our terms and conditions for using Pandit Rajesh Joshi\'s website and services.',
    keywords: 'terms and conditions, terms of service, legal terms',
    canonicalUrl: 'https://panditrajesh.ie/terms'
  })

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <FileText className="mx-auto mb-6 text-primary" size={64} />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the services of Pandit Rajesh Joshi (www.panditrajeshjoshi.com), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">2. Services Provided</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We offer traditional Hindu religious services, spiritual consultations, ceremonies, and educational content including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Religious ceremonies (Poojas, Sanskars, Paath)</li>
                <li>Spiritual consultations and guidance</li>
                <li>Wellness programs (Meditation, Yoga)</li>
                <li>Educational videos and blog content</li>
                <li>Charity and community initiatives</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">3. Booking and Scheduling</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All service bookings are subject to availability and confirmation. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Reschedule services with advance notice in case of unforeseen circumstances</li>
                <li>Modify service duration based on specific requirements and rituals</li>
                <li>Decline bookings that conflict with our values or professional standards</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">4. Payment and Fees</h2>
              <p className="text-muted-foreground leading-relaxed">
                Service fees are discussed and agreed upon at the time of booking. Payment terms, cancellation policies, and refund conditions will be communicated clearly before confirmation. We believe in fair pricing and transparency in all financial matters.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, images, videos, audio recordings, and educational materials, is the intellectual property of Pandit Rajesh Joshi unless otherwise stated. This content is provided for personal, non-commercial use. Unauthorized reproduction, distribution, or commercial use of any materials without express written permission is prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">6. Educational Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                The spiritual guidance, educational videos, and blog articles provided on this website are based on traditional Hindu scriptures and practices. While we strive for accuracy, this content is intended for educational and inspirational purposes and should not be considered as a substitute for professional advice in legal, medical, or financial matters.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">7. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When using our services or interacting with our content, users agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Respect the sacred nature of religious ceremonies and practices</li>
                <li>Provide accurate information when booking services</li>
                <li>Communicate respectfully and professionally</li>
                <li>Not misuse or share content without permission</li>
                <li>Honor the traditional and cultural significance of Hindu practices</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pandit Rajesh Joshi provides spiritual and religious services in good faith based on traditional practices. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our services are intended to provide spiritual support and should not replace professional advice in other areas of life.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites, including YouTube videos and social media platforms. We are not responsible for the content, privacy policies, or practices of these external sites. Users access third-party links at their own discretion and risk.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  Email: <a href="mailto:panditjoshirajesh@gmail.com" className="text-primary hover:underline">panditjoshirajesh@gmail.com</a>
                </p>
                <p className="text-muted-foreground mt-1">
                  Website: <a href="https://www.panditrajeshjoshi.com" className="text-primary hover:underline">www.panditrajeshjoshi.com</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with applicable laws. Any disputes arising from these terms or our services will be resolved through appropriate legal channels with mutual respect and good faith.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
