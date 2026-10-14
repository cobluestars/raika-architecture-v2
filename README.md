# Raika the Wolfdog · Architecture v2

Raika v2의 시스템 아키텍처를 소개하는 포트폴리오 사이트 (Vite + React + TypeScript).
구버전: https://raikaarchitecturediagram.vercel.app/

## 개발

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 타입 검사 + dist/ 생성
npm run preview
```

## Vercel 배포

- 이 폴더(`Raika_portfolio`)를 저장소 루트로 쓰거나, 상위 저장소라면 Vercel 프로젝트의 **Root Directory** 를 `Raika_portfolio` 로 지정한다.
- Framework Preset: Vite (vercel.json 에 명시). Build `npm run build`, Output `dist`.
- CLI: `npx vercel` (미리보기) → `npx vercel --prod`.

## 내용 수정 위치

| 파일 | 내용 |
|---|---|
| `src/data/architecture.ts` | 다이어그램 노드·간선·클러스터, 노드별 상세 설명 |
| `src/data/content.ts` | 히어로 수치, 메모리 예산, 프로파일, 요청 흐름, 모드, 엔지니어링 노트, 비교표, 타임라인, 기술 스택 |
| `src/data/media.ts` | 시연 이미지 & 동영상 |

### 시연 자료 넣기

1. 파일을 `public/sample/` 에 넣는다.
2. `src/data/media.ts` 항목에 `src: '/sample/파일명'` (gallery 는 `images: [...]`) 을 적고 `placeholder: true` 를 지운다.
3. `name` / `description` 을 실제 내용으로 바꾼다.

### 다이어그램 좌표

캔버스는 2180 × 1270, 노드 `x/y` 는 중심점이다. 다른 노드를 관통하는 간선은 `route` 에 경유점을 직접 적는다
(파일 상단 주석의 거터 x 좌표 참고).
