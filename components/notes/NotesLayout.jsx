'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import Sidebar from './Sidebar'
import NoteEditor from './NoteEditor'

export default function NotesLayout() {
  const [sb, setSb] = useState(null)
  const [notebooks, setNotebooks] = useState([])
  const [selectedNotebook, setSelectedNotebook] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState(null)

  useEffect(() => { setSb(getSupabase()) }, [])

  useEffect(() => {
    if (!sb) return
    sb.from('notebooks').select('*').order('position').then(({ data }) => {
      setNotebooks(data || [])
      if (data?.length) setSelectedNotebook(data[0])
    })
  }, [sb])

  useEffect(() => {
    if (!sb || !selectedNotebook) return
    sb.from('pages')
      .select('*')
      .eq('notebook_id', selectedNotebook.id)
      .eq('is_deleted', false)
      .is('parent_id', null)
      .order('position')
      .then(({ data }) => {
        setPages(data || [])
        setSelectedPage(data?.[0] ?? null)
      })
  }, [sb, selectedNotebook?.id])

  const createNotebook = async () => {
    const { data, error } = await sb.from('notebooks')
      .insert({ name: 'Nouveau carnet', position: notebooks.length })
      .select().single()
    if (error || !data) { console.error('createNotebook:', error); return }
    setNotebooks(prev => [...prev, data])
    setSelectedNotebook(data)
    setPages([])
    setSelectedPage(null)
  }

  const renameNotebook = async (id, name) => {
    await sb.from('notebooks').update({ name }).eq('id', id)
    setNotebooks(prev => prev.map(n => n.id === id ? { ...n, name } : n))
    if (selectedNotebook?.id === id) setSelectedNotebook(prev => ({ ...prev, name }))
  }

  const createPage = async () => {
    if (!selectedNotebook) return
    const { data, error } = await sb.from('pages')
      .insert({ notebook_id: selectedNotebook.id, title: 'Sans titre', content: {}, position: pages.length })
      .select().single()
    if (error || !data) { console.error('createPage:', error); return }
    setPages(prev => [...prev, data])
    setSelectedPage(data)
  }

  const savePage = async (pageId, updates) => {
    await sb.from('pages').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', pageId)
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
    <div className="flex h-screen overflow-hidden bg-nox-bg">
      <Sidebar
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        pages={pages}
        selectedPage={selectedPage}
        onSelectNotebook={setSelectedNotebook}
        onSelectPage={setSelectedPage}
        onCreateNotebook={createNotebook}
        onCreatePage={createPage}
        onRenameNotebook={renameNotebook}
        onDeletePage={deletePage}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedPage
          ? <NoteEditor key={selectedPage.id} page={selectedPage} onSave={savePage} />
          : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-nox-muted">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              <p className="text-sm">Sélectionne ou crée une page</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
