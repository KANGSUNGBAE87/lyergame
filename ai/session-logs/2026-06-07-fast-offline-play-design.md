# 2026-06-07 Fast Offline Play Design

## Actor

- codex

## User Request

- 오프라인에서 더 빨리 시작되고, 더 덜 귀찮고, 결과가 더 재밌는 앱 방향을 논의한 내용을 검토 가능한 기획안으로 정리.
- 플레이어 이름 입력은 선택형으로 포함.

## Decisions

- 이름 입력은 필수가 아니라 선택형으로 둔다.
- 빠른 시작은 인원수 중심으로 유지한다.
- 고급 설정은 접힘 영역으로 둔다.
- 투표는 패스폰 비밀투표로 설계한다.
- 동점 발생 시 라이어 포함 여부는 숨기고 `재투표하기`와 `빠른 판정`을 제공한다.
- 재투표에서도 동점이면 자동으로 빠른 판정을 적용하는 것을 추천값으로 둔다.
- 투표 상세 내역은 기본 비공개이며, 최종 결과에서 선택 공개로 둔다.

## Files Changed

- `ai/plans/2026-06-07-fast-offline-play-design.md`
- `ai/plans/2026-06-07-offline-commercial-review.md`
- `ai/session-logs/2026-06-07-fast-offline-play-design.md`

## Verification

- Planning/documentation only. No source code changed.

## Remaining Risks

- Implementation plan is not written yet.
- UI tone and exact visual style still need review before coding.

## Knowledge Promotion

- Project-local planning document is enough for now.
- Promote the final approved product direction to `/Users/kangsungbae/Documents/지식저장소/projects/라이어게임/` after user approval.

