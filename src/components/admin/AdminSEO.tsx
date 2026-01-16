import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MagnifyingGlass, FloppyDisk, Spinner, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'

interface PageMetadata {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
}

interface SiteMetadata {
  site_title: string
  site_description: string
  site_keywords: string
}

export default function AdminSEO() {
  const [pages, setPages] = useState<PageMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState<PageMetadata | null>(null)
  const [keywordsInput, setKeywordsInput] = useState('')
  const [siteMetadata, setSiteMetadata] = useState<SiteMetadata>({
    site_title: '',
    site_description: '',
    site_keywords: ''
  })
  const [isLoadingSiteSettings, setIsLoadingSiteSettings] = useState(true)

  useEffect(() => {
    fetchPages()
    loadSiteMetadata()
  }, [])

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, slug, title, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, canonical_url')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setPages(data || [])
      if (data && data.length > 0) {
        setSelectedPage(data[0])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSiteMetadata = async () => {
    setIsLoadingSiteSettings(true)
    try {
      const { data, error } = await supabase
        .from('site_metadata')
        .select('setting_key, setting_value')
        .eq('category', 'metadata')
        .in('setting_key', ['site_title', 'site_description', 'site_keywords'])

      if (error) throw error

      const settings: Record<string, string> = {}
      data?.forEach((item) => {
        settings[item.setting_key] = item.setting_value
      })

      setSiteMetadata({
        site_title: settings.site_title || 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide',
        site_description: settings.site_description || 'Experience authentic Hindu rituals and spiritual guidance',
        site_keywords: settings.site_keywords || 'hindu priest ireland, pandit ireland'
      })
    } catch (error) {
      console.error('Error loading site metadata:', error)
      toast.error('Failed to load site settings')
    } finally {
      setIsLoadingSiteSettings(false)
    }
  }

  const saveSiteMetadata = async () => {
    setIsSaving(true)
    try {
      const updates = [
        { key: 'site_title', value: siteMetadata.site_title },
        { key: 'site_description', value: siteMetadata.site_description },
        { key: 'site_keywords', value: siteMetadata.site_keywords }
      ]

      for (const { key, value } of updates) {
        const { error } = await supabase
          .from('site_metadata')
          .update({ 
            setting_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key)

        if (error) throw error
      }

      toast.success('Site metadata saved successfully!')
      loadSiteMetadata()
    } catch (error) {
      console.error('Error saving site metadata:', error)
      toast.error('Failed to save site metadata')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePage = async () => {
    if (!selectedPage) return

    setIsSaving(true)
    try {
      // Convert comma-separated string to array for saving
      const keywordsArray = keywordsInput.split(',').map(k => k.trim()).filter(Boolean)
      
      const { error } = await supabase
        .from('pages')
        .update({
          meta_title: selectedPage.meta_title,
          meta_description: selectedPage.meta_description,
          meta_keywords: keywordsArray,
          og_title: selectedPage.og_title,
          og_description: selectedPage.og_description,
          og_image_url: selectedPage.og_image_url,
          canonical_url: selectedPage.canonical_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPage.id)

      if (error) throw error

      toast.success('Page metadata updated successfully')
      fetchPages()
    } catch (error) {
      console.error('Error updating page metadata:', error)
      toast.error('Failed to update page metadata')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePageChange = (page: PageMetadata) => {
    setSelectedPage({ ...page })
    setKeywordsInput(page.meta_keywords?.join(', ') || '')
  }

  const updateSelectedPageField = (field: keyof PageMetadata, value: any) => {
    if (!selectedPage) return
    setSelectedPage({ ...selectedPage, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MagnifyingGlass size={24} className="text-primary" />
            </div>
            <div>
              <CardTitle>SEO & Metadata Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage search engine optimization and social media metadata
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pages" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pages">Page Metadata</TabsTrigger>
              <TabsTrigger value="site">Site-Wide Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="animate-spin" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Page Selector */}
                  <div className="lg:col-span-1 space-y-2">
                    <Label>Select Page</Label>
                    <div className="space-y-1">
                      {pages.map((page) => (
                        <Button
                          key={page.id}
                          variant={selectedPage?.id === page.id ? 'default' : 'outline'}
                          className="w-full justify-start"
                          onClick={() => handlePageChange(page)}
                        >
                          <Globe size={16} className="mr-2" />
                          {page.title}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Form */}
                  {selectedPage && (
                    <div className="lg:col-span-3 space-y-6">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-1">{selectedPage.title}</h3>
                        <p className="text-sm text-muted-foreground">/{selectedPage.slug}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="meta_title">Meta Title</Label>
                          <Input
                            id="meta_title"
                            value={selectedPage.meta_title || ''}
                            onChange={(e) => updateSelectedPageField('meta_title', e.target.value)}
                            placeholder="SEO optimized page title (50-60 characters)"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(selectedPage.meta_title || '').length} characters
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="meta_description">Meta Description</Label>
                          <Textarea
                            id="meta_description"
                            value={selectedPage.meta_description || ''}
                            onChange={(e) => updateSelectedPageField('meta_description', e.target.value)}
                            placeholder="Brief description for search results (150-160 characters)"
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(selectedPage.meta_description || '').length} characters
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="meta_keywords">Meta Keywords</Label>
                          <Input
                            id="meta_keywords"
                            value={keywordsInput}
                            onChange={(e) => setKeywordsInput(e.target.value)}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Comma-separated keywords
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="canonical_url">Canonical URL</Label>
                          <Input
                            id="canonical_url"
                            value={selectedPage.canonical_url || ''}
                            onChange={(e) => updateSelectedPageField('canonical_url', e.target.value)}
                            placeholder="https://panditrajesh.ie/page-slug"
                          />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4">Open Graph (Social Media)</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="og_title">OG Title</Label>
                              <Input
                                id="og_title"
                                value={selectedPage.og_title || ''}
                                onChange={(e) => updateSelectedPageField('og_title', e.target.value)}
                                placeholder="Title for social media shares"
                              />
                            </div>

                            <div>
                              <Label htmlFor="og_description">OG Description</Label>
                              <Textarea
                                id="og_description"
                                value={selectedPage.og_description || ''}
                                onChange={(e) => updateSelectedPageField('og_description', e.target.value)}
                                placeholder="Description for social media shares"
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label htmlFor="og_image_url">OG Image URL</Label>
                              <Input
                                id="og_image_url"
                                value={selectedPage.og_image_url || ''}
                                onChange={(e) => updateSelectedPageField('og_image_url', e.target.value)}
                                placeholder="https://example.com/image.jpg (1200x630px recommended)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleUpdatePage} disabled={isSaving} className="gap-2">
                        {isSaving ? (
                          <>
                            <Spinner className="animate-spin" size={18} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FloppyDisk size={18} />
                            Save Page Metadata
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="site" className="space-y-6">
              {isLoadingSiteSettings ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="animate-spin" size={32} />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Site-Wide Default Metadata</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      These values are used as defaults when pages don't have specific metadata. Changes are saved to the database and take effect immediately.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site_title">Default Site Title</Label>
                    <Input
                      id="site_title"
                      value={siteMetadata.site_title}
                      onChange={(e) => setSiteMetadata({ ...siteMetadata, site_title: e.target.value })}
                      placeholder="Your site title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site_description">Default Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={siteMetadata.site_description}
                      onChange={(e) => setSiteMetadata({ ...siteMetadata, site_description: e.target.value })}
                      placeholder="Your site description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="site_keywords">Default Site Keywords</Label>
                    <Input
                      id="site_keywords"
                      value={siteMetadata.site_keywords}
                      onChange={(e) => setSiteMetadata({ ...siteMetadata, site_keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <Button onClick={saveSiteMetadata} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Spinner className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FloppyDisk size={18} />
                        Save Site Metadata
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
