import { useEffect, useState } from 'react';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import ComponentList from './components/ComponentList';
import MediaShowcase from './components/MediaShowcase';
import NodeDetail from './components/NodeDetail';
import { NODES } from './data/architecture';
import {
  COMPARISON,
  HERO_STATS,
  LESSONS,
  LIFECYCLE,
  MEMORY_BUDGET,
  MEMORY_TOTAL,
  MODES,
  PROFILES,
  SIDE_STACK_SAVINGS,
  TECH_STACK,
  TIMELINE,
} from './data/content';

const NAV = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'hardware', label: 'Hardware & Serving' },
  { id: 'lifecycle', label: 'Request Flow' },
  { id: 'modes', label: 'Modes' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'evolution', label: 'v1 → v2' },
  { id: 'stack', label: 'Stack' },
  { id: 'demo', label: 'Demo' },
];

type Theme = 'dark' | 'light';

function readTheme(): Theme | null {
  try {
    const t = localStorage.getItem('raika-arch-theme');
    return t === 'dark' || t === 'light' ? t : null;
  } catch {
    return null;
  }
}

function SectionHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="section-head">
      <p className="kicker">{kicker}</p>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 폰 폭에서는 다이어그램 글자가 너무 작아 목록 보기로 시작한다
  const [view, setView] = useState<'diagram' | 'list'>(() =>
    window.matchMedia('(max-width: 760px)').matches ? 'list' : 'diagram',
  );
  const [theme, setTheme] = useState<Theme | null>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    try {
      if (theme) localStorage.setItem('raika-arch-theme', theme);
    } catch {
      /* 저장소를 못 써도 화면은 그대로 동작 */
    }
  }, [theme]);

  const toggleTheme = () => {
    const current =
      theme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  const selected = NODES.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="page">
      <nav className="top-nav" aria-label="섹션 이동">
        <a href="#top" className="brand">
          Raika <span>v2</span>
        </a>
        <div className="nav-links">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </div>
        <button type="button" className="theme-btn" onClick={toggleTheme} aria-label="라이트 / 다크 테마 전환">
          ◐
        </button>
      </nav>

      <header className="hero" id="top">
        <p className="kicker">Raika the Wolfdog · System Overview v2</p>
        <h1>
          한 대의 데스크톱 AI 슈퍼컴퓨터 위에서
          <br />
          돌아가는 로컬 AI 컴패니언
        </h1>
        <p className="hero-lead">
          「Raika the Wolfdog」는 실시간 대화, 기억 회상, 웹 검색, 수학 실험, 음성 합성, 3D 아바타를 하나로 묶은 풀스택 AI
          컴패니언이다. v2 에서는 하드웨어를 <strong>ASUS Ascent GX10</strong>으로 옮기고, 메인 LLM 을{' '}
          <strong>Qwen3.8-Flash-Next (NVFP4)</strong>로 교체해 <strong>vLLM</strong> 서버로 분리했다. 외부 LLM API 없이 모든
          추론이 이 한 대에서 일어난다.
        </p>
        <div className="hero-stats">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-note">{s.note}</span>
            </div>
          ))}
        </div>
      </header>

      <main>
        <section id="architecture" className="section">
          <SectionHead
            kicker="System Architecture"
            title="현재 활성화된 구성 요소와 데이터 흐름"
            lead="비활성화되거나 더미로 남은 경로(코드 Playground, FlyPet, Activation Steering v1, 외부 LLM 위임, 별도 Vision 서버)는 제외했다."
          />
          <div className="view-toggle" role="tablist" aria-label="보기 방식">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'diagram'}
              className={view === 'diagram' ? 'active' : ''}
              onClick={() => setView('diagram')}
            >
              다이어그램
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'list'}
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              목록
            </button>
          </div>
          <div className={`architecture-layout ${view}`}>
            {view === 'diagram' ? (
              <ArchitectureDiagram selectedId={selectedId} onSelect={setSelectedId} />
            ) : (
              <ComponentList selectedId={selectedId} onSelect={setSelectedId} />
            )}
            <NodeDetail node={selected} onSelect={setSelectedId} variant={view === 'diagram' ? 'drawer' : 'inline'} />
          </div>
        </section>

        <section id="hardware" className="section">
          <SectionHead
            kicker="Hardware & Serving"
            title="128GB 통합 메모리 한 장에 125B 모델과 부수 스택 전부"
            lead="GB10 은 CPU 와 GPU 가 119.6 GiB 를 나눠 쓴다. 병목은 연산이 아니라 메모리였고, 설계의 대부분은 그 예산을 어떻게 나누느냐였다."
          />
          <div className="hw-grid">
            <article className="card">
              <h3>메모리 예산 (실측 기준)</h3>
              <div className="mem-bar" role="img" aria-label="통합 메모리 119.6GiB 중 가중치 74.9, 부수 스택 19.4, 나머지 25.3 GiB">
                {MEMORY_BUDGET.map((m) => (
                  <span
                    key={m.key}
                    className="mem-seg"
                    style={{ width: `${(m.value / MEMORY_TOTAL) * 100}%`, background: m.color }}
                  />
                ))}
              </div>
              <ul className="mem-legend">
                {MEMORY_BUDGET.map((m) => (
                  <li key={m.key}>
                    <span className="legend-swatch" style={{ background: m.color }} />
                    <span className="mem-label">{m.label}</span>
                    <span className="mem-value">{m.value.toFixed(1)} GiB</span>
                    <span className="mem-note">{m.note}</span>
                  </li>
                ))}
              </ul>
              <p className="muted small">
                CUDA 할당분은 프로세스 RSS 에 잡히지 않는다. 그래서 측정은 <code>free</code> 와{' '}
                <code>torch.cuda.mem_get_info()</code> 기준으로만 했다.
              </p>
            </article>

            <article className="card">
              <h3>PLE n-gram 테이블 — 이 모델의 핵심 난점</h3>
              <p>
                Flash-Next 에는 51.2B 파라미터짜리 n-gram 임베딩이 따로 있고, 체크포인트에서는 한 파일에{' '}
                <strong>102.4 GB (BF16)</strong>로 들어 있다. 그대로는 119.6 GiB 에 들어가지 않는다.
              </p>
              <ol className="steps-inline">
                <li>
                  <strong>양자화 사이드카</strong> — NVFP4 28.8 GB 버전을 사용
                </li>
                <li>
                  <strong>vLLM 오버레이</strong> — 사이드카를 safetensors mmap 으로 NVMe 에서 읽고 필요한 행만 역양자화
                </li>
                <li>
                  <strong>인덱스 재작성</strong> — 받지 않은 PLE 샤드를 참조하는 128개 항목을 뺀 index 사본
                </li>
              </ol>
              <p className="muted small">
                이미지 기본 구현은 핀드 호스트 RAM 을 쓰는데, 통합 메모리에서는 CPU 오프로드만으로 절약이 정확히 0 이다.
                오버레이가 필수였다.
              </p>
            </article>

            <article className="card">
              <h3>부수 스택 다이어트 · 37.0 → 19.4 GiB</h3>
              <ul className="savings">
                {SIDE_STACK_SAVINGS.map((s) => (
                  <li key={s.label}>
                    <span>{s.label}</span>
                    <strong>{s.value}</strong>
                  </li>
                ))}
              </ul>
              <p className="muted small">
                통합 메모리에서 아낀 몫은 곧 PLE 테이블의 페이지 캐시가 되고, 이 모델에서는 페이지 캐시가 곧 디코딩 속도다.
              </p>
            </article>

            <article className="card wide">
              <h3>기동 시 프로파일 자동 선택</h3>
              <p className="muted">
                속도(MTP)와 컨텍스트가 같은 KV 예산을 두고 충돌한다. 기동 시점의 CUDA 가용량을 재서 고른다.
              </p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>프로파일</th>
                      <th>선택 조건</th>
                      <th>투기적 디코딩</th>
                      <th>KV 단가</th>
                      <th>컨텍스트</th>
                      <th>디코딩</th>
                    </tr>
                  </thead>
                  <tbody>모델 교체 과정에서 기록한 버그 22개. 
                    {PROFILES.map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code>{p.name}</code>
                        </td>
                        <td>{p.when}</td>
                        <td>{p.mtp}</td>
                        <td>{p.kv}</td>
                        <td>{p.ctx}</td>
                        <td>{p.speed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="muted small">
                긴 추론(고급 코딩, 올림피아드급 문제, 가상 물리 설정 놀이)을 위해 메인 스택 컨텍스트 하한을 65,536 으로
                보장한다. 속도를 위해 기능을 깎지 않는다.
              </p>
            </article>
          </div>
        </section>

        <section id="lifecycle" className="section">
          <SectionHead
            kicker="Request Lifecycle"
            title="한 턴이 처리되는 과정"
            lead="Socket.IO 로 들어온 메시지 하나가 답변 · 음성 · 표정 · 기억이 되기까지."
          />
          <ol className="lifecycle">
            {LIFECYCLE.map((s) => (
              <li key={s.step}>
                <span className="lc-step">{s.step}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="modes" className="section">
          <SectionHead
            kicker="Experience Modes"
            title="같은 엔진, 다섯 가지 경험"
            lead="세션 ID 접두어(rc- · mp-)와 클라이언트 종류에 따라 같은 vLLM 위에서 서로 다른 파이프라인이 돈다."
          />
          <div className="mode-grid">
            {MODES.map((m) => (
              <article key={m.id} className="card mode-card">
                <h3>{m.name}</h3>
                <p className="mode-tagline">{m.tagline}</p>
                <ul>
                  {m.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="engineering" className="section">
          <SectionHead
            kicker="Engineering Notes"
            title="실제로 돌려야만 나온 버그들"
            lead="모델 교체 과정에서 기록한 버그 22개는 모두 정적 코드 리뷰로는 드러나지 않고, 실측과 실제 런타임 재현을 거쳐서야 원인이 잡혔다. 그중 교훈이 컸던 넷."
          />
          <div className="lesson-grid">
            {LESSONS.map((l) => (
              <article key={l.title} className="card lesson">
                <h3>{l.title}</h3>
                <dl>
                  <dt>증상</dt>
                  <dd>{l.symptom}</dd>
                  <dt>원인</dt>
                  <dd>{l.cause}</dd>
                  <dt>조치</dt>
                  <dd>{l.fix}</dd>
                </dl>
                <p className="lesson-result">{l.result}</p>
              </article>
            ))}
          </div>
          <blockquote className="principle">
            모델이 지시를 안 따르는 것처럼 보이면, 그 지시가 실제로 모델에 도달했는지부터 확인한다.
            <br />
            자를 곳을 확신할 수 없으면 원문을 그대로 둔다 — 계획 문장이 조금 남는 것보다 답변이 잘려 나가는 쪽이 훨씬 나쁘다.
          </blockquote>
        </section>

        <section id="evolution" className="section">
          <SectionHead kicker="Evolution" title="v1 → v2, 무엇이 바뀌었나" />
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>영역</th>
                  <th>v1 (구 아키텍처)</th>
                  <th>v2 (현재)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.area}>
                    <th scope="row">{r.area}</th>
                    <td className="muted">{r.v1}</td>
                    <td>{r.v2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.date + t.title}>
                <span className="tl-date">{t.date}</span>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="stack" className="section">
          <SectionHead kicker="Tech Stack" title="사용 기술" />
          <div className="stack-grid">
            {TECH_STACK.map((g) => (
              <div key={g.group} className="stack-group">
                <h3>{g.group}</h3>
                <div className="tag-row">
                  {g.items.map((i) => (
                    <span key={i} className="tag">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="demo" className="section">
          <SectionHead
            kicker="Demo"
            title="시연"
            lead="GX10 한 대에서 로컬로 구동한 실제 화면. 카드를 누르면 크게 볼 수 있다."
          />
          <MediaShowcase />
        </section>
      </main>

      <footer className="footer">
        <p>Raika the Wolfdog · Architecture v2</p>
        <p className="muted">ASUS Ascent GX10 · vLLM · Qwen3.8-Flash-Next · FastAPI · React</p>
      </footer>
    </div>
  );
}
