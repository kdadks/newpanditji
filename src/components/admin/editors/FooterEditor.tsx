import { FloppyDisk, Spinner } from '@phosphor-icons/react'
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

export default function FooterEditor({ content, setContent, onSave, isSaving }: FooterEditorProps) {
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
            <Label className="text-base font-semibold mb-4 block">Social Media Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={content.facebookUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={content.instagramUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input
                  value={content.youtubeUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={content.linkedinUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter/X</Label>
                <Input
                  value={content.twitterUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, twitterUrl: e.target.value }))}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Pinterest</Label>
                <Input
                  value={content.pinterestUrl}
                  onChange={(e) => setContent(prev => ({ ...prev, pinterestUrl: e.target.value }))}
                  placeholder="https://pinterest.com/..."
                />
              </div>
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
