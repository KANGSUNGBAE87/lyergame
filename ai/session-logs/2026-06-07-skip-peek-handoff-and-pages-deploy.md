# Skip Peek Handoff And Pages Deploy

- Date: 2026-06-07
- Actor/tool: codex
- User request: Remove the extra pass-phone screen after card checking and deploy the app so it can be viewed publicly.

## Decisions

- Removed the intermediate card-check handoff screen because the next card screen can carry the pass-phone instruction directly.
- After player 1 checks, the app now moves straight to player 2's hidden card screen with the header instruction.
- After the final player checks, the existing store transition moves the app to discussion without an extra "everyone checked" button.
- Kept voting/reversal handoff flows unchanged because those protect separate result/answer moments.

## Files Changed

- `src/screens/PeekScreen.jsx`
- `src/logic/peekFlow.js`
- `src/i18n/messages.js`
- `test/peekFlow.test.js`

## Verification

- Red test first: `npm test test/peekFlow.test.js` failed because `src/logic/peekFlow.js` did not exist.
- Green test: `npm test test/peekFlow.test.js`
- Full test: `npm test`
- Web build: `npm run build:web`
- App build: `npm run build`
- Local browser check: after first card reveal, the screen showed player 2's card and inline pass instruction, with no pass-phone title or next-player button.
- Public browser check: `https://kangsungbae87.github.io/lyergame/?v=codex-20260607-1547` loaded, showed the start screen, and reproduced the same direct player-2 card flow with no console warnings/errors.

## Deployment

- Built `dist/`.
- Pushed `dist/` contents to the `gh-pages` branch.
- Updated GitHub Pages source to `gh-pages` `/`.
- Triggered and confirmed the latest Pages build for commit `1902ddec494f73da7dba515229438ce0fb4811da`.
- Public URL: `https://kangsungbae87.github.io/lyergame/`

## Remaining Risks

- GitHub Pages CDN can cache the old root URL for a short time. A cache-busted URL was verified immediately after deployment.
- The source branch still has unrelated dirty files from previous work; they were not reverted or committed in this deployment step.

## Knowledge Promotion

- No cross-project knowledge promotion needed.
