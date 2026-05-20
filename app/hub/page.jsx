'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
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
      </main>
    </div>
  )
}
