# Node 24 migration: GitHub Actions

Date: 2026-09-23. Branch: `migrate/node24-ci`, based on `6905b4d`. Worktree: `/Users/durancristhian/Repos/coronabingo-node24-ci`.

Status: complete. Workflow commit `7c7222c` exposed the Packtracker failure in hosted CI. Replacement commit `47918fc` passed the full GitHub Actions run, including upload of three verified bundle reports. Both commits are pushed to `migrate/node24-ci`.

## Changes

- Checkout 7.0.1, setup-node 7.0.0, cache 6.1.0, and upload-artifact 7.0.1, verified against their publisher releases on this date.
- Select the application runtime from `.nvmrc`, currently Node 24.21.0 with bundled npm 11.19.0. Log both versions in CI.
- Checkout before hashing files. Cache npm downloads by the root lockfile; cache Next build output by OS, runtime/lockfile hash, and commit, with a compatible restore prefix.
- Run `npm ci`, then `npm run lint:check`, then `npm run build` with `ANALYZE_BUNDLE=1`. The lint check includes type generation and TypeScript. The existing prebuild script validates locales. Upload `.next/analyze/*.html` as `bundle-reports`, retained for 14 days; missing reports fail the job.
- Remove the Packtracker plugin/configuration and its workflow token mapping. Keep the push trigger, application environment mappings, and read-only repository permissions. Leave Cypress disabled. No account secrets were changed or deleted.

## Local verification

The first local pass and commit hook used the new worktree shell's default Node 24.17.0/npm 12.0.1. Reviewing the install log exposed that mismatch after the workflow commit. The entire clean install, checks, production build, HTTP checks, and browser smoke checks were then repeated successfully with `/Users/durancristhian/.nvm/versions/node/v24.21.0/bin` explicitly prepended to PATH. The table below describes that final Node 24.21.0/npm 11.19.0 pass. The original checkout's development server was left running.

| Check | Result |
| --- | --- |
| `actionlint` 1.7.12 | Pass; downloaded publisher archive checksum verified |
| Clean `npm ci` | Pass; package-lock unchanged |
| `npm ls --depth=0` | Pass |
| `npm run lint:check` | Pass before the first build |
| `npm run validate-tickets` | Pass; success message inspected |
| `npm run build` | Pass, including prebuild locale validation |
| `npm run start -- --port 3126` | Pass |
| HTTP checks | Eleven home/admin/room/player/event routes returned 200, Next HTML, and the expected document language |
| Local production-build browser | Spanish/English home, client locale switching including memoized News heading, English refresh, tutorial dialog/player load and close, missing-room error translation and refresh, and signed-out admin form passed |
| Shared URL | `/es/room/node24-ci-missing?proof=ci#details` switched to `/en/room/node24-ci-missing?proof=ci#details` and refreshed successfully |
| Browser errors and appearance | No console errors observed on home/tutorial/missing-room checks; Spanish production screenshot visually reviewed |

The private environment file was copied with mode `0600`. No secrets are included here. No room creation, player registration, login submission, or other application data writes were performed. HTTP success proves route delivery, not live gameplay. Full gameplay/authenticated acceptance remains in the preview phase.

The install retains legacy dependency vulnerabilities and lifecycle-policy warnings. Cypress installation and suite restoration are outside this step. Packtracker and its unused transitive packages were removed; no remaining package's resolved version changed. Application components and behavior are unchanged.

After replacing Packtracker, `actionlint`, another clean `npm ci`, `lint:check`, and `ANALYZE_BUNDLE=1 npm run build` passed under the pinned runtime. All three generated reports (`client.html`, `nodejs.html`, `edge.html`) contain HTML and chart data. The rebuilt production app passed Spanish/English home switching, tutorial opening, and signed-out admin form checks, with no observed console errors. The replacement commit was made only after these checks.

## Hosted verification

- [Successful run 35893873513](https://github.com/durancristhian/coronabingo/actions/runs/35893873513) verified commit `47918fc74a92208984f4178e85fc28833f993f8b` on Ubuntu. Logs confirm Node 24.21.0/npm 11.19.0. Clean install, typecheck/lint, locale validation/build, report upload, and both cache saves passed.
- [Bundle reports artifact](https://github.com/durancristhian/coronabingo/actions/runs/35893873513/artifacts/10766052869), 318,710 bytes, was downloaded and inspected. `client.html` (446,304 bytes), `nodejs.html` (414,806 bytes), and `edge.html` (274,799 bytes) all contain HTML and chart data. Local copies are at `/tmp/coronabingo-node24-ci-hosted-reports`. The artifact expires after 14 days.
- [GitHub Actions run 35892973633](https://github.com/durancristhian/coronabingo/actions/runs/35892973633) runs workflow commit `7c7222c7dfdc1ef6b44977f9cbd9195c18049b1d` on `migrate/node24-ci`.
- The log confirms Node 24.21.0/npm 11.19.0, successful `npm ci`, and successful `lint:check`. Packtracker initialized and reached its upload, then failed with `getaddrinfo ENOTFOUND api.packtracker.io`. An independent local DNS lookup returned `ENOTFOUND` too. This is not evidence of a bad project token or a confirmed permanent service shutdown.
- Packtracker's bundled analyzer also reported parse errors for two modern JavaScript bundles. The replacement uses the already-installed `@next/bundle-analyzer` 16.3.6. HTML artifacts preserve per-build bundle inspection, but do not replace Packtracker's hosted history, PR comparisons, or configured asset budgets. No successful Packtracker upload is claimed.
- The branch push also triggered an automatic Vercel preview. Its GitHub status reports successful deployment. This is deployment status only, not preview runtime or gameplay acceptance.
- Remote `master`, the GitHub default branch, and provider production settings were not changed.

## Publisher references

- [Checkout 7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
- [setup-node 7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0)
- [cache 6.1.0](https://github.com/actions/cache/releases/tag/v6.1.0)
- [upload-artifact 7.0.1](https://github.com/actions/upload-artifact/releases/tag/v7.0.1)
- [setup-node runtime files and npm caching](https://github.com/actions/setup-node)
- Installed Next 16.3.6 documentation: `node_modules/next/dist/docs/01-app/02-guides/ci-build-caching.md` and `01-app/01-getting-started/17-deploying.md`.
