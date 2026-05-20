'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PinGate() {
  const router = useRouter()
  const [error, setError] = useState('')
  const inputsRef = useRef([])

  const handleInput = async (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    e.target.value = val
    if (val && i < 5) inputsRef.current[i + 1].focus()

    const all = inputsRef.current.map(el => el.value)
    if (all.every(v => v)) {
      setError('Connexion…')
      const hash = await sha256(all.join(''))
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      })
      if (res.ok) {
        router.push('/hub')
      } else {
        setError('Code incorrect.')
        inputsRef.current.forEach(el => (el.value = ''))
        inputsRef.current[0].focus()
      }
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) {
      inputsRef.current[i - 1].focus()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <p className="text-sm text-nox-muted mb-4">Code d'accès</p>
      <div className="flex gap-2.5 mb-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={el => (inputsRef.current[i] = el)}
            className="digit"
            type="password"
            inputMode="numeric"
            maxLength={1}
            autoComplete="off"
            autoFocus={i === 0}
            onInput={e => handleInput(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
      <p className="text-sm text-danger min-h-5 text-center">{error}</p>
    </div>
  )
}
