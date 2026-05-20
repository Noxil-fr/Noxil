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
      <span
        className="text-4xl font-bold text-nox-text tracking-tight"
        style={{ fontFamily: "'Century Gothic', 'AppleGothic', 'Trebuchet MS', sans-serif" }}
      >
        Noxil.
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
