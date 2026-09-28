# Coronabingo

Play bingo together in shared rooms. The app uses Next.js Pages Router, React, Webpack, Firestore, and npm.

## Local setup

Use the Node version in `.nvmrc` and npm version in `package.json`. Dependencies are locked in `package-lock.json`.

```bash
nvm install
nvm use
npm ci
```

For an initial checkout, create `.env` only if it does not exist:

```bash
if [ ! -e .env ]; then
  cp .env.template .env
fi
```

Obtain Firebase configuration from the environment owner. Firestore is required; gameplay does not require Firebase Authentication. Google Analytics and Sentry are optional. Keep `.env` private. Values exported through `next.config.js` enter the browser bundle and must contain no server credentials.

For task worktrees, follow the approved environment-copy procedure in the [workflow](docs/agents/workflow.md). A local or Preview server can use Production Firestore. Verify its target and data authorization before creating rooms or players.

Choose an available port:

```bash
npm run dev -- --port 3124
```

Open [localhost:3124](http://localhost:3124). Routes live in `pages/`; translations are in `locales/es` and `locales/en`. Spanish is the default. Existing `/es/…` and `/en/…` links remain accepted; generated Spanish navigation URLs are unprefixed.

## Checks and builds

| Change | Required checks |
| --- | --- |
| Application code | `npm run lint:check`, `npm run build`, `git diff --check` |
| Translations | `npm run validate-locales` for focused checks; also runs during `prebuild` |
| Card data or generator | `npm run validate-tickets`; inspect output because its legacy error handler can return success after an assertion failure |
| Analytics | `npm run validate-analytics` and the affected browser journey |
| Room setup, card assignment, host/player synchronization, marking, reload, or restart | `npm run ui-tests`; use `npm run ui-tests:production` for a compiled build |
| Documentation only | Content, links, command accuracy, and `git diff --check`; commit hooks still run |

`lint:check` performs type generation, TypeScript checking, and ESLint without source autofixes. `lint` and pre-commit hooks can autofix source files; review those edits. The scripts in `package.json` are authoritative. `npm test` is not defined.

Run installation, development, type generation, and builds sequentially within a checkout. Stop its development server before building. To serve a successful production build on an available port:

```bash
npm run build
npm run start -- --port 3124
```

For bundle reports, use `ANALYZE_BUNDLE=1 npm run build` and inspect `.next/analyze/`. Compare equivalent builds and report byte savings separately from measured loading performance.

## Browser regression tests

The Playwright suite runs Chromium against a dedicated Next.js server and disposable Firestore emulator. Its current coverage includes:

- Room setup, player replacement, host selection, card assignment, play, reload, and restart.
- Separate host/player contexts, manual draws, the 90-number limit, room-code protection, and concurrent card marks.
- Mobile gameplay, language switching, translated controls/dialogs, and the ten-column number board across responsive widths.
- Background persistence, celebrations, sounds, tutorial loading/failure recovery, and hidden spreadsheet export with duplicate-download protection.
- Local analytics event capture within relevant journeys.

See `tests/ui/*.spec.ts` for exact assertions and locale/viewport combinations. Coverage varies by journey; this is not an all-browser or all-device guarantee. Emulator rules are test rules, not verified copies of deployed Firebase rules. External playback, hosted analytics delivery, and hosted Firebase behavior need separate checks.

### One-time setup

After `npm ci`, install Java 21+, Chromium, and the Firestore emulator. On macOS:

```bash
# The runner detects Homebrew's keg-only JDK.
brew install openjdk@21
npx playwright install chromium
npx firebase setup:emulators:firestore
```

Linux and WSL need Java on `PATH` or `JAVA_HOME` and `npx playwright install --with-deps chromium`. Native Windows is unsupported by the process-group runner. Browser and npm tool versions follow the lockfile; rerun the browser installer after a Playwright update.

### Run and inspect

```bash
npm run ui-tests                         # Development server
npm run ui-tests:production              # Build, serve, and test
npm run ui-tests -- --headed             # Visible browser
npm run ui-tests -- tests/ui/room.spec.ts # Focused journey
npx playwright show-report
```

The runner uses `demo-coronabingo-ui` at `127.0.0.1:8187`, overriding hosted settings without requiring `.env`, Firebase login, or repository secrets. External analytics delivery and ads are disabled; application events are captured locally. Browser traffic outside the app and emulator is blocked. Initial installations and downloads require internet.

Ports are fixed: 3187 for Next.js, 8187 for Firestore, 9187 for its websocket, 4487 for the emulator hub, and 4587 for logging. Run one suite at a time across all worktrees. Occupied ports fail the command; existing services are never reused or stopped.

On a lock error, inspect `.ui-tests-lock/owner.json` and verify its process and services have exited before removing the lock directory. If Java is missing, set `JAVA_HOME` to a JDK 21+ installation.

The runner stops its services on completion, failure, or Ctrl-C. Data is not exported. Tests use one worker and zero retries. Failures retain screenshots, traces, and reports in `test-results/` and `playwright-report/`; emulator logs are in `tests/ui/*-debug.log`.

### CI build reuse

To reproduce the sequence in [.github/workflows/push.yml](.github/workflows/push.yml):

```bash
npm run lint:check
ANALYZE_BUNDLE=1 npm run ui-tests:build
npm run ui-tests:ci
```

`ui-tests:ci` requires an unchanged build from `ui-tests:build`. Test output and TypeScript caches use `.next-ui-tests/`, separate from normal builds. CI uploads available test evidence even on failure and bundle reports from `.next-ui-tests/analyze/`, retained for 14 days.

## Analytics and product references

The event contract is in [Events.ts](interfaces/analytics/Events.ts), payload construction in [analyticsEvents.ts](utils/analyticsEvents.ts), and delivery/URL sanitization in [gtag.ts](utils/gtag.ts). Preserve normalized private routes and exclude room/player names, identifiers, and custom background URLs from outgoing payloads. Local capture proves application event behavior; network delivery and GA4 processing require their own evidence.

Read [AGENTS.md](AGENTS.md) for contribution rules, [CONTEXT.md](CONTEXT.md) for terminology, and [.better-web-ui.md](.better-web-ui.md) for approved design and copy decisions. Documentation outside `research/` is in English; application translations remain bilingual.

The primary branch is `main`. The standalone `/admin` and `/eventos/…` flows are retired; room setup at `/room/[roomId]/admin` remains active. Historical records are retained, and gameplay uses neither Firebase Authentication nor Storage. Do not add regression journeys for retired routes as part of ordinary gameplay work.

ESLint 9 remains pinned pending compatibility work on the React and accessibility plugins. Dependency upgrades are separate work.

## Local research and tickets

`research/` holds local plans, tickets, and evidence. It is ignored by Git, ESLint, and the application/UI TypeScript configurations. Application and CI builds do not depend on it. Skill configuration remains versioned under `docs/agents/` and the root agent/domain documents; skills use local records when a task needs them.

Use the primary checkout's `research/` as the canonical directory across worktrees, following the [tracker instructions](docs/agents/issue-tracker.md). New clones do not receive these files; recover existing task records from an owner-provided backup. Back up local research separately. Include non-sensitive acceptance criteria and validation summaries in PRs for remote review. Old research waivers do not establish standing permissions.

Before first updating an existing checkout to the commit that removes research from Git, back up its entire `research/`, including untracked work, outside all worktrees and verify the copy. Git can delete previously tracked files when applying that commit even though the directory is now ignored. After updating, restore missing files and compare differing versions without overwriting local work. Preserve unique records from other worktrees before removing them.

This change removes research from future snapshots; it does not rewrite Git history. Earlier committed records remain recoverable from older revisions.
