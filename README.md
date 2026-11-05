# dsh-reqtrace

[![test](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml/badge.svg)](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml)

Requirement-to-evidence audit for a DSH session.

Use `/reqtrace` in a session, or click the small document icon next to the
permission dropdown to open the right-sidebar panel. The plugin reads the
session log, extracts the user's requirements, maps them to tool calls/results
and shows a compact audit:

- **结论**: how many requirements are done/partial/missing;
- **需要你处理**: missing and partial items with a short reason;
- **已完成**: done items with one line of evidence;
- **超出范围**: changes that do not map to a requirement.

The plugin only reads and reports; it never edits files, approves tools or
changes the session.

## Install

From GitHub:

```bash
dsh plugin --profile desktop add github:xingyanghaifu/dsh-reqtrace
```

From a local checkout:

```bash
dsh plugin --profile web add E:\dshwork\dsh-reqtrace
```

Or use the local profile patch in a test profile.

## Clean-room check

Verified in a fresh `DSH_HOME` with DSH `0.2.1-rc.5`:

- profile composes `dsh-reqtrace`;
- page boot payload contains the `dsh-reqtrace` client entry;
- client bundle returns 200;
- `/api/reqtrace.audit?sessionId=missing` returns the expected `404 session-not-found`, proving the host route is mounted.

## Test

```bash
node --test --test-isolation=none test/*.test.mjs
```

26 tests: evidence collection, prompt building (including checklist order,
subagent evidence, child checklists and conflict warnings), archived-child
session-query loading, new-task archiving, unescaped-quote JSON repair, JSON report
parsing/formatting, requirement extraction, continuation filtering, command
registration, sidebar/tab/button registration, pending-task badge, config
sanitization, strict-mode steering, resume handoff formatting, token usage
capture, session-map bounds, and content-level conflict detection.

## Settings

`Settings → 需求对账` controls:

- **结束自动审计**: when enabled, a model audit runs automatically after a turn
  that reaches the minimum tool-call count; this costs tokens.
- **任务开始时提取验收清单**: when enabled, the user message is turned into a
  short checklist before work starts; this also costs tokens.
- **严格模式**: when a clear requirement is missing, steer the agent to keep
  working instead of ending the turn.
- **至少工具调用次数**: short tasks below this count do not trigger the reminder.

Both model features default off, so a fresh install only shows the small pending
dot and never calls a model until you open the panel.

## Notes

- The right-sidebar panel and the `/reqtrace` command share the same host audit.
- After a completed turn with at least two tool calls, the composer icon gets a
  small dot; opening the panel runs the audit and clears it.
- Task ledgers are capped at 200 sessions in memory and the latest 100 are
  written to `$DSH_HOME/reqtrace/ledgers.json`; the Settings page lists the
  recent ones (click a row to expand all items) and `/reqtrace history` prints
  them in the chat. `/reqtrace resume` lists tasks and
`/reqtrace resume <n>` hands the selected checklist and statuses to the current
conversation as a new “continue this task” instruction. The sidebar’s
“历史任务” section also has a per-task **继续** button for the same handoff.
- Starting a new task in the same session archives the previous checklist under
  `历史任务` in the panel; each task keeps its last-updated time.
- History can be cleared per task (Settings row), per session (`/reqtrace clear`)
  or entirely (Settings “清除全部历史清单” / `/reqtrace clear all`).
- The checklist can be edited, added to, or trimmed in the panel; saving it
  makes the next audit use those items as the source of truth.
- Each audit/extraction records provider token usage when the model reports it;
  the panel shows it under the verdict and next to the checklist header.
- In the panel, `Ctrl/Cmd+Enter` forces a fresh audit; the history ledger list is
  cached and invalidated whenever the saved data changes.
- Parent audits include live and archived descendant evidence, child checklists,
  and warnings when two sessions touched the same file or edited it with
  different content, or duplicated a child requirement; the panel lists child
  task status and can open the child session when the workspace service exposes
  it. Child ledgers are marked with `↳` in history. Strict mode is root-session
  only.
- New child tasks and a changed audit report are announced by a small flapping
  magpie that flies from the parent checklist to the target row/report; the
  target itself never moves except for a short landing dip. The effect is
  skipped under `prefers-reduced-motion`.
- The panel reads the agent's live `todo_write` list every 2 seconds and shows
  the current task status without a model call.
- Each checklist row exposes a per-requirement **Verify** action: the user enters
  a command (for example `npm test`), it runs through DSH's `ops_bash` tool, and
  the exit status/output is stored with the ledger and shown as ✓ / ×.
- The overflow menu exports the report as JSON or Markdown, including per-item
  tools, files, verification status, and child tasks.
- While the panel is open it checks for a newly finished task every 4 seconds;
  checklist rows show ✓ / ! / × once the matching report is available.
- Missing/partial report items can be hidden with the per-item “忽略” button.
- Requires a configured model (`agentDefaultModel`) for the audit call.
- The audit is conservative: a claim in the final answer without tool evidence is
  shown as `missing`, not trusted.
