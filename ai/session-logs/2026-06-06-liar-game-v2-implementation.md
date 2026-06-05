# 세션 로그 — 라이어 게임 v2 구현

- 날짜: 2026-06-06
- 도구/주체: codex
- 단계: implementation / qa

## 사용자 요청

Claude가 작성한 라이어 게임 v2 기획안을 확인한 뒤, 권장 순서대로 구현까지 진행.

## 결정

- `codex/liar-game-v2` 브랜치에서 작업.
- Claude 설계안의 단어 수를 실제 `legacy/index.html` 기준 20개 카테고리 853개로 보정.
- JSX가 포함된 store는 `src/store/gameStore.jsx`로 구현.
- 히스토리 레코드는 최종 점수뿐 아니라 `perRound` 라운드별 기록까지 저장.
- Apps in Toss 햅틱 export가 현재 웹 패키지에서 직접 확인되지 않아 `navigator.vibrate` 안전 폴백으로 구현.

## 변경 파일 요약

- 프로젝트 세팅: `package.json`, `vite.config.js`, `vitest.config.js`, `granite.config.ts`, `index.html`
- 기존 앱 보존: `legacy/index.html`
- 로직: `src/core/storage.js`, `src/data/words.js`, `src/logic/*.js`, `src/records/*.js`, `src/auth/authProvider.js`
- 화면: `src/store/gameStore.jsx`, `src/components/*.jsx`, `src/screens/*.jsx`, `src/styles/main.css`
- 테스트: `test/*.test.js`
- AI 협업 세팅: `AGENTS.md`, `CLAUDE.md`, `.graphifyignore`, `.understand-anything/config.json`, `ai/`

## 검증

- `npm test` — 5개 테스트 파일, 23개 테스트 통과.
- `npm run build:web` — Vite production build 통과.
- `npm run build` — `ait build` 통과, `liar-game.ait` 생성.
- 인앱 브라우저 QA — 설정 화면 렌더링, 5라운드 카드 확인/투표/결과/최종/기록 저장 흐름 확인.
- 브라우저 콘솔 — error/warn 로그 없음.

## 리스크 / 후속

- `npm install`에서 Apps in Toss/React Native dependency tree의 peer/deprecated/audit 경고가 다수 출력됨. 설치와 빌드는 성공했지만 릴리즈 전 별도 dependency review 권장.
- 햅틱은 웹 안전 폴백만 적용되어 실제 Toss WebView 기기에서 네이티브 햅틱 API가 있으면 후속 연결 가능.
- 라이어 2명 밸런스와 역전 룰은 계획 기준으로 우선 구현했으며 플레이 테스트 후 조정 가능.

## 지식저장소 승격

- 라이어게임 v2 프로젝트 요약을 `/Users/kangsungbae/Documents/지식저장소/projects/라이어게임/context.md`에 승격.
