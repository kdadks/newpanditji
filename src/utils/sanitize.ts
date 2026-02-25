/**
 * HTML sanitization utility — CWE-79 (XSS) mitigation.
 *
 * Uses DOMPurify to strip any tags/attributes not on the allowlist before
 * content is injected via `dangerouslySetInnerHTML`.
 *
 * Allowlist is scoped to what the TipTap rich-text editor (QuillEditor) can
 * actually produce:  StarterKit (h2/h3, p, strong, em, s, u, code, pre,
 * blockquote, ul/ol/li, hr, br) + Underline + TextAlign (style) +
 * IndentExtension (style).  Links are also permitted for CMS / legal page
 * content, with `rel` and `target` forced to safe values.
 *
 * DOMPurify requires a real DOM, so during SSR (window === undefined) we
 * return an empty string.  This is safe because all HTML-bearing components
 * fetch their content client-side via React Query; the server render only
 * ever shows a loading skeleton, never the actual HTML.
 */

import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  // Headings
  'h1', 'h2', 'h3', 'h4',
  // Block
  'p', 'br', 'hr', 'blockquote', 'pre',
  // Inline formatting
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'strike', 'code', 'span',
  // Lists
  'ul', 'ol', 'li',
  // Links
  'a',
]

const ALLOWED_ATTR = [
  'href',   // links
  'target', // links — forced to _blank below
  'rel',    // links — forced to noopener noreferrer below
  'style',  // TextAlign + IndentExtension emit inline styles
  'class',  // TipTap attaches Tailwind/prose classes
]

// One-time setup: force safe values on every <a> tag DOMPurify passes through.
// This cannot be done via FORCE_ATTR config alone (it only forces attribute
// presence, not specific values), so we use the afterSanitizeAttributes hook.
if (typeof window !== 'undefined') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

/**
 * Sanitize an HTML string before rendering via `dangerouslySetInnerHTML`.
 *
 * @example
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />
 */
export function sanitizeHTML(html: string | null | undefined): string {
  if (!html) return ''

  // DOMPurify requires the browser DOM; return empty string during SSR.
  // All HTML-bearing components are client-only (data fetched post-hydration),
  // so SSR callers never have real content to render anyway.
  if (typeof window === 'undefined') return ''

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Prevent DOM clobbering attacks
    SANITIZE_DOM: true,
    // Strip data-* attributes (not needed, reduce attack surface)
    ALLOW_DATA_ATTR: false,
  })
}
