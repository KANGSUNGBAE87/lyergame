# 2026-06-08 Google Play Packaging

## Actor

- codex

## User Request

- Proceed from Google Play readiness requirements into packaging, Play Console prep, testing-track prep, and login/ad release decision.

## Decisions

- Use Capacitor Android as the Google Play shell around the existing React/Vite app.
- Keep Apps in Toss build intact through the existing `ait build`.
- First Google Play build is an offline party game:
  - Login prompts hidden.
  - Ad slots hidden.
  - Payment remains deferred.
  - Android `INTERNET` permission removed.
  - Android backup disabled.
- Runtime target and feature flags are controlled by Vite env:
  - `.env.google-play`
  - `VITE_PLATFORM_TARGET=google-play`
  - `VITE_AUTH_PROMPTS=false`
  - `VITE_AD_SLOTS=false`
- Android package id: `com.kangsungbae.liargame`.
- Local upload key generated outside git at `~/.android/keystores/liar-game-upload.jks`.
- Local signing properties generated at ignored `android/keystore.properties`.

## Files Changed

- Added Play runtime config and tests:
  - `src/platform/runtimeConfig.js`
  - `test/runtimeConfig.test.js`
- Updated providers/screens to use runtime target and hide unconfigured auth/ad surfaces in Play mode:
  - `src/auth/authProvider.js`
  - `src/ads/adsProvider.js`
  - `src/payments/paymentProvider.js`
  - `src/screens/SetupScreen.jsx`
  - `src/screens/HistoryScreen.jsx`
  - `src/screens/FinalScreen.jsx`
- Added Capacitor/Android packaging:
  - `capacitor.config.json`
  - `android/`
  - package scripts for Play web build, Android sync, debug build, release bundle.
- Added Android packaging regression checks:
  - `test/androidPackaging.test.js`
- Added store prep:
  - `public/privacy.html`
  - `ai/plans/2026-06-08-google-play-internal-testing.md`
  - `ai/plans/2026-06-08-google-play-store-listing.md`
  - `store-assets/google-play/app-icon.svg`
  - `store-assets/google-play/app-icon.png`
  - `store-assets/google-play/feature-graphic.svg`
  - `store-assets/google-play/feature-graphic.png`
  - `store-assets/google-play/screenshots/01-setup.jpg`
  - `store-assets/google-play/screenshots/02-guide.jpg`
  - `scripts/generate-google-play-assets.mjs`
- Updated docs:
  - `README.md`
  - `.gitignore`
  - `package.json`
  - `package-lock.json`

## Verification

- `npm test`
  - Passed: 28 files, 98 tests.
- `npm run build:web`
  - Passed.
- `npm run assets:play`
  - Passed.
  - `app-icon.png`: 512 x 512, RGBA.
  - `feature-graphic.png`: 1024 x 500, RGB.
- `npm run build`
  - Passed.
  - AIT artifact created: `liar-game.ait`.
  - Warning remains: Node DEP0190 from AIT build tooling.
- Browser QA on Play mode preview at `http://127.0.0.1:4173/`
  - 390 x 844 viewport.
  - Setup screen had no account button, no guest-mode notice, no ad banner slot.
  - `privacy.html` loaded and contained the no-collection copy.
  - No horizontal overflow.
  - No console errors.
- Store screenshots
  - Captured clean 540 x 960 Play-mode screenshots and upscaled to 1080 x 1920 JPEG.
  - `store-assets/google-play/screenshots/01-setup.jpg`
  - `store-assets/google-play/screenshots/02-guide.jpg`
- `JAVA_HOME=/opt/homebrew/opt/openjdk@21 ANDROID_HOME=/opt/homebrew/share/android-commandlinetools ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools npm run build:android:bundle`
  - Passed.
  - AAB: `android/app/build/outputs/bundle/release/app-release.aab`
  - Size: about 3.0 MB.
  - SHA-256: `1e64c190f46552cb6f12cc5ad643ef8f81cc28d1a71c01a3971c7a30f436a1a4`
- `jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab`
  - Passed with `jar verified`.
  - Expected warnings: self-signed upload certificate and no timestamp.
- `cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ANDROID_HOME=/opt/homebrew/share/android-commandlinetools ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools ./gradlew testDebugUnitTest`
  - Passed.
- GitHub Pages privacy deployment
  - Pushed gh-pages commit `a5463f6`.
  - Verified `https://kangsungbae87.github.io/lyergame/privacy.html` returns the privacy policy.
  - Verified `https://kangsungbae87.github.io/lyergame/?v=play-privacy-20260608` returns the app shell.

## Remaining Risks

- Play Console upload has not been performed in the browser.
- Real Android device install QA has not been performed.
- Two draft phone screenshots are prepared; add pass-phone/vote/result screenshots before production for stronger conversion.
- App icon and feature graphic are acceptable internal-test drafts, but should receive final design approval before production.
- npm install continues to report existing dependency audit warnings from the broader dependency tree.
- Gradle reports deprecation warnings related to future Gradle 9 compatibility.
- If login, ads, or IAP are enabled later, update:
  - Android permissions.
  - platform adapters.
  - privacy policy.
  - Play Data Safety.
  - store declarations.

## Next Steps

1. Upload `android/app/build/outputs/bundle/release/app-release.aab` to Google Play Internal testing.
2. Add store listing copy from `ai/plans/2026-06-08-google-play-store-listing.md`.
3. Upload `store-assets/google-play/app-icon.png` and `store-assets/google-play/feature-graphic.png`.
4. Capture additional pass-phone, vote, and result screenshots before production.
5. If using a new personal Play Console account, prepare 12 testers for the 14-day closed test after internal testing.

## Knowledge Promotion

- No global workflow change needed.
- This session reinforces the existing project rule: `라이어게임` goes Google Play first while preserving Apps in Toss compatibility through adapters.
