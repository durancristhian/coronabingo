# Playwright regression test plan

Date: 2026-09-23

Status: implemented and verified locally on 2026-09-24.

Work status: resolved.

The owner requested implementation in this session. The deferred planning history below is retained; current implementation evidence is recorded under Comments.

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

## Comments

### 2026-09-24: implementation and local verification

The owner requested implementation on September 23. Retained the accepted scope and adopted one worker, zero retries, HTML reports and failure screenshots/traces. This supersedes the earlier deferral without changing its history.

- Worktree: `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-e8850982`.
- Branch: `t3code/implement-playwright-test-plan`. Reused the app-created worktree, initially clean.
- Base: `6ddd4d2279a05f0a9db1c9f62a4bf98cad0a0087`, equal to fetched `origin/main` at implementation start.
- Test URL: `http://127.0.0.1:3187`. Firebase target: local `demo-coronabingo-ui`, Firestore `127.0.0.1:8187`. No owner environment file was created, copied or modified.
- Versions verified: Node 24.21.0, npm 11.19.0, OpenJDK 21.0.12.1, Playwright 1.63.0, Chromium 153.0.8010.12, Firebase CLI 15.31.0, Firestore emulator 1.22.0. Installed Java through Homebrew and downloaded Chromium and the emulator. No shell profile or system Java symlink was changed.

Implemented `npm run ui-tests`, `ui-tests:production`, `ui-tests:build` and `ui-tests:ci`. The runner owns its process group, checks reserved ports, uses a worktree lock, verifies Java, and prepares fixed public demo configuration. The runner owns the emulator, Next.js and Playwright process groups and shuts them down in reverse order, with a 10-second graceful shutdown limit before terminating a stalled group. The runner prints its PID and checkout path; during execution `.ui-tests-lock/owner.json` identifies ownership. Services are never reused. Emulator data starts empty, is held locally and is not exported.

Test output and TypeScript cache use `.next-ui-tests`; normal `.next` output remains separate. The runner restores `next-env.d.ts` after Next modifies its generated references, provided it still points at the test build. The app rejects inconsistent emulator configuration. Test analytics and ads are disabled. Both browser contexts block external HTTP requests and websockets; assertions reject attempted hosted Firebase requests. The app's existing Firestore SDK and listeners remain active.

The journey checks both assigned card IDs against the lobby, host-only draw controls, a live draw in the second context, card contents and a selected number after reload, waiting after restart, cleared draws and another synchronized draw. Random IDs, assigned cards and draws are not fixed. Minimal card, lobby-row and called-number selectors were added; card buttons now expose their pressed state to assistive technology. The host select retains its existing accessible name `adminId`.

CI now installs Java and Chromium, builds once with demo configuration and locale validation, runs the same journey against `next start`, and uploads available reports, traces, screenshots and emulator logs even on failure. Existing type/lint and bundle-report checks remain. Hosted Firebase secrets are unnecessary for this job. The workflow was parsed locally and the setup-java v5 tag was verified upstream.

Observed local runs before the final verification pass:

| Command | Result | Wall time including services |
| --- | --- | --- |
| `npm run ui-tests` | Complete journey passed | 11.1 s |
| `ANALYZE_BUNDLE=1 npm run ui-tests:production` | Build and complete journey passed | 13.2 s |
| `npm run ui-tests:ci` | Same compiled build reused; journey passed | 4.9 s |
| `npm run ui-tests` again | Fresh emulator; journey passed | 10.4 s |

Early selector failures returned exit 1, produced an HTML report, screenshots for both contexts and a trace, then shut down the services. These were test-selector corrections, not application gameplay changes. The host dropdown's explicit `aria-label` overrides its displayed label, so the final test uses its existing accessible name.

These are local macOS results. Actual GitHub Actions duration and Linux execution remain unverified until an authorized push runs the workflow. No CI, Preview or Production run is claimed. Emulator rules permit room/player operations only and are explicitly test rules; deployed rules, indexes, quotas and hosted behavior are outside this evidence. The broader coverage listed above remains deferred as agreed.

### Final verification

The interruption probe exposed stalled teardown when cancellation arrived as Playwright started a worker. The final runner starts and owns each service directly, independently of Playwright's test lifecycle, so even a stalled test coordinator cannot prevent service cleanup. Repeated the occupied-port, failed-service and interruption probes after that change.

| Check on the final implementation | Result |
| --- | --- |
| `npm ci` from the updated lockfile | Passed |
| `npm run lint:check` and explicit ESLint check of root configuration files | Passed |
| `npm run build`, with disposable public demo values and test mode disabled | Passed; normal `.next` build, no hosted gameplay or owner environment file |
| `ANALYZE_BUNDLE=1 npm run ui-tests:build` | Passed, 5.7 s; locale checks and HTML bundle reports produced |
| `npm run ui-tests:ci` | Complete journey passed, 4.1 s; reused the prepared build |
| `npm run ui-tests` | Complete journey passed, 9.6 s |
| A fresh `npm run ui-tests` after a deliberately failing run | Complete journey passed, 9.1 s |
| Each of the five reserved ports occupied by a probe-owned listener | Exit 1; original listener still running; test lock removed |
| Emulator launch forced to fail using a temporary Java shim | Exit 1; all five ports free; lock removed |
| SIGINT as Playwright begins running | Exit 130; all five ports free; lock removed; prior `next-env.d.ts` restored |
| Deliberately failing browser assertion in a temporary test | Exit 1, 3.6 s; HTML, PNG screenshots and trace ZIP verified; temporary test removed |
| Invalid hosted project, remote emulator endpoint, or emulator host without test mode | Configuration rejected before startup |
| Normal build ID and generated declarations before/after test failure | Unchanged |
| `git diff --check` | Passed |

The intentional failure's artifacts were copied locally to `/tmp/coronabingo-ui-failure-evidence-NIz5oT` before the fresh passing run replaced the default report. Default reports remain ignored, including the last passing HTML report in `playwright-report/`. Runtime output was inspected in `/tmp/coronabingo-ui-final-{build,ci,dev,fresh}.log`; these paths are local evidence, not committed artifacts.

No task server remains running, no emulator records were exported, and no hosted Firebase data was created. The existing unrelated local server was left alone. This record and the implementation are committed together on the task branch; push, merge and deployment are outside this handoff.

### 2026-09-24: PR and GitHub Actions verification

The owner authorized publishing the branch and opening a PR to validate the full process. [PR #187](https://github.com/durancristhian/coronabingo/pull/187) targets `main`. This supersedes the earlier pending-CI note.

[CI run 35950576897](https://github.com/durancristhian/coronabingo/actions/runs/35950576897), on implementation commit `0f4cc972be1a883a08d9ff1083a4ea493c1d5084`, passed on GitHub's Ubuntu runner. The build job ran from 03:13:55 to 03:17:49 UTC, 3 min 54 s. Node 24.21.0, npm 11.19.0 and Temurin 21.0.12.1 were reported by the runner.

- Installation, lint/types, Chromium and emulator setup, locale validation, build and the complete host/player regression passed.
- The isolated build command took 19.3 s. The regression command reused that build and took 11.3 s including services; Playwright reported one passing test in 5.3 s.
- `ui-test-evidence` and `bundle-reports` were uploaded successfully. Downloaded `ui-test-evidence` and verified the HTML report and Firestore log were present.
- The Vercel deployment check also passed. This establishes preview deployment success, not gameplay verification against hosted Firebase. The automated journey ran only against the local emulator inside CI.

The PR remains open for review. No merge or Production deployment was requested or performed.

### 2026-09-24: PERF-02 exact ticket assignment coverage

PERF-02 extended the existing journey at revision `4a0c8ca4e2732e9303e43c8c9513e00317a8e747` on branch `t3code/optimize-cartones-performance`, in worktree `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-5108c082`.

The test now reads the two assigned ticket IDs from the room lobby and checks those exact IDs for both host and player after direct URL entry, reload and the new deal after restart. It still avoids fixed random IDs; the lobby assignment from each run is the source of truth.

`ANALYZE_BUNDLE=1 npm run ui-tests:production` rebuilt the app, validated locales and passed the complete Chromium journey in 10.4 seconds. The test URL was `http://127.0.0.1:3187`; Firebase target was local `demo-coronabingo-ui`, with Firestore at `127.0.0.1:8187`. Services and the test lock were removed after the run. No hosted Firebase data, Preview or Production environment was exercised.

PERF-02's route-bundle measurements and implementation evidence remain in [its task record](performance/perf02-evidence/README.md).

### 2026-09-24: PERF-06 tutorial coverage

PERF-06 agregó cuatro pruebas del tutorial en `tests/ui/tutorial.spec.ts`. Verifican que el código del reproductor, el SDK remoto y el iframe no se solicitan antes de abrir el modal y registran cada capa por separado después de la apertura. El chunk se demora 500 ms para comprobar el estado de carga en una conexión limitada.

Con recursos externos controlados, el iframe se monta con el video español correcto, responde a una interacción de reproducción, se desmonta con Escape y con el botón, devuelve el foco y reaparece sin duplicados. Otro caso bloquea YouTube y comprueba el fallback externo. La portada inglesa monta su video correspondiente. Estas pruebas amplían la suite, pero el recorrido completo de anfitrión/jugador sigue limitado a español de escritorio.

`ANALYZE_BUNDLE=1 npm run ui-tests:production` regeneró el build aislado y pasó las cinco pruebas contra `demo-coronabingo-ui` y Firestore Emulator. La evidencia detallada y los límites están en [el registro de PERF-06](performance/perf06-evidence/README.md).
