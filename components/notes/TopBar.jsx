'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

function NotebookDropdown({ notebooks, selectedNotebook, onSelect, onCreateNotebook }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 text-nox-text transition-colors"
      >
        <span className="text-sm font-semibold" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
          {selectedNotebook?.icon || '📓'} {selectedNotebook?.name || 'Carnet'}
        </span>
        <span className="text-nox-muted text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-nox-surface border border-nox-border rounded-xl shadow-2xl py-1 min-w-52">
          {notebooks.map(nb => (
            <button
              key={nb.id}
              onClick={() => { onSelect(nb); setOpen(false) }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                selectedNotebook?.id === nb.id ? 'text-nox-accent' : 'text-nox-text'
              }`}
            >
              <span>{nb.icon || '📓'}</span>
              <span className="truncate">{nb.name}</span>
              {selectedNotebook?.id === nb.id && <span className="ml-auto text-[10px]">✓</span>}
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

function SectionTab({ section, isSelected, onSelect, onRename, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(section.name)
  const inputRef = useRef(null)

  const startEdit = (e) => {
    e.stopPropagation()
    setValue(section.name)
    onRenameStart?.()
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commit = () => {
    setEditing(false)
    onRenameEnd?.()
    const trimmed = value.trim()
    if (trimmed && trimmed !== section.name) onRename(section.id, trimmed)
  }

  const cancel = () => {
    setEditing(false)
    onRenameEnd?.()
    setValue(section.name)
  }

  return (
    <div
      className={`group flex items-center gap-1 px-3 py-2 cursor-pointer transition-colors border-b-2 shrink-0 ${
        isSelected
          ? 'border-nox-accent text-nox-accent'
          : 'border-transparent text-nox-muted hover:text-nox-text hover:border-nox-border'
      }`}
      onClick={() => { if (!editing) onSelect(section) }}
    >
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
          className="text-sm w-28 bg-nox-bg border border-nox-accent rounded px-1 py-0.5 outline-none text-nox-accent"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <span className="text-sm whitespace-nowrap">{section.name}</span>
      )}
      {isSelected && !editing && (
        <button
          onClick={startEdit}
          className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs ml-1 transition-opacity"
          title="Renommer"
        >✎</button>
      )}
    </div>
  )
}

export default function TopBar({
  notebooks, selectedNotebook, sections, selectedSection,
  onSelectNotebook, onCreateNotebook,
  onSelectSection, onCreateSection, onRenameSection,
  onRenameStart, onRenameEnd,
}) {
  return (
    <div className="bg-nox-surface border-b border-nox-border shrink-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-nox-border/50">
        <NotebookDropdown
          notebooks={notebooks}
          selectedNotebook={selectedNotebook}
          onSelect={onSelectNotebook}
          onCreateNotebook={onCreateNotebook}
        />
        <Link href="/hub" className="text-xs text-nox-muted hover:text-nox-text transition-colors">← Hub</Link>
      </div>
      <div className="flex items-end gap-0 px-4 overflow-x-auto">
        {sections.map(s => (
          <SectionTab
            key={s.id}
            section={s}
            isSelected={selectedSection?.id === s.id}
            onSelect={onSelectSection}
            onRename={onRenameSection}
            onRenameStart={onRenameStart}
            onRenameEnd={onRenameEnd}
          />
        ))}
        {selectedNotebook && (
          <button
            onClick={onCreateSection}
            className="text-nox-muted hover:text-nox-accent transition-colors text-lg px-2 pb-1.5 shrink-0"
            title="Nouvelle section"
          >+</button>
        )}
      </div>
    </div>
  )
}
