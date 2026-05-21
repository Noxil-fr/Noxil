'use client'

import { useEffect, useRef, useState } from 'react'

export default function QuickNoteEditor({ note, onSave }) {
  const [content, setContent] = useState(note.content || '')
  const saveTimer = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    setContent(note.content || '')
  }, [note.id])

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  const handleContentChange = (e) => {
    const val = e.target.value
    setContent(val)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => onSave(note.id, { content: val }), 1000)
  }

  const handleTitleBlur = (e) => {
    const title = e.target.value.trim() || 'Sans titre'
    if (title !== note.title) onSave(note.id, { title })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-14 py-10">
        <input
          key={note.id}
          defaultValue={note.title === 'Sans titre' ? '' : note.title}
          placeholder="Sans titre"
          onBlur={handleTitleBlur}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); textareaRef.current?.focus() } }}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-6 text-nox-text placeholder:text-nox-muted/30"
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Commence à écrire…"
          className="w-full bg-transparent border-none outline-none resize-none text-nox-text placeholder:text-nox-muted/40 text-sm leading-relaxed min-h-[60vh]"
          style={{ fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}
