'use client'

import { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('noxil-theme') || 'dark'
    setTheme(saved)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('noxil-theme', next)
    document.documentElement.classList.toggle('light', next === 'light')
    setTheme(next)
  }

  return (
    <header className="flex items-center justify-between py-7 border-b border-nox-border">
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '1px' }}>
        <span style={{
          fontWeight: 700,
          fontSize: '2.25rem',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(90deg, #7b9fff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Noxil</span>
        <span style={{
          fontWeight: 700,
          fontSize: '2.25rem',
          letterSpacing: '-0.03em',
          color: '#4f6aff',
        }}>.</span>
      </span>
      <button
        onClick={toggle}
        className="text-nox-muted text-[15px] bg-transparent border-none cursor-pointer hover:text-nox-text transition-colors"
      >
        {theme === 'light' ? 'Sombre' : 'Clair'}
      </button>
    </header>
  )
}
