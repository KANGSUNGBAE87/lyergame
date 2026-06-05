# 세션 로그 — 라이어 게임 v2 기획

- 날짜: 2026-06-06
- 도구/주체: claude (brainstorming 스킬 + Visual Companion)
- 단계: spec / 기획

## 사용자 요청
기존 단일 `index.html` 라이어 게임을 분석하고, Apps in Toss 미니앱으로 재기획. 게임성·UX·데이터·코드 구조 개선.

## 주요 결정
- 스택: React + Vite + `@apps-in-toss/web-framework` (뽁뽁이 패턴 차용), `ait build`
- 게임플레이 확장 전부 채택: 라이어 수(1/2), 라운드/점수, 투표, 타이머
- 라이어 역전 룰 ON (지목당해도 제시어 맞히면 역전승)
- 점수: 시민 +1 / 라이어 +ceil(N/2) — 인원 많을수록 라이어 보상↑
- 카드 색상 통일: 라이어 빨강 풀스크린 제거 → 단어 카드와 동일 배경 (옆 사람 식별 방지)
- 난이도: 1쉬움/2보통/3어려움, "라이어가 묻어가기 쉬운 정도" 기준, 구현 시 전체 단어 태깅
- 카테고리 직접 선택, 라이어 힌트 ON/OFF
- 히스토리: v2는 localStorage 기기 로컬, 로그인 도입 대비 records/auth seam 설계 → 추후 사용자 ID 기반 영구 기록으로 구현 교체
- 햅틱: 시민/라이어 구분 없이 카드 확인 시 진동

## 산출물
- `ai/plans/2026-06-06-liar-game-v2-design.md` (설계 문서)
- `ai/README.md` (포인터)
- `.gitignore` 추가(.superpowers/)

## 다음 단계
- 사용자 설계 검토 → `writing-plans`로 구현 계획 작성 → Codex 구현 핸드오프

## 리스크 / 열린 항목
- 라이어 2명 시 역전·점수 밸런스
- 역전 정답 입력 방식(자동 4지선다 vs 수동 판정)
- 앱 메타데이터(이름/색/아이콘) 미확정

## 지식저장소 승격 여부
- Apps in Toss(React) 미니앱 셋업 패턴은 뽁뽁이(vanilla)와 함께 docs로 승격 후보(provisional). 구현 완료 후 정리.
