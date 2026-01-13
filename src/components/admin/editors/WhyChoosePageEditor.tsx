import { FloppyDisk, Spinner, FileText, Article, Image, Plus, Trash, CaretUp, CaretDown } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { ImageGrid } from './shared/EditorUtils'
import type { WhyChooseContent } from '../types/cms-types'

interface WhyChoosePageEditorProps {
  content: WhyChooseContent
  setContent: React.Dispatch<React.SetStateAction<WhyChooseContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function WhyChoosePageEditor({ content, setContent, onSave, isSaving }: WhyChoosePageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Why Choose Us Content</h2>
          <p className="text-muted-foreground">Manage why choose us page content</p>
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
          <CardDescription>Main banner at the top of the page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={content.hero.subtitle}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              rows={2}
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

      {/* Quick Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Article size={20} className="text-primary" />
            Quick Benefits
          </CardTitle>
          <CardDescription>Short benefit badges shown in the hero area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {content.quickBenefits?.map((benefit, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg">
                <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                <Input
                  value={benefit.label}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    quickBenefits: prev.quickBenefits?.map((b, i) => i === idx ? { ...b, label: e.target.value } : b) || []
                  }))}
                  placeholder="Label (e.g., 20+ Years)"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => setContent(prev => ({
                    ...prev,
                    quickBenefits: prev.quickBenefits?.filter((_, i) => i !== idx) || []
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
              quickBenefits: [...(prev.quickBenefits || []), { icon: '', label: '' }]
            }))}
          >
            <Plus size={14} className="mr-2" />
            Add Quick Benefit
          </Button>
        </CardContent>
      </Card>

      {/* Reasons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Reasons (6 Key Points)
          </CardTitle>
          <CardDescription>The 6 main reasons why clients should choose you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.reasons?.map((reason, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-sm">Reason {idx + 1}</Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={idx === 0}
                    onClick={() => {
                      const newReasons = [...(content.reasons || [])]
                      ;[newReasons[idx - 1], newReasons[idx]] = [newReasons[idx], newReasons[idx - 1]]
                      setContent(prev => ({ ...prev, reasons: newReasons }))
                    }}
                  >
                    <CaretUp size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={idx === (content.reasons?.length || 0) - 1}
                    onClick={() => {
                      const newReasons = [...(content.reasons || [])]
                      ;[newReasons[idx], newReasons[idx + 1]] = [newReasons[idx + 1], newReasons[idx]]
                      setContent(prev => ({ ...prev, reasons: newReasons }))
                    }}
                  >
                    <CaretDown size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setContent(prev => ({
                      ...prev,
                      reasons: prev.reasons?.filter((_, i) => i !== idx) || []
                    }))}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={reason.title}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    reasons: prev.reasons?.map((r, i) => i === idx ? { ...r, title: e.target.value } : r) || []
                  }))}
                  placeholder="Passion – Devotion That Flows From the Heart"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={reason.description}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    reasons: prev.reasons?.map((r, i) => i === idx ? { ...r, description: e.target.value } : r) || []
                  }))}
                  rows={3}
                  placeholder="Main description of this reason..."
                />
              </div>

              <div className="space-y-2">
                <Label>Impact Statement</Label>
                <Textarea
                  value={reason.impact}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    reasons: prev.reasons?.map((r, i) => i === idx ? { ...r, impact: e.target.value } : r) || []
                  }))}
                  rows={2}
                  placeholder="The impact or benefit for the client..."
                />
              </div>

              <div className="space-y-2">
                <Label>Highlights (bullet points)</Label>
                <div className="space-y-2">
                  {reason.highlights?.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex gap-2 items-center">
                      <Input
                        value={highlight}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            highlights: r.highlights?.map((h, hi) => hi === hIdx ? e.target.value : h) || []
                          } : r) || []
                        }))}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={() => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            highlights: r.highlights?.filter((_, hi) => hi !== hIdx) || []
                          } : r) || []
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
                      reasons: prev.reasons?.map((r, i) => i === idx ? {
                        ...r,
                        highlights: [...(r.highlights || []), '']
                      } : r) || []
                    }))}
                  >
                    <Plus size={14} className="mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </div>

              {/* Shloka Section */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Label>Shloka / Quote (Optional)</Label>
                  {!reason.shloka && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setContent(prev => ({
                        ...prev,
                        reasons: prev.reasons?.map((r, i) => i === idx ? {
                          ...r,
                          shloka: { sanskrit: '', reference: '', hindi: '', english: '' }
                        } : r) || []
                      }))}
                    >
                      <Plus size={14} className="mr-2" />
                      Add Shloka
                    </Button>
                  )}
                </div>
                {reason.shloka && (
                  <div className="space-y-3 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? { ...r, shloka: undefined } : r) || []
                        }))}
                      >
                        <Trash size={14} className="mr-1" />
                        Remove Shloka
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Sanskrit</Label>
                      <Textarea
                        value={reason.shloka.sanskrit}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            shloka: { ...r.shloka!, sanskrit: e.target.value }
                          } : r) || []
                        }))}
                        rows={2}
                        className="font-sanskrit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Reference</Label>
                      <Input
                        value={reason.shloka.reference}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            shloka: { ...r.shloka!, reference: e.target.value }
                          } : r) || []
                        }))}
                        placeholder="Bhagavad Gita 17.16"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Hindi Translation</Label>
                      <Textarea
                        value={reason.shloka.hindi}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            shloka: { ...r.shloka!, hindi: e.target.value }
                          } : r) || []
                        }))}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">English Translation</Label>
                      <Textarea
                        value={reason.shloka.english}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          reasons: prev.reasons?.map((r, i) => i === idx ? {
                            ...r,
                            shloka: { ...r.shloka!, english: e.target.value }
                          } : r) || []
                        }))}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setContent(prev => ({
              ...prev,
              reasons: [...(prev.reasons || []), { title: '', description: '', impact: '', highlights: [] }]
            }))}
          >
            <Plus size={16} className="mr-2" />
            Add New Reason
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
          <CardDescription>Bottom section with CTA buttons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.ctaSection?.title || ''}
              onChange={(e) => setContent(prev => ({
                ...prev,
                ctaSection: { ...prev.ctaSection, title: e.target.value }
              }))}
              placeholder="Experience the Difference"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.ctaSection?.description || ''}
              onChange={(e) => setContent(prev => ({
                ...prev,
                ctaSection: { ...prev.ctaSection, description: e.target.value }
              }))}
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <Label>CTA Buttons</Label>
            {content.ctaSection?.buttons?.map((btn, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-muted/30 p-3 rounded-lg">
                <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                <Input
                  value={btn.text}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    ctaSection: {
                      ...prev.ctaSection,
                      buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, text: e.target.value } : b) || []
                    }
                  }))}
                  placeholder="Button Text"
                  className="flex-1"
                />
                <Input
                  value={btn.link}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    ctaSection: {
                      ...prev.ctaSection,
                      buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, link: e.target.value } : b) || []
                    }
                  }))}
                  placeholder="Link"
                  className="flex-1"
                />
                <select
                  value={btn.variant || 'primary'}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    ctaSection: {
                      ...prev.ctaSection,
                      buttons: prev.ctaSection?.buttons?.map((b, i) => i === idx ? { ...b, variant: e.target.value as 'primary' | 'outline' } : b) || []
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
                    ctaSection: {
                      ...prev.ctaSection,
                      buttons: prev.ctaSection?.buttons?.filter((_, i) => i !== idx) || []
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
                ctaSection: {
                  ...prev.ctaSection,
                  buttons: [...(prev.ctaSection?.buttons || []), { text: '', link: '', variant: 'primary' }]
                }
              }))}
            >
              <Plus size={14} className="mr-2" />
              Add CTA Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
