# 2026-06-07 Setup UI Polish

## Actor

- Codex

## User Request

- Make `이름 입력` feel like a clear expandable control.
- Add motion to the `바로 시작` button so it reads as the main action.
- Improve the `언어 한국어` badge readability.
- Change `자세히 읽기` to `게임방법`.
- Fix the game-method modal that appeared to have no content.

## Root Cause

- The guide modal content existed in the DOM, but bright-theme CSS overrides made some modal list text dark while the panel was still dark, so the content looked empty.
- The optional name editor used a plain native `<details>` summary with no visible affordance beyond the text.
- The locale badge used a yellow accent on a bright background, which reduced readability.

## Changes

- Added visible `펼치기` / `접기` text and a chevron to the optional player-name editor.
- Added a small open/close animation for the name editor content.
- Added a subtle pulse and shine animation to the primary `바로 시작` button.
- Changed guide CTA copy to `게임방법` in Korean and `How to play` in English.
- Restyled the guide modal as a light reading panel with clear text contrast.
- Restyled the active locale badge with a teal pill for stronger readability.
- Added `test/playerNamesEditor.test.js` and extended `test/i18n.test.js`.

## Verification

- `npm test`: 16 test files passed, 63 tests passed.
- `npm run build`: AIT build completed and produced `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/`:
  - Mobile setup screen has no horizontal overflow.
  - Name editor shows `펼치기`, opens to `접기`, and shows name placeholders.
  - Guide button is `게임방법`; old `자세히 읽기` copy is absent.
  - Guide modal shows all text with readable contrast and no current console errors.
- `graphify update . --no-cluster`: rebuilt code graph with 580 nodes and 11371 edges.

## Remaining Risks

- The start-button motion is intentionally subtle; playtest feedback may decide whether to make it calmer or more playful.
