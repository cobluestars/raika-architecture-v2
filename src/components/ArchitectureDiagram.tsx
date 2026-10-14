import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  CANVAS,
  CATEGORIES,
  CLUSTERS,
  EDGES,
  EDGE_COLORS,
  NODES,
  type ArchEdge,
  type ArchNode,
} from '../data/architecture';

const DEFAULT_W = 260;
const DEFAULT_H = 96;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3;

const nodeW = (n: ArchNode) => n.width ?? DEFAULT_W;
const nodeH = (n: ArchNode) => n.height ?? DEFAULT_H;

interface EdgeGeometry {
  path: string;
  labelX: number;
  labelY: number;
}

// 두 노드의 가까운 변을 잇는 3차 베지어. 양방향 간선은 서로 겹치지 않게 offset 을 준다.
function edgeGeometry(src: ArchNode, dst: ArchNode, offset: number): EdgeGeometry {
  const dx = dst.x - src.x;
  const dy = dst.y - src.y;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  let sx: number, sy: number, tx: number, ty: number;
  if (horizontal) {
    sx = src.x + (dx > 0 ? nodeW(src) / 2 : -nodeW(src) / 2);
    sy = src.y + offset;
    tx = dst.x + (dx > 0 ? -nodeW(dst) / 2 : nodeW(dst) / 2);
    ty = dst.y + offset;
    const mx = (sx + tx) / 2;
    return {
      path: `M ${sx},${sy} C ${mx},${sy} ${mx},${ty} ${tx},${ty}`,
      labelX: mx,
      labelY: (sy + ty) / 2 + (offset !== 0 ? offset : 0),
    };
  }
  sx = src.x + offset;
  sy = src.y + (dy > 0 ? nodeH(src) / 2 : -nodeH(src) / 2);
  tx = dst.x + offset;
  ty = dst.y + (dy > 0 ? -nodeH(dst) / 2 : nodeH(dst) / 2);
  const my = (sy + ty) / 2;
  return {
    path: `M ${sx},${sy} C ${sx},${my} ${tx},${my} ${tx},${ty}`,
    labelX: (sx + tx) / 2 + offset * 2,
    labelY: my,
  };
}

// 경유점 폴리라인을 모서리를 둥글린 path 로. 라벨은 가장 긴 구간의 가운데.
function routeGeometry(points: [number, number][]): EdgeGeometry {
  const r = 14;
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    const ax = cx - ((cx - px) / inLen) * rr;
    const ay = cy - ((cy - py) / inLen) * rr;
    const bx = cx + ((nx - cx) / outLen) * rr;
    const by = cy + ((ny - cy) / outLen) * rr;
    d += ` L ${ax},${ay} Q ${cx},${cy} ${bx},${by}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last[0]},${last[1]}`;
  let best = 0;
  let labelX = points[0][0];
  let labelY = points[0][1];
  for (let i = 1; i < points.length; i++) {
    const len = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    if (len > best) {
      best = len;
      labelX = (points[i][0] + points[i - 1][0]) / 2;
      labelY = (points[i][1] + points[i - 1][1]) / 2;
    }
  }
  return { path: d, labelX, labelY };
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function ArchitectureDiagram({ selectedId, onSelect }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: CANVAS.width / 2, y: CANVAS.height / 2 });
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  // pointerup 이 click 보다 먼저 오므로, 드래그 직후의 click 을 무시하기 위한 표시
  const justDragged = useRef(false);

  const nodeById = useMemo(() => new Map(NODES.map((n) => [n.id, n])), []);

  const bidirectional = useMemo(() => {
    const keys = new Set(EDGES.map((e) => `${e.source}->${e.target}`));
    return new Set(EDGES.filter((e) => keys.has(`${e.target}->${e.source}`)).map((e) => e.id));
  }, []);

  const geometry = useMemo(() => {
    const out = new Map<string, EdgeGeometry>();
    EDGES.forEach((e) => {
      const s = nodeById.get(e.source);
      const t = nodeById.get(e.target);
      if (!s || !t) return;
      if (e.route) {
        out.set(e.id, routeGeometry(e.route));
        return;
      }
      const offset = bidirectional.has(e.id) ? (e.source < e.target ? -14 : 14) : 0;
      out.set(e.id, edgeGeometry(s, t, offset));
    });
    return out;
  }, [nodeById, bidirectional]);

  const activeId = hoverId ?? selectedId;
  const activeEdges = useMemo(() => {
    if (!activeId) return null;
    return new Set(EDGES.filter((e) => e.source === activeId || e.target === activeId).map((e) => e.id));
  }, [activeId]);
  const activeNeighbors = useMemo(() => {
    if (!activeId) return null;
    const s = new Set<string>([activeId]);
    EDGES.forEach((e) => {
      if (e.source === activeId) s.add(e.target);
      if (e.target === activeId) s.add(e.source);
    });
    return s;
  }, [activeId]);

  const viewW = CANVAS.width / zoom;
  const viewH = CANVAS.height / zoom;
  const viewBox = `${center.x - viewW / 2} ${center.y - viewH / 2} ${viewW} ${viewH}`;

  const clampCenter = useCallback(
    (c: { x: number; y: number }, z: number) => {
      const w = CANVAS.width / z;
      const h = CANVAS.height / z;
      const minX = Math.min(w / 2, CANVAS.width - w / 2);
      const maxX = Math.max(w / 2, CANVAS.width - w / 2);
      const minY = Math.min(h / 2, CANVAS.height - h / 2);
      const maxY = Math.max(h / 2, CANVAS.height - h / 2);
      return {
        x: Math.min(maxX, Math.max(minX, c.x)),
        y: Math.min(maxY, Math.max(minY, c.y)),
      };
    },
    [],
  );

  const applyZoom = useCallback(
    (next: number) => {
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(next * 100) / 100));
      setZoom(z);
      setCenter((c) => clampCenter(c, z));
    },
    [clampCenter],
  );

  // Ctrl/⌘ + 휠로만 확대해 페이지 스크롤을 빼앗지 않는다.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      setZoom((z) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * (ev.deltaY < 0 ? 1.1 : 1 / 1.1)));
        setCenter((c) => clampCenter(c, next));
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clampCenter]);

  const onPointerDown = (ev: ReactPointerEvent<SVGSVGElement>) => {
    if (ev.button !== 0) return;
    drag.current = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, moved: false };
  };

  const onPointerMove = (ev: ReactPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const el = svgRef.current;
    if (!d || d.id !== ev.pointerId || !el) return;
    const dxPx = ev.clientX - d.x;
    const dyPx = ev.clientY - d.y;
    if (!d.moved && Math.hypot(dxPx, dyPx) < 4) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(ev.pointerId);
    }
    const rect = el.getBoundingClientRect();
    // preserveAspectRatio=meet: 실제 배율은 두 축 중 작은 쪽
    const scale = Math.max(viewW / rect.width, viewH / rect.height);
    d.x = ev.clientX;
    d.y = ev.clientY;
    setCenter((c) => clampCenter({ x: c.x - dxPx * scale, y: c.y - dyPx * scale }, zoom));
  };

  const endDrag = (ev: ReactPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.id !== ev.pointerId) return;
    const el = svgRef.current;
    if (d.moved && el?.hasPointerCapture(ev.pointerId)) el.releasePointerCapture(ev.pointerId);
    if (d.moved) {
      justDragged.current = true;
      window.setTimeout(() => (justDragged.current = false), 0);
    }
    // 빈 곳을 클릭(드래그 아님)하면 선택 해제
    if (!d.moved && !(ev.target as Element).closest('.node')) onSelect(null);
    drag.current = null;
    setDragging(false);
  };

  const onNodeClick = (id: string) => {
    if (justDragged.current) return;
    onSelect(selectedId === id ? null : id);
  };

  // 라벨은 노드를 가리키거나 선택했을 때 연결된 간선에만 보인다 (기본 화면을 깨끗하게)
  const edgeVisible = (e: ArchEdge) => !!activeEdges && activeEdges.has(e.id);

  return (
    <div className="diagram-shell">
      <div className="diagram-toolbar">
        <div className="zoom-controls" role="group" aria-label="확대 / 축소">
          <button type="button" className="icon-btn" onClick={() => applyZoom(zoom - 0.2)} aria-label="축소">
            −
          </button>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            value={zoom}
            onChange={(e) => applyZoom(parseFloat(e.target.value))}
            aria-label="줌 레벨"
          />
          <button type="button" className="icon-btn" onClick={() => applyZoom(zoom + 0.2)} aria-label="확대">
            +
          </button>
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              setZoom(1);
              setCenter({ x: CANVAS.width / 2, y: CANVAS.height / 2 });
            }}
          >
            리셋
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        </div>
        <div className="legend" aria-label="범례">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <span key={key} className="legend-item">
              <span className="legend-swatch" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
        <p className="diagram-hint">노드에 마우스를 올리면 흐름 표시 · 누르면 상세 설명 · 드래그 이동 · Ctrl/⌘ + 휠 확대</p>
      </div>

      <div className="diagram-canvas">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Raika v2 시스템 아키텍처 다이어그램"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={dragging ? 'grabbing' : undefined}
        >
          <defs>
            {Object.entries(EDGE_COLORS).map(([kind, color]) => (
              <marker
                key={kind}
                id={`arrow-${kind}`}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="2.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L6,2.5 L0,5 Z" fill={color} />
              </marker>
            ))}
          </defs>

          {CLUSTERS.map((c) => (
            <g key={c.id} className="cluster">
              <rect x={c.x} y={c.y} width={c.width} height={c.height} rx={24} ry={24} />
              <text x={c.x + 22} y={c.y + 36} className="cluster-title">
                {c.title}
              </text>
              <text x={c.x + 22} y={c.y + 58} className="cluster-subtitle">
                {c.description}
              </text>
            </g>
          ))}

          {EDGES.map((e) => {
            const g = geometry.get(e.id);
            if (!g) return null;
            const highlighted = activeEdges?.has(e.id) ?? false;
            const dimmed = !!activeEdges && !highlighted;
            return (
              <path
                key={e.id}
                d={g.path}
                className={`edge${highlighted ? ' highlighted' : ''}${dimmed ? ' dimmed' : ''}`}
                stroke={EDGE_COLORS[e.kind]}
                markerEnd={`url(#arrow-${e.kind})`}
              />
            );
          })}

          {NODES.map((n) => {
            const w = nodeW(n);
            const h = nodeH(n);
            const color = CATEGORIES[n.category].color;
            const dimmed = !!activeNeighbors && !activeNeighbors.has(n.id);
            const selected = selectedId === n.id;
            return (
              <g
                key={n.id}
                className={`node${dimmed ? ' dimmed' : ''}${selected ? ' selected' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`${n.title} — ${n.subtitle}`}
                aria-pressed={selected}
                onPointerEnter={(ev) => ev.pointerType === 'mouse' && setHoverId(n.id)}
                onPointerLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(n.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => onNodeClick(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    onSelect(selectedId === n.id ? null : n.id);
                  }
                }}
              >
                <rect
                  x={n.x - w / 2}
                  y={n.y - h / 2}
                  width={w}
                  height={h}
                  rx={18}
                  ry={18}
                  className="node-box"
                  stroke={color}
                />
                <rect x={n.x - w / 2 + 16} y={n.y - h / 2 + 14} width={26} height={4} rx={2} fill={color} />
                <text x={n.x} y={n.y - 4} className="node-title">
                  {n.title}
                </text>
                <text x={n.x} y={n.y + 20} className="node-subtitle">
                  {n.subtitle}
                </text>
              </g>
            );
          })}

          {/* 라벨은 노드 위에 그려 가려지지 않게 한다 */}
          {EDGES.map((e) => {
            const g = geometry.get(e.id);
            if (!g || !edgeVisible(e)) return null;
            const highlighted = activeEdges?.has(e.id) ?? false;
            return (
              <text
                key={`l-${e.id}`}
                x={g.labelX}
                y={g.labelY - 6}
                className={`edge-label${highlighted ? ' highlighted' : ''}`}
              >
                {e.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
