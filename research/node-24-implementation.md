# Node 24 migration: part two

Date: 2026-09-23. Status: local implementation and clean-install verification complete on `migrate/node24`, based on `master` commit `9da2c4b`. Application commit: `c93bc83`. The original checkout and investigation checkout retain their work; application changes are in `/Users/durancristhian/Repos/coronabingo-node24`.

## Implemented

- Node 24.21.0 / npm 11.19.0, Next 16.3.6, React/React DOM 18.3.1, TypeScript 5.9.3 and matching types. Pages Router and Webpack remain in use. No peer bypass, OpenSSL legacy flag or disabled type checking is required.
- Tracked `pages_` moved to `pages`; generation commands and obsolete translation declarations removed. Next locale routing replaces `pushI18n`/`replaceI18n`. Spanish and English shared links still resolve. Next generates unprefixed default-Spanish navigation; generated spreadsheet/share links retain explicit `/es` or `/en` prefixes. Query parameters and fragments survive language switching.
- Translation configuration and plural keys migrated. Ticket labels explicitly request the singular count. The Markdown renderer uses its current children API. React icon props, caught errors, script compiler settings and obsolete `App.componentDidCatch` chaining were adjusted locally.
- Obsolete asset loaders replaced with Webpack asset modules, preserving string image imports and Markdown source imports. Native source maps and the Next bundle analyzer replace the `@zeit` wrappers. Existing CSS dependencies and application styling remain.
- `Pelotita` uses Web Animations with the original endpoints, colors, rotation and scale. The duration is `2 / (0.2 * 9.80665)` seconds and the easing approximates the quadratic constant-deceleration curve from renature 0.4.1. This follows the old physical parameters without retaining its React 16 dependency; it is not a byte-identical frame simulation. Animations cancel on cleanup and the final style remains when Web Animations is unavailable.
- ESLint/parser/plugins now run on TypeScript 5. The flat configuration preserves the old enabled rules rather than adopting new recommended rules. Removed rules were mapped, the obsolete camelcase suppression removed, and three shuffle imports typed. One hoisted component declaration was reordered for the newer rule implementation.
- `typecheck` generates Next route types before checking. Generated `next-env.d.ts` is ignored as instructed by the installed Next docs. The actual Husky pre-commit hook passed locale validation, types and lint-staged during the application commit. Next-generated agent instructions are retained.

Exact direct dependency changes are in [the dependency delta](node24-implementation-evidence/direct-dependency-changes.json). Firebase, styling, Prettier, Cypress and unrelated direct dependencies retain their previous resolved versions.

## Translation regression found in the full app

The part-one fixture did not exercise memoized content. In the full app, next-translate 3.2.0 left the memoized News heading in its previous language after a client-side locale switch. Its `appWithI18n` assigns `globalThis.__NEXT_TRANSLATE__`; `useTranslation` then selects its non-context path. The same assignment exists in 3.1.0–3.1.3. This also conflicts with nested dynamic namespace providers.

The final runtime and plugin are both pinned to **3.0.0**. Its Pages Router integration retains React context, so memoized text and DynamicNamespaces update correctly. Mixing runtime 3.0.0 with plugin 3.2.0 failed because the latter requires an unexported `next-translate/package.json` subpath. Plugin 3.0.0 also requires explicit Next `i18n` configuration when a custom `_app` exists; `next.config.js` now reads those values from the same `i18n.json` source.

The retest covers the real home/News component and a local dynamic-namespace news modal. Revisit these pins only with both regressions covered.

## Verification

A fresh local clone of `c93bc83` at `/tmp/coronabingo-node24-clean-20260923` started without `node_modules`, `.next` or `next-env.d.ts`. The existing private `.env` was copied with its `0600` permissions for build/runtime verification. Its values are not included in evidence.

| Check | Result |
| --- | --- |
| Plain `npm ci` with Node 24.21.0/npm 11.19.0 | Pass; lockfile unchanged; no peer override |
| `npm ls --depth=0` | Pass |
| `npm run lint:check` before any build in clean clone | Pass, including generated types and `tsc --noEmit` |
| `npm run validate-tickets` | Pass; inspected success text, not just exit code |
| `npm run build` in implementation checkout | Pass; `prebuild` validates all locales |
| `ANALYZE_BUNDLE=1 npm run build` in clean clone | Pass; client, nodejs and edge analyzer reports generated |
| `npm run dev -- --port 3124` | App renders in both languages |
| `npm run start -- --port 3125` | Both implementation and clean-clone builds serve successfully |
| Production browser | Spanish/English home, direct refresh, locale switching, tutorial modal/player load, missing-room routing and translated error view pass; no console errors observed on home/room screens |
| Production HTTP routes | Ten home, room, player, admin and event URL patterns return HTML with the correct document language; this proves routing only |
| Component fixture | Ticket display/selection, plural labels, ball animation, image/audio import, Markdown editor/renderer, DynamicNamespaces modal and spreadsheet download pass |

Lockfile SHA-256: `078f4f3ba5eeae646afddd9c7edac035b40d818b575ffcb1dcc132104ae0dbec`.

The component fixture used only local React state and mock room/player objects. It submitted no gameplay or authentication writes. Both downloaded XLSX files were inspected as ZIP/XML and contain the expected locale-prefixed room/player links. The fixture route was removed before the final build and application commit. Its source is retained as a `.txt` artifact for repetition in a disposable checkout.

See [browser observations](node24-implementation-evidence/browser-checks.json), [route results](node24-implementation-evidence/clean-production-http.json), screenshots and command logs in [the evidence directory](node24-implementation-evidence/README.md). The production home layout was visually reviewed; this is not a complete responsive or pixel-diff acceptance run.

## Explicit exceptions and remaining work

- The user explicitly approved **temporary ESLint 9.39.5** on 2026-09-23. ESLint 9 reached end of life on 2026-08-06. Current `eslint-plugin-react` 7.37.5 and `eslint-plugin-jsx-a11y` 6.10.2 declare peers only through ESLint 9. Replacing/upgrading those plugins and moving to ESLint 10 is a separate maintenance item; no peer conflict is ignored here.
- Clean installation reports **91 vulnerabilities** (5 low, 32 moderate, 43 high, 11 critical). This migration is not a dependency-security remediation. No blanket audit fix was applied. npm 11 also prints lifecycle-policy warnings; the fresh-clone Husky hook was installed and the implementation hook executed successfully.
- Development emits legacy React lifecycle/defaultProps deprecation warnings. The original Tailwind/manual-PurgeCSS notice remains. An initial development HMR `isrManifest` warning did not prevent serving; no production counterpart was observed.
- No real room creation/join/restart, cross-session realtime gameplay, authenticated event/admin mutation, or full visual/media acceptance was claimed. Those need the agreed accounts and test-data arrangement. Component fixtures and route HTTP responses do not substitute for that evidence.
- GitHub Actions and Packtracker upload have not run. The workflow still specifies the old runtime/actions and is the next migration step. No push, deployment, branch rename or provider setting change occurred.
- Vercel preview and production acceptance remain open. The legacy production artifact's actual rollback eligibility remains an unresolved release gate from part one.
- Cypress's disabled suite remains deferred. Part one verified the existing Mac binary with `ELECTRON_RUN_AS_NODE` unset; the suite and Linux runner were not exercised here.

## Sources for compatibility decisions

- Installed Next 16.3.6 upgrade, locale-routing and TypeScript docs; [published TypeScript setup](https://nextjs.org/docs/pages/api-reference/config/typescript).
- [next-translate 3.0.0 metadata](https://registry.npmjs.org/next-translate/3.0.0) and [plugin metadata](https://registry.npmjs.org/next-translate-plugin/3.0.0); publisher tarballs compared against 3.1.x and 3.2.0.
- [renature 0.4.1 publisher package](https://registry.npmjs.org/renature/0.4.1), inspected for friction force, gravity and stopping distance.
- [ESLint version support](https://eslint.org/version-support/), [React plugin peer metadata](https://registry.npmjs.org/eslint-plugin-react/7.37.5), [accessibility plugin peer metadata](https://registry.npmjs.org/eslint-plugin-jsx-a11y/6.10.2).
