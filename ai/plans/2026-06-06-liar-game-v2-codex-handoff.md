# Codex 구현 핸드오프 브리프 — 라이어 게임 v2

- 날짜: 2026-06-06
- 핸드오프: Claude(기획·계획) → Codex(구현)
- 단계: implementation

## Objective
기존 단일 `legacy/index.html`(예정) 라이어 게임을 **React + Vite + Apps in Toss 미니앱**으로 재구축하고, 라운드/점수/투표/역전/타이머/난이도/히스토리 기능을 추가한다.

## 입력 문서 (반드시 먼저 읽기)
1. 설계: `ai/plans/2026-06-06-liar-game-v2-design.md`
2. 구현 계획(태스크별 코드·테스트·커밋 포함): `ai/plans/2026-06-06-liar-game-v2-implementation.md` ← **Codex 보정 사항을 반영해 Task 0~16 순서대로 실행**

## Scope (IN)
- React 18 + Vite 6 + `@apps-in-toss/web-framework` + `granite.config.ts` 스캐폴딩
- 순수 로직 5종(storage, pickWord, assignRoles, scoring, localRecords) — vitest TDD
- records/auth seam (v2 로컬, 로그인 도입 대비)
- 화면 8종(Setup·Peek·Discuss·Vote·Reversal·Result·Final·History)
- 카드 색상 통일(라이어/단어 모달 동일 배경), 햅틱, 난이도 태깅

## Scope (OUT / 다음 버전)
실제 로그인·백엔드, BGM/효과음, 온라인 멀티, 커스텀 단어 입력.

## Target Files (계획서에 전체 경로·코드 명시)
- 설정: `package.json`, `vite.config.js`, `vitest.config.js`, `granite.config.ts`, `index.html`, `test/setup.js`
- 로직: `src/core/storage.js`, `src/logic/{pickWord,assignRoles,scoring}.js`, `src/data/words.js`, `src/records/*`, `src/auth/authProvider.js`, `src/core/haptic.js`, `src/store/gameStore.jsx`
- 화면: `src/screens/*.jsx`, `src/components/*.jsx`, `src/styles/main.css`, `src/main.jsx`, `src/App.jsx`

## 주의 포인트 (Codex가 판단해야 할 곳)
1. **단어 난이도 태깅 (Task 2):** `legacy/index.html`의 WORDS 20개 카테고리 853단어를 `{ w, d }`로 변환. d=1 일상어 / d=2 설명 필요 / d=3 유사어 많음·희귀. 누락 단어 없게 `WORD_COUNT === 853` 테스트 포함.
2. **참고 패턴:** `/Users/kangsungbae/Documents/뽁뽁이`의 `storage.js`·`haptic.js`·`test/setup.js`·`granite.config.ts` 구조를 차용(NS·appName 등만 라이어게임용으로 변경).
3. **라운드별 기록:** `GameRecord.perRound`에 라이어, 제시어, 투표, 역전 결과, 점수 증감을 저장.
4. **카드 색상 통일(핵심):** `.peek-card`는 라이어/단어 공통 배경. 빨간 풀스크린 절대 금지.
5. **React 지원:** Vite에 `@vitejs/plugin-react` 추가, `granite.config.ts`의 build 커맨드는 `vite build` 유지.

## Tests
- `npm test` (vitest) — storage / pickWord / assignRoles / scoring / localRecords 전부 PASS 필요.
- 화면은 라이브 프리뷰 수동 검증(각 태스크 검증 스텝 참조).

## Verification Commands
```bash
npm install
npm test                 # 순수 로직 단위 테스트
npm run dev:web          # localhost:5173 수동 플로우 검증
npm run build            # = ait build, dist/ + .ait 생성 (환경 미설정 시 vite build로 dist만 확인하고 기록)
```

## Risks
- `ait build` 환경(앱인토스 CLI/로그인)이 로컬에 없을 수 있음 → 빌드 실패 시 `vite build`로 dist 생성만 확인하고 사유를 세션 로그에 기록.
- `@apps-in-toss/web-framework@^2.6.1` + React 동시 사용 호환성 — 설치 후 dev 서버 콘솔 에러 확인.
- 라이어 2명 시 역전·점수 세부 밸런스는 계획서 기준(지목된 라이어 중 1명이라도 정답 시 역전)으로 우선 구현, 플레이 후 조정.

## Next Gate (구현 후 Claude로 복귀)
구현 완료 시 Claude에게 다음을 전달:
- 변경 요약(생성/수정 파일), `npm test` 결과, `npm run build` 결과(성공/사유)
- 남은 리스크와 미결정 사항
- → Claude가 `review` + `qa` + `verification-before-completion` 게이트 수행

## 산출물 기록 규칙
구현 세션은 `ai/session-logs/`에 변경 로그를 남기고, 재사용 지식은 `/Users/kangsungbae/Documents/지식저장소`로 승격 검토(앱인토스 React 셋업 패턴).
