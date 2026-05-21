'use client'

import { useState, useRef } from 'react'

const COLORS = [
  '#c0392b', '#a84300', '#1e8449', '#1a5276',
  '#6c3483', '#0e6655', '#7b241c', '#196f3d',
]

function SectionTab({ section, isSelected, onSelect, onRename, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(section.name)
  const inputRef = useRef(null)
  const color = section.color || '#1a5276'

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
      className={`group flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-all border-b-2 border-transparent shrink-0 ${
        isSelected ? 'text-white' : 'text-nox-muted hover:text-nox-text'
      }`}
      style={isSelected ? { backgroundColor: color, borderBottomColor: color } : {}}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = `${color}22` }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '' }}
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
          className="text-sm w-28 bg-black/20 border border-white/30 rounded px-1 py-0.5 outline-none text-white"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <span className="text-sm whitespace-nowrap">{section.name}</span>
      )}
      {isSelected && !editing && (
        <button
          onClick={startEdit}
          className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white text-xs transition-opacity"
          title="Renommer"
        >✎</button>
      )}
    </div>
  )
}

export default function SectionTabs({
  sections, selectedSection, hasNotebook,
  onSelectSection, onCreateSection, onRenameSection,
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

export { COLORS }
