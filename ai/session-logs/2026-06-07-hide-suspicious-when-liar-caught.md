# 2026-06-07 Hide Suspicious Highlight When Liar Caught

## Actor
- codex

## User Request
- Hide the "most suspicious person" result highlight when the vote already caught a liar.
- Reopen the app from the start page.

## Decision
- When `voteCaughtLiar` is true, the "most suspicious person" highlight is redundant with the vote result, judgment candidate, and liar reveal.
- Added a small helper so this display rule is tested and explicit.

## Files Changed
- `src/screens/ResultScreen.jsx`
- `test/resultScreenFlow.test.js`

## Verification
- TDD red check: `npm test test/resultScreenFlow.test.js` failed before the helper existed.
- Targeted test: `npm test test/resultScreenFlow.test.js` passed.
- Full tests: `npm test` passed with 21 files and 79 tests.
- Build: `npm run build` passed and produced `liar-game.ait`.
- Browser: reopened `http://localhost:5173/` on the setup/start page.
- Browser console warnings/errors: none observed.

## Knowledge Promotion
- No cross-project knowledge promoted. This is a project-specific result display rule.
