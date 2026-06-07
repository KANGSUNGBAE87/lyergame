# Final Review And Next Actions

- Date: 2026-06-08
- Actor/tool: codex
- User request: Review the current Liar Game implementation state and recommend the next concrete actions.

## Current Review Scope

- Reviewed local branch `codex/liar-game-v2`.
- Checked implementation docs, design criteria, platform adapter seams, game flow screens, and recent dirty worktree state.
- Performed focused mobile browser QA on `http://127.0.0.1:5174/` at `390x844`.

## Verification

- `npm test`: 23 files passed, 85 tests passed.
- `npm run build:web`: Vite production web build succeeded.
- `npm run build`: AIT build succeeded and created `liar-game.ait`.
- Browser QA:
  - Start screen had no horizontal overflow at 390px.
  - 3-player quick start reached card check, discussion, secret vote, tie screen, quick judgment, liar handoff, answer reveal, and round result.
  - Tie screen kept liar inclusion hidden until quick judgment.
  - Result screen showed vote bars, judgment candidate, liar reveal, word, highlights, and next-round CTA.

## Findings

- Product/game flow is now close to playable MVP: quick start, optional names, advanced settings, pass-phone card check, discussion mission, secret voting, tie handling, liar final chance, vote-result bars, round result, scoreboard, final recap, local records, and i18n are present.
- Platform readiness is scaffolded but not live: auth, ads, and payments are still stubs behind adapters.
- Records are local-only through `localStorage`; login-backed records are not implemented.
- One result-highlight mismatch remains: `chaos` is currently set whenever the liar is not caught, but the Korean/English copy says joint nomination. This can show "혼란의 공동 지목" even when there was no joint nomination.
- The source branch has many uncommitted/untracked files. Public Pages appears to serve the same web asset hash as the latest local web build, but the source state should be committed before treating this as a clean release candidate.
- `npm run build` succeeds but emits a Node `DEP0190` warning from the AIT build tool chain.

## Recommended Next Actions

1. Fix the result-highlight mismatch and add a regression test.
2. Commit the current source/docs/tests into a clean release-candidate branch state.
3. Implement login as optional: account entry on the start screen, stronger login CTA in History/Final, and guest mode preserved.
4. Implement ads behind `AdsAdapter`: post-game interstitial and History/settings banner first; no ads inside card check, vote, discussion, or reveal moments.
5. Run mobile QA on 3-player and 6-player flows, including caught-liar, missed-liar, tie-revote, quick-judge, and final recap.
6. Deploy the verified build and record the public URL/version.

## Knowledge Promotion

- No cross-project knowledge promotion needed yet. The platform adapter and offline game placement rules are already covered by the shared app platform standard.
