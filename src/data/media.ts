// 샘플 시연 이미지 & 동영상
//
// 새 자료를 추가하려면:
//   1) 파일을 public/sample/ 아래에 넣는다 (예: public/sample/rc_recall_1.png)
//   2) 아래 항목의 src / images 에 '/sample/파일명' 을 적고 placeholder 를 지운다
//   3) name / description 을 실제 내용으로 바꾼다
// 항목 종류: image(한 장) · video(mp4) · gallery(여러 장, 모달에서 넘겨 보기)

export type MediaItem =
  | { type: 'image'; name: string; description?: string; src?: string; placeholder?: boolean }
  | { type: 'video'; name: string; description?: string; src?: string; poster?: string; placeholder?: boolean }
  | { type: 'gallery'; name: string; description?: string; images: string[]; count?: number; placeholder?: boolean };

export const MEDIA_ITEMS: MediaItem[] = [
  {
    type: 'video',
    name: '자기소개',
    description: 'VRM 아바타와 함께하는 라이카의 자기소개',
    src: '/sample/introduce.mp4',
    poster: '/sample/introduce_poster.webp',
  },
  {
    type: 'gallery',
    name: '이미지 분석 · 수능 문제 풀이',
    description: '수능 문제 이미지를 메인 멀티모달 모델이 직접 읽고 풀이',
    images: ['/sample/vision_csat_1.webp', '/sample/vision_csat_2.webp'],
  },
  {
    type: 'gallery',
    name: 'Real Companion · 장기 기억',
    description: '지난 날이 무슨 날이었는지, 어떤 대화를 했는지 회상',
    images: ['/sample/ltm_1.webp', '/sample/ltm_2.webp'],
  },
  {
    type: 'image',
    name: '검색 RAG · 영화 찾기',
    description: '흐릿한 기억의 단서만으로 영화를 찾아 줌',
    src: '/sample/rag_movie.webp',
  },
  {
    type: 'image',
    name: 'VRC Station · 실시간 날씨',
    description: 'VRChat 에서 서울 날씨를 묻는 상대에게 Open-Meteo 조회 후 음성으로 답변',
    src: '/sample/vrc_weather.webp',
  },
];
