'use client'

import { useEffect } from 'react'

/**
 * ContentProtection — attaches protection event listeners globally.
 * - Disables right-click context menu
 * - Blocks common copy/inspect keyboard shortcuts
 * - Prevents image drag-to-save
 *
 * Note: These are deterrents for casual users. Determined developers can
 * still bypass them via browser DevTools or by disabling JavaScript.
 */
export default function ContentProtection() {
  useEffect(() => {
    // 1. Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // 2. Block keyboard shortcuts: Ctrl+C/U/S/A/X/P and F12
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (
        (e.ctrlKey && ['c', 'u', 's', 'a', 'x', 'p'].includes(key)) ||
        e.key === 'F12'
      ) {
        e.preventDefault()
      }
    }

    // 3. Prevent dragging images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleDragStart)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return null
}
