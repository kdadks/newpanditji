import { useEffect, useRef } from 'react'
import { FloppyDisk, Spinner, Plus, Trash, ArrowUp, ArrowDown } from '@phosphor-icons/react'
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

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const services = [...content.pricingSection.services]
    const [removed] = services.splice(index, 1)
    services.splice(newIndex, 0, removed)
    setContent(prev => ({
      ...prev,
      pricingSection: { ...prev.pricingSection, services }
    }))
  }

  const addService = () => {
    const newService: DakshinaService = {
      name: '',
      description: '',
      poojaTime: '',
      preparationTime: '',
      totalEngagementTime: '',
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
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 pb-4 pt-2 border-b mb-4">
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
              value={content.hero.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
              placeholder="Understanding <highlight>Dakshina</highlight>"
            />
            <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; to highlight specific words</p>
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              placeholder="Sacred Offerings & Service Costs"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              placeholder="Brief description of the page"
              rows={3}
            />
          </div>

          <div className="space-y-2">
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
              value={content.whatIsDakshina.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, whatIsDakshina: { ...prev.whatIsDakshina, title: e.target.value } }))}
              placeholder="What is Dakshina?"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.whatIsDakshina.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, whatIsDakshina: { ...prev.whatIsDakshina, subtitle: e.target.value } }))}
              placeholder="Understanding the Sacred Tradition"
            />
          </div>

          <div className="space-y-2">
            <Label>Content (Rich Text)</Label>
            <QuillEditor
              value={content.whatIsDakshina.content || ''}
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
                      value={point.title || ''}
                      onChange={(e) => updateKeyPoint(index, 'title', e.target.value)}
                      placeholder="Point title"
                    />
                    <Textarea
                      value={point.description || ''}
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
              value={content.pricingSection.badge || ''}
              onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, badge: e.target.value } }))}
              placeholder="Transparent Pricing"
            />
          </div>

          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.pricingSection.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, title: e.target.value } }))}
              placeholder="Service & Package Pricing"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <QuillEditor
              value={content.pricingSection.description || ''}
              onChange={(value) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, description: value } }))}
              placeholder="Brief description of pricing"
              minHeight="150px"
            />
          </div>

          {/* Column Headers */}
          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Grid Column Headers</Label>
            <p className="text-xs text-muted-foreground mb-3">Customise the header names shown in the Dakshina guidelines table.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Column 1 – Service/Package</Label>
                <Input
                  value={content.pricingSection.columnHeaders?.col1 || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, columnHeaders: { ...prev.pricingSection.columnHeaders, col1: e.target.value } } }))}
                  placeholder="Service/Package"
                />
              </div>
              <div>
                <Label className="text-xs">Column 2 – Pooja Duration</Label>
                <Input
                  value={content.pricingSection.columnHeaders?.col2 || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, columnHeaders: { ...prev.pricingSection.columnHeaders, col2: e.target.value } } }))}
                  placeholder="Pooja Duration"
                />
              </div>
              <div>
                <Label className="text-xs">Column 3 – Preparation Time</Label>
                <Input
                  value={content.pricingSection.columnHeaders?.col3 || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, columnHeaders: { ...prev.pricingSection.columnHeaders, col3: e.target.value } } }))}
                  placeholder="Preparation Time"
                />
              </div>
              <div>
                <Label className="text-xs">Column 4 – Total Engagement Time</Label>
                <Input
                  value={content.pricingSection.columnHeaders?.col4 || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, columnHeaders: { ...prev.pricingSection.columnHeaders, col4: e.target.value } } }))}
                  placeholder="Total Engagement Time"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Column 5 – Dakshina</Label>
                <Input
                  value={content.pricingSection.columnHeaders?.col5 || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, pricingSection: { ...prev.pricingSection, columnHeaders: { ...prev.pricingSection.columnHeaders, col5: e.target.value } } }))}
                  placeholder="Dakshina"
                />
              </div>
            </div>
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
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Service {index + 1}</Label>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => moveService(index, 'up')}
                            size="sm"
                            variant="ghost"
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp size={14} />
                          </Button>
                          <Button
                            onClick={() => moveService(index, 'down')}
                            size="sm"
                            variant="ghost"
                            disabled={index === content.pricingSection.services.length - 1}
                            title="Move down"
                          >
                            <ArrowDown size={14} />
                          </Button>
                        </div>
                      </div>
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
                        <Label className="text-xs">Service/Package Name *</Label>
                        <Input
                          value={service.name || ''}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="e.g., Lakshmi Pooja"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Dakshina (€) *</Label>
                        <Input
                          value={service.price || ''}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>
                      <QuillEditor
                        value={service.description || ''}
                        onChange={(value) => updateService(index, 'description', value)}
                        placeholder="Brief description of the service"
                        minHeight="150px"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Pooja Duration</Label>
                        <Input
                          value={service.poojaTime || ''}
                          onChange={(e) => updateService(index, 'poojaTime', e.target.value)}
                          placeholder="e.g., 1 hour"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Preparation Time</Label>
                        <Input
                          value={service.preparationTime || ''}
                          onChange={(e) => updateService(index, 'preparationTime', e.target.value)}
                          placeholder="e.g., 30 mins"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Total Engagement Time</Label>
                        <Input
                          value={service.totalEngagementTime || ''}
                          onChange={(e) => updateService(index, 'totalEngagementTime', e.target.value)}
                          placeholder="e.g., 1.5 hours"
                        />
                      </div>
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
              value={content.ctaSection.title || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, title: e.target.value } }))}
              placeholder="Ready to Book a Ceremony?"
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea
              value={content.ctaSection.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, description: e.target.value } }))}
              placeholder="Compelling description to encourage action"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={content.ctaSection.primaryButtonText || ''}
                onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, primaryButtonText: e.target.value } }))}
                placeholder="Contact Us"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={content.ctaSection.secondaryButtonText || ''}
                onChange={(e) => setContent(prev => ({ ...prev, ctaSection: { ...prev.ctaSection, secondaryButtonText: e.target.value } }))}
                placeholder="View All Services"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
