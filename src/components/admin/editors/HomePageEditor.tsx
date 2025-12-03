import { FloppyDisk, Spinner, FileText, Article, Image, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { MediaPickerInput } from '../../ui/media-picker'
import { ImageGrid } from './shared/EditorUtils'
import type { HomePageContent } from '../types/cms-types'

interface HomePageEditorProps {
  content: HomePageContent
  setContent: React.Dispatch<React.SetStateAction<HomePageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function HomePageEditor({ content, setContent, onSave, isSaving }: HomePageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-primary" />
            Hero Section
          </CardTitle>
          <CardDescription>Main banner content at the top of the page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input
                value={content.hero.title}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Input
                value={content.hero.subtitle}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hero Description</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              rows={3}
            />
          </div>

          <MediaPickerInput
            label="Profile Image"
            value={content.hero.profileImage}
            onChange={(url) => setContent(prev => ({ ...prev, hero: { ...prev.hero, profileImage: url } }))}
          />

          <ImageGrid
            images={content.hero.backgroundImages}
            label="Background Images (Hero Carousel)"
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

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Article size={20} className="text-primary" />
            Statistics
          </CardTitle>
          <CardDescription>Key numbers displayed in the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.hero.statistics.map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                <Input
                  value={stat.value}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      statistics: prev.hero.statistics.map((s, i) => i === idx ? { ...s, value: e.target.value } : s)
                    }
                  }))}
                  placeholder="Value (e.g., 500+)"
                  className="w-24"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      statistics: prev.hero.statistics.map((s, i) => i === idx ? { ...s, label: e.target.value } : s)
                    }
                  }))}
                  placeholder="Label"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => setContent(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      statistics: prev.hero.statistics.filter((_, i) => i !== idx)
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
            onClick={() => setContent(prev => ({
              ...prev,
              hero: {
                ...prev.hero,
                statistics: [...prev.hero.statistics, { label: '', value: '' }]
              }
            }))}
          >
            <Plus size={14} className="mr-2" />
            Add Statistic
          </Button>
        </CardContent>
      </Card>

      {/* CTA Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Call-to-Action Buttons
          </CardTitle>
          <CardDescription>Buttons displayed in the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.hero.ctaButtons?.map((btn, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-muted/30 p-3 rounded-lg">
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
                placeholder="Link (e.g., /contact)"
                className="flex-1"
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
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="primary">Primary</option>
                <option value="outline">Outline</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive shrink-0"
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
          <Button
            variant="outline"
            size="sm"
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
        </CardContent>
      </Card>

      {/* Photo Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-primary" />
            Photo Gallery Section
          </CardTitle>
          <CardDescription>Gallery of devotion and service images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={content.photoGallery?.badge || ''}
                onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery!, badge: e.target.value } }))}
                placeholder="Our Journey"
              />
            </div>
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={content.photoGallery?.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery!, title: e.target.value } }))}
                placeholder="Moments of Devotion & Service"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.photoGallery?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery!, description: e.target.value } }))}
              rows={2}
              placeholder="Description for the gallery section..."
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Gallery Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.photoGallery?.images?.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery!, images: prev.photoGallery?.images?.filter((_, i) => i !== idx) || [] } }))}>
                      <Trash size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <MediaPickerInput
              label="Add Gallery Image"
              value=""
              onChange={(url) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery!, images: [...(prev.photoGallery?.images || []), url] } }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sacred Spaces Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Article size={20} className="text-primary" />
            Sacred Spaces Gallery
          </CardTitle>
          <CardDescription>Cards showcasing temples and sacred locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.sacredSpaces?.map((space, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Space {idx + 1}</Badge>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, sacredSpaces: prev.sacredSpaces?.filter((_, i) => i !== idx) || [] }))}>
                  <Trash size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={space.title}
                    onChange={(e) => setContent(prev => ({ ...prev, sacredSpaces: prev.sacredSpaces?.map((s, i) => i === idx ? { ...s, title: e.target.value } : s) || [] }))}
                    placeholder="Temple name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={space.location || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, sacredSpaces: prev.sacredSpaces?.map((s, i) => i === idx ? { ...s, location: e.target.value } : s) || [] }))}
                    placeholder="Location..."
                  />
                </div>
              </div>
              <MediaPickerInput
                label="Image"
                value={space.image}
                onChange={(url) => setContent(prev => ({ ...prev, sacredSpaces: prev.sacredSpaces?.map((s, i) => i === idx ? { ...s, image: url } : s) || [] }))}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, sacredSpaces: [...(prev.sacredSpaces || []), { title: '', image: '', location: '' }] }))}>
            <Plus size={14} className="mr-2" />
            Add Sacred Space
          </Button>
        </CardContent>
      </Card>

      {/* Feature Cards Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Feature Cards
          </CardTitle>
          <CardDescription>Three feature cards highlighting key qualities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.featureCards?.map((card, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Feature {idx + 1}</Badge>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, featureCards: prev.featureCards?.filter((_, i) => i !== idx) || [] }))}>
                  <Trash size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => setContent(prev => ({ ...prev, featureCards: prev.featureCards?.map((c, i) => i === idx ? { ...c, title: e.target.value } : c) || [] }))}
                    placeholder="Deep Knowledge"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input
                    value={card.icon || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, featureCards: prev.featureCards?.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c) || [] }))}
                    placeholder="BookOpenText, Heart, Users..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={card.description}
                  onChange={(e) => setContent(prev => ({ ...prev, featureCards: prev.featureCards?.map((c, i) => i === idx ? { ...c, description: e.target.value } : c) || [] }))}
                  rows={2}
                  placeholder="Description of this feature..."
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, featureCards: [...(prev.featureCards || []), { title: '', description: '', icon: '' }] }))}>
            <Plus size={14} className="mr-2" />
            Add Feature Card
          </Button>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Call-to-Action Section
          </CardTitle>
          <CardDescription>Bottom CTA section of the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.ctaSection?.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, title: e.target.value } }))}
              placeholder="Begin Your Spiritual Journey Today"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.ctaSection?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, description: e.target.value } }))}
              rows={2}
              placeholder="Description text..."
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">CTA Buttons</Label>
            {content.ctaSection?.ctaButtons?.map((btn, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg mb-2">
                <Input
                  value={btn.text}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, ctaButtons: prev.ctaSection?.ctaButtons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || [] } }))}
                  placeholder="Button Text"
                  className="flex-1"
                />
                <Input
                  value={btn.link}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, ctaButtons: prev.ctaSection?.ctaButtons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || [] } }))}
                  placeholder="Link"
                  className="flex-1"
                />
                <select
                  value={btn.variant || 'primary'}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, ctaButtons: prev.ctaSection?.ctaButtons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || [] } }))}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, ctaButtons: prev.ctaSection?.ctaButtons?.filter((_, i) => i !== idx) || [] } }))}>
                  <Trash size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, ctaButtons: [...(prev.ctaSection?.ctaButtons || []), { text: '', link: '', variant: 'primary' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add CTA Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg" className="min-w-[200px]">
          {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Home Page</>}
        </Button>
      </div>
    </div>
  )
}
