import { FloppyDisk, Spinner, FileText, Article, Image, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { ImageGrid } from './shared/EditorUtils'
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
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 pb-4 pt-2 border-b mb-4">
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
          <CardDescription>Main banner with charity introduction</CardDescription>
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
                placeholder="eYogi Gurukul"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              placeholder="Spreading Sanatan Dharma..."
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

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Article size={20} className="text-primary" />
            2. Impact Statistics
          </CardTitle>
          <CardDescription>Key numbers displayed in the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.statistics?.map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                <Input
                  value={stat.value}
                  onChange={(e) => setContent(prev => ({ ...prev, statistics: prev.statistics?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] }))}
                  placeholder="500+"
                  className="w-24"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => setContent(prev => ({ ...prev, statistics: prev.statistics?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] }))}
                  placeholder="Students Taught"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, statistics: prev.statistics?.filter((_, i) => i !== idx) || [] }))}>
                  <Trash size={14} />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, statistics: [...(prev.statistics || []), { value: '', label: '' }] }))}>
            <Plus size={14} className="mr-2" />
            Add Statistic
          </Button>
        </CardContent>
      </Card>

      {/* Featured Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            3. Featured Projects Section
          </CardTitle>
          <CardDescription>Main mission statement with video</CardDescription>
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
            <Label className="text-base font-semibold mb-3 block">Project Stats</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {content.featuredProjects?.stats?.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                  <Input
                    value={stat.value}
                    onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, stats: prev.featuredProjects?.stats?.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) || [] } }))}
                    placeholder="10+"
                    className="w-20"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, stats: prev.featuredProjects?.stats?.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) || [] } }))}
                    placeholder="Years"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, stats: prev.featuredProjects?.stats?.filter((_, i) => i !== idx) || [] } }))}>
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent(prev => ({ ...prev, featuredProjects: { ...prev.featuredProjects!, stats: [...(prev.featuredProjects?.stats || []), { value: '', label: '' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add Stat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Article size={20} className="text-primary" />
            4. Service Areas
          </CardTitle>
          <CardDescription>Three cards showcasing different service areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.serviceAreas?.map((area, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Service {idx + 1}</Badge>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, serviceAreas: prev.serviceAreas?.filter((_, i) => i !== idx) || [] }))}>
                  <Trash size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={area.title}
                    onChange={(e) => setContent(prev => ({ ...prev, serviceAreas: prev.serviceAreas?.map((a, i) => i === idx ? { ...a, title: e.target.value } : a) || [] }))}
                    placeholder="Scripture Distribution"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input
                    value={area.icon || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, serviceAreas: prev.serviceAreas?.map((a, i) => i === idx ? { ...a, icon: e.target.value } : a) || [] }))}
                    placeholder="BookOpenText, GraduationCap, Heart..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={area.description}
                  onChange={(e) => setContent(prev => ({ ...prev, serviceAreas: prev.serviceAreas?.map((a, i) => i === idx ? { ...a, description: e.target.value } : a) || [] }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Stats Label</Label>
                <Input
                  value={area.stats || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, serviceAreas: prev.serviceAreas?.map((a, i) => i === idx ? { ...a, stats: e.target.value } : a) || [] }))}
                  placeholder="5,000+ Texts"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, serviceAreas: [...(prev.serviceAreas || []), { title: '', description: '', icon: '', stats: '' }] }))}>
            <Plus size={14} className="mr-2" />
            Add Service Area
          </Button>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            5. Mission Statement
          </CardTitle>
          <CardDescription>Why we serve section with key features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.missionStatement?.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, title: e.target.value } }))}
              placeholder="Why We Serve"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.missionStatement?.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, description: e.target.value } }))}
              rows={3}
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Mission Features</Label>
            {content.missionStatement?.features?.map((feature, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/20 mb-3">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Feature {idx + 1}</Badge>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, features: prev.missionStatement?.features?.filter((_, i) => i !== idx) || [] } }))}>
                    <Trash size={14} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, features: prev.missionStatement?.features?.map((f, i) => i === idx ? { ...f, title: e.target.value } : f) || [] } }))}
                      placeholder="Preserving Ancient Wisdom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={feature.icon || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, features: prev.missionStatement?.features?.map((f, i) => i === idx ? { ...f, icon: e.target.value } : f) || [] } }))}
                      placeholder="Sparkle, Globe, Heart..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={feature.description}
                    onChange={(e) => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, features: prev.missionStatement?.features?.map((f, i) => i === idx ? { ...f, description: e.target.value } : f) || [] } }))}
                    placeholder="Description..."
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setContent(prev => ({ ...prev, missionStatement: { ...prev.missionStatement!, features: [...(prev.missionStatement?.features || []), { title: '', description: '', icon: '' }] } }))}>
              <Plus size={14} className="mr-2" />
              Add Feature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            6. Call-to-Action Section
          </CardTitle>
          <CardDescription>Bottom CTA with support options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.ctaSection?.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection!, title: e.target.value } }))}
              placeholder="Support Our Mission"
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
    </div>
  )
}
