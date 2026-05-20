'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import Toolbar from './Toolbar'

const lowlight = createLowlight(common)

export default function NoteEditor({ page, onSave, editorDisabled }) {
  const saveTimer = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: 'Commence à écrire…' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'tiptap-link' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: page.content && Object.keys(page.content).length ? page.content : '',
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'tiptap-editor outline-none' },
    },
    onUpdate: ({ editor }) => {
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        onSave(page.id, { content: editor.getJSON() })
      }, 1000)
    },
  })

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!editorDisabled)
    if (editorDisabled) editor.commands.blur()
  }, [editor, editorDisabled])

  const handleTitleBlur = useCallback((e) => {
    const title = e.target.value.trim() || 'Sans titre'
    if (title !== page.title) onSave(page.id, { title })
  }, [page.id, page.title, onSave])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto px-14 py-10">
        <input
          key={page.id}
          defaultValue={page.title === 'Sans titre' ? '' : page.title}
          placeholder="Sans titre"
          onFocus={e => { e.target.style.borderBottom = '1px solid var(--muted)' }}
          onBlur={e => { e.target.style.borderBottom = ''; handleTitleBlur(e) }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); editor?.commands.focus() } }}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-6 text-nox-text placeholder:text-nox-muted/30"
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
