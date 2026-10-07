# HYD-01: Auto ads races React hydration

A clean Production capture identified the cause of the observed React 418/423
errors: AdSense Auto ads inserts a sibling inside the server-rendered React root
before hydration. React encounters that unexpected element and rebuilds the root.
Replaying just that insertion reproduces the same errors in a local production
build. Moving the insertion after hydration preserves the original DOM.

The runtime correction uses `next/script` with `afterInteractive` and removes
AdSense's early async script from `_document`. The shared loader was first
implemented in [PR #218](https://github.com/durancristhian/coronabingo/pull/218).
Its exact implementation is now included in PR #219 so hydration can be released
independently of PERF-09's pending ad-unit and geometry decisions. The manual
slot, dimensions, eligibility and account settings are unchanged by HYD-01.

Production acceptance is recorded in the local HYD-01 release record after the
merged revision is deployed and verified. The earlier evidence below predates
this correction and must not be read as the current deployment state.

## Original-origin capture

The owner explicitly authorized a fresh Playwright Chromium session because T3's
exception summaries did not expose the full error messages or pre-navigation
instrumentation. One normal public homepage navigation captured:

- Production revision `4d9a9b3cfd2f63250ef3f81933e572bd424d3e94`, build
  `r5DubCCfGXZe2b3eotuKt`.
- Chromium `153.0.8010.12`, headless, fresh context, no extensions, `en-US`,
  1280 by 800 viewport, service workers blocked.
- At 355.6 ms, `adsbygoogle.js` called `insertBefore` on `main.cb-layout`, inserting
  `div.google-auto-placed` immediately before `.cb-layout-main`.
- At 357.2 ms and 437.8 ms, AdSense populated the inserted ad container.
- At 479.6, 481.4 and 481.7 ms, React reported error 418. At 482.1 ms, it reported
  error 423. React then replaced the original root content.

The mutation stack identifies `adsbygoogle.js` functions `Sj`, `qn`, `nn` and
`vn.start`. The first differing node is the automatic ad wrapper between the
header and page content. The manual ad component's one-second delay does not
protect against Auto ads: the global SDK previously loaded from `_document`
before React mounted.

Error listeners and DOM-operation wrappers were installed before navigation.
This is an instrumented observation, so the causal check below varies ordering
without contacting the advertising provider. No hosted gameplay records were
created and no provider settings were changed.

## Controlled reproduction

The replay substitutes a small local stub for the AdSense SDK. It inserts the
captured element type, class and position, with an empty `ins.adsbygoogle` child.
It does not load ads, create frames, or depend on provider availability. All other
external traffic is blocked. The heading's DOM identity distinguishes successful
hydration from recovery that merely leaves the page looking correct.

| Condition | Attempts | Result |
| --- | --- | --- |
| Captured Production HTML and published chunks, stub inserts before hydration | 1 | Three 418 errors and one 423; original heading replaced; inserted node discarded. |
| Equivalent local production build, same stub inserts before hydration | 5 | Same four errors on every attempt; original heading replaced. |
| Same local build and origin, only insertion timing moved after hydration | 5 | No errors; original heading and inserted node retained. |
| PR #218 Preview with its real loader and the same immediate-insertion stub | 1 | Loader executes after client mount; no errors; original heading and inserted node retained. |
| Later PR #218 Preview: home/missing-room, ES/EN, 1280/390 px | 8 entries | No errors; loader executes after client mount; original heading and inserted node retained. External Firebase requests blocked; this checks hydration, not room availability. |

The first PR #218 Preview capture used build `8_0cqRaC8_BOrAGy8NWmQ`; the
later eight-entry matrix used `yPVRIIlcq5quRi3AcLxyg`. The branch advanced during
inspection, so these observations are identified by build rather than assuming
an immutable branch URL. Its loader implementation is in `contexts/AdScript.tsx`.
The test substitutes the SDK response and blocks other external traffic,
so it exercises the deployed loader's timing. This demonstrates the correction
for the captured insertion; it is not a claim about filled-ad rendering, revenue,
all Auto ads formats, or a Production deployment that has not happened yet.

## Reproducing the deployed build locally

An earlier comparison used public build `0g3qkJI-UQ7JK--1G26Ga`, deployed from
`e23886342503873871195afa17bbd2e98c15d7e5`. That revision was incorporated into
the task branch before `npm run build` and `npm run start -- --port 3190`.
The resulting local build was `DQfNyCSCxjXGmFrcGeU19`, also used for the controlled
five-before/five-after experiment above.

The original local `.env` differed from Production: Firebase values differed,
and Analytics, Sentry and URL settings were absent. Public browser configuration
was recovered from downloaded bundles and supplied only to build/start child
processes. The existing `.env` was preserved and no values were committed.

Excluding only final source-map comments, seven of nine homepage chunks were
byte-identical: React's framework, polyfills, `_app`, the homepage and shared
chunks `95`, `703` and `bb5968dd`. The server-rendered application body was also
byte-identical. `main` and the Webpack runtime differed: public `main` includes
Vercel feedback and different minified names; the runtime references generated
hashes. This is not a claim that the entire environment or all bundles matched.

The build alone initially passed because localhost did not reproduce Production's
Auto ads placement and timing. Adding the captured mutation made the same local
build fail reliably. Production advanced to `4d9a9b3` during the investigation;
those build observations are kept separate.

## Automated diagnostic

Follow the [UI test setup](../development.md#browser-regression-tests), then run:

```bash
npm run ui-tests:production -- tests/ui/hydration.spec.ts
npm run ui-tests -- tests/ui/hydration.spec.ts
```

The [suite](../../tests/ui/hydration.spec.ts) covers homepage and missing-room
entry/reload in ES/EN, locale transitions and header returns. It captures hydration
messages before navigation and waits for the client-mounted route announcer.
The header performs a document navigation; the locale control performs a client
transition and is checked without counting a reload as SPA coverage.

Two ordering tests replay the observed Auto ads insertion before and after
hydration. The former intentionally expects recovery and checks replacement of
the original heading. The latter expects no hydration errors, keeps both nodes,
and exercises a locale transition. These tests establish the timing boundary;
two additional ES/EN tests intercept the real SDK request and assert that the
loader executes after mount, preserves the SSR heading, and loads once across a
locale transition. They also reject an early SDK script in the server HTML. The
isolated runner blocks real advertising and uses disposable Firebase configuration.

## Earlier negative results and limits

Before the clean capture, ordinary local builds, development builds, and public
assets replayed through a restrictive local proxy did not reproduce the original
error. T3 public visits repeatedly reported four generic `Uncaught` exceptions.
Partial Twitter, Vercel and AdSense allowances changed origin and provider
behavior and could neither clear nor blame those providers. Rewriting the document
inside an existing Production tab retained its JavaScript realm; those attempts
were not clean navigations and are excluded from causal evidence.

The earlier synthetic test removed the heading to validate error collection.
It has been replaced by the actual Auto ads mutation replay. No error suppression,
SSR removal, Sentry filter or dependency upgrade was introduced. The claim is
bounded to the captured race; unrelated hydration errors may have other causes.
