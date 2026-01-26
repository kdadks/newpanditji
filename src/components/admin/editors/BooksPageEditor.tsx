import { FloppyDisk, Spinner, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { ImageGrid } from './shared/EditorUtils'
import type { BooksPageContent } from '../types/cms-types'

interface BooksPageEditorProps {
  content: BooksPageContent
  setContent: React.Dispatch<React.SetStateAction<BooksPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function BooksPageEditor({ content, setContent, onSave, isSaving }: BooksPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Books Page Content</h2>
          <p className="text-muted-foreground">Manage books page content</p>
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
          <CardTitle className="text-lg">Hero Section</CardTitle>
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

          {/* Statistics */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Statistics (Hero)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.stats?.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Input 
                    value={stat.value} 
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      stats: prev.stats?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] 
                    }))} 
                    placeholder="Value" 
                    className="w-24" 
                  />
                  <Input 
                    value={stat.label} 
                    onChange={(e) => setContent(prev => ({ 
                      ...prev, 
                      stats: prev.stats?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] 
                    }))} 
                    placeholder="Label" 
                    className="flex-1" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => setContent(prev => ({ 
                      ...prev, 
                      stats: prev.stats?.filter((_, i) => i !== idx) || [] 
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
                stats: [...(prev.stats || []), { label: '', value: '', subtext: '' }] 
              }))}
            >
              <Plus size={14} className="mr-2" />
              Add Stat
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call-to-Action Section</CardTitle>
          <CardDescription>Bottom section encouraging readers to contact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.cta?.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, title: e.target.value, description: prev.cta?.description || '', buttonText: prev.cta?.buttonText || '', buttonLink: prev.cta?.buttonLink || '' } }))}
              placeholder="Interested in These Books?"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.cta?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, description: e.target.value, title: prev.cta?.title || '', buttonText: prev.cta?.buttonText || '', buttonLink: prev.cta?.buttonLink || '' } }))}
              rows={2}
              placeholder="To learn more about these books..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={content.cta?.buttonText || ''}
                onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, buttonText: e.target.value, title: prev.cta?.title || '', description: prev.cta?.description || '', buttonLink: prev.cta?.buttonLink || '' } }))}
                placeholder="Contact Us for More Information"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={content.cta?.buttonLink || ''}
                onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, buttonLink: e.target.value, title: prev.cta?.title || '', description: prev.cta?.description || '', buttonText: prev.cta?.buttonText || '' } }))}
                placeholder="/contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
