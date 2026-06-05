
## Shared Knowledge Sources

- Reuse the shared long-term knowledge repository at `/Users/kangsungbae/Documents/지식저장소`.
- Before substantial planning, architecture, or coding work, read `/Users/kangsungbae/Documents/지식저장소/AI_CONTEXT.md`, then `agent/index.md`, `agent/profile.md`, `agent/operating-rules.md`, and the relevant `sessions/` or `projects/` notes.
- Treat `/Users/kangsungbae/Documents/최종관리자` as a historical/reference workspace when relevant. Search its dated folders for explicit files, but prefer promoted knowledge in `/Users/kangsungbae/Documents/지식저장소` as the durable source of truth.
- When reusable knowledge appears during `라이어게임` work, promote it into Markdown under `/Users/kangsungbae/Documents/지식저장소` so Codex, Claude, and future AI assistants can share it.
- Keep sync token-light: do not replay all raw logs, do not paste full transcripts, and do not repeatedly read large logs or generated graph files unless the task specifically requires it.
- Answer the user in Korean by default unless the task or requested artifact clearly calls for another language.

## understand-anything

This project uses Understand-Anything project memory in `.understand-anything/`.

Rules:
- For architecture mapping, onboarding, codebase Q&A, domain flow, or diff-risk analysis, prefer the installed Understand-Anything skills before doing a broad source walk.
- Keep `.understand-anything/config.json` with `"language": "ko"`, `"outputLanguage": "ko"`, and `"autoUpdate": true` unless the user asks otherwise.
- Refresh Understand-Anything only after meaningful project or code architecture changes. Do not run it for policy-only, copy-only, or note-only changes.

## Project Plans and Session Logs

This project stores AI-generated planning and session evidence under `ai/`.

Rules:
- Save Claude or Codex plans, specs, implementation briefs, review briefs, QA plans, and release plans in `ai/plans/` as dated Markdown files.
- Save meaningful session change logs in `ai/session-logs/` as dated Markdown files. Include user request, decisions, files changed, commands or verification, risks, next steps, and knowledge-store promotion status.
- Keep plans and logs concise. Do not paste full chat transcripts or full tool logs unless the raw evidence itself is the artifact being preserved.
- Keep `ai/` available to project-local Graphify; do not ignore it in `.graphifyignore`.
- Promote reusable knowledge from these logs to `/Users/kangsungbae/Documents/지식저장소`.
- Refresh project Graphify only after meaningful source Markdown or code changes, preferably at the end of a work batch. Use `graphify update . --no-cluster` as the routine fallback when no LLM API key is available.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
