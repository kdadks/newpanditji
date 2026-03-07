import { FloppyDisk, Spinner, X } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import type { FooterContent } from '../types/cms-types'

interface FooterEditorProps {
  content: FooterContent
  setContent: React.Dispatch<React.SetStateAction<FooterContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

const SOCIAL_FIELDS: { key: keyof FooterContent; label: string; placeholder: string }[] = [
  { key: 'facebookUrl',  label: 'Facebook',   placeholder: 'https://facebook.com/...' },
  { key: 'instagramUrl', label: 'Instagram',  placeholder: 'https://instagram.com/...' },
  { key: 'youtubeUrl',   label: 'YouTube',    placeholder: 'https://youtube.com/...' },
  { key: 'linkedinUrl',  label: 'LinkedIn',   placeholder: 'https://linkedin.com/...' },
  { key: 'twitterUrl',  label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
  { key: 'pinterestUrl', label: 'Pinterest',  placeholder: 'https://pinterest.com/...' },
]

export default function FooterEditor({ content, setContent, onSave, isSaving }: FooterEditorProps) {
  const clearSocial = (key: keyof FooterContent) =>
    setContent(prev => ({ ...prev, [key]: '' }))
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Footer Configuration</CardTitle>
          <CardDescription>Manage footer content and social links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Footer Description</Label>
            <Textarea
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Input
              value={content.copyrightText}
              onChange={(e) => setContent(prev => ({ ...prev, copyrightText: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">Use {'{year}'} to auto-insert current year</p>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base font-semibold mb-4 block">Contact Info</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  value={content.contactEmail}
                  onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  value={content.contactPhone}
                  onChange={(e) => setContent(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+353 1 234 5678"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label>Location / Service Area</Label>
                <Input
                  value={content.contactLocation}
                  onChange={(e) => setContent(prev => ({ ...prev, contactLocation: e.target.value }))}
                  placeholder="Serving communities worldwide"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base font-semibold mb-1 block">Social Media Links</Label>
            <p className="text-xs text-muted-foreground mb-4">Clear or delete a link to hide that icon from the public footer.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={content[key] as string}
                      onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="flex-1"
                    />
                    {(content[key] as string) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => clearSocial(key)}
                        title={`Remove ${label}`}
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Footer</>}
        </Button>
      </div>
    </div>
  )
}
