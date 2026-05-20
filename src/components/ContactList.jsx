import { useState } from 'react'

function ContactCard({ contact }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(contact.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="contact-card">
      <div>
        <div className="contact-name">{contact.name}</div>
        <div className="contact-phone">{contact.phone}</div>
      </div>
      <button className="copy-btn" onClick={copy}>
        {copied ? 'Copié ✓' : 'Copier'}
      </button>
    </div>
  )
}

export default function ContactList({ contacts }) {
  if (!contacts.length) return null
  return (
    <div className="contact-list">
      {contacts.map(c => <ContactCard key={c.id} contact={c} />)}
    </div>
  )
}
