import { useState } from 'react'
import { FloppyDisk, Spinner, FileText, Article, Article as HeaderIcon, Article as FooterIcon, List as MenuIcon } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { QuillEditor } from '../ui/quill-editor'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'

type PageKey = 'home' | 'about' | 'whyChoose' | 'books' | 'contact'
type SectionKey = 'header' | 'footer' | 'menu'

interface PageContent {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  mainContent: string
  sectionTitle1: string
  sectionContent1: string
  sectionTitle2: string
  sectionContent2: string
}

type PagesContent = Record<PageKey, PageContent>

interface HeaderContent {
  logo: string
  tagline: string
  ctaText: string
  ctaLink: string
}

interface FooterContent {
  copyrightText: string
  socialLinks: { platform: string; url: string }[]
  quickLinks: { label: string; url: string }[]
  contactInfo: string
}

interface MenuItem {
  label: string
  url: string
  order: number
}

export default function AdminContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'pages' | 'sections'>('pages')
  const [activePageTab, setActivePageTab] = useState<PageKey>('home')
  const [activeSectionTab, setActiveSectionTab] = useState<SectionKey>('header')

  const [pagesContent, setPagesContent] = useState<PagesContent>({
    home: {
      heroTitle: 'Hindu Priest & Spiritual Guide',
      heroSubtitle: 'Traditional Vedic Services in Netherlands',
      heroDescription: 'Bringing sacred Hindu traditions to your doorstep with authentic rituals and spiritual guidance',
      mainContent: '',
      sectionTitle1: 'Our Services',
      sectionContent1: 'We offer a comprehensive range of Hindu religious services...',
      sectionTitle2: 'Why Choose Us',
      sectionContent2: 'Authentic Vedic knowledge combined with modern understanding...'
    },
    about: {
      heroTitle: 'About Pandit Rajesh Joshi',
      heroSubtitle: 'Your Trusted Spiritual Guide',
      heroDescription: 'Serving the Hindu community in Netherlands for over 15 years',
      mainContent: '',
      sectionTitle1: 'Background & Education',
      sectionContent1: 'Traditional Vedic education from India...',
      sectionTitle2: 'Philosophy & Approach',
      sectionContent2: 'Combining ancient wisdom with contemporary needs...'
    },
    whyChoose: {
      heroTitle: 'Why Choose Our Services',
      heroSubtitle: 'Excellence in Tradition',
      heroDescription: 'Authentic rituals performed with devotion and precision',
      mainContent: '',
      sectionTitle1: 'Our Commitment',
      sectionContent1: 'We are committed to preserving Hindu traditions...',
      sectionTitle2: 'What Sets Us Apart',
      sectionContent2: 'Years of experience, deep knowledge, and genuine care...'
    },
    books: {
      heroTitle: 'Spiritual Literature',
      heroSubtitle: 'Books & Publications',
      heroDescription: 'Explore our collection of spiritual texts and guides',
      mainContent: '',
      sectionTitle1: 'Available Books',
      sectionContent1: 'A curated selection of Hindu scriptures and guides...',
      sectionTitle2: 'Reading Resources',
      sectionContent2: 'Materials to deepen your spiritual understanding...'
    },
    contact: {
      heroTitle: 'Get In Touch',
      heroSubtitle: 'Contact Us',
      heroDescription: 'Reach out for bookings, consultations, or any inquiries',
      mainContent: '',
      sectionTitle1: 'Contact Information',
      sectionContent1: 'Phone, email, and WhatsApp details...',
      sectionTitle2: 'Service Areas',
      sectionContent2: 'We serve communities across Netherlands...'
    }
  })

  const [headerContent, setHeaderContent] = useState<HeaderContent>({
    logo: '/logo.png',
    tagline: 'Traditional Vedic Services',
    ctaText: 'Book Consultation',
    ctaLink: '/contact'
  })

  const [footerContent, setFooterContent] = useState<FooterContent>({
    copyrightText: '© 2024 Pandit Rajesh Joshi. All rights reserved.',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
    quickLinks: [
      { label: 'Home', url: '/' },
      { label: 'Services', url: '/services' },
      { label: 'Contact', url: '/contact' },
    ],
    contactInfo: 'Email: contact@panditrajesh.com | Phone: +31 6 12345678'
  })

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { label: 'Home', url: '/', order: 1 },
    { label: 'About', url: '/about', order: 2 },
    { label: 'Services', url: '/services', order: 3 },
    { label: 'Gallery', url: '/gallery', order: 4 },
    { label: 'Contact', url: '/contact', order: 5 },
  ])

  const handleSave = async (type: 'page' | 'section', key?: string) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (type === 'page' && key) {
        toast.success(`${getPageTitle(key as PageKey)} content updated successfully`)
      } else if (type === 'section' && key) {
        toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully`)
      }
    } catch (error) {
      toast.error('Failed to update content')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePageContent = (pageKey: PageKey, field: keyof PageContent, value: string) => {
    setPagesContent(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
    }))
  }

  const getPageTitle = (key: PageKey): string => {
    const titles: Record<PageKey, string> = {
      home: 'Home Page',
      about: 'About Us',
      whyChoose: 'Why Choose Us',
      books: 'Books',
      contact: 'Contact'
    }
    return titles[key]
  }

  const renderPageEditor = (pageKey: PageKey) => {
    const content = pagesContent[pageKey]

    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hero Section</CardTitle>
            <CardDescription>Main banner content at the top of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-heroTitle`}>Hero Title</Label>
              <Input
                id={`${pageKey}-heroTitle`}
                value={content.heroTitle}
                onChange={(e) => updatePageContent(pageKey, 'heroTitle', e.target.value)}
                placeholder="Main headline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-heroSubtitle`}>Hero Subtitle</Label>
              <Input
                id={`${pageKey}-heroSubtitle`}
                value={content.heroSubtitle}
                onChange={(e) => updatePageContent(pageKey, 'heroSubtitle', e.target.value)}
                placeholder="Secondary headline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-heroDescription`}>Hero Description</Label>
              <Textarea
                id={`${pageKey}-heroDescription`}
                value={content.heroDescription}
                onChange={(e) => updatePageContent(pageKey, 'heroDescription', e.target.value)}
                placeholder="Brief description text"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Main Content</CardTitle>
            <CardDescription>Primary page content with rich formatting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor={`${pageKey}-mainContent`}>Content</Label>
            <QuillEditor
              value={content.mainContent}
              onChange={(value) => updatePageContent(pageKey, 'mainContent', value)}
              placeholder="Write your main page content here..."
              minHeight="300px"
            />
          </CardContent>
        </Card>

        {/* Section 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Section 1</CardTitle>
            <CardDescription>First additional content section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-section1Title`}>Section Title</Label>
              <Input
                id={`${pageKey}-section1Title`}
                value={content.sectionTitle1}
                onChange={(e) => updatePageContent(pageKey, 'sectionTitle1', e.target.value)}
                placeholder="Section heading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-section1Content`}>Section Content</Label>
              <Textarea
                id={`${pageKey}-section1Content`}
                value={content.sectionContent1}
                onChange={(e) => updatePageContent(pageKey, 'sectionContent1', e.target.value)}
                placeholder="Section content"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Section 2</CardTitle>
            <CardDescription>Second additional content section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-section2Title`}>Section Title</Label>
              <Input
                id={`${pageKey}-section2Title`}
                value={content.sectionTitle2}
                onChange={(e) => updatePageContent(pageKey, 'sectionTitle2', e.target.value)}
                placeholder="Section heading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${pageKey}-section2Content`}>Section Content</Label>
              <Textarea
                id={`${pageKey}-section2Content`}
                value={content.sectionContent2}
                onChange={(e) => updatePageContent(pageKey, 'sectionContent2', e.target.value)}
                placeholder="Section content"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => handleSave('page', pageKey)}
            disabled={isSaving}
            size="lg"
            className="min-w-[200px]"
          >
            {isSaving ? (
              <>
                <Spinner className="mr-2 animate-spin" size={18} />
                Saving Changes...
              </>
            ) : (
              <>
                <FloppyDisk size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  const renderSectionEditor = () => {
    return (
      <div className="space-y-6">
        {activeSectionTab === 'header' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Header Configuration</CardTitle>
                <CardDescription>Manage header logo, tagline, and call-to-action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={headerContent.logo}
                      onChange={(e) => setHeaderContent({ ...headerContent, logo: e.target.value })}
                      placeholder="/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={headerContent.tagline}
                      onChange={(e) => setHeaderContent({ ...headerContent, tagline: e.target.value })}
                      placeholder="Traditional Vedic Services"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA Button Text</Label>
                    <Input
                      id="ctaText"
                      value={headerContent.ctaText}
                      onChange={(e) => setHeaderContent({ ...headerContent, ctaText: e.target.value })}
                      placeholder="Book Consultation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaLink">CTA Button Link</Label>
                    <Input
                      id="ctaLink"
                      value={headerContent.ctaLink}
                      onChange={(e) => setHeaderContent({ ...headerContent, ctaLink: e.target.value })}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => handleSave('section', 'header')} disabled={isSaving} size="lg">
                {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Header</>}
              </Button>
            </div>
          </>
        )}

        {activeSectionTab === 'footer' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Footer Configuration</CardTitle>
                <CardDescription>Manage footer copyright, links, and contact info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <Input
                    id="copyright"
                    value={footerContent.copyrightText}
                    onChange={(e) => setFooterContent({ ...footerContent, copyrightText: e.target.value })}
                    placeholder="© 2024 Pandit Rajesh Joshi. All rights reserved."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Textarea
                    id="contactInfo"
                    value={footerContent.contactInfo}
                    onChange={(e) => setFooterContent({ ...footerContent, contactInfo: e.target.value })}
                    placeholder="Email: contact@example.com | Phone: +31 6 12345678"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => handleSave('section', 'footer')} disabled={isSaving} size="lg">
                {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Footer</>}
              </Button>
            </div>
          </>
        )}

        {activeSectionTab === 'menu' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menu Navigation</CardTitle>
                <CardDescription>Manage main navigation menu items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {menuItems.sort((a, b) => a.order - b.order).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Badge variant="secondary" className="font-mono">{item.order}</Badge>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...menuItems]
                        newItems[index].label = e.target.value
                        setMenuItems(newItems)
                      }}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...menuItems]
                        newItems[index].url = e.target.value
                        setMenuItems(newItems)
                      }}
                      placeholder="URL"
                      className="flex-1"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => handleSave('section', 'menu')} disabled={isSaving} size="lg">
                {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Menu</>}
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Content Management System</CardTitle>
          <CardDescription className="mt-2">
            Manage pages, header, footer, and navigation menu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger
            value="home"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            Home
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            About Us
          </TabsTrigger>
          <TabsTrigger
            value="whyChoose"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            Why Choose Us
          </TabsTrigger>
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6">
          {renderPageEditor('home')}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          {renderPageEditor('about')}
        </TabsContent>

        <TabsContent value="whyChoose" className="mt-6">
          {renderPageEditor('whyChoose')}
        </TabsContent>

        <TabsContent value="books" className="mt-6">
          {renderPageEditor('books')}
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          {renderPageEditor('contact')}
        </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="sections" className="mt-6">
          <Tabs value={activeSectionTab} onValueChange={(value) => setActiveSectionTab(value as SectionKey)}>
            <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="header" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HeaderIcon size={16} className="mr-2" />
                Header
              </TabsTrigger>
              <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FooterIcon size={16} className="mr-2" />
                Footer
              </TabsTrigger>
              <TabsTrigger value="menu" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MenuIcon size={16} className="mr-2" />
                Menu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="mt-6">
              {renderSectionEditor()}
            </TabsContent>
            <TabsContent value="footer" className="mt-6">
              {renderSectionEditor()}
            </TabsContent>
            <TabsContent value="menu" className="mt-6">
              {renderSectionEditor()}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
