# dsh-reqtrace

[![test](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml/badge.svg)](https://github.com/xingyanghaifu/dsh-reqtrace/actions/workflows/test.yml)

[English](README.md) · [中文](README.zh-CN.md)

对 DSH 会话做“需求 → 证据”对账：核对 Agent 声称完成的事情和它实际做过的事情，
把缺口变成明确的后续动作，并把证据留在任务里。

在权限下拉菜单旁点小文档图标打开右侧面板，或在会话里输入 `/reqtrace`。

## 功能

- **实时任务清单**：每 2 秒读取 Agent 最近一次 `todo_write`，显示待办 / 进行中 /
  已完成，不调用模型；全部完成后自动折叠。
- **验收清单**：从当前用户请求提取 3–8 条验收项，也可以手动编辑。
- **证据映射**：把每条需求对应到会话日志里真实出现的工具调用、文件和命令。
- **子智能体覆盖**：父任务审计包含在线/归档子会话、子清单；两个会话改同一文件
  或内容版本不一致时会给出冲突提醒。
- **逐条验证**：输入 `npm test` 之类的命令，经 DSH 的 `ops_bash` 工具执行，结果
  写入 ledger，并显示 ✓ / ×。不会自动执行任何命令。
- **补齐闭环**：缺失/部分完成项可以发回 Agent，消息里带原始任务和具体缺口，
  要求给出可核对证据。
- **先看历史，再决定续接**：点历史任务只展开清单和证据，不会发消息、不会切换
  当前会话；「继续这个任务」是单独的显式按钮。
- **报告导出**：JSON 或 Markdown，包含需求、证据、工具命令、验证结果和子任务。
- **审计方式**：直接模型调用（默认，快）或可选的子智能体独立复核（隔离性好，
  但更慢、更贵）。
- **严格模式**：回合结束时仍有明确缺失项，可以提醒 Agent 继续补齐。

插件不会自行改文件、批准工具或修改会话。它只写本地 ledger，以及你明确触发的
补齐/验证动作。

## 安装

从 GitHub 安装：

```bash
dsh plugin --profile desktop add github:xingyanghaifu/dsh-reqtrace
```

从本地目录安装：

```bash
dsh plugin --profile web add E:\dshwork\dsh-reqtrace
```

要求 DSH `>=0.2.1-rc.1 <0.3.0`，Node.js `^22.19` 或 `>=24`。

## 使用

1. 打开右侧「需求对账」面板。
2. 清单为空时点「提取验收清单」（会消耗 token）。
3. 看每条需求下面的证据；命令可悬停查看，验证结果可悬停看输出。
4. 缺失项点「验证」，输入命令并运行，结果会保存。
5. 要让 Agent 补齐，点「让 Agent 补齐」；要看旧任务，展开「历史任务」。

### 命令

面板是主入口，命令只是可选：

```text
/reqtrace                 对当前会话做一次对账
/reqtrace history         打印最近的任务清单
/reqtrace resume          列出可续接任务
/reqtrace resume <n>      把历史清单交给当前 Agent 继续
/reqtrace clear           清除当前会话清单
/reqtrace clear all       清除全部历史清单
```

## 设置

`设置 → 需求对账`：

| 设置 | 默认 | 含义 |
|---|---|---|
| 结束自动审计 | 关 | 任务结束后自动审计，消耗 token |
| 任务开始时提取清单 | 关 | 把用户消息拆成验收项，消耗 token |
| 严格模式 | 关 | 有明确缺失时提醒 Agent 继续 |
| 至少工具调用次数 | 2 | 更短的任务不提醒 |
| 审计方式 | 直接调用 | `直接调用` 或 `子智能体独立复核` |

## 数据与隐私

- Ledger 保存在 `$DSH_HOME/reqtrace/ledgers.json`。
- 内存最多 200 个会话，持久化最近 100 个。
- 无遥测、不上传；网络请求只有模型调用，以及你明确发起的验证命令（走 DSH
  工具管线）。
- 审计/提取使用配置的 `agentDefaultModel`；provider 返回 usage 时会显示 token。
- 验证命令和 Agent 走同一套 DSH 工具策略/审批；不会自动启动。

## 开发

```bash
node --test test/*.test.mjs
```

33 个测试覆盖：证据收集、提示词构造、JSON 修复（截断报告、Windows 路径）、
todo 读取、子智能体审计、配置清洗、命令注册、严格模式、验证执行和 UI 注册。

干净环境检查（DSH `0.2.1-rc.5`）：

- profile 能组合 `dsh-reqtrace`；
- boot payload 包含 client 入口；
- client bundle 返回 200；
- `/api/reqtrace.audit?sessionId=missing` 返回 `404 session-not-found`。

## 限制

- 审计是模型对会话证据的判断；没有证据的声称会被标成缺失，而不是直接相信。
- 验证是逐条、手动的；不会自动猜测试命令，也不会自动把测试结果映射到需求。
- 子智能体审计需要可用的 `spawn` provider；不可用时回退到直接调用。
- 早期插件，ledger schema 和 UI 可能继续变化。

## 许可证

MIT。
