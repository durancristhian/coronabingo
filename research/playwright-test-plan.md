# Playwright regression test plan

Date: 2026-09-23

Status: plan saved for later implementation at the owner's explicit request.

Work status: open; not started.

Execution is deferred. The owner requested saving the complete plan without executing it. Resume implementation only when the owner requests it in a later session. The command and workflow below describe the intended result; they are not implemented yet.

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

## Accepted decisions

- The first suite covers the complete host/player journey described below. The owner considers it the minimum behavior that must remain working after app changes. Broader coverage can follow later.
- The suite must be easy for both the owner and agents to run locally.
- The public command will be `npm run ui-tests`, leaving naming space for future unit tests.
- Initial browser coverage is Chromium on desktop, in Spanish.
- Every GitHub build must include a regression-test step so changes are checked continuously. A failed regression must make that CI run fail.
- Use the local Firestore emulator, including its Java dependency, to avoid modifying the development database and depending on hosted Firebase during tests.
- Run the suite against a development server locally and a compiled production-mode server in CI. Provide a local option to reproduce CI.

## First suite: acceptance journey

The same Playwright scenario runs in both modes, using two isolated browser contexts for host and player. It must establish the following through visible application behavior:

1. Create a room from the home page.
2. Add two named participants and select one as host.
3. Configure the room and reach its lobby.
4. Open each participant's playing link in its own context; both receive their assigned cards, and host controls appear for the host.
5. Draw a number as host and observe that same number in the player's session without reloading.
6. Mark an actual number on the player's card, reload that session, and verify the same card and mark persist.
7. Restart as host; the host returns to room setup and the player sees the waiting state.
8. Configure the next game; both can play again, the previous draw is cleared, and another draw synchronizes.

Assert outcomes rather than exact random IDs, ticket pairs, or drawn values. Re-dealing does not guarantee every random card differs from its previous value. Automated winner detection is not part of current app behavior or this suite.

## Execution contract

- `npm run ui-tests`: prepare the isolated test environment, start the emulator and a dedicated Next.js development server, run the journey, and close owned processes on success or failure.
- Provide an explicit production-mode option for local reproduction of CI. Its exact flag or secondary script is an implementation detail to document.
- Every current GitHub build includes the regression step. Set test configuration before the build, serve that build with `next start`, and execute the same journey. Reuse the prepared build instead of compiling twice. Preserve lint, type, locale and bundle-report checks.
- A regression or service startup failure returns a nonzero exit code and fails CI.
- One-time setup installs the Playwright browser, the emulator tooling and Java 21 or later. Record exact supported versions and commands during implementation. Package tooling should be pinned through the lockfile.
- Initial installation and uncached CI dependency downloads require internet. Once dependencies are available, gameplay tests must not depend on hosted Firebase or third-party services.
- Measure actual local and CI durations during verification; no duration has been promised.

Proposed implementation defaults retained for the future implementation session, not separately confirmed during this interview:

- Start with one worker and no automatic test retries. An intermittent failure remains visible instead of becoming a green run on retry.
- Save an HTML report and failure screenshots/traces, and upload CI evidence even when tests fail.
- Document setup, the command, covered behavior, troubleshooting and CI reproduction in the README. Add agent guidance to run this suite when changes affect the covered flows and report checks not run.

## Isolation and evidence boundaries

- Use a dedicated `demo-` project and fresh disposable emulator data. Do not reuse the owner's hosted Firebase configuration or existing development server.
- Separate test build output from normal development/build output so test runs do not corrupt an active development session or leave an emulator build masquerading as the normal app build.
- Restrict emulator connections to the configured local endpoint; configuration errors must fail instead of falling back to hosted Firestore.
- Disable analytics emission coherently in test mode and isolate ads, embeds and other third-party requests. The app's Firestore SDK and real-time listeners remain active against the emulator.
- Use visible labels and roles where possible; add minimal stable selectors only where necessary. Wait for observable outcomes rather than fixed sleeps.
- Scope any cleanup to this run's emulator instance and owned processes. Handle occupied ports explicitly.
- Emulator rules are test rules unless deployed parity is independently established. This suite does not validate deployed rules, compound indexes, quotas, hosted availability or the deployed site.
- Mobile layouts, English, additional browsers, visual snapshots, manual draw mode, host code protection, downloads, error routes, load testing and unit tests are future coverage, not claims of this first suite.

## Implementation notes and verification

Read-only inspection found installed Firebase 7.24.0 and Firestore 1.18.0. This version exposes `settings({ host, ssl })`, so connecting to the local emulator does not require upgrading the app SDK. Java was absent at inspection time. No Firestore rules or emulator configuration files were checked into the repo. Recheck dependencies and working-tree changes before editing.

Firebase variables are compiled into the browser bundle through `next.config.js`; emulator settings must apply before building. Read the installed Next.js guide before changing application code. Preserve unrelated changes.

Implementation should verify the complete journey in local development and production modes, a fresh subsequent run, failure exit behavior and evidence capture, service cleanup, and applicable existing checks. Review the workflow configuration locally; a local CI-equivalent run is not proof of an actual GitHub Actions run. Record which evidence was obtained.

No new domain vocabulary was needed; retain the existing `CONTEXT.md`. This bounded, reversible tooling choice does not warrant a separate ADR. This plan is the decision record.

No tests, dependencies, Java installation, app configuration or workflow changes have been made by this planning session. The owner's latest instruction is to preserve this plan and defer execution.

## Resume checklist

When the owner requests implementation:

1. Read this plan, current `AGENTS.md`, `CONTEXT.md`, package scripts, CI workflow and installed Next.js testing guide. Check the working tree and current tool versions; the baseline above is dated evidence.
2. Retain the accepted choices. Review the proposed implementation defaults above with the new request rather than reopening settled decisions.
3. Add project-local Playwright and emulator tooling, the documented Java/browser setup, and isolated emulator configuration with explicit test rules.
4. Add a test-only Firebase connection path and coherent analytics handling. Keep normal app behavior intact; prevent hosted Firebase fallback.
5. Implement `npm run ui-tests`, owned server/emulator lifecycle, separate test output, and a production-mode reproduction option.
6. Implement the acceptance journey with separate host/player contexts, visible assertions and isolated data.
7. Add the regression step and failure artifacts to every applicable GitHub build workflow. Configure the test environment before compilation and preserve existing checks.
8. Document setup and usage in the README and add the agreed verification guidance for agents. Read applicable writing guidance before editing agent instruction files.
9. Verify both execution modes, fresh reruns, failure reporting and cleanup. Run applicable existing checks and record results and measured durations here. Distinguish local verification from actual GitHub execution.

Likely files include `package.json`, `package-lock.json`, `utils/firebase.ts`, `contexts/Analytics.tsx`, `next.config.js`, `.github/workflows/push.yml`, `.gitignore`, `README.md`, agent instructions, and new Playwright configuration, tests and emulator files. Recheck actual call sites before editing; this is a scope guide, not a requirement to change every listed file.

## Decision history

- Accepted the complete host/player journey and execution locally and in every GitHub build.
- Accepted desktop Chromium in Spanish and selected `npm run ui-tests` to leave room for future unit tests.
- Discussed hosted development Firebase versus local emulation. Accepted the emulator and Java dependency to avoid hosted data contamination and hosted-service dependence.
- Replaced the initial proposal to compile before every local run with development mode locally and production mode in CI; the owner accepted both modes.
- The owner then requested saving the entire plan for another time and explicitly prohibited executing it now. Saved this handoff without implementing or installing anything.

## References

- [Playwright best practices](https://playwright.dev/docs/best-practices): test visible behavior, isolate tests and their data, and use resilient locators and retrying assertions.
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite): local integration testing without production data.
- Installed Next.js testing guide: `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`, also referenced by the Pages Router guide. It recommends testing a production build.
