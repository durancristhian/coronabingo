# Development guide

Setup, validation, and implementation references for Coronabingo. For a project overview, see the [README](../README.md).

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

For task worktrees, follow the approved environment-copy procedure in the [workflow](../docs/agents/workflow.md). A local or Preview server can use Production Firestore. Verify its target and data authorization before creating rooms or players.

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

## Firestore loading

PERF-10 is implemented in [PR #217](https://github.com/durancristhian/coronabingo/pull/217). Firestore no longer ships in the homepage's initial JavaScript. Equivalent builds before and after this change measured 233,957 and 146,119 gzip-9 bytes, a reduction of 87,838 bytes or 37.5%. This measures initial script bytes, not overall page speed; game routes still load the SDK.

The homepage loads the room model and Firestore when the room-name field receives focus. Submitting shares that load, prevents duplicate submissions, and allows retry after a failed download. The shared contexts stay mounted to preserve room drafts; their data subscriptions load Firestore only when room/player IDs are needed. Game pages also import their data operations, so direct room links load the SDK with the route.

Run `node scripts/validate-firestore-listeners.cjs` to check listener scope, cleanup, navigation during a pending import, and stale callbacks without a database. CI runs this probe and the ES/EN browser tests for cold-home loading, delayed downloads, failure recovery, and room creation.

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

Each run uses a unique `demo-coronabingo-ui-<id>` project on a local Firestore emulator, overriding hosted settings without requiring `.env`, Firebase login, or repository secrets. External analytics delivery is disabled; application events are captured locally. Browser traffic outside the app and emulator is blocked. Ads collapse their wrapper when the loader is blocked; focused tests can intercept it with a local SDK stub. `tests/ui/ads.spec.ts` exercises reservation, script failure, zero width, and navigation without real advertising. Initial installations and downloads require internet.

The runner automatically reserves five available loopback ports for Next.js, Firestore, its websocket, the emulator hub, and logging. Separate worktrees can run suites concurrently. Each checkout still runs one suite at a time to protect its build output and reports. The command prints its URL and ports and records its configuration and process groups in `.ui-tests-lock/owner.json`.

Startup waits for the owned emulator to announce readiness and checks a unique response header from the app. An unexpected service exit aborts the suite, including during Playwright. A port taken during service startup fails safely; rerun the command to select new ports. Existing services are never reused or stopped.

Run `npm run test:ui-runner` for the fast Node regression checks covering port reservation, server identity, and service supervision. CI runs these before the browser suite.

On a lock error, inspect `.ui-tests-lock/owner.json` and verify its process and services have exited before removing the lock directory. If Java is missing, set `JAVA_HOME` to a JDK 21+ installation.

The runner stops its services on completion, failure, or Ctrl-C. Data is not exported. Tests use one worker and zero retries. Failures retain screenshots, traces, and reports in `test-results/` and `playwright-report/`; emulator logs are in `tests/ui/*-debug.log`.

### CI build reuse

To reproduce the sequence in [.github/workflows/push.yml](../.github/workflows/push.yml):

```bash
npm run lint:check
ANALYZE_BUNDLE=1 npm run ui-tests:build
npm run ui-tests:ci
```

`ui-tests:ci` requires an unchanged build from `ui-tests:build` in the same checkout. The build marker retains the selected ports, demo project, and server identity because Next.js embeds them during compilation. The runner reserves those ports again before serving. If any are occupied, it fails without touching their owner; use `npm run ui-tests:production` to select new ports and rebuild. Test output and TypeScript caches use `.next-ui-tests/`, separate from normal builds. CI uploads available test evidence even on failure and bundle reports from `.next-ui-tests/analyze/`, retained for 14 days.

## Search metadata

[PageMetadata.tsx](../components/PageMetadata.tsx) owns localized titles, descriptions, and social metadata. Only the Spanish homepage at `/` and the English homepage at `/en` are indexable. Their canonical and reciprocal `es`, `en`, and `x-default` links use the Production domain, independently of query parameters or fragments. Legacy `/es` links remain supported.

Room, setup, player, and error pages return `noindex` in their initial HTML and omit homepage canonical/alternate links. Game metadata uses generic translated text, never room names or player identifiers. `noindex` controls search indexing, not access to room data.

[robots.txt](../public/robots.txt) allows crawling so search engines can read `noindex`; it advertises [sitemap.xml](../public/sitemap.xml), which lists only the two canonical homepages. Keep this allowlist and the metadata rules consistent if adding public pages. SEO regression checks are in [seo.spec.ts](../tests/ui/seo.spec.ts), run with `npm run ui-tests -- tests/ui/seo.spec.ts` or the production UI suite.

## Analytics and product references

The manual ad reserves 90 px of height plus its existing 16 px bottom gap from server rendering onward. Its width follows the available space up to 728 px. A single loader in `contexts/AdScript.tsx` signals readiness; `components/Ads.tsx` requests once per connected node with positive width.

Empty inventory (`unfilled`), SDK load/initialization failure, or an unresolved loading deadline removes the entire wrapper and its 16 px gap. The SDK has 5 seconds from client initialization to become ready; each mounted slot then has 5 seconds from SDK readiness to report an outcome. `filled` and `unfill-optimized` cancel the slot deadline. Collapse is terminal for that slot, and a timed-out SDK stays unavailable for manual ads until a document reload. This deliberately moves content upward once and can discard an unusually slow ad. It does not identify a particular ad blocker.

The fit guard hides the complete manual unit while its served dimensions exceed the reservation, then restores the same iframe when it fits; it never crops, scales, or refreshes ads on resize or game updates. This reduces ad visibility during a size mismatch. The replacement passed Production checks with a filled manual ad; independent Auto ads can still overflow after a viewport reduction. See [PERF-09 evidence and release prerequisites](../docs/reports/perf-09-ad-geometry.md) for the distinction between slot geometry and a served creative, and the limits of real-ad acceptance. The approved responsive unit is `9427584752`; the old fixed unit `1185318534` is retained in AdSense for rollback.

See [Homepage tutorial](../docs/tutorial.md) for localized video assets, caching and playback analytics.

The event contract is in [Events.ts](../interfaces/analytics/Events.ts), payload construction in [analyticsEvents.ts](../utils/analyticsEvents.ts), delivery in [gtag.ts](../utils/gtag.ts), and shared URL sanitization/initialization in [analyticsPageContext.ts](../utils/analyticsPageContext.ts). The document configures sanitized stream defaults before loading Google scripts, and the app updates them before SPA history changes. Keep the serialized initialization function self-contained. Preserve normalized private routes and exclude room/player names, identifiers, and custom background URLs from outgoing payloads.

The isolated UI suite uses a fake measurement ID and blocks external traffic to check the compiled bootstrap and routing configuration. It does not prove how Google's automatic advertising events use that configuration. Verify real `ad_impression` requests after an authorized Production release, then check processed reports and AdSense continuity. This protection concerns GA4 page context; it does not rewrite AdSense's own advertising requests or historical reports.

Read [AGENTS.md](../AGENTS.md) for contribution rules, [CONTEXT.md](../CONTEXT.md) for terminology, and [.better-web-ui.md](../.better-web-ui.md) for approved design and copy decisions. Follow the documentation language policy in [AGENTS.md](../AGENTS.md).

The primary branch is `main`. The standalone `/admin` and `/eventos/…` flows are retired; room setup at `/room/[roomId]/admin` remains active. Historical records are retained, and gameplay uses neither Firebase Authentication nor Storage. Do not add regression journeys for retired routes as part of ordinary gameplay work.

ESLint 9 remains pinned pending compatibility work on the React and accessibility plugins. Dependency upgrades are separate work. See the [IMP-02 dependency report](../docs/reports/imp-02-dependencies.md) for security updates, the approved Firebase compat migration, bundle costs, unused-package removals, and remaining audit findings.

## Local research and tickets

`research/` holds local plans, tickets, and evidence. It is ignored by Git, ESLint, and the application/UI TypeScript configurations. Application and CI builds do not depend on it. Skill configuration remains versioned under `docs/agents/` and the root agent/domain documents; skills use local records when a task needs them.

Use the primary checkout's `research/` as the canonical directory across worktrees, following the [tracker instructions](../docs/agents/issue-tracker.md). New clones do not receive these files; recover existing task records from an owner-provided backup. Back up local research separately. Include non-sensitive acceptance criteria and validation summaries in PRs for remote review. Old research waivers do not establish standing permissions.

Before first updating an existing checkout to the commit that removes research from Git, back up its entire `research/`, including untracked work, outside all worktrees and verify the copy. Git can delete previously tracked files when applying that commit even though the directory is now ignored. After updating, restore missing files and compare differing versions without overwriting local work. Preserve unique records from other worktrees before removing them.

This change removes research from future snapshots; it does not rewrite Git history. Earlier committed records remain recoverable from older revisions.
