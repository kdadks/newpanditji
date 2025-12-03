import { FloppyDisk, Spinner, Image } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { MediaPickerInput } from '../../ui/media-picker'
import type { HeaderContent } from '../types/cms-types'

interface HeaderEditorProps {
  content: HeaderContent
  setContent: React.Dispatch<React.SetStateAction<HeaderContent>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function HeaderEditor({ content, setContent, onSave, isSaving }: HeaderEditorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image size={20} className="text-primary" />
            Header Configuration
          </CardTitle>
          <CardDescription>Manage header logo, name, and navigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MediaPickerInput
            label="Logo / Profile Image"
            value={content.logoUrl}
            onChange={(url) => setContent(prev => ({ ...prev, logoUrl: url }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={content.siteName}
                onChange={(e) => setContent(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={content.tagline}
                onChange={(e) => setContent(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA Button Text</Label>
              <Input
                value={content.ctaText}
                onChange={(e) => setContent(prev => ({ ...prev, ctaText: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Button Link</Label>
              <Input
                value={content.ctaLink}
                onChange={(e) => setContent(prev => ({ ...prev, ctaLink: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Header</>}
        </Button>
      </div>
    </div>
  )
}
