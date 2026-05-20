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
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <input
          ref={titleRef}
          type="text"
          placeholder="Titre"
          maxLength={80}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenu de la note…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-save" onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
