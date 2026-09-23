# Node 24 migration: GitHub Actions

Date: 2026-09-23. Branch: `migrate/node24-ci`, based on `6905b4d`. Worktree: `/Users/durancristhian/Repos/coronabingo-node24-ci`.

Status: workflow implemented and local verification passed. Hosted GitHub Actions and Packtracker upload are pending the branch push.

## Changes

- Checkout 7.0.1, setup-node 7.0.0, and cache 6.1.0, verified against their publisher releases on this date.
- Select the application runtime from `.nvmrc`, currently Node 24.21.0 with bundled npm 11.19.0. Log both versions in CI.
- Checkout before hashing files. Cache npm downloads by the root lockfile; cache Next build output by OS, runtime/lockfile hash, and commit, with a compatible restore prefix.
- Run `npm ci`, then `npm run lint:check`, then `npm run build`. The lint check includes type generation and TypeScript. The existing prebuild script validates locales. The existing build configuration enables Packtracker for GitHub push events and fails the build if upload fails.
- Keep the push trigger and existing environment mappings. Use read-only repository permissions. Leave Cypress disabled.

## Local verification before commit

All checks ran in the new worktree under Node 24.21.0/npm 11.19.0, leaving the original checkout's development server running.

| Check | Result |
| --- | --- |
| `actionlint` 1.7.12 | Pass; downloaded publisher archive checksum verified |
| Clean `npm ci` | Pass; package-lock unchanged |
| `npm run lint:check` | Pass before the first build |
| `npm run validate-tickets` | Pass; success message inspected |
| `npm run build` | Pass, including prebuild locale validation |
| `npm run start -- --port 3126` | Pass |
| HTTP checks | Eleven home/admin/room/player/event routes returned 200, Next HTML, and the expected document language |
| Production browser | Spanish/English home, client locale switching including memoized News heading, English refresh, tutorial dialog/player load and close, missing-room error translation and refresh, and signed-out admin form passed |
| Shared URL | `/es/room/node24-ci-missing?proof=ci#details` switched to `/en/room/node24-ci-missing?proof=ci#details` and refreshed successfully |
| Browser errors and appearance | No console errors observed on home/tutorial/missing-room checks; Spanish production screenshot visually reviewed |

The private environment file was copied with mode `0600`. No secrets are included here. No room creation, player registration, login submission, or other application data writes were performed. HTTP success proves route delivery, not live gameplay. Full gameplay/authenticated acceptance remains in the preview phase.

The install retains the previously reported legacy dependency vulnerabilities and lifecycle-policy warnings. Cypress installation and suite restoration are outside this step. Neither dependency versions nor application source changed.

## Publisher references

- [Checkout 7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
- [setup-node 7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0)
- [cache 6.1.0](https://github.com/actions/cache/releases/tag/v6.1.0)
- [setup-node runtime files and npm caching](https://github.com/actions/setup-node)
- Installed Next 16.3.6 documentation: `node_modules/next/dist/docs/01-app/02-guides/ci-build-caching.md` and `01-app/01-getting-started/17-deploying.md`.
