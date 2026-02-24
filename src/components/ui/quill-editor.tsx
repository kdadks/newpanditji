import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Extension } from '@tiptap/core'
import { useEffect } from 'react'
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
        ({ state, tr, dispatch }) => {
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
        ({ state, tr, dispatch }) => {
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
          title="Decrease Indent"
        >
          <TextOutdent size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().indent().run()}
          isActive={false}
          title="Increase Indent"
        >
          <TextIndent size={16} />
        </MenuButton>
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
      `}</style>
    </div>
  )
}
