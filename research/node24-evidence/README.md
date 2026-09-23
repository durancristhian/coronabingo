# Node 24 investigation evidence

Collected 2026-09-23. See [findings](../node-24-baseline-findings.md) for decisions and proof limits. Logs intentionally include failed experiments. Nothing here establishes full application acceptance.

## Commands and results

Commands ran from the isolated checkout unless marked as a fixture command. PATH selected Node 24.21.0/npm 11.19.0 except logs 01 and 02, which used Node 24.17.0/npm 12.0.1. No OpenSSL legacy flag was used.

| Log | Command or observation | Result |
| --- | --- | --- |
| 01 | Original `npm ci --no-audit --no-fund` on npm 12 | Exit 0, but lifecycle scripts blocked; not acceptance |
| 02 | Original `npm run build` | Failed: Webpack 4 unsupported hash |
| 03 | Original `npm ci --no-audit --no-fund` on bundled npm 11 | Passed; lifecycle-policy warnings |
| 04 | `npm install --package-lock-only --no-audit --no-fund next@16.3.6 react@18.3.1 react-dom@18.3.1 typescript@5.9.3 @types/react@18.3.31 @types/react-dom@18.3.7 @types/node@24.13.6` | Failed: peer resolution |
| 05 | Original `tsc --noEmit` | Passed; empty log |
| 06 | Same core candidate via `npm install --legacy-peer-deps --no-audit --no-fund --save-exact` | Diagnostic bypass only |
| 07 | Candidate `npm run build -- --webpack` | Failed: script ESM/path-alias resolution |
| 08 | Same build with `TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS"}'` | Locale validation/generation pass, application typecheck fails |
| 09 | Candidate `tsc --noEmit` | Eleven diagnostics; generated app duplicate included |
| 10 | `npm run dev -- --webpack --hostname 127.0.0.1 --port 3124` with script compiler overrides | Starts, homepage 500 from generated `export *` |
| 11 | Install modern translation pair 3.2.0 with diagnostic peer bypass | Installed for focused fixture |
| 12 | `eslint '*/**/*.{js,ts,tsx}' --quiet` | Parser crash plus generated-page formatting errors; no `--fix` |
| 13 | Fixture `next dev --webpack --hostname 127.0.0.1 --port 3125` | Translation/plural/locale routing checks, then legacy CSS/config integration |
| 14 | `npm run validate-locales` with CommonJS/Node overrides | Passed |
| 15 | `npm run validate-tickets` with same overrides | Passed; success text inspected |
| 16 | Fixture `next build --webpack`, original CSS and legacy config | Passed, configuration warnings |
| 17 | `npm install --no-audit --no-fund` after six React peer updates, Webpack 5 and removal of `renature` | Strict resolution passed |
| 18 | Fixture build importing PNG/MP3/Markdown using legacy loaders | Failed: file-loader/loader-utils unsupported hash |
| 19 | `npm ls --depth=0` | Passed |
| 20 | First native-asset fixture build | **Discarded**: accidentally overlapped dependency reinstall, producing missing-module errors; not a compatibility finding |
| 21 | `npm ci --no-audit --no-fund` for strict candidate lockfile | Passed |
| 22 | Fixture native-asset build repeated after install completed | Passed |
| 23 | `npm ls --depth=0` after clean install | Passed |
| 24 | Fixture `next start --hostname 127.0.0.1 --port 3125` | Served production probe; browser PNG/audio/Markdown checks passed |
| 25 | `cypress verify` | Failed because inherited `ELECTRON_RUN_AS_NODE=1` makes Electron parse Cypress flags as Node flags |
| 26 | `env -u ELECTRON_RUN_AS_NODE cypress verify` | Passed binary verification on this Mac; deferred suite not run |

Registry JSON snapshots distinguish original peer conflicts, installed exact resolutions, and proposed tooling versions not yet installed. `lockfile-version-changes.json` records transitive changes made by the candidate install. `experimental-root.patch` is not a shipping patch.

`production-provider.json` omits environment values. Public production route HTTP results are separate from browser screenshots and DOM snapshots. The `modern-*-after.txt` captures came from the fixture, not the full application. `production-probe-assets.json` records DOM-backed PNG/audio loading evidence from its production build.

## Reproduce the final focused probe

Use a disposable checkout of application commit `0020461`, with this `research` directory present. Do not overwrite the normal application's manifest to run a probe.

In that disposable checkout only, copy `candidate-package.json` to the root `package.json` and `candidate-package-lock.json` to the root `package-lock.json`. Select Node 24.21.0/npm 11.19.0, then run:

```sh
npm ci --no-audit --no-fund
tar -xzf research/node24-probe.tar.gz -C research
cd research/node24-probe
../../node_modules/.bin/next build --webpack
../../node_modules/.bin/next start --hostname 127.0.0.1 --port 3125
```

Visit `/`, `/es`, `/en`, and `/es/room/node24-probe?check=shared`. Switch languages on the dynamic page and refresh. The fixture reads no service credentials and makes no gameplay writes. Its stylesheet imports are the real app files; production class coverage is not representative because the fixture's page path differs from the application content glob.

The final fixture contains corrected plural dictionaries and native asset rules. To reproduce earlier failures, consult the command table, original application configuration and captured logs; do not treat the final fixture as a byte-for-byte copy of every earlier experiment.

The investigation checkout intentionally retains experimental package/configuration edits and installed candidate modules. Main application changes must be implemented separately in part two. All probe servers were stopped at closeout.
