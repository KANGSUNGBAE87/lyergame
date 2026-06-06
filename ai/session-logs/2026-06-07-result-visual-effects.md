# Result Visual Effects

- Date: 2026-06-07
- Actor/tool: codex
- User request: make the vote verdict and liar reveal feel more dramatic with the Pinocchio image, improve low-contrast citizen judgment text, and add suitable imagery to result highlight rows.

## Decisions

- Reused the existing Pinocchio-style liar SVG from the peek card by extracting it into `LiarMascot`.
- Added the mascot to both the caught-liar final chance card and the round result liar reveal card.
- Added conic ring and pop animations around the liar mascot while respecting reduced-motion settings.
- Increased the contrast and font weight of the citizen judgment instruction.
- Replaced text-only round highlights with `RoundHighlightRow`, adding small visual badges for suspicion, unfair citizen, hidden liar, reversal, and chaos states.

## Files Changed

- `src/components/LiarMascot.jsx`
- `src/components/RoundHighlightRow.jsx`
- `src/components/PeekModal.jsx`
- `src/components/ReversalJudge.jsx`
- `src/screens/ResultScreen.jsx`
- `src/styles/main.css`
- `test/reversalJudge.test.js`
- `test/roundHighlightRow.test.js`

## Verification

- `npm test` passed: 17 files, 66 tests.
- `npm run build` passed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/` confirmed:
  - caught-liar screen shows the Pinocchio mascot with the vote result and verdict;
  - citizen judgment text is readable on the light theme;
  - result screen shows the mascot in the liar reveal area;
  - highlight rows show visual badges for suspicious and reversal highlights without text overlap.

## Remaining Risks

- The highlight badge art is intentionally lightweight SVG/CSS; future brand work can replace it with richer generated bitmap assets if the product direction calls for a more illustrated style.
- No shared knowledge-store promotion is needed yet; this is project-specific UI polish.
