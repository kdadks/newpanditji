'use client'

import { useState } from 'react'
import { Plus, Trash, PencilSimple, Eye, EyeSlash } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { useLegalPages } from '../../../hooks/useLegalPages'
import type { PageRow } from '../../../lib/supabase'

interface LegalPagesManagerProps {
  onEditPage: (slug: string) => void
}

export default function LegalPagesManager({ onEditPage }: LegalPagesManagerProps) {
  const { pages, isLoading, createPage, deletePage } = useLegalPages()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPageData, setNewPageData] = useState({
    slug: '',
    title: '',
    metaTitle: '',
    metaDescription: ''
  })

  const handleCreatePage = async () => {
    if (!newPageData.slug || !newPageData.title) {
      return
    }

    try {
      await createPage({
        slug: newPageData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: newPageData.title,
        metaTitle: newPageData.metaTitle || newPageData.title,
        metaDescription: newPageData.metaDescription
      })

      setIsCreateDialogOpen(false)
      setNewPageData({ slug: '', title: '', metaTitle: '', metaDescription: '' })
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  const handleDeletePage = async (pageId: string, pageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deletePage(pageId)
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading legal pages...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Legal Pages</h2>
          <p className="text-gray-600 mt-1">
            Create and manage legal pages like Privacy Policy, Terms of Service, etc.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Legal Page</DialogTitle>
              <DialogDescription>
                Add a new legal page to your website. The slug will be used in the URL.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title" className="mb-1.5">Page Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cookie Policy"
                  value={newPageData.title}
                  onChange={(e) => setNewPageData(prev => ({
                    ...prev,
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="slug" className="mb-1.5">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g., cookie-policy"
                  value={newPageData.slug}
                  onChange={(e) => setNewPageData(prev => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will be accessible at: /{newPageData.slug || 'your-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="metaTitle" className="mb-1.5">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  placeholder="Optional - defaults to page title"
                  value={newPageData.metaTitle}
                  onChange={(e) => setNewPageData(prev => ({ ...prev, metaTitle: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="metaDescription" className="mb-1.5">Meta Description (SEO)</Label>
                <Input
                  id="metaDescription"
                  placeholder="Optional - short description for search engines"
                  value={newPageData.metaDescription}
                  onChange={(e) => setNewPageData(prev => ({ ...prev, metaDescription: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePage}
                  disabled={!newPageData.slug || !newPageData.title}
                >
                  Create Page
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pages List */}
      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No legal pages yet. Create your first one!</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page: PageRow) => (
            <Card key={page.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {page.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        page.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {page.is_published ? (
                          <><Eye className="w-3 h-3 inline mr-1" />Published</>
                        ) : (
                          <><EyeSlash className="w-3 h-3 inline mr-1" />Draft</>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      URL: <code className="bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                    </p>
                    {page.meta_description && (
                      <p className="text-sm text-gray-500">{page.meta_description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPage(page.slug)}
                    >
                      <PencilSimple className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePage(page.id, page.title)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
