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
  'start',  // <ol start="N"> — preserved so existing partial data renders correctly
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

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Prevent DOM clobbering attacks
    SANITIZE_DOM: true,
    // Strip data-* attributes (not needed, reduce attack surface)
    ALLOW_DATA_ATTR: false,
  })

  return repairListNesting(clean)
}

/**
 * Repair broken list nesting produced by the old editor.
 *
 * The old TipTap setup let users click the bullet-list toolbar button while
 * inside a numbered list which created a *sibling* <ul> instead of a nested
 * one, breaking the <ol> into two fragments and resetting the counter.
 *
 * This function detects and fixes two patterns:
 *   1. <ol>…</ol><ul sub-items></ul><ol continued>…</ol>
 *      → moves <ul> inside the last <li> of the first <ol>, then merges
 *        the items of the continuation <ol> back into the first <ol>.
 *   2. Consecutive <ol>…</ol><ol>…</ol>
 *      → merges item by item into one <ol>.
 *
 * Runs on already-sanitized HTML so there is no XSS risk.
 */
function repairListNesting(html: string): string {
  if (typeof window === 'undefined') return html
  if (!html) return html

  const div = document.createElement('div')
  div.innerHTML = html

  let changed = true
  while (changed) {
    changed = false
    const children = Array.from(div.children)
    for (let i = 0; i < children.length; i++) {
      const curr = children[i]
      const next = children[i + 1]
      const afterNext = children[i + 2]

      // Pattern 1: OL → UL → OL  (sub-bullets created as siblings)
      if (
        curr.tagName === 'OL' &&
        next?.tagName === 'UL' &&
        afterNext?.tagName === 'OL'
      ) {
        const lastLi = curr.lastElementChild
        if (lastLi) {
          // Nest the <ul> inside the last <li> of the first <ol>
          lastLi.appendChild(next)
          // Absorb all items from the continuation <ol>
          while (afterNext.firstChild) {
            curr.appendChild(afterNext.firstChild)
          }
          afterNext.remove()
          changed = true
          break
        }
      }

      // Pattern 2: consecutive OL → OL  (counter restart)
      if (curr.tagName === 'OL' && next?.tagName === 'OL') {
        while (next.firstChild) {
          curr.appendChild(next.firstChild)
        }
        next.remove()
        changed = true
        break
      }
    }
  }

  return div.innerHTML
}
