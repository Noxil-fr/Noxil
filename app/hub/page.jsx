'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import ContactList from '@/components/ContactList'
import ProjectGrid from '@/components/ProjectGrid'
import Notes from '@/components/Notes'

export default function HubPage() {
  const [sb, setSb]           = useState(null)
  const [contacts, setContacts] = useState([])
  const [projects, setProjects] = useState([])
  const [notes, setNotes]       = useState([])

  useEffect(() => {
    const client = getSupabase()
    setSb(client)
    Promise.all([
      client.from('projects').select('*').order('ord'),
      client.from('contacts').select('*').order('ord'),
      client.from('notes').select('*').order('created_at', { ascending: false }),
    ]).then(([{ data: p }, { data: c }, { data: n }]) => {
      setProjects(p || [])
      setContacts(c || [])
      setNotes(n || [])
    })
  }, [])

  return (
    <div className="max-w-[720px] mx-auto px-10">
      <Header />
      <main className="py-8 flex flex-col gap-9">
        <ContactList contacts={contacts} />
        <div className="section-divider">
          <ProjectGrid projects={projects} />
        </div>
        <div className="section-divider">
          {sb && <Notes sb={sb} notes={notes} setNotes={setNotes} />}
        </div>
        <div className="section-divider">
          <div className="grid grid-cols-2 gap-5">
            <Link
              href="/notes"
              className="flex flex-row items-center justify-between gap-3 bg-nox-surface border border-nox-border rounded-lg px-4 py-2.5 no-underline text-nox-text transition-[border-color,box-shadow] duration-150"
              style={{ '--tile-color': '#a78bfa' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a78bfa'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div>
                <div className="text-xl font-semibold" style={{ fontFamily: "'Century Gothic', sans-serif" }}>Jarvis.</div>
                <div className="text-[13px] text-nox-muted">Carnets & pages</div>
              </div>
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#a78bfa' }} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
