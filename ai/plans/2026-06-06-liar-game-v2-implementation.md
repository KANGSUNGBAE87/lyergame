# 라이어 게임 v2 구현 계획 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 단일 `index.html` 라이어 게임을 React + Vite + Apps in Toss 미니앱으로 재구축하고, 라운드/점수/투표/역전/타이머/난이도/히스토리 기능을 추가한다.

**Architecture:** 순수 로직(`src/logic/`, `src/data/`, `src/store/`, `src/records/`)을 React에서 분리해 vitest로 단위 테스트한다. React 화면(`src/screens/`)은 store 상태를 읽어 렌더링만 하며 상태 기반으로 라우팅한다. 저장/로그인은 seam 인터페이스로 추상화해 로그인 도입 시 구현만 교체한다.

**Tech Stack:** React 18, Vite 6, `@apps-in-toss/web-framework`, `granite.config.ts`, vitest, `@vitejs/plugin-react`

**설계 문서:** `ai/plans/2026-06-06-liar-game-v2-design.md`
**참고 선행 프로젝트:** `/Users/kangsungbae/Documents/뽁뽁이` (동일 Apps in Toss + Vite 패턴, vanilla)

---

## 파일 구조

| 파일 | 책임 |
|------|------|
| `package.json`, `vite.config.js`, `vitest.config.js`, `granite.config.ts`, `index.html` | 프로젝트 스캐폴딩 |
| `src/main.jsx`, `src/App.jsx` | React 진입점, 상태 기반 화면 라우팅 |
| `src/data/words.js` | 단어 데이터(`{ w, d }`) + 카테고리 |
| `src/logic/pickWord.js` | 카테고리/난이도 기반 단어 추출 (순수) |
| `src/logic/assignRoles.js` | 라이어 배정 (순수) |
| `src/logic/scoring.js` | 점수·승패 판정 (순수) |
| `src/store/gameStore.jsx` | 게임 전역 상태 (React context + reducer) |
| `src/core/storage.js` | localStorage 영속 계층 (seam) |
| `src/core/haptic.js` | 진동 추상화 |
| `src/records/recordsRepository.js`, `localRecords.js` | 전적 저장 인터페이스 + 로컬 구현 |
| `src/auth/authProvider.js` | 로그인 인터페이스 (v2 stub) |
| `src/screens/*.jsx` | Setup·Peek·Discuss·Vote·Reversal·Result·Final·History |
| `src/components/*.jsx` | Card·PeekModal·Timer·Scoreboard |
| `src/styles/main.css` | 전역 스타일 |
| `test/*.test.js` | 순수 로직 단위 테스트 |

---

## Task 0: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `vite.config.js`, `vitest.config.js`, `granite.config.ts`, `index.html`, `test/setup.js`, `src/main.jsx`, `src/App.jsx`, `src/styles/main.css`
- Note: 기존 `index.html`은 `legacy/index.html`로 이동(참고 보존)

- [ ] **Step 1: 기존 index.html 보존**

```bash
mkdir -p legacy && git mv index.html legacy/index.html
```

- [ ] **Step 2: package.json 작성**

```json
{
  "name": "liar-game",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "description": "라이어 게임 - 진행자 없이 즐기는 파티 게임 (앱인토스 미니앱)",
  "scripts": {
    "dev": "granite dev",
    "dev:web": "vite --port 5173",
    "build": "ait build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0",
    "vitest": "^4.1.8"
  },
  "dependencies": {
    "@apps-in-toss/web-framework": "^2.6.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

- [ ] **Step 3: vite.config.js 작성**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', target: 'es2018' },
  server: { host: 'localhost', port: 5173 },
});
```

- [ ] **Step 4: vitest.config.js 작성**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.js'],
  },
});
```

- [ ] **Step 5: test/setup.js 작성 (뽁뽁이 패턴 차용)**

```js
/* 테스트용 인메모리 localStorage 폴리필 */
class MemStorage {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i) { return [...this.m.keys()][i] ?? null; }
  get length() { return this.m.size; }
}
globalThis.localStorage = new MemStorage();
```

- [ ] **Step 6: granite.config.ts 작성 (뽁뽁이 패턴 차용)**

```ts
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'liar-game',
  brand: {
    displayName: '라이어 게임',
    primaryColor: '#8338ec',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: { dev: 'vite dev', build: 'vite build' },
  },
  webViewProps: {
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
  },
  permissions: [],
  outdir: 'dist',
});
```

- [ ] **Step 7: index.html 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#0f0c29" />
  <title>라이어 게임</title>
  <link rel="stylesheet" href="/src/styles/main.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 8: src/main.jsx 작성**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```

- [ ] **Step 9: src/App.jsx 임시 골격 작성**

```jsx
export default function App() {
  return <div className="screen"><h1 className="title">라이어 게임</h1></div>;
}
```

- [ ] **Step 10: src/styles/main.css 작성 (기존 디자인 토큰 이식)**

```css
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body {
  margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "맑은 고딕", sans-serif;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #fff; -webkit-user-select: none; user-select: none;
}
#root { width: 100%; height: 100%; }
.screen {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 24px 16px;
}
.title {
  font-size: 42px; font-weight: 900;
  background: linear-gradient(45deg, #ff006e, #ffbe0b, #fb5607);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  text-align: center; margin: 0 0 8px;
}
.primary-btn {
  border: none; background: linear-gradient(145deg, #ff006e, #8338ec);
  color: #fff; font-size: 18px; font-weight: 700; padding: 16px 40px;
  border-radius: 50px; cursor: pointer; box-shadow: 0 8px 24px rgba(255,0,110,.4);
}
.primary-btn:active { transform: scale(0.95); }
```

- [ ] **Step 11: 의존성 설치 및 dev 서버 기동 확인**

Run: `npm install && npm run dev:web`
Expected: localhost:5173에서 "라이어 게임" 타이틀이 보임

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold React+Vite+AppsInToss project structure"
```

---

## Task 1: storage.js 영속 계층 (seam)

**Files:**
- Create: `src/core/storage.js`, `test/storage.test.js`

- [ ] **Step 1: 실패하는 테스트 작성**

```js
// test/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import * as storage from '../src/core/storage.js';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('get은 미존재 시 fallback 반환', () => {
    expect(storage.get('nope', 'def')).toBe('def');
  });
  it('set/get 왕복', () => {
    storage.set('k', 'v');
    expect(storage.get('k')).toBe('v');
  });
  it('JSON 왕복', () => {
    storage.setJSON('obj', { a: 1 });
    expect(storage.getJSON('obj', null)).toEqual({ a: 1 });
  });
  it('손상된 JSON은 fallback', () => {
    storage.set('bad', '{not json');
    expect(storage.getJSON('bad', 42)).toBe(42);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run test/storage.test.js`
Expected: FAIL ("Cannot find module '../src/core/storage.js'")

- [ ] **Step 3: 구현 작성 (뽁뽁이 storage.js 차용, NS 변경)**

```js
// src/core/storage.js
const NS = 'liar:';

function safeGet(key) {
  try { return localStorage.getItem(NS + key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(NS + key, value); } catch { /* ignore */ }
}

export function get(key, fallback = null) {
  const v = safeGet(key);
  return v === null ? fallback : v;
}
export function set(key, value) { safeSet(key, String(value)); }

export function getJSON(key, fallback) {
  const raw = safeGet(key);
  if (raw === null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
export function setJSON(key, value) { safeSet(key, JSON.stringify(value)); }
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run test/storage.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/storage.js test/storage.test.js
git commit -m "feat: add storage persistence layer (seam)"
```

---

## Task 2: 단어 데이터 변환 + pickWord 로직

**Files:**
- Create: `src/data/words.js`, `src/logic/pickWord.js`, `test/pickWord.test.js`

**난이도 기준 (설계 §8):** d=1 쉬움(일상 단어), d=2 보통(설명 한 단계 필요), d=3 어려움(유사어 많거나 덜 흔함).

- [ ] **Step 1: words.js 작성 — 기존 `legacy/index.html`의 WORDS 20개 카테고리 853개 단어를 `{ w, d }` 형태로 변환**

각 카테고리 배열의 모든 단어에 난이도 `d`를 부여한다. 기준은 위 설계 §8. 구조 예:

```js
// src/data/words.js
export const WORDS = {
  "음식": [
    { w: "김치", d: 1 }, { w: "라면", d: 1 }, { w: "김밥", d: 1 },
    { w: "탕수육", d: 2 }, { w: "잡채", d: 2 }, { w: "수제비", d: 2 },
    { w: "보쌈", d: 2 }, { w: "순대", d: 2 }, { w: "수육", d: 3 }
  ],
  // 나머지 19개 카테고리도 legacy WORDS의 모든 단어를 빠짐없이 포함
};
export const CATEGORIES = Object.keys(WORDS);
export const WORD_COUNT = Object.values(WORDS).reduce((sum, words) => sum + words.length, 0);
```

작업 규칙: `legacy/index.html`의 각 단어를 빠짐없이 옮기되, 흔한 일상어=1, 약간 설명 필요=2, 유사어 많음/희귀=3으로 분류. `WORD_COUNT`가 853인지 테스트로 검증한다.

- [ ] **Step 2: 실패하는 테스트 작성**

```js
// test/pickWord.test.js
import { describe, it, expect } from 'vitest';
import { pickWord } from '../src/logic/pickWord.js';
import { CATEGORIES } from '../src/data/words.js';

describe('pickWord', () => {
  it('카테고리 미지정 시 랜덤 카테고리에서 단어 반환', () => {
    const r = pickWord({});
    expect(CATEGORIES).toContain(r.category);
    expect(typeof r.word).toBe('string');
    expect(r.word.length).toBeGreaterThan(0);
  });
  it('지정 카테고리에서만 추출', () => {
    const r = pickWord({ categories: ['음식'] });
    expect(r.category).toBe('음식');
  });
  it('난이도 필터: 지정 난이도만', () => {
    for (let i = 0; i < 30; i++) {
      const r = pickWord({ categories: ['음식'], difficulty: 1 });
      expect(r.difficulty).toBe(1);
    }
  });
  it('difficulty 0(전체)은 모든 등급 허용', () => {
    const r = pickWord({ difficulty: 0 });
    expect([1, 2, 3]).toContain(r.difficulty);
  });
  it('해당 난이도 단어가 없으면 전체에서 폴백', () => {
    const r = pickWord({ categories: ['음식'], difficulty: 3 });
    expect(r.word).toBeTruthy();
  });
});
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npx vitest run test/pickWord.test.js`
Expected: FAIL ("Cannot find module pickWord.js")

- [ ] **Step 4: pickWord 구현**

```js
// src/logic/pickWord.js
import { WORDS, CATEGORIES } from '../data/words.js';

function randOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* opts: { categories?: string[], difficulty?: 0|1|2|3 } (0 또는 미지정 = 전체) */
export function pickWord(opts = {}) {
  const cats = (opts.categories && opts.categories.length) ? opts.categories : CATEGORIES;
  const category = randOf(cats);
  const all = WORDS[category];
  const diff = opts.difficulty || 0;
  let pool = diff ? all.filter(x => x.d === diff) : all;
  if (pool.length === 0) pool = all; // 폴백
  const chosen = randOf(pool);
  return { category, word: chosen.w, difficulty: chosen.d };
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run test/pickWord.test.js`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add src/data/words.js src/logic/pickWord.js test/pickWord.test.js
git commit -m "feat: add word data with difficulty tags and pickWord logic"
```

---

## Task 3: assignRoles 로직 (라이어 배정)

**Files:**
- Create: `src/logic/assignRoles.js`, `test/assignRoles.test.js`

- [ ] **Step 1: 실패하는 테스트 작성**

```js
// test/assignRoles.test.js
import { describe, it, expect } from 'vitest';
import { assignRoles } from '../src/logic/assignRoles.js';

describe('assignRoles', () => {
  it('라이어 수만큼 배정', () => {
    const r = assignRoles(6, 2);
    expect(r.length).toBe(2);
  });
  it('인덱스는 0..N-1 범위, 중복 없음', () => {
    const r = assignRoles(5, 2);
    const set = new Set(r);
    expect(set.size).toBe(2);
    r.forEach(i => { expect(i).toBeGreaterThanOrEqual(0); expect(i).toBeLessThan(5); });
  });
  it('라이어 수 1 기본', () => {
    expect(assignRoles(4, 1).length).toBe(1);
  });
  it('라이어 수가 인원 이상이면 인원-1로 제한', () => {
    expect(assignRoles(3, 5).length).toBe(2);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run test/assignRoles.test.js`
Expected: FAIL

- [ ] **Step 3: 구현 작성**

```js
// src/logic/assignRoles.js
/* N명 중 liarCount명을 라이어로 배정. 0..N-1 인덱스 배열 반환(중복 없음). */
export function assignRoles(playerCount, liarCount = 1) {
  const count = Math.min(Math.max(1, liarCount), playerCount - 1);
  const idx = Array.from({ length: playerCount }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count).sort((a, b) => a - b);
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run test/assignRoles.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/logic/assignRoles.js test/assignRoles.test.js
git commit -m "feat: add liar role assignment logic"
```

---

## Task 4: scoring 로직 (점수·승패 판정)

**Files:**
- Create: `src/logic/scoring.js`, `test/scoring.test.js`

**규칙(설계 §6):** `liarScore = ceil(N/2)`. 시민 승리→시민 전원 +1. 라이어 승리(은폐 or 역전)→각 라이어 +liarScore.

- [ ] **Step 1: 실패하는 테스트 작성**

```js
// test/scoring.test.js
import { describe, it, expect } from 'vitest';
import { calcRoundScore, liarScoreFor } from '../src/logic/scoring.js';

describe('liarScoreFor', () => {
  it('ceil(N/2)', () => {
    expect(liarScoreFor(3)).toBe(2);
    expect(liarScoreFor(4)).toBe(2);
    expect(liarScoreFor(6)).toBe(3);
    expect(liarScoreFor(10)).toBe(5);
  });
});

describe('calcRoundScore', () => {
  it('시민 승리: 라이어 지목 + 역전 실패 → 시민 전원 +1, 라이어 0', () => {
    const r = calcRoundScore({ playerCount: 5, liarIndices: [2], votedOutIndices: [2], reversalSuccess: false });
    expect(r.perPlayerDelta).toEqual([1, 1, 0, 1, 1]);
  });
  it('라이어 은폐 승리: 시민이 지목됨 → 라이어 +ceil(N/2)', () => {
    const r = calcRoundScore({ playerCount: 5, liarIndices: [2], votedOutIndices: [0], reversalSuccess: false });
    expect(r.perPlayerDelta).toEqual([0, 0, 3, 0, 0]);
  });
  it('라이어 역전 승리: 지목됐지만 제시어 맞힘 → 라이어 +ceil(N/2)', () => {
    const r = calcRoundScore({ playerCount: 6, liarIndices: [4], votedOutIndices: [4], reversalSuccess: true });
    expect(r.perPlayerDelta[4]).toBe(3);
    expect(r.perPlayerDelta.filter((_, i) => i !== 4).every(v => v === 0)).toBe(true);
  });
  it('라이어 2명 모두 은폐: 각자 +ceil(N/2)', () => {
    const r = calcRoundScore({ playerCount: 8, liarIndices: [1, 5], votedOutIndices: [0], reversalSuccess: false });
    expect(r.perPlayerDelta[1]).toBe(4);
    expect(r.perPlayerDelta[5]).toBe(4);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run test/scoring.test.js`
Expected: FAIL

- [ ] **Step 3: 구현 작성**

```js
// src/logic/scoring.js
export function liarScoreFor(playerCount) {
  return Math.ceil(playerCount / 2);
}

/*
 * params:
 *   playerCount: number
 *   liarIndices: number[]      라이어 인덱스
 *   votedOutIndices: number[]  최다 득표 인덱스(동률 가능)
 *   reversalSuccess: boolean   지목된 라이어가 제시어를 맞혔는가
 * returns: { perPlayerDelta: number[], liarWon: boolean }
 *
 * 라이어 승리 조건: 지목된 라이어가 한 명도 없음(은폐) OR 역전 성공.
 */
export function calcRoundScore({ playerCount, liarIndices, votedOutIndices, reversalSuccess }) {
  const liarSet = new Set(liarIndices);
  const anyLiarCaught = votedOutIndices.some(i => liarSet.has(i));
  const liarWon = !anyLiarCaught || reversalSuccess;
  const delta = new Array(playerCount).fill(0);
  if (liarWon) {
    const s = liarScoreFor(playerCount);
    liarIndices.forEach(i => { delta[i] = s; });
  } else {
    for (let i = 0; i < playerCount; i++) if (!liarSet.has(i)) delta[i] = 1;
  }
  return { perPlayerDelta: delta, liarWon };
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run test/scoring.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/logic/scoring.js test/scoring.test.js
git commit -m "feat: add round scoring and win-determination logic"
```

---

## Task 5: records/auth seam + localRecords

**Files:**
- Create: `src/auth/authProvider.js`, `src/records/recordsRepository.js`, `src/records/localRecords.js`, `test/localRecords.test.js`

- [ ] **Step 1: 실패하는 테스트 작성**

```js
// test/localRecords.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { localRecords } from '../src/records/localRecords.js';

beforeEach(() => localStorage.clear());

describe('localRecords', () => {
  it('초기 목록은 빈 배열', async () => {
    expect(await localRecords.listGames()).toEqual([]);
  });
  it('saveGame 후 listGames에 최신순으로 누적', async () => {
    await localRecords.saveGame({ date: 1, winnerIndices: [0] });
    await localRecords.saveGame({ date: 2, winnerIndices: [1] });
    const list = await localRecords.listGames();
    expect(list.length).toBe(2);
    expect(list[0].date).toBe(2); // 최신 먼저
  });
  it('최대 50개까지만 보관', async () => {
    for (let i = 0; i < 55; i++) await localRecords.saveGame({ date: i });
    const list = await localRecords.listGames();
    expect(list.length).toBe(50);
    expect(list[0].date).toBe(54);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run test/localRecords.test.js`
Expected: FAIL

- [ ] **Step 3: recordsRepository 인터페이스 작성**

```js
// src/records/recordsRepository.js
/*
 * 전적 저장 인터페이스 (seam).
 *   saveGame(record): Promise<void>
 *   listGames(): Promise<GameRecord[]>   // 최신순
 * v2는 localRecords(localStorage). 로그인 도입 시 cloudRecords로 교체.
 */
import { localRecords } from './localRecords.js';

export let recordsRepository = localRecords;
export function setRecordsRepository(impl) { recordsRepository = impl; }
```

- [ ] **Step 4: localRecords 구현**

```js
// src/records/localRecords.js
import * as storage from '../core/storage.js';

const KEY = 'records';
const MAX = 50;

export const localRecords = {
  async saveGame(record) {
    const list = storage.getJSON(KEY, []);
    list.unshift(record);            // 최신 먼저
    storage.setJSON(KEY, list.slice(0, MAX));
  },
  async listGames() {
    return storage.getJSON(KEY, []);
  },
};
```

- [ ] **Step 5: authProvider stub 작성**

```js
// src/auth/authProvider.js
/*
 * 로그인 인터페이스 (seam). v2는 비로그인 stub.
 * 로그인 도입 시 Apps in Toss 사용자 식별로 getUser/login 구현 → cloudRecords 연결.
 */
export const authProvider = {
  async getUser() { return null; },          // null = 비로그인
  async login() { throw new Error('login not implemented in v2'); },
};
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run test/localRecords.test.js`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add src/auth src/records test/localRecords.test.js
git commit -m "feat: add records/auth seam with local records implementation"
```

---

## Task 6: haptic.js (진동)

**Files:**
- Create: `src/core/haptic.js`

검증은 라이브 프리뷰(데스크톱은 무시되므로 콘솔 에러 없음만 확인). 뽁뽁이 패턴을 단순화 — 라이어게임은 카드 확인 시 단일 진동만 필요.

- [ ] **Step 1: 구현 작성**

```js
// src/core/haptic.js
import { generateHapticFeedback } from '@apps-in-toss/web-framework';

function hasBridge() {
  return typeof window !== 'undefined' &&
    !!window.ReactNativeWebView && !!window.__GRANITE_NATIVE_EMITTER;
}

/* 카드 확인 시 단일 진동. 시민/라이어 구분 없음(설계 §11). */
export function haptic() {
  if (hasBridge()) {
    try { void generateHapticFeedback({ type: 'tap' }).catch(() => fallback()); return; }
    catch { /* fallthrough */ }
  }
  fallback();
}
function fallback() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate([20]); } catch {}
  }
}
```

- [ ] **Step 2: dev 서버에서 import 에러 없음 확인**

Run: `npm run dev:web` (이미 떠 있으면 생략) — 콘솔 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/core/haptic.js
git commit -m "feat: add haptic abstraction (Apps in Toss + vibrate fallback)"
```

---

## Task 7: gameStore (게임 전역 상태)

**Files:**
- Create: `src/store/gameStore.jsx`

React Context + useReducer로 게임 상태와 화면 단계를 관리. 화면 전환은 `phase` 상태로 표현.

- [ ] **Step 1: gameStore 구현**

```jsx
// src/store/gameStore.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { pickWord } from '../logic/pickWord.js';
import { assignRoles } from '../logic/assignRoles.js';
import { calcRoundScore } from '../logic/scoring.js';

const PHASES = ['setup', 'peek', 'discuss', 'vote', 'reversal', 'result', 'final', 'history'];

const initialState = {
  phase: 'setup',
  config: {
    playerCount: 6, liarCount: 1, categories: [], difficulty: 0,
    liarHint: true, totalRounds: 3, timerMin: 0,
  },
  round: 0,
  scores: [],          // 길이 playerCount
  // 현재 라운드
  liarIndices: [], category: '', word: '',
  revealed: [],        // 카드 확인 여부
  votedOutIndices: [], reversalSuccess: false,
  perRound: [],
  lastDelta: [],
  prevFrom: 'setup',
};

function startGame(config) {
  const roles = assignRoles(config.playerCount, config.liarCount);
  const { category, word } = pickWord({ categories: config.categories, difficulty: config.difficulty });
  return {
    liarIndices: roles, category, word,
    revealed: new Array(config.playerCount).fill(false),
    votedOutIndices: [], reversalSuccess: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START': {
      const config = action.config;
      return {
        ...initialState, config,
        phase: 'peek', round: 1,
        scores: new Array(config.playerCount).fill(0),
        ...startGame(config),
      };
    }
    case 'REVEAL': {
      const revealed = state.revealed.slice();
      revealed[action.idx] = true;
      const allDone = revealed.every(Boolean);
      return { ...state, revealed, phase: allDone ? 'discuss' : 'peek' };
    }
    case 'GO_VOTE': return { ...state, phase: 'vote' };
    case 'SET_VOTE': {
      // votedOutIndices: 최다 득표 인덱스 배열
      const liarSet = new Set(state.liarIndices);
      const caught = action.votedOutIndices.some(i => liarSet.has(i));
      // 라이어가 지목되면 역전 단계로, 아니면 결과로
      return { ...state, votedOutIndices: action.votedOutIndices,
        phase: caught ? 'reversal' : 'result',
        ...(caught ? {} : applyScore({ ...state, votedOutIndices: action.votedOutIndices, reversalSuccess: false })) };
    }
    case 'SET_REVERSAL': {
      const next = { ...state, reversalSuccess: action.success };
      return { ...next, phase: 'result', ...applyScore(next) };
    }
    case 'NEXT_ROUND': {
      if (state.round >= state.config.totalRounds) return { ...state, phase: 'final' };
      return { ...state, phase: 'peek', round: state.round + 1, ...startGame(state.config) };
    }
    case 'GO': return { ...state, prevFrom: state.phase, phase: action.phase };
    case 'RESET': return { ...initialState };
    default: return state;
  }
}

function applyScore(state) {
  const { perPlayerDelta } = calcRoundScore({
    playerCount: state.config.playerCount,
    liarIndices: state.liarIndices,
    votedOutIndices: state.votedOutIndices,
    reversalSuccess: state.reversalSuccess,
  });
  const scores = state.scores.map((s, i) => s + perPlayerDelta[i]);
  return { scores, lastDelta: perPlayerDelta };
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}
export function useGame() { return useContext(GameContext); }
export { PHASES };
```

- [ ] **Step 2: App.jsx에서 GameProvider 연결(임시)**

```jsx
// src/App.jsx
import { GameProvider, useGame } from './store/gameStore.jsx';

function Router() {
  const { state } = useGame();
  return <div className="screen"><h1 className="title">라이어 게임</h1><p>phase: {state.phase}</p></div>;
}
export default function App() {
  return <GameProvider><Router /></GameProvider>;
}
```

- [ ] **Step 3: dev 서버에서 "phase: setup" 표시 확인**

Run: `npm run dev:web` — 화면에 phase: setup 보임, 콘솔 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/store/gameStore.jsx src/App.jsx
git commit -m "feat: add game store (context + reducer) with phase routing"
```

---

## Task 8: SetupScreen (설정 화면)

**Files:**
- Create: `src/screens/SetupScreen.jsx`
- Modify: `src/App.jsx`, `src/styles/main.css` (설정 컨트롤 스타일 추가)

- [ ] **Step 1: SetupScreen 구현**

```jsx
// src/screens/SetupScreen.jsx
import React, { useState } from 'react';
import { useGame } from '../store/gameStore.js';
import { CATEGORIES } from '../data/words.js';

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [c, setC] = useState({
    playerCount: 6, liarCount: 1, categories: [], difficulty: 0,
    liarHint: true, totalRounds: 3, timerMin: 0,
  });
  const set = (k, v) => setC(prev => ({ ...prev, [k]: v }));
  const toggleCat = (cat) => set('categories',
    c.categories.includes(cat) ? c.categories.filter(x => x !== cat) : [...c.categories, cat]);
  const canTwoLiars = c.playerCount >= 6;

  return (
    <div className="screen setup">
      <h1 className="title">라이어 게임</h1>

      <label className="field">인원수: <b>{c.playerCount}명</b>
        <input type="range" min="3" max="10" value={c.playerCount}
          onChange={e => set('playerCount', +e.target.value)} />
      </label>

      <div className="field">라이어 수
        <div className="seg">
          <button className={c.liarCount === 1 ? 'on' : ''} onClick={() => set('liarCount', 1)}>1명</button>
          <button className={c.liarCount === 2 ? 'on' : ''} disabled={!canTwoLiars}
            onClick={() => set('liarCount', 2)}>2명{!canTwoLiars && ' (6명+)'}</button>
        </div>
      </div>

      <div className="field">난이도
        <div className="seg">
          {[[0, '전체'], [1, '쉬움'], [2, '보통'], [3, '어려움']].map(([v, label]) => (
            <button key={v} className={c.difficulty === v ? 'on' : ''}
              onClick={() => set('difficulty', v)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="field">라운드
        <div className="seg">
          {[3, 5].map(v => (
            <button key={v} className={c.totalRounds === v ? 'on' : ''}
              onClick={() => set('totalRounds', v)}>{v}라운드</button>
          ))}
        </div>
      </div>

      <div className="field">타이머
        <div className="seg">
          {[[0, '없음'], [1, '1분'], [2, '2분'], [3, '3분']].map(([v, label]) => (
            <button key={v} className={c.timerMin === v ? 'on' : ''}
              onClick={() => set('timerMin', v)}>{label}</button>
          ))}
        </div>
      </div>

      <label className="field row">
        <input type="checkbox" checked={c.liarHint}
          onChange={e => set('liarHint', e.target.checked)} />
        라이어에게 카테고리 힌트 주기
      </label>

      <details className="field">
        <summary>카테고리 선택 ({c.categories.length || '전체'})</summary>
        <div className="cat-grid">
          {CATEGORIES.map(cat => (
            <button key={cat} className={c.categories.includes(cat) ? 'on' : ''}
              onClick={() => toggleCat(cat)}>{cat}</button>
          ))}
        </div>
      </details>

      <button className="primary-btn" onClick={() => dispatch({ type: 'START', config: c })}>
        게임 시작
      </button>
      <button className="ghost-btn" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>
        지난 기록 보기
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 설정 컨트롤 CSS 추가 (src/styles/main.css 끝에 append)**

```css
.setup { justify-content: flex-start; overflow-y: auto; gap: 14px; padding-top: 40px; }
.field { width: 100%; max-width: 380px; font-size: 14px; color: #cdd6f4; display: flex; flex-direction: column; gap: 8px; }
.field.row { flex-direction: row; align-items: center; gap: 8px; }
.field input[type=range] { width: 100%; }
.seg { display: flex; gap: 6px; flex-wrap: wrap; }
.seg button, .cat-grid button {
  flex: 1; min-width: 60px; padding: 10px; border: 1px solid #45475a; border-radius: 10px;
  background: #1e1e2e; color: #cdd6f4; font-size: 13px; cursor: pointer;
}
.seg button.on, .cat-grid button.on { background: linear-gradient(145deg,#ff006e,#8338ec); border-color: transparent; color: #fff; font-weight: 700; }
.seg button:disabled { opacity: .4; cursor: not-allowed; }
.cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; }
.ghost-btn { background: transparent; border: 1px solid rgba(255,255,255,.2); color: #b8b8d4; font-size: 14px; padding: 10px 20px; border-radius: 50px; margin-top: 4px; cursor: pointer; }
```

- [ ] **Step 3: App.jsx 라우터에 SetupScreen 연결**

```jsx
// src/App.jsx
import { GameProvider, useGame } from './store/gameStore.js';
import SetupScreen from './screens/SetupScreen.jsx';

function Router() {
  const { state } = useGame();
  switch (state.phase) {
    case 'setup': return <SetupScreen />;
    default: return <SetupScreen />;
  }
}
export default function App() {
  return <GameProvider><Router /></GameProvider>;
}
```

- [ ] **Step 4: 라이브 프리뷰 검증**

Run: `npm run dev:web`
Expected: 설정 화면 표시. 인원 슬라이더·라이어 수·난이도·라운드·타이머·힌트·카테고리 모두 조작 가능. 인원 5명일 때 라이어 2명 비활성.

- [ ] **Step 5: Commit**

```bash
git add src/screens/SetupScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add setup screen with all game options"
```

---

## Task 9: Card + PeekModal + PeekScreen (카드 확인)

**Files:**
- Create: `src/components/Card.jsx`, `src/components/PeekModal.jsx`, `src/screens/PeekScreen.jsx`
- Modify: `src/App.jsx`, `src/styles/main.css`

**핵심(설계 §9): 단어 카드와 라이어 카드의 모달 배경을 동일하게.** 빨간 풀스크린 금지.

- [ ] **Step 1: PeekModal 구현 (단어/라이어 동일 배경)**

```jsx
// src/components/PeekModal.jsx
import React from 'react';

const LIAR_SVG = (
  <svg className="liar-svg" viewBox="0 0 280 260" aria-hidden="true">
    <ellipse cx="140" cy="140" rx="82" ry="86" fill="#ffe0bd" stroke="#c8956d" strokeWidth="3.5"/>
    <circle cx="174" cy="129" r="11" fill="#222"/><circle cx="177" cy="125" r="4" fill="#fff"/>
    <path d="M 88 130 Q 104 119 120 130" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M 140 158 L 268 162 Q 276 168 268 173 L 140 172 Z" fill="#ffc99a" stroke="#c8956d" strokeWidth="3"/>
    <path d="M 105 198 Q 128 215 145 205 Q 165 215 188 198" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round"/>
  </svg>
);

/* isLiar, category, word, liarHint, active */
export default function PeekModal({ active, isLiar, category, word, liarHint }) {
  return (
    <div className={'peek-modal' + (active ? ' active' : '')}>
      {/* 라이어든 단어든 동일한 .peek-card 배경 사용 (color-neutral) */}
      <div className="peek-card">
        {isLiar ? (
          <>
            {LIAR_SVG}
            <div className="pc-liar-label">라이어!</div>
            {liarHint && <div className="pc-category">카테고리: {category}</div>}
          </>
        ) : (
          <>
            <div className="pc-category">{category}</div>
            <div className="pc-word">{word}</div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Card 컴포넌트 구현**

```jsx
// src/components/Card.jsx
import React from 'react';

/* idx, used, onClick */
export default function Card({ idx, used, onClick }) {
  return (
    <div className={'card' + (used ? ' used' : '')}
      onClick={used ? undefined : onClick}
      style={used ? { visibility: 'hidden' } : undefined}>
      <div className="card-num">{idx + 1}번</div>
    </div>
  );
}
```

- [ ] **Step 3: PeekScreen 구현**

```jsx
// src/screens/PeekScreen.jsx
import React, { useState } from 'react';
import { useGame } from '../store/gameStore.js';
import Card from '../components/Card.jsx';
import PeekModal from '../components/PeekModal.jsx';
import { haptic } from '../core/haptic.js';

export default function PeekScreen() {
  const { state, dispatch } = useGame();
  const [peeking, setPeeking] = useState(false);
  const [peekIdx, setPeekIdx] = useState(-1);

  const onCard = (idx) => {
    if (peeking || state.revealed[idx]) return;
    setPeeking(true); setPeekIdx(idx); haptic();
    setTimeout(() => {
      setPeeking(false); setPeekIdx(-1);
      dispatch({ type: 'REVEAL', idx });
    }, 2000);
  };

  const done = state.revealed.filter(Boolean).length;
  const isLiar = state.liarIndices.includes(peekIdx);

  return (
    <div className="screen game">
      <div className="header">
        <p className="game-title">라운드 {state.round} · 자기 카드를 눌러 확인</p>
        <p className="progress">{done} / {state.config.playerCount} 확인 완료</p>
      </div>
      <div className="cards-area">
        {state.revealed.map((used, i) => (
          <Card key={i} idx={i} used={used} onClick={() => onCard(i)} />
        ))}
      </div>
      <PeekModal active={peeking} isLiar={isLiar}
        category={state.category} word={state.word} liarHint={state.config.liarHint} />
    </div>
  );
}
```

- [ ] **Step 4: 카드/모달 CSS 추가 (기존 디자인 이식, 라이어 배경은 단어와 동일)**

```css
.game .header { position: absolute; top: 16px; left: 0; right: 0; text-align: center; }
.game-title { font-size: 16px; color: #b8b8d4; margin: 0; }
.progress { font-size: 14px; color: #ffbe0b; margin-top: 4px; font-weight: 600; }
.cards-area { width: 100%; flex: 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; padding: 80px 8px 20px; max-width: 480px; }
.card { position: relative; width: calc(33.333% - 8px); aspect-ratio: 2/3; max-width: 130px; min-width: 80px; border-radius: 14px; cursor: pointer; background: linear-gradient(135deg,#ff006e,#8338ec); box-shadow: 0 8px 24px rgba(131,56,236,.5), inset 0 0 0 3px rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; }
.card::before { content: "?"; font-size: 48px; font-weight: 900; color: #fff; }
.card .card-num { position: absolute; bottom: 8px; font-size: 13px; font-weight: 700; color: rgba(255,255,255,.85); background: rgba(0,0,0,.25); padding: 2px 8px; border-radius: 10px; }
.card.used { pointer-events: none; }

.peek-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.78); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity .3s; }
.peek-modal.active { opacity: 1; pointer-events: auto; }
/* 단어/라이어 동일 배경 — 옆 사람이 색으로 구분 불가 */
.peek-card { width: min(86vw,380px); aspect-ratio: 3/4; border-radius: 24px; background: linear-gradient(135deg,#fff 0%,#ffe0e6 100%); color: #1a1a2e; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 22px; box-shadow: 0 30px 80px rgba(0,0,0,.5); text-align: center; transform: scale(.6); transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
.peek-modal.active .peek-card { transform: scale(1); }
.pc-category { font-size: 16px; font-weight: 700; color: #8338ec; padding: 6px 16px; background: rgba(131,56,236,.1); border-radius: 100px; margin-bottom: 12px; }
.pc-word { font-size: 56px; font-weight: 900; color: #1a1a2e; line-height: 1.1; word-break: keep-all; }
.pc-liar-label { font-size: 48px; font-weight: 900; color: #8b0000; margin: 4px 0; }
.liar-svg { width: min(60vw,220px); height: auto; }
```

- [ ] **Step 5: App.jsx에 peek 라우트 추가**

```jsx
import PeekScreen from './screens/PeekScreen.jsx';
// Router switch에 추가:
    case 'peek': return <PeekScreen />;
```

- [ ] **Step 6: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 설정에서 게임 시작 → 카드 그리드 표시. 카드 클릭 시 약 2초 단어/라이어 모달, **단어와 라이어 모달 배경색이 동일**한지 확인. 전원 확인 시 discuss로 전환(다음 태스크 전이라 빈 화면이어도 OK).

- [ ] **Step 7: Commit**

```bash
git add src/components/Card.jsx src/components/PeekModal.jsx src/screens/PeekScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add peek screen with color-unified word/liar cards"
```

---

## Task 10: DiscussScreen + Timer (토론 + 타이머)

**Files:**
- Create: `src/components/Timer.jsx`, `src/screens/DiscussScreen.jsx`
- Modify: `src/App.jsx`, `src/styles/main.css`

- [ ] **Step 1: Timer 구현**

```jsx
// src/components/Timer.jsx
import React, { useEffect, useState } from 'react';

/* minutes, onDone */
export default function Timer({ minutes, onDone }) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    if (left <= 0) { onDone && onDone(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onDone]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return <div className="timer">{mm}:{ss}</div>;
}
```

- [ ] **Step 2: DiscussScreen 구현**

```jsx
// src/screens/DiscussScreen.jsx
import React from 'react';
import { useGame } from '../store/gameStore.js';
import Timer from '../components/Timer.jsx';

export default function DiscussScreen() {
  const { state, dispatch } = useGame();
  const goVote = () => dispatch({ type: 'GO_VOTE' });
  return (
    <div className="screen discuss">
      <h2 className="section-title">토론 시간</h2>
      <p className="hint">한 명씩 제시어와 관련된 설명을 하세요.<br/>누가 라이어인지 추리하세요.</p>
      {state.config.timerMin > 0
        ? <Timer minutes={state.config.timerMin} onDone={goVote} />
        : <p className="hint">시간 제한 없음</p>}
      <button className="primary-btn" onClick={goVote}>투표하러 가기</button>
    </div>
  );
}
```

- [ ] **Step 3: CSS 추가**

```css
.section-title { font-size: 28px; font-weight: 800; margin: 0 0 12px; }
.hint { font-size: 15px; color: #b8b8d4; text-align: center; line-height: 1.6; margin: 0 0 24px; }
.timer { font-size: 64px; font-weight: 900; font-variant-numeric: tabular-nums; color: #ffbe0b; margin: 16px 0 28px; }
```

- [ ] **Step 4: App.jsx에 discuss 라우트 추가**

```jsx
import DiscussScreen from './screens/DiscussScreen.jsx';
    case 'discuss': return <DiscussScreen />;
```

- [ ] **Step 5: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 카드 전원 확인 후 토론 화면. 타이머 1분 설정 시 카운트다운 → 0이면 자동 투표 화면. "투표하러 가기" 동작.

- [ ] **Step 6: Commit**

```bash
git add src/components/Timer.jsx src/screens/DiscussScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add discuss screen with countdown timer"
```

---

## Task 11: VoteScreen (투표)

**Files:**
- Create: `src/screens/VoteScreen.jsx`
- Modify: `src/App.jsx`, `src/styles/main.css`

투표는 번호별 득표 수를 입력 → 최다 득표 인덱스 산출(동률 가능). 오프라인 대면이므로 진행자가 손들어 집계 후 입력.

- [ ] **Step 1: VoteScreen 구현**

```jsx
// src/screens/VoteScreen.jsx
import React, { useState } from 'react';
import { useGame } from '../store/gameStore.js';

export default function VoteScreen() {
  const { state, dispatch } = useGame();
  const N = state.config.playerCount;
  const [votes, setVotes] = useState(new Array(N).fill(0));
  const inc = (i, d) => setVotes(v => v.map((x, j) => j === i ? Math.max(0, x + d) : x));

  const submit = () => {
    const max = Math.max(...votes);
    const votedOutIndices = max > 0 ? votes.map((v, i) => v === max ? i : -1).filter(i => i >= 0) : [];
    dispatch({ type: 'SET_VOTE', votedOutIndices });
  };

  return (
    <div className="screen vote">
      <h2 className="section-title">라이어 투표</h2>
      <p className="hint">각 번호가 받은 표 수를 입력하세요.</p>
      <div className="vote-grid">
        {votes.map((v, i) => (
          <div className="vote-row" key={i}>
            <span className="vote-num">{i + 1}번</span>
            <button onClick={() => inc(i, -1)}>−</button>
            <span className="vote-cnt">{v}</span>
            <button onClick={() => inc(i, +1)}>＋</button>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={submit}>투표 확정</button>
    </div>
  );
}
```

- [ ] **Step 2: CSS 추가**

```css
.vote { justify-content: flex-start; padding-top: 50px; overflow-y: auto; }
.vote-grid { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 8px; margin: 12px 0 24px; }
.vote-row { display: flex; align-items: center; gap: 12px; background: #1e1e2e; border-radius: 12px; padding: 10px 16px; }
.vote-num { flex: 1; font-weight: 700; }
.vote-row button { width: 40px; height: 40px; border-radius: 10px; border: none; background: #45475a; color: #fff; font-size: 22px; cursor: pointer; }
.vote-cnt { min-width: 28px; text-align: center; font-size: 20px; font-weight: 800; color: #ffbe0b; }
```

- [ ] **Step 3: App.jsx에 vote 라우트 추가**

```jsx
import VoteScreen from './screens/VoteScreen.jsx';
    case 'vote': return <VoteScreen />;
```

- [ ] **Step 4: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 투표 화면에서 번호별 ＋/− 동작. 확정 시: 라이어가 최다 득표면 reversal로, 아니면 result로 이동(다음 태스크 전이라 빈 화면 가능).

- [ ] **Step 5: Commit**

```bash
git add src/screens/VoteScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add vote screen with per-player tally"
```

---

## Task 12: ReversalScreen (라이어 역전)

**Files:**
- Create: `src/screens/ReversalScreen.jsx`
- Modify: `src/App.jsx`

지목된 라이어에게 제시어 맞힐 기회. 기본은 수동 판정(맞혔다/틀렸다) + 보조로 같은 카테고리 4지선다.

- [ ] **Step 1: ReversalScreen 구현**

```jsx
// src/screens/ReversalScreen.jsx
import React, { useMemo } from 'react';
import { useGame } from '../store/gameStore.js';
import { WORDS } from '../data/words.js';

export default function ReversalScreen() {
  const { state, dispatch } = useGame();
  const caughtLiars = state.votedOutIndices.filter(i => state.liarIndices.includes(i));

  // 보조 4지선다: 정답 + 같은 카테고리 오답 3개
  const choices = useMemo(() => {
    const pool = WORDS[state.category].map(x => x.w).filter(w => w !== state.word);
    const wrong = [];
    const copy = pool.slice();
    while (wrong.length < 3 && copy.length) {
      wrong.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return [...wrong, state.word].sort(() => Math.random() - 0.5);
  }, [state.category, state.word]);

  const decide = (success) => dispatch({ type: 'SET_REVERSAL', success });

  return (
    <div className="screen reversal">
      <h2 className="section-title">라이어 지목!</h2>
      <p className="hint">
        {caughtLiars.map(i => i + 1).join(', ')}번이 라이어로 지목됐습니다.<br/>
        라이어가 <b>제시어</b>를 맞히면 역전승합니다.
      </p>
      <p className="hint">카테고리: <b>{state.category}</b></p>
      <div className="choice-grid">
        {choices.map(w => (
          <button key={w} className="choice"
            onClick={() => decide(w === state.word)}>{w}</button>
        ))}
      </div>
      <div className="manual">
        <button className="primary-btn" onClick={() => decide(true)}>맞혔다 (역전승)</button>
        <button className="ghost-btn" onClick={() => decide(false)}>틀렸다 (시민 승)</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: CSS 추가**

```css
.reversal { justify-content: flex-start; padding-top: 50px; }
.choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; max-width: 360px; margin: 12px 0 20px; }
.choice { padding: 16px; border-radius: 12px; border: 1px solid #45475a; background: #1e1e2e; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; }
.manual { display: flex; flex-direction: column; gap: 8px; align-items: center; }
```

- [ ] **Step 3: App.jsx에 reversal 라우트 추가**

```jsx
import ReversalScreen from './screens/ReversalScreen.jsx';
    case 'reversal': return <ReversalScreen />;
```

- [ ] **Step 4: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 라이어가 지목되도록 투표 → 역전 화면. 4지선다(정답 포함) 또는 수동 버튼으로 판정 → result로 이동.

- [ ] **Step 5: Commit**

```bash
git add src/screens/ReversalScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add liar reversal screen (guess-the-word comeback)"
```

---

## Task 13: ResultScreen + Scoreboard (라운드 결과)

**Files:**
- Create: `src/components/Scoreboard.jsx`, `src/screens/ResultScreen.jsx`
- Modify: `src/App.jsx`, `src/styles/main.css`

- [ ] **Step 1: Scoreboard 구현**

```jsx
// src/components/Scoreboard.jsx
import React from 'react';

/* scores: number[], delta?: number[], liarIndices?: number[] */
export default function Scoreboard({ scores, delta = [], liarIndices = [] }) {
  const ranked = scores.map((s, i) => ({ i, s, d: delta[i] || 0 }))
    .sort((a, b) => b.s - a.s);
  return (
    <div className="scoreboard">
      {ranked.map(({ i, s, d }) => (
        <div className="sb-row" key={i}>
          <span className="sb-name">{i + 1}번{liarIndices.includes(i) ? ' 🤥' : ''}</span>
          <span className="sb-score">{s}{d ? <em className="sb-delta">+{d}</em> : null}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: ResultScreen 구현**

```jsx
// src/screens/ResultScreen.jsx
import React from 'react';
import { useGame } from '../store/gameStore.js';
import Scoreboard from '../components/Scoreboard.jsx';

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const liarWon = state.lastDelta[state.liarIndices[0]] > 0;
  const last = state.round >= state.config.totalRounds;
  return (
    <div className="screen result">
      <h2 className="section-title">{liarWon ? '라이어 승리! 🤥' : '시민 승리! 🎉'}</h2>
      <p className="hint">
        제시어는 <b>{state.word}</b> ({state.category})<br/>
        라이어: {state.liarIndices.map(i => i + 1).join(', ')}번
      </p>
      <Scoreboard scores={state.scores} delta={state.lastDelta} liarIndices={state.liarIndices} />
      <button className="primary-btn" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
        {last ? '최종 결과 보기' : `다음 라운드 (${state.round + 1}/${state.config.totalRounds})`}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: CSS 추가**

```css
.result { justify-content: flex-start; padding-top: 50px; }
.scoreboard { width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 6px; margin: 12px 0 24px; }
.sb-row { display: flex; justify-content: space-between; background: #1e1e2e; border-radius: 10px; padding: 10px 16px; }
.sb-name { font-weight: 600; }
.sb-score { font-weight: 800; color: #ffbe0b; }
.sb-delta { font-style: normal; color: #a6e3a1; font-size: 13px; margin-left: 6px; }
```

- [ ] **Step 4: App.jsx에 result 라우트 추가**

```jsx
import ResultScreen from './screens/ResultScreen.jsx';
    case 'result': return <ResultScreen />;
```

- [ ] **Step 5: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 판정 후 결과 화면. 승패 문구·제시어·라이어 공개·점수판(증가분 +N) 표시. 다음 라운드 버튼으로 peek 복귀, 마지막 라운드면 "최종 결과 보기".

- [ ] **Step 6: Commit**

```bash
git add src/components/Scoreboard.jsx src/screens/ResultScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add round result screen with scoreboard"
```

---

## Task 14: FinalScreen + 기록 저장

**Files:**
- Create: `src/screens/FinalScreen.jsx`
- Modify: `src/App.jsx`, `src/store/gameStore.js`

- [ ] **Step 1: gameStore에 기록 저장 트리거 추가 — FINAL 진입 시 호출할 헬퍼 export**

`src/store/gameStore.js` 하단에 추가:

```jsx
import { recordsRepository } from '../records/recordsRepository.js';

export function buildGameRecord(state) {
  const max = Math.max(...state.scores);
  return {
    date: Date.now(),
    playerCount: state.config.playerCount,
    rounds: state.config.totalRounds,
    categories: state.config.categories.length ? state.config.categories : ['전체'],
    difficulty: state.config.difficulty,
    scores: state.scores,
    winnerIndices: state.scores.map((s, i) => s === max ? i : -1).filter(i => i >= 0),
    perRound: state.perRound,
  };
}
export async function saveGameRecord(state) {
  await recordsRepository.saveGame(buildGameRecord(state));
}
```

- [ ] **Step 2: FinalScreen 구현 (마운트 시 1회 기록 저장)**

```jsx
// src/screens/FinalScreen.jsx
import React, { useEffect, useRef } from 'react';
import { useGame, saveGameRecord } from '../store/gameStore.js';
import Scoreboard from '../components/Scoreboard.jsx';

export default function FinalScreen() {
  const { state, dispatch } = useGame();
  const saved = useRef(false);
  useEffect(() => {
    if (!saved.current) { saved.current = true; saveGameRecord(state); }
  }, [state]);

  const max = Math.max(...state.scores);
  const winners = state.scores.map((s, i) => s === max ? i + 1 : null).filter(Boolean);

  return (
    <div className="screen final">
      <h1 className="big-title">게임 종료!</h1>
      <p className="hint">우승: <b>{winners.join(', ')}번</b> ({max}점)</p>
      <Scoreboard scores={state.scores} />
      <button className="primary-btn" onClick={() => dispatch({ type: 'RESET' })}>새 게임</button>
      <button className="ghost-btn" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>기록 보기</button>
    </div>
  );
}
```

- [ ] **Step 3: CSS 추가**

```css
.big-title { font-size: 44px; font-weight: 900; background: linear-gradient(45deg,#ff006e,#ffbe0b); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 12px; }
.final { justify-content: center; }
```

- [ ] **Step 4: App.jsx에 final 라우트 추가**

```jsx
import FinalScreen from './screens/FinalScreen.jsx';
    case 'final': return <FinalScreen />;
```

- [ ] **Step 5: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 전체 라운드 종료 → 최종 화면. 우승자·최종 점수판 표시. "새 게임"으로 설정 복귀.

- [ ] **Step 6: Commit**

```bash
git add src/screens/FinalScreen.jsx src/App.jsx src/store/gameStore.jsx
git commit -m "feat: add final screen and persist game record"
```

---

## Task 15: HistoryScreen (기록 보기)

**Files:**
- Create: `src/screens/HistoryScreen.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: HistoryScreen 구현**

```jsx
// src/screens/HistoryScreen.jsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../store/gameStore.js';
import { recordsRepository } from '../records/recordsRepository.js';

export default function HistoryScreen() {
  const { state, dispatch } = useGame();
  const [games, setGames] = useState(null);
  useEffect(() => { recordsRepository.listGames().then(setGames); }, []);

  const back = () => dispatch({ type: 'GO', phase: state.prevFrom === 'history' ? 'setup' : state.prevFrom });

  return (
    <div className="screen history">
      <h2 className="section-title">지난 기록</h2>
      {games === null ? <p className="hint">불러오는 중…</p>
        : games.length === 0 ? <p className="hint">아직 기록이 없습니다.</p>
        : (
          <div className="hist-list">
            {games.map((g, k) => (
              <div className="hist-row" key={k}>
                <div className="hist-date">{new Date(g.date).toLocaleString('ko-KR')}</div>
                <div className="hist-meta">
                  {g.playerCount}명 · {g.rounds}R · 우승 {g.winnerIndices.map(i => i + 1).join(',')}번
                </div>
              </div>
            ))}
          </div>
        )}
      <div className="login-note">
        🔒 로그인하면 기기가 바뀌어도 기록이 유지됩니다. (다음 업데이트 예정)
      </div>
      <button className="ghost-btn" onClick={back}>돌아가기</button>
    </div>
  );
}
```

- [ ] **Step 2: CSS 추가**

```css
.history { justify-content: flex-start; padding-top: 50px; }
.hist-list { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 8px; margin: 12px 0; overflow-y: auto; max-height: 55vh; }
.hist-row { background: #1e1e2e; border-radius: 10px; padding: 12px 16px; }
.hist-date { font-size: 12px; color: #6c7086; }
.hist-meta { font-size: 14px; color: #cdd6f4; margin-top: 2px; }
.login-note { font-size: 12px; color: #fab387; background: rgba(250,179,135,.1); border-radius: 10px; padding: 10px 14px; margin: 12px 0; max-width: 380px; text-align: center; }
```

- [ ] **Step 3: App.jsx에 history 라우트 추가 + default 정리**

```jsx
import HistoryScreen from './screens/HistoryScreen.jsx';
    case 'history': return <HistoryScreen />;
    default: return <SetupScreen />;
```

- [ ] **Step 4: 라이브 프리뷰 검증**

Run: `npm run dev:web` — 설정 화면 "지난 기록 보기" → 기록 목록(또는 빈 상태). 한 게임 완료 후 다시 보면 기록 1건 표시. 로그인 안내 문구 노출. 돌아가기 동작.

- [ ] **Step 5: Commit**

```bash
git add src/screens/HistoryScreen.jsx src/App.jsx src/styles/main.css
git commit -m "feat: add history screen with login-upgrade note"
```

---

## Task 16: 전체 통합 검증 + 빌드

**Files:** 없음(검증 전용)

- [ ] **Step 1: 전체 단위 테스트 통과 확인**

Run: `npm test`
Expected: storage / pickWord / assignRoles / scoring / localRecords 전부 PASS

- [ ] **Step 2: 전체 플로우 라이브 검증**

Run: `npm run dev:web`
시나리오: 6명·라이어 1·3라운드·타이머 1분으로 시작 → 카드 6장 확인(단어/라이어 배경 동일 확인) → 토론 타이머 → 투표(라이어 지목) → 역전 판정 → 결과 점수 → 3라운드 반복 → 최종 우승 → 기록 저장 확인.

- [ ] **Step 3: 프로덕션 빌드 확인**

Run: `npm run build` (= `ait build`)
Expected: `dist/` 생성, `.ait` 패키지 빌드 성공. 실패 시 granite/ait 로그 확인.
참고: ait 빌드 환경 미설정 시 `vite build`로 dist 생성만이라도 확인하고 그 사실을 기록.

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: verify full flow and production build"
```

---

## Self-Review (작성자 점검 결과)

**Spec coverage:**
- 설정 7옵션 → Task 8 ✅ / 카드 확인 → Task 9 ✅ / 타이머 → Task 10 ✅ / 투표 → Task 11 ✅ / 역전 룰 → Task 12 ✅ / 점수 → Task 4·13 ✅ / 최종·기록 → Task 14 ✅ / 히스토리 → Task 15 ✅ / 난이도 데이터 → Task 2 ✅ / 카드 색상 통일 → Task 9 (peek-card 단일 배경) ✅ / records·auth seam → Task 5 ✅ / 햅틱 → Task 6 ✅ / Apps in Toss 설정 → Task 0 ✅ / 로그인 대비 → Task 5·15 ✅

**Type consistency:**
- `calcRoundScore({ playerCount, liarIndices, votedOutIndices, reversalSuccess })` → gameStore `applyScore`에서 동일 시그니처 호출 ✅
- `pickWord({ categories, difficulty })` → gameStore `startGame`에서 동일 호출 ✅
- `recordsRepository.saveGame/listGames` → Task 5 정의, Task 14·15에서 동일 사용 ✅
- store action 타입(START/REVEAL/GO_VOTE/SET_VOTE/SET_REVERSAL/NEXT_ROUND/GO/RESET)이 각 화면 dispatch와 일치 ✅

**열린 항목(구현 중 결정):** 라이어 2명 시 역전 세부 처리(현재: 지목된 라이어 중 한 명이라도 맞히면 역전), 앱 메타데이터 최종값 — 설계 §16과 일치.
