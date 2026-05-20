export default function ProjectGrid({ projects }) {
  if (!projects.length) return null
  return (
    <div className="grid">
      {projects.map(p => (
        <a
          key={p.id}
          className="tile"
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--tile-color': p.color }}
        >
          <div>
            <div className="tile-name">{p.name}</div>
            <div className="tile-url">{p.url.replace('https://', '')}</div>
          </div>
          <span className="tile-dot" />
        </a>
      ))}
    </div>
  )
}
