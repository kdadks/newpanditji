'use client'

import { useRouter } from 'next/navigation'
import { AppPage, AppNavigationData } from '../lib/types'
import { FlowerLotus, EnvelopeSimple, Phone, MapPin } from '@phosphor-icons/react'
import { FacebookLogo, InstagramLogo, YoutubeLogo, LinkedinLogo, TwitterLogo, PinterestLogo } from '@phosphor-icons/react'

interface FooterProps {
}

export default function Footer({ }: FooterProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

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
              <li>
                <button onClick={() => handleNavigate('services')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('about')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  About Pandit Ji
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('gallery')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('blog')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('books')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Books
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('testimonials')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('charity')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Charity Work
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigate('terms')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('privacy')} className="text-sm hover:text-accent transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <EnvelopeSimple size={18} className="mt-0.5 shrink-0" />
                <a href="mailto:panditjoshirajesh@gmail.com" className="hover:text-accent transition-colors cursor-pointer">
                  panditjoshirajesh@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>Serving communities worldwide</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <FacebookLogo size={24} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <InstagramLogo size={24} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <YoutubeLogo size={24} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <LinkedinLogo size={24} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <TwitterLogo size={24} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-accent transition-colors cursor-pointer">
                <PinterestLogo size={24} weight="fill" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/70">
          <p>&copy; {currentYear} Pandit Rajesh Joshi. All rights reserved. | www.panditrajeshjoshi.com</p>
        </div>
      </div>
    </footer>
  )
}
