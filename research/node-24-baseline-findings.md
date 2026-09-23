# Node 24 migration: part one findings

Date: 2026-09-23

The baseline and compatibility investigation is complete. Proceed with the scoped implementation in part two. The probes support a localized migration within the existing translation library; they do not establish full application compatibility. Production rollback eligibility remains unverified and blocks release, not local implementation.

## Baseline and isolation

- Application baseline: `002046108df164389ea8b446de495c7913c500fe`, version 1.23.1.
- Investigation branch: `investigate/node24-baseline`.
- Checkout: `/Users/durancristhian/Repos/coronabingo-node24-investigation`.
- Initial shell: Node 12.22.12 / npm 6.14.16. The original lockfile is version 2.
- Main checkout advanced independently to `9da2c4b`, committing the existing research and editor settings during this investigation. That commit contains no application changes. Its work was preserved.
- Application dependency/configuration experiments exist only in the investigation checkout. They are incomplete, are not a release candidate, and must not be merged as-is. Its `node_modules` contains the candidate dependencies.
- No remote branch was pushed, no deployment was created, and no GitHub or Vercel settings were changed. No Firebase credentials were copied into the probe and no gameplay records were created.

The main checkout contains this report, the updated plan, and copies of the small probe sources and evidence. Those research files do not change application behavior.

## Current public behavior

The production homepage rendered in Spanish at `/`. Changing the selector to English navigated to `/en`, rendered the English introduction and create-room form, and survived refresh. Returning to Spanish navigated to `/es` and survived refresh. The signed-out `/admin` page rendered its email/password login form. No login was submitted.

Read-only HTTP checks returned 200 for `/`, `/es`, `/en`, `/admin`, `/es/admin`, `/en/admin`, and unprefixed/Spanish/English versions of `/room/node24-baseline-missing`. The room identifier was an intentionally nonexistent fixture. HTTP 200 proves route delivery, not that a room exists or gameplay works.

Screenshots and DOM captures are in [node24-evidence](node24-evidence/), including [Spanish homepage](node24-evidence/production-es.jpg), [English homepage](node24-evidence/production-en.jpg), and [signed-out admin](node24-evidence/production-admin.jpg). The Spanish screenshot was visually inspected.

## Runtime and dependency decisions

Use Node **24.21.0** and its bundled npm **11.19.0**. Node's release index identifies this as the current Node 24 LTS patch at the time of investigation. An initial probe used the already-installed Node 24.17.0/npm 12.0.1; npm 12 blocked uncovered lifecycle scripts, so that result is not the clean-install acceptance reference.

The following exact versions were installed in the candidate:

| Dependency | Candidate | Reason |
| --- | --- | --- |
| Next | 16.3.6 | Current patched 16.x framework; Webpack 4 fails on Node 24 |
| React / React DOM | 18.3.1 | Agreed Pages Router target |
| TypeScript | 5.9.3 | Next 16 requires at least 5.1 |
| `@types/node` | 24.13.6 | Node 24 APIs |
| `@types/react` / `@types/react-dom` | 18.3.31 / 18.3.7 | Matching React 18 types |
| `next-translate` / `next-translate-plugin` | 3.2.0 / 3.2.0 | Old page generator emits syntax rejected by Next 16 |
| Webpack | 5.111.1 | Current major-5 resolution for direct loader/Packtracker peer requirements |
| `react-copy-to-clipboard` | 5.1.1 | Installed 5.0.3 excludes React 18 |
| `react-markdown` | 6.0.3 | Installed 4.3.1 excludes React 18; this smaller major upgrade accepts it |
| `react-markdown-editor-lite` | 1.4.2 | Installed 1.2.4 requires React 16 |
| `react-modal` | 3.16.3 | Installed 3.13.1 excludes React 18 |
| `react-tabs` | 4.2.1 | First compatible major after installed 3.2.2 |
| SWR | 1.3.0 | Installed 0.1.18 requires React 16 |

`renature` 0.4.1 and the publisher's latest 0.11.1 both require React 16. The strict-install probe removes that dependency, while the application still imports it in `components/Pelotita.tsx`. This deliberately incomplete state proves dependency resolution, not runtime compatibility. Part two must replace that one friction animation locally and verify its movement, color, opacity and scale behavior. Do not suppress its peer conflict permanently.

The original lockfile installed successfully with Node 24.21.0/npm 11.19.0. After the listed peer adjustments and the diagnostic removal of `renature`, ordinary `npm install`, a subsequent clean `npm ci`, and `npm ls --depth=0` also passed. Neither of those final install commands used `--force` or `--legacy-peer-deps`.

An earlier diagnostic candidate install used `--legacy-peer-deps` to expose compiler failures before resolving peers. Its success is not acceptance evidence. The exact strict candidate manifest and lockfile are saved as [candidate-package.json](node24-evidence/candidate-package.json) and [candidate-package-lock.json](node24-evidence/candidate-package-lock.json). They include experimental, obsolete configuration dependencies and are inputs to part two, not the intended final dependency list.

## Confirmed blockers and bounded fixes

| Probe | Observed result | Treatment for part two |
| --- | --- | --- |
| Unchanged Next 9 build on Node 24 | `ERR_OSSL_EVP_UNSUPPORTED` in Next's Webpack 4 `createHash` | Use Next 16 with explicit `--webpack`; no OpenSSL legacy flag |
| TypeScript 5 with existing `ts-node` invocation | Locale validator fails resolving the `~` import after Node reparses emitted code as ESM | Keep `ts-node` 8.10.2 initially; configure script compilation as CommonJS with Node module resolution |
| Existing translation generator with Next 16 dev | HTTP 500, `export *` in generated `pages/index.js` is disallowed | Move tracked `pages_/` into `pages/`, remove generation prefix, configure modern plugin |
| Next 16 build configuration | Unrecognized `future`, `analyzeBrowser`, `analyzeServer`, `bundleAnalyzerConfig`, `serverRuntimeConfig` | Remove obsolete keys; use built-in source maps and `@next/bundle-analyzer` 16.3.6 when analysis is enabled |
| TypeScript 5 / React 18 application check | Eleven diagnostics across eight source files plus the generated `_app` duplicate | Local type/API edits described below; retain type checking |
| ESLint with TypeScript 5 | Parser crashes on `scripts/generate-tickets.ts`; 105 further errors are formatting in generated pages | Upgrade the parser/lint compatibility set; do not reformat generated files |
| Existing image loaders under Webpack 5 | Imported PNG still fails with `ERR_OSSL_EVP_UNSUPPORTED` in `loader-utils` through `file-loader` | Native Webpack assets passed the focused replacement probe |
| Modern translations with original dictionaries | `count: 2` renders `Va a jugar 2 persona` | Convert four singular/plural key pairs to `_one` / `_other` in both locales |

Type edits are concentrated in `components/OptionTab.tsx` and `components/RoundedButton.tsx` for icon component types; `interfaces/custom/ErrorInfo.ts` for nullable React fields; `_app.tsx` for the removed/optional parent error handler; catch variables in the event page, ticket generator and Telegram utility; and the legacy Promise polyfill's deletion of a required property. The generated `_app.tsx` duplicate goes away with the page-directory migration.

Tooling versions selected from publisher metadata, not yet installed or validated together: ESLint 9.39.5, `@typescript-eslint/parser` and plugin 8.70.1, `eslint-plugin-react` 7.37.5, `eslint-plugin-jsx-a11y` 6.10.2, and `eslint-config-prettier` 10.1.8. Reproduce the old intended rules with compatible configuration. Keep Prettier 1.19.1 and avoid adopting new rule sets across the application. Parser/rule configuration and any resolver peer changes still need a focused validation in part two/three.

## Translation and asset proof

The source under [node24-probe.tar.gz](node24-probe.tar.gz) is a small diagnostic app, not Coronabingo. It uses the candidate packages, actual locale dictionaries and CSS, a class-based `_app`, a homepage, and a dynamic room route. It does not initialize Firebase.

Modern `next-translate` 3.2.0 with its plugin compiled under Next 16/Webpack, produced a production build, and served Spanish and English. Direct `/es/room/node24-probe?check=shared` worked. Language switching preserved the room ID and query string. Next's default-locale switch returns to `/room/...` rather than `/es/room/...`; direct prefixed links still work. Preserve the existing explicit Spanish prefix when generating shared links and decide the selector's URL formatting deliberately.

The plural correction affects `people` in `roomId.json` and `ticket` in `common.json`, in both locales. It changes key names only. Spanish then rendered `Va a jugar 1 persona` and `Van a jugar 2 personas`; English rendered its existing singular and plural strings correctly. Inspect plural ticket rendering again in the real app.

Modern integration also requires replacing `next-translate/Router` and `clientSideLang` consumers with Next router locale APIs; updating `_app` locale detection and `Header`; updating locale-validation config keys; and removing obsolete ambient declarations. `react-markdown` 6 requires the current `source` prop to become children in `NewsModal`. These are scoped compatibility edits, not a new translation architecture.

The existing PostCSS/Tailwind/PurgeCSS packages compiled the real CSS in the fixture, including a production build. This supports retaining their versions. It does not prove full styling parity: the fixture has a different source path, and the real PurgeCSS content glob must change from `pages_` to `pages`.

The final fixture uses native Webpack `asset` for PNG/SVG/MP3 and `asset/source` for Markdown, with `images.disableStaticImages` and built-in production browser source maps. Its production build passed. The browser loaded the PNG at its natural width of 500 and the MP3 with `readyState: 4` and no media error; Markdown appeared as the imported text. SVG and actual gameplay audio/animation still require real-app acceptance. Native assets preserve string-valued imports, but emitted filenames change and must not be treated as permanent shared URLs.

## Required checks exercised

| Check | Result and limit |
| --- | --- |
| Original `tsc --noEmit` after Node 24 install | Passed with original TypeScript 3.9.9 |
| Candidate application `tsc --noEmit` | Failed with recorded localized diagnostics; not fixed in this stage |
| Candidate locale validation | Passed with `TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS","moduleResolution":"node"}'` |
| Candidate ticket validation | Exit 0 and output `There are no tickets with 10 or more`; no assertion failure appeared |
| Existing non-fixing ESLint command | Failed, including the parser crash described above |
| Candidate clean install and dependency tree | Passed, with `renature` deliberately absent |
| Focused translation/CSS production build | Passed |
| Focused native assets production build/start/browser | Passed |
| Full migrated application build/start/browser | Not passed; application compatibility edits belong to part two |
| Packtracker upload / real CI / Vercel preview | Not run; requires later stages |

Cypress remains 4.12.1. Installation did not require upgrading it and the CLI found a 4.12.1 binary. Its first verification failed because the inherited agent environment set `ELECTRON_RUN_AS_NODE=1`. Running `env -u ELECTRON_RUN_AS_NODE cypress verify` passed on this Mac. The deferred test suite was not run or restored, and Linux CI runner compatibility was not tested. npm 11 emitted lifecycle-script policy warnings; npm 12 has different behavior, which is another reason to document the npm version.

## Environment and services

Only environment variable names were inventoried. The existing local `.env` provides `API_KEY`, `AUTH_DOMAIN`, `DATABASE_URL`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, and `MEASUREMENT_ID`.

Other source/CI inputs are `GA_TRACKING_ID`, `SENTRY_DSN`, `URL`, `NEXT_PUBLIC_TELEGRAM_BOTID`, `NEXT_PUBLIC_TELEGRAM_CHATID`, `PT_PROJECT_TOKEN`, `GITHUB_EVENT_PATH`, `GITHUB_SHA`, `ANALYZE_BUNDLE`, and the deferred `CYPRESS_PROJECT_KEY`. `NODE_ENV` is framework-controlled.

The real app uses Firebase Auth, Firestore, Storage and Analytics; optional Google Analytics, Sentry and Telegram integrations; and the CI-only Packtracker upload. Host/player, authentication, event/admin and spreadsheet verification still need the agreed accounts and test-data arrangement. A preview must not be assumed to use a nonproduction Firebase project.

## Production and rollback

Read-only Vercel API and dashboard checks still identify:

- Project `coronabingo`, team `cristhian-durans-projects-3ace6550`, current Hobby plan.
- Project Node `12.x`, production branch `master`, build command `npm run build`.
- Production deployment `dpl_94TcP2sYDzaNgEVnJdhvbQCSeW2H`, READY, created 2021-05-07.
- Deployment URL `coronabingo-5jgmwxc02-cduran.vercel.app`, serving `coronabingo.com.ar`, with baseline commit `0020461`.

The dashboard explicitly says Node 12 is discontinued and must be upgraded to create builds. Rebuilding the old source on Node 12 is not a rollback strategy.

The current deployment's menu shows Instant Rollback and Promote disabled. The GET deployment response does not expose a usable eligibility decision. This does not establish that the artifact would be ineligible after a future cutover, but neither does READY establish restorability. Vercel documents Hobby rollback to the immediately previous production deployment; account-specific restoration of this legacy artifact remains unproven.

Before release, obtain provider confirmation or otherwise establish an executable restoration path for this exact deployment. Do not trigger a production change just to test that question during the investigation. Retain this deployment and recheck eligibility at cutover. If eligibility cannot be established, revise the release plan before merging anything that triggers production.

## Estimate and next slice

Retain the overall 4–7 engineering-day budget. Roughly 30–50 engineering hours remain, plus any wait to resolve rollback eligibility or test access. The probes reduce translation and CSS uncertainty, but a full build, animation replacement, compatible lint configuration, gameplay acceptance and actual CI remain. There is no evidence yet requiring a substantial rewrite.

Part two should start with runtime/framework configuration and a clean strict lockfile, then migrate translation and its plural keys, apply the localized types/React changes, and replace the single animation. Keep the native-loader choice bounded to demonstrated asset failures. Do not carry the diagnostic peer bypass, missing `renature` implementation, or probe app into the shipping application.

## Evidence and sources

[Evidence index and reproduction notes](node24-evidence/README.md) map logs to commands and distinguish passes, expected failures, and one discarded probe run.

- [Node release index](https://nodejs.org/dist/index.json), checked 2026-09-23.
- [Next 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), also read from the installed version's bundled docs.
- [Next 16.3.6 publisher metadata](https://registry.npmjs.org/next/16.3.6).
- [next-translate documentation](https://github.com/aralroca/next-translate), also read from installed 3.2.0, including plural conventions.
- [Vercel instant rollback eligibility](https://vercel.com/docs/instant-rollback).
- [Vercel rollback procedure and plan restrictions](https://vercel.com/docs/deployments/rollback-production-deployment).

Other version/peer decisions are preserved in the registry JSON snapshots in the evidence folder. Recheck current patches when implementing if the work resumes later.
