// 페이지 본문 데이터. 수치는 Raika_bot 저장소의 실측 기록(qwen_flash_next/README.md,
// hosting_vrc/README.md, real_companion/README.md, math_playground/README.md)에서 가져왔다.

export const HERO_STATS = [
  { value: '1대', label: 'ASUS Ascent GX10', note: 'GB10 · 128GB 통합 메모리에서 전체 스택 구동' },
  { value: '125B', label: 'MoE 메인 LLM', note: '활성 6B · NVFP4 · 멀티모달' },
  { value: '~20 tok/s', label: '한국어 디코딩', note: '이전 27B: 3.8~7.8 tok/s' },
  { value: '최대 131K', label: '컨텍스트', note: '이전 81,920 · 기동 시 프로파일로 조정' },
  { value: '−17.6 GiB', label: '부수 스택 절감', note: '37.0 → 19.4 GiB (실측)' },
];

export interface TimelineItem {
  date: string;
  title: string;
  body: string;
}

export const TIMELINE: TimelineItem[] = [
  {
    date: 'v1',
    title: 'Gemma-3 12B + LoRA (구 아키텍처)',
    body: 'transformers 4-bit 를 프로세스 안에서 직접 로딩. Live2D 아바타, OpenRouter 외부 모델 위임, 상시 기동 OCR.',
  },
  {
    date: '2026-08-17',
    title: 'vLLM 서빙 전환 · Qwen3.8-27B',
    body: 'gpt-oss-120b 시기를 거쳐 멀티모달 27B(bf16)로 교체. vLLM OpenAI 호환 서버로 분리하고 reasoning parser 로 사고/본문 채널을 나눔.',
  },
  {
    date: '2026-09-01',
    title: 'Qwen3.8-Flash-Next-NVFP4',
    body: '125B MoE(활성 6B)로 교체. PLE n-gram 테이블 사이드카 + vLLM 오버레이, 라우터 4B 축소, OCR 온디맨드화, React 정적 서빙.',
  },
  {
    date: '2026-10-08',
    title: 'MTP 활성화 · 시간/날씨 재구현',
    body: '프로파일 선택기의 낡은 메모리 상수 때문에 한 번도 켜지지 않던 MTP 를 복구(14.3 → 약 20 tok/s). 시간·날씨를 VRC 경로와 공용 코드로 통합.',
  },
  {
    date: '2026-10-09',
    title: 'Real Companion 모드',
    body: '날짜 세션과 로컬 하이브리드 RAG(EmbeddingGemma 2 + FTS5). 지난 날의 대화·이미지·파일을 라이카가 스스로 회상.',
  },
  {
    date: '2026-10-10',
    title: 'iPhone 모바일 게이트웨이',
    body: '단일 HTTPS 관문 + 화이트리스트 프록시. 폰 카메라를 "라이카의 눈"으로, 옆 사람의 말은 STT 로.',
  },
  {
    date: '2026-10-12',
    title: 'Math Playground',
    body: '탐색기 → 격리 샌드박스 실행 → 근거 등급 라벨. 반례 필터, 오프라인 OEIS, Lean 4 검사기.',
  },
];

export const COMPARISON: { area: string; v1: string; v2: string }[] = [
  { area: '하드웨어', v1: '—', v2: 'ASUS Ascent GX10 (NVIDIA GB10 · 128GB CPU/GPU 통합 메모리) 1대' },
  { area: '메인 LLM', v1: 'Gemma-3 12B + LoRA (4-bit)', v2: 'Inferact/Qwen3.8-Flash-Next-NVFP4 (125B MoE · 활성 6B · 멀티모달)' },
  { area: '서빙', v1: 'transformers 프로세스 내 로딩 · Lazy init', v2: 'vLLM (Docker · OpenAI 호환 API) + MTP 투기적 디코딩 + 프로파일 자동 선택' },
  { area: '의도 라우팅', v1: '메인 LLM(Gemma-3 12B)이 라우터 겸용', v2: 'Gemma-3-4B 전용 라우터 → 의도별 추론 등급·시간/토큰 예산 (정확도가 충분히 확보되면 Laya 같은 의사결정 AI 모델로 교체 예정)' },
  { area: '검색 RAG', v1: 'LangChain / LangGraph 에이전트', v2: 'LangChain / LangGraph 유지 · Google CSE → DuckDuckGo 폴백' },
  { area: '기억', v1: 'ShortTermMemory + Redis', v2: '토큰 예산 대화 창 · 긴 턴 요약 압축 · SQLite(FTS5) + EmbeddingGemma 2 하이브리드 검색으로 필요할 때만 관련 텍스트·이미지를 컨텍스트에 주입' },
  { area: '실시간 정보', v1: 'Weather / Time MCP', v2: '명시적 요청만 조회 · 재질문 · 캐시 · VRC 와 공용 코드' },
  { area: '외부 LLM', v1: 'OpenRouter (gpt-oss-20b) 위임', v2: '없음 — 모든 추론을 로컬에서' },
  { area: 'OCR', v1: 'DeepSeek-OCR 상시 기동', v2: 'PDF 요청 시 자동 기동 · 유휴 15분 후 종료 (약 7GiB 회수)' },
  { area: '아바타', v1: 'Live2D', v2: 'VRM (three.js) · 립싱크 · 감정 표정 · 눈 깜빡임' },
  { area: '클라이언트', v1: 'React 웹', v2: '데스크톱 웹 · iPhone 모바일 웹 · VRChat 음성 대화 + 관제실' },
  { area: '전용 모드', v1: '—', v2: 'Real Companion · Math Playground · VRC Station' },
];

// GB10 통합 메모리 예산 (GiB). 119.6 GiB 가 CPU/GPU 공용으로 보인다.
export const MEMORY_TOTAL = 119.6;
export const MEMORY_BUDGET = [
  { key: 'weights', label: '메인 LLM 상주 가중치', value: 74.9, color: '#3FD3C0', note: 'PLE 102GB 는 NVMe mmap 사이드카로 분리' },
  { key: 'side', label: '부수 스택', value: 19.4, color: '#9B7BFF', note: '라우터 · TTS · FastAPI · Redis · 데스크톱' },
  { key: 'rest', label: 'KV 풀 · 작업 공간 · 여유', value: 25.3, color: '#4A5577', note: '프로파일 선택기가 기동 시점에 배분' },
];

export const SIDE_STACK_SAVINGS = [
  { label: '라우터 12B → 4B', value: '약 6 GiB' },
  { label: 'DeepSeek-OCR 온디맨드화', value: '약 7 GiB' },
  { label: 'React 개발 서버 → 정적 빌드', value: '약 2 GiB → 3.4 MiB' },
];

export const PROFILES = [
  {
    name: 'speed',
    when: '기동 시 CUDA 가용 ≥ 95.0 GiB',
    mtp: 'MTP 켬',
    kv: '50.0 KiB / token',
    ctx: '65,536',
    speed: '약 20 tok/s',
  },
  {
    name: 'context',
    when: 'CUDA 가용 < 95.0 GiB',
    mtp: 'MTP 끔',
    kv: '26.6 ~ 30.2 KiB / token',
    ctx: '32,768 ~ 98,304',
    speed: '14.3 tok/s',
  },
];

export interface LifecycleStep {
  step: string;
  title: string;
  body: string;
}

export const LIFECYCLE: LifecycleStep[] = [
  {
    step: '01',
    title: '수신',
    body: 'Socket.IO message 이벤트로 텍스트·첨부·Reasoning 선택·세션 모드가 함께 도착한다. 모바일은 게이트웨이를 거친다.',
  },
  {
    step: '02',
    title: '의도 분류',
    body: 'Gemma-3-4B 라우터가 의도를 고르고 추론 등급(low/medium/high)과 시간·토큰 예산을 정한다. 사용자가 직접 고른 등급이 우선.',
  },
  {
    step: '03',
    title: '근거 수집',
    body: '의도와 세션에 따라 웹 검색, 시간·날씨 조회, Real Companion 기억 회상, 수학 탐색기 실행, 파일 분석을 붙인다.',
  },
  {
    step: '04',
    title: '컨텍스트 조립',
    body: '예산 안에서 페르소나 · 대화 창 · 근거 블록을 쌓는다. 긴 턴은 요약 + 관련 원문 조각으로 압축해 싣는다.',
  },
  {
    step: '05',
    title: '스트리밍 생성',
    body: 'vLLM 이 reasoning / content 두 채널로 토큰을 흘린다. 서버가 경계를 직접 구성해 생각주머니와 본문으로 나눠 보낸다.',
  },
  {
    step: '06',
    title: '검증 · 정리',
    body: '누출 감시창, [[SEARCH]] 토큰 감지 → 2차 패스, RAG 인용 검증, 최종 텍스트 안전망을 거쳐 finalText 를 확정한다.',
  },
  {
    step: '07',
    title: '음성 · 표정',
    body: '첫 문장부터 조기 TTS, 감정 분류로 아바타 표정을 정하고, /ws/lipsync 로 오디오와 립싱크를 보낸 기기에만 재생한다.',
  },
  {
    step: '08',
    title: '저장 · 색인',
    body: 'MongoDB 에 턴을 저장하고, Real Companion 색인과 긴 턴 요약을 백그라운드에서 갱신한다.',
  },
];

export interface ModeCard {
  id: string;
  name: string;
  tagline: string;
  points: string[];
}

export const MODES: ModeCard[] = [
  {
    id: 'normal',
    name: '일반 세션',
    tagline: '전문 지식 · 웹 RAG · 파일 분석 — 속도보다 정확도',
    points: [
      '최근 대화를 메시지 단위로 16K 토큰까지, 웹 결과는 별도 블록',
      '검색 결과를 실제로 읽고, 없는 것은 없다고 말하고, 출처를 단다',
      '이미지·PDF·스프레드시트 분석과 Reasoning 4단계 선택',
    ],
  },
  {
    id: 'rc',
    name: 'Real Companion',
    tagline: '하루 단위로 쌓이는 관계형 기억',
    points: [
      "'어제 보여준 사진 다시 보여줘' → 날짜 · 종류 해석 → 회상 → 파일 첨부",
      '오늘 대화 창(4K~20K) + 기억 RAG(등급별 16K/32K/48K) 두 덩어리로 프롬프트 구성',
      '기록이 없으면 지어내지 않고 모른다고 답한다',
    ],
  },
  {
    id: 'math',
    name: 'Math Playground',
    tagline: '계산은 샌드박스에서, 주장에는 근거 등급을',
    points: [
      '탐색기가 코드를 쓰고 실행해 [실험 노트]를 만든 뒤 라이카가 답한다',
      '실제로 출력된 값만 【수치 검증】, 나머지는 【비형식 증명】·【추정】',
      'Lean 통과 기록이 없으면 【Lean 검증】을 붙이지 않는다',
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile · 라이카의 눈',
    tagline: '폰 카메라로 함께 보고, 옆 사람과도 대화',
    points: [
      '사진 한 장에 1인칭 시점 지시를 그 턴에만 덧붙여 prefix cache 를 지킨다',
      '옆 사람의 말은 STT 로 받아 [상대방] 머리표를 붙여 구분',
      'PC 와 같은 오늘 세션을 이어 쓰고, 음성은 말을 건 기기에서만',
    ],
  },
  {
    id: 'vrc',
    name: 'VRC Station',
    tagline: 'VRChat 에서 여러 사람과 실시간 음성 대화',
    points: [
      '공개 대화 / 개발자 1:1 모드 분리, 설정 탈취 요구 거절',
      '한·영·중·일 원문 STT와 응답, 관제실용 한국어 자막',
      '문장 단위 생성·합성 파이프라인으로 첫 음성 지연 단축',
    ],
  },
];

export interface Lesson {
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  result: string;
}

export const LESSONS: Lesson[] = [
  {
    title: '검색해 놓고 "검색을 못 한다"고 답하다',
    symptom: '웹 검색은 실제로 됐는데, 라이카는 실시간 검색을 할 수 없다고 답하고 학습 데이터의 옛 버전 번호를 꺼냈다.',
    cause: '한 턴에 프롬프트가 두 번 만들어졌고, 실제로 쓰인 두 번째에는 검색 결과와 RAG 지침이 통째로 빠져 있었다. 프롬프트 문구를 두 번 고친 뒤에야 "지시가 도착하는지"를 의심했다.',
    fix: '호출부에 recent_context 전달 추가, 프롬프트 블록 유무를 찍는 [PromptDbg] 진단 스위치 도입.',
    result: 'RAG 검증 통과 · 출처 5개 · 불필요한 재작성 제거로 응답 253초 → 191초',
  },
  {
    title: '생성 등급과 파싱 등급이 어긋나다',
    symptom: '평범한 질문에서 영어 계획 문장이 그대로 답변으로 나갔다.',
    cause: '같은 함수를 부르는 9곳 중 스트리밍 경로 한 곳만 manual_override 를 넘기지 않아, 생성은 medium · 파서는 low 를 믿었다. 모델은 지시를 어긴 적이 없었다.',
    fix: '원인(한 줄)과 증상(감시창 가드)을 모두 수정. 가드는 확신이 없으면 흘려보내는 쪽이 기본값.',
    result: '생각주머니 0자 → 1,889자로 정상 분리, 경로별 매트릭스 5/5 통과',
  },
  {
    title: '검사는 통과했는데 답변 첫머리에 "nk>"',
    symptom: 'e2e 누출 검사는 통과인데, repr 로 찍어 보니 본문 앞에 태그 꼬리가 남아 있었다.',
    cause: '경계 인덱스는 맞았지만, 잘라 낸 buffer 대신 태그를 걸쳐 도착한 원본 token 을 내보내고 있었다. 검사가 완전한 </think> 만 찾고 있었다.',
    fix: '전환 시 잘라 낸 buffer 를 내보내고 해당 토큰 재전송 방지. 검사에 태그 조각 검출과 finalText 확인 추가.',
    result: '"검사가 사용자가 보는 것과 같은 것을 보는가"를 먼저 묻는 원칙',
  },
  {
    title: 'MTP 가 한 번도 켜지지 않았다',
    symptom: '체감 속도가 15 tok/s 이하. 기동 로그에 speculative_config=None.',
    cause: '프로파일 선택기의 speed 기반 메모리 상수(78.1GiB)가 낡아 util 상한(76.6GiB)보다 커서, speed 프로파일이 원천 봉쇄돼 있었다.',
    fix: '현재 이미지에서 재실측(74.70GiB)해 상수 갱신, speed 전용 상한 분리. 긴 추론 용도를 위해 컨텍스트 하한 65,536 유지.',
    result: '한국어 디코딩 14.3 → 약 20 tok/s',
  },
];

export const TECH_STACK: { group: string; items: string[] }[] = [
  { group: 'Hardware · Infra', items: ['ASUS Ascent GX10 (GB10)', 'DGX OS · aarch64', 'Docker / Compose', 'tmux · conda', 'NVMe mmap'] },
  { group: 'Model Serving', items: ['vLLM (OpenAI API)', 'NVFP4', 'MTP speculative decoding', 'Qwen3.8-Flash-Next', 'Gemma-3-4B (bnb 4-bit)'] },
  { group: 'Backend', items: ['Python · asyncio', 'FastAPI · Uvicorn', 'python-socketio', 'httpx', 'multiprocessing'] },
  { group: 'Memory · Data', items: ['MongoDB (motor)', 'Redis Stack', 'AWS S3', 'SQLite FTS5', 'EmbeddingGemma 2', 'sentence-transformers'] },
  { group: 'Speech · Perception', items: ['Chatterbox Multilingual TTS', 'Whisper-small', 'DeepSeek-OCR', 'KOTE / DistilRoBERTa 감정 분류'] },
  { group: 'Frontend', items: ['React 18 · TypeScript', 'three.js · @pixiv/three-vrm', 'Socket.IO client', 'MathJax', 'Tailwind CSS'] },
  { group: 'Agent Tooling', items: ['Docker 샌드박스 (no network)', 'numba · PARI/GP · gmpy2', 'Lean 4 + Mathlib', '오프라인 OEIS', 'Google CSE · Open-Meteo'] },
  { group: 'Quality', items: ['pytest (VRC 125 · 게이트웨이)', '토큰 재생 단위 테스트', 'Socket.IO e2e 경로 매트릭스', '메모리 실측 감사 스크립트'] },
];
