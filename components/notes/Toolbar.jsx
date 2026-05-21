'use client'

import { useState, useRef, useEffect } from 'react'

const TEXT_COLORS = ['#e6edf3','#f85149','#ff9f43','#ffd43b','#6bcb77','#58a6ff','#a78bfa','#f97fa3','#8b949e','#000000']
const HIGHLIGHT_COLORS = ['#ffd43b40','#6bcb7740','#58a6ff40','#a78bfa40','#f8514940','#ff9f4340']

const FONT_FAMILIES = [
  { label: 'Système', value: null },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Consolas', value: "'Consolas', monospace" },
  { label: 'Calibri', value: "'Calibri', sans-serif" },
  { label: 'Century Gothic', value: "'Century Gothic', sans-serif" },
]

const FONT_SIZES = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 48]

function Btn({ active, onClick, title, children, className = '' }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`px-2 py-1 rounded text-[13px] font-medium transition-colors ${
        active
          ? 'bg-nox-accent/20 text-nox-accent'
          : 'text-nox-muted hover:text-nox-text hover:bg-white/5'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-nox-border mx-0.5 shrink-0" />
}

function ColorPopover({ colors, onSelect, onReset, label, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onMouseDown={e => { e.preventDefault(); setOpen(v => !v) }}
        title={label}
        className="px-2 py-1 rounded text-[13px] text-nox-muted hover:text-nox-text hover:bg-white/5 transition-colors"
      >
        {children}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-nox-surface border border-nox-border rounded-lg p-2 shadow-lg">
          <div className="grid grid-cols-5 gap-1 mb-1.5">
            {colors.map(c => (
              <button
                key={c}
                onMouseDown={e => { e.preventDefault(); onSelect(c); setOpen(false) }}
                className="w-5 h-5 rounded border border-nox-border hover:scale-110 transition-transform"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
          <button
            onMouseDown={e => { e.preventDefault(); onReset(); setOpen(false) }}
            className="text-[11px] text-nox-muted hover:text-nox-text w-full text-center mt-0.5"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  )
}

function FontSelect({ value, options, onChange, width, renderLabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const current = options.find(o => String(o.value) === String(value))

  return (
    <div className="relative shrink-0" ref={ref} style={{ width }}>
      <button
        onMouseDown={e => { e.preventDefault(); setOpen(v => !v) }}
        className="w-full text-left px-1.5 py-0.5 rounded text-[12px] text-nox-text bg-nox-surface border border-nox-border hover:border-nox-accent truncate"
        style={{ fontFamily: current?.style || 'inherit' }}
      >
        {current ? renderLabel(current) : options[0] ? renderLabel(options[0]) : '—'}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-nox-surface border border-nox-border rounded-lg shadow-lg py-1" style={{ minWidth: width }}>
          {options.map(opt => (
            <button
              key={opt.label}
              onMouseDown={e => { e.preventDefault(); onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-1 text-[12px] hover:bg-white/5 whitespace-nowrap ${String(opt.value) === String(value) ? 'text-nox-accent' : 'text-nox-text'}`}
              style={{ fontFamily: opt.style || 'inherit' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LinkPopover({ editor }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const toggle = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else {
      setUrl(editor.getAttributes('link').href || '')
      setOpen(true)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const apply = () => {
    if (!url.trim()) return
    editor.chain().focus().setLink({ href: url.trim() }).run()
    setOpen(false)
    setUrl('')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onMouseDown={e => { e.preventDefault(); toggle() }}
        title="Lien"
        className={`px-2 py-1 rounded text-[13px] font-medium transition-colors ${
          editor.isActive('link') ? 'bg-nox-accent/20 text-nox-accent' : 'text-nox-muted hover:text-nox-text hover:bg-white/5'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-nox-surface border border-nox-border rounded-lg p-2 shadow-lg flex gap-1.5" style={{ minWidth: 240 }}>
          <input
            ref={inputRef}
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') apply(); if (e.key === 'Escape') setOpen(false) }}
            placeholder="https://..."
            className="flex-1 bg-transparent border border-nox-border rounded px-2 py-1 text-[13px] text-nox-text outline-none focus:border-nox-accent placeholder:text-nox-muted/50"
          />
          <button onMouseDown={e => { e.preventDefault(); apply() }} className="bg-nox-accent text-white rounded px-2.5 py-1 text-[13px] font-medium hover:opacity-80">OK</button>
        </div>
      )}
    </div>
  )
}

export default function Toolbar({ editor }) {
  if (!editor) return null

  const e = editor.chain().focus()

  const currentFamily = editor.getAttributes('textStyle').fontFamily || ''
  const currentSize = editor.getAttributes('textStyle').fontSize || ''

  const familyOptions = FONT_FAMILIES.map(f => ({ ...f, value: f.value || '', style: f.value }))
  const sizeOptions = [{ label: '—', value: '' }, ...FONT_SIZES.map(s => ({ label: String(s), value: String(s) }))]

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-4 py-2 border-b border-nox-border bg-nox-surface shrink-0">

      {/* Police & taille */}
      <FontSelect
        value={currentFamily}
        options={familyOptions}
        onChange={v => v
          ? editor.chain().focus().setMark('textStyle', { fontFamily: v }).run()
          : editor.chain().focus().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run()}
        width={120}
        renderLabel={opt => opt.label}
      />
      <FontSelect
        value={currentSize}
        options={sizeOptions}
        onChange={v => v
          ? editor.chain().focus().setMark('textStyle', { fontSize: v }).run()
          : editor.chain().focus().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()}
        width={56}
        renderLabel={opt => opt.label}
      />

      <Divider />

      {/* Historique */}
      <Btn onClick={() => e.undo().run()} title="Annuler (Ctrl+Z)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
      </Btn>
      <Btn onClick={() => e.redo().run()} title="Rétablir (Ctrl+Y)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
      </Btn>

      <Divider />

      {/* Titres */}
      <Btn active={editor.isActive('heading', { level: 1 })} onClick={() => e.toggleHeading({ level: 1 }).run()} title="Titre 1">H1</Btn>
      <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => e.toggleHeading({ level: 2 }).run()} title="Titre 2">H2</Btn>
      <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => e.toggleHeading({ level: 3 }).run()} title="Titre 3">H3</Btn>

      <Divider />

      {/* Formatage */}
      <Btn active={editor.isActive('bold')} onClick={() => e.toggleBold().run()} title="Gras (Ctrl+B)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </Btn>
      <Btn active={editor.isActive('italic')} onClick={() => e.toggleItalic().run()} title="Italique (Ctrl+I)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </Btn>
      <Btn active={editor.isActive('underline')} onClick={() => e.toggleUnderline().run()} title="Souligné (Ctrl+U)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>
      </Btn>
      <Btn active={editor.isActive('strike')} onClick={() => e.toggleStrike().run()} title="Barré">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 5.5 7 8C7 10 8.5 11 10 11.5"/><path d="M8 18C8 18 9.5 20 12 20C14.5 20 17 18.5 17 16C17 14 15.5 13 14 12.5"/></svg>
      </Btn>

      <Divider />

      {/* Couleurs */}
      <ColorPopover
        colors={TEXT_COLORS}
        label="Couleur du texte"
        onSelect={c => editor.chain().focus().setColor(c).run()}
        onReset={() => editor.chain().focus().unsetColor().run()}
      >
        <span className="flex flex-col items-center gap-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
          <span className="text-[8px] font-bold" style={{ color: editor.getAttributes('textStyle').color || 'currentColor' }}>A</span>
        </span>
      </ColorPopover>
      <ColorPopover
        colors={HIGHLIGHT_COLORS}
        label="Surlignage"
        onSelect={c => editor.chain().focus().setHighlight({ color: c }).run()}
        onReset={() => editor.chain().focus().unsetHighlight().run()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </ColorPopover>

      <Divider />

      {/* Alignement */}
      <Btn active={editor.isActive({ textAlign: 'left' })} onClick={() => e.setTextAlign('left').run()} title="Gauche">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: 'center' })} onClick={() => e.setTextAlign('center').run()} title="Centre">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: 'right' })} onClick={() => e.setTextAlign('right').run()} title="Droite">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: 'justify' })} onClick={() => e.setTextAlign('justify').run()} title="Justifier">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </Btn>

      <Divider />

      {/* Listes */}
      <Btn active={editor.isActive('bulletList')} onClick={() => e.toggleBulletList().run()} title="Liste à puces">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
      </Btn>
      <Btn active={editor.isActive('orderedList')} onClick={() => e.toggleOrderedList().run()} title="Liste numérotée">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
      </Btn>
      <Btn active={editor.isActive('taskList')} onClick={() => e.toggleTaskList().run()} title="Liste de tâches">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="5" width="6" height="6" rx="1"/><polyline points="5 8 6.5 9.5 9 7"/><line x1="13" y1="8" x2="21" y2="8"/><rect x="3" y="14" width="6" height="6" rx="1"/><line x1="13" y1="17" x2="21" y2="17"/></svg>
      </Btn>
      <Btn onClick={() => e.sinkListItem('listItem').run()} title="Augmenter l'indentation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="13 8 17 12 13 16"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="21" y1="6" x2="21" y2="18"/></svg>
      </Btn>
      <Btn onClick={() => e.liftListItem('listItem').run()} title="Diminuer l'indentation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="11 8 7 12 11 16"/><line x1="7" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3" y2="18"/></svg>
      </Btn>

      <Divider />

      {/* Lien */}
      <LinkPopover editor={editor} />

      {/* Bloc de code */}
      <Btn active={editor.isActive('codeBlock')} onClick={() => e.toggleCodeBlock().run()} title="Bloc de code">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </Btn>

      <Divider />

      {/* Tableau */}
      <Btn onClick={() => e.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insérer un tableau">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
      </Btn>

      {/* Contrôles tableau — visibles seulement dans un tableau */}
      {editor.isActive('table') && (
        <>
          <Btn onClick={() => e.addRowAfter().run()} title="Ajouter une ligne">+R</Btn>
          <Btn onClick={() => e.addColumnAfter().run()} title="Ajouter une colonne">+C</Btn>
          <Btn onClick={() => e.deleteRow().run()} title="Supprimer la ligne">-R</Btn>
          <Btn onClick={() => e.deleteColumn().run()} title="Supprimer la colonne">-C</Btn>
          <Btn onClick={() => e.deleteTable().run()} title="Supprimer le tableau" className="text-danger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </Btn>
        </>
      )}
    </div>
  )
}
