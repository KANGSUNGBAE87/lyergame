# 2026-06-07 Guide Contrast And Vote Result Bars

## Actor
- codex

## User Request
- Make the how-to-play modal text less faint.
- Stop using sky-blue font colors across the app.
- Rework vote result display into a more efficient structured form, considering table or bar graph.
- Apply the same vote-result improvement to related result areas.

## Decisions
- Chose a ranked horizontal bar list instead of a table.
- Reason: on a 390px mobile viewport, bars show top votes, ties, candidates, and zero-vote players with less horizontal pressure than a table.
- Kept the vote pattern private: voter identities are still not shown.
- Used the same `VoteResultBars` component for:
  - tie vote summary
  - runoff previous-result summary
  - caught-liar judgment screen
  - round result screen

## Files Changed
- `src/logic/voteResults.js`
- `src/components/VoteResultBars.jsx`
- `src/components/ReversalJudge.jsx`
- `src/screens/VoteScreen.jsx`
- `src/screens/ReversalScreen.jsx`
- `src/screens/ResultScreen.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/voteResults.test.js`
- `test/reversalJudge.test.js`

## Verification
- TDD red check: `npm test test/voteResults.test.js` failed before `src/logic/voteResults.js` existed.
- Targeted tests: `npm test test/voteResults.test.js test/reversalJudge.test.js` passed.
- Full tests: `npm test` passed with 21 files and 77 tests.
- Build: `npm run build` passed and produced `liar-game.ait`.
- CSS color audit: no remaining sky-blue font color declarations for the checked blue/cyan palette.
- Browser QA at `http://localhost:5173/` with 390x844 viewport:
  - setup screen
  - game method modal
  - full round result with vote bars
- Browser console warnings/errors: none observed.

## Remaining Risks
- The result screen can still become vertically long with 10-12 players because all players are intentionally shown for vote transparency.
- The caught-liar screen uses the same compact bar component and is covered by render tests; a direct live screenshot is still useful when the next manual game reaches that branch.

## Knowledge Promotion
- No cross-project standard promoted. This is project-specific UI implementation.
