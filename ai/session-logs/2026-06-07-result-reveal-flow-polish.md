# Result Reveal Flow Polish

- Date: 2026-06-07
- Actor/tool: codex
- User request: make advanced settings explicitly say open/close, clarify optional category hint display, replace repeated "continue reveal" with a 3-2-1 result reveal, and reorder liar/result screens so vote results appear before liar judgment.

## Decisions

- Kept the existing `liarHint` behavior: category is shown to the liar only when the setting is enabled.
- Renamed the setup option to "카테고리 힌트 보기" / "Show category hint" so the checkbox reads as an optional reveal.
- Reordered the caught-liar final chance screen: vote result first, verdict second, dramatic liar reveal third.
- Replaced the manual multi-step result reveal with an automatic 3-2-1 countdown followed by a "짜잔~" result summary.
- Made the round result summary show vote result, judgment candidate, liar name, and word/category before highlights and scoreboard.

## Files Changed

- `src/screens/SetupScreen.jsx`
- `src/screens/ReversalScreen.jsx`
- `src/screens/ResultScreen.jsx`
- `src/components/ReversalJudge.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/i18n.test.js`
- `test/peekModal.test.js`
- `test/reversalJudge.test.js`

## Verification

- `npm test` passed: 16 files, 65 tests.
- `npm run build` passed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/` confirmed:
  - advanced settings show `펼치기` and then `접기`;
  - category hint copy appears in advanced settings;
  - caught-liar screen shows vote result before verdict and liar reveal;
  - result screen shows `3` countdown, then `짜잔~`, vote result, candidate, liar, and word without visual overlap.

## Remaining Risks

- The reveal countdown is time-based at about 2.1 seconds total; future UX testing may tune pacing.
- No knowledge-store promotion is needed yet; this is project-specific UI behavior.
