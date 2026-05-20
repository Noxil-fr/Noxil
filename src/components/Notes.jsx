import { useState } from 'react'
import NoteModal from './NoteModal'
import ConfirmModal from './ConfirmModal'

export default function Notes({ sb, notes, setNotes }) {
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [preview, setPreview] = useState(null)

  const refresh = async () => {
    const { data } = await sb.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(data || [])
  }

  const openNew = () => setModal({})
  const openEdit = note => setModal(note)
  const closeModal = () => setModal(null)

  const save = async ({ title, content }) => {
    if (modal.id) {
      await sb.from('notes').update({ title, content }).eq('id', modal.id)
    } else {
      await sb.from('notes').insert({ title, content })
    }
    await refresh()
    closeModal()
  }

  const askDelete = (e, note) => {
    e.stopPropagation()
    setConfirm(note)
  }

  const confirmDelete = async () => {
    await sb.from('notes').delete().eq('id', confirm.id)
    setConfirm(null)
    if (preview?.id === confirm.id) setPreview(null)
    await refresh()
  }

  return (
    <>
      <div className="notes-wrapper">
        <div className="note-header">
          <button className="new-note-btn" onClick={openNew}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvelle note
          </button>
        </div>

        <div className={`notes-list${notes.length ? ' has-notes' : ''}`}>
          {notes.length === 0
            ? <p className="note-empty">Aucune note pour l'instant.</p>
            : notes.map(note => (
              <div
                key={note.id}
                className="note-item"
                onClick={() => openEdit(note)}
                onMouseEnter={() => setPreview(note)}
                onMouseLeave={() => setPreview(null)}
              >
                <span className="note-item-title">{note.title || 'Sans titre'}</span>
                <button className="note-delete-btn" onClick={e => askDelete(e, note)}>✕</button>
              </div>
            ))
          }
        </div>

        <div className={`note-preview${preview ? ' visible' : ''}`}>
          <div className="note-preview-title">{preview?.title || ''}</div>
          <div className="note-preview-body">{preview?.content || ''}</div>
        </div>
      </div>

      {modal !== null && (
        <NoteModal note={modal} onSave={save} onClose={closeModal} />
      )}

      {confirm && (
        <ConfirmModal
          message="Supprimer cette note ?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}
