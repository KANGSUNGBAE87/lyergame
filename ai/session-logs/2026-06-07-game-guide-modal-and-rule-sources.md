# 2026-06-07 Game Guide Modal and Rule Sources

## Actor

- codex

## User Request

- 라이어게임을 자세히 설명한 자료를 먼저 찾아서 판단할 수 있게 한다.
- 설정 화면의 게임 방법을 단순 토글이 아니라 누르면 새 창처럼 읽을 수 있는 방식으로 바꾼다.

## Reference Sources Found

- Google Play `피노키오 라이어게임` (`https://play.google.com/store/apps/details?hl=ko&id=eat.yangtaeho.pinoc`): players check the word, explain it in turn, the liar bluffs, and a caught liar can reverse by guessing the word.
- ImposterGame Korean guide (`https://impostergame.net/ko`): local mode explains player setup, phone passing, hint/discussion, voting, and reveal flow.
- PartyPlay Impostor guide (`https://www.partyplay.games/en/impostor/`): explains the social deduction pattern, clue tips, voting, and optional word-guess reversal.
- AppAdvice listing for `Imposter Party Game - Liar` (`https://appadvice.com/game/app/imposter-party-game-liar/6751882611`): summarizes category selection, phone passing, clues, discussion, voting, and liar objectives.

## Decisions

- Keep the setup screen short, with a `자세히 읽기` / `Read details` button.
- Move the longer rules into a modal reading surface with `role="dialog"` and an explicit close button.
- Keep all visible copy in `src/i18n/messages.js` so the final wording can be replaced after the user reviews source material.
- Organize the guide into goal, round flow, clue/discussion tips, and setting explanations.

## Files Changed

- `src/components/GuideDialog.jsx`
- `src/screens/SetupScreen.jsx`
- `src/i18n/messages.js`
- `src/styles/main.css`
- `test/guideDialog.test.js`

## Verification

- Red test first: `npm test -- test/guideDialog.test.js` failed because `GuideDialog` did not exist.
- Targeted test after implementation: `npm test -- test/guideDialog.test.js` passed with 2 tests.
- Targeted i18n check: `npm test -- test/i18n.test.js test/guideDialog.test.js` passed.
- Full tests: `npm test` passed with 10 files and 43 tests.
- Build: `npm run build` passed and generated `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/`:
  - Setup screen shows a `자세히 읽기` button instead of an inline toggle.
  - Clicking it opens a `게임 방법` dialog.
  - The dialog includes `승리 목표`, `진행 순서`, `힌트와 토론 요령`, and `설정 선택지`.
  - The close button removes the dialog.
  - Fresh reload after QA had no new browser console errors or warnings.

## Remaining Risks

- The guide copy is a structured first draft. Final wording should be reviewed against the user's preferred source material before store release.
- External guide sources describe similar Impostor/Liar variants, so app copy should keep matching this app's exact scoring and reversal rules.

## Knowledge Promotion

- Project-local log is enough for now. Promote to shared knowledge only if this modal guide pattern becomes reusable across multiple game projects.
