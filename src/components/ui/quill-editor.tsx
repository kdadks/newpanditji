import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { Extension } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
  TextUnderline,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  TextIndent,
  TextOutdent,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Trash,
} from '@phosphor-icons/react'

// ── Custom Indent Extension ────────────────────────────────────────────────
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

const IndentExtension = Extension.create({
  name: 'indent',

  addKeyboardShortcuts() {
    return {
      // Tab: sink list item when in a list, otherwise indent paragraph
      Tab: () => {
        if (this.editor.isActive('listItem')) {
          return this.editor.commands.sinkListItem('listItem')
        }
        return this.editor.commands.indent()
      },
      // Shift-Tab: lift list item when in a list, otherwise outdent paragraph
      'Shift-Tab': () => {
        if (this.editor.isActive('listItem')) {
          return this.editor.commands.liftListItem('listItem')
        }
        return this.editor.commands.outdent()
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: 0,
            parseHTML: el => {
              const ml = el.style.marginLeft
              return ml ? Math.round(parseFloat(ml) / 2) : 0
            },
            renderHTML: attrs => {
              if (!attrs.indent) return {}
              return { style: `margin-left: ${attrs.indent * 2}rem` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ state, tr, dispatch, editor }) => {
          // If cursor is inside a list item, sink it (creates proper nested list)
          if (editor.isActive('listItem')) {
            return editor.commands.sinkListItem('listItem')
          }
          const { selection } = state
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (['paragraph', 'heading'].includes(node.type.name)) {
              const indent = Math.min((node.attrs.indent || 0) + 1, 8)
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent })
            }
          })
          if (dispatch) dispatch(tr)
          return true
        },
      outdent:
        () =>
        ({ state, tr, dispatch, editor }) => {
          // If cursor is inside a list item, lift it
          if (editor.isActive('listItem')) {
            return editor.commands.liftListItem('listItem')
          }
          const { selection } = state
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (['paragraph', 'heading'].includes(node.type.name)) {
              const indent = Math.max((node.attrs.indent || 0) - 1, 0)
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent })
            }
          })
          if (dispatch) dispatch(tr)
          return true
        },
    }
  },
})

// ── Resizable Image ──────────────────────────────────────────────────────────
function ResizableImageView({ node, updateAttributes, selected }: any) {
  const { src, alt, width } = node.attrs
  const imgRef = useRef<HTMLImageElement>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = imgRef.current?.offsetWidth ?? 200

    const onMouseMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startXRef.current
      const newWidth = Math.max(50, startWidthRef.current + diff)
      updateAttributes({ width: newWidth })
    }
    const onMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <NodeViewWrapper
      as="span"
      style={{ display: 'inline-block', position: 'relative', lineHeight: 0, userSelect: 'none' } as React.CSSProperties}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt || ''}
        draggable={false}
        style={{
          width: width ? `${width}px` : 'auto',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '0.375rem',
          outline: selected ? '2px solid #6366f1' : 'none',
          outlineOffset: '2px',
          cursor: 'default',
        }}
      />
      {selected && (
        <span
          title="Drag to resize"
          style={{
            position: 'absolute', right: -5, bottom: -5,
            width: 12, height: 12,
            background: 'white', border: '2px solid #6366f1',
            cursor: 'se-resize', borderRadius: 2, zIndex: 10,
            lineHeight: '1', display: 'inline-block',
          }}
          onMouseDown={handleMouseDown}
        />
      )}
      {isResizing && width && (
        <span
          style={{
            position: 'absolute', top: -24, left: 0,
            background: '#6366f1', color: 'white',
            fontSize: 11, padding: '1px 6px', borderRadius: 3,
            pointerEvents: 'none', lineHeight: '18px', display: 'inline-block',
          }}
        >
          {width}px
        </span>
      )}
    </NodeViewWrapper>
  )
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => {
          const styleWidth = el.style.width
          if (styleWidth) return parseInt(styleWidth)
          const attrWidth = el.getAttribute('width')
          return attrWidth ? parseInt(attrWidth) : null
        },
        renderHTML: attrs => {
          if (!attrs.width) return { style: 'max-width:100%;height:auto;' }
          return { style: `width:${attrs.width}px;max-width:100%;height:auto;` }
        },
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})

// ── Image Dialog (URL + local file upload) ──────────────────────────────────
function ImageDialog({ onInsert, onClose }: { onInsert: (src: string, alt: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState<'url' | 'upload'>('url')
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tab === 'url') urlInputRef.current?.focus()
  }, [tab])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setPreview(dataUrl)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tab === 'url' && url.trim()) {
      onInsert(url.trim(), alt.trim())
    } else if (tab === 'upload' && preview) {
      onInsert(preview, alt.trim())
    }
  }

  const canInsert = tab === 'url' ? !!url.trim() : !!preview

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <div className="p-5 pb-0 shrink-0">
          <h3 className="font-semibold mb-3 text-base">Insert Image</h3>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'url' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab('url')}
          >
            From URL
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab('upload')}
          >
            Upload from device
          </button>
        </div>

        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-5 pt-3 space-y-3">
          {tab === 'url' ? (
            <div>
              <label className="text-sm font-medium block mb-1">Image URL <span className="text-destructive">*</span></label>
              <input
                ref={urlInputRef}
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border rounded px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="preview" className="max-h-52 rounded border object-contain w-full" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => { setPreview(null); fileInputRef.current?.click() }}
                  >
                    Choose different image
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full border-2 border-dashed rounded-lg p-6 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Reading file…' : 'Click to select an image from your device'}
                </button>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1">Alt text (optional)</label>
            <input
              type="text"
              value={alt}
              onChange={e => setAlt(e.target.value)}
              placeholder="Describe the image…"
              className="w-full border rounded px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          </div>{/* end scrollable area */}

          <div className="flex justify-end gap-2 p-5 pt-3 border-t shrink-0">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" disabled={!canInsert || uploading}>Insert</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function QuillEditor({
  value,
  onChange,
  placeholder = 'Enter text...',
  className,
  minHeight = '200px'
}: QuillEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)
  const tableMenuRef = useRef<HTMLDivElement>(null)

  // Close table menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false)
      }
    }
    if (showTableMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTableMenu])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      IndentExtension,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  })

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const MenuButton = ({ onClick, isActive, children, title }: any) => (
    <Button
      type="button"
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      className="h-8 w-8 p-0"
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn('border rounded-lg bg-background', className)}>
      {showImageDialog && (
        <ImageDialog
          onInsert={(src, alt) => {
            editor.chain().focus().setImage({ src, alt }).run()
            setShowImageDialog(false)
          }}
          onClose={() => setShowImageDialog(false)}
        />
      )}

      {/* Toolbar - Sticky to parent scrolling container */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-2 bg-background border-b shadow-md">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <TextB size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <TextItalic size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <TextStrikethrough size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <TextUnderline size={16} />
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <TextAlignLeft size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <TextAlignCenter size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <TextAlignRight size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <TextAlignJustify size={16} />
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBullets size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListNumbers size={16} />
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          P
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().outdent().run()}
          isActive={false}
          title="Decrease Indent / Outdent List (Shift+Tab)"
        >
          <TextOutdent size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().indent().run()}
          isActive={false}
          title="Increase Indent / Indent List (Tab)"
        >
          <TextIndent size={16} />
        </MenuButton>

        <div className="w-px bg-border mx-1" />

        {/* Image */}
        <MenuButton
          onClick={() => setShowImageDialog(true)}
          isActive={false}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </MenuButton>

        {/* Table */}
        <div className="relative" ref={tableMenuRef}>
          <MenuButton
            onClick={() => setShowTableMenu(v => !v)}
            isActive={editor.isActive('table') || showTableMenu}
            title="Table options"
          >
            <TableIcon size={16} />
          </MenuButton>

          {showTableMenu && (
            <div className="absolute left-0 top-full mt-1 z-20 bg-background border rounded-lg shadow-lg p-1 min-w-[190px] flex flex-col gap-0.5">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                  setShowTableMenu(false)
                }}
              >
                <Plus size={14} /> Insert Table (3×3)
              </button>
              <div className="h-px bg-border my-0.5" />
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().addColumnBefore().run(); setShowTableMenu(false) }}
              >
                <ArrowLeft size={14} /> Add column before
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false) }}
              >
                <ArrowRight size={14} /> Add column after
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().addRowBefore().run(); setShowTableMenu(false) }}
              >
                <ArrowUp size={14} /> Add row above
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false) }}
              >
                <ArrowDown size={14} /> Add row below
              </button>
              <div className="h-px bg-border my-0.5" />
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40 text-destructive"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false) }}
              >
                <Trash size={14} /> Delete column
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40 text-destructive"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false) }}
              >
                <Trash size={14} /> Delete row
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted w-full text-left disabled:opacity-40 text-destructive"
                disabled={!editor.isActive('table')}
                onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false) }}
              >
                <Trash size={14} /> Delete table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor - Content area (parent handles scrolling) */}
      <div
        className="p-4"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      <style>{`
        .tiptap {
          min-height: ${minHeight};
        }

        .tiptap p.is-editor-empty:first-child::before {
          color: hsl(var(--muted-foreground));
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: hsl(var(--foreground));
        }

        .tiptap h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: hsl(var(--foreground));
        }

        .tiptap p {
          margin-bottom: 0.5em;
        }

        .tiptap ul,
        .tiptap ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .tiptap ul {
          list-style-type: disc;
        }

        .tiptap ol {
          list-style-type: decimal;
        }

        /* Nested list indentation */
        .tiptap li > ul,
        .tiptap li > ol {
          padding-left: 1.5em;
          margin: 0.25em 0;
        }

        /* Nested bullet markers */
        .tiptap li > ul {
          list-style-type: circle;
        }
        .tiptap li > ul > li > ul {
          list-style-type: square;
        }

        /* Nested ordered sub-list */
        .tiptap li > ol {
          list-style-type: lower-alpha;
        }
        .tiptap li > ol > li > ol {
          list-style-type: lower-roman;
        }

        .tiptap li {
          margin-bottom: 0.25em;
        }

        .tiptap strong {
          font-weight: 600;
        }

        .tiptap em {
          font-style: italic;
        }

        .tiptap code {
          background-color: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .tiptap blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .tiptap u {
          text-decoration: underline;
        }

        .tiptap [style*="text-align: center"] { text-align: center; }
        .tiptap [style*="text-align: right"]  { text-align: right; }
        .tiptap [style*="text-align: justify"]{ text-align: justify; }
        .tiptap [style*="text-align: left"]   { text-align: left; }
        .tiptap [style*="margin-left"] { display: block; }

        /* Inline images — styles applied via React NodeView; ensure images in saved HTML also look good */
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          vertical-align: middle;
        }

        /* Tables */
        .tiptap .tableWrapper {
          overflow-x: auto;
          margin: 0.75em 0;
        }
        .tiptap table {
          border-collapse: collapse !important;
          table-layout: fixed !important;
          width: 100% !important;
        }
        .tiptap td,
        .tiptap th {
          border: 1px solid #aaa !important;
          padding: 0.15em 0.6em !important;
          min-width: 3em !important;
          vertical-align: top !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .tiptap th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
          text-align: left !important;
        }
        .dark .tiptap th {
          background-color: #374151 !important;
        }
        .dark .tiptap td,
        .dark .tiptap th {
          border-color: #4b5563 !important;
        }
        .tiptap .selectedCell::after {
          background: rgba(99, 102, 241, 0.15);
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
      `}</style>
    </div>
  )
}
