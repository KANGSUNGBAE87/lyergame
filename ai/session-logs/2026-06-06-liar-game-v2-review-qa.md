# 2026-06-06 Liar Game v2 Review + QA

## Actor

- codex

## User Request

- Claude token limit 이후 Codex가 Liar Game v2 코드 리뷰와 QA 검토를 이어서 수행.

## Review Summary

- 게임 상태 흐름, 점수 계산, 라운드 기록 저장, 로컬 히스토리 조회, Apps in Toss 빌드 설정을 검토.
- 발견/수정: 투표 화면에서 0표 확정이 가능하고 총 투표 수가 참가자 수를 초과할 수 있어 불가능한 투표 상태가 결과에 반영될 수 있었다.
- 조치: `src/logic/voting.js`를 추가해 투표 산출을 순수 함수로 분리하고, `VoteScreen`에서 0표 확정과 참가자 수 초과 투표를 막았다.
- 조치: disabled 버튼 시각 상태를 CSS에 추가하고 `test/voting.test.js`로 무투표/단독 최다/동률 최다 케이스를 검증했다.

## Files Changed

- `src/screens/VoteScreen.jsx`
- `src/logic/voting.js`
- `src/styles/main.css`
- `test/voting.test.js`
- `ai/session-logs/2026-06-06-liar-game-v2-review-qa.md`

## Verification

- `npm test` — 6 files, 27 tests passed.
- `npm run build` — `ait build` passed, `liar-game.ait` generated.
- In-app browser QA at `http://localhost:5174/`:
  - 6명 기본 설정으로 3라운드 전체 진행.
  - 각 라운드에서 카드 공개 모달을 읽어 실제 라이어 번호를 확인하고, 해당 번호에 투표해 역전 화면 진입.
  - 역전 실패 선택 후 시민 승리 결과, 다음 라운드, 최종 결과, 기록 저장/조회 확인.
  - 0표 상태에서 `투표 확정` 비활성, 1표 입력 후 활성 확인.
  - 총 6표 입력 후 `+` 버튼 비활성 및 추가 클릭 후 카운트 불변 확인.
  - 브라우저 console error/warn 없음.

## Remaining Risks

- `npm audit --omit=dev --audit-level=high`는 Apps in Toss/Granite 하위 의존성에서 high/critical 취약점을 보고한다.
- 현재 `@apps-in-toss/web-framework` 최신은 2.6.1이며, `npm audit fix --force`는 1.14.1로 breaking downgrade를 제안하므로 이번 작업에서는 자동 수정하지 않았다.
- 이 취약점들은 주로 빌드/개발/패키징 서버 계층 의존성에 걸려 있으며, Toss 프레임워크의 보안 패치 버전이 나오면 재검토가 필요하다.

## Next Steps

- Apps in Toss 프레임워크 보안 패치 릴리스 확인 후 dependency refresh.
- 실제 모바일 WebView에서 카드 모달 2초 노출, 터치 간격, 긴 카테고리/단어 표시를 한 번 더 QA.

## Knowledge Promotion

- 이번 로그는 프로젝트 로컬 리뷰/QA 증거로 충분하다. 별도 공유 지식 저장소 승격은 보안 패치 대응이나 배포 절차가 확정될 때 검토.
