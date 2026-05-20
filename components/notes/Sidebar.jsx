'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

function RenameModal({ label, current, onConfirm, onCancel }) {
  const [value, setValue] = useState(current)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-nox-surface border border-nox-border rounded-xl p-5 w-72 shadow-2xl">
        <p className="text-xs text-nox-muted uppercase tracking-wider mb-3">{label}</p>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onConfirm(value)
            if (e.key === 'Escape') onCancel()
          }}
          className="w-full bg-nox-bg border border-nox-accent rounded-lg px-3 py-2 text-sm text-nox-text outline-none"
        />
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onCancel} className="text-xs text-nox-muted px-3 py-1.5 rounded hover:text-nox-text transition-colors">Annuler</button>
          <button onClick={() => onConfirm(value)} className="text-xs bg-nox-accent text-white rounded-lg px-4 py-1.5 hover:opacity-80 font-medium transition-opacity">OK</button>
        </div>
      </div>
    </div>
  )
}

function NotebookItem({ notebook, isSelected, onSelect, onRename, onRenameStart, onRenameEnd }) {
  const [renaming, setRenaming] = useState(false)

  const startRename = (e) => {
    e.stopPropagation()
    setRenaming(true)
    onRenameStart?.()
  }

  const confirm = (value) => {
    setRenaming(false)
    onRenameEnd?.()
    const trimmed = value.trim()
    if (trimmed && trimmed !== notebook.name) onRename(notebook.id, trimmed)
  }

  const cancel = () => {
    setRenaming(false)
    onRenameEnd?.()
  }

  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => onSelect(notebook)}
    >
      <span className="text-base shrink-0">{notebook.icon || '📓'}</span>
      <span className="flex-1 text-sm truncate">{notebook.name}</span>
      {isSelected && (
        <button
          onClick={startRename}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs px-1 transition-opacity shrink-0"
          title="Renommer"
        >✎</button>
      )}
      {renaming && (
        <RenameModal
          label="Renommer le carnet"
          current={notebook.name}
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </div>
  )
}

function PageItem({ page, isSelected, onSelect, onDelete, onRename, onRenameStart, onRenameEnd }) {
  const [renaming, setRenaming] = useState(false)

  const startRename = (e) => {
    e.stopPropagation()
    setRenaming(true)
    onRenameStart?.()
  }

  const confirm = (value) => {
    setRenaming(false)
    onRenameEnd?.()
    const trimmed = value.trim() || 'Sans titre'
    if (trimmed !== page.title) onRename(page.id, trimmed)
  }

  const cancel = () => {
    setRenaming(false)
    onRenameEnd?.()
  }

  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => onSelect(page)}
    >
      {page.is_pinned && <span className="text-[10px] shrink-0">📌</span>}
      <span className="flex-1 text-sm truncate">{page.title || 'Sans titre'}</span>
      {isSelected && (
        <button
          onClick={startRename}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs px-1 transition-opacity shrink-0"
          title="Renommer"
        >✎</button>
      )}
      <button
        onClick={e => { e.stopPropagation(); onDelete(page.id) }}
        className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-danger text-xs px-1 py-0.5 rounded hover:bg-white/10 transition-opacity shrink-0"
        title="Supprimer"
      >✕</button>
      {renaming && (
        <RenameModal
          label="Renommer la page"
          current={page.title || ''}
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </div>
  )
}

export default function Sidebar({
  notebooks, selectedNotebook, pages, selectedPage,
  onSelectNotebook, onSelectPage, onCreateNotebook, onCreatePage,
  onRenameNotebook, onRenamePage, onDeletePage,
  onRenameStart, onRenameEnd,
}) {
  return (
    <aside className="w-60 shrink-0 bg-nox-surface border-r border-nox-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-nox-border">
        <Link href="/hub" className="text-lg font-bold text-nox-text hover:text-nox-accent transition-colors"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}>
          Noxil.
        </Link>
        <Link href="/hub" className="text-xs text-nox-muted hover:text-nox-text transition-colors">← Hub</Link>
      </div>

      {/* Carnets */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-nox-muted uppercase tracking-wider">Carnets</span>
          <button
            onClick={onCreateNotebook}
            className="text-nox-muted hover:text-nox-accent transition-colors text-lg leading-none pb-0.5"
            title="Nouveau carnet"
          >+</button>
        </div>
        <div className="flex flex-col gap-0.5">
          {notebooks.map(nb => (
            <NotebookItem
              key={nb.id}
              notebook={nb}
              isSelected={selectedNotebook?.id === nb.id}
              onSelect={onSelectNotebook}
              onRename={onRenameNotebook}
              onRenameStart={onRenameStart}
              onRenameEnd={onRenameEnd}
            />
          ))}
          {notebooks.length === 0 && (
            <p className="text-xs text-nox-muted px-2 py-1">Aucun carnet</p>
          )}
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-px bg-nox-border mx-3" />

      {/* Pages */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-nox-muted uppercase tracking-wider">
            {selectedNotebook?.name || 'Pages'}
          </span>
          {selectedNotebook && (
            <button
              onClick={onCreatePage}
              className="text-nox-muted hover:text-nox-accent transition-colors text-lg leading-none pb-0.5"
              title="Nouvelle page"
            >+</button>
          )}
        </div>
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
          {pages.length === 0 && selectedNotebook && (
            <p className="text-xs text-nox-muted px-2 py-1">Aucune page</p>
          )}
        </div>
      </div>
    </aside>
  )
}
