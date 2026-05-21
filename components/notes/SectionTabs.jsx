'use client'

import { useState, useRef, useEffect } from 'react'

const COLORS = [
  '#e74c3c', '#e67e22', '#f39c12', '#27ae60',
  '#2980b9', '#8e44ad', '#16a085', '#e91e63',
  '#c0392b', '#d35400', '#f1c40f', '#1e8449',
]

function ColorPicker({ current, onSelect, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-nox-surface border border-nox-border rounded-xl p-3 shadow-2xl">
      <div className="grid grid-cols-6 gap-2 mb-2">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="w-5 h-5 rounded-full transition-transform hover:scale-125"
            style={{
              background: c,
              outline: current === c ? `2px solid ${c}` : 'none',
              outlineOffset: '2px',
            }}
          />
        ))}
      </div>
      <button
        onClick={() => onSelect(null)}
        className="w-full text-[11px] text-nox-muted hover:text-nox-text transition-colors text-center"
      >
        Aucune couleur
      </button>
    </div>
  )
}

function SectionTab({ section, isSelected, onSelect, onRename, onColor, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [value, setValue] = useState(section.name)
  const inputRef = useRef(null)
  const color = section.color || 'var(--accent)'

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
    <div className="relative shrink-0">
      <div
        className={`group flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors border-b-2 ${
          isSelected
            ? 'text-nox-text'
            : 'border-transparent text-nox-muted hover:text-nox-text hover:border-nox-border/50'
        }`}
        style={isSelected ? { borderColor: color } : {}}
        onClick={() => { if (!editing) onSelect(section) }}
      >
        {!isSelected && section.color && (
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: section.color }} />
        )}
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
          <>
            <button
              onClick={startEdit}
              className="opacity-0 group-hover:opacity-100 text-nox-muted hover:text-nox-text text-xs transition-opacity"
              title="Renommer"
            >✎</button>
            <button
              onClick={e => { e.stopPropagation(); setShowColorPicker(p => !p) }}
              className="opacity-0 group-hover:opacity-100 w-3 h-3 rounded-full shrink-0 transition-opacity border border-white/20"
              style={{ background: color }}
              title="Couleur de la section"
            />
          </>
        )}
      </div>
      {showColorPicker && (
        <ColorPicker
          current={section.color}
          onSelect={(c) => { onColor(section.id, c); setShowColorPicker(false) }}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </div>
  )
}

export default function SectionTabs({
  sections, selectedSection, hasNotebook,
  onSelectSection, onCreateSection, onRenameSection, onColorSection,
  onRenameStart, onRenameEnd,
}) {
  return (
    <div className="flex items-end bg-nox-surface border-b border-nox-border shrink-0 overflow-x-auto">
      {sections.map(s => (
        <SectionTab
          key={s.id}
          section={s}
          isSelected={selectedSection?.id === s.id}
          onSelect={onSelectSection}
          onRename={onRenameSection}
          onColor={onColorSection}
          onRenameStart={onRenameStart}
          onRenameEnd={onRenameEnd}
        />
      ))}
      {hasNotebook && (
        <button
          onClick={onCreateSection}
          className="text-nox-muted hover:text-nox-accent transition-colors text-xl px-3 pb-1.5 shrink-0"
          title="Nouvelle section"
        >+</button>
      )}
    </div>
  )
}
