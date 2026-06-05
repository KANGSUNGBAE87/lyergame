# 라이어 게임 v2 — 설계 문서 (Design Spec)

- 작성일: 2026-06-06
- 작성 도구: Superpowers `brainstorming` 스킬 + Visual Companion
- 상태: 설계 확정 대기 (사용자 검토 단계)
- 다음 단계: `writing-plans` 스킬로 구현 계획 작성

---

## 1. 개요

핸드폰 하나로 진행자 없이 즐기는 라이어 게임. 현재 단일 `index.html`(순수 HTML/CSS/JS)로 구현되어 있는 것을, **Apps in Toss 미니앱(React + Vite)** 으로 재구축하면서 게임성·UX·데이터·코드 구조를 전면 개선한다.

### 핵심 목표
1. Apps in Toss 미니앱으로 패키징 (`@apps-in-toss/web-framework` + `granite.config.ts` + `ait build`)
2. React + Vite 기반 모듈화 구조
3. 게임플레이 확장: 라이어 수, 라운드/점수, 투표, 타이머, 역전 룰
4. 단어 데이터 고도화: 카테고리 선택, 난이도 분류
5. **카드 색상 통일** — 라이어 카드의 빨간 전체 화면 제거(옆 사람이 화면 색으로 라이어를 눈치채지 못하게)
6. 히스토리 — 이번 버전 기기 로컬 기록 + 로그인 기반 영구 기록을 위한 설계 이음새

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| UI 프레임워크 | React | 점수판·투표·타이머·히스토리 등 상태 주도 화면이 많아 채택 |
| 빌드 | Vite | 뽁뽁이와 동일 |
| 미니앱 패키징 | `@apps-in-toss/web-framework`, `granite.config.ts` | `granite dev`, `ait build`, `ait deploy` |
| 테스트 | vitest | 순수 로직(점수·라이어 배정·승패 판정) 단위 테스트 |
| 햅틱 | `@apps-in-toss/web-framework` 진동 → `navigator.vibrate` 폴백 | 뽁뽁이 `haptic.js` 패턴 재사용 |

참고 선행 프로젝트: `/Users/kangsungbae/Documents/뽁뽁이` (동일 Apps in Toss + Vite 구조, vanilla)

---

## 3. 폴더 구조

```
src/
  data/
    words.js          # 단어 데이터 + 카테고리 + 난이도 태그
  store/
    gameStore.js      # 게임 전역 상태 (설정·라운드·점수·투표)
  logic/
    assignRoles.js    # 라이어 배정 (순수 함수, 테스트 대상)
    scoring.js        # 점수 계산·승패 판정 (순수 함수, 테스트 대상)
    pickWord.js       # 카테고리/난이도 기반 단어 추출 (순수 함수)
  records/
    recordsRepository.js  # 기록 저장 인터페이스 (seam)
    localRecords.js       # localStorage 구현 (v2)
    # cloudRecords.js     # 로그인 기반 구현 (다음 버전)
  auth/
    authProvider.js   # 로그인 인터페이스 (seam, v2는 stub)
  core/
    haptic.js         # 진동 (Apps in Toss → navigator.vibrate 폴백)
  screens/
    SetupScreen.jsx       # ① 게임 설정
    PeekScreen.jsx        # ② 카드 한 명씩 확인
    DiscussScreen.jsx     # ③ 토론 + 타이머
    VoteScreen.jsx        # ④ 투표
    ReversalScreen.jsx    # ④-b 라이어 역전 (제시어 맞히기)
    ResultScreen.jsx      # ⑤ 라운드 결과 + 점수판
    FinalScreen.jsx       # 최종 우승자
    HistoryScreen.jsx     # 기록 보기
  components/
    Card.jsx          # 뒤집기/폭발 카드
    PeekModal.jsx     # 단어/라이어 공개 모달
    Timer.jsx         # 카운트다운
    Scoreboard.jsx    # 점수판
  App.jsx             # 화면 라우팅(상태 기반)
  main.jsx            # 진입점
granite.config.ts
vite.config.js
vitest.config.js
```

설계 원칙: **순수 로직(logic/)을 React에서 분리**하여 vitest로 단독 테스트한다. 화면은 store 상태를 읽어 렌더링만 한다.

---

## 4. 게임 흐름 (상태 머신)

```
SETUP → PEEK → DISCUSS → VOTE → (지목당함?) → REVERSAL → RESULT → (라운드 남음?) → PEEK ...
                                  (안 들킴)  ─────────────→ RESULT → ... → FINAL
```

| 단계 | 화면 | 설명 |
|------|------|------|
| ① 설정 | SetupScreen | 인원·라이어 수·카테고리·난이도·힌트·라운드·타이머 설정 |
| ② 카드 확인 | PeekScreen | 카드를 한 명씩 눌러 단어/라이어 확인 후 폭발 |
| ③ 토론 | DiscussScreen | 타이머(설정 시) 카운트다운. 종료/스킵 시 투표로 |
| ④ 투표 | VoteScreen | 번호별 득표 입력 → 최다 득표자 산출 |
| ④-b 역전 | ReversalScreen | 라이어가 지목당하면 제시어 맞힐 기회 |
| ⑤ 결과 | ResultScreen | 라운드 승패·점수 반영·점수판 표시 |
| 최종 | FinalScreen | 마지막 라운드 후 우승자 발표, 기록 저장 |

---

## 5. 설정 화면 옵션

| 옵션 | 값 | 기본값 |
|------|-----|--------|
| 인원수 | 3 ~ 10명 | — |
| 라이어 수 | 1명 / 2명 | 1명 (인원 6명 이상일 때만 2명 허용) |
| 카테고리 | 랜덤 / 직접 선택(복수 가능) | 랜덤 |
| 난이도 | 전체 / 쉬움 / 보통 / 어려움 | 전체 |
| 라이어 힌트 | 카테고리 공개 ON / OFF | ON |
| 라운드 수 | 3 / 5 라운드 | 3 |
| 타이머 | 없음 / 1 / 2 / 3분 | 없음 |

라이어 힌트 OFF: 라이어 카드는 "라이어!"만 표시(카테고리 숨김). ON: "라이어 / 카테고리: 음식".

---

## 6. 점수 규칙

`N` = 플레이어 수, `liarScore = ceil(N / 2)`.

| 결과 | 조건 | 점수 |
|------|------|------|
| 시민 승리 | 투표로 라이어 지목 + 라이어 역전 실패 | 시민 전원 +1 |
| 라이어 승리(은폐) | 최다 득표가 시민(라이어 안 들킴) | 라이어 +`liarScore` |
| 라이어 승리(역전) | 라이어 지목됐으나 제시어 맞힘 | 라이어 +`liarScore` |

- N=3~4 → 라이어 2점 / 5~6 → 3점 / 7~8 → 4점 / 9~10 → 5점
- 라이어 2명일 경우 각 라이어가 동일하게 `liarScore` 획득 (밸런스는 플레이 테스트 후 조정 가능 — `scoring.js` 상수로 분리)
- 동점 처리: 최종 동점 시 공동 우승 표시

`scoring.js` 시그니처(예):
```
calcRoundScore({ playerCount, liarIndices, votedOutIndices, reversalSuccess }) → { perPlayerDelta: number[] }
```

---

## 7. 라이어 역전 룰

1. 투표 결과 최다 득표자가 **라이어가 아니면** → 라이어 은폐 승리 → RESULT.
2. 최다 득표자가 **라이어이면** → ReversalScreen으로 이동, 라이어에게 제시어 맞힐 기회.
   - 입력 방식: 같은 카테고리 단어 객관식(예: 4지선다, 정답 1 + 오답 3 랜덤) 또는 "맞혔다/틀렸다" 수동 판정 토글. **기본은 수동 판정**(오프라인 대면 게임 특성상 진행자가 구두 정답을 듣고 판정) + 보조로 객관식 제공.
   - 맞힘 → 라이어 역전승. 틀림 → 시민 승리.
3. 라이어 2명이고 둘 중 1명만 지목된 경우: 지목된 라이어에게 역전 기회. (세부 룰은 구현 시 `logic`에서 명시)

---

## 8. 단어 데이터 & 난이도

### 데이터 형태
기존 20개 카테고리 ~2000개 단어를 유지하되, 각 단어에 난이도를 부여.

```js
// src/data/words.js
export const WORDS = {
  "음식": [
    { w: "김치", d: 1 }, { w: "탕수육", d: 2 }, ...
  ],
  ...
};
// d: 1=쉬움, 2=보통, 3=어려움
```

### 난이도 기준 ("라이어가 묻어가기 쉬운 정도")
- **1 쉬움**: 초등학생도 아는 일상 단어. 설명이 쉬워 라이어가 금방 들킴. (사과, 김치, 개, 축구, 연필)
- **2 보통**: 알지만 설명에 한 단계 더 필요. (펜싱, 아코디언, 브로콜리, 자몽)
- **3 어려움**: 같은 카테고리에 유사어가 많거나 덜 흔해 라이어가 묻어가기 쉬움. (숭어, 농어, 두릅, 오보에, 한라봉)

### 태깅 방법
구현 단계에서 위 기준에 따라 전체 단어에 난이도를 부여한다(LLM 보조 분류 후 검토). 설정의 난이도 선택은 해당 등급 단어만 출제하며, '전체'는 모든 등급에서 추출.

---

## 9. 카드 색상 통일 (핵심 요청)

- 기존: 라이어 모달이 빨강 그라디언트 전체 배경 → 옆 사람이 화면 색만 보고 라이어 식별 가능 (문제).
- 변경: **라이어 카드와 단어 카드의 배경을 동일하게** (밝은 화이트~연핑크 그라디언트). 구분은 카드 내부 콘텐츠(아이콘/텍스트)로만.
  - 단어 카드: 카테고리 칩 + 단어.
  - 라이어 카드: 동일 배경 + 라이어 표시(텍스트/아이콘). 빨간 풀스크린 제거.
- 모달 진입/퇴장 애니메이션·확인 시간(약 2초)·폭발 효과는 유지.

---

## 10. 히스토리 & 로그인(점수 기록)

### 설계 이음새(seam)
점수/전적 저장을 인터페이스로 추상화하여, 로그인 도입 시 구현만 교체.

```
recordsRepository = {
  saveGame(record): Promise<void>,
  listGames(): Promise<GameRecord[]>,
}
authProvider = {
  getUser(): Promise<User | null>,   // null = 비로그인
  login(): Promise<User>,
}
```

### 단계별 범위
- **v2 (이번)**: `localRecords`(localStorage)로 기기 로컬 전적 저장·조회. `authProvider`는 stub(비로그인). HistoryScreen은 로컬 기록 표시.
- **다음 버전(로그인 도입)**: Apps in Toss 사용자 식별(토스 로그인)로 `authProvider` 구현 → 사용자 ID 기준 `cloudRecords`(원격 저장)로 교체. 기존 로컬 기록은 로그인 시 병합/업로드 고려.

이 구조 덕분에 "로그인 가정하의 점수 기록"이 화면/로직 수정 없이 저장소 구현 교체만으로 가능.

### 기록 레코드(예)
```
GameRecord {
  date, playerCount, rounds, categories, difficulty,
  scores: number[],  winnerIndices: number[],
  perRound: [{ liarIndices, word, category, votedOut, reversal, deltas }]
}
```

---

## 11. 햅틱 / 사운드

- 카드 확인 시(시민/라이어 **구분 없이**) 동일한 진동 1회.
- `core/haptic.js`: Apps in Toss 브리지 존재 시 프레임워크 진동, 아니면 `navigator.vibrate` 폴백, 둘 다 없으면 무시.
- 사운드(BGM/효과음)는 이번 범위 제외(YAGNI).

---

## 12. Apps in Toss 설정

`granite.config.ts` (뽁뽁이 패턴 차용):
```ts
import { defineConfig } from '@apps-in-toss/web-framework/config';
export default defineConfig({
  appName: 'liar-game',            // 확정 전 임시
  brand: {
    displayName: '라이어 게임',     // 확정 전 임시
    primaryColor: '#8338ec',       // 확정 전 임시
    icon: '',
  },
  web: { host: 'localhost', port: 5173,
    commands: { dev: 'vite dev', build: 'vite build' } },
  webViewProps: { bounces: false, pullToRefreshEnabled: false,
    overScrollMode: 'never', allowsBackForwardNavigationGestures: false },
  permissions: [],
  outdir: 'dist',
});
```
앱 이름/색/아이콘은 기본값으로 시작, 추후 확정.

---

## 13. 테스트 전략

- **단위 테스트(vitest)** — 순수 로직만:
  - `assignRoles`: 라이어 수만큼 중복 없이 배정, 인덱스 범위 검증.
  - `scoring.calcRoundScore`: 시민 승/은폐 승/역전 승 각 케이스, N별 `ceil(N/2)`, 라이어 2명.
  - `pickWord`: 카테고리/난이도 필터링, 빈 결과 방지.
- **UI 검증** — 라이브 프리뷰로 화면 흐름 수동 확인(설정→확인→투표→역전→결과).
- 마일스톤에서 `review` / `qa` / `verification-before-completion` 적용 (소규모 솔로 프로젝트 HYBRID 정책).

---

## 14. 마이그레이션 노트

- 기존 `index.html`의 단어 데이터(WORDS), LIAR SVG, 폭발/파티클 애니메이션, peek 모달 UX는 자산으로 이식.
- 단어 배열 → `{ w, d }` 객체 배열로 변환(난이도 부여).
- 기존 단일 파일은 참고용으로 보존하거나 `legacy/`로 이동.

---

## 15. 범위 밖 (YAGNI / 다음 버전)

- 실제 로그인/백엔드 구현(이번엔 seam만)
- BGM/효과음
- 온라인 멀티플레이(원격 동시 접속)
- 커스텀 단어 직접 입력(추후 후보)

---

## 16. 열린 항목(구현 중 확정)

- 라이어 2명 시 역전·점수 세부 밸런스
- 역전 객관식 보기 구성 방식(자동 4지선다 vs 수동 판정 우선순위)
- 앱 메타데이터(이름/색/아이콘) 최종값
