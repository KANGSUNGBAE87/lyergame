# Fast Offline Play Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved fast offline play design: quick start, optional player names, pass-phone card/vote flows, tie handling, reveal drama, highlights, and final recap.

**Architecture:** Keep product/game logic in small pure helpers under `src/logic/`, then wire them through the existing `GameProvider` and screen-based React flow. UI copy remains locale-driven through `src/i18n/messages.js`, and platform adapters remain untouched.

**Tech Stack:** React 18, Vite, Vitest, existing CSS and local state reducer.

---

## Files

- Create `src/logic/players.js`: player name normalization and display labels.
- Create `src/logic/highlights.js`: round highlight and final recap calculation.
- Modify `src/logic/voting.js`: pass-phone vote counts, top candidates, tie helpers.
- Modify `src/store/gameStore.jsx`: player names, vote metadata, replay same config, round records.
- Modify `src/screens/SetupScreen.jsx`: quick-start layout, optional names, advanced settings.
- Modify `src/screens/PeekScreen.jsx`: one-at-a-time pass-phone reveal and handoff.
- Modify `src/screens/VoteScreen.jsx`: pass-phone secret voting, tie decision, runoff voting.
- Modify `src/screens/ResultScreen.jsx`: staged liar/word/result/highlight reveal.
- Modify `src/screens/FinalScreen.jsx`: recap-first final screen and same-member replay.
- Modify `src/i18n/messages.js`: Korean/English copy for all new UI.
- Modify `src/styles/main.css`: bright party mystery layout updates.
- Create tests: `test/players.test.js`, `test/highlights.test.js`; extend `test/voting.test.js`.

## Tasks

### Task 1: Pure Logic Tests

- [x] Add failing tests for player display labels, pass-phone voting, tie detection, round highlights, and final recap.
- [x] Run targeted tests and verify they fail because helpers are missing or incomplete.

### Task 2: Pure Logic Implementation

- [x] Implement `players.js`, extend `voting.js`, and add `highlights.js`.
- [x] Run targeted tests and verify they pass.

### Task 3: Store Data Model

- [x] Add `playerNames`, `voteCounts`, `votesByVoter`, `runoffOf`, `runoffVoteCounts`, `runoffVotesByVoter`, and `usedQuickJudgment` to game state.
- [x] Persist these fields into `perRound` and game records.
- [x] Add `RESTART_SAME` to start a fresh game with the same config and names.

### Task 4: Setup Screen Redesign

- [x] Move primary start above advanced settings.
- [x] Add optional player name editor.
- [x] Collapse liar count, difficulty, rounds, timer, hint, and categories into advanced settings.
- [x] Keep game guide accessible without dominating the first viewport.

### Task 5: Pass-Phone Card Reveal

- [x] Show the current player/number instead of all cards as primary action.
- [x] After reveal, show a handoff screen before marking the player as complete.
- [x] Use names when present and numbers as fallback.

### Task 6: Secret Voting and Tie Handling

- [x] Replace `+ / -` vote entry with one-voter-at-a-time candidate selection.
- [x] Hide voter selections during the round.
- [x] On first tie, show `재투표하기` and `빠른 판정`.
- [x] On runoff tie, apply quick judgment automatically.

### Task 7: Results, Highlights, and Recap

- [x] Stage result reveal before scoreboard.
- [x] Show round highlights from vote/result data.
- [x] Show final recap before scoreboard.
- [x] Make `같은 멤버로 한 판 더` the primary final CTA.

### Task 8: Verification

- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Browser QA on `http://127.0.0.1:5174/` for mobile quick start, names, card handoff, secret voting, tie path, result reveal, and recap.
- [x] Run `graphify update . --no-cluster`.
- [x] Save session log and commit only this implementation scope.

## Verification Evidence

- `npm test`: 15 files passed, 61 tests passed.
- `npm run build`: AIT build completed and produced `liar-game.ait`.
- Browser QA: 3-player 1-round named flow reached final recap with no current console errors.
- Browser QA: tie flow reached first tie, ran tied-candidate revote, reached final recap with no current console errors.
- Browser QA: 390px mobile setup viewport had no horizontal overflow.
- `graphify update . --no-cluster`: rebuilt code graph with 561 nodes and 9895 edges.
