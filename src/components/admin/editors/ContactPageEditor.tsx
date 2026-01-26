import { FloppyDisk, Spinner, Image, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { ImageGrid } from './shared/EditorUtils'
import type { ContactPageContent, FAQItem, TrustIndicator, QuickActionButton } from '../types/cms-types'

interface ContactPageEditorProps {
  content: ContactPageContent
  setContent: React.Dispatch<React.SetStateAction<ContactPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function ContactPageEditor({ content, setContent, onSave, isSaving }: ContactPageEditorProps) {
  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'New question',
      answer: 'New answer'
    }
    setContent(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        faqs: [...prev.faqSection.faqs, newFAQ]
      }
    }))
  }

  const removeFAQ = (index: number) => {
    setContent(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        faqs: prev.faqSection.faqs.filter((_, i) => i !== index)
      }
    }))
  }

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    setContent(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        faqs: prev.faqSection.faqs.map((faq, i) => 
          i === index ? { ...faq, [field]: value } : faq
        )
      }
    }))
  }

  const addQuickAction = () => {
    const newAction: QuickActionButton = {
      text: 'New Action',
      link: '#',
      icon: ''
    }
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        quickActions: [...prev.hero.quickActions, newAction]
      }
    }))
  }

  const removeQuickAction = (index: number) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        quickActions: prev.hero.quickActions.filter((_, i) => i !== index)
      }
    }))
  }

  const updateQuickAction = (index: number, field: keyof QuickActionButton, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        quickActions: prev.hero.quickActions.map((action, i) => 
          i === index ? { ...action, [field]: value } : action
        )
      }
    }))
  }

  const addTrustIndicator = () => {
    const newIndicator: TrustIndicator = {
      title: 'New Indicator',
      description: 'Description'
    }
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        trustIndicators: [...prev.hero.trustIndicators, newIndicator]
      }
    }))
  }

  const removeTrustIndicator = (index: number) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        trustIndicators: prev.hero.trustIndicators.filter((_, i) => i !== index)
      }
    }))
  }

  const updateTrustIndicator = (index: number, field: keyof TrustIndicator, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        trustIndicators: prev.hero.trustIndicators.map((indicator, i) => 
          i === index ? { ...indicator, [field]: value } : indicator
        )
      }
    }))
  }

  const addResponseBadge = () => {
    setContent(prev => ({
      ...prev,
      responseGuarantee: {
        ...prev.responseGuarantee,
        badges: [...prev.responseGuarantee.badges, 'New Badge']
      }
    }))
  }

  const removeResponseBadge = (index: number) => {
    setContent(prev => ({
      ...prev,
      responseGuarantee: {
        ...prev.responseGuarantee,
        badges: prev.responseGuarantee.badges.filter((_, i) => i !== index)
      }
    }))
  }

  const updateResponseBadge = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      responseGuarantee: {
        ...prev.responseGuarantee,
        badges: prev.responseGuarantee.badges.map((badge, i) => 
          i === index ? value : badge
        )
      }
    }))
  }

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
            <Label>Badge Text</Label>
            <Input
              value={content.hero.badge}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
              placeholder="Connect with Divine Guidance"
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description}
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

          {/* Quick Action Buttons */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Quick Action Buttons</Label>
              <Button onClick={addQuickAction} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Button
              </Button>
            </div>
            {content.hero.quickActions.map((action, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Button {index + 1}</span>
                    <Button onClick={() => removeQuickAction(index)} size="sm" variant="ghost">
                      <Trash size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Text</Label>
                      <Input
                        value={action.text}
                        onChange={(e) => updateQuickAction(index, 'text', e.target.value)}
                        placeholder="Button text"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link</Label>
                      <Input
                        value={action.link}
                        onChange={(e) => updateQuickAction(index, 'link', e.target.value)}
                        placeholder="/contact or https://..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Icon (optional)</Label>
                    <Input
                      value={action.icon || ''}
                      onChange={(e) => updateQuickAction(index, 'icon', e.target.value)}
                      placeholder="Icon name"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Trust Indicators</Label>
              <Button onClick={addTrustIndicator} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Indicator
              </Button>
            </div>
            {content.hero.trustIndicators.map((indicator, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Indicator {index + 1}</span>
                    <Button onClick={() => removeTrustIndicator(index)} size="sm" variant="ghost">
                      <Trash size={16} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={indicator.title}
                        onChange={(e) => updateTrustIndicator(index, 'title', e.target.value)}
                        placeholder="24/7 Response"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={indicator.description}
                        onChange={(e) => updateTrustIndicator(index, 'description', e.target.value)}
                        placeholder="Description text"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                value={content.email}
                onChange={(e) => setContent(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={content.phone}
                onChange={(e) => setContent(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={content.whatsapp}
                onChange={(e) => setContent(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={content.address}
                onChange={(e) => setContent(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Info Card (Sidebar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Label</Label>
              <Input
                value={content.contactInfoCard.emailLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, emailLabel: e.target.value } 
                }))}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Badge</Label>
              <Input
                value={content.contactInfoCard.emailBadge}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, emailBadge: e.target.value } 
                }))}
                placeholder="Primary Contact"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Label</Label>
              <Input
                value={content.contactInfoCard.whatsappLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, whatsappLabel: e.target.value } 
                }))}
                placeholder="WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Text</Label>
              <Input
                value={content.contactInfoCard.whatsappText}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, whatsappText: e.target.value } 
                }))}
                placeholder="Click to chat directly..."
              />
            </div>
            <div className="space-y-2">
              <Label>Service Area Label</Label>
              <Input
                value={content.contactInfoCard.serviceAreaLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, serviceAreaLabel: e.target.value } 
                }))}
                placeholder="Service Area"
              />
            </div>
            <div className="space-y-2">
              <Label>Service Area Text</Label>
              <Input
                value={content.contactInfoCard.serviceAreaText}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, serviceAreaText: e.target.value } 
                }))}
                placeholder="Serving communities worldwide..."
              />
            </div>
            <div className="space-y-2">
              <Label>Service Area Badge</Label>
              <Input
                value={content.contactInfoCard.serviceAreaBadge}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  contactInfoCard: { ...prev.contactInfoCard, serviceAreaBadge: e.target.value } 
                }))}
                placeholder="Global Reach"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Guarantee Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.responseGuarantee.title}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                responseGuarantee: { ...prev.responseGuarantee, title: e.target.value } 
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.responseGuarantee.description}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                responseGuarantee: { ...prev.responseGuarantee, description: e.target.value } 
              }))}
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Badges</Label>
              <Button onClick={addResponseBadge} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Badge
              </Button>
            </div>
            {content.responseGuarantee.badges.map((badge, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={badge}
                  onChange={(e) => updateResponseBadge(index, e.target.value)}
                  placeholder="Badge text"
                />
                <Button onClick={() => removeResponseBadge(index)} size="icon" variant="ghost">
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Form Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name Label</Label>
              <Input
                value={content.form.nameLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, nameLabel: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Label</Label>
              <Input
                value={content.form.emailLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, emailLabel: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Label</Label>
              <Input
                value={content.form.phoneLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, phoneLabel: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Optional Text</Label>
              <Input
                value={content.form.phoneOptional}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, phoneOptional: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Service Label</Label>
              <Input
                value={content.form.serviceLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, serviceLabel: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Service Placeholder</Label>
              <Input
                value={content.form.servicePlaceholder}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, servicePlaceholder: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Message Label</Label>
              <Input
                value={content.form.messageLabel}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, messageLabel: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Message Placeholder</Label>
              <Input
                value={content.form.messagePlaceholder}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, messagePlaceholder: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Submit Button Text</Label>
              <Input
                value={content.form.submitButtonText}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, submitButtonText: e.target.value } 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Response Text</Label>
              <Input
                value={content.form.responseText}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  form: { ...prev.form, responseText: e.target.value } 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">FAQ Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Badge</Label>
            <Input
              value={content.faqSection.badge}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                faqSection: { ...prev.faqSection, badge: e.target.value } 
              }))}
              placeholder="Common Questions"
            />
          </div>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.faqSection.title}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                faqSection: { ...prev.faqSection, title: e.target.value } 
              }))}
              placeholder="Frequently Asked Questions"
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">FAQ Items</Label>
              <Button onClick={addFAQ} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add FAQ
              </Button>
            </div>
            {content.faqSection.faqs.map((faq, index) => (
              <Card key={faq.id} className="bg-muted/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">FAQ {index + 1}</span>
                    <Button onClick={() => removeFAQ(index)} size="sm" variant="ghost">
                      <Trash size={16} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Question</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="Question text"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Answer</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Answer text"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
