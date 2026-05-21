export default function ProjectGrid({ projects }) {
  if (!projects.length) return null
  return (
    <div className="grid grid-cols-2 gap-5">
      {projects.map(p => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center justify-between gap-3 bg-nox-surface border border-nox-border rounded-lg px-4 py-2.5 no-underline text-nox-text transition-[border-color,box-shadow] duration-150 hover:shadow-[0_0_0_1px_var(--tile-color)]"
          style={{ '--tile-color': p.color, borderColor: 'var(--border)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div>
            <div className="text-xl font-semibold" style={{ fontFamily: "'Century Gothic', sans-serif" }}>{p.name}</div>
            <div className="text-[13px] text-nox-muted">{p.url.replace('https://', '')}</div>
          </div>
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: p.color }}
          />
        </a>
      ))}
    </div>
  )
}
