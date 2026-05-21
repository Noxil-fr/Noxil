'use client'

import { useState, useRef, useEffect } from 'react'

function NotebookDropdown({ notebooks, selectedNotebook, onSelect, onCreateNotebook }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative border-b border-nox-border">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 text-nox-text transition-colors"
      >
        <span className="text-sm font-semibold flex-1 text-left truncate">
          {selectedNotebook?.icon || '📓'} {selectedNotebook?.name || 'Carnet'}
        </span>
        <span className="text-nox-muted text-[10px] shrink-0">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 bg-nox-surface border border-nox-border rounded-xl shadow-2xl py-1 w-full min-w-48">
          {notebooks.map(nb => (
            <button
              key={nb.id}
              onClick={() => { onSelect(nb); setOpen(false) }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                selectedNotebook?.id === nb.id ? 'text-nox-accent' : 'text-nox-text'
              }`}
            >
              <span>{nb.icon || '📓'}</span>
              <span className="truncate flex-1">{nb.name}</span>
              {selectedNotebook?.id === nb.id && <span className="text-[10px]">✓</span>}
            </button>
          ))}
          <div className="h-px bg-nox-border mx-2 my-1" />
          <button
            onClick={() => { onCreateNotebook(); setOpen(false) }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-nox-muted hover:text-nox-text hover:bg-white/5 transition-colors"
          >
            <span>+</span>
            <span>Nouveau carnet</span>
          </button>
        </div>
      )}
    </div>
  )
}

function PageItem({ page, isSelected, onSelect, onDelete, onRename, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(page.title || 'Sans titre')
  const inputRef = useRef(null)

  const startEdit = (e) => {
    e.stopPropagation()
    setValue(page.title || 'Sans titre')
    onRenameStart?.()
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commit = () => {
    setEditing(false)
    onRenameEnd?.()
    const trimmed = value.trim() || 'Sans titre'
    if (trimmed !== page.title) onRename(page.id, trimmed)
  }

  const cancel = () => {
    setEditing(false)
    onRenameEnd?.()
    setValue(page.title || 'Sans titre')
  }

  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => { if (!editing) onSelect(page) }}
    >
      {page.is_pinned && <span className="text-[10px] shrink-0">📌</span>}
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            if (e.key === 'Escape') cancel()
          }}
          onClick={e => e.stopPropagation()}
          className="flex-1 text-sm min-w-0 bg-nox-bg border border-nox-accent rounded px-1 py-0.5 outline-none text-nox-accent"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <span className="flex-1 text-sm truncate">{page.title || 'Sans titre'}</span>
      )}
      {isSelected && !editing && (
        <button
          onClick={startEdit}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs px-1 transition-opacity shrink-0"
          title="Renommer"
        >✎</button>
      )}
      {!editing && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(page.id) }}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-danger text-xs px-1 py-0.5 rounded hover:bg-white/10 transition-opacity shrink-0"
          title="Supprimer"
        >✕</button>
      )}
    </div>
  )
}

export default function Sidebar({
  notebooks, selectedNotebook, pages, selectedPage, selectedSection,
  onSelectNotebook, onCreateNotebook,
  onSelectPage, onCreatePage, onRenamePage, onDeletePage,
  onRenameStart, onRenameEnd,
}) {
  return (
    <aside className="w-52 shrink-0 bg-nox-surface border-r border-nox-border flex flex-col h-full">
      <NotebookDropdown
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        onSelect={onSelectNotebook}
        onCreateNotebook={onCreateNotebook}
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-nox-border/40">
        <span className="text-[11px] font-semibold text-nox-muted uppercase tracking-wider">Pages</span>
        {selectedSection && (
          <button
            onClick={onCreatePage}
            className="text-nox-muted hover:text-nox-accent transition-colors text-lg leading-none pb-0.5"
            title="Nouvelle page"
          >+</button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex flex-col gap-0.5">
          {pages.map(page => (
            <PageItem
              key={page.id}
              page={page}
              isSelected={selectedPage?.id === page.id}
              onSelect={onSelectPage}
              onDelete={onDeletePage}
              onRename={onRenamePage}
              onRenameStart={onRenameStart}
              onRenameEnd={onRenameEnd}
            />
          ))}
          {pages.length === 0 && selectedSection && (
            <p className="text-xs text-nox-muted px-2 py-2">Aucune page</p>
          )}
          {!selectedSection && (
            <p className="text-xs text-nox-muted px-2 py-2">Sélectionne une section</p>
          )}
        </div>
      </div>
    </aside>
  )
}
