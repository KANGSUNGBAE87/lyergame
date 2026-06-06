# 2026-06-07 Fast Offline Play Implementation

## Actor

- Codex

## User Request

- Implement the remaining discussed offline liar-game features after design review.
- Focus on faster start, less friction, more interesting results, optional player names, and the agreed tie-vote process.

## Decisions

- Keep the first screen centered on player count and `바로 시작`.
- Make player names optional; empty names fall back to player numbers.
- Move liar count, difficulty, rounds, timer, hint, and categories into collapsed advanced settings.
- Replace multi-card selection with one-at-a-time pass-phone reveal.
- Replace manual vote counters with pass-phone secret voting.
- On first tie, reveal only the vote pattern and offer tied-candidate revote or quick judgment.
- If a runoff ties again, apply quick judgment automatically.
- Stage results before showing the scoreboard and add round/final recap labels.
- Keep all new user-facing copy in `src/i18n/messages.js`.

## Files Changed

- Added `src/logic/players.js`, `src/logic/highlights.js`, and `src/components/PlayerNamesEditor.jsx`.
- Extended `src/logic/voting.js` for pass-phone voting and runoff candidates.
- Updated `src/store/gameStore.jsx` with player names, vote metadata, highlights, and same-config restart.
- Updated setup, peek, vote, reversal, result, final, scoreboard, card, i18n, and CSS files.
- Added/extended tests in `test/players.test.js`, `test/highlights.test.js`, and `test/voting.test.js`.
- Updated implementation plan checklist in `ai/plans/2026-06-07-fast-offline-play-implementation-plan.md`.

## Verification

- `npm test`: 15 test files passed, 61 tests passed.
- `npm run build`: AIT build completed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/`:
  - 3-player 1-round named flow reached final recap with no current console errors.
  - Tie flow reached first tie, ran tied-candidate revote, reached final recap with no current console errors.
  - 390px mobile setup viewport had no horizontal overflow.
- `graphify update . --no-cluster`: rebuilt code graph with 561 nodes and 9895 edges.

## Remaining Risks

- Store-facing login, payments, ads, and backend receipt verification remain adapter stubs by design.
- Result labels are intentionally lightweight; future playtests may tune which recap titles feel funniest.
- Full app-store QA still needs device/platform testing outside the web dev server.

## Next Steps

- Playtest with 4-8 people and tune copy/pace after observing where people hesitate.
- Add store-platform implementation when Apps in Toss or Google Play target details are selected.

## Knowledge Store Promotion

- No cross-project rule change required. This session updates the local liar-game product implementation and project-local graph.
