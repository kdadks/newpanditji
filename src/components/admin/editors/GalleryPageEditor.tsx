import { FloppyDisk, Spinner, Image, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { ImageGrid } from './shared/EditorUtils'
import type { GalleryPageContent } from '../types/cms-types'

interface GalleryPageEditorProps {
  content: GalleryPageContent
  setContent: React.Dispatch<React.SetStateAction<GalleryPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function GalleryPageEditor({ content, setContent, onSave, isSaving }: GalleryPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Gallery Page Content</h2>
          <p className="text-muted-foreground">Manage gallery page hero section content</p>
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

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-primary" />
            Hero Section
          </CardTitle>
          <CardDescription>Main banner with gallery introduction, statistics, and background images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={content.hero.badge || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                placeholder="Divine Moments"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content.hero.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                placeholder="Sacred <highlight>Gallery</highlight>"
              />
              <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; for gradient text</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={content.hero.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              rows={2}
              placeholder="Immerse yourself in the divine beauty of Hindu ceremonies..."
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              rows={2}
              placeholder="Explore our collection of sacred videos and photos..."
            />
          </div>
          
          <ImageGrid
            images={content.hero.backgroundImages}
            label="Background Images (Rolling Animation)"
            onRemove={(idx) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, backgroundImages: prev.hero.backgroundImages.filter((_, i) => i !== idx) }
            }))}
            onAdd={(url) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, backgroundImages: [...prev.hero.backgroundImages, url] }
            }))}
          />

          {/* Hero Statistics */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Hero Statistics</Label>
            <p className="text-xs text-muted-foreground mb-3">Displayed inline in the hero section (e.g., 200+ Ceremonies, 50+ Videos)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.hero.statistics?.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                  <Input
                    value={stat.value}
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        statistics: prev.hero.statistics?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] 
                      } 
                    }))}
                    placeholder="200+"
                    className="w-24"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        statistics: prev.hero.statistics?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] 
                      } 
                    }))}
                    placeholder="Ceremonies"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        statistics: prev.hero.statistics?.filter((_, i) => i !== idx) || [] 
                      } 
                    }))}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setContent(prev => ({ 
                ...prev, 
                hero: { 
                  ...prev.hero, 
                  statistics: [...(prev.hero.statistics || []), { value: '', label: '' }] 
                } 
              }))}
            >
              <Plus size={14} className="mr-2" />
              Add Statistic
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">CTA Buttons</Label>
            <p className="text-xs text-muted-foreground mb-3">Call-to-action buttons displayed in the hero section</p>
            <div className="space-y-3">
              {content.hero.ctaButtons?.map((btn, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                  <Input
                    value={btn.text}
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || [] 
                      } 
                    }))}
                    placeholder="Button Text"
                    className="flex-1"
                  />
                  <Input
                    value={btn.link}
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || [] 
                      } 
                    }))}
                    placeholder="#videos or /page-url"
                    className="w-40"
                  />
                  <select
                    value={btn.variant || 'primary'}
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || [] 
                      } 
                    }))}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="primary">Primary</option>
                    <option value="outline">Outline</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => setContent(prev => ({ 
                      ...prev, 
                      hero: { 
                        ...prev.hero, 
                        ctaButtons: prev.hero.ctaButtons?.filter((_, i) => i !== idx) || [] 
                      } 
                    }))}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setContent(prev => ({ 
                ...prev, 
                hero: { 
                  ...prev.hero, 
                  ctaButtons: [...(prev.hero.ctaButtons || []), { text: '', link: '', variant: 'primary' }] 
                } 
              }))}
            >
              <Plus size={14} className="mr-2" />
              Add CTA Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Note about Videos and Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-muted-foreground" />
            Videos & Photos
          </CardTitle>
          <CardDescription>
            Videos and photos are managed separately in the Media section of the admin panel.
            This editor only manages the hero section content that appears above the gallery items.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
