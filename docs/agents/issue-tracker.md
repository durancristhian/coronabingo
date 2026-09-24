# Issue tracker: local Markdown

Issues, specs, plans, and investigations live under `research/`.

## Organization

- Reuse an existing document or feature directory when it already covers the work.
- Preserve existing paths, ticket identifiers, evidence, and history.
- Standalone investigations and plans may remain directly under `research/`.
- For new efforts with multiple tickets, use `research/<feature>/README.md` as the index and `research/<feature>/tickets/<ID>-<slug>.md` for individual tickets.
- Continue an effort's existing ID sequence, such as `PERF-01`. Otherwise, number tickets from `01`.
- Put new specs at `research/<feature>/spec.md`. If a canonical plan or spec already exists elsewhere in `research/`, link to it instead of duplicating it.
- Link evidence from the relevant plan or ticket.

## Ticket state and history

- Record triage state near the top as `Status: <state>`, using `triage-labels.md`.
- Track execution separately as `Work status: open`, `claimed`, or `resolved`.
- Preserve existing descriptive `Estado:` lines. Add structured fields when a ticket is actually triaged or worked on; do not infer readiness or approval from legacy wording.
- Append dated discussion under `## Comments`.
- Record the outcome and verification evidence before marking work resolved.
- A triage state does not expand the user's authorized scope.

## Publish to the issue tracker

Create or update the appropriate Markdown file under `research/` and link new tickets from the effort's index.

## Fetch the relevant ticket

Read the supplied path. If given only an ID, locate it under `research/`, then read the ticket and its linked plan or index.

## Wayfinding operations

- Map: use `research/<effort>/map.md` for Notes, Decisions-so-far, and Fog. Link it from the effort's index.
- Child: one file per ticket in `tickets/`, linked from the map. Record `Type: research`, `prototype`, `grilling`, or `task`.
- Blocking: record `Blocked by: <ID>, <ID>` near the top. A ticket is unblocked when all listed blockers have `Work status: resolved`.
- Frontier: select the first open, unblocked, unclaimed ticket in map order.
- Claim: save `Work status: claimed` before starting work.
- Resolve: append the answer and evidence under `## Answer`, set `Work status: resolved`, and add a summary with a ticket link to the map's Decisions-so-far.
