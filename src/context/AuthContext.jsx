import { createContext, useContext, useState, useCallback } from 'react'
import { createSupabaseClient } from '../lib/supabase'

const AuthContext = createContext(null)

const PIN_HASH = import.meta.env.VITE_PIN_HASH

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const [sb, setSb] = useState(null)
  const [unlocked, setUnlocked] = useState(false)

  const verify = useCallback(async (pin) => {
    const hash = await sha256(pin)
    if (hash !== PIN_HASH) return false

    setSb(createSupabaseClient())
    setUnlocked(true)
    return true
  }, [])

  return (
    <AuthContext.Provider value={{ sb, unlocked, verify }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
