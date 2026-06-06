# 2026-06-07 Reversal Handoff Flow and Stepper Polish

## Actor

Codex

## User Request

- Implement the remaining discussed reversal flow after citizens judge the liar's final guess.
- Make the setup plus/minus player count controls feel more obviously tappable and less pastel.

## Decisions

- After `맞혔어요` or `틀렸어요`, the app now shows a handoff step instead of immediately revealing the result.
- The handoff step does not show the answer word, so the named liar can check the outcome directly.
- The flow is now:
  1. Vote result and liar final chance.
  2. Citizen taps `맞혔어요` or `틀렸어요`.
  3. Phone handoff to the caught liar.
  4. Liar checks `맞습니다!` or `틀렸습니다!`.
  5. Liar opens the answer.
  6. Round result opens without the extra 3-2-1 countdown.
- Player count plus/minus controls now use stronger gradient, size, shadow, hover, and pressed states.

## Files Changed

- `src/components/ReversalOutcomeStep.jsx`
- `src/screens/ReversalScreen.jsx`
- `src/screens/ResultScreen.jsx`
- `src/components/PlayerCountControl.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/reversalOutcomeStep.test.js`
- `test/resultScreenFlow.test.js`
- `test/playerCountControl.test.js`
- `test/i18n.test.js`

## Verification

- `npm test` passed: 20 files, 74 tests.
- `npm run build` passed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/` passed:
  - Plus/minus controls have the new classes and stronger gradient style.
  - Liar was caught through real card, discussion, and vote flow.
  - Handoff screen hid the answer word.
  - Judgment screen showed the correct outcome.
  - Answer screen revealed the word.
  - Round result opened without the countdown.

## Risks / Follow-Up

- Existing unrelated changes in `AGENTS.md` and `CLAUDE.md` were left untouched.
- Visual polish can still be tuned after user review on device-sized screens.

## Follow-Up Fix

- The old `3,2,1` result countdown still appeared when the vote missed every liar.
- Removed the remaining result countdown path so `투표 집계` always opens the round result immediately.
- Verified the missed-liar browser flow: voting for a citizen opened `3라운드 결과` immediately with no countdown text or countdown number.

## Knowledge Promotion

- No cross-project durable rule was added. The local session log is sufficient for this feature decision.
