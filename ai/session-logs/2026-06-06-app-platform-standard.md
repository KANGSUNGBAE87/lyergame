# Session Log: App Platform Standard

Date: 2026-06-06
Actor/tool: codex

## User Request

Apply the rule that app projects should be built for Apps in Toss first while
keeping Google Play Store portability, with login, ads, and in-app purchase
planned from the beginning.

## Decisions

- `라이어게임` follows the shared standard in
  `/Users/kangsungbae/Documents/지식저장소/docs/workflows/app-platform-standard.md`.
- Apps in Toss remains the first target.
- Google Play portability should be preserved by keeping game logic in `src/logic`
  independent from platform SDKs.
- Auth, ads, IAP, storage, and backend work should be introduced through
  adapters/repositories, not direct SDK calls from game flow logic.

## Files Changed

- `AGENTS.md`
- `CLAUDE.md`
- `/Users/kangsungbae/Documents/지식저장소/projects/라이어게임/platform.md`

## Verification

- Confirmed `AGENTS.md` and `CLAUDE.md` match.
- Ran project Graphify structural refresh with
  `/Users/kangsungbae/.codex/bin/graphify update . --no-cluster`.

## Knowledge Promotion

Promoted to shared knowledge store as confirmed app-development policy.
