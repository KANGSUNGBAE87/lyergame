# Google Play Store Listing Draft

## Release Strategy

- First Play submission target: offline party game, no login, no ads, no in-app purchases.
- Package name: `com.kangsungbae.liargame`.
- Current AAB path after build: `android/app/build/outputs/bundle/release/app-release.aab`.
- Privacy policy path in the web build: `/privacy.html`.
- Privacy policy URL: `https://kangsungbae87.github.io/lyergame/privacy.html` (deployed and verified).

## Korean Listing

### App Name

라이어 게임

### Short Description

휴대폰 하나로 바로 시작하는 오프라인 라이어 파티 게임

### Full Description

라이어 게임은 한 대의 휴대폰을 돌려 쓰며 즐기는 오프라인 파티 게임입니다.

인원수만 고르면 바로 시작할 수 있고, 각 플레이어는 자기 차례에만 카드를 확인합니다. 시민은 같은 제시어를 보고, 라이어는 제시어를 모른 채 힌트와 토론을 따라가야 합니다. 토론 후 비밀투표로 라이어를 지목하고, 결과 화면에서 라이어 공개와 라운드 리캡을 확인할 수 있습니다.

주요 기능:
- 빠른 시작: 인원수만 고르고 바로 플레이
- 패스폰 진행: 한 대의 휴대폰을 순서대로 넘기며 카드 확인
- 비밀투표: 누가 누구를 찍었는지 숨기고 결과 패턴만 공개
- 라이어 공개: 투표 결과와 판정, 라이어 공개를 한 화면에서 확인
- 결과 리캡: 가장 의심받은 사람, 억울한 시민, 최고의 라이어 등 하이라이트 제공
- 오프라인 플레이: 로그인 없이 기기 안에서 바로 사용
- 한국어/영어 지원

모임, MT, 술자리, 보드게임 모임, 가족 게임 시간에 가볍게 시작할 수 있는 파티 게임입니다.

## English Listing

### App Name

Liar Game

### Short Description

Fast offline pass-phone party game for friends

### Full Description

Liar Game is an offline party game played by passing one phone around the group.

Choose the number of players and start right away. Each player checks their secret card only on their turn. Citizens see the same word, while the liar has to blend in without knowing the word. After discussion, players vote secretly, reveal the result, and enjoy a quick recap of the round.

Key features:
- Fast start with sensible defaults
- Pass-phone card reveal flow
- Secret voting with result patterns
- Dramatic liar reveal and round result
- Final recap for multi-round games
- Offline play with no required login
- Korean and English language support

Great for parties, gatherings, trips, board game nights, and quick group games.

## Play Console Classification Draft

- Category: Game / Word or Casual. `Word` is more semantically accurate; `Casual` may fit broader party discovery.
- Ads declaration for first Play build: No ads.
- In-app purchases declaration for first Play build: No in-app purchases.
- App access: All functionality available without login.
- Data Safety draft: No data collected, no data shared. Local-only game records/settings may be stored on device.
- Content rating expectation: Low intensity social deduction / no violence / no gambling. Confirm through the official questionnaire.
- Target audience: General party-game audience. Avoid claiming child-directed content unless intentionally designed for children.

## Store Assets

- Draft 512 x 512 app icon PNG: `store-assets/google-play/app-icon.png`.
- Draft 1024 x 500 feature graphic PNG: `store-assets/google-play/feature-graphic.png`.
- SVG sources: `store-assets/google-play/app-icon.svg`, `store-assets/google-play/feature-graphic.svg`.
- Regenerate PNG files with `npm run assets:play`.
- Draft phone screenshots:
  - `store-assets/google-play/screenshots/01-setup.jpg` (1080 x 1920)
  - `store-assets/google-play/screenshots/02-guide.jpg` (1080 x 1920)
- Recommended additional production screenshots:
  - Pass-phone card reveal.
  - Secret voting.
  - Liar reveal / result recap.
- Developer contact email and website in Play Console.

The icon and feature graphic are acceptable as internal-test drafts. Run a final design review before production listing.

## Testing Track Plan

1. Upload signed AAB to Internal testing first.
2. Verify install, app launch, offline play, screen sizing, language switch, and game completion on real Android devices.
3. If this is a newly created personal Play Console account, prepare Closed testing with at least 12 testers opted in for 14 continuous days before applying for production access.
4. Collect tester notes about setup speed, confusion points, and result-screen fun. Keep a concise feedback summary for the production-access questionnaire.

## Later Login and Ads Release

Do not claim login or ads in the first Play listing. When ready:

- Add Google Sign-In or Play Games Services through the existing auth adapter.
- Add AdMob through the existing ads adapter.
- Re-add `android.permission.INTERNET` only when the app actually needs network access.
- Update Privacy Policy and Data Safety before uploading that build.
- Add test IDs first, then production ad unit IDs only after AdMob/Play Console setup is complete.
