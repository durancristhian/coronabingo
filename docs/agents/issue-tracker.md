# Issue tracker: local Markdown

Issues, specs, plans, and investigations live under `research/`. Use these paths when a skill supplies a generic `.scratch/` layout.

## Find and organize work

- Read the supplied path or locate the ticket ID, then follow its linked plan/index. Compare it with current code, Git, and PRs before implementation or resumption.
- Reuse canonical documents, preserving paths, IDs, evidence, and history. Small tasks may use one short record directly under `research/`.
- New ticket groups use `research/<feature>/README.md`, `tickets/<ID>-<slug>.md`, and an optional `spec.md`. Continue existing ID sequences; otherwise start at `01`.
- Link new tickets from the index. Keep scope, exclusions, acceptance criteria, and evidence in the canonical record; link an existing specification instead of duplicating it.

## State and evidence

- `Status: <state>` uses [triage-labels.md](triage-labels.md). Triage does not authorize implementation.
- `Work status: open`, `claimed`, or `resolved` tracks execution separately. Claim before starting; resolve only after meeting the agreed criteria.
- Preserve legacy `Estado:` lines without inferring readiness or approval. Add structured fields when working on the record.
- Append dated decisions and rationale under `## Comments`. Distinguish defects, intentional behavior, accepted limitations, and deferred suggestions.
- Put outcomes under `## Answer`: criteria met, commands/results, revision, environment, relevant URL, and gaps. Separate local, CI, Preview, and Production evidence.
- Record blockers and next actions without resolving incomplete work. Preserve valid deliveries when resuming.
- Commit durable evidence with the implementation. Live PR/check status may remain in PRs and handoffs; avoid commits solely to refresh transient status or self-referential HEADs.

## Wayfinding operations

Use a map only when the selected workflow requires one; ordinary tasks can use their existing record or index.

- Map: `research/<effort>/map.md` contains Notes, Decisions-so-far, and Fog; link it from the index.
- Child: one file per ticket, linked from the map, with `Type: research`, `prototype`, `grilling`, or `task`.
- Blocking: list `Blocked by: <ID>, <ID>`. A ticket is unblocked when all blockers have `Work status: resolved`.
- Frontier: take the first open, unblocked, unclaimed ticket in map order.
- Resolve: record the answer/evidence, mark resolved, and link a summary in Decisions-so-far.
