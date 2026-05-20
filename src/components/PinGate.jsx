import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PinGate() {
  const { verify } = useAuth()
  const [error, setError] = useState('')
  const inputsRef = useRef([])

  const handleInput = async (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    e.target.value = val
    if (val && i < 5) inputsRef.current[i + 1].focus()

    const all = inputsRef.current.map(el => el.value)
    if (all.every(v => v)) {
      const pin = all.join('')
      setError('Connexion…')
      const ok = await verify(pin)
      if (!ok) {
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
    <div className="lock-screen">
      <p className="lock-label">Code d'accès</p>
      <div className="code-inputs">
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
      <p className="code-error">{error}</p>
    </div>
  )
}
