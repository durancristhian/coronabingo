# PERF-09: ad geometry investigation

Date: 2026-10-04, America/Argentina/Buenos_Aires.
Base: `edc2d5a791d2ca372024d8278549e106bf4f5daf`.
Delivery: investigation, standalone comparison, and the subsequently approved 90 px implementation. Real advertising acceptance remains pending.

## Finding and recommendation

The manual ad moves the page content down by **106 px** when its empty wrapper appears. This reproduces locally without Google's SDK: 90 px of slot height plus 16 px of bottom margin. Reserve that space from the first render of an eligible page and use the available width, capped at 728 px.

Keep 90 px as the proposed height. A 100 px mobile variant consumes another 10 px and introduces a height change at its breakpoint. Automatic sizing gives the application less control over the height above the game. None of these options guarantees that an already served creative will shrink when the window does.

The owner subsequently approved the 90 px geometry and later authorized release with immediate rollback on failure. Account changes remain excluded. Authenticated read-only inspection confirmed that the existing unit is fixed at 728 × 90 px; a separate responsive-unit proposal now awaits account authorization.

## Baseline application at the fixed revision

- [Ads](../../components/Ads.tsx) returns `null` until a 1,000 ms effect timer expires. It then renders an `ins` through `@ctrl/react-adsense`, declaring 728 × 90 px. `UI_TESTS=1` prevents it from appearing.
- [Layout](../../components/Layout.tsx) mounts Ads unconditionally between Header and the main content. The wrapper has 16 px of horizontal padding, a [Container](../../components/Container.tsx) capped at 1,152 px, and 16 px of bottom margin.
- The installed wrapper defaults to `data-ad-format="auto"` and `data-full-width-responsive="false"`, pushes once per effect mount, and swallows SDK errors. Its empty flex item shrinks on narrow screens; a declared width of 728 px alone does not prove overflow.
- [Document](../../pages/_document.tsx) loads the SDK only in production, outside UI tests. It provides no client readiness signal. [App](../../pages/_app.tsx) has no ad loader provider. Development still mounts the ad wrapper and queues a request despite having no SDK.
- Loading, error, missing/old room, missing player, room-not-ready, room-code, and unavailable-localStorage states can still mount Ads through Layout. Room setup and host/player views use the same component. No state-specific eligibility contract exists.

The public slot identifier in source is `1185318534`. During the initial investigation, the account console redirected to Google sign-in in the collaborative browser. The later owner-authorized Chrome inspection confirmed the fixed unit and its snippet, as recorded in the release section below. Auto ads and consent configuration have not been comprehensively audited in this task.

## Measurements on the unchanged app

Ran `npm ci` with Node 24.21.0 and npm 11.19.0, then `GA_TRACKING_ID='' SENTRY_DSN='' npm run dev -- --port 3129`. Only the homepage was visited, with no room/player writes. Development omits the AdSense loader; inspected pages contained no Google advertising or analytics scripts. These are local development observations, not Production benchmarks.

| Page and viewport | Document width | Wrapper inner width | Empty ins | Main top before / after | Ad insertion shift entry |
| --- | ---: | ---: | --- | --- | ---: |
| Spanish, 390 × 844 | 375 | 343 | 343 × 90 | 74 → 180 px | 0.16430 |
| English, 1280 × 900 | 1265 | 1152 | 728 × 90 | 74 → 180 px | 0.07690 |

Both pages had a 15 px scrollbar and no creative iframe. A buffered `PerformanceObserver` captured `layout-shift` sources, including the main content moving from y=74 to y=180. Other entries occurred during initial rendering. The table isolates the insertion entry; it does not report field CLS or compare the performance of the two languages.

## Reproducible comparison

Open [the standalone prototype](perf-09-geometry.html) through a local static server:

```sh
python3 -m http.server 3130 --bind 127.0.0.1 --directory docs/reports
```

Visit `http://localhost:3130/perf-09-geometry.html`. It is outside `public/` and adds no application route. Its CSP blocks external resources. It contains no publisher identifiers, Google scripts, analytics, Firebase, or production data. The page uses sample content, system fonts, and a local iframe stub. It models wrapper geometry rather than reproducing the full UI or SDK.

Choose a geometry, viewport, response, delay, and sample language. Use **Replay arrival** for a fresh document. Set another width and use **Resize existing frame** to retain the same creative. Filled stubs freeze their iframe dimensions at arrival, deliberately exposing the limits of CSS-only resizing. Blocked, error, unfilled, and pending options represent the same absence of a creative; they are not implementations or tests of an ad loader.

Measured all four variants at 320, 360, 375, 390, 414, 759, 760, 761, 768, 1024, 1280, and 1440 px. Raw results are in [measurements](perf-09-measurements.json).

| Variant | Slot height | Movement on arrival | Cold-load overflow with fitting stub |
| --- | --- | --- | --- |
| Current delayed wrapper | 90 px | 106 px at all 12 widths | None |
| Proposed reserved height | 90 px | 0 px at all 12 widths | None |
| Breakpoint alternative | 100 below 760 px; 90 otherwise | 0 px at all 12 widths | None |
| Illustrative automatic response | 250 below 760 px; 90 otherwise, starting from a 90 px reservation | 160 px below 760 px | None |

The automatic response is a hypothetical 250 px creative, not a measured or predicted Google size. The breakpoint alternative uses flexible width; exact standard sizes would need further choices for small screens. At 320 px with this scrollbar and padding, only 273 px remain, so a fixed 320 px mobile creative would not fit.

The fixed-height candidate stayed at y=180 through filled, unfilled, blocked, error, and pending states at 390 px, with Spanish and English sample content. The initial reservation persists when no creative arrives; this blank space is the deliberate stability tradeoff.

### Equivalent isolated shift comparison

The same 600 px-high frame, Spanish sample content, scroll position zero, and 1,100 ms delay were used for both variants. No input occurred during the observation. Only the ad insertion generated shift entries.

| Frame width | Baseline shift sum | Reserved-height shift sum | Main displacement before / after change |
| --- | ---: | ---: | --- |
| 390 px | 0.15488 | 0 | 106 → 0 px |
| 1280 px | 0.07346 | 0 | 106 → 0 px |

These single-arrival sums describe the isolated prototype. They are not before/after application CLS, browser-wide performance guarantees, or Auto ads measurements.

### Resize counterexample

After filling the proposed slot at 1280 px and shrinking its frame to 390 px:

- The slot adapted from 728 px to 343 px wide and retained 90 px height.
- The frozen creative remained 728 px wide.
- Document scroll width grew to 744 px against 375 px available, producing 369 px of horizontal overflow.
- Main top remained 180 px. Returning to 1280 px restored the fit without another stub insertion.

This is a synthetic counterexample, not an observation of Google's current response. It proves that a flexible wrapper alone cannot establish the resize acceptance criterion. Do not hide overflow, scale the iframe, or refresh on window changes to make a test pass. A served creative and real orientation/desktop-resize checks are still needed.

## Implementation contract

The approved component change follows this contract, preserving current page states until a separate eligibility decision:

1. Reserve the agreed height and existing 16 px gap before requesting an ad, including no-fill and loader failure.
2. Use explicit `ins` dimensions and a small initialization adapter instead of the wrapper's implicit automatic format. Remove the package only if unused elsewhere.
3. Expose readiness from a single loader, preserving existing analytics initialization order. The installed Next.js Pages Router guides confirm that Document is server-only; client `next/script` readiness/error handling belongs in App or a provider. Moving the existing loader changes its timing and must be tested separately, including Auto ads.
4. Request once per connected, eligible DOM node with positive width after SDK readiness. Cancel waiting on unmount; disconnect size observation after initialization. Do not refresh for marks, called numbers, language, or resize. Preserve a request on a retained node and request a new eligible node only once.
5. Add stub-based tests to a configuration that actually enables the component while intercepting the loader and blocking advertising traffic. The baseline UI suite disabled ads; the updated suite exercises the real component with blocked or simulated advertising.

Google documents variable width with explicit height and custom breakpoint sizes for **responsive units**. Its advanced examples omit the automatic-format attributes. This supports the proposed direction; it does not establish current slot compatibility or inventory at every available width. [Allowed responsive-code modifications](https://support.google.com/adsense/answer/9183363?hl=en).

The responsive tag parameters describe automatic shape and full-width behavior separately. An automatic format is not a fixed-height promise. [Responsive parameters](https://support.google.com/adsense/answer/9183460?hl=en). No-fill handling must distinguish documented `unfilled` and `unfill-optimized` states; retaining the outer reservation is an application decision. [Ad status](https://support.google.com/adsense/answer/10762946?hl=en).

## Decisions and remaining acceptance

**Geometry decision, completed:** the owner chose the 90 px fixed reservation and flexible width up to 728 px. Current placement and page states are preserved. A placement or interaction change requires its own explicit choice.

**Account prerequisite, verified:** slot `1185318534` remains fixed at 728 × 90 px. The proposed next step is a new display unit named `Layout PERF-09 responsive`, with Responsive sizing, followed by replacing the PR's manual slot ID with the generated ID. This preserves the existing unit for rollback and avoids changing the currently deployed slot. Creating the unit requires separate owner authorization; the prepared form has not been saved. Global ad settings are outside this proposal.

**Eligibility and loader prerequisite:** decide which real page states may request an ad and verify current consent/loader behavior. The shared Layout cannot infer eligibility from a URL alone. This report does not classify gameplay, consent, or existing placements as approved. Resolve these before activating a replacement globally; do not expand this task into general advertising/account work.

**Validation still required:** dedicated React effect-replay coverage; placement distances across host/player/streamer views; real device orientation; actual creative resizing; Preview browser behavior and authorized real-ad delivery. The application tests below cover navigation separately from the prototype. No claim about revenue, fill rate, SDK cost, or field CLS follows from these local measurements.

## Approved implementation

`Ads` now reserves the agreed geometry in server HTML and retains it through loader failure and no fill. The `ins` mounts only after the shared SDK loader reports readiness. A positive-width check, a temporary ResizeObserver, and a DOM-node request reference prevent early or duplicate requests; unmount cancels observation. SDK errors leave the game usable and produce one generic warning without room or player data. No automatic retries or refreshes were added.

The sole ad loader moved from Document to an App-level provider using `next/script` with `afterInteractive`, `onReady`, and `onError`. Its URL and publisher attribute remain unchanged. Analytics initialization still runs in the server document before the SDK. The unused `@ctrl/react-adsense` dependency was removed. The slot ID, current placement, and current page-state eligibility are unchanged; preserving them does not certify their suitability for release.

The isolated UI suite now renders the actual reservation and attempts the shared loader under its existing network block. Dedicated ad tests fulfill that request with a stub. Other journeys exercise the blocked-loader state. This replaces the earlier ad bypass, so ad geometry now participates in application tests. Frozen stub iframe dimensions deliberately remain distinct from the responsive slot; tests do not claim that application CSS can resize a real creative.

### Local verification

- `npm run lint:check`, `npm run validate-analytics`, `npm run build`, and `git diff --check` passed.
- `npm run ui-tests:production` passed all 43 tests at that point, including eight ad cases and the existing host/player journeys.
- After adding screenshots and the SDK-before-slot case, `npm run ui-tests:ci -- tests/ui/ads.spec.ts` passed all nine ad tests against the unchanged compiled application. Lint/typechecking passed again for the final tests.
- The actual component preserved the main content's coordinate before and after a delayed simulated fill in both languages at 390 × 844. Tests checked 90 px height and available width capped at 728 px across the 12 investigated widths. Screenshots for mobile and desktop in both languages are attached to the Playwright report.
- Blocked loader, collapsed unfilled `ins`, SDK exception, and initial zero width retained the outer reservation. SDK-ready-before-slot and navigation-before-SDK cases initialized only the active node. Back/forward navigation created one request per replacement node; a language change retained the same node/request. Host draws and player card marks did not request new ads.

All game writes used the disposable `demo-coronabingo-ui` emulator. Advertising traffic was intercepted or blocked. Services shut down after each run. The compiled application checks above are local checks, not hosted Preview or real-inventory acceptance.

Rollback is the implementation commit's inverse, restoring the old component, loader location, and wrapper dependency while preserving unrelated work. There are no account changes to reverse in this delivery. A later approved account change would also require restoring its captured settings; Git cannot reverse AdSense.

## Release verification and no-fill correction

The owner authorized merge, Production verification, immediate rollback on a regression, and cleanup only after successful acceptance. The branch incorporates `main` at `4d9a9b3` before release checks.

A bounded real-SDK Preview check on `2a8381a` found that an **unfilled** manual unit retained its empty 728 × 90 px iframe after resizing from 1280 to 390 px. The outer reservation adapted to 343 × 90 px, but document scroll width reached 744 px against a 375 px viewport. This is an observed empty-iframe failure, not proof of delivered-creative behavior. The pre-release Production baseline separately showed the old automatic-format manual unit at 728 × 280 px with `data-ad-status="unfill-optimized"`.

The correction hides only an `unfilled` manual `ins`, following [Google's documented no-fill handling](https://support.google.com/adsense/answer/10762946?hl=en). The 90 px outer reservation remains. The CSS rule is scoped to the manual reservation and retained through production CSS purging. Filled and `unfill-optimized` units remain visible; this does not solve or conceal an oversized delivered creative.

The SDK stub now retains a fixed-width empty iframe instead of hiding it itself. The regression assertion checks actual document overflow after desktop-to-mobile resize, preserved height/content position, and one request. A separate case verifies that optimized content is not hidden. The integrated tweet suite now matches Twitter hostnames instead of the substring `syndication`, which incorrectly counted the newly exercised AdSense loader as Twitter traffic.

The corrected branch passed lint/typechecking and all 60 compiled UI tests, including 10 ad cases and the integrated Firestore/tweet journeys. Hosted verification of this correction and the authorized Production release remain pending. No provider settings have changed. The subsequently authorized Chrome session supplied the account evidence below.

### Authenticated account inspection

Read-only inspection of the owner's Chrome session confirmed `Layout` / `1185318534`, Fixed sizing, width 728 and height 90. The unit list displayed a last-modified date of October 7, 2020. Its generated HTML declares `display:inline-block;width:728px;height:90px`, without automatic-format attributes. The global mobile ad-size optimization switch is off. The existing unit editor was closed with Cancel.

A new display-unit form is prepared, unsaved, with name `Layout PERF-09 responsive` and Responsive sizing. Proposed implementation: create that unit after explicit authorization, use its generated slot ID in the reviewed component, repeat isolated checks and a bounded real Preview check, then perform the already-authorized release and Production verification. Google documents variable width with fixed height for responsive units; creating one does not by itself prove filled-creative resize or orientation behavior.

Rollback would restore the old application implementation and slot ID, without changing the old unit. The new unit could remain unused after rollback; archiving it would be a separate account action. Neither account approval nor absence of inventory substitutes for successful geometry checks.
