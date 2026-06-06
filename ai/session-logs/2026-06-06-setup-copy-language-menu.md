# 2026-06-06 Setup Copy + Language Menu

## Actor

- codex

## User Request

- 난이도 `전체` 표현이 애매하므로 다른 게임식 표현을 검토하고 더 자연스럽게 수정.
- 언어 선택 UI가 너무 크게 보이므로 우상단의 작은 메뉴/드롭다운 형태로 변경.

## Decisions

- 난이도 0 라벨은 `전체` 대신 `혼합`으로 변경.
- English label is `Mixed`.
- 설명 문구도 "쉬움·보통·어려움에서 섞어 뽑는다"는 의미를 명확히 하도록 수정.
- 언어 선택은 설정 폼의 큰 섹션에서 제거하고, 우상단 작은 pill 버튼 + popover menu로 이동.

## Files Changed

- `src/i18n/messages.js`
- `src/screens/SetupScreen.jsx`
- `src/styles/main.css`
- `test/i18n.test.js`

## Verification

- `npm test` — 9 files, 38 tests passed.
- `npm run build` — `ait build` passed, `liar-game.ait` generated.
- Browser QA at `http://127.0.0.1:5174/`:
  - 우상단 언어 메뉴 표시.
  - 메뉴 클릭 시 한국어/English 선택 popover 표시.
  - English 선택 시 제목과 난이도 라벨이 `Liar Game`, `Mixed`로 전환.
  - 한국어 선택 시 제목과 난이도 라벨이 `라이어 게임`, `혼합`으로 전환.
  - Browser console error/warn 없음.

## Knowledge Promotion

- Project-local UX decision only. No shared knowledge promotion needed.
