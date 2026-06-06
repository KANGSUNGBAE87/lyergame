# 2026-06-07 Bilingual Word Pack and 12 Players

## Actor

- codex

## User Request

- 인원수 최대값을 12명으로 늘린다.
- 게임 제시어 목록을 하드코딩 UI/로직에서 분리하고, 한국어와 영어 단어를 함께 보관할 수 있게 한다.

## Decisions

- 플레이어 수 경계는 `MIN_PLAYERS`/`MAX_PLAYERS` 상수로 노출해 테스트와 UI가 같은 값을 쓰게 했다.
- 단어 원본은 `src/data/wordList.js`로 분리하고, 기존 `src/data/words.js`는 `WORDS`, `CATEGORIES`, `WORD_COUNT`, `getWordText`를 제공하는 얇은 API로 유지했다.
- 각 단어 항목은 `{ ko, en, d }` 구조를 사용한다.
- 게임 시작 시 현재 선택 언어를 라운드 설정에 저장하고, 제시어와 반전 선택지도 해당 언어로 표시한다.

## Files Changed

- `src/config/gameOptions.js`
- `src/data/wordList.js`
- `src/data/words.js`
- `src/i18n/messages.js`
- `src/logic/pickWord.js`
- `src/screens/ReversalScreen.jsx`
- `src/screens/SetupScreen.jsx`
- `src/store/gameStore.jsx`
- `test/gameOptions.test.js`
- `test/pickWord.test.js`
- `ai/plans/2026-06-06-i18n-platform-readiness.md`
- `ai/session-logs/2026-06-06-i18n-platform-readiness.md`

## Verification

- Red test first: `gameOptions` max player and bilingual word expectations failed before implementation.
- Targeted tests after implementation: `npm test -- test/gameOptions.test.js test/pickWord.test.js` passed.
- Full tests: `npm test` passed with 9 files and 41 tests.
- Build: `npm run build` passed and generated `liar-game.ait`.
- Graph refresh: `/Users/kangsungbae/.codex/bin/graphify update . --no-cluster` completed successfully.
- Browser QA on `http://127.0.0.1:5174/`:
  - Setup screen shows `Play with 3 to 12 players.`
  - Player range input has `min=3` and `max=12`.
  - English game start displayed an English category/word pair such as `Insects` / `Moth` with no Hangul in visible text.
  - Fresh reload after QA had no new browser console errors or warnings.
  - Browser automation could not reliably drag the native range control, so the max value was verified through source, tests, DOM attributes, and setup copy.

## Remaining Risks

- English words are first-pass static translations and should receive copy QA before store release.
- The word list is local static data; future remote packs or paid packs should stay behind repository/provider boundaries.

## Knowledge Promotion

- Project-local log is enough for now. Promote to shared knowledge if this bilingual word-pack pattern becomes reusable across multiple game projects.
