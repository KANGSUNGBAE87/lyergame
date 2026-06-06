# Graphic Result Splash

- Date: 2026-06-07
- Actor/tool: codex
- User request: replace the visible "짜잔~" text with an actual image-like reveal effect.

## Decisions

- Added `ResultSplash`, an inline SVG reveal graphic with burst, ribbons, dots, and sparks.
- Replaced the visible `짜잔~` paragraph on the result screen with the graphic splash.
- Kept an accessibility label for screen readers while ensuring the effect is not visible text.
- Removed onomatopoeic reveal text from result and reversal copy: `짜잔~`, `두둥~`, `Ta-da`, and `Dun-dun` are no longer used in source UI messages.

## Files Changed

- `src/components/ResultSplash.jsx`
- `src/screens/ResultScreen.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/resultSplash.test.js`
- `test/i18n.test.js`

## Verification

- `npm test` passed: 18 files, 68 tests.
- `npm run build` passed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/` confirmed:
  - result screen shows the SVG splash image above the winner title;
  - visible result text no longer contains `짜잔` or `두둥`;
  - the screen still shows the winner title, vote result, liar reveal, word, highlights, scoreboard, and final button without overlap.

## Remaining Risks

- The splash is lightweight inline SVG/CSS. Richer bitmap celebration art can be introduced later if the visual direction becomes more illustrative.
