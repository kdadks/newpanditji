import { useEffect, useRef } from 'react'
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
import type { DakshinaPageContent, DakshinaService } from '../types/cms-types'

interface DakshinaPageEditorProps {
  content: DakshinaPageContent
  setContent: React.Dispatch<React.SetStateAction<DakshinaPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function DakshinaPageEditor({ content, setContent, onSave, isSaving }: DakshinaPageEditorProps) {
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([])
  const keyPointRefs = useRef<(HTMLDivElement | null)[]>([])
  const noteRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastServiceIndex = useRef<number>(-1)
  const lastKeyPointIndex = useRef<number>(-1)
  const lastNoteIndex = useRef<number>(-1)

  useEffect(() => {
    // Scroll to newly added service
    if (lastServiceIndex.current !== -1 && serviceRefs.current[lastServiceIndex.current]) {
      serviceRefs.current[lastServiceIndex.current]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      lastServiceIndex.current = -1
    }
  }, [content.pricingSection.services.length])

  useEffect(() => {
    // Scroll to newly added key point
    if (lastKeyPointIndex.current !== -1 && keyPointRefs.current[lastKeyPointIndex.current]) {
      keyPointRefs.current[lastKeyPointIndex.current]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      lastKeyPointIndex.current = -1
    }
  }, [content.whatIsDakshina.keyPoints.length])

  useEffect(() => {
    // Scroll to newly added note
    if (lastNoteIndex.current !== -1 && noteRefs.current[lastNoteIndex.current]) {
      noteRefs.current[lastNoteIndex.current]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      lastNoteIndex.current = -1
    }
  }, [content.pricingSection.notes?.length])

  const addService = () => {
    const newService: DakshinaService = {
      name: '',
      description: '',
      duration: '',
      price: '',
      priceNote: ''
    }
    lastServiceIndex.current = content.pricingSection.services.length
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        services: [...prev.pricingSection.services, newService]
      }
    }))
  }

  const updateService = (index: number, field: keyof DakshinaService, value: string) => {
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        services: prev.pricingSection.services.map((service, i) =>
          i === index ? { ...service, [field]: value } : service
        )
      }
    }))
  }

  const removeService = (index: number) => {
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        services: prev.pricingSection.services.filter((_, i) => i !== index)
      }
    }))
  }

  const addKeyPoint = () => {
    lastKeyPointIndex.current = content.whatIsDakshina.keyPoints.length
    setContent(prev => ({
      ...prev,
      whatIsDakshina: {
        ...prev.whatIsDakshina,
        keyPoints: [...prev.whatIsDakshina.keyPoints, { title: '', description: '' }]
      }
    }))
  }

  const updateKeyPoint = (index: number, field: 'title' | 'description', value: string) => {
    setContent(prev => ({
      ...prev,
      whatIsDakshina: {
        ...prev.whatIsDakshina,
        keyPoints: prev.whatIsDakshina.keyPoints.map((point, i) =>
          i === index ? { ...point, [field]: value } : point
        )
      }
    }))
  }

  const removeKeyPoint = (index: number) => {
    setContent(prev => ({
      ...prev,
      whatIsDakshina: {
        ...prev.whatIsDakshina,
        keyPoints: prev.whatIsDakshina.keyPoints.filter((_, i) => i !== index)
      }
    }))
  }

  const addNote = () => {
    lastNoteIndex.current = content.pricingSection.notes?.length || 0
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        notes: [...(prev.pricingSection.notes || []), '']
      }
    }))
  }

  const updateNote = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        notes: (prev.pricingSection.notes || []).map((note, i) => i === index ? value : note)
      }
    }))
  }

  const removeNote = (index: number) => {
    setContent(prev => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        notes: (prev.pricingSection.notes || []).filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background z-10 pb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Dakshina Page Content</h2>
          <p className="text-muted-foreground">Manage Dakshina page content and pricing</p>
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

      {/* Section 1: Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Hero Section</CardTitle>
          <CardDescription>Main banner with title and background images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
              placeholder="Understanding <highlight>Dakshina</highlight>"
            />
            <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; to highlight specific words</p>
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              placeholder="Sacred Offerings & Service Costs"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              placeholder="Brief description of the page"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Background Images</Label>
            <ImageGrid
              images={content.hero.backgroundImages}
              onRemove={(index) => {
                setContent(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    backgroundImages: prev.hero.backgroundImages.filter((_, i) => i !== index)
                  }
                }))
              }}
              onAdd={(url) => {
                setContent(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    backgroundImages: [...prev.hero.backgroundImages, url]
                  }
                }))
              }}
              label="Background Images"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: What is Dakshina */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. What is Dakshina Section</CardTitle>
          <CardDescription>Explain the concept and tradition of Dakshina</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.whatIsDakshina.title}
              onChange={(e) => setContent(prev => ({ ...prev, whatIsDakshina: { ...prev.whatIsDakshina, title: e.target.value } }))}
              placeholder="What is Dakshina?"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.whatIsDakshina.subtitle}
              onChange={(e) => setContent(prev => ({ ...prev, whatIsDakshina: { ...prev.whatIsDakshina, subtitle: e.target.value } }))}
              placeholder="Understanding the Sacred Tradition"
            />
          </div>

          <div className="space-y-2">
            <Label>Content (Rich Text)</Label>
            <QuillEditor
              value={content.whatIsDakshina.content}
              onChange={(value) => setContent(prev => ({ ...prev, whatIsDakshina: { ...prev.whatIsDakshina, content: value } }))}
              placeholder="Write detailed explanation about Dakshina..."
              minHeight="200px"
            />
          </div>

          {/* Key Points */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Key Points</Label>
              <Button onClick={addKeyPoint} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Add Point
              </Button>
            </div>

            <div className="space-y-4">
              {content.whatIsDakshina.keyPoints.map((point, index) => (
                <Card
                  key={index}
                  className="p-4"
                  ref={(el) => {
                    keyPointRefs.current[index] = el
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Point {index + 1}</Label>
                      <Button
                        onClick={() => removeKeyPoint(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <Input
                      value={point.title}
                      onChange={(e) => updateKeyPoint(index, 'title', e.target.value)}
                      placeholder="Point title"
                    />
                    <Textarea
                      value={point.description}
                      onChange={(e) => updateKeyPoint(index, 'description', e.target.value)}
                      placeholder="Point description"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Pricing Section</CardTitle>
          <CardDescription>Service pricing and cost information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={content.pricingSection.badge}
              onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, badge: e.target.value } }))}
              placeholder="Transparent Pricing"
            />
          </div>

          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.pricingSection.title}
              onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, title: e.target.value } }))}
              placeholder="Service & Package Pricing"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.pricingSection.description}
              onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, description: e.target.value } }))}
              placeholder="Brief description of pricing"
              rows={3}
            />
          </div>

          {/* Services/Packages */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Services & Packages</Label>
              <Button onClick={addService} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Add Service
              </Button>
            </div>

            <div className="space-y-4">
              {content.pricingSection.services.map((service, index) => (
                <Card
                  key={index}
                  className="p-4"
                  ref={(el) => {
                    serviceRefs.current[index] = el
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Service {index + 1}</Label>
                      <Button
                        onClick={() => removeService(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Service Name *</Label>
                        <Input
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="e.g., Lakshmi Pooja"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price (€) *</Label>
                        <Input
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          placeholder="e.g., 100"
                          type="number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={service.description || ''}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Brief description of the service"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Duration</Label>
                        <Input
                          value={service.duration || ''}
                          onChange={(e) => updateService(index, 'duration', e.target.value)}
                          placeholder="e.g., 1-2 hours"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price Note</Label>
                        <Input
                          value={service.priceNote || ''}
                          onChange={(e) => updateService(index, 'priceNote', e.target.value)}
                          placeholder="e.g., Starting price"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Important Notes</Label>
              <Button onClick={addNote} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Add Note
              </Button>
            </div>

            <div className="space-y-2">
              {content.pricingSection.notes?.map((note, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                  ref={(el) => {
                    noteRefs.current[index] = el
                  }}
                >
                  <Input
                    value={note}
                    onChange={(e) => updateNote(index, e.target.value)}
                    placeholder="Enter an important note"
                  />
                  <Button
                    onClick={() => removeNote(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">4. Call-to-Action Section</CardTitle>
          <CardDescription>Encourage users to take action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CTA Title</Label>
            <Input
              value={content.ctaSection.title}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, title: e.target.value } }))}
              placeholder="Ready to Book a Ceremony?"
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea
              value={content.ctaSection.description}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, description: e.target.value } }))}
              placeholder="Compelling description to encourage action"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={content.ctaSection.primaryButtonText}
                onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, primaryButtonText: e.target.value } }))}
                placeholder="Contact Us"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={content.ctaSection.secondaryButtonText}
                onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, secondaryButtonText: e.target.value } }))}
                placeholder="View All Services"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: SEO Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5. SEO Metadata</CardTitle>
          <CardDescription>Search engine optimization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input
              value={content.pageMetadata?.metaTitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, pageMetadata: { ...prev.pageMetadata, metaTitle: e.target.value } }))}
              placeholder="Dakshina | Service Pricing & Sacred Offerings"
            />
            <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={content.pageMetadata?.metaDescription || ''}
              onChange={(e) => setContent(prev => ({ ...prev, pageMetadata: { ...prev.pageMetadata, metaDescription: e.target.value } }))}
              placeholder="Brief description for search engines"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Meta Keywords (comma-separated)</Label>
            <Input
              value={content.pageMetadata?.metaKeywords?.join(', ') || ''}
              onChange={(e) => setContent(prev => ({
                ...prev,
                pageMetadata: {
                  ...prev.pageMetadata,
                  metaKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                }
              }))}
              placeholder="dakshina, pricing, services"
            />
          </div>

          <div className="space-y-2">
            <Label>Canonical URL</Label>
            <Input
              value={content.pageMetadata?.canonicalUrl || ''}
              onChange={(e) => setContent(prev => ({ ...prev, pageMetadata: { ...prev.pageMetadata, canonicalUrl: e.target.value } }))}
              placeholder="https://panditrajesh.com/dakshina"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
