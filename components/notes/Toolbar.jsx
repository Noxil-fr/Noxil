'use client'

function Btn({ active, onClick, title, children }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`px-2 py-1 rounded text-[13px] font-medium transition-colors ${
        active
          ? 'bg-nox-accent/20 text-nox-accent'
          : 'text-nox-muted hover:text-nox-text hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-nox-border mx-0.5 shrink-0" />
}

export default function Toolbar({ editor }) {
  if (!editor) return null

  const e = editor.chain().focus()

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-4 py-2 border-b border-nox-border bg-nox-surface shrink-0">
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

      {/* Alignement */}
      <Btn active={editor.isActive({ textAlign: 'left' })} onClick={() => e.setTextAlign('left').run()} title="Aligner à gauche">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: 'center' })} onClick={() => e.setTextAlign('center').run()} title="Centrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: 'right' })} onClick={() => e.setTextAlign('right').run()} title="Aligner à droite">
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

      <Divider />

      {/* Indentation */}
      <Btn onClick={() => e.sinkListItem('listItem').run()} title="Augmenter l'indentation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="13 8 17 12 13 16"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="21" y1="6" x2="21" y2="18"/></svg>
      </Btn>
      <Btn onClick={() => e.liftListItem('listItem').run()} title="Diminuer l'indentation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="11 8 7 12 11 16"/><line x1="7" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3" y2="18"/></svg>
      </Btn>
    </div>
  )
}
