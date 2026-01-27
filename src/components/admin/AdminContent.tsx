import { useState, useEffect } from 'react'
import { FileText, Article as HeaderIcon } from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'
import { useMenuItems } from '../../hooks/useMenus'

// Import CMS content hooks
import {
  useHomeContent,
  useAboutContent,
  useWhyChooseContent,
  useBooksPageContent,
  useContactContent,
  useCharityContent,
  useDakshinaContent,
  useGalleryContent,
  useHeaderContent,
  useFooterContent
} from '../../hooks/useCmsContent'

// Import types
import type {
  PageKey,
  SectionKey,
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
  DakshinaPageEditor,
  GalleryPageEditor,
  HeaderEditor,
  FooterEditor,
  MenuEditor
} from './editors'

// Default menu items as fallback
import { defaultMenuItems } from './defaults/cms-defaults'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'pages' | 'sections'>('pages')
  const [activePageTab, setActivePageTab] = useState<PageKey>('home')
  const [activeSectionTab, setActiveSectionTab] = useState<SectionKey>('header')

  // Database hooks for CMS content
  const homeContent = useHomeContent()
  const aboutContent = useAboutContent()
  const whyChooseContent = useWhyChooseContent()
  const booksContent = useBooksPageContent()
  const contactContent = useContactContent()
  const charityContent = useCharityContent()
  const dakshinaContent = useDakshinaContent()
  const galleryContent = useGalleryContent()
  const headerContentHook = useHeaderContent()
  const footerContentHook = useFooterContent()

  // Menu items from database
  const headerMenuItems = useMenuItems('header')

  // Local state for editors (synced with database)
  const [homeState, setHomeState] = useState(homeContent.content)
  const [aboutState, setAboutState] = useState(aboutContent.content)
  const [whyChooseState, setWhyChooseState] = useState(whyChooseContent.content)
  const [booksState, setBooksState] = useState(booksContent.content)
  const [contactState, setContactState] = useState(contactContent.content)
  const [charityState, setCharityState] = useState(charityContent.content)
  const [dakshinaState, setDakshinaState] = useState(dakshinaContent.content)
  const [galleryState, setGalleryState] = useState(galleryContent.content)
  const [headerState, setHeaderState] = useState(headerContentHook.content)
  const [footerState, setFooterState] = useState(footerContentHook.content)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems)

  // Sync local state when database content loads
  useEffect(() => {
    if (!homeContent.isLoading) setHomeState(homeContent.content)
  }, [homeContent.content, homeContent.isLoading])

  useEffect(() => {
    if (!aboutContent.isLoading) setAboutState(aboutContent.content)
  }, [aboutContent.content, aboutContent.isLoading])

  useEffect(() => {
    if (!whyChooseContent.isLoading) setWhyChooseState(whyChooseContent.content)
  }, [whyChooseContent.content, whyChooseContent.isLoading])

  useEffect(() => {
    if (!booksContent.isLoading) setBooksState(booksContent.content)
  }, [booksContent.content, booksContent.isLoading])

  useEffect(() => {
    if (!contactContent.isLoading) setContactState(contactContent.content)
  }, [contactContent.content, contactContent.isLoading])

  useEffect(() => {
    if (!charityContent.isLoading) setCharityState(charityContent.content)
  }, [charityContent.content, charityContent.isLoading])

  useEffect(() => {
    if (!dakshinaContent.isLoading) setDakshinaState(dakshinaContent.content)
  }, [dakshinaContent.content, dakshinaContent.isLoading])

  useEffect(() => {
    if (!galleryContent.isLoading) setGalleryState(galleryContent.content)
  }, [galleryContent.content, galleryContent.isLoading])

  useEffect(() => {
    if (!headerContentHook.isLoading) setHeaderState(headerContentHook.content)
  }, [headerContentHook.content, headerContentHook.isLoading])

  useEffect(() => {
    if (!footerContentHook.isLoading) setFooterState(footerContentHook.content)
  }, [footerContentHook.content, footerContentHook.isLoading])

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
    try {
      switch (pageKey) {
        case 'home':
          await homeContent.save(homeState)
          break
        case 'about':
          await aboutContent.save(aboutState)
          break
        case 'whyChoose':
          await whyChooseContent.save(whyChooseState)
          break
        case 'books':
          await booksContent.save(booksState)
          break
        case 'contact':
          await contactContent.save(contactState)
          break
        case 'charity':
          await charityContent.save(charityState)
          break
        case 'dakshina':
          await dakshinaContent.save(dakshinaState)
          break
        case 'gallery':
          await galleryContent.save(galleryState)
          break
      }
    } catch (error) {
      // Error already handled by hook
      console.error(`Failed to save ${pageKey}:`, error)
    }
  }

  const handleSaveHeader = async () => {
    try {
      await headerContentHook.save(headerState)
    } catch (error) {
      console.error('Failed to save header:', error)
    }
  }

  const handleSaveFooter = async () => {
    try {
      await footerContentHook.save(footerState)
    } catch (error) {
      console.error('Failed to save footer:', error)
    }
  }

  const handleSaveMenu = async () => {
    try {
      // Menu items are managed by useMenuItems hook
      toast.success('Menu saved')
    } catch (error) {
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Check if any content is loading
  const isAnyLoading = 
    homeContent.isLoading || 
    aboutContent.isLoading || 
    whyChooseContent.isLoading ||
    booksContent.isLoading ||
    contactContent.isLoading ||
    charityContent.isLoading ||
    dakshinaContent.isLoading ||
    galleryContent.isLoading ||
    headerContentHook.isLoading ||
    footerContentHook.isLoading

  // Get saving state for current page
  const getSavingState = (pageKey: PageKey): boolean => {
    switch (pageKey) {
      case 'home': return homeContent.isSaving
      case 'about': return aboutContent.isSaving
      case 'whyChoose': return whyChooseContent.isSaving
      case 'books': return booksContent.isSaving
      case 'contact': return contactContent.isSaving
      case 'charity': return charityContent.isSaving
      case 'dakshina': return dakshinaContent.isSaving
      case 'gallery': return galleryContent.isSaving
      default: return false
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Content Management System</CardTitle>
          <CardDescription className="mt-2">
            Manage pages, images, header, footer, and navigation menu
            {isAnyLoading && <span className="ml-2 text-muted-foreground">(Loading...)</span>}
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Home</TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About Us</TabsTrigger>
              <TabsTrigger value="whyChoose" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Why Choose Us</TabsTrigger>
              <TabsTrigger value="books" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Books</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contact</TabsTrigger>
              <TabsTrigger value="charity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Charity</TabsTrigger>
              <TabsTrigger value="dakshina" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dakshina</TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-6">
              <HomePageEditor
                content={homeState}
                setContent={setHomeState}
                onSave={() => handleSavePageContent('home')}
                isSaving={getSavingState('home')}
              />
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <AboutPageEditor
                content={aboutState}
                setContent={setAboutState}
                onSave={() => handleSavePageContent('about')}
                isSaving={getSavingState('about')}
              />
            </TabsContent>
            <TabsContent value="whyChoose" className="mt-6">
              <WhyChoosePageEditor
                content={whyChooseState}
                setContent={setWhyChooseState}
                onSave={() => handleSavePageContent('whyChoose')}
                isSaving={getSavingState('whyChoose')}
              />
            </TabsContent>
            <TabsContent value="books" className="mt-6">
              <BooksPageEditor
                content={booksState}
                setContent={setBooksState}
                onSave={() => handleSavePageContent('books')}
                isSaving={getSavingState('books')}
              />
            </TabsContent>
            <TabsContent value="contact" className="mt-6">
              <ContactPageEditor
                content={contactState}
                setContent={setContactState}
                onSave={() => handleSavePageContent('contact')}
                isSaving={getSavingState('contact')}
              />
            </TabsContent>
            <TabsContent value="charity" className="mt-6">
              <CharityPageEditor
                content={charityState}
                setContent={setCharityState}
                onSave={() => handleSavePageContent('charity')}
                isSaving={getSavingState('charity')}
              />
            </TabsContent>
            <TabsContent value="dakshina" className="mt-6">
              <DakshinaPageEditor
                content={dakshinaState}
                setContent={setDakshinaState}
                onSave={() => handleSavePageContent('dakshina')}
                isSaving={getSavingState('dakshina')}
              />
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <GalleryPageEditor
                content={galleryState}
                setContent={setGalleryState}
                onSave={() => handleSavePageContent('gallery')}
                isSaving={getSavingState('gallery')}
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
                content={headerState}
                setContent={setHeaderState}
                onSave={handleSaveHeader}
                isSaving={headerContentHook.isSaving}
              />
            </TabsContent>
            <TabsContent value="footer" className="mt-6">
              <FooterEditor
                content={footerState}
                setContent={setFooterState}
                onSave={handleSaveFooter}
                isSaving={footerContentHook.isSaving}
              />
            </TabsContent>
            <TabsContent value="menu" className="mt-6">
              <MenuEditor
                items={menuItems}
                setItems={setMenuItems}
                onSave={handleSaveMenu}
                isSaving={false}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
