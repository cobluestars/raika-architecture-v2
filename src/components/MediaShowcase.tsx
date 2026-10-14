import { useEffect, useState } from 'react';
import { MEDIA_ITEMS, type MediaItem } from '../data/media';

type Open =
  | { kind: 'image'; src: string; name: string }
  | { kind: 'video'; src: string; name: string }
  | { kind: 'gallery'; images: string[]; index: number; name: string };

function Placeholder({ item }: { item: MediaItem }) {
  const icon = item.type === 'video' ? '▶' : item.type === 'gallery' ? '▦' : '◩';
  return (
    <div className="media-placeholder" aria-hidden="true">
      <span className="placeholder-icon">{icon}</span>
      <span className="placeholder-text">준비 중</span>
    </div>
  );
}

function Thumb({ item }: { item: MediaItem }) {
  if (item.placeholder) return <Placeholder item={item} />;
  if (item.type === 'image' && item.src) return <img src={item.src} alt={item.name} loading="lazy" />;
  if (item.type === 'video' && item.src)
    return (
      <div className="video-thumb">
        <video src={item.src} poster={item.poster} muted preload="metadata" />
        <span className="play-icon">▶</span>
      </div>
    );
  if (item.type === 'gallery' && item.images.length > 0)
    return (
      <div className="gallery-thumb">
        <img src={item.images[0]} alt={item.name} loading="lazy" />
      </div>
    );
  return <Placeholder item={item} />;
}

export default function MediaShowcase() {
  const [open, setOpen] = useState<Open | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (open.kind === 'gallery' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const n = open.images.length;
        const step = e.key === 'ArrowRight' ? 1 : -1;
        setOpen({ ...open, index: (open.index + step + n) % n });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const openItem = (item: MediaItem) => {
    if (item.placeholder) return;
    if (item.type === 'image' && item.src) setOpen({ kind: 'image', src: item.src, name: item.name });
    else if (item.type === 'video' && item.src) setOpen({ kind: 'video', src: item.src, name: item.name });
    else if (item.type === 'gallery' && item.images.length)
      setOpen({ kind: 'gallery', images: item.images, index: 0, name: item.name });
  };

  return (
    <>
      <div className="media-grid">
        {MEDIA_ITEMS.map((item) => {
          const count = item.type === 'gallery' ? item.images.length || item.count || 0 : 0;
          return (
            <button
              key={item.name}
              type="button"
              className={`media-card${item.placeholder ? ' is-placeholder' : ''}`}
              onClick={() => openItem(item)}
              disabled={item.placeholder}
              aria-label={item.placeholder ? `${item.name} (준비 중)` : item.name}
            >
              <div className="media-frame">
                <Thumb item={item} />
                {item.type === 'gallery' && count > 0 && <span className="media-badge">{count}장</span>}
                {item.type === 'video' && <span className="media-badge">영상</span>}
              </div>
              <span className="media-name">{item.name}</span>
              {item.description && <span className="media-desc">{item.description}</span>}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="media-modal" role="dialog" aria-modal="true" aria-label={open.name} onClick={() => setOpen(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setOpen(null)} aria-label="닫기">
              ✕
            </button>
            {open.kind === 'image' && <img src={open.src} alt={open.name} />}
            {open.kind === 'video' && <video src={open.src} controls autoPlay />}
            {open.kind === 'gallery' && (
              <>
                <img src={open.images[open.index]} alt={`${open.name} ${open.index + 1}`} />
                <div className="gallery-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setOpen({ ...open, index: (open.index - 1 + open.images.length) % open.images.length })
                    }
                    aria-label="이전"
                  >
                    ‹
                  </button>
                  <span>
                    {open.index + 1} / {open.images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen({ ...open, index: (open.index + 1) % open.images.length })}
                    aria-label="다음"
                  >
                    ›
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
