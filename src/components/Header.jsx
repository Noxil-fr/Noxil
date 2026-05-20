import { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem('noxil-theme') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('noxil-theme', next)
    setTheme(next)
  }

  return (
    <header>
      <span className="logo">Noxil.</span>
      <button className="theme-btn" onClick={toggle}>
        {theme === 'light' ? 'Sombre' : 'Clair'}
      </button>
    </header>
  )
}
