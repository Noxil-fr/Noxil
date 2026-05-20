'use client'

import { useState } from 'react'
import Link from 'next/link'

function NotebookItem({ notebook, isSelected, onSelect, onRename }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(notebook.name)

  const commit = () => {
    setEditing(false)
    if (name.trim() && name !== notebook.name) onRename(notebook.id, name.trim())
  }

  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => { if (!editing) onSelect(notebook) }}
    >
      <span className="text-base shrink-0">{notebook.icon || '📓'}</span>
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="flex-1 bg-transparent outline-none text-sm min-w-0"
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 text-sm truncate">{notebook.name}</span>
      )}
      {isSelected && !editing && (
        <button
          onClick={e => { e.stopPropagation(); setEditing(true) }}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs px-1 transition-opacity"
          title="Renommer"
        >✎</button>
      )}
    </div>
  )
}

function PageItem({ page, isSelected, onSelect, onDelete }) {
  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-nox-accent/15 text-nox-accent' : 'text-nox-text hover:bg-white/5'
      }`}
      onClick={() => onSelect(page)}
    >
      {page.is_pinned && <span className="text-[10px] shrink-0">📌</span>}
      <span className="flex-1 text-sm truncate">{page.title || 'Sans titre'}</span>
      <button
        onClick={e => { e.stopPropagation(); onDelete(page.id) }}
        className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-danger text-xs px-1 transition-opacity"
        title="Supprimer"
      >✕</button>
    </div>
  )
}

export default function Sidebar({
  notebooks, selectedNotebook, pages, selectedPage,
  onSelectNotebook, onSelectPage, onCreateNotebook, onCreatePage,
  onRenameNotebook, onDeletePage,
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
