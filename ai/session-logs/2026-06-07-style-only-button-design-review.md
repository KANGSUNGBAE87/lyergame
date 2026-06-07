# 2026-06-07 Style-Only Button Design Review

## Actor
- codex

## User Request
- Apply only the approved style direction from the design preview to the actual app.
- Do not change the app flow or layout.
- Run a design review after applying the style.

## Decisions
- Kept the existing React screens and interaction flow unchanged.
- Applied the style layer only in `src/styles/main.css`.
- Used role-based button colors:
  - orange for quick start
  - teal for progress/confirm actions
  - rose for suspicious/negative emphasis
  - amber for selected presets and scoring emphasis
- Replaced broad multi-color button gradients with restrained two-stop physical buttons.
- Preserved keyboard focus accessibility with explicit `:focus-visible` rings.

## Files Changed
- `src/styles/main.css`

## Verification
- `npm test`: 20 files passed, 74 tests passed.
- `npm run build`: passed and produced `liar-game.ait`.
- Browser visual QA at `http://localhost:5173/` on 390x844 viewport:
  - setup screen
  - card/pass-phone flow
  - secret vote selection
  - liar accusation screen
  - liar handoff/result confirmation screen
- Browser console errors/warnings: none observed.

## Design Review Summary
- The plus/minus controls now read as tactile 3D controls and invite tapping.
- The quick-start CTA is more prominent without turning every primary action red.
- Language selection contrast is clearer than the previous pale mint treatment.
- Vote selection now has a stronger role distinction: selected suspect is rose, save/progress remains teal.
- Result and handoff screens keep the same flow while using more confident action buttons.

## Remaining Risks
- The overall layout is still the current app layout, not the full Figma/static-preview redesign.
- The card artwork still uses the older gradient-heavy card treatment because this pass was intentionally style-only.
- Final polish should include one more device pass for thumb reach and physical shadow strength on real mobile brightness.

## Knowledge Promotion
- No new cross-project standard needed. This is project-specific design polish.
