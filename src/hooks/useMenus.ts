import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type MenuRow, type MenuItemRow, type MenuItemInsert, type MenuItemUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query keys
const MENUS_KEY = ['menus']
const MENU_ITEMS_KEY = ['menu_items']

// ============================================================================
// Menu CRUD
// ============================================================================

/**
 * Fetch all menus
 */
async function fetchMenus(): Promise<MenuRow[]> {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching menus:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a menu by location (e.g., 'header', 'footer')
 */
async function fetchMenuByLocation(location: string): Promise<MenuRow | null> {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('location', location)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching menu:', error)
    throw error
  }

  return data
}

// ============================================================================
// Menu Items CRUD
// ============================================================================

/**
 * Fetch all menu items for a specific menu
 */
async function fetchMenuItems(menuId: string): Promise<MenuItemRow[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('menu_id', menuId)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching menu items:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch menu items by menu location
 */
async function fetchMenuItemsByLocation(location: string): Promise<MenuItemRow[]> {
  const menu = await fetchMenuByLocation(location)
  if (!menu) return []
  return fetchMenuItems(menu.id)
}

/**
 * Create a new menu item
 */
async function createMenuItem(item: MenuItemInsert): Promise<MenuItemRow> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select()
    .single()

  if (error) {
    console.error('Error creating menu item:', error)
    throw error
  }

  return data
}

/**
 * Update a menu item
 */
async function updateMenuItem({ id, ...updates }: MenuItemUpdate & { id: string }): Promise<MenuItemRow> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating menu item:', error)
    throw error
  }

  return data
}

/**
 * Delete a menu item
 */
async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting menu item:', error)
    throw error
  }
}

/**
 * Batch update menu items (for reordering)
 */
async function batchUpdateMenuItems(items: (MenuItemUpdate & { id: string })[]): Promise<MenuItemRow[]> {
  const results: MenuItemRow[] = []
  
  for (const item of items) {
    const result = await updateMenuItem(item)
    results.push(result)
  }
  
  return results
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook for managing all menus
 */
export function useMenus() {
  const query = useQuery<MenuRow[]>({
    queryKey: MENUS_KEY,
    queryFn: fetchMenus,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    menus: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}

/**
 * Hook for managing menu items for a specific menu location
 */
export function useMenuItems(location: string) {
  const queryClient = useQueryClient()

  const query = useQuery<MenuItemRow[]>({
    queryKey: [...MENU_ITEMS_KEY, location],
    queryFn: () => fetchMenuItemsByLocation(location),
    staleTime: 10 * 60 * 1000,
    enabled: !!location,
  })

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEY })
      toast.success('Menu item added')
    },
    onError: (error) => {
      toast.error(`Failed to add menu item: ${error.message}`)
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEY })
      toast.success('Menu item updated')
    },
    onError: (error) => {
      toast.error(`Failed to update menu item: ${error.message}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEY })
      toast.success('Menu item deleted')
    },
    onError: (error) => {
      toast.error(`Failed to delete menu item: ${error.message}`)
    }
  })

  const batchUpdateMutation = useMutation({
    mutationFn: batchUpdateMenuItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEY })
      toast.success('Menu order saved')
    },
    onError: (error) => {
      toast.error(`Failed to save menu order: ${error.message}`)
    }
  })

  // Build hierarchical menu structure
  const buildMenuTree = (items: MenuItemRow[]): MenuItemWithChildren[] => {
    const itemMap = new Map<string, MenuItemWithChildren>()
    const rootItems: MenuItemWithChildren[] = []

    // First pass: create all items with children array
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] })
    })

    // Second pass: build tree structure
    items.forEach(item => {
      const currentItem = itemMap.get(item.id)!
      if (item.parent_id && itemMap.has(item.parent_id)) {
        itemMap.get(item.parent_id)!.children.push(currentItem)
      } else {
        rootItems.push(currentItem)
      }
    })

    return rootItems
  }

  return {
    items: query.data || [],
    menuTree: buildMenuTree(query.data || []),
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createItem: createMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
    batchUpdateItems: batchUpdateMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: batchUpdateMutation.isPending,

    refetch: query.refetch
  }
}

// Extended type with children for tree structure
export interface MenuItemWithChildren extends MenuItemRow {
  children: MenuItemWithChildren[]
}

// Default menu items for header
export const defaultHeaderMenuItems: Partial<MenuItemRow>[] = [
  { label: 'Home', url: '/', sort_order: 1 },
  { label: 'About', url: '/about', sort_order: 2 },
  { label: 'Services', url: '/services', sort_order: 3 },
  { label: 'Gallery', url: '/gallery', sort_order: 4 },
  { label: 'Testimonials', url: '/testimonials', sort_order: 5 },
  { label: 'Contact', url: '/contact', sort_order: 6 },
]

// Default menu items for footer
export const defaultFooterMenuItems: Partial<MenuItemRow>[] = [
  { label: 'Services', url: '/services', sort_order: 1 },
  { label: 'About', url: '/about', sort_order: 2 },
  { label: 'Gallery', url: '/gallery', sort_order: 3 },
  { label: 'Blog', url: '/blog', sort_order: 4 },
  { label: 'Books', url: '/books', sort_order: 5 },
  { label: 'Testimonials', url: '/testimonials', sort_order: 6 },
  { label: 'Charity', url: '/charity', sort_order: 7 },
]
