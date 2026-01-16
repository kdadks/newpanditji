import { Card, CardContent } from '../ui/card'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { ShieldCheck } from '@phosphor-icons/react'

export default function PrivacyPage() {
  usePageMetadata('privacy')

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <ShieldCheck className="mx-auto mb-6 text-primary" size={64} weight="fill" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Pandit Rajesh Joshi (www.panditrajeshjoshi.com), we are committed to protecting your privacy and handling your personal information with care and respect. This Privacy Policy explains how we collect, use, store, and protect information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect the following types of information:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Name and contact details (email, phone number)</li>
                    <li>Service preferences and booking information</li>
                    <li>Family information relevant to ceremonies (for customized services)</li>
                    <li>Feedback, testimonials, and communication with us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Browser type, device information, and IP address</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website or source</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>To provide and customize religious services and ceremonies</li>
                <li>To communicate with you about bookings, schedules, and service details</li>
                <li>To respond to inquiries and provide spiritual consultation</li>
                <li>To send educational content, updates, and newsletters (with your consent)</li>
                <li>To improve our website functionality and user experience</li>
                <li>To maintain records for service delivery and quality assurance</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We respect your privacy and do not sell, rent, or trade your personal information. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>To fulfill service requirements (e.g., scheduling, venue coordination)</li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>With trusted service providers who assist in website operations (bound by confidentiality)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You can control cookie preferences through your browser settings, though disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website includes embedded content from third-party services such as YouTube videos and social media platforms. These services may collect information according to their own privacy policies. We recommend reviewing their privacy policies when interacting with third-party content.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">8. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Portability:</strong> Request transfer of your data in a structured format</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">10. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Service records may be kept for historical and quality assurance purposes.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                We serve clients globally. If you are accessing our services from outside our primary location, please be aware that your information may be transferred to, stored, and processed in different jurisdictions. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us:
              </p>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  Email: <a href="mailto:panditjoshirajesh@gmail.com" className="text-primary hover:underline">panditjoshirajesh@gmail.com</a>
                </p>
                <p className="text-muted-foreground mt-1">
                  Website: <a href="https://www.panditrajeshjoshi.com" className="text-primary hover:underline">www.panditrajeshjoshi.com</a>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We are committed to addressing your concerns promptly and transparently.
              </p>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground italic">
                By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
