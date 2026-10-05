# PERF-09: ad geometry investigation

Date: 2026-10-04, America/Argentina/Buenos_Aires.
Base: `edc2d5a791d2ca372024d8278549e106bf4f5daf`.
Delivery: diagnosis and a standalone comparison. Application behavior is unchanged.

## Finding and recommendation

The manual ad moves the page content down by **106 px** when its empty wrapper appears. This reproduces locally without Google's SDK: 90 px of slot height plus 16 px of bottom margin. Reserve that space from the first render of an eligible page and use the available width, capped at 728 px.

Keep 90 px as the proposed height. A 100 px mobile variant consumes another 10 px and introduces a height change at its breakpoint. Automatic sizing gives the application less control over the height above the game. None of these options guarantees that an already served creative will shrink when the window does.

This recommendation requires a geometry decision before product implementation. It does not authorize account changes. Actual creative delivery, eligible page states, and the current account configuration remain unresolved.

## Current application

- [Ads](../../components/Ads.tsx) returns `null` until a 1,000 ms effect timer expires. It then renders an `ins` through `@ctrl/react-adsense`, declaring 728 × 90 px. `UI_TESTS=1` prevents it from appearing.
- [Layout](../../components/Layout.tsx) mounts Ads unconditionally between Header and the main content. The wrapper has 16 px of horizontal padding, a [Container](../../components/Container.tsx) capped at 1,152 px, and 16 px of bottom margin.
- The installed wrapper defaults to `data-ad-format="auto"` and `data-full-width-responsive="false"`, pushes once per effect mount, and swallows SDK errors. Its empty flex item shrinks on narrow screens; a declared width of 728 px alone does not prove overflow.
- [Document](../../pages/_document.tsx) loads the SDK only in production, outside UI tests. It provides no client readiness signal. [App](../../pages/_app.tsx) has no ad loader provider. Development still mounts the ad wrapper and queues a request despite having no SDK.
- Loading, error, missing/old room, missing player, room-not-ready, room-code, and unavailable-localStorage states can still mount Ads through Layout. Room setup and host/player views use the same component. No state-specific eligibility contract exists.

The current public slot identifier in source is `1185318534`. The account console redirected to Google sign-in in the available collaborative browser. Its current unit type, generated snippet, Auto ads settings, and consent configuration were **not** verified. Older observations of a fixed unit are historical evidence only.

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

## Proposed implementation boundary

After the geometry decision, the smallest complete component change would:

1. Reserve the agreed height and existing 16 px gap before requesting an ad, including no-fill and loader failure.
2. Use explicit `ins` dimensions and a small initialization adapter instead of the wrapper's implicit automatic format. Remove the package only if unused elsewhere.
3. Expose readiness from a single loader, preserving existing analytics initialization order. The installed Next.js Pages Router guides confirm that Document is server-only; client `next/script` readiness/error handling belongs in App or a provider. Moving the existing loader changes its timing and must be tested separately, including Auto ads.
4. Request once per connected, eligible DOM node with positive width after SDK readiness. Cancel waiting on unmount; disconnect size observation after initialization. Do not refresh for marks, called numbers, language, or resize. Preserve a request on a retained node and request a new eligible node only once.
5. Add stub-based tests to a configuration that actually enables the component while intercepting the loader and blocking advertising traffic. The existing UI suite disables ads and cannot certify this behavior.

Google documents variable width with explicit height and custom breakpoint sizes for **responsive units**. Its advanced examples omit the automatic-format attributes. This supports the proposed direction; it does not establish current slot compatibility or inventory at every available width. [Allowed responsive-code modifications](https://support.google.com/adsense/answer/9183363?hl=en).

The responsive tag parameters describe automatic shape and full-width behavior separately. An automatic format is not a fixed-height promise. [Responsive parameters](https://support.google.com/adsense/answer/9183460?hl=en). No-fill handling must distinguish documented `unfilled` and `unfill-optimized` states; retaining the outer reservation is an application decision. [Ad status](https://support.google.com/adsense/answer/10762946?hl=en).

## Decisions and remaining acceptance

**Geometry decision:** choose the recommended 90 px fixed reservation, the 100 px mobile alternative, or defer the component change. Retain current placement in the comparison. A placement or interaction change requires its own explicit choice.

**Account prerequisite:** obtain an authenticated read-only view of slot `1185318534` and its current snippet. If it is already responsive, no unit conversion may be necessary. If it remains fixed, prepare either conversion of that slot or a new responsive unit for separate approval. A new unit would isolate the existing site's slot; conversion would affect that shared slot. Capture the original settings and snippet before any approved mutation. No account mutation is part of this report.

**Eligibility and loader prerequisite:** decide which real page states may request an ad and verify current consent/loader behavior. The shared Layout cannot infer eligibility from a URL alone. This report does not classify gameplay, consent, or existing placements as approved. Resolve these before activating a replacement globally; do not expand this task into general advertising/account work.

**Validation still required:** application integration; SSR/hydration; zero-width to positive-width initialization; effect replay; unmount before SDK readiness; route and language navigation; back/forward; host/player/streamer controls and their distance from the ad; real device orientation; actual creative resizing; Preview and authorized real-ad delivery. Prototype document replacement is not React navigation coverage. No claim about revenue, fill rate, SDK cost, or field CLS follows from these local measurements.

Rollback for this delivery is removal of the report and prototype. A future component change needs a code rollback and, if separately approved, restoration of the captured account settings. Git cannot reverse an AdSense change.
