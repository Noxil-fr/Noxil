'use client'

import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-nox-surface border-b border-nox-border shrink-0">
      <span className="text-lg font-bold text-nox-text" style={{ fontFamily: "'Century Gothic', sans-serif" }}>Jarvis</span>
      <Link href="/hub" className="text-xs text-nox-muted hover:text-nox-text transition-colors">← Hub</Link>
    </div>
  )
}
