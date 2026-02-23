import { FloppyDisk, Spinner, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { MediaPickerInput } from '../../ui/media-picker'
import type { BlogSidebarContent, BlogSidebarCTAButton } from '../types/cms-types'

interface BlogSidebarEditorProps {
  content: BlogSidebarContent
  setContent: React.Dispatch<React.SetStateAction<BlogSidebarContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function BlogSidebarEditor({ content, setContent, onSave, isSaving }: BlogSidebarEditorProps) {

  // ── Author Card helpers ────────────────────────────────────────────────────
  const updateAuthor = (field: keyof BlogSidebarContent['authorCard'], value: string) => {
    setContent(prev => ({
      ...prev,
      authorCard: { ...prev.authorCard, [field]: value }
    }))
  }

  // ── Guidance Card helpers ──────────────────────────────────────────────────
  const updateGuidance = (field: 'title' | 'description', value: string) => {
    setContent(prev => ({
      ...prev,
      guidanceCard: { ...prev.guidanceCard, [field]: value }
    }))
  }

  const addCTAButton = () => {
    const newBtn: BlogSidebarCTAButton = { text: 'Button Text', link: '/contact' }
    setContent(prev => ({
      ...prev,
      guidanceCard: {
        ...prev.guidanceCard,
        ctaButtons: [...prev.guidanceCard.ctaButtons, newBtn]
      }
    }))
  }

  const removeCTAButton = (index: number) => {
    setContent(prev => ({
      ...prev,
      guidanceCard: {
        ...prev.guidanceCard,
        ctaButtons: prev.guidanceCard.ctaButtons.filter((_, i) => i !== index)
      }
    }))
  }

  const updateCTAButton = (index: number, field: keyof BlogSidebarCTAButton, value: string) => {
    setContent(prev => ({
      ...prev,
      guidanceCard: {
        ...prev.guidanceCard,
        ctaButtons: prev.guidanceCard.ctaButtons.map((btn, i) =>
          i === index ? { ...btn, [field]: value } : btn
        )
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? <Spinner className="mr-2 animate-spin" size={18} /> : <FloppyDisk className="mr-2" size={18} />}
          {isSaving ? 'Saving...' : 'Save Blog Sidebar'}
        </Button>
      </div>

      {/* Author Card */}
      <Card>
        <CardHeader>
          <CardTitle>About the Author Card</CardTitle>
          <CardDescription>Content shown in the author sidebar card on every blog article page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="author-card-title">Card Heading</Label>
            <Input
              id="author-card-title"
              value={content.authorCard.title}
              onChange={e => updateAuthor('title', e.target.value)}
              placeholder="About the Author"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="author-name">Author Name</Label>
            <Input
              id="author-name"
              value={content.authorCard.name}
              onChange={e => updateAuthor('name', e.target.value)}
              placeholder="Pandit Rajesh Joshi"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="author-role">Author Role / Title</Label>
            <Input
              id="author-role"
              value={content.authorCard.role}
              onChange={e => updateAuthor('role', e.target.value)}
              placeholder="Hindu Priest & Spiritual Guide"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="author-bio">Author Bio</Label>
            <Textarea
              id="author-bio"
              value={content.authorCard.bio}
              onChange={e => updateAuthor('bio', e.target.value)}
              placeholder="Short biography shown below the author name..."
              rows={4}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="author-image">Author Image</Label>
            <MediaPickerInput
              value={content.authorCard.image}
              onChange={url => updateAuthor('image', url)}
              placeholder="/images/Logo/Raj ji.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guidance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Need Spiritual Guidance? Card</CardTitle>
          <CardDescription>The call-to-action sidebar card shown below the author card on blog article pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="guidance-title">Card Heading</Label>
            <Input
              id="guidance-title"
              value={content.guidanceCard.title}
              onChange={e => updateGuidance('title', e.target.value)}
              placeholder="Need Spiritual Guidance?"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="guidance-description">Description</Label>
            <Textarea
              id="guidance-description"
              value={content.guidanceCard.description}
              onChange={e => updateGuidance('description', e.target.value)}
              placeholder="Book a consultation for personalized spiritual guidance..."
              rows={3}
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>CTA Buttons</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCTAButton}>
                <Plus size={14} className="mr-1" />
                Add Button
              </Button>
            </div>

            {content.guidanceCard.ctaButtons.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No buttons yet. Click "Add Button" to add one.</p>
            )}

            {content.guidanceCard.ctaButtons.map((btn, index) => (
              <div key={index} className="flex gap-2 items-center p-3 border rounded-lg bg-muted/30">
                <Input
                  className="flex-1"
                  value={btn.text}
                  onChange={e => updateCTAButton(index, 'text', e.target.value)}
                  placeholder="Button label"
                />
                <Input
                  className="flex-1"
                  value={btn.link}
                  onChange={e => updateCTAButton(index, 'link', e.target.value)}
                  placeholder="/contact or https://..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeCTAButton(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save button bottom */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? <Spinner className="mr-2 animate-spin" size={18} /> : <FloppyDisk className="mr-2" size={18} />}
          {isSaving ? 'Saving...' : 'Save Blog Sidebar'}
        </Button>
      </div>
    </div>
  )
}
