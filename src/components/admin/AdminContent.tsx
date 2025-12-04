import { useState, useEffect } from 'react'
import { FileText, Article as HeaderIcon } from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useMenuItems } from '../../hooks/useMenus'

// Import types
import type {
  PageKey,
  SectionKey,
  HomePageContent,
  AboutPageContent,
  WhyChooseContent,
  BooksPageContent,
  ContactPageContent,
  CharityPageContent,
  HeaderContent,
  FooterContent,
  MenuItem
} from './types/cms-types'

// Import editors
import {
  HomePageEditor,
  AboutPageEditor,
  WhyChoosePageEditor,
  BooksPageEditor,
  ContactPageEditor,
  CharityPageEditor,
  HeaderEditor,
  FooterEditor,
  MenuEditor
} from './editors'

// Import shared utilities
import { getPageTitle } from './editors/shared/EditorUtils'

// Default content imports
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultWhyChooseContent,
  defaultBooksContent,
  defaultContactContent,
  defaultCharityContent,
  defaultHeaderContent,
  defaultFooterContent,
  defaultMenuItems
} from './defaults/cms-defaults'

export default function AdminContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'pages' | 'sections'>('pages')
  const [activePageTab, setActivePageTab] = useState<PageKey>('home')
  const [activeSectionTab, setActiveSectionTab] = useState<SectionKey>('header')

  // Database hooks
  const { settings, updateSettings, isUpdating: settingsUpdating } = useSiteSettings()
  const headerMenuItems = useMenuItems('header')

  // Page content state
  const [homeContent, setHomeContent] = useState<HomePageContent>(() => {
    const saved = localStorage.getItem('cms_home')
    if (saved) return JSON.parse(saved)
    return defaultHomeContent
  })

  const [aboutContent, setAboutContent] = useState<AboutPageContent>(() => {
    const saved = localStorage.getItem('cms_about')
    if (saved) return JSON.parse(saved)
    return defaultAboutContent
  })

  const [whyChooseContent, setWhyChooseContent] = useState<WhyChooseContent>(() => {
    const saved = localStorage.getItem('cms_whyChoose')
    if (saved) return JSON.parse(saved)
    return defaultWhyChooseContent
  })

  const [booksContent, setBooksContent] = useState<BooksPageContent>(() => {
    const saved = localStorage.getItem('cms_books')
    if (saved) return JSON.parse(saved)
    return defaultBooksContent
  })

  const [contactContent, setContactContent] = useState<ContactPageContent>(() => {
    const saved = localStorage.getItem('cms_contact')
    if (saved) return JSON.parse(saved)
    return defaultContactContent
  })

  const [charityContent, setCharityContent] = useState<CharityPageContent>(() => {
    const saved = localStorage.getItem('cms_charity')
    if (saved) return JSON.parse(saved)
    return defaultCharityContent
  })

  // Section content state
  const [headerContent, setHeaderContent] = useState<HeaderContent>(() => {
    const saved = localStorage.getItem('cms_header')
    if (saved) return JSON.parse(saved)
    return defaultHeaderContent
  })

  const [footerContent, setFooterContent] = useState<FooterContent>(() => {
    const saved = localStorage.getItem('cms_footer')
    if (saved) return JSON.parse(saved)
    return defaultFooterContent
  })

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cms_menu')
    if (saved) return JSON.parse(saved)
    return defaultMenuItems
  })

  // Load data from database when available
  useEffect(() => {
    if (settings) {
      setHeaderContent(prev => ({
        ...prev,
        logoUrl: settings.site_logo_url || prev.logoUrl
      }))
      setFooterContent(prev => ({
        ...prev,
        description: settings.footer_text || prev.description,
        copyrightText: settings.copyright_text || prev.copyrightText,
        facebookUrl: settings.facebook_page_url || prev.facebookUrl,
        instagramUrl: settings.instagram_url || prev.instagramUrl,
        youtubeUrl: settings.youtube_channel_url || prev.youtubeUrl,
        linkedinUrl: settings.linkedin_url || prev.linkedinUrl,
        twitterUrl: settings.twitter_url || prev.twitterUrl
      }))
      setContactContent(prev => ({
        ...prev,
        email: settings.primary_email || prev.email,
        phone: settings.primary_phone || prev.phone,
        whatsapp: settings.whatsapp_number || prev.whatsapp,
        address: settings.address || prev.address
      }))
    }
  }, [settings])

  // Load menu items from database
  useEffect(() => {
    if (headerMenuItems.items.length > 0) {
      setMenuItems(headerMenuItems.items.map(item => ({
        id: item.id,
        label: item.label,
        url: item.url,
        order: item.sort_order
      })))
    }
  }, [headerMenuItems.items])

  // Save handlers
  const handleSavePageContent = async (pageKey: PageKey) => {
    setIsSaving(true)
    try {
      let content: unknown
      switch (pageKey) {
        case 'home': content = homeContent; break
        case 'about': content = aboutContent; break
        case 'whyChoose': content = whyChooseContent; break
        case 'books': content = booksContent; break
        case 'contact': content = contactContent; break
        case 'charity': content = charityContent; break
      }
      localStorage.setItem(`cms_${pageKey}`, JSON.stringify(content))
      toast.success(`${getPageTitle(pageKey)} content saved successfully`)
    } catch (error) {
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveHeader = async () => {
    setIsSaving(true)
    try {
      await updateSettings({ site_logo_url: headerContent.logoUrl })
      localStorage.setItem('cms_header', JSON.stringify(headerContent))
      toast.success('Header settings saved')
    } catch (error) {
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveFooter = async () => {
    setIsSaving(true)
    try {
      await updateSettings({
        footer_text: footerContent.description,
        copyright_text: footerContent.copyrightText,
        facebook_page_url: footerContent.facebookUrl,
        instagram_url: footerContent.instagramUrl,
        youtube_channel_url: footerContent.youtubeUrl,
        linkedin_url: footerContent.linkedinUrl,
        twitter_url: footerContent.twitterUrl
      })
      localStorage.setItem('cms_footer', JSON.stringify(footerContent))
      toast.success('Footer settings saved')
    } catch (error) {
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveMenu = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('cms_menu', JSON.stringify(menuItems))
      toast.success('Menu saved')
    } catch (error) {
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Content Management System</CardTitle>
          <CardDescription className="mt-2">
            Manage pages, images, header, footer, and navigation menu
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pages' | 'sections')}>
        <TabsList className="grid w-full grid-cols-2 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText size={16} className="mr-2" />
            Page Content
          </TabsTrigger>
          <TabsTrigger value="sections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <HeaderIcon size={16} className="mr-2" />
            Header, Footer & Menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <Tabs value={activePageTab} onValueChange={(value) => setActivePageTab(value as PageKey)}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Home</TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About Us</TabsTrigger>
              <TabsTrigger value="whyChoose" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Why Choose Us</TabsTrigger>
              <TabsTrigger value="books" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Books</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contact</TabsTrigger>
              <TabsTrigger value="charity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Charity</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-6">
              <HomePageEditor
                content={homeContent}
                setContent={setHomeContent}
                onSave={() => handleSavePageContent('home')}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <AboutPageEditor
                content={aboutContent}
                setContent={setAboutContent}
                onSave={() => handleSavePageContent('about')}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="whyChoose" className="mt-6">
              <WhyChoosePageEditor
                content={whyChooseContent}
                setContent={setWhyChooseContent}
                onSave={() => handleSavePageContent('whyChoose')}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="books" className="mt-6">
              <BooksPageEditor
                content={booksContent}
                setContent={setBooksContent}
                onSave={() => handleSavePageContent('books')}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="contact" className="mt-6">
              <ContactPageEditor
                content={contactContent}
                setContent={setContactContent}
                onSave={() => handleSavePageContent('contact')}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="charity" className="mt-6">
              <CharityPageEditor
                content={charityContent}
                setContent={setCharityContent}
                onSave={() => handleSavePageContent('charity')}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="sections" className="mt-6">
          <Tabs value={activeSectionTab} onValueChange={(value) => setActiveSectionTab(value as SectionKey)}>
            <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="header" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Header</TabsTrigger>
              <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Footer</TabsTrigger>
              <TabsTrigger value="menu" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Menu</TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="mt-6">
              <HeaderEditor
                content={headerContent}
                setContent={setHeaderContent}
                onSave={handleSaveHeader}
                isSaving={isSaving || settingsUpdating}
              />
            </TabsContent>
            <TabsContent value="footer" className="mt-6">
              <FooterEditor
                content={footerContent}
                setContent={setFooterContent}
                onSave={handleSaveFooter}
                isSaving={isSaving || settingsUpdating}
              />
            </TabsContent>
            <TabsContent value="menu" className="mt-6">
              <MenuEditor
                items={menuItems}
                setItems={setMenuItems}
                onSave={handleSaveMenu}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
