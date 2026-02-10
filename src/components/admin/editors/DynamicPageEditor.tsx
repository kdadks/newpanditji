'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Card, CardContent } from '../../ui/card'
import { QuillEditor } from '../../ui/quill-editor'
import { useLegalPage } from '../../../hooks/useLegalPages'
import type { LegalPageContent } from '../../../hooks/useLegalPages'

interface DynamicPageEditorProps {
  slug: string
  onBack: () => void
}

export default function DynamicPageEditor({ slug, onBack }: DynamicPageEditorProps) {
  const { content, isLoading, savePage, isSaving } = useLegalPage(slug)
  const [localContent, setLocalContent] = useState<LegalPageContent | null>(null)

  // Sync with database content
  useEffect(() => {
    if (content) {
      setLocalContent(content)
    }
  }, [content])

  const handleSave = async () => {
    if (!localContent) return

    try {
      await savePage(localContent)
    } catch (error) {
      console.error('Failed to save page:', error)
    }
  }

  const addSection = () => {
    if (!localContent) return

    const newSection = {
      title: 'New Section',
      content: '<p>Section content goes here...</p>',
      sortOrder: localContent.sections.length
    }

    setLocalContent({
      ...localContent,
      sections: [...localContent.sections, newSection]
    })
  }

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    if (!localContent) return

    const updatedSections = [...localContent.sections]
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    }

    setLocalContent({
      ...localContent,
      sections: updatedSections
    })
  }

  const removeSection = (index: number) => {
    if (!localContent) return

    const updatedSections = localContent.sections.filter((_, i) => i !== index)
    
    // Update sort orders
    updatedSections.forEach((section, i) => {
      section.sortOrder = i
    })

    setLocalContent({
      ...localContent,
      sections: updatedSections
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading page...
      </div>
    )
  }

  if (!localContent) {
    return (
      <div className="p-8">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Legal Pages
        </Button>
        <p className="text-center text-gray-500 mt-8">Page not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Legal Pages
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="publish-toggle">Publish</Label>
            <Switch
              id="publish-toggle"
              checked={localContent.isPublished}
              onCheckedChange={(checked) => {
                setLocalContent({ ...localContent, isPublished: checked })
              }}
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Page Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={localContent.title}
              onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="meta-title">Meta Title (SEO)</Label>
            <Input
              id="meta-title"
              value={localContent.metaTitle || ''}
              onChange={(e) => setLocalContent({ ...localContent, metaTitle: e.target.value })}
              placeholder={localContent.title}
            />
          </div>

          <div>
            <Label htmlFor="meta-description">Meta Description (SEO)</Label>
            <Input
              id="meta-description"
              value={localContent.metaDescription || ''}
              onChange={(e) => setLocalContent({ ...localContent, metaDescription: e.target.value })}
              placeholder="Brief description for search engines"
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">
              URL: <code className="bg-gray-100 px-2 py-1 rounded">/{localContent.slug}</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Page Sections</h3>
          <Button onClick={addSection} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {localContent.sections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <p className="mb-4">No sections yet. Add your first section!</p>
              <Button onClick={addSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          localContent.sections.map((section, index) => (
            <Card key={index}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Section {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`section-title-${index}`}>Section Title</Label>
                  <Input
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Section Content</Label>
                  <QuillEditor
                    value={section.content}
                    onChange={(value: string) => updateSection(index, 'content', value)}
                    placeholder="Enter section content..."
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Save Footer */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
