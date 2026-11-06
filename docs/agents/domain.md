# Domain guidance

Before changing product language or behavior, read [CONTEXT.md](../../CONTEXT.md) and any applicable decisions in `docs/adr/`. This is a single-context project; an absent ADR directory needs no setup.

Use the glossary in proposals, tickets, tests, and new code. If a concept is missing, check existing terms before proposing an addition. Keep definitions separate from implementation details.

Identify any conflict with an approved decision and explain the new evidence before proposing a change. Create ADRs only for decisions that warrant a durable rationale.

Host room-code grants apply only to one room and game number. A restart invalidates the prior game's grants in every subscribed host view. The code remains a client-side UX gate, not server authorization.

During room setup, unsaved fields stay local until acknowledged by a matching snapshot; unrelated remote fields continue to refresh. Player deletion errors must preserve a retryable roster. Called-number changes use a transaction on the current game, and sound completion may clear only its own command.
