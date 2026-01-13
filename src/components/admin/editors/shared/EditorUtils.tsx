import { Button } from '../../../ui/button'
import { Label } from '../../../ui/label'
import { Trash } from '@phosphor-icons/react'
import { MediaPickerInput } from '../../../ui/media-picker'
import type { PageKey } from '../../types/cms-types'

interface ImageGridProps {
  images: string[]
  onRemove: (index: number) => void
  onAdd: (url: string) => void
  label: string
}

export const ImageGrid = ({ images, onRemove, onAdd, label }: ImageGridProps) => (
  <div className="space-y-3">
    <Label>{label}</Label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {images.map((img, idx) => (
        <div key={idx} className="relative group">
          <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(idx)}
          >
            <Trash size={12} />
          </Button>
        </div>
      ))}
      <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
        <MediaPickerInput
          value=""
          onChange={(url) => url && onAdd(url)}
          placeholder="Add"
        />
      </div>
    </div>
  </div>
)

export const getPageTitle = (key: PageKey): string => {
  const titles: Record<PageKey, string> = {
    home: 'Home Page',
    about: 'About Us',
    whyChoose: 'Why Choose Us',
    books: 'Books',
    contact: 'Contact',
    charity: 'Charity',
    dakshina: 'Dakshina'
  }
  return titles[key]
}

// Helper for adding background images to content with hero section
export function addBackgroundImage<T extends { hero: { backgroundImages: string[] } }>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  url: string
) {
  setter((prev) => ({
    ...prev,
    hero: { ...prev.hero, backgroundImages: [...prev.hero.backgroundImages, url] }
  }))
}

// Helper for removing background images from content with hero section
export function removeBackgroundImage<T extends { hero: { backgroundImages: string[] } }>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  index: number
) {
  setter((prev) => ({
    ...prev,
    hero: { ...prev.hero, backgroundImages: prev.hero.backgroundImages.filter((_, i) => i !== index) }
  }))
}
