# Liar Game i18n + Platform Adapter Readiness

## Goal

게임을 처음 접하는 사용자가 규칙과 설정 옵션을 이해할 수 있게 설명 UI를 추가하고, Apps in Toss와 Google Play 양쪽 출시를 위해 플랫폼 의존 기능을 어댑터 경계 뒤로 둔다.

## Implemented Scope

- Korean (`ko`) default and English (`en`) selectable UI locale.
- Setup screen game guide and option descriptions.
- Round options expanded to `1R`, `3R`, `5R`.
- Current game screens moved to translation keys where practical.
- Category labels and the word pack are available in Korean and English.
- Web stub providers for auth, payments, and ads.
- Platform service factory for `web`, `apps-in-toss`, and `google-play` targets.

## Adapter Boundary

Product/game logic should call shared provider interfaces only:

- `authProvider.getUser/login/logout`
- `paymentProvider.listProducts/purchase/restorePurchases/getEntitlements`
- `adsProvider.showRewarded/showInterstitial`

Future platform implementations should plug into `createPlatformServices(target)` instead of importing SDKs from game logic or React screens.

## Deferred

- Real Toss login and Apps in Toss IAP.
- Google Credential Manager or Play Games Services.
- Google Play Billing.
- AdMob or Apps in Toss ad SDK.
- Backend receipt verification and entitlement sync.
- Native-speaker copy QA for the first-pass English word translations.

## Verification Plan

- Unit tests for round options, i18n helpers, and platform adapter stubs.
- `npm test`
- `npm run build`
- Browser QA: Korean setup, English switch, visible game guide, `1R` selection, one-round game flow, final result, history record, console error/warn check.
