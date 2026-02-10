import { FloppyDisk, Spinner, List as MenuIcon, Plus, Trash, CaretUp, CaretDown, ArrowBendDownRight } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import type { MenuItem } from '../types/cms-types'

interface MenuEditorProps {
  items: MenuItem[]
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  onSave: () => Promise<void>
  isSaving: boolean
  menuLocation?: 'header' | 'footer' | 'legal'
}

export default function MenuEditor({ items, setItems, onSave, isSaving, menuLocation = 'header' }: MenuEditorProps) {
  // Build hierarchical structure
  const buildHierarchy = (items: MenuItem[]) => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order)
    const topLevel = sortedItems.filter(item => !item.parent_id)
    const children = sortedItems.filter(item => item.parent_id)
    
    const result: (MenuItem & { level: number })[] = []
    
    topLevel.forEach(parent => {
      result.push({ ...parent, level: 0 })
      const childItems = children.filter(child => child.parent_id === parent.id)
      childItems.forEach(child => {
        result.push({ ...child, level: 1 })
      })
    })
    
    return result
  }

  const hierarchicalItems = buildHierarchy(items)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const item = hierarchicalItems[index]
    const prevItem = hierarchicalItems[index - 1]
    
    // Don't allow moving if different level
    if (item.level !== prevItem.level || item.parent_id !== prevItem.parent_id) return
    
    const newItems = [...items]
    const currentIdx = newItems.findIndex(i => i.id === item.id)
    const prevIdx = newItems.findIndex(i => i.id === prevItem.id)
    
    // Swap orders
    const tempOrder = newItems[currentIdx].order
    newItems[currentIdx].order = newItems[prevIdx].order
    newItems[prevIdx].order = tempOrder
    
    setItems(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === hierarchicalItems.length - 1) return
    const item = hierarchicalItems[index]
    const nextItem = hierarchicalItems[index + 1]
    
    // Don't allow moving if different level
    if (item.level !== nextItem.level || item.parent_id !== nextItem.parent_id) return
    
    const newItems = [...items]
    const currentIdx = newItems.findIndex(i => i.id === item.id)
    const nextIdx = newItems.findIndex(i => i.id === nextItem.id)
    
    // Swap orders
    const tempOrder = newItems[currentIdx].order
    newItems[currentIdx].order = newItems[nextIdx].order
    newItems[nextIdx].order = tempOrder
    
    setItems(newItems)
  }

  const handleUpdateLabel = (index: number, label: string) => {
    const item = hierarchicalItems[index]
    const newItems = items.map(i => 
      i.id === item.id ? { ...i, label } : i
    )
    setItems(newItems)
  }

  const handleUpdateUrl = (index: number, url: string) => {
    const item = hierarchicalItems[index]
    const newItems = items.map(i => 
      i.id === item.id ? { ...i, url } : i
    )
    setItems(newItems)
  }

  const handleUpdateParent = (index: number, parentId: string | null) => {
    const item = hierarchicalItems[index]
    // Convert "__none__" to null for top-level items
    const actualParentId = parentId === '__none__' ? null : parentId
    const newItems = items.map(i => 
      i.id === item.id ? { ...i, parent_id: actualParentId } : i
    )
    setItems(newItems)
  }

  const handleDelete = (index: number) => {
    const item = hierarchicalItems[index]
    // Also delete children if this is a parent
    const newItems = items.filter(i => i.id !== item.id && i.parent_id !== item.id)
    setItems(newItems)
  }

  const handleAdd = (parentId?: string) => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : 0
    // Create a temporary ID for new items to ensure uniqueness before saving
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newItem: MenuItem = { 
      id: tempId, // Temporary ID that will be replaced when saved
      label: '', 
      url: '', 
      order: maxOrder + 1,
      parent_id: parentId || null
    }
    setItems([...items, newItem])
  }

  const getParentOptions = () => {
    return items.filter(item => !item.parent_id)
  }

  const canMoveUp = (index: number) => {
    if (index === 0) return false
    const item = hierarchicalItems[index]
    const prevItem = hierarchicalItems[index - 1]
    return item.level === prevItem.level && item.parent_id === prevItem.parent_id
  }

  const canMoveDown = (index: number) => {
    if (index === hierarchicalItems.length - 1) return false
    const item = hierarchicalItems[index]
    const nextItem = hierarchicalItems[index + 1]
    return item.level === nextItem.level && item.parent_id === nextItem.parent_id
  }

  const menuLocationLabel = menuLocation.charAt(0).toUpperCase() + menuLocation.slice(1)
  const menuDescription = menuLocation === 'header' 
    ? 'Manage main navigation menu items. Top-level items appear in the header, child items appear in dropdown menus.'
    : menuLocation === 'footer'
    ? 'Manage footer menu items. These links appear in the website footer.'
    : 'Manage legal menu items. These links typically include Terms & Conditions, Privacy Policy, etc.'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MenuIcon size={20} className="text-primary" />
            {menuLocationLabel} Menu
          </CardTitle>
          <CardDescription>
            {menuDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {hierarchicalItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`flex items-center gap-3 p-3 rounded-lg ${
                item.level === 0 
                  ? 'bg-muted/30' 
                  : 'bg-muted/10 ml-12 border-l-2 border-orange-300'
              }`}
            >
              {/* Indentation indicator for child items */}
              {item.level === 1 && (
                <div className="shrink-0 text-orange-500">
                  <ArrowBendDownRight size={16} weight="bold" />
                </div>
              )}
              
              {/* Move buttons */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={!canMoveUp(index)}
                  onClick={() => handleMoveUp(index)}
                >
                  <CaretUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={!canMoveDown(index)}
                  onClick={() => handleMoveDown(index)}
                >
                  <CaretDown size={14} />
                </Button>
              </div>

              {/* Order badge */}
              <Badge variant="secondary" className="font-mono shrink-0 w-12 justify-center">
                {item.order}
              </Badge>

              {/* Label input */}
              <Input
                value={item.label}
                onChange={(e) => handleUpdateLabel(index, e.target.value)}
                placeholder="Label"
                className="flex-1 min-w-[120px]"
              />

              {/* URL input */}
              <Input
                value={item.url}
                onChange={(e) => handleUpdateUrl(index, e.target.value)}
                placeholder="URL (e.g., /services)"
                className="flex-1 min-w-[150px]"
              />

              {/* Parent selector - show for all items */}
              <Select
                value={item.parent_id || '__none__'}
                onValueChange={(value) => handleUpdateParent(index, value)}
              >
                <SelectTrigger className="w-32 shrink-0">
                  <SelectValue placeholder="Parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Top Level</SelectItem>
                  {getParentOptions()
                    .filter(parent => parent.id !== item.id) // Don't allow item to be its own parent
                    .map(parent => (
                      <SelectItem key={parent.id} value={parent.id!}>
                        {parent.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Add child button - only for top-level items */}
              {item.level === 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleAdd(item.id)}
                  title="Add child menu item"
                >
                  <Plus size={16} />
                </Button>
              )}

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => handleDelete(index)}
                title={item.level === 0 ? "Delete item and all children" : "Delete item"}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}

          {hierarchicalItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No menu items yet. Click "Add Menu Item" to get started.
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleAdd()}
          >
            <Plus size={16} className="mr-2" />
            Add Top-Level Menu Item
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
