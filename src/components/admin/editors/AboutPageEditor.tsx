import { FloppyDisk, Spinner, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { QuillEditor } from '../../ui/quill-editor'
import { MediaPickerInput } from '../../ui/media-picker'
import { ImageGrid } from './shared/EditorUtils'
import type { AboutPageContent } from '../types/cms-types'

interface AboutPageEditorProps {
  content: AboutPageContent
  setContent: React.Dispatch<React.SetStateAction<AboutPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function AboutPageEditor({ content, setContent, onSave, isSaving }: AboutPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Section 1: Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Hero Section</CardTitle>
          <CardDescription>Banner content with profile image and intro text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={content.name}
                onChange={(e) => setContent(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Rajesh Joshi"
              />
            </div>
            <div className="space-y-2">
              <Label>Title / Alias</Label>
              <Input
                value={content.title}
                onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder='"eYogi Raj"'
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={content.badge}
              onChange={(e) => setContent(prev => ({ ...prev, badge: e.target.value }))}
              placeholder="Hindu Scholar & Spiritual Guide"
            />
          </div>
          <div className="space-y-2">
            <Label>Short Bio (Hero Description)</Label>
            <Textarea
              value={content.shortBio}
              onChange={(e) => setContent(prev => ({ ...prev, shortBio: e.target.value }))}
              rows={3}
              placeholder="Brief introduction shown in the hero section..."
            />
          </div>
          <MediaPickerInput
            label="Profile Image"
            value={content.profileImage}
            onChange={(url) => setContent(prev => ({ ...prev, profileImage: url }))}
          />
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
              {content.statistics?.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Input value={stat.value} onChange={(e) => setContent(prev => ({ ...prev, statistics: prev.statistics?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] }))} placeholder="Value" className="w-20" />
                  <Input value={stat.label} onChange={(e) => setContent(prev => ({ ...prev, statistics: prev.statistics?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] }))} placeholder="Label" className="flex-1" />
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, statistics: prev.statistics?.filter((_, i) => i !== idx) || [] }))}><Trash size={14} /></Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent(prev => ({ ...prev, statistics: [...(prev.statistics || []), { label: '', value: '' }] }))}><Plus size={14} className="mr-2" />Add Stat</Button>
          </div>

          {/* CTA Buttons */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">CTA Buttons</Label>
            {content.ctaButtons?.map((btn, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg mb-2">
                <Input value={btn.text} onChange={(e) => setContent(prev => ({ ...prev, ctaButtons: prev.ctaButtons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || [] }))} placeholder="Text" className="flex-1" />
                <Input value={btn.link} onChange={(e) => setContent(prev => ({ ...prev, ctaButtons: prev.ctaButtons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || [] }))} placeholder="Link" className="flex-1" />
                <select value={btn.variant || 'primary'} onChange={(e) => setContent(prev => ({ ...prev, ctaButtons: prev.ctaButtons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || [] }))} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, ctaButtons: prev.ctaButtons?.filter((_, i) => i !== idx) || [] }))}><Trash size={14} /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, ctaButtons: [...(prev.ctaButtons || []), { text: '', link: '', variant: 'primary' }] }))}><Plus size={14} className="mr-2" />Add Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Spiritual Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. The Spiritual Journey</CardTitle>
          <CardDescription>Main content section with biography, meditation programs, and literary contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={content.spiritualJourney?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, title: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label>Content (Rich Text)</Label>
            <QuillEditor value={content.spiritualJourney?.content || ''} onChange={(value) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, content: value } }))} placeholder="Write the spiritual journey content..." minHeight="200px" />
          </div>

          {/* Meditation Programs */}
          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Meditation Programs</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {content.spiritualJourney?.meditationPrograms?.map((prog, idx) => (
                <Badge key={idx} variant="outline" className="py-1.5 px-3">{prog}<button onClick={() => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, meditationPrograms: prev.spiritualJourney?.meditationPrograms?.filter((_, i) => i !== idx) || [] } }))} className="ml-2 text-destructive"><Trash size={12} /></button></Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add meditation program (Enter)" onKeyPress={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, meditationPrograms: [...(prev.spiritualJourney?.meditationPrograms || []), v] } })); (e.target as HTMLInputElement).value = '' } } }} />
              <Button variant="outline" size="icon"><Plus size={16} /></Button>
            </div>
          </div>

          {/* Literary Contributions */}
          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Literary Contributions</Label>
            <div className="space-y-3">
              <Input value={content.spiritualJourney?.literaryContributions?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, literaryContributions: { ...prev.spiritualJourney?.literaryContributions, title: e.target.value } } }))} placeholder="Title" />
              <Textarea value={content.spiritualJourney?.literaryContributions?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, literaryContributions: { ...prev.spiritualJourney?.literaryContributions, description: e.target.value } } }))} rows={2} placeholder="Description" />
              <div className="flex flex-wrap gap-2">
                {content.spiritualJourney?.literaryContributions?.books?.map((book, idx) => (
                  <Badge key={idx} variant="secondary" className="py-1">{book}<button onClick={() => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, literaryContributions: { ...prev.spiritualJourney?.literaryContributions, books: prev.spiritualJourney?.literaryContributions?.books?.filter((_, i) => i !== idx) || [] } } }))} className="ml-2 text-destructive"><Trash size={12} /></button></Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add book title (Enter)" onKeyPress={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, literaryContributions: { ...prev.spiritualJourney?.literaryContributions, books: [...(prev.spiritualJourney?.literaryContributions?.books || []), v] } } })); (e.target as HTMLInputElement).value = '' } } }} />
              </div>
            </div>
          </div>

          {/* Poetry Section */}
          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Poetry & Public Speaking</Label>
            <div className="space-y-3">
              <Input value={content.spiritualJourney?.poetrySection?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, poetrySection: { ...prev.spiritualJourney?.poetrySection, title: e.target.value } } }))} placeholder="Title" />
              <Textarea value={content.spiritualJourney?.poetrySection?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, spiritualJourney: { ...prev.spiritualJourney, poetrySection: { ...prev.spiritualJourney?.poetrySection, description: e.target.value } } }))} rows={2} placeholder="Description" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Sidebar Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Sidebar Cards</CardTitle>
          <CardDescription>Expertise areas and achievement cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Expertise Areas */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Areas of Interest & Expertise</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {content.expertiseAreas?.map((area, idx) => (
                <Badge key={idx} variant="outline" className="py-1.5">{area}<button onClick={() => setContent(prev => ({ ...prev, expertiseAreas: prev.expertiseAreas?.filter((_, i) => i !== idx) || [] }))} className="ml-2 text-destructive"><Trash size={12} /></button></Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add expertise (Enter)" onKeyPress={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { setContent(prev => ({ ...prev, expertiseAreas: [...(prev.expertiseAreas || []), v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>
          </div>

          {/* Academic Card */}
          <div className="border-t pt-4 space-y-2">
            <Label className="text-base font-semibold">Academic Excellence Card</Label>
            <Input value={content.academicCard?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, academicCard: { ...prev.academicCard, title: e.target.value } }))} placeholder="Title" />
            <Textarea value={content.academicCard?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, academicCard: { ...prev.academicCard, description: e.target.value } }))} rows={2} placeholder="Description" />
            <Input value={content.academicCard?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, academicCard: { ...prev.academicCard, badge: e.target.value } }))} placeholder="Badge text" />
          </div>

          {/* Industrialist Card */}
          <div className="border-t pt-4 space-y-2">
            <Label className="text-base font-semibold">Irish Industrialist Card</Label>
            <Input value={content.industrialistCard?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, industrialistCard: { ...prev.industrialistCard, title: e.target.value } }))} placeholder="Title" />
            <Textarea value={content.industrialistCard?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, industrialistCard: { ...prev.industrialistCard, description: e.target.value } }))} rows={2} placeholder="Description" />
            <Input value={content.industrialistCard?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, industrialistCard: { ...prev.industrialistCard, badge: e.target.value } }))} placeholder="Badge text" />
          </div>

          {/* Gurukul Card */}
          <div className="border-t pt-4 space-y-2">
            <Label className="text-base font-semibold">eYogi Gurukul Card</Label>
            <Input value={content.gurukulCard?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, gurukulCard: { ...prev.gurukulCard, title: e.target.value } }))} placeholder="Title" />
            <Textarea value={content.gurukulCard?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, gurukulCard: { ...prev.gurukulCard, description: e.target.value } }))} rows={2} placeholder="Description" />
            <Input value={content.gurukulCard?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, gurukulCard: { ...prev.gurukulCard, badge: e.target.value } }))} placeholder="Badge text" />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Photo Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">4. Photo Gallery</CardTitle>
          <CardDescription>Rolling gallery of images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input value={content.photoGallery?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, badge: e.target.value } }))} placeholder="Badge text" />
            <Input value={content.photoGallery?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, title: e.target.value } }))} placeholder="Section title" className="md:col-span-2" />
          </div>
          <Textarea value={content.photoGallery?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, description: e.target.value } }))} rows={2} placeholder="Description" />
          
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.photoGallery?.images?.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img.src} alt={img.alt} className="w-full h-24 object-cover rounded-lg border" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, images: prev.photoGallery?.images?.filter((_, i) => i !== idx) || [] } }))}><Trash size={14} /></Button>
                  </div>
                  <Input value={img.alt} onChange={(e) => setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, images: prev.photoGallery?.images?.map((im, i) => i === idx ? { ...im, alt: e.target.value } : im) || [] } }))} placeholder="Alt text" className="mt-1 text-xs" />
                </div>
              ))}
              <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                <MediaPickerInput value="" onChange={(url) => url && setContent(prev => ({ ...prev, photoGallery: { ...prev.photoGallery, images: [...(prev.photoGallery?.images || []), { src: url, alt: '' }] } }))} placeholder="Add" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: What to Expect */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5. What to Expect When You Invite Rajesh Ji</CardTitle>
          <CardDescription>Feature cards highlighting unique qualities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input value={content.whatToExpect?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, badge: e.target.value } }))} placeholder="Badge text" />
            <Input value={content.whatToExpect?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, title: e.target.value } }))} placeholder="Section title" className="md:col-span-2" />
          </div>
          <Textarea value={content.whatToExpect?.description || ''} onChange={(e) => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, description: e.target.value } }))} rows={2} placeholder="Section description" />
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Feature Cards (7 cards)</Label>
            {content.whatToExpect?.features?.map((feature, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Card {idx + 1}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, features: prev.whatToExpect?.features?.filter((_, i) => i !== idx) || [] } }))}><Trash size={14} /></Button>
                </div>
                <Input value={feature.title} onChange={(e) => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, features: prev.whatToExpect?.features?.map((f, i) => i === idx ? { ...f, title: e.target.value } : f) || [] } }))} placeholder="Title" />
                <Textarea value={feature.description} onChange={(e) => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, features: prev.whatToExpect?.features?.map((f, i) => i === idx ? { ...f, description: e.target.value } : f) || [] } }))} rows={2} placeholder="Description" />
              </div>
            ))}
            <Button variant="outline" onClick={() => setContent(prev => ({ ...prev, whatToExpect: { ...prev.whatToExpect, features: [...(prev.whatToExpect?.features || []), { title: '', description: '' }] } }))}><Plus size={14} className="mr-2" />Add Feature Card</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Community Service */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">6. Community Service (Seva)</CardTitle>
          <CardDescription>Community service and social impact section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={content.communityService?.badge || ''} onChange={(e) => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, badge: e.target.value } }))} placeholder="Badge text" />
            <Input value={content.communityService?.title || ''} onChange={(e) => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, title: e.target.value } }))} placeholder="Section title" />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Service Items</Label>
            {content.communityService?.services?.map((service, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Service {idx + 1}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, services: prev.communityService?.services?.filter((_, i) => i !== idx) || [] } }))}><Trash size={14} /></Button>
                </div>
                <Input value={service.title} onChange={(e) => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, services: prev.communityService?.services?.map((s, i) => i === idx ? { ...s, title: e.target.value } : s) || [] } }))} placeholder="Title" />
                <Textarea value={service.description} onChange={(e) => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, services: prev.communityService?.services?.map((s, i) => i === idx ? { ...s, description: e.target.value } : s) || [] } }))} rows={2} placeholder="Description" />
              </div>
            ))}
            <Button variant="outline" onClick={() => setContent(prev => ({ ...prev, communityService: { ...prev.communityService, services: [...(prev.communityService?.services || []), { title: '', description: '' }] } }))}><Plus size={14} className="mr-2" />Add Service</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg" className="min-w-[200px]">
          {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save About Page</>}
        </Button>
      </div>
    </div>
  )
}
