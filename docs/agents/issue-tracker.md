# Issue tracker: local Markdown

Issues, specs, plans, and investigations live in a local, ignored `research/` directory. Skill configuration remains versioned in `docs/agents/`, `AGENTS.md`, `CLAUDE.md`, and `CONTEXT.md`. Use this tracker when a skill supplies a generic `.scratch/` layout.

## Locate the shared records

- Use an explicitly supplied canonical research path. Otherwise inspect `git worktree list --porcelain` and use `research/` in the primary checkout, not the current task worktree. Resolve and pass absolute paths to skills and agents.
- All relative `research/` paths below refer to that canonical directory. Use `rg --files --hidden --no-ignore <absolute-research-path>` when locating ignored records; Git file listings will omit them.
- Preserve existing records and coordinate claims before editing shared tickets. Do not overwrite canonical files with stale worktree copies.
- New worktrees use the shared directory. A fresh clone has no research history: restore the relevant owner-provided backup for existing tasks, or create the directory for new work. Missing existing specifications must be recovered, not silently replaced.
- Research has no Git backup going forward. Back it up separately and preserve unique worktree records before cleanup. Local records may contain private evidence; publish only the necessary non-sensitive summaries.

## Find and organize work

- Read the supplied path or locate the ticket ID, then follow its linked plan/index. Compare it with current code, Git, and PRs before implementation or resumption.
- If `research/README.md` exists, use it as a link directory to canonical initiative indexes, keeping ticket status in its owning record.
- Reuse canonical documents, preserving paths, IDs, evidence, and history. Small tasks may use one short record directly under `research/`.
- New ticket groups use `research/<feature>/README.md`, `tickets/<ID>-<slug>.md`, and an optional `spec.md`. Continue existing ID sequences; otherwise start at `01`.
- Link new tickets from the index. Keep scope, exclusions, acceptance criteria, and evidence in the canonical record; link an existing specification instead of duplicating it.

When no exact record is supplied, set `research_dir` to the absolute canonical directory resolved above and search Markdown filenames first. For example:

```bash
rg --files --hidden --no-ignore "$research_dir" -g '*.md' -g '!**/node_modules/**' -g '!**/.venv/**' | rg 'PERF-09|product-analytics'
```

Read the selected record's current state and linked outcome. Search bodies within the relevant initiative if filenames do not identify it; include evidence artifacts only when needed.

## State and evidence

- `Status: <state>` uses [triage-labels.md](triage-labels.md). Triage does not authorize implementation.
- `Work status: open`, `claimed`, or `resolved` tracks execution separately. Claim before starting; resolve only after meeting the agreed criteria.
- Preserve legacy `Estado:` lines without inferring readiness or approval. Add structured fields when working on the record.
- Append dated decisions and rationale under `## Comments`. Distinguish defects, intentional behavior, accepted limitations, and deferred suggestions.
- Put outcomes under `## Answer`: criteria met, commands/results, revision, environment, relevant URL, and gaps. Separate local, CI, Preview, and Production evidence.
- Record blockers and next actions without resolving incomplete work. Preserve valid deliveries when resuming.
- For long-lived initiatives, keep a dated `## Current state` near the top with the revision checked, implemented scope, dated deployment evidence, and remaining follow-ups. Link canonical answers and refresh this summary at material transitions. Keep the original narrative under `## History`; partial completion and historical approval do not authorize remaining work. Recheck the relevant code and PRs before acting on the summary.
- Keep detailed evidence in the local record; never force-add it to Git. Summarize acceptance criteria and checks in PRs/handoffs so remote review does not depend on local files. Keep approved product decisions needed by future contributors in the appropriate versioned domain/design docs.

## Wayfinding operations

Use a map only when the selected workflow requires one; ordinary tasks can use their existing record or index.

- Map: `research/<effort>/map.md` contains Notes, Decisions-so-far, and Fog; link it from the index.
- Child: one file per ticket, linked from the map, with `Type: research`, `prototype`, `grilling`, or `task`.
- Blocking: list `Blocked by: <ID>, <ID>`. A ticket is unblocked when all blockers have `Work status: resolved`.
- Frontier: take the first open, unblocked, unclaimed ticket in map order.
- Resolve: record the answer/evidence, mark resolved, and link a summary in Decisions-so-far.
