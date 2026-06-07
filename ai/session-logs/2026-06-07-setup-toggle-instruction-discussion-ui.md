# Setup Toggle, Instruction, And Discussion UI Refresh

- Date: 2026-06-07
- Actor/tool: codex
- User request: Reduce the odd shadow on name/advanced toggles, add clearer down-arrow expand affordance, make card/vote handoff instructions larger and prettier, remove the vote pass-phone interstitial, and redesign the discussion screen as a mission card.

## Design Preflight

- Checked project context: mobile-first offline pass-phone party game.
- Palette retained from the approved bright party mystery system:
  - main `#E11D48`
  - sub `#0F766E`
  - accent `#F59E0B`
  - surface `#FFF7ED`
  - text `#172033` / `#334155`
- `colors.io` appeared ambiguous/unavailable as an exact target; public palette tooling search surfaced similar palette services. The current palette already matched the requested roles, so no new palette was introduced.
- React Bits reviewed but not installed; the requested changes are better handled with existing CSS and layout patterns rather than adding a new animated component.

## Decisions

- Converted `이름 입력` and `고급 설정` summaries from heavy 3D-button shadows to lighter convex toggle panels.
- Kept the `펼치기/접기` text and arrow affordance together for both toggles.
- Replaced small card/vote instruction text with a shared `turn-instruction-card` pattern.
- Removed the secret-vote pass-phone interstitial. Saving a vote now immediately advances to the next voter, while the final voter still triggers counting/tie handling.
- Redesigned the discussion screen as a `discussion-mission-card` with mission/rule badges, emphasized keywords, and a timer/no-timer status chip.

## Files Changed

- `src/screens/PeekScreen.jsx`
- `src/screens/VoteScreen.jsx`
- `src/screens/DiscussScreen.jsx`
- `src/logic/voteFlow.js`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/voteFlow.test.js`

## Verification

- Red test first: `npm test test/voteFlow.test.js` failed before `src/logic/voteFlow.js` existed.
- Focused tests: `npm test test/voteFlow.test.js test/peekFlow.test.js`
- Full tests: `npm test`
- Web build: `npm run build:web`
- App build: `npm run build`
- Browser QA at 390x844:
  - setup toggle summaries rendered with no transform and light convex shadows
  - card flow showed player 2 card directly with instruction card and no pass-phone screen
  - discussion screen showed mission card and timer pill
  - vote save moved directly from vote 1/6 to vote 2/6 with no pass-phone screen
  - console warnings/errors: none

## Deployment

- Built web assets with `npm run build:web`.
- Pushed `dist/` contents to `gh-pages`.
- Triggered and confirmed GitHub Pages build for commit `0b3fd4dac84de71508115dabea35d9eb861a5fe1`.
- Public URL verified: `https://kangsungbae87.github.io/lyergame/`

## Notes And Risks

- GitHub Pages may cache for a few minutes, but a cache-busted URL verified the latest assets immediately.
- The source worktree still contains earlier unrelated dirty files; they were not reverted.

## Knowledge Promotion

- No cross-project reusable knowledge promotion needed.
