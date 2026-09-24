# Playwright regression test plan

Date: 2026-09-23

Status: design interview in progress. No implementation decisions accepted yet.

## Requested outcome

Build a reusable Playwright suite that agents and the owner can run while changing Coronabingo. Start with a small useful set and expand coverage of the app's main user flows. A passing run establishes only the behavior covered by its assertions and environment.

This request opens a new testing initiative after the [Cypress removal](cypress-removal-plan.md). It does not restore the retired suite.

## Inspected baseline

- The current package has no browser test runner or `npm test` command.
- CI runs on pushes, checks types and lint, and builds with locale validation. It does not exercise gameplay.
- Gameplay uses Firestore without Firebase Authentication. `utils/firebase.ts` currently has no emulator connection option.
- The app uses Next.js Pages Router, React 18, Webpack, and Spanish and English locales.
- Standalone administration and charity-event routes are retired. Room setup remains active.
- Previous manual checks provide candidate scenarios, not current automated coverage: [preview acceptance](node-24-preview.md) and [room verification after cleanup](admin-events-cleanup.md).
- `CONTEXT.md` already distinguishes rooms, hosts, players, room setup, and room codes. Use these terms; no new domain term has been agreed in this interview.

## Decision tree

First round, awaiting the owner:

1. Initial coverage: prioritize a complete host/player game flow, or a broader set of shallow page checks?
   - Proposed first flow: create a room, add host and player, assign cards, join with isolated sessions, synchronize a called number, retain a marked card after refresh, restart and play again.
   - Later decisions: additional scenarios, expected behavior in edge cases, browsers, mobile viewports, and languages.
2. Data environment: use local Firestore emulation, a hosted test project, or separate suites for both?
   - Proposed default: local Firestore emulation for routine regression tests.
   - Later decisions: data setup and cleanup, rule fidelity, isolation, and any hosted verification.
3. Execution workflow: local use by agents, CI, or both?
   - Proposed default: one local command and the same suite in CI.
   - Later decisions: required gates, time budget, build lifecycle, reports, retries, and agent instructions.

Implementation starts after the design interview reaches shared understanding, following the explicitly invoked `grilling` skill. Record accepted decisions here as answers arrive. Add an ADR only for a consequential trade-off that warrants one; keep technical test decisions out of the domain glossary.

## References

- [Playwright best practices](https://playwright.dev/docs/best-practices): test visible behavior, isolate tests and their data, and use resilient locators and retrying assertions.
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite): local integration testing without production data.
- Installed Next.js testing guide: `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`, also referenced by the Pages Router guide. It recommends testing a production build.
