# Result Screen Candidate And Missed Status

- Date: 2026-06-07
- Actor/tool: codex
- User request: Move the judgment candidate above the vote result, make the candidate visually clearer, and show "라이어를 놓쳤어요" under "라이어 승리" with a more regretful border style.

## Decisions

- Show the missed status under the result title only when the liar won because the vote did not catch a liar.
- Avoid duplicating the same missed text inside the result panel.
- Keep "라이어 지목 성공" inside the result panel for caught-liar cases.
- Put the judgment candidate card before the vote-result bars and style it as a stronger orange-tinted summary card.

## Files Changed

- `src/screens/ResultScreen.jsx`
- `src/styles/main.css`
- `test/resultScreenFlow.test.js`

## Verification

- `npm test test/resultScreenFlow.test.js`
- `npm run build`
- `npm test`
- In-app browser loaded `http://localhost:5173/` with title `라이어 게임`, start content visible, and no console warnings/errors.

## Notes And Risks

- A deeper manual browser run toward the result screen was stopped by the browser tool's URL policy during the vote flow, so final visual confirmation of the result screen was not completed in-browser.
- The logic is covered with a small utility test so caught-liar reversal wins do not show "라이어를 놓쳤어요".

## Knowledge Promotion

- No cross-project reusable knowledge promotion needed.
