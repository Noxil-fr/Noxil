'use client'

import { useEffect, useRef, useState } from 'react'

export default function NoteModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = () => {
    if (!title.trim() && !content.trim()) return
    onSave({ title: title.trim(), content: content.trim() })
  }

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-5"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-nox-surface border border-nox-border rounded w-full max-w-[520px] flex flex-col overflow-hidden">
        <input
          ref={titleRef}
          type="text"
          placeholder="Titre"
          maxLength={80}
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-6 pt-[22px] pb-1.5 text-xl font-semibold bg-transparent border-none text-nox-text outline-none w-full placeholder:text-nox-muted"
        />
        <textarea
          placeholder="Contenu de la note…"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="note-textarea placeholder:text-nox-muted"
        />
        <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-nox-border">
          <button
            onClick={onClose}
            className="bg-transparent border-none rounded-md text-nox-muted text-[13px] px-3.5 py-1.5 cursor-pointer hover:text-nox-text transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={save}
            className="bg-nox-accent border-none rounded-md text-white text-[13px] font-medium px-3.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
