import { FloppyDisk, Spinner, Image, Plus, Trash, Heart, Star, Trophy, Users, Sparkle } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { ImageGrid } from './shared/EditorUtils'
import type { TestimonialsPageContent } from '../types/cms-types'

interface TestimonialsPageEditorProps {
  content: TestimonialsPageContent
  setContent: React.Dispatch<React.SetStateAction<TestimonialsPageContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

const iconOptions = [
  { value: 'Trophy', label: 'Trophy' },
  { value: 'Users', label: 'Users' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Sparkle', label: 'Sparkle' },
]

export default function TestimonialsPageEditor({ content, setContent, onSave, isSaving }: TestimonialsPageEditorProps) {
  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50 pb-4 pt-2 border-b mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Testimonials Page Content</h2>
          <p className="text-muted-foreground">Manage testimonials page hero section and static content</p>
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
            <Heart size={20} className="text-primary" />
            Hero Section
          </CardTitle>
          <CardDescription>Main banner with testimonials introduction, statistics, and background images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={content.hero.badge || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                placeholder="Voices of Devotion"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content.hero.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                placeholder="What Our <highlight>Community</highlight> Says"
              />
              <p className="text-xs text-muted-foreground">Use &lt;highlight&gt;text&lt;/highlight&gt; for gradient text</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.hero.description || ''}
              onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
              rows={3}
              placeholder="Discover the heartfelt experiences of families who have found spiritual guidance..."
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
            <p className="text-xs text-muted-foreground mb-3">Displayed inline in the hero section (e.g., 250+ Families, 500+ Ceremonies)</p>
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
                    placeholder="250+"
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
                    placeholder="Families"
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
        </CardContent>
      </Card>

      {/* Share Your Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star size={20} className="text-primary" />
            Share Your Experience Section
          </CardTitle>
          <CardDescription>Call-to-action section encouraging visitors to share testimonials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.shareExperience.title || ''}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                shareExperience: { ...prev.shareExperience, title: e.target.value } 
              }))}
              placeholder="Share Your Sacred Experience"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.shareExperience.description || ''}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                shareExperience: { ...prev.shareExperience, description: e.target.value } 
              }))}
              rows={3}
              placeholder="Your testimonial helps others discover the beauty of traditional Hindu ceremonies..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={content.shareExperience.primaryButtonText || ''}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  shareExperience: { ...prev.shareExperience, primaryButtonText: e.target.value } 
                }))}
                placeholder="Write a Testimonial"
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={content.shareExperience.secondaryButtonText || ''}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  shareExperience: { ...prev.shareExperience, secondaryButtonText: e.target.value } 
                }))}
                placeholder="Leave a Review"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Share Text</Label>
            <Input
              value={content.shareExperience.shareText || ''}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                shareExperience: { ...prev.shareExperience, shareText: e.target.value } 
              }))}
              placeholder="Share your experience on:"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Google Review URL</Label>
              <Input
                value={content.shareExperience.googleReviewUrl || ''}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  shareExperience: { ...prev.shareExperience, googleReviewUrl: e.target.value } 
                }))}
                placeholder="https://www.google.com/search?q=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={content.shareExperience.email || ''}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  shareExperience: { ...prev.shareExperience, email: e.target.value } 
                }))}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Subject Line</Label>
              <Input
                value={content.shareExperience.emailSubject || ''}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  shareExperience: { ...prev.shareExperience, emailSubject: e.target.value } 
                }))}
                placeholder="Testimonial"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            Why Choose Us Section
          </CardTitle>
          <CardDescription>Cards highlighting reasons to choose your services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.whyChooseUs.title || ''}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                whyChooseUs: { ...prev.whyChooseUs, title: e.target.value } 
              }))}
              placeholder="Why Families Choose Us"
            />
          </div>

          {/* Cards */}
          <div className="border-t pt-4 mt-4">
            <Label className="text-base font-semibold mb-3 block">Feature Cards</Label>
            <div className="space-y-4">
              {content.whyChooseUs.cards?.map((card, idx) => (
                <div key={idx} className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Card {idx + 1}</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => setContent(prev => ({ 
                        ...prev, 
                        whyChooseUs: { 
                          ...prev.whyChooseUs, 
                          cards: prev.whyChooseUs.cards?.filter((_, i) => i !== idx) || [] 
                        } 
                      }))}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        value={card.icon || 'Trophy'}
                        onChange={(e) => setContent(prev => ({ 
                          ...prev, 
                          whyChooseUs: { 
                            ...prev.whyChooseUs, 
                            cards: prev.whyChooseUs.cards?.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c) || [] 
                          } 
                        }))}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={card.title || ''}
                        onChange={(e) => setContent(prev => ({ 
                          ...prev, 
                          whyChooseUs: { 
                            ...prev.whyChooseUs, 
                            cards: prev.whyChooseUs.cards?.map((c, i) => i === idx ? { ...c, title: e.target.value } : c) || [] 
                          } 
                        }))}
                        placeholder="Authentic Traditions"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={card.description || ''}
                      onChange={(e) => setContent(prev => ({ 
                        ...prev, 
                        whyChooseUs: { 
                          ...prev.whyChooseUs, 
                          cards: prev.whyChooseUs.cards?.map((c, i) => i === idx ? { ...c, description: e.target.value } : c) || [] 
                        } 
                      }))}
                      rows={2}
                      placeholder="Every ceremony is performed according to proper Vedic procedures..."
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3" 
              onClick={() => setContent(prev => ({ 
                ...prev, 
                whyChooseUs: { 
                  ...prev.whyChooseUs, 
                  cards: [...(prev.whyChooseUs.cards || []), { icon: 'Trophy', title: '', description: '' }] 
                } 
              }))}
            >
              <Plus size={14} className="mr-2" />
              Add Card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Note about Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart size={20} className="text-muted-foreground" />
            Testimonials
          </CardTitle>
          <CardDescription>
            Individual testimonials are managed separately in the Testimonials section of the admin panel.
            This editor only manages the static page content that appears around the testimonials.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
