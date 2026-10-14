import { CATEGORIES, CLUSTERS, EDGES, NODES, type ArchNode } from '../data/architecture';

interface Props {
  node: ArchNode | null;
  onSelect: (id: string | null) => void;
  variant: 'drawer' | 'inline';
}

const titleOf = (id: string) => NODES.find((n) => n.id === id)?.title ?? id;

export default function NodeDetail({ node, onSelect, variant }: Props) {
  if (!node) return null;

  const cat = CATEGORIES[node.category];
  const cluster = CLUSTERS.find((c) => c.id === node.cluster);
  const outgoing = EDGES.filter((e) => e.source === node.id);
  const incoming = EDGES.filter((e) => e.target === node.id);

  return (
    <aside className={`node-detail ${variant}`} aria-live="polite" aria-label={`${node.title} 상세`}>
      <div className="detail-head">
        <p className="detail-kicker" style={{ color: cat.color }}>
          {cat.label} · {cluster?.title}
        </p>
        <button type="button" className="text-btn" onClick={() => onSelect(null)} aria-label="선택 해제">
          닫기
        </button>
      </div>
      <h3>{node.title}</h3>
      <p className="detail-subtitle">{node.subtitle}</p>
      <p className="detail-summary">{node.summary}</p>
      <ul className="detail-points">
        {node.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="tag-row">
        {node.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      {(incoming.length > 0 || outgoing.length > 0) && (
        <div className="detail-links">
          {incoming.length > 0 && (
            <div>
              <p className="detail-links-title">들어오는 흐름</p>
              {incoming.map((e) => (
                <button key={e.id} type="button" className="link-chip" onClick={() => onSelect(e.source)}>
                  ← {titleOf(e.source)} <span>{e.label}</span>
                </button>
              ))}
            </div>
          )}
          {outgoing.length > 0 && (
            <div>
              <p className="detail-links-title">나가는 흐름</p>
              {outgoing.map((e) => (
                <button key={e.id} type="button" className="link-chip" onClick={() => onSelect(e.target)}>
                  → {titleOf(e.target)} <span>{e.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {node.source && <p className="detail-source">source · {node.source}</p>}
    </aside>
  );
}
