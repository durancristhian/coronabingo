# Coronabingo

Next.js Pages Router application using React 18, Webpack and npm.

## Local setup

Use Node **24.21.0** and npm **11.19.0** (bundled with this Node release):

```bash
nvm install
nvm use
npm ci
cp .env.template .env
```

Fill in `.env` with the Firebase project configuration from its owner. Firestore is required for gameplay. Rooms work without a Firebase Authentication login. Google Analytics and Sentry settings are optional. Keep `.env` private; environment values exposed by `next.config.js` are included in the browser bundle and must not contain server credentials.

A local server or Vercel preview uses whichever Firebase project `.env` points to. Use a test project or agreed test records before creating rooms or adding players.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). To use another port, run `npm run dev -- --port 3124`. Edit routes in `pages/`; translations live in `locales/es` and `locales/en`. Spanish is the default locale. Existing `/es/…` and `/en/…` links remain accepted; Next.js generates unprefixed Spanish navigation URLs.

## Checks and production build

```bash
npm run lint:check
npm run validate-locales
npm run validate-tickets
npm run build
npm run start
```

`lint:check` includes TypeScript and does not modify files. `lint` and the pre-commit hook retain their existing autofix behavior. Inspect the ticket validator's output as well as its exit code: the legacy script catches assertion failures.

Run build and start sequentially. Do not run an install, a development server and a production build against the same checkout concurrently.

Use `ANALYZE_BUNDLE=1 npm run build` to write bundle reports under `.next/analyze/`. CI enables this and uploads the HTML reports as the `bundle-reports` artifact, retained for 14 days. These replace the failing Packtracker upload; they provide per-build inspection without Packtracker's historical comparisons or budgets.

## Browser regression tests

`npm run ui-tests` runs two desktop Chromium journeys in Spanish against a dedicated Next.js development server and a fresh local Firestore emulator. The gameplay journey creates a room, assigns cards to two participants, checks host controls and live draws, verifies cards and a mark after reload, then restarts and plays again. Host and player use separate browser contexts. The spreadsheet journey activates the hidden export, checks loading and recovery from a failed chunk, then verifies that a double click produces one non-empty XLSX download.

One-time setup after `npm ci`:

```bash
# macOS, using Homebrew. The runner detects this keg-only JDK automatically.
brew install openjdk@21
npx playwright install chromium
npx firebase setup:emulators:firestore
```

Linux and WSL need Java 21+ on `PATH` or `JAVA_HOME`, for example Temurin 21, and `npx playwright install --with-deps chromium`. Native Windows is not supported by the process-group runner. Verified tooling: Node 24.21.0, npm 11.19.0, Java 21.0.12.1, Playwright 1.63.0 with Chromium 153.0.8010.12, Firebase CLI 15.31.0 and Firestore emulator 1.22.0. npm tooling is pinned in `package-lock.json`.

```bash
npm run ui-tests                  # Development server; normal local command
npm run ui-tests:production       # Build once, serve with next start, run journey
npm run ui-tests -- --headed      # Watch the browser
npx playwright show-report       # Open the latest HTML report
```

To reproduce the CI sequence with bundle reports and reuse the prepared build:

```bash
npm run lint:check
ANALYZE_BUNDLE=1 npm run ui-tests:build
npm run ui-tests:ci
```

`ui-tests:ci` requires a build made by `ui-tests:build`; rebuild after source changes. Test builds and their TypeScript cache use `.next-ui-tests/`, separate from `.next/`. The suite does not need `.env`, Firebase login or repository secrets. Its fixed public configuration overrides hosted settings and uses only `demo-coronabingo-ui` at `127.0.0.1:8187`. Analytics and ads are disabled, and browser requests outside the app and emulator are blocked. Installations and the first browser/emulator downloads require internet; gameplay does not use hosted services.

The runner reserves ports 3187 for Next.js, 8187 for Firestore, 9187 for the emulator websocket, 4487 for the emulator hub and 4587 for logging. An occupied port fails the command; existing servers are never reused or stopped. Run one suite at a time, including across worktrees. On a lock error, inspect `.ui-tests-lock/owner.json` and verify that its process and services have exited before removing that directory. If Java is missing, set `JAVA_HOME` to an installed JDK 21+; after updating Playwright run its browser installer again.

Services stop on completion, startup failure, test failure or Ctrl-C. Emulator data is disposable and is not exported. Tests use one worker and zero retries. Failures return a nonzero status and retain screenshots, traces and an HTML report under `test-results/` and `playwright-report/`; emulator logs live in `tests/ui/*-debug.log`. CI uploads available evidence even on failure, plus bundle reports from `.next-ui-tests/analyze/`, for 14 days.

The emulator uses explicit test rules, not verified copies of deployed rules. A passing run covers these journeys only. English, mobile, other browsers, manual draw mode, room-code protection, downloads other than the spreadsheet export and deployed Firebase behavior remain outside this suite. See the [plan and verification record](research/playwright-test-plan.md). The retired Cypress suite remains removed; `npm test` is not defined.

## Retired charity events

Standalone `/admin`, `/eventos/[eventId]`, and `/eventos/[eventId]/admin` return the standard 404 in Spanish and English. Room setup at `/room/[roomId]/admin`, emoji room codes, sharing, and spreadsheet export remain available. Historical Firebase documents and receipt uploads are retained. Authentication and Storage settings are no longer used by the app.

See the [cleanup verification](research/admin-events-cleanup.md) for checks and test records.

## Migration status

The primary branch is `main`, tracking `origin/main`. GitHub's default branch and Vercel's production branch use `main`; the Vercel project runtime is Node 24.

CI reads `.nvmrc`, installs with `npm ci`, runs `lint:check`, then builds with the isolated emulator configuration and locale validation. It runs the browser regression against that build and uploads test evidence and bundle reports. [CI verification](research/node-24-ci.md) and [Vercel preview acceptance](research/node-24-preview.md) cover the verified application. Standalone admin/event checks were excluded by request.

See the [migration plan](research/node-24-main-migration-plan.md) and [release record](research/node-24-release.md) for production verification. The user waived development test-room cleanup and pre-release rollback verification, and will handle rollback in Vercel if needed.

ESLint 9 is retained temporarily by agreement because the current React and accessibility plugins do not declare ESLint 10 compatibility. Replace or upgrade those plugins and move to a supported ESLint release in a follow-up. Other legacy dependency maintenance is outside this migration.
