import { FloppyDisk, Spinner, Image } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { ImageGrid } from './shared/EditorUtils'
import type { ContactPageContent } from '../types/cms-types'

interface ContactPageEditorProps {
  content: ContactPageContent
  setContent: React.Dispatch<React.SetStateAction<ContactPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function ContactPageEditor({ content, setContent, onSave, isSaving }: ContactPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Contact Page Content</h2>
          <p className="text-muted-foreground">Manage contact page content</p>
        </div>
        <Button onClick={onSave} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? (
            <>
              <Spinner className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <FloppyDisk size={20} />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-primary" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              rows={3}
            />
          </div>
          <ImageGrid
            images={content.hero.backgroundImages}
            label="Background Images"
            onRemove={(idx) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, backgroundImages: prev.hero.backgroundImages.filter((_, i) => i !== idx) }
            }))}
            onAdd={(url) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, backgroundImages: [...prev.hero.backgroundImages, url] }
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={content.email || ''}
                onChange={(e) => setContent(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={content.phone || ''}
                onChange={(e) => setContent(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={content.whatsapp || ''}
                onChange={(e) => setContent(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={content.address || ''}
                onChange={(e) => setContent(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
