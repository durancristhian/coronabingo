# PERF-09: ad geometry investigation

Date: 2026-10-04, America/Argentina/Buenos_Aires.
Base: `edc2d5a791d2ca372024d8278549e106bf4f5daf`.
Delivery: first release reverted after a real filled-ad failure; replacement PR #222 deployed and verified for the approved manual-slot behavior on 2026-10-05 UTC. Auto ads remain an independent limitation.

## Finding and recommendation

The manual ad moves the page content down by **106 px** when its empty wrapper appears. This reproduces locally without Google's SDK: 90 px of slot height plus 16 px of bottom margin. Reserve that space from the first render of an eligible page and use the available width, capped at 728 px.

Keep 90 px as the proposed height. A 100 px mobile variant consumes another 10 px and introduces a height change at its breakpoint. Automatic sizing gives the application less control over the height above the game. None of these options guarantees that an already served creative will shrink when the window does.

The owner subsequently approved the 90 px geometry and later authorized release with immediate rollback on failure. Authenticated inspection confirmed that the existing unit is fixed at 728 × 90 px. The owner then explicitly authorized a new responsive unit, which was created as `9427584752`; the existing fixed unit remains unchanged for rollback.

## Baseline application at the fixed revision

- [Ads](../../components/Ads.tsx) returns `null` until a 1,000 ms effect timer expires. It then renders an `ins` through `@ctrl/react-adsense`, declaring 728 × 90 px. `UI_TESTS=1` prevents it from appearing.
- [Layout](../../components/Layout.tsx) mounts Ads unconditionally between Header and the main content. The wrapper has 16 px of horizontal padding, a [Container](../../components/Container.tsx) capped at 1,152 px, and 16 px of bottom margin.
- The installed wrapper defaults to `data-ad-format="auto"` and `data-full-width-responsive="false"`, pushes once per effect mount, and swallows SDK errors. Its empty flex item shrinks on narrow screens; a declared width of 728 px alone does not prove overflow.
- [Document](../../pages/_document.tsx) loads the SDK only in production, outside UI tests. It provides no client readiness signal. [App](../../pages/_app.tsx) has no ad loader provider. Development still mounts the ad wrapper and queues a request despite having no SDK.
- Loading, error, missing/old room, missing player, room-not-ready, room-code, and unavailable-localStorage states can still mount Ads through Layout. Room setup and host/player views use the same component. No state-specific eligibility contract exists.

The baseline public slot identifier was `1185318534`. During the initial investigation, the account console redirected to Google sign-in in the collaborative browser. The later owner-authorized Chrome inspection confirmed the fixed unit and its snippet, as recorded in the release section below. Auto ads and consent configuration have not been comprehensively audited in this task.

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

This is a synthetic counterexample, not an observation of Google's current response. It proves that a flexible wrapper alone cannot establish the resize acceptance criterion. Do not clip overflow, scale the iframe, or refresh on window changes to make a test pass. A served creative and real orientation/desktop-resize checks are still needed.

## Implementation contract

The approved component change follows this contract, preserving current page states until a separate eligibility decision:

1. Reserve the agreed height and existing 16 px gap before requesting an ad, including no-fill and loader failure.
2. Use explicit `ins` dimensions and a small initialization adapter instead of the wrapper's implicit automatic format. Remove the package only if unused elsewhere.
3. Expose readiness from a single loader, preserving existing analytics initialization order. The installed Next.js Pages Router guides confirm that Document is server-only; client `next/script` readiness/error handling belongs in App or a provider. Moving the existing loader changes its timing and must be tested separately, including Auto ads.
4. Request once per connected, eligible DOM node with positive width after SDK readiness. Cancel waiting on unmount; disconnect size observation after initialization. Do not refresh for marks, called numbers, language, or resize. Preserve a request on a retained node and request a new eligible node only once.
5. Add stub-based tests to a configuration that actually enables the component while intercepting the loader and blocking advertising traffic. The baseline UI suite disabled ads; the updated suite exercises the real component with blocked or simulated advertising.

Google documents variable width with explicit height and custom breakpoint sizes for **responsive units**. Its advanced examples omit the automatic-format attributes. This supports the proposed direction; it does not establish current slot compatibility or inventory at every available width. [Allowed responsive-code modifications](https://support.google.com/adsense/answer/9183363?hl=en).

The responsive tag parameters describe automatic shape and full-width behavior separately. An automatic format is not a fixed-height promise. [Responsive parameters](https://support.google.com/adsense/answer/9183460?hl=en). No-fill handling must distinguish documented `unfilled` and `unfill-optimized` states; retaining the outer reservation is an application decision. [Ad status](https://support.google.com/adsense/answer/10762946?hl=en).

## First release and rollback

PR [#218](https://github.com/durancristhian/coronabingo/pull/218) was merged as `f973f9c` after 68 CI tests passed. Its Production deployment served a filled 728 × 90 px manual ad. When the viewport shrank from 1280 to 390 px, the reservation became 343 × 90 px but the served `ins` and iframe remained 728 × 90 px. This failed acceptance. The earlier filled-ad tests asserted the reservation dimensions without asserting actual document overflow; a passing result did not prove the creative fitted.

The authorized immediate revert is `1589d9d34d41d878abadcc7716cb279818a89d88`. Vercel deployment `dpl_F3PTHK128TStoveGC35VTfPwrZFo` was confirmed READY, with that exact commit and the `coronabingo.com.ar` alias. Actual Production browser verification found build `I-x2Exi42VKM8p2JA0FVI`, old slot `1185318534`, and no PERF-09 reservation. Revert CI passed. This restores the previous behavior; it does not fix baseline advertising limitations.

Auto ads also injected separate blocks and contributed to page shifts and overflow during the failed release. The full document scroll width of 1200 px must not be attributed solely to the manual ad. This task does not change Auto ads settings or claim a page-wide CLS improvement. There were no hosted gameplay writes or ad clicks.

## Account and approved geometry

The owner approved a 90 px reservation, available width capped at 728 px, retained without inventory. Existing placement and page states are preserved. The owner separately authorized creating the display unit `Layout PERF-09 responsive`, with Responsive sizing. Its generated slot ID is `9427584752`. The old `Layout` unit `1185318534` remains Fixed at 728 × 90 px and was not edited. The global mobile size optimization switch was observed off and left unchanged.

The responsive unit was unused following the first rollback and is now used by the accepted replacement. Creating the unit does not guarantee delivery, resize behavior, or improved income. Compare coverage, impressions, viewability and RPM by device over comparable periods; a new unit and a short before/after sample are not a controlled revenue experiment.

## Accepted replacement: preserve space and hide an oversized unit completely

The replacement starts from rollback commit `1589d9d`, reuses the approved responsive unit, and retains the 90 px server-rendered reservation and existing 16 px bottom gap. It uses the shared `AdScript` readiness provider already shipped separately by HYD-01. The temporary initialization observer waits for positive width and requests once per DOM node. Route unmount cancels pending initialization; locale changes, game updates and viewport changes do not trigger an application ad refresh.

A separate fit observer checks the reservation and the external bounds of the manual `ins` and its iframes. If any part extends outside the reservation, the entire manual unit is removed from layout with `display:none`; the reservation stays. When the same unit fits again, it becomes visible with its original iframe and request. SDK child/style/dimension mutations trigger another check, including while hidden. Measurement and the final visibility decision happen synchronously. The observer watches the reservation rather than the hidden unit to avoid a resize feedback loop. It does not read cross-origin creative content or modify creative dimensions.

Unfilled inventory is hidden independently under Google's documented no-fill rule. Filled and `unfill-optimized` units remain visible whenever they fit. There is no cropping, scaling, forced refresh or extra request to obtain a smaller replacement. Auto ads are outside this guard.

**Tradeoff:** a served desktop ad disappears while its window is too narrow. This preserves usable controls but reduces that ad's visible time. It does not make the same creative responsive and does not guarantee unchanged income.

**Provider documentation:** Google's ad-code modification guidance explicitly exempts responsive units from its general prohibition on hiding ads, and its responsive-code guide demonstrates hiding units by screen size. The fit guard uses that responsive-unit exception to prevent overlap, without inflating requests or manipulating clicks. The exact runtime observer is application code, not a Google-provided implementation. The owner approved this visibility tradeoff before the second merge. A real filled unit was then checked in Production; earlier unfilled Preview responses were not used as proof of filled-creative behavior. [Ad-code modifications](https://support.google.com/adsense/answer/1354736), [responsive code examples](https://support.google.com/adsense/answer/9183363?hl=en).

## Replacement verification

The SDK fixture freezes a served iframe at its requested width, matching the observed failure. Regression tests assert document width, complete-unit visibility, unchanged iframe identity, 90 px reservation and a single request across desktop/mobile/landscape-sized viewport transitions. Additional mutations test oversized iframe width and height, followed by a fitting size while hidden. Both filled and optimized content are covered. Existing checks retain delayed/blocked/failed SDK, zero width, navigation, both languages and host/player updates with external advertising blocked.

These are isolated browser tests using a disposable local Firestore emulator. A landscape-shaped desktop viewport is not a physical device orientation test. Real filled inventory, physical orientation, page-state placement/eligibility and field CLS remain distinct acceptance items. No broad advertising-policy or consent certification is implied by preserving the current page states.

Local validation passed: `npm ci`, `npm run lint:check`, `npm run validate-analytics`, `npm run build`, `git diff --check`, and all 71 compiled UI tests (13 ad cases). The run used `demo-coronabingo-ui-a2ebd967` with external traffic blocked and stopped its owned services. Review against base1589d9d found no additional implementation defects. Branch CI37255205462 and merge CI37256386307 passed, including71 UI tests and9 runner tests. Hosted acceptance is recorded below; no physical-device test is claimed.


## Production acceptance of PR #222

The owner explicitly approved merging the replacement, checking Production and immediately reverting any new failure. PR [#222](https://github.com/durancristhian/coronabingo/pull/222) merged as `e3d6144bf827a77a50f32e0cde9d6f816f53aa7f`. Vercel deployment `dpl_4hwKjHAui32u7iedeJKvovKuERBD` was READY for that exact revision with the `coronabingo.com.ar` alias. Chrome loaded build `iQBa7XtXMlWF2qI7AIyeg` from the public domain. The browser viewport was restored after testing.

| Actual response and transition | Manual unit | Reservation | Result |
| --- | --- | --- | --- |
| Spanish, initial1280 × 900 | Filled728 × 90, iframe `aswift_2` | 728 × 90 | Visible and within bounds |
| Same page reduced to390 × 844 | Same iframe ID and width attribute728; entire unit hidden | 343 × 90 | No manual-unit overflow; main top unchanged at480px |
| Same page returned to1280 × 900 | Filled728 × 90, same iframe ID | 728 × 90 | Visible again; main top still480px |
| English, initial390 × 844 | `unfill-optimized`,343 × 90 | 343 × 90 | Visible; document scroll/client width375/375 |
| Same page reduced to320 × 844 | Entire optimized unit hidden | 273 × 90 | Manual unit cannot extend beyond the slot |
| Same page expanded to844 × 390 | Original optimized343 × 90 unit visible | 728 × 90 | Slot and unit fit |
| Return to390 × 844 and English-to-Spanish selection | Optimized343 × 90 remains visible | 343 × 90 | Document width375/375; room-name input and create button usable |

No application refresh was introduced. The one-request guarantee is covered by isolated SDK tests; real checks observed a stable iframe identifier and dimensions, not a complete network accounting of every Google request. No ad was clicked and no room/player records were created. The bounded10minute Production Vercel error-log query returned no entries.

**Remaining independent issue:** Auto ads retained1200px-wide iframes after desktop-to-mobile resize, leaving the whole document1200px wide against a375px client width even while the manual unit was fully hidden. A fresh narrow load fitted the viewport. The same Auto ads behavior was present before this replacement. Reverting the manual fix would not fix those units, so the accepted manual-slot change was retained. No Auto ads settings were changed. Investigate that behavior separately before claiming that all advertising on the page adapts correctly.

These checks establish the approved manual-slot behavior in desktop Chrome at portrait and landscape CSS dimensions. They do not establish physical-device orientation behavior, a field CLS improvement, universal inventory coverage, unchanged revenue, or broad placement/consent compliance. Detailed sanitized geometry is retained in the primary checkout's ignored PERF-09 research evidence before worktree cleanup.
