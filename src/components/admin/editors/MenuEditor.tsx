import { FloppyDisk, Spinner, List as MenuIcon, Plus, Trash, CaretUp, CaretDown } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import type { MenuItem } from '../types/cms-types'

interface MenuEditorProps {
  items: MenuItem[]
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function MenuEditor({ items, setItems, onSave, isSaving }: MenuEditorProps) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    const currentItem = sortedItems[index]
    const prevItem = sortedItems[index - 1]
    
    // Find original indices
    const currentIdx = newItems.findIndex(i => i.order === currentItem.order && i.label === currentItem.label)
    const prevIdx = newItems.findIndex(i => i.order === prevItem.order && i.label === prevItem.label)
    
    // Swap orders
    const tempOrder = newItems[currentIdx].order
    newItems[currentIdx].order = newItems[prevIdx].order
    newItems[prevIdx].order = tempOrder
    
    setItems(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === sortedItems.length - 1) return
    const newItems = [...items]
    const currentItem = sortedItems[index]
    const nextItem = sortedItems[index + 1]
    
    // Find original indices
    const currentIdx = newItems.findIndex(i => i.order === currentItem.order && i.label === currentItem.label)
    const nextIdx = newItems.findIndex(i => i.order === nextItem.order && i.label === nextItem.label)
    
    // Swap orders
    const tempOrder = newItems[currentIdx].order
    newItems[currentIdx].order = newItems[nextIdx].order
    newItems[nextIdx].order = tempOrder
    
    setItems(newItems)
  }

  const handleUpdateLabel = (index: number, label: string) => {
    const item = sortedItems[index]
    const newItems = items.map(i => 
      (i.order === item.order && i.label === item.label) 
        ? { ...i, label } 
        : i
    )
    setItems(newItems)
  }

  const handleUpdateUrl = (index: number, url: string) => {
    const item = sortedItems[index]
    const newItems = items.map(i => 
      (i.order === item.order && i.label === item.label) 
        ? { ...i, url } 
        : i
    )
    setItems(newItems)
  }

  const handleDelete = (index: number) => {
    const item = sortedItems[index]
    const newItems = items.filter(i => !(i.order === item.order && i.label === item.label))
    setItems(newItems)
  }

  const handleAdd = () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : 0
    setItems([...items, { label: '', url: '', order: maxOrder + 1 }])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MenuIcon size={20} className="text-primary" />
            Navigation Menu
          </CardTitle>
          <CardDescription>Manage main navigation menu items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedItems.map((item, index) => (
            <div key={`${item.order}-${item.label}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                >
                  <CaretUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === sortedItems.length - 1}
                  onClick={() => handleMoveDown(index)}
                >
                  <CaretDown size={14} />
                </Button>
              </div>
              <Badge variant="secondary" className="font-mono shrink-0">{item.order}</Badge>
              <Input
                value={item.label}
                onChange={(e) => handleUpdateLabel(index, e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={item.url}
                onChange={(e) => handleUpdateUrl(index, e.target.value)}
                placeholder="URL"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(index)}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleAdd}
          >
            <Plus size={16} className="mr-2" />
            Add Menu Item
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? <><Spinner className="mr-2 animate-spin" size={18} />Saving...</> : <><FloppyDisk size={18} className="mr-2" />Save Menu</>}
        </Button>
      </div>
    </div>
  )
}
