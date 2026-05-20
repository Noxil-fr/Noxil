import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import PinGate from './components/PinGate'
import ContactList from './components/ContactList'
import ProjectGrid from './components/ProjectGrid'
import Notes from './components/Notes'

function Main() {
  const { sb, unlocked } = useAuth()
  const [contacts, setContacts] = useState([])
  const [projects, setProjects] = useState([])
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!unlocked || !sb) return
    Promise.all([
      sb.from('projects').select('*').order('ord'),
      sb.from('contacts').select('*').order('ord'),
      sb.from('notes').select('*').order('created_at', { ascending: false }),
    ]).then(([{ data: p }, { data: c }, { data: n }]) => {
      setProjects(p || [])
      setContacts(c || [])
      setNotes(n || [])
    })
  }, [unlocked, sb])

  if (!unlocked) return <PinGate />

  return (
    <main>
      <ContactList contacts={contacts} />
      <div className="with-divider">
        <ProjectGrid projects={projects} />
      </div>
      <div className="with-divider">
        <Notes sb={sb} notes={notes} setNotes={setNotes} />
      </div>
    </main>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Header />
        <Main />
      </div>
    </AuthProvider>
  )
}
