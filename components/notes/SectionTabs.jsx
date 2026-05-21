'use client'

import { useState, useRef } from 'react'
import ContextMenu from './ContextMenu'

const COLORS = [
  '#c0392b', '#a84300', '#1e8449', '#1a5276',
  '#6c3483', '#0e6655', '#7b241c', '#196f3d',
]

function SectionTab({ section, isSelected, onSelect, onRename, onDelete, onRenameStart, onRenameEnd }) {
  const [editing, setEditing] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [value, setValue] = useState(section.name)
  const inputRef = useRef(null)
  const color = section.color || '#1a5276'

  const startEdit = () => {
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

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-all border-b-2 ${
          isSelected ? 'text-white' : 'text-white/60 hover:text-white/90'
        }`}
        style={isSelected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: `${color}40`, borderColor: 'transparent' }
        }
        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = `${color}60` }}
        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = `${color}40` }}
        onClick={() => { if (!editing) onSelect(section) }}
        onContextMenu={handleContextMenu}
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
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            { icon: '✎', label: 'Renommer', action: startEdit },
            { separator: true },
            { icon: '🗑', label: 'Supprimer', danger: true, action: () => onDelete(section.id) },
          ]}
        />
      )}
    </div>
  )
}

export default function SectionTabs({
  sections, selectedSection, hasNotebook,
  onSelectSection, onCreateSection, onRenameSection, onDeleteSection,
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
          onDelete={onDeleteSection}
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
