'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import NoteEditor from './NoteEditor'

export default function NotesLayout() {
  const [sb, setSb] = useState(null)
  const [notebooks, setNotebooks] = useState([])
  const [selectedNotebook, setSelectedNotebook] = useState(null)
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState(null)
  const [isRenaming, setIsRenaming] = useState(false)

  useEffect(() => { setSb(getSupabase()) }, [])

  // Load notebooks
  useEffect(() => {
    if (!sb) return
    sb.from('notebooks').select('*').order('position').then(({ data }) => {
      setNotebooks(data || [])
      if (data?.length) setSelectedNotebook(data[0])
    })
  }, [sb])

  // Load sections when notebook changes
  useEffect(() => {
    if (!sb || !selectedNotebook) return
    setSections([])
    setSelectedSection(null)
    setPages([])
    setSelectedPage(null)
    sb.from('sections')
      .select('*')
      .eq('notebook_id', selectedNotebook.id)
      .order('position')
      .then(({ data }) => {
        setSections(data || [])
        if (data?.length) setSelectedSection(data[0])
      })
  }, [sb, selectedNotebook?.id])

  // Load pages when section changes
  useEffect(() => {
    if (!sb || !selectedSection) return
    setPages([])
    setSelectedPage(null)
    sb.from('pages')
      .select('*')
      .eq('section_id', selectedSection.id)
      .eq('is_deleted', false)
      .order('position')
      .then(({ data }) => {
        setPages(data || [])
        setSelectedPage(data?.[0] ?? null)
      })
  }, [sb, selectedSection?.id])

  const createNotebook = async () => {
    const { data, error } = await sb.from('notebooks')
      .insert({ name: 'Nouveau carnet', position: notebooks.length })
      .select().single()
    if (error || !data) { console.error('createNotebook:', error?.message); return }
    setNotebooks(prev => [...prev, data])
    setSelectedNotebook(data)
  }

  const renameNotebook = async (id, name) => {
    await sb.from('notebooks').update({ name }).eq('id', id)
    setNotebooks(prev => prev.map(n => n.id === id ? { ...n, name } : n))
    if (selectedNotebook?.id === id) setSelectedNotebook(prev => ({ ...prev, name }))
  }

  const createSection = async () => {
    if (!selectedNotebook) return
    const { data, error } = await sb.from('sections')
      .insert({ notebook_id: selectedNotebook.id, name: 'Nouvelle section', position: sections.length })
      .select().single()
    if (error || !data) { console.error('createSection:', error?.message); return }
    setSections(prev => [...prev, data])
    setSelectedSection(data)
  }

  const renameSection = async (id, name) => {
    await sb.from('sections').update({ name }).eq('id', id)
    setSections(prev => prev.map(s => s.id === id ? { ...s, name } : s))
    if (selectedSection?.id === id) setSelectedSection(prev => ({ ...prev, name }))
  }

  const createPage = async () => {
    if (!selectedSection) return
    const { data, error } = await sb.from('pages')
      .insert({ section_id: selectedSection.id, title: 'Sans titre', content: {}, position: pages.length })
      .select().single()
    if (error || !data) { console.error('createPage:', error?.message); return }
    setPages(prev => [...prev, data])
    setSelectedPage(data)
  }

  const savePage = async (pageId, updates) => {
    const { error } = await sb.from('pages').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', pageId)
    if (error) { console.error('savePage:', error?.message); return }
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p))
    if (selectedPage?.id === pageId) setSelectedPage(prev => ({ ...prev, ...updates }))
  }

  const deletePage = async (pageId) => {
    await sb.from('pages').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', pageId)
    const remaining = pages.filter(p => p.id !== pageId)
    setPages(remaining)
    if (selectedPage?.id === pageId) setSelectedPage(remaining[0] ?? null)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-nox-bg">
      <TopBar
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        sections={sections}
        selectedSection={selectedSection}
        onSelectNotebook={setSelectedNotebook}
        onCreateNotebook={createNotebook}
        onSelectSection={setSelectedSection}
        onCreateSection={createSection}
        onRenameSection={renameSection}
        onRenameStart={() => setIsRenaming(true)}
        onRenameEnd={() => setIsRenaming(false)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          pages={pages}
          selectedPage={selectedPage}
          selectedSection={selectedSection}
          onSelectPage={setSelectedPage}
          onCreatePage={createPage}
          onRenamePage={(id, title) => savePage(id, { title })}
          onDeletePage={deletePage}
          onRenameStart={() => setIsRenaming(true)}
          onRenameEnd={() => setIsRenaming(false)}
        />
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedPage
            ? <NoteEditor key={selectedPage.id} page={selectedPage} onSave={savePage} editorDisabled={isRenaming} />
            : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-nox-muted">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <p className="text-sm">{selectedSection ? 'Sélectionne ou crée une page' : 'Sélectionne une section'}</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
