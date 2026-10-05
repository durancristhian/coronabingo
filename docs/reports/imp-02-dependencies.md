# IMP-02 dependency maintenance

Date: 2026-10-04. Base: `edc2d5a791d2ca372024d8278549e106bf4f5daf`.
Runtime: Node 24.21.0, npm 11.19.0. This is a bounded security update, with no application source changes, direct major upgrades, overrides, or framework migration.

## Result

The installed-tree audit changes from 61 affected packages to 39: critical 4 → 1, high 27 → 15, moderate 28 → 23, low 2 → 0. These counts include inherited dependency findings and unused SDK components. They do not count demonstrated application exploits.

Remove unused `@svgr/webpack` 5.5.0, `gsheets` 1.2.3 and `@types/gsheets` 2.0.0. Repository-wide searches found no imports, dynamic loads, scripts or configuration consumers. SVGs use the existing Webpack asset rule. Spreadsheet export uses `zipcelx`, not `gsheets`. `pdf-parse` remains because `scripts/generate-tickets.ts` consumes it.

The lockfile removes 180 package locations, adds `setimmediate` 1.0.5, and updates the 12 existing locations below. Other resolved versions are preserved, including all retained direct dependencies. `setimmediate` replaces JSZip's removed `@types/setimmediate` dependency; `regenerator-runtime` also disappears after the Babel runtime update. No packages were moved between dependency sections to disguise audit results.

## Changed versions and compatibility

All updates satisfy the existing parent ranges. Registry metadata declares no peer dependencies for these targets, and all declared Node engines admit Node 24. Unspecified engines are not a compatibility guarantee; installation, builds and behavior checks remain required.

| Package | Before | After | Parent and compatibility evidence |
| --- | --- | --- | --- |
| `@babel/runtime` | 7.13.17 | 7.29.7 | React Toastify / react-transition-group use Babel 7 helpers. Same major; generated helper consumers compile without source changes. [Release](https://github.com/babel/babel/releases/tag/v7.29.7). |
| `brace-expansion` | 1.1.11 | 1.1.21 | `minimatch` 3 accepts `^1.1.7`; security patches remain within 1.x. [Release](https://github.com/juliangruber/brace-expansion/releases/tag/v1.1.21). |
| `braces` | 3.0.2 | 3.0.3 | Required by micromatch's patch; fixes one resource-exhaustion advisory, but another remains. [Release](https://github.com/micromatch/braces/releases/tag/3.0.3). |
| `diff` | 4.0.2 | 4.0.4 | `ts-node` accepts `^4.0.1`; validators exercise the unchanged ts-node integration. [Release](https://github.com/kpdecker/jsdiff/releases/tag/v4.0.4). |
| `fill-range` | 7.0.1 | 7.1.1 | `braces` now requires `^7.1.1`; transitive consequence of its supported patch. |
| `jszip` | 3.6.0 | 3.10.2 | `zipcelx` accepts `^3.0.0`. It calls `folder`, `file`, and `generateAsync`, not prototype methods on `.files`. The 3.7 null-prototype change and 3.8 input-filename sanitization do not change this export path. [Changelog](https://stuk.github.io/jszip/CHANGES.html). |
| `micromatch` | 4.0.4 | 4.0.8 | lint-staged accepts `^4.0.2`; fixes direct ReDoS advisory. Residual braces finding is reported separately. [Release](https://github.com/micromatch/micromatch/releases/tag/4.0.8). |
| `picomatch` | 2.2.3 | 2.3.2 | micromatch, anymatch and readdirp accept 2.x; newer installed 4.x copies stay unchanged. [Release](https://github.com/micromatch/picomatch/releases/tag/2.3.2). |
| `protobufjs` | 6.10.2 | 6.11.6 | `@grpc/proto-loader` 0.5.6 accepts `^6.8.6`. The Firestore bundled schema loads and an UpdateDocument request serializes/deserializes successfully without network access. See critical analysis below. |
| `semver-regex` | 3.1.2 | 3.1.4 | Husky → find-versions accepts `^3.1.2`; same-major security patches. [Releases](https://github.com/sindresorhus/semver-regex/releases). |
| `websocket-driver` | 0.7.4 | 0.7.5 | faye-websocket 0.11.3 accepts `>=0.5.1`. This is a patch within 0.7, tightening message-length checks without changing the client API. [Changelog](https://github.com/faye/websocket-driver-node/blob/main/CHANGELOG.md). |
| `yaml` | 1.10.2 | 1.10.3 | Husky → cosmiconfig 7 accepts `^1.10.0`; security backport, existing YAML 2 stays unchanged. [Release](https://github.com/eemeli/yaml/releases/tag/v1.10.3). |

## The four original critical packages

### Babel traverse

`@svgr/webpack@5.5.0` owned all paths to `@babel/traverse@7.13.17`: through `@babel/core`, its module-transform helpers and helpers package, plus preset-env's async-generator, module-systemjs and polyfill-corejs2 helper chains. The retained `npm explain` and `npm ls` snapshots enumerate these paths.

[GHSA-67hx-6x53-jw92](https://github.com/advisories/GHSA-67hx-6x53-jw92) affects versions below 7.23.2. Exploitation requires compiling attacker-controlled code through a plugin invoking Babel's evaluator. The unused SVGR loader was not configured or imported; room names and other gameplay inputs do not enter it. Removing the parent removes every installed traverse instance. This does not make a general claim about Next's independently bundled tooling.

### Loader utilities

The single instance was `@svgr/webpack@5.5.0 → loader-utils@2.0.0`. There were three advisories, all removed with the unused parent:

- [GHSA-76p3-8jx3-jpfq](https://github.com/advisories/GHSA-76p3-8jx3-jpfq): prototype pollution, affected 2.0.0–2.0.2, patched 2.0.3. Requires crafted loader query input to the vulnerable parser.
- [GHSA-3rfm-jhwj-7488](https://github.com/advisories/GHSA-3rfm-jhwj-7488): URL regex denial of service, affected below 2.0.4 in 2.x.
- [GHSA-hhq3-ff78-jv3g](https://github.com/advisories/GHSA-hhq3-ff78-jv3g): interpolation regex denial of service, also patched in 2.0.4.

The latter two need crafted input reaching build-time loader helpers. No application route invokes them, and no instance remains after removal. Updating only to 2.0.3 would have left both high-severity findings.

### Protobuf.js

The affected path is `firebase@7.24.0 → @firebase/firestore@1.18.0 → @grpc/proto-loader@0.5.6 → protobufjs@6.10.2`, now 6.11.6. Firebase CLI uses separate 7.6.6 copies through Cloud SQL's grpc-js/proto-loader and Pub/Sub's google-gax/proto-loader/proto3-json-serializer. Those copies are unchanged and absent from the affected audit nodes.

The browser build uses Firestore's browser entry and WebChannel. Bundle reports contain no protobufjs. Next server output traces do include the Node Firestore SDK and protobufjs, even though the bundle analyzer does not inline these external packages. The Node SDK loads its own `dist/src/protos/google/firestore/v1/firestore.proto`, not a room-supplied schema. Gameplay listeners run in React effects. No public schema-upload or descriptor-loading route was found. This limits demonstrated reachability; it is not proof that every advisory is harmless.

Version 6.11.6 clears the older prototype-pollution ranges in [GHSA-g954-5hwp-pp24](https://github.com/advisories/GHSA-g954-5hwp-pp24) and [GHSA-h755-8qp9-cq85](https://github.com/advisories/GHSA-h755-8qp9-cq85). Those require attacker-controlled property paths or protobuf definitions.

There is an upstream/audit discrepancy for [GHSA-xq3m-2v4x-88gg](https://github.com/advisories/GHSA-xq3m-2v4x-88gg). npm still matches all versions below 7.5.5, but the official [6.11.6 release](https://github.com/protobufjs/protobuf.js/releases/tag/v6.11.6) backports the type-name code-injection fix via [PR 2221](https://github.com/protobufjs/protobuf.js/pull/2221). The installed `src/type.js` contains that filter. The advisory requires loading an attacker-controlled schema or descriptor, which this app does not expose. We retain the audit finding and do not claim zero critical findings or complete security of protobufjs 6.

Other remaining protobufjs advisories concern bytes defaults and generated code, crafted field/type names, prototype injection/options, recursive schemas/messages/Any conversion and UTF-8 decoding. Schema-based issues need schema control; decoding issues can instead depend on message bytes from the endpoint. The app talks to Firestore and does not accept arbitrary protobuf endpoints or raw protobuf uploads. The exact remaining advisory list and ranges are preserved below. A supported Firebase/Firestore migration is the future route to eliminating this obsolete Node chain; forcing protobufjs 7 into the current loader is excluded.

### WebSocket driver

The sole path is `firebase@7.24.0 → @firebase/database@0.6.13 → faye-websocket@0.11.3 → websocket-driver@0.7.4`, now 0.7.5. The application imports `firebase/app` and `firebase/firestore`, not Realtime Database. Browser modules and server traces contain no websocket-driver or Realtime Database package.

[GHSA-xv26-6w52-cph6](https://github.com/advisories/GHSA-xv26-6w52-cph6) requires malformed legacy protocol length headers. [GHSA-mp7j-qc5w-4988](https://github.com/advisories/GHSA-mp7j-qc5w-4988) requires compressed messages bypassing configured size limits. Both affect versions below 0.7.5 and are addressed by this patch. No exposed WebSocket server or Realtime Database consumer was found in the app. Removal of Firebase itself would break Firestore and is not proposed.

## Remaining risk and follow-up boundaries

The full current audit is summarized below, including inherited findings. The direct-advisory rows link the published affected range. Parent rows point to the flagged dependencies rather than inventing a separate vulnerability.

- **Firebase SDK / Node transport:** old components pin `@firebase/util@0.3.2` and `node-fetch@2.6.1`. No range-compatible patch exists for those exact pins. Upgrade Firebase as a separate migration; preserve browser/SSR distinction and test host/player synchronization.
- **Sentry:** the browser SDK remains 5.30.0. The DOM-clobbering advisory needs hostile DOM content. This task does not establish that condition. Its patched range requires a major upgrade and a separate instrumentation review.
- **CSS build:** PostCSS 7 and the PostCSS 6 copy under postcss-functions remain. The build consumes repository CSS/configuration; no public CSS compilation endpoint exists. Fixing all current ranges requires coordinated PostCSS/Tailwind/plugin migration. A PostCSS 7 patch alone would not clear current findings.
- **Development and QA tooling:** braces retains an advisory with no patched version listed, inherited by micromatch, lint-staged and chokidar. Avoid treating the successfully patched older braces advisory as complete remediation. Firebase CLI's Pub/Sub chain requires OpenTelemetry core 1.x; patched 2.8.0 is outside that range. Its proxy/FTP and uuid findings similarly need parent changes beyond the current supported child ranges. The CLI is used for the disposable emulator, not shipped as browser gameplay code. Reevaluate its parent releases separately; npm's suggested downgrade is not an approved fix.

Non-security direct updates remain candidates, not validated upgrades. Next, React, router, bundler and Node stay fixed. Firebase and Sentry's current direct majors cannot become fully current within this ticket. Optional icon packages remain for the approved later migration. No PDF parser update is included, so regenerating the catalog is unnecessary; the existing catalog validator is still run.

### Audit inventory

| Affected package | Severity | Direct advisory or inherited dependency |
| --- | --- | --- |
| `@firebase/analytics` | moderate | `@firebase/component`; `@firebase/installations`; `@firebase/util` |
| `@firebase/app` | moderate | `@firebase/component`; `@firebase/util` |
| `@firebase/component` | moderate | `@firebase/util` |
| `@firebase/database` | moderate | `@firebase/component`; `@firebase/util` |
| `@firebase/firestore` | high | `@firebase/component`; `@firebase/util`; `@grpc/proto-loader`; `node-fetch` |
| `@firebase/functions` | high | `@firebase/component`; `node-fetch` |
| `@firebase/installations` | moderate | `@firebase/component`; `@firebase/util` |
| `@firebase/messaging` | moderate | `@firebase/component`; `@firebase/installations`; `@firebase/util` |
| `@firebase/performance` | moderate | `@firebase/component`; `@firebase/installations`; `@firebase/util` |
| `@firebase/remote-config` | moderate | `@firebase/component`; `@firebase/installations`; `@firebase/util` |
| `@firebase/storage` | moderate | `@firebase/component`; `@firebase/util` |
| `@firebase/util` | moderate | [GHSA-fpm5-vv97-jfwg](https://github.com/advisories/GHSA-fpm5-vv97-jfwg) `<0.3.4` |
| `@fullhuman/postcss-purgecss` | moderate | `postcss`; `purgecss` |
| `@google-cloud/pubsub` | moderate | `@opentelemetry/core` |
| `@grpc/proto-loader` | high | `protobufjs` |
| `@opentelemetry/core` | moderate | [GHSA-8988-4f7v-96qf](https://github.com/advisories/GHSA-8988-4f7v-96qf) `<2.8.0` |
| `@sentry/browser` | moderate | [GHSA-593m-55hh-j8gv](https://github.com/advisories/GHSA-593m-55hh-j8gv) `<7.119.1` |
| `autoprefixer` | moderate | `postcss` |
| `basic-ftp` | high | [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r) `<=6.2.0` |
| `braces` | high | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) `<=3.0.3` |
| `chokidar` | high | `braces` |
| `firebase` | high | `@firebase/analytics`; `@firebase/app`; `@firebase/database`; `@firebase/firestore`; `@firebase/functions`; `@firebase/installations`; `@firebase/messaging`; `@firebase/performance`; `@firebase/remote-config`; `@firebase/storage`; `@firebase/util`; [GHSA-3wf4-68gx-mph8](https://github.com/advisories/GHSA-3wf4-68gx-mph8) `<10.9.0` |
| `firebase-tools` | high | `@google-cloud/pubsub`; `chokidar`; `gaxios`; `proxy-agent` |
| `gaxios` | moderate | `uuid` |
| `get-uri` | high | `basic-ftp` |
| `lint-staged` | high | `micromatch` |
| `micromatch` | high | `braces` |
| `node-fetch` | high | [GHSA-r683-j2x4-v87g](https://github.com/advisories/GHSA-r683-j2x4-v87g) `<2.6.7` |
| `pac-proxy-agent` | high | `get-uri` |
| `postcss` | high | [GHSA-hwj9-h5mp-3pm3](https://github.com/advisories/GHSA-hwj9-h5mp-3pm3) `>=7.0.0 <7.0.36`; [GHSA-566m-qj78-rww5](https://github.com/advisories/GHSA-566m-qj78-rww5) `<7.0.36`; [GHSA-7fh5-64p2-3v2j](https://github.com/advisories/GHSA-7fh5-64p2-3v2j) `<8.4.31`; [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) `<8.5.10`; [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) `<=8.5.11`; [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) `<=8.5.22`; [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) `<=8.5.17` |
| `postcss-functions` | moderate | `postcss` |
| `postcss-import` | moderate | `postcss` |
| `postcss-js` | moderate | `postcss` |
| `postcss-nested` | moderate | `postcss` |
| `protobufjs` | critical | [GHSA-xq3m-2v4x-88gg](https://github.com/advisories/GHSA-xq3m-2v4x-88gg) `<7.5.5`; [GHSA-66ff-xgx4-vchm](https://github.com/advisories/GHSA-66ff-xgx4-vchm) `<=7.5.5`; [GHSA-2pr8-phx7-x9h3](https://github.com/advisories/GHSA-2pr8-phx7-x9h3) `<=7.5.5`; [GHSA-fx83-v9x8-x52w](https://github.com/advisories/GHSA-fx83-v9x8-x52w) `<=7.5.5`; [GHSA-75px-5xx7-5xc7](https://github.com/advisories/GHSA-75px-5xx7-5xc7) `<=7.5.5`; [GHSA-jvwf-75h9-cwgg](https://github.com/advisories/GHSA-jvwf-75h9-cwgg) `<=7.5.5`; [GHSA-685m-2w69-288q](https://github.com/advisories/GHSA-685m-2w69-288q) `<=7.5.5`; [GHSA-q6x5-8v7m-xcrf](https://github.com/advisories/GHSA-q6x5-8v7m-xcrf) `<=7.5.5`; [GHSA-jggg-4jg4-v7c6](https://github.com/advisories/GHSA-jggg-4jg4-v7c6) `<=7.5.7`; [GHSA-wcpc-wj8m-hjx6](https://github.com/advisories/GHSA-wcpc-wj8m-hjx6) `<=7.6.0`; [GHSA-f38q-mgvj-vph7](https://github.com/advisories/GHSA-f38q-mgvj-vph7) `<=7.6.2` |
| `proxy-agent` | high | `pac-proxy-agent` |
| `purgecss` | moderate | `postcss` |
| `tailwindcss` | moderate | `@fullhuman/postcss-purgecss`; `autoprefixer`; `postcss`; `postcss-functions`; `postcss-js`; `postcss-nested` |
| `uuid` | moderate | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) `<11.1.1` |

### Direct dependency inventory

Snapshot from `npm outdated --json` and registry metadata before changes. “Wanted” respects the declared range, so exact pins intentionally show the installed version. Latest major versions are discovery only. Retained direct versions are unchanged. Declared engines/peers were archived for all 53 candidates; release review and behavior validation apply to the selected transitives above, not every unselected direct upgrade.

| Direct dependency | Declared | Installed | Wanted | Latest | Use / decision |
| --- | --- | --- | --- | --- | --- |
| `@ctrl/react-adsense` | `^1.1.3` | 1.3.1 | 1.8.0 | 2.1.0 | Application runtime; retain direct version |
| `@fullhuman/postcss-purgecss` | `^2.1.0` | 2.3.0 | 2.3.0 | 8.0.0 | Build/scripts/hooks; retain direct version |
| `@next/bundle-analyzer` | `16.3.6` | 16.3.6 | 16.3.6 | 16.3.8 | Build/scripts/hooks; retain direct version |
| `@sentry/browser` | `^5.15.0` | 5.30.0 | 5.30.0 | 11.4.0 | Browser error reporting; major migration deferred |
| `@svgr/webpack` | `^5.2.0` | 5.5.0 | 5.5.0 | 8.1.0 | No consumers; removed |
| `@types/classnames` | `^2.2.10` | 2.3.1 | 2.3.0 | 2.3.0 | Type checking; retain |
| `@types/gsheets` | `^2.0.0` | 2.0.0 | 2.0.2 | 2.0.2 | No consumers; removed |
| `@types/node` | `24.13.6` | 24.13.6 | 24.13.6 | 26.6.4 | Type checking; retain |
| `@types/react` | `18.3.31` | 18.3.31 | 18.3.31 | 19.3.0 | Type checking; retain |
| `@types/react-copy-to-clipboard` | `^4.3.0` | 4.3.0 | 4.3.0 | 5.0.7 | Type checking; retain |
| `@types/react-dom` | `18.3.7` | 18.3.7 | 18.3.7 | 19.3.0 | Type checking; retain |
| `@types/react-modal` | `^3.10.5` | 3.12.0 | 3.16.3 | 3.16.3 | Type checking; retain |
| `@types/react-tabs` | `^2.3.1` | 2.3.2 | 2.3.4 | 5.0.4 | Type checking; retain |
| `@types/zipcelx` | `^1.5.0` | 1.5.0 | 1.5.2 | 1.5.2 | Type checking; retain |
| `@typescript-eslint/eslint-plugin` | `8.70.1` | 8.70.1 | 8.70.1 | 8.71.0 | Build/scripts/hooks; retain direct version |
| `@typescript-eslint/parser` | `8.70.1` | 8.70.1 | 8.70.1 | 8.71.0 | Build/scripts/hooks; retain direct version |
| `autoprefixer` | `^9.7.4` | 9.8.6 | 9.8.8 | 10.6.1 | Build/scripts/hooks; retain direct version |
| `classnames` | `^2.2.6` | 2.3.1 | 2.5.1 | 2.5.1 | Application runtime; retain direct version |
| `dotenv` | `^8.2.0` | 8.2.0 | 8.6.0 | 18.0.5 | Build/scripts/hooks; retain direct version |
| `eslint` | `9.39.5` | 9.39.5 | 9.39.5 | 10.12.0 | Build/scripts/hooks; retain direct version |
| `eslint-config-prettier` | `10.1.8` | 10.1.8 | 10.1.8 | 10.1.8 | Build/scripts/hooks; retain direct version |
| `eslint-import-resolver-typescript` | `^2.0.0` | 2.4.0 | 2.7.1 | 4.4.5 | No active flat-config consumer; separate cleanup candidate |
| `eslint-plugin-jsx-a11y` | `6.10.2` | 6.10.2 | 6.10.2 | 6.10.2 | Build/scripts/hooks; retain direct version |
| `eslint-plugin-prettier` | `^3.1.2` | 3.4.0 | 3.4.1 | 5.5.6 | Build/scripts/hooks; retain direct version |
| `eslint-plugin-react` | `7.37.5` | 7.37.5 | 7.37.5 | 7.37.5 | Build/scripts/hooks; retain direct version |
| `firebase` | `^7.15.5` | 7.24.0 | 7.24.0 | 12.19.0 | Browser and Node Firestore; major migration deferred |
| `gsheets` | `^1.2.3` | 1.2.3 | 1.2.3 | 3.0.1 | No consumers; removed |
| `husky` | `^4.2.3` | 4.3.8 | 4.3.8 | 9.1.7 | Build/scripts/hooks; retain direct version |
| `knuth-shuffle` | `^1.0.8` | 1.0.8 | 1.0.8 | 1.0.8 | Application runtime; retain direct version |
| `lint-staged` | `^10.1.2` | 10.5.4 | 10.5.4 | 17.6.0 | Build/scripts/hooks; retain direct version |
| `lucide-react` | `^1.48.0` | 1.48.0 | 1.52.0 | 1.52.0 | No current imports; retained for approved icon migration |
| `next` | `16.3.6` | 16.3.6 | 16.3.6 | 16.3.8 | Framework/runtime/build; fixed scope boundary |
| `next-translate` | `3.0.0` | 3.0.0 | 3.0.0 | 3.2.0 | Framework/runtime/build; fixed scope boundary |
| `next-translate-plugin` | `3.0.0` | 3.0.0 | 3.0.0 | 3.2.0 | Framework/runtime/build; fixed scope boundary |
| `pdf-parse` | `^1.1.1` | 1.1.1 | 1.1.4 | 2.4.5 | Offline card generator; retain |
| `postcss-import` | `^12.0.1` | 12.0.1 | 12.0.1 | 17.0.0 | Build/scripts/hooks; retain direct version |
| `prettier` | `^1.19.1` | 1.19.1 | 1.19.1 | 3.9.9 | Build/scripts/hooks; retain direct version |
| `react` | `18.3.1` | 18.3.1 | 18.3.1 | 19.3.0 | Framework/runtime/build; fixed scope boundary |
| `react-copy-to-clipboard` | `5.1.1` | 5.1.1 | 5.1.1 | 5.1.1 | Application runtime; retain direct version |
| `react-dom` | `18.3.1` | 18.3.1 | 18.3.1 | 19.3.0 | Framework/runtime/build; fixed scope boundary |
| `react-icons` | `^3.9.0` | 3.11.0 | 3.11.0 | 5.7.0 | Application runtime; retain direct version |
| `react-modal` | `3.16.3` | 3.16.3 | 3.16.3 | 3.16.3 | Application runtime; retain direct version |
| `react-tabs` | `4.2.1` | 4.2.1 | 4.2.1 | 6.1.1 | Application runtime; retain direct version |
| `react-toastify` | `^5.5.0` | 5.5.0 | 5.5.0 | 11.1.0 | Application runtime; retain direct version |
| `simple-icons` | `^16.33.0` | 16.33.0 | 16.34.0 | 16.34.0 | No current imports; retained for approved icon migration |
| `swr` | `1.3.0` | 1.3.0 | 1.3.0 | 2.5.1 | Application runtime; retain direct version |
| `tailwindcss` | `^1.4.6` | 1.9.6 | 1.9.6 | 4.3.3 | Build/scripts/hooks; retain direct version |
| `ts-node` | `^8.8.2` | 8.10.2 | 8.10.2 | 10.9.2 | Build/scripts/hooks; retain direct version |
| `typescript` | `5.9.3` | 5.9.3 | 5.9.3 | 7.0.2 | Build/scripts/hooks; retain direct version |
| `zipcelx` | `^1.6.2` | 1.6.2 | 1.6.2 | 1.6.2 | Application runtime; retain direct version |
| `@playwright/test` | `1.63.0` | 1.63.0 | 1.63.0 | 1.63.0 | Isolated browser QA; retain direct version |
| `firebase-tools` | `15.31.0` | 15.31.0 | 15.31.0 | 15.32.1 | Isolated browser QA; retain direct version |
| `webpack` | `5.111.1` | 5.111.1 | 5.111.1 | 5.111.1 | Framework/runtime/build; fixed scope boundary |

## Reproduction and validation

The baseline lockfile SHA-256 is `d0f6c7d7251b36ced631126d252bf122eb17a9c3971823a3047c00429e51fc32`. Capture `npm ci`, `npm outdated --json`, `npm audit --json`, `npm ls --all --json`, and `npm explain` before mutation. Exit 1 from outdated/audit denotes findings; the baseline and final complete trees exit 0. The update was produced with:

```sh
npm uninstall @svgr/webpack gsheets @types/gsheets
npm update protobufjs websocket-driver
npm update @babel/runtime jszip diff micromatch picomatch brace-expansion semver-regex yaml
```

These commands reproduce the selection policy against the registry, not an immutable future resolution. Use the committed lockfile and `npm ci` for exact reproduction. No forced audit fix or lockfile reset was used. `git diff --histogram -- package-lock.json` presents the removal-heavy diff more clearly than Git's default matching.

Local checks on the final dependency set: `npm ci`, `npm ls --all`, `npm run lint:check`, `ANALYZE_BUNDLE=1 npm run build`, `npm run validate-analytics`, `npm run validate-tickets`, and `git diff --check`. Local logs are retained in the canonical ticket evidence. Browser/CI acceptance is recorded in the PR and task record. Production is not part of this delivery.

## Bundle comparison

Both regular builds use this same checkout, private environment, Node/npm, Next/Webpack, analyzer setting and application source. For each route, deduplicate `_app` plus route JS from `.next/build-manifest.json`; sum raw bytes and deterministic gzip bytes per file. This measures required first-party JS, excluding maps, inline data, third-party requests, and asynchronously loaded chunks. It is not a network-speed measurement.

| Route | Before gzip bytes | After gzip bytes | Difference |
| --- | ---: | ---: | ---: |
| `/` | 233,957 | 233,967 | +10 |
| `/room/[roomId]` | 235,272 | 235,282 | +10 |
| `/room/[roomId]/[playerId]` | 272,432 | 272,442 | +10 |
| `/room/[roomId]/admin` | 240,347 | 240,357 | +10 |

The shared app chunk changes by 45 raw bytes and 10 gzip bytes after the Babel runtime update. Removing unused packages does not reduce public JS. Firebase browser code stays unchanged; no Firestore lazy-loading savings are attributed to this ticket. The asynchronous export chunk shrinks from 127,321 to 125,894 raw bytes, while analyzer gzip grows from 36,628 to 37,138 bytes, +510 bytes or 1.4%. This is the cost of the updated JSZip distribution and its fixes; it is fetched only when export is activated. No initial-load savings are claimed.

The final local `ui-tests:build` succeeds. `ui-tests:ci` cannot start while another worktree owns port 3187 and the emulator ports. Its services are preserved. The PR CI runs the isolated full suite on its own runner; that result is required before handoff.

A local integration check invokes the installed `zipcelx` with only the download sink replaced, reads the resulting Blob as a ZIP, and verifies workbook/relationship entries plus a numeric cell and escaped accented text. It passes with JSZip 3.10.2. This checks archive content independently of the browser suite's download and duplicate-download assertions.
