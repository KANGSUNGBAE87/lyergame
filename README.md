# 라이어 게임 (Liar Game)

한 대의 휴대폰을 돌려 쓰며 빠르게 시작하는 오프라인 라이어 파티 게임입니다.

## 현재 구조

- Web: React 18 + Vite
- Apps in Toss: `ait build` 산출물 유지
- Google Play: Capacitor Android shell로 `.aab` 생성
- Platform seams: auth, ads, payments, records, storage adapters
- i18n: Korean default, English selectable

## 실행

```bash
npm install
npm run dev:web
```

## 빌드

```bash
npm test
npm run build:web
npm run build
```

## Google Play 내부 테스트용 Android 빌드

Google Play 첫 빌드는 로그인/광고/결제를 숨긴 오프라인 게임 모드입니다.

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@21 \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools \
npm run build:android:bundle
```

산출물:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

로컬 서명 파일:

```text
~/.android/keystores/liar-game-upload.jks
android/keystore.properties
```

`android/keystore.properties`와 keystore 파일은 git에 커밋하지 않습니다.

## Store Prep

- Google Play 등록 초안: `ai/plans/2026-06-08-google-play-store-listing.md`
- 개인정보처리방침: `public/privacy.html`
- Play package id: `com.kangsungbae.liargame`
