import { CATEGORIES, CLUSTERS, NODES } from '../data/architecture';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

// 다이어그램의 대체 보기. 좁은 화면과 키보드·스크린리더 사용자를 위한 목록.
export default function ComponentList({ selectedId, onSelect }: Props) {
  return (
    <div className="component-list">
      {CLUSTERS.map((c) => (
        <section key={c.id} className="component-group">
          <header>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
          </header>
          <div className="component-grid">
            {NODES.filter((n) => n.cluster === c.id).map((n) => (
              <button
                key={n.id}
                type="button"
                className={`component-card${selectedId === n.id ? ' selected' : ''}`}
                style={{ borderColor: selectedId === n.id ? CATEGORIES[n.category].color : undefined }}
                onClick={() => onSelect(selectedId === n.id ? null : n.id)}
                aria-pressed={selectedId === n.id}
              >
                <span className="component-dot" style={{ background: CATEGORIES[n.category].color }} />
                <span className="component-title">{n.title}</span>
                <span className="component-sub">{n.subtitle}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
