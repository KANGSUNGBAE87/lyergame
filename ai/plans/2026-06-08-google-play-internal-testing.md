# Google Play Internal Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Google Play internal-testing path that can produce an Android App Bundle while preserving Apps in Toss compatibility.

**Architecture:** Keep the React/Vite game as the shared product surface and wrap it with a Capacitor Android shell for Google Play. Platform-sensitive features remain behind adapters; the first Play build hides unconfigured login/ad UI and ships as an offline party game.

**Tech Stack:** React 18, Vite, Vitest, Capacitor Android, Gradle/Android SDK, Apps in Toss AIT build.

---

### Task 1: Play Release Build Mode

**Files:**
- Create: `.env.google-play`
- Create: `src/platform/runtimeConfig.js`
- Modify: `src/auth/authProvider.js`
- Modify: `src/ads/adsProvider.js`
- Modify: `src/payments/paymentProvider.js`
- Modify: `src/screens/SetupScreen.jsx`
- Modify: `src/screens/HistoryScreen.jsx`
- Modify: `src/screens/FinalScreen.jsx`
- Test: `test/runtimeConfig.test.js`

- [ ] Add Vite environment flags for Google Play: `VITE_PLATFORM_TARGET=google-play`, `VITE_AUTH_PROMPTS=false`, and `VITE_AD_SLOTS=false`.
- [ ] Add `runtimeConfig.js` helpers so runtime target and feature flags are read in one place.
- [ ] Switch providers to use `getRuntimePlatformTarget()` instead of hard-coded `web`.
- [ ] Hide account/login prompts when `isAuthPromptEnabled()` is false.
- [ ] Skip interstitial preloading/showing when `isAdSlotEnabled()` is false.
- [ ] Add tests for target normalization and boolean feature flags.

### Task 2: Android Packaging

**Files:**
- Create: `capacitor.config.json`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `android/` through `npx cap add android`

- [ ] Install Capacitor packages: `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android`.
- [ ] Add package scripts: `build:play:web`, `sync:android`, `build:android:debug`, and `build:android:bundle`.
- [ ] Configure app id as `com.kangsungbae.liargame`, app name as `라이어 게임`, and web dir as `dist`.
- [ ] Generate the Android project and keep local/secret Gradle files out of git.
- [ ] Set Android compile/target SDK to API 35 if the generated project allows it locally.

### Task 3: Store Submission Prep

**Files:**
- Create: `ai/plans/2026-06-08-google-play-store-listing.md`
- Create: `ai/session-logs/2026-06-08-google-play-packaging.md`

- [ ] Draft Korean and English store listing copy for an offline party game.
- [ ] Document required Play Console assets and data-safety answers for the current no-login/no-ad first Play build.
- [ ] Document tester-track sequence: internal test first, then closed test if the account requires 12 testers for 14 continuous days.
- [ ] Note that real Google Sign-In and AdMob require console IDs and platform adapter implementations before being claimed in the Play listing.

### Task 4: Verification

**Commands:**
- `npm test`
- `npm run build:web`
- `npm run build`
- `npm run build:play:web`
- `npm run sync:android`
- `npm run build:android:bundle` if JDK and Android SDK are available

- [ ] Run all verification commands and record exact status.
- [ ] If Android tooling is missing, record the blocker and the next command after JDK/SDK installation.
- [ ] Refresh project Graphify after verified feature completion or handoff.
