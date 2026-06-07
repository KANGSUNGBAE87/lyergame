# Login Ads Release Candidate

- Date: 2026-06-08
- Actor/tool: codex
- User request: Proceed with all final review next actions: fix review findings, add optional login and ad placements, verify, commit, and deploy.

## Decisions

- Fixed the result-highlight mismatch by showing the chaos/joint-nomination highlight only when multiple candidates are jointly nominated.
- Kept real Google/Toss SDK wiring out of product logic; auth and ads still go through platform adapters.
- Added optional login entry points without blocking guest play:
  - small account button on the setup screen
  - login prompt in history
  - login prompt in final results
- Added ad placement seams without showing fake ads:
  - post-game interstitial placement before same-game/new-game actions
  - history banner mount point that renders only when the adapter enables it
- Left payment as a later adapter-backed seam.

## Files Changed

- `src/logic/highlights.js`
- `src/ads/adPlacements.js`
- `src/ads/adFlow.js`
- `src/ads/adsProvider.js`
- `src/platform/platformServices.js`
- `src/components/LoginPrompt.jsx`
- `src/components/AdBannerSlot.jsx`
- `src/screens/SetupScreen.jsx`
- `src/screens/HistoryScreen.jsx`
- `src/screens/FinalScreen.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/highlights.test.js`
- `test/platformAdapters.test.js`
- `test/adFlow.test.js`
- `test/loginPrompt.test.js`
- `test/adBannerSlot.test.js`

## Verification

- Red tests first:
  - `npm test test/highlights.test.js test/adFlow.test.js test/loginPrompt.test.js test/adBannerSlot.test.js test/platformAdapters.test.js` failed because new modules did not exist and the old chaos condition returned `true`.
- Targeted green:
  - `npm test test/highlights.test.js test/adFlow.test.js test/loginPrompt.test.js test/adBannerSlot.test.js test/platformAdapters.test.js`
  - 5 files passed, 16 tests passed.
- Full verification:
  - `npm test`
  - 26 files passed, 92 tests passed.
  - `npm run build:web`
  - Vite build succeeded.
  - `npm run build`
  - AIT build succeeded and created `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/` at `390x844`:
  - setup account button shows guest-mode notice
  - history screen shows optional login prompt
  - unconfigured history ad banner does not render a fake ad
  - 1-round quick flow reaches final results
  - final login prompt renders
  - same-member replay passes through the post-game ad seam and starts a new game
  - no horizontal overflow observed

## Remaining Risks

- Auth and ads are placement-ready only; real Toss/Google login and AdMob/Apps in Toss Ads SDKs still need platform credentials and adapter implementations.
- `npm run build` still emits Node `DEP0190` from the AIT build tool chain, but build exits successfully.

## Knowledge Promotion

- No cross-project knowledge promotion needed; the adapter and monetization-placement standard already exists in shared app platform guidance.
