'use client'

import { useRouter } from 'next/navigation'
import { AppPage, AppNavigationData } from '../lib/types'
import { FlowerLotus, EnvelopeSimple, MapPin } from '@phosphor-icons/react'
import { FacebookLogo, InstagramLogo, YoutubeLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react'
import { useMenuItems } from '../hooks/useMenus'
import { useFooterContent } from '../hooks/useCmsContent'

interface FooterProps {
}

export default function Footer({ }: FooterProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  
  // Load footer and legal menus from database
  const { items: footerMenuItems } = useMenuItems('footer')
  const { items: legalMenuItems } = useMenuItems('legal')

  // Load dynamic footer content (contact info, social links, copyright) from CMS
  const { content: footerContent } = useFooterContent()

  const handleNavigate = (pageOrData: AppPage | AppNavigationData) => {
    if (typeof pageOrData === 'string') {
      router.push(pageOrData === 'home' ? '/' : `/${pageOrData}`)
    } else {
      // Handle AppNavigationData object
      const { page, blogSlug } = pageOrData
      if (page === 'blog-detail' && blogSlug) {
        router.push(`/blog/${blogSlug}`)
      } else {
        router.push(page === 'home' ? '/' : `/${page}`)
      }
    }
  }

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlowerLotus className="text-accent" size={28} weight="fill" />
              <span className="font-heading font-bold text-xl">Pandit Rajesh Joshi</span>
            </div>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Traditional Hindu religious services, spiritual consultations, and cultural education serving the community with authenticity and devotion.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerMenuItems
                .filter(item => item.is_visible)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => router.push(item.url)} 
                      className="text-sm hover:text-accent transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalMenuItems
                .filter(item => item.is_visible)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => router.push(item.url)} 
                      className="text-sm hover:text-accent transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              {footerContent.contactEmail && (
                <li className="flex items-start gap-2 text-sm">
                  <EnvelopeSimple size={18} className="mt-0.5 shrink-0" />
                  <a href={`mailto:${footerContent.contactEmail}`} className="hover:text-accent transition-colors cursor-pointer">
                    {footerContent.contactEmail}
                  </a>
                </li>
              )}
              {footerContent.contactLocation && (
                <li className="flex items-start gap-2 text-sm">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  <span>{footerContent.contactLocation}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {footerContent.facebookUrl && (
                <a href={footerContent.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                  <FacebookLogo size={24} weight="fill" />
                </a>
              )}
              {footerContent.instagramUrl && (
                <a href={footerContent.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                  <InstagramLogo size={24} weight="fill" />
                </a>
              )}
              {footerContent.youtubeUrl && (
                <a href={footerContent.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                  <YoutubeLogo size={24} weight="fill" />
                </a>
              )}
              {footerContent.linkedinUrl && (
                <a href={footerContent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                  <LinkedinLogo size={24} weight="fill" />
                </a>
              )}
              {footerContent.twitterUrl && (
                <a href={footerContent.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                  <TwitterLogo size={24} weight="fill" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/70">
          <p>{footerContent.copyrightText.replace('{year}', String(currentYear))}</p>
        </div>
      </div>
    </footer>
  )
}
