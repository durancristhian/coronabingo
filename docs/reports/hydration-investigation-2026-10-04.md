# HYD-01 hydration investigation

The production hydration defect remains open. The isolated application did not
reproduce it, and this change does not alter application behavior. It adds a
repeatable diagnostic with a positive control and records the remaining evidence
gap. Passing this diagnostic is not proof that production hydration is fixed.

## Scope and reference builds

- Source baseline: `edc2d5a791d2ca372024d8278549e106bf4f5daf`.
- Observed production build: `ByZUPFNlyJ8vLx_oU-X93`.
- Ordinary local production build: `Eq7iaZ5mgwslXlkdKvJId`.
- Runtime: Node 24.21.0, npm 11.19.0, Next.js 16.3.6, React 18.3.1,
  Pages Router and Webpack, using the committed lockfile.
- Routes: `/`, `/en/`, and nonexistent `/room/[roomId]` routes in both languages.
  Missing-room inputs use disposable fixture identifiers and synthetic query and
  fragment values. No hosted rooms or players were created.
- Browser inspection used T3 Code 0.0.45, Electron 44.4.2 and Chromium
  152.0.7977.130 on macOS, with `en-US` browser language and a 1280 by 800 viewport.
  This is a persistent application session, not a clean Chrome profile.
- The automated diagnostic uses the repository's fresh Chromium contexts,
  `es-AR` browser language, desktop viewport and external-network isolation.
  Application language is selected explicitly. It does not test a personal
  Chrome profile, browser extensions, Safari or mobile browser behavior.

## Observations

The original production evidence contained three React 418 errors and one 423
per affected load. Those error codes identify hydration recovery, not a guilty
component. A single public-homepage visit during this investigation recorded four
early exceptions and an AdSense `no_div` error. The collaborative browser exposed
the four exceptions only as `Uncaught`, so their exact React codes could not be
confirmed in that capture. Do not treat the nearby AdSense error as causation.

The server-rendered application body from the public homepage was byte-identical
to the ordinary local production build's body. This comparison excludes the head,
Next data, build-specific scripts and any browser-side mutations. It rules out a
static body difference for those two responses, not a timing or runtime problem.

| Condition | Attempts | Result |
| --- | --- | --- |
| T3, isolated production build, homepage ES/EN and missing-room ES/EN | 5 entries per route/language, 20 total | No early exceptions reported; hydration completed. Some missing-room snapshots preceded the final error state. |
| T3, public production homepage | 1 | Four early `Uncaught` exceptions; exact messages unavailable. One separate `no_div` error. |
| T3, exact public HTML/chunks replayed through a local diagnostic proxy, external scripts blocked | 5 | No captured hydration errors. |
| Same replay, Twitter script origin permitted | 5 | No captured hydration errors. Embedded frames and external connections remained blocked. |
| Same replay, Vercel feedback script origin permitted | 5 | No captured hydration errors. External connections remained blocked. |
| T3, ordinary local build, AdSense static scripts permitted, frames/connections blocked | 2, including delayed Next chunks | No captured hydration errors. Observed pre-hydration insertions were outside `#__next`. |
| T3, public-build replay, AdSense scripts and ad frame origins permitted, parent external connections blocked | 1 with delayed Next chunks | No captured hydration errors. This was not a production-origin ad configuration. |
| Automated isolated production build | 5 entries and 5 reloads for each of 4 route/language combinations | No hydration diagnostics in 40 loads. Also exercised 20 locale transitions and 10 header returns to home. |
| Automated isolated development build | Same matrix | No hydration diagnostics in 40 loads; the 5-test suite passed. Development remains secondary to the compiled-build result. |

The local proxy inserted an error listener before application scripts, recorded
DOM operations and held Next JavaScript responses for 1.5 seconds to expose early
mutations. The initial ordinary-local baseline also passed with all external
scripts blocked. Proxy runs used `Cache-Control: no-store`; the T3 browser cache
was otherwise not reset. Initial T3 entries shared a session and were not cold
profile trials. Automated request routing disables the HTTP cache and every test
gets a fresh context; the five repetitions within a test share that context.

These are bounded negative results. Replaying production assets on localhost
changes the origin, cookies, provider configuration and timing. The CSP also
blocks provider dependencies. Enabling one script origin in this restricted
environment does not reproduce the full provider behavior on production and
cannot independently clear or blame that provider. The diagnostic proxy and
instrumentation were temporary local research tools, not application changes.

## Repeatable diagnostic

Follow the [UI test setup](../../README.md#browser-regression-tests), then run:

```bash
npm run ui-tests:production -- tests/ui/hydration.spec.ts
npm run ui-tests -- tests/ui/hydration.spec.ts
```

The [diagnostic](../../tests/ui/hydration.spec.ts) attaches listeners before the
first navigation. It checks descriptive hydration messages and the observed React
418/423 codes, plus text-mismatch code 425. It waits for the client-mounted Next
route announcer and two animation frames before inspecting errors. Missing-room
checks also wait for the translated recovery action. It records a JSON matrix in
the Playwright report.

The real header link performs a document navigation. The locale selector performs
a client transition. The test checks that the latter preserves the document's
time origin instead of silently counting a reload as SPA coverage.

A separate positive control removes the server-rendered heading just before the
real React runtime executes. It verifies that the collector detects hydration
failure and that React restores the heading. This deliberately induced mismatch
validates the diagnostic's signal. It is not a reproduction of HYD-01's unknown
production cause, and it does not justify an application fix.

## Next decisive experiment

Capture the original origin with a browser facility that supports an initialization
script and request interception before navigation. Keep the first differing DOM
node, mutation stack, complete recoverable-error message and application commit
timing together. The available T3 tools support post-navigation evaluation but do
not expose pre-navigation initialization or request interception. Their exception
summary was insufficient here. A local proxy can instrument early but changes the
origin, as described above.

Use a clean profile first and compare the existing personal session only if the
clean one does not reproduce. Record exact build, browser, extensions, viewport,
language, cache and response timing. Stub ad delivery to avoid repeated live
impressions. After one attributable failing capture, replay the captured mutation
or response locally and vary one input at a time:

1. If an external mutation precedes the first mismatch inside `#__next`, replay
   that mutation without contacting its provider. Test its ordering against React
   hydration before choosing a loading change.
2. If the initial application render differs without an external mutation,
   compare the responsible component's server/client inputs and locale/router
   readiness.
3. If only the personal session reproduces, repeat with its extensions and stored
   state isolated individually. Do not infer extension responsibility from a
   clean-profile pass alone.

No loading change, `suppressHydrationWarning`, Sentry filter, dependency upgrade
or SSR removal is justified by the evidence collected so far. A safe fix needs
the original failure to go red before the change and green after it.

React documents that [hydration requires matching server and client content](https://react.dev/reference/react-dom/client/hydrateRoot).
The installed Next.js Pages Router guides on rendering and automatic static
optimization were consulted. They describe post-hydration router updates but do
not establish that router state caused this incident.
