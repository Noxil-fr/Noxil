'use client'

import { useState } from 'react'

function ContactCard({ contact }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(contact.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3.5 bg-nox-surface border border-nox-border rounded-lg px-4 py-2.5">
      <div>
        <div className="text-xs text-nox-muted mb-0.5">{contact.name}</div>
        <div className="text-sm font-medium tracking-wide">{contact.phone}</div>
      </div>
      <button
        onClick={copy}
        className="ml-auto bg-transparent border border-nox-border rounded-md text-nox-muted text-[13px] px-3.5 py-1.5 cursor-pointer whitespace-nowrap shrink-0 hover:text-nox-text hover:border-nox-muted transition-colors"
      >
        {copied ? 'Copié ✓' : 'Copier'}
      </button>
    </div>
  )
}

export default function ContactList({ contacts }) {
  if (!contacts.length) return null
  return (
    <div className="flex flex-row flex-wrap gap-2.5">
      {contacts.map(c => <ContactCard key={c.id} contact={c} />)}
    </div>
  )
}
