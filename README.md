# dsh-reqtrace

[![test](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml/badge.svg)](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml)

[English](README.md) · [中文](README.zh-CN.md)

Requirement-to-evidence audit for a DSH session: check what the agent claims
against what it actually did, turn gaps into an explicit follow-up, and keep the
evidence with the task.

Open the panel from the small document icon next to the permission dropdown, or
run `/reqtrace` in a session.

## What it does

- **Live task list** — reads the agent's latest `todo_write` list every 2 seconds
  and shows pending / in-progress / completed steps without a model call. The
  list collapses when everything is done.
- **Checklist** — extracts 3–8 acceptance items from the current user request,
  or lets you edit them by hand.
- **Evidence mapping** — maps each requirement to the tool calls, files, and
  commands that actually appeared in the session log.
- **Subagent coverage** — parent audits include live and archived descendant
  sessions, child checklists, and warnings when two sessions touched the same
  file or edited it differently.
- **Per-requirement verification** — enter a command such as `npm test`; it runs
  through DSH's `ops_bash` tool and the result is stored with the ledger and
  shown as ✓ / ×. Nothing runs automatically.
- **Close the loop** — missing or partial items can be sent back to the agent as
  a precise follow-up (`Fix with evidence`). The follow-up includes the original
  task and the exact gaps.
- **History first, resume later** — clicking a historical task expands its
  checklist and evidence. It does not message the current agent or switch
  sessions. `Continue this task` is a separate, explicit action.
- **Reports** — export JSON or Markdown, including requirements, evidence,
  tool commands, verification results, and child tasks.
- **Audit modes** — direct model call (default, fast) or optional subagent
  review (`spawn`, isolated but slower and more expensive).
- **Strict mode** — optionally steer the agent when a clear requirement is still
  missing at turn end.

The plugin does not edit files, approve tools, or change the session on its own.
The only state it writes is its local ledger and the explicit follow-up/verify
actions you trigger.

## Install

From GitHub:

```bash
dsh plugin --profile desktop add github:xingyanghaifu/dsh-reqtrace
```

From a local checkout:

```bash
dsh plugin --profile web add E:\dshwork\dsh-reqtrace
```

Requires DSH `>=0.2.1-rc.1 <0.3.0` and Node.js `^22.19` or `>=24`.

## Usage

1. Open `需求对账 / Requirement Trace` in the right sidebar.
2. If the checklist is empty, use **Extract checklist** (costs tokens).
3. Review the evidence under each requirement. Hover a command to see its
   target; hover a verification badge to see its output.
4. For a missing item, click **Verify**, enter a command, and run it. The result
   is saved.
5. To make the agent finish a gap, click **Ask Agent to finish**. To see old
   work, expand any item under **Task history**.

### Commands

The panel is the primary UI; commands are optional:

```text
/reqtrace                 audit the current session
/reqtrace history         print recent task ledgers
/reqtrace resume          list resumable tasks
/reqtrace resume <n>      hand a historical checklist to the current agent
/reqtrace clear           clear the current session ledger
/reqtrace clear all       clear all saved ledgers
```

## Settings

`Settings → 需求对账`:

| Setting | Default | Meaning |
|---|---|---|
| Auto-audit on turn end | off | Run an audit automatically after a task. Costs tokens. |
| Extract checklist at task start | off | Turn the user message into acceptance items. Costs tokens. |
| Strict mode | off | Steer the agent when a clear requirement is missing. |
| Minimum tool calls | 2 | Shorter tasks do not trigger the reminder. |
| Audit mode | direct | `direct` or `subagent` independent review. |

## Data and privacy

- Ledgers are stored locally at `$DSH_HOME/reqtrace/ledgers.json`.
- At most 200 sessions stay in memory; the latest 100 are persisted.
- No telemetry, no upload; the only network calls are the model calls and any
  verification command you explicitly run (through the DSH tool pipeline).
- Audit and extraction use the configured `agentDefaultModel`; token usage is
  shown when the provider reports it.
- Verification commands run with the same DSH tool policy/approval path as the
  agent; they are never started automatically.

## Development

```bash
node --test test/*.test.mjs
```

33 tests cover evidence collection, prompt construction, JSON repair (including
truncated reports and unescaped Windows paths), todo reading, subagent audit
mode, config sanitization, command registration, strict steering, verification
execution, and UI registration.

Clean-room checklist for DSH `0.2.1-rc.5`:

- profile composes `dsh-reqtrace`;
- boot payload contains the client entry;
- client bundle returns 200;
- `/api/reqtrace.audit?sessionId=missing` returns `404 session-not-found`.

## Limitations

- The audit is a model judgment over session evidence; a claim without evidence
  is reported as missing rather than trusted.
- Verification is per-requirement and user-triggered; it does not magically
  discover the right command or map test results to requirements.
- Subagent audit requires a working `spawn` provider; if it is unavailable the
  plugin falls back to a direct call.
- This is an early plugin. The ledger schema and UI may change.

## License

MIT.
