'use client'

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

  const save = async ({ title, content }) => {
    if (modal?.id) {
      await sb.from('notes').update({ title, content }).eq('id', modal.id)
    } else {
      await sb.from('notes').insert({ title, content })
    }
    await refresh()
    setModal(null)
  }

  const confirmDelete = async () => {
    await sb.from('notes').delete().eq('id', confirm.id)
    setConfirm(null)
    if (preview?.id === confirm.id) setPreview(null)
    await refresh()
  }

  return (
    <>
      <div className="grid gap-x-6 gap-y-3.5" style={{ gridTemplateColumns: '50% 1fr', gridTemplateRows: 'auto auto' }}>

        {/* header */}
        <div style={{ gridColumn: 1, gridRow: 1 }}>
          <button
            onClick={() => setModal({})}
            className="inline-flex items-center gap-2 text-nox-accent text-sm font-medium px-3.5 py-2 rounded-md border cursor-pointer hover:border-nox-muted transition-colors"
            style={{
              background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))',
              borderColor: 'color-mix(in srgb, var(--accent) 30%, var(--border))',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvelle note
          </button>
        </div>

        {/* liste */}
        <div className={`notes-list flex flex-col${notes.length ? ' has-notes' : ''}`} style={{ gridColumn: 1, gridRow: 2 }}>
          {notes.length === 0
            ? <p className="text-sm text-nox-muted">Aucune note pour l'instant.</p>
            : notes.map(note => (
              <div
                key={note.id}
                className="note-item flex items-center justify-between gap-3 px-4 py-[11px] cursor-pointer border-b border-nox-border transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface))]"
                onClick={() => setModal(note)}
                onMouseEnter={() => setPreview(note)}
                onMouseLeave={() => setPreview(null)}
              >
                <span className="text-sm text-nox-text truncate">{note.title || 'Sans titre'}</span>
                <button
                  className="note-delete-btn bg-transparent border-none text-transparent text-[13px] px-1 py-0.5 leading-none shrink-0 cursor-pointer transition-colors"
                  onClick={e => { e.stopPropagation(); setConfirm(note) }}
                >✕</button>
              </div>
            ))
          }
        </div>

        {/* prévisualisation */}
        <div
          className="transition-opacity duration-[180ms] pt-0.5"
          style={{ gridColumn: 2, gridRow: 2, opacity: preview ? 1 : 0, pointerEvents: 'none' }}
        >
          <div className="text-sm font-semibold text-nox-text mb-2">{preview?.title || ''}</div>
          <div className="text-[13px] text-nox-muted leading-[1.65] whitespace-pre-wrap">{preview?.content || ''}</div>
        </div>
      </div>

      {modal !== null && <NoteModal note={modal} onSave={save} onClose={() => setModal(null)} />}
      {confirm && <ConfirmModal message="Supprimer cette note ?" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />}
    </>
  )
}
