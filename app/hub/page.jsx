'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ContactList from '@/components/ContactList'
import ProjectGrid from '@/components/ProjectGrid'
import Notes from '@/components/Notes'

export default function HubPage() {
  const [contacts, setContacts] = useState([])
  const [projects, setProjects] = useState([])
  const [notes, setNotes]     = useState([])
  const sb = getSupabase()

  useEffect(() => {
    Promise.all([
      sb.from('projects').select('*').order('ord'),
      sb.from('contacts').select('*').order('ord'),
      sb.from('notes').select('*').order('created_at', { ascending: false }),
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
          <Notes sb={sb} notes={notes} setNotes={setNotes} />
        </div>
      </main>
    </div>
  )
}
