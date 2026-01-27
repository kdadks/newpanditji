import { FloppyDisk, Spinner, FileText, Image, Plus, Trash, Target } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { ImageGrid } from './shared/EditorUtils'
import { MediaPickerInput } from '../../ui/media-picker'
import type { CharityPageContent } from '../types/cms-types'

interface CharityPageEditorProps {
  content: CharityPageContent
  setContent: React.Dispatch<React.SetStateAction<CharityPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function CharityPageEditor({ content, setContent, onSave, isSaving }: CharityPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Charity Page Content</h2>
          <p className="text-muted-foreground">Manage charity page content and sections</p>
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
            1. Hero Section
          </CardTitle>
          <CardDescription>Main banner with charity introduction, statistics, and CTA buttons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={content.hero.badge || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                placeholder="Serving Since 2001"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content.hero.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                placeholder="eYogi Gurukul - <highlight>Spreading Dharma</highlight>"
              />
              <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; for gradient text</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              placeholder="<highlight>Spreading Dharma</highlight> One Heart at a Time"
            />
            <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; for gradient text</p>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              rows={3}
            />
          </div>
          <MediaPickerInput
            label="Project Logo (Hero Image)"
            value={content.hero.logoImage || ''}
            onChange={(url) => setContent(prev => ({ ...prev, hero: { ...prev.hero, logoImage: url } }))}
            placeholder="Select or paste a logo image URL"
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

          {/* Hero Statistics */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Hero Statistics (Inline)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.hero.statistics?.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                  <Input
                    value={stat.value}
                    onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, statistics: prev.hero.statistics?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] } }))}
                    placeholder="500+"
                    className="w-24"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, statistics: prev.hero.statistics?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] } }))}
                    placeholder="Students"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, hero: { ...prev.hero, statistics: prev.hero.statistics?.filter((_, i) => i !== idx) || [] } }))}>
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent(prev => ({ ...prev, hero: { ...prev.hero, statistics: [...(prev.hero.statistics || []), { value: '', label: '' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add Statistic
            </Button>
          </div>

          {/* Hero CTA Buttons */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Hero CTA Buttons</Label>
            {content.hero.ctaButtons?.map((btn, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg mb-2">
                <Input
                  value={btn.text}
                  onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || [] } }))}
                  placeholder="Button Text"
                  className="flex-1"
                />
                <Input
                  value={btn.link}
                  onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || [] } }))}
                  placeholder="/contact"
                  className="flex-1"
                />
                <select
                  value={btn.variant || 'primary'}
                  onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, ctaButtons: prev.hero.ctaButtons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || [] } }))}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, hero: { ...prev.hero, ctaButtons: prev.hero.ctaButtons?.filter((_, i) => i !== idx) || [] } }))}>
                  <Trash size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, hero: { ...prev.hero, ctaButtons: [...(prev.hero.ctaButtons || []), { text: '', link: '', variant: 'primary' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add CTA Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            2. Featured Projects Section
          </CardTitle>
          <CardDescription>Main mission statement with featured video</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={content.featuredProjects?.badge || ''}
                onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, badge: e.target.value } }))}
                placeholder="Our Mission"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content.featuredProjects?.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, title: e.target.value } }))}
                placeholder="Spreading the Light of Dharma"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.featuredProjects?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, description: e.target.value } }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>YouTube Video URL</Label>
            <Input
              value={content.featuredProjects?.videoUrl || ''}
              onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, videoUrl: e.target.value } }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Project Tags</Label>
            <div className="space-y-2">
              {content.featuredProjects?.projectTags?.map((tag, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                  <Input
                    value={tag}
                    onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, projectTags: prev.featuredProjects?.projectTags?.map((t, i) => i === idx ? e.target.value : t) || [] } }))}
                    placeholder="e.g., Global Impact, Community, Spiritual"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, projectTags: prev.featuredProjects?.projectTags?.filter((_, i) => i !== idx) || [] } }))}>
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, projectTags: [...(prev.featuredProjects?.projectTags || []), ''] } }))}>
              <Plus size={14} className="mr-2" />
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target size={20} className="text-primary" />
            3. Mission & Vision
          </CardTitle>
          <CardDescription>Core mission, vision statements, and values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={content.missionVision?.badge || ''}
              onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, badge: e.target.value } }))}
              placeholder="Our Purpose"
            />
          </div>

          {/* Mission */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Mission</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Mission Title</Label>
                <Input
                  value={content.missionVision?.missionTitle || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, missionTitle: e.target.value } }))}
                  placeholder="Our Mission"
                />
              </div>
              <div className="space-y-2">
                <Label>Mission Description</Label>
                <Textarea
                  value={content.missionVision?.missionDescription || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, missionDescription: e.target.value } }))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Vision</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Vision Title</Label>
                <Input
                  value={content.missionVision?.visionTitle || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, visionTitle: e.target.value } }))}
                  placeholder="Our Vision"
                />
              </div>
              <div className="space-y-2">
                <Label>Vision Description</Label>
                <Textarea
                  value={content.missionVision?.visionDescription || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, visionDescription: e.target.value } }))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Core Values</Label>
            {content.missionVision?.coreValues?.map((value, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/20 mb-3">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Value {idx + 1}</Badge>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, coreValues: prev.missionVision?.coreValues?.filter((_, i) => i !== idx) || [] } }))}>
                    <Trash size={14} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={value.title}
                      onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, coreValues: prev.missionVision?.coreValues?.map((v, i) => i === idx ? { ...v, title: e.target.value } : v) || [] } }))}
                      placeholder="Authenticity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={value.icon || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, coreValues: prev.missionVision?.coreValues?.map((v, i) => i === idx ? { ...v, icon: e.target.value } : v) || [] } }))}
                      placeholder="Sparkle, Heart, Globe, BookOpenText..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={value.description}
                    onChange={(e) => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, coreValues: prev.missionVision?.coreValues?.map((v, i) => i === idx ? { ...v, description: e.target.value } : v) || [] } }))}
                    placeholder="Description..."
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, missionVision: { ...prev.missionVision!, coreValues: [...(prev.missionVision?.coreValues || []), { title: '', description: '', icon: '' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add Value
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            4. Final Call-to-Action Section
          </CardTitle>
          <CardDescription>Bottom CTA with support options and background image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.ctaSection?.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, title: e.target.value } }))}
              placeholder="Join Us in Spreading the Light of Dharma"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.ctaSection?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, description: e.target.value } }))}
              rows={2}
            />
          </div>
          <MediaPickerInput
            label="Background Image"
            value={content.ctaSection?.backgroundImage || ''}
            onChange={(url) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, backgroundImage: url } }))}
            placeholder="Select or paste background image URL"
          />
          <div className="space-y-2">
            <Label>Footer Note (appears below buttons)</Label>
            <Input
              value={content.ctaSection?.footerNote || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, footerNote: e.target.value } }))}
              placeholder="All contributions directly support our educational programs..."
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">CTA Buttons</Label>
            {content.ctaSection?.buttons?.map((btn, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg mb-2">
                <Input
                  value={btn.text}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || [] } }))}
                  placeholder="Button Text"
                  className="flex-1"
                />
                <Input
                  value={btn.link}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || [] } }))}
                  placeholder="Link"
                  className="flex-1"
                />
                <select
                  value={btn.variant || 'primary'}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || [] } }))}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, buttons: prev.ctaSection?.buttons?.filter((_, i) => i !== idx) || [] } }))}>
                  <Trash size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, buttons: [...(prev.ctaSection?.buttons || []), { text: '', link: '', variant: 'primary' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add CTA Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Button */}
      <div className="flex justify-end sticky bottom-0 bg-background/95 backdrop-blur z-50 py-4 border-t">
        <Button onClick={onSave} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? (
            <>
              <Spinner className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <FloppyDisk size={20} />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
