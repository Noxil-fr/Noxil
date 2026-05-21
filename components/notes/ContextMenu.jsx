'use client'

import { useEffect, useRef } from 'react'

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const closeEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', closeEsc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', closeEsc)
    }
  }, [onClose])

  // Adjust position so menu doesn't go off-screen
  const style = {
    left: Math.min(x, window.innerWidth - 180),
    top: Math.min(y, window.innerHeight - items.length * 40 - 16),
  }

  return (
    <div
      ref={ref}
      className="fixed z-[200] bg-nox-surface border border-nox-border rounded-xl shadow-2xl py-1 min-w-44"
      style={style}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="h-px bg-nox-border mx-2 my-1" />
        ) : (
          <button
            key={i}
            onClick={() => { item.action(); onClose() }}
            className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
              item.danger ? 'text-red-400 hover:text-red-300' : 'text-nox-text'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </div>
  )
}
