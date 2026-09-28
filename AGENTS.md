# Working on Coronabingo

Coronabingo uses Next.js Pages Router, React, Webpack, Firestore, and npm. Preserve these choices unless the task changes them. Runtime versions and commands live in `.nvmrc`, `package.json`, and `package-lock.json`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Read for the task

- Setup, commands, and troubleshooting: [README.md](README.md).
- Implementation, review, PRs, or cleanup: [workflow](docs/agents/workflow.md).
- Plans, tickets, or evidence: [issue tracker](docs/agents/issue-tracker.md). Use the primary checkout's local, ignored `research/` by absolute path; small tasks need only a short record. Keep skill configuration in versioned `docs/agents/`.
- Product language or behavior: [CONTEXT.md](CONTEXT.md) and [domain guidance](docs/agents/domain.md).
- UI, copy, or assets: [design context](.better-web-ui.md). Preserve approved terminology and interactions.

Write all project documentation outside `research/` in English, including headings, instructions, and explanatory examples. This rule does not change the conversation language or the app's Spanish and English translations.

## Scope and authorization

- Investigation and proposal requests authorize findings and a reviewable proposal. Implement when requested or approved; continue routine steps within that scope without asking again.
- Recheck current code, Git, and existing PRs before acting on older findings. Distinguish confirmed defects, intentional behavior, accepted limitations, and optional improvements. Reopen decisions with new evidence; keep deferred work outside the task.
- An implementation request includes local verification and coherent commits. Honor requests to leave changes uncommitted. A request to open a PR also authorizes branch pushes, check monitoring, and in-scope corrections.
- Approval of completed changes, including a contextual `ok`, authorizes pushing the task branch and opening its PR. Approval of a proposal authorizes the proposed work. An acknowledgment does not expand the preceding request.
- Merge into `main`, Production deployment, history rewriting, and provider changes require authorization covering those actions. Reuse existing authorization; task-specific exceptions do not become standing permissions. A push may trigger CI and Vercel.

## Workspaces and data

- Inspect checkout, branch, status, and worktrees before editing. Preserve unrelated work. Implement in a separate branch/worktree, reusing the task's existing checkout. Read-only investigation may use the current checkout.
- Follow the workflow's bootstrap before working in a new checkout. Each checkout owns its dependencies and generated state. Verify process ownership before stopping services or removing worktrees.
- Treat `.env*` as secret-bearing except the value-free `.env.template`. Inspect names without printing values. Preserve existing files; use only an owner-approved source for the named environment. Keep credentials, session state, and private URLs out of logs and commits. Browser exports in `next.config.js` must contain no server credentials.
- Verify the Firebase target before browser writes. Localhost and Preview URLs do not establish isolation. Gameplay needs no Firebase Authentication; preserve server-enforced security boundaries.
- Vercel Preview gameplay is owner-approved even with Production Firestore. Use short-lived, unmistakably named task records and record their IDs. Delete their players and room when rules and authorized tooling permit; otherwise leave the room empty and report its ID and cleanup gap. This permission covers gameplay records only.
- Other Production data changes, Firebase rules/configuration, billing, and provider settings require explicit target/action authorization. Clean up only task-owned data within that authorization.

## Validation and delivery

- Code baseline: `npm run lint:check`, `npm run build`, and `git diff --check`. Use focused checks during development and the baseline before handoff. See README for checks triggered by locales, card data, analytics, and gameplay.
- Documentation-only changes require content, link, command, and diff checks. Commit hooks still apply; inspect their changes and repeat affected checks.
- Exercise affected user journeys at the task's verified URL. Use separate host/player contexts for synchronization, both languages for shared UI/copy, and relevant mobile/desktop widths for layout. Prefer realistic flows and meaningful boundaries; test small logic at the appropriate level.
- Reuse results only for unchanged code, environment, and scope. Distinguish local, CI, Preview, and Production evidence. A successful build or ready deployment does not prove gameplay or deployed Firebase rules.
- Deliver branch/worktree, commits, checks, review findings, acceptance gaps, and retained processes/data. Include PR and Preview links when published. Mark work resolved only when its agreed acceptance criteria are met.
