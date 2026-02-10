import { useState, useEffect } from 'react'
import { FileText, Article as HeaderIcon, Scales } from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useMenuItems } from '../../hooks/useMenus'
import { supabase } from '../../lib/supabase'

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
  useTestimonialsContent,
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
  TestimonialsPageEditor,
  HeaderEditor,
  FooterEditor,
  MenuEditor,
  LegalPagesManager,
  DynamicPageEditor
} from './editors'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'pages' | 'sections' | 'legal'>('pages')
  const [activePageTab, setActivePageTab] = useState<PageKey>('home')
  const [activeSectionTab, setActiveSectionTab] = useState<SectionKey>('header')
  const [selectedMenuLocation, setSelectedMenuLocation] = useState<'header' | 'footer' | 'legal'>('header')
  
  // Legal pages state
  const [editingLegalPageSlug, setEditingLegalPageSlug] = useState<string | null>(null)

  // Database hooks for CMS content
  const homeContent = useHomeContent()
  const aboutContent = useAboutContent()
  const whyChooseContent = useWhyChooseContent()
  const booksContent = useBooksPageContent()
  const contactContent = useContactContent()
  const charityContent = useCharityContent()
  const dakshinaContent = useDakshinaContent()
  const galleryContent = useGalleryContent()
  const testimonialsContent = useTestimonialsContent()
  const headerContentHook = useHeaderContent()
  const footerContentHook = useFooterContent()

  // Menu items from database (based on selected location)
  const menuItemsHook = useMenuItems(selectedMenuLocation)

  // Local state for editors (synced with database)
  const [homeState, setHomeState] = useState(homeContent.content)
  const [aboutState, setAboutState] = useState(aboutContent.content)
  const [whyChooseState, setWhyChooseState] = useState(whyChooseContent.content)
  const [booksState, setBooksState] = useState(booksContent.content)
  const [contactState, setContactState] = useState(contactContent.content)
  const [charityState, setCharityState] = useState(charityContent.content)
  const [dakshinaState, setDakshinaState] = useState(dakshinaContent.content)
  const [galleryState, setGalleryState] = useState(galleryContent.content)
  const [testimonialsState, setTestimonialsState] = useState(testimonialsContent.content)
  const [headerState, setHeaderState] = useState(headerContentHook.content)
  const [footerState, setFooterState] = useState(footerContentHook.content)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isSavingMenu, setIsSavingMenu] = useState(false)

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
    if (!testimonialsContent.isLoading) setTestimonialsState(testimonialsContent.content)
  }, [testimonialsContent.content, testimonialsContent.isLoading])

  useEffect(() => {
    if (!headerContentHook.isLoading) setHeaderState(headerContentHook.content)
  }, [headerContentHook.content, headerContentHook.isLoading])

  useEffect(() => {
    if (!footerContentHook.isLoading) setFooterState(footerContentHook.content)
  }, [footerContentHook.content, footerContentHook.isLoading])

  // Load menu items from database when location changes
  useEffect(() => {
    if (!menuItemsHook.isLoading) {
      if (menuItemsHook.items.length > 0) {
        setMenuItems(menuItemsHook.items.map(item => ({
          id: item.id,
          label: item.label,
          url: item.url,
          order: item.sort_order,
          parent_id: item.parent_id,
          icon: item.icon
        })))
      } else {
        // Show empty state if no items in database
        setMenuItems([])
      }
    }
  }, [menuItemsHook.items, menuItemsHook.isLoading, selectedMenuLocation])

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
        case 'testimonials':
          await testimonialsContent.save(testimonialsState)
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
    setIsSavingMenu(true)
    try {
      console.log(`Saving ${selectedMenuLocation} menu with items:`, menuItems)
      let menuData = await fetchMenuByLocation(selectedMenuLocation)
      
      // If menu doesn't exist, create it
      if (!menuData) {
        console.log(`Creating ${selectedMenuLocation} menu...`)
        const { data: newMenu, error: createError } = await supabase
          .from('menus')
          .insert({
            name: `${selectedMenuLocation.charAt(0).toUpperCase() + selectedMenuLocation.slice(1)} Menu`,
            location: selectedMenuLocation,
            is_active: true
          })
          .select()
          .single()
        
        if (createError) {
          console.error('Error creating menu:', createError)
          throw new Error(`Failed to create ${selectedMenuLocation} menu: ${createError.message}`)
        }
        
        menuData = newMenu
        console.log('Menu created:', menuData)
        toast.success(`${selectedMenuLocation.charAt(0).toUpperCase() + selectedMenuLocation.slice(1)} menu created`)
      } else {
        console.log('Existing menu found:', menuData)
      }

      // Get existing items from database
      const existingItems = menuItemsHook.items
      const currentItems = menuItems

      console.log('Existing items:', existingItems.length, 'Current items:', currentItems.length)

      // Find items to delete (exist in DB but not in current state)
      const itemsToDelete = existingItems.filter(
        dbItem => !currentItems.find(item => item.id === dbItem.id)
      )

      // Find items to update (have real database IDs, not temporary ones)
      const itemsToUpdate = currentItems
        .filter(item => item.id && !item.id.startsWith('temp_'))
        .map(item => ({
          id: item.id!,
          label: item.label,
          url: item.url,
          sort_order: item.order,
          parent_id: item.parent_id || null,
          icon: item.icon || null,
          is_visible: true
        }))

      // Find items to create (don't have ID or have temporary ID)
      const itemsToCreate = currentItems
        .filter(item => !item.id || item.id.startsWith('temp_'))
        .map(item => ({
          tempId: item.id, // Keep track of temporary ID for parent-child relationships
          menu_id: menuData.id,
          label: item.label,
          url: item.url,
          sort_order: item.order,
          parent_id: item.parent_id || null,
          icon: item.icon || null,
          is_visible: true,
          target: '_self' as const,
          page_id: null,
          css_class: null
        }))

      console.log('Items to delete:', itemsToDelete.length)
      console.log('Items to update:', itemsToUpdate.length)
      console.log('Items to create:', itemsToCreate.length)

      // Execute operations
      for (const item of itemsToDelete) {
        console.log('Deleting item:', item.id, item.label)
        await menuItemsHook.deleteItem(item.id)
      }

      // Create items, handling parent-child relationships with temporary IDs
      const tempIdMap = new Map<string, string>() // Map temp IDs to real database IDs
      
      // First pass: create items without parent or with existing parent
      for (const item of itemsToCreate) {
        const hasTemporaryParent = item.parent_id && item.parent_id.startsWith('temp_')
        if (!hasTemporaryParent) {
          console.log('Creating item (pass 1):', item.label, 'parent:', item.parent_id)
          // Exclude tempId before sending to database
          const { tempId, ...itemData } = item
          const created = await menuItemsHook.createItem(itemData)
          console.log('Created item:', created.id, created.label)
          if (tempId) {
            tempIdMap.set(tempId, created.id)
          }
        }
      }
      
      // Second pass: create items with temporary parent IDs, replacing with real IDs
      for (const item of itemsToCreate) {
        const hasTemporaryParent = item.parent_id && item.parent_id.startsWith('temp_')
        if (hasTemporaryParent && item.parent_id) {
          const realParentId = tempIdMap.get(item.parent_id)
          console.log('Creating item (pass 2):', item.label, 'temp parent:', item.parent_id, 'real parent:', realParentId)
          // Exclude tempId before sending to database
          const { tempId, ...itemData } = item
          const created = await menuItemsHook.createItem({
            ...itemData,
            parent_id: realParentId || null
          })
          console.log('Created item:', created.id, created.label)
          if (tempId) {
            tempIdMap.set(tempId, created.id)
          }
        }
      }

      if (itemsToUpdate.length > 0) {
        console.log('Updating items:', itemsToUpdate.length)
        await menuItemsHook.batchUpdateItems(itemsToUpdate)
      }

      // Refresh data
      console.log('Refreshing menu data...')
      await menuItemsHook.refetch()
      
      console.log('Menu saved successfully!')
      toast.success('Menu saved successfully')
    } catch (error) {
      console.error('Error saving menu:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : 'Unknown error'
      toast.error(`Failed to save menu: ${errorMessage}`)
    } finally {
      setIsSavingMenu(false)
    }
  }

  // Helper function to fetch menu by location
  const fetchMenuByLocation = async (location: string) => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('location', location)
      .eq('is_active', true)
      .single()

    if (error) {
      // PGRST116 means no rows returned, which is fine - menu doesn't exist yet
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching menu:', error)
      throw new Error(`Failed to fetch menu: ${error.message}`)
    }
    return data
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
    testimonialsContent.isLoading ||
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
      case 'testimonials': return testimonialsContent.isSaving
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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pages' | 'sections' | 'legal')}>
        <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText size={16} className="mr-2" />
            Page Content
          </TabsTrigger>
          <TabsTrigger value="sections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <HeaderIcon size={16} className="mr-2" />
            Header, Footer & Menu
          </TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Scales size={16} className="mr-2" />
            Legal Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <Tabs value={activePageTab} onValueChange={(value) => setActivePageTab(value as PageKey)}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-9 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Home</TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About Us</TabsTrigger>
              <TabsTrigger value="whyChoose" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Why Choose Us</TabsTrigger>
              <TabsTrigger value="books" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Books</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contact</TabsTrigger>
              <TabsTrigger value="charity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Charity</TabsTrigger>
              <TabsTrigger value="dakshina" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dakshina</TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Gallery</TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Testimonials</TabsTrigger>
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
            <TabsContent value="testimonials" className="mt-6">
              <TestimonialsPageEditor
                content={testimonialsState}
                setContent={setTestimonialsState}
                onSave={() => handleSavePageContent('testimonials')}
                isSaving={getSavingState('testimonials')}
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
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Select Menu Location</CardTitle>
                  <CardDescription>Choose which menu to edit</CardDescription>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={selectedMenuLocation === 'header' ? 'default' : 'outline'}
                      onClick={() => setSelectedMenuLocation('header')}
                      size="sm"
                    >
                      Header Menu
                    </Button>
                    <Button
                      variant={selectedMenuLocation === 'footer' ? 'default' : 'outline'}
                      onClick={() => setSelectedMenuLocation('footer')}
                      size="sm"
                    >
                      Footer Menu
                    </Button>
                    <Button
                      variant={selectedMenuLocation === 'legal' ? 'default' : 'outline'}
                      onClick={() => setSelectedMenuLocation('legal')}
                      size="sm"
                    >
                      Legal Menu
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              <MenuEditor
                items={menuItems}
                setItems={setMenuItems}
                onSave={handleSaveMenu}
                isSaving={isSavingMenu}
                menuLocation={selectedMenuLocation}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Legal Pages Tab */}
        <TabsContent value="legal" className="mt-6">
          {editingLegalPageSlug ? (
            <DynamicPageEditor
              slug={editingLegalPageSlug}
              onBack={() => setEditingLegalPageSlug(null)}
            />
          ) : (
            <LegalPagesManager
              onEditPage={(slug) => setEditingLegalPageSlug(slug)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
