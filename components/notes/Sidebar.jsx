'use client'

import { useState, useRef, useEffect } from 'react'
import ContextMenu from './ContextMenu'

function NotebookItem({ notebook, isSelected, onSelect, onRename, onDelete, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [value, setValue] = useState(notebook.name)
  const inputRef = useRef(null)

  const startEdit = () => {
    setValue(notebook.name)
    onRenameStart?.()
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commit = () => {
    setEditing(false)
    onRenameEnd?.()
    const trimmed = value.trim()
    if (trimmed && trimmed !== notebook.name) onRename(notebook.id, trimmed)
  }

  const cancel = () => {
    setEditing(false)
    onRenameEnd?.()
    setValue(notebook.name)
  }

  return (
    <div
      className={`relative flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors cursor-pointer ${
        isSelected ? 'text-nox-accent' : 'text-nox-text'
      }`}
      onClick={() => { if (!editing) onSelect(notebook) }}
      onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }) }}
    >
      <span>{notebook.icon || '📓'}</span>
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
          className="flex-1 text-sm bg-nox-bg border border-nox-accent rounded px-1 py-0.5 outline-none text-nox-accent min-w-0"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <span className="truncate flex-1">{notebook.name}</span>
      )}
      {isSelected && !editing && <span className="text-[10px] shrink-0">✓</span>}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            { icon: '✎', label: 'Renommer', action: startEdit },
            { separator: true },
            { icon: '🗑', label: 'Supprimer', danger: true, action: () => onDelete(notebook.id) },
          ]}
        />
      )}
    </div>
  )
}

function NotebookDropdown({ notebooks, selectedNotebook, onSelect, onCreateNotebook, onRenameNotebook, onDeleteNotebook, onRenameStart, onRenameEnd }) {
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
            <NotebookItem
              key={nb.id}
              notebook={nb}
              isSelected={selectedNotebook?.id === nb.id}
              onSelect={(nb) => { onSelect(nb); setOpen(false) }}
              onRename={onRenameNotebook}
              onDelete={(id) => { onDeleteNotebook(id); setOpen(false) }}
              onRenameStart={onRenameStart}
              onRenameEnd={onRenameEnd}
            />
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
  const [contextMenu, setContextMenu] = useState(null)
  const [value, setValue] = useState(page.title || 'Sans titre')
  const inputRef = useRef(null)

  const startEdit = () => {
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

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => { if (!editing) onSelect(page) }}
      onContextMenu={handleContextMenu}
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
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            { icon: '✎', label: 'Renommer', action: startEdit },
            { separator: true },
            { icon: '🗑', label: 'Supprimer', danger: true, action: () => onDelete(page.id) },
          ]}
        />
      )}
    </div>
  )
}

export default function Sidebar({
  notebooks, selectedNotebook, pages, selectedPage,
  canCreate,
  onSelectNotebook, onCreateNotebook, onRenameNotebook, onDeleteNotebook,
  onSelectPage, onCreatePage, onRenamePage, onDeletePage,
  onRenameStart, onRenameEnd,
  quickNotesMode, onToggleQuickNotes,
}) {
  return (
    <aside className="w-52 shrink-0 bg-nox-surface border-r border-nox-border flex flex-col h-full">
      <NotebookDropdown
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        onSelect={onSelectNotebook}
        onCreateNotebook={onCreateNotebook}
        onRenameNotebook={onRenameNotebook}
        onDeleteNotebook={onDeleteNotebook}
        onRenameStart={onRenameStart}
        onRenameEnd={onRenameEnd}
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-nox-border/40">
        <span className="text-[11px] font-semibold text-nox-muted uppercase tracking-wider">Pages</span>
        {canCreate && (
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
          {pages.length === 0 && canCreate && (
            <p className="text-xs text-nox-muted px-2 py-2">{quickNotesMode ? 'Aucune note rapide' : 'Aucune page'}</p>
          )}
          {pages.length === 0 && !canCreate && (
            <p className="text-xs text-nox-muted px-2 py-2">Sélectionne une section</p>
          )}
        </div>
      </div>
      <div className="border-t border-nox-border p-2">
        <button
          onClick={onToggleQuickNotes}
          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
            quickNotesMode ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-muted hover:text-nox-text hover:bg-white/5'
          }`}
        >
          <span>⚡</span>
          <span>Notes rapides</span>
        </button>
      </div>
    </aside>
  )
}
