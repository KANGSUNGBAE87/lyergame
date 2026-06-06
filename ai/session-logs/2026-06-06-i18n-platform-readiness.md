# 2026-06-06 i18n + Platform Adapter Readiness

## Actor

- codex

## User Request

- 멀티 플랫폼 환경은 어댑터 방식으로 준비하고, 당장 미구현된 설명/다국어/로그인/결제 준비를 구현.
- 라운드 선택에 `1R` 추가.

## Decisions

- 실제 Toss/Google SDK 연동은 아직 붙이지 않고 `web`, `apps-in-toss`, `google-play` 대상의 provider stub을 만든다.
- 한국어 UI를 기본값으로 유지하고 영어 UI 선택을 제공한다.
- 단어팩은 후속 배치에서 한국어/영어 병렬 구조로 분리했다. 영어 번역 품질 검토는 별도 QA로 둔다.
- 결제 상품은 우선 `premium_pack` ID를 non-consumable 상품 후보로 정의한다.

## Files Changed

- `src/config/gameOptions.js`
- `src/i18n/messages.js`
- `src/i18n/I18nProvider.jsx`
- `src/platform/platformServices.js`
- `src/auth/authProvider.js`
- `src/payments/paymentProvider.js`
- `src/ads/adsProvider.js`
- `src/screens/*`
- `src/components/*`
- `src/styles/main.css`
- `test/gameOptions.test.js`
- `test/i18n.test.js`
- `test/platformAdapters.test.js`
- `ai/plans/2026-06-06-i18n-platform-readiness.md`

## Verification

- Red test first: new tests failed because `gameOptions`, `i18n`, and platform adapter modules were missing.
- Targeted tests after implementation: `test/gameOptions.test.js`, `test/i18n.test.js`, `test/platformAdapters.test.js` passed.
- Full `npm test` passed.
- `npm run build` passed and generated `liar-game.ait`.
- Browser QA on `http://127.0.0.1:5174/`:
  - Korean title and game guide visible.
  - `1R` option visible.
  - English switch changed title to `Liar Game` and guide to `How to play`.
  - English category labels visible after opening the category selector.
  - 6-player `1R` game completed through card reveal, vote, reversal failure, final result, and history record.
  - Browser console error/warn logs were empty.

## Remaining Risks

- English word translations are first-pass static copy and need native-speaker/copy QA before store release.
- Real login/payment/ad SDKs still need platform-specific implementations and store credentials.
- Paid entitlements must be verified by a backend before enabling real purchases.

## Knowledge Promotion

- Project-local log is enough for now. Promote to shared knowledge only after real platform SDK implementation or store submission flow is defined.
