# 2026-06-07 Reversal Judge and Player Stepper

## Actor

- codex

## User Request

- 라이어 지목 화면에서 정답 단어 선택지를 굳이 보여줄 필요가 있는지 재검토한 뒤 구현.
- 인원수가 몇 명인지 더 명확하게 보이게 개선.
- 옆으로 조작하는 슬라이더보다 더 효율적인 인원수 설정 UI로 변경.

## Decisions

- 라이어 지목 화면은 정답 선택지가 아니라 판정 화면으로 바꿨다.
- 라이어가 직접 제시어를 말하고, 시민들이 `맞혔어요` / `틀렸어요`로 판정한다.
- 정답 단어와 오답 후보는 반전 화면에 표시하지 않는다.
- 카테고리도 `라이어에게 카테고리 힌트`가 켜져 있을 때만 반전 화면에 표시한다.
- 인원수는 슬라이더 대신 큰 숫자 스테퍼와 빠른 선택 버튼을 사용한다.
- 빠른 선택은 `3`, `4`, `5`, `6`, `8`, `10`, `12`명으로 둔다.

## Files Changed

- `src/components/ReversalJudge.jsx`
- `src/components/PlayerCountControl.jsx`
- `src/config/gameOptions.js`
- `src/screens/ReversalScreen.jsx`
- `src/screens/SetupScreen.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/reversalJudge.test.js`
- `test/playerCountControl.test.js`

## Verification

- Red test first: `npm test -- test/reversalJudge.test.js test/playerCountControl.test.js` failed because both new components were missing.
- Targeted tests after implementation: `npm test -- test/reversalJudge.test.js test/playerCountControl.test.js` passed.
- Targeted i18n/options tests: `npm test -- test/i18n.test.js test/gameOptions.test.js test/reversalJudge.test.js test/playerCountControl.test.js` passed.
- Full tests: `npm test` passed with 12 files and 45 tests.
- Build: `npm run build` passed and generated `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/`:
  - 3-player preset changed the displayed count to `3명`.
  - No `input[type="range"]` remained in the setup screen.
  - A 3-player round was played through card reveal, vote, and reversal.
  - Reversal screen showed instruction/judgement copy and `맞혔어요` / `틀렸어요`.
  - The citizen word observed during reveal did not appear on the reversal screen.
  - `.choice-grid` was absent on the reversal screen.
  - Fresh reload after QA had no new browser console errors or warnings.

## Remaining Risks

- The new player preset layout should be visually checked on narrow production devices before release.
- The reversal screen now depends on group honesty for the spoken answer, which matches party-game flow but leaves no in-app typed answer record.

## Knowledge Promotion

- Project-local log is enough for now. Promote only if this reversal-judge pattern becomes a reusable default for other liar/impostor games.
