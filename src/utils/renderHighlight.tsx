import React from 'react'

/**
 * Utility functions for rendering highlighted text
 */

/**
 * Strips highlight tags from text for use in plain text contexts like meta tags
 */
export function stripHighlightTags(text: string): string {
  if (!text) return ''
  return text.replace(/<highlight[^>]*>(.*?)<\/highlight>/gi, '$1')
}

/**
 * Renders highlighted text with proper styling
 * Converts <highlight> tags to styled spans
 */
export function renderHighlightedTitle(text: string): React.ReactElement {
  if (!text) return <span></span>

  // Split text by highlight tags and create React elements
  const parts = text.split(/(<highlight[^>]*>.*?<\/highlight>)/gi)

  return (
    <>
      {parts.map((part, index) => {
        const highlightMatch = part.match(/<highlight[^>]*>(.*?)<\/highlight>/i)
        if (highlightMatch) {
          return (
            <span
              key={index}
              className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent"
            >
              {highlightMatch[1]}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}