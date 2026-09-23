# Node 24 and main branch migration plan

Date: 2026-09-23

Status: parts one and two completed locally on 2026-09-23. See [baseline findings](node-24-baseline-findings.md) and [implementation evidence](node-24-implementation.md). Local `master` and `migrate/node24` contain application commit `c93bc83` and evidence commit `6905b4d`. Part three is complete on `migrate/node24-ci` in `../coronabingo-node24-ci`: commit `47918fc` passed hosted Node 24 CI, including bundle-report uploads replacing the failing Packtracker integration. See [CI verification](node-24-ci.md). Vercel reports a successful automatic preview, but part four preview acceptance remains open. The GitHub default branch remains `master`. Legacy production rollback eligibility remains an unresolved release gate.

## Agreed outcome

Run Coronabingo on Node 24 in local development, GitHub Actions, and Vercel production. Use Next.js 16 with React 18, Pages Router, and Webpack. Make `main` the GitHub default branch, local primary branch, and Vercel production branch.

Update dependencies only when required for installation, compilation, runtime behavior, or required checks, plus the unsupported core framework. Prefer configuration changes; permit localized compatibility edits. Preserve application behavior, data structures, design, translations, and existing shared URLs.

Restoring the disabled Cypress suite is outside this migration. Update Cypress only if its installation blocks the migration. Use focused browser verification for acceptance.

Pause and revise the scope and estimate if compatibility requires a substantial rewrite of translation, UI, or application logic. A localized API replacement, type adjustment, or mechanical page-directory migration is within scope. Replacing the translation architecture, rewriting gameplay or data access, or redesigning components is not.

## Evidence and limits

The repository inspection and read-only provider checks during this planning session found:

| Area | Current state |
| --- | --- |
| Local runtime | `.nvmrc` specifies Node 12; the inspected shell selected Node 12.22.12. |
| CI | `.github/workflows/push.yml` specifies Node 12, cache v1, checkout v2, and setup-node v1. It runs `npm ci` and build. The test step is commented out. |
| Dependencies | Next 9.5.1; React 16.14 in the lockfile; TypeScript 3.9.9 in the lockfile; direct Webpack 4 dependency. |
| Translation | `next-translate` 0.14.2 generates ignored `pages/` from tracked `pages_/` before development and build. |
| Vercel | Project `coronabingo` specifies Node 12, `npm run build`, and production branch `master`. |
| Production metadata | The inspected READY production deployment dates from 2021-05-07 and identifies commit `002046108df164389ea8b446de495c7913c500fe`, matching inspected local `master`. This is deployment metadata, not proof of current gameplay behavior. |
| Branches | GitHub default and local primary branch are `master`; no `main` exists. Eleven open Dependabot PRs target `master`. No branch rules, environment branch restrictions, or Vercel deploy hooks were found. Recheck before cutover. |

At planning time, no clean install, migration build, or browser acceptance run had been performed. Parts one and two now record baseline investigation, clean installation, full local builds and focused browser checks. End-to-end gameplay, authenticated, preview and production acceptance remain open; see the linked reports for proof boundaries.

Next 9 is outside support. Next 16 supports React 18 for this Pages Router application, requires TypeScript 5.1 or newer, and permits explicit Webpack use. Select the latest patched Next 16 release at implementation time and record exact resolved versions. React 18 compatibility does not imply that every existing React package supports it.

## Required changes and conditional work

| Area and likely files | Planned treatment |
| --- | --- |
| `.nvmrc`, `package.json`, `package-lock.json` | Select a current Node 24 LTS patch, declare `engines.node: "24.x"`, document the npm version, and generate a reproducible lockfile. Keep npm. |
| Next, React, TypeScript and types | Upgrade Next to patched 16.x, React/React DOM to compatible 18.x releases, TypeScript to a compatible supported release at least 5.1, and matching React/Node types. Check types before changing source. |
| `next.config.js`, package scripts | Use `next dev --webpack` and `next build --webpack`, retaining the translation prefix only if its existing generation remains compatible. Remove obsolete `future.webpack5`. Replace obsolete `@zeit` integrations with supported equivalents or built-in options while preserving their intended behavior. Remove the direct Webpack 4 dependency if unnecessary; otherwise resolve the actual Webpack 5 peer requirement. |
| Image, SVG, MP3, Markdown loaders and Packtracker | Exercise existing integrations under Webpack 5. Change only those that fail or are incompatible. Preserve imported image URL behavior. Packtracker's CI-only execution needs a real CI build check. |
| `i18n.json`, `pages_/`, `.gitignore`, translation declarations | First test whether the existing generator can meet acceptance. If a package migration is required, use the smallest supported upgrade path within `next-translate`; preserve locale URLs and translated content. Its modern integration can require moving source into `pages/`, changing config keys, and removing the generation command. Do not assume a replacement translation library is required. |
| Translation consumers | Likely compatibility locations include `components/Header.tsx`, `utils/getBaseUrl.ts`, `pages_/_app.tsx`, and `pushI18n`/`replaceI18n` callers. Update `scripts/validate-locales.ts` if config keys change. Remove only obsolete ambient declarations under `interfaces/external-modules/next-translate/`. |
| `postcss.config.js`, possibly CSS dependencies | Verify PostCSS/Tailwind/PurgeCSS interoperability and production styling before choosing updates. If pages move, update PurgeCSS's source path. A Tailwind redesign or automatic jump to its latest major is outside scope. |
| React component dependencies | Resolve demonstrated React 18 conflicts with the smallest compatible releases. Candidates include copy-to-clipboard, Markdown renderer/editor, modal, tabs, SWR, and renature. Peer metadata is a compatibility warning, not runtime failure evidence. |
| `components/Pelotita.tsx` | The inspected latest renature release still declares React 16 peers. Investigate this single animation integration; a small replacement may be necessary. Preserve behavior and pause if this expands into broader UI work. |
| `tsconfig.json`, script execution, lint configuration | Make only changes required by the framework, types, or Node 24. Check `ts-node` before replacing it. If the TypeScript upgrade breaks the existing parser or required hook checks, update the affected ESLint/plugin configuration together to compatible supported versions. No new rule adoption or repository-wide formatting. |
| Cypress and hook packages | Do not restore the browser suite or redesign hooks. Fix installation blockers if encountered. Preserve deferred test sources and explicitly document whether their runner remains usable. |
| `.github/workflows/push.yml` | Use Node 24 and supported Actions releases. Checkout before calculating lockfile-based cache keys. Keep CI focused on reproducible install, typecheck, locale validation, and build; do not enable Cypress. |
| `README.md` | Document Node/npm setup, environment prerequisites, actual commands, and `main` as the primary branch. |

Retain Firebase, Sentry, Prettier, utility packages, and styling tools unless a concrete migration requirement justifies changing them. Record unrelated deprecations and security findings separately. Do not use blanket dependency upgrades, `npm audit fix --force`, permanently ignored peer conflicts, disabled type checks, or an OpenSSL legacy flag as completion criteria.

## Implementation sequence

### 1. Establish a baseline and run the compatibility investigation

Completed as an investigation. [Part one findings](node-24-baseline-findings.md) select Node 24.21.0/npm 11.19.0, Next 16.3.6/React 18.3.1, and the modern `next-translate` integration. They document the peer, script-runner, type, parser, plural and asset-loader blockers, and the unresolved provider rollback proof. Part two supersedes the provisional translation version with a verified 3.0.0 runtime/plugin pair. The isolated candidate is deliberately incomplete and must not be merged as-is.

- Work on an isolated implementation branch or checkout based on the current primary branch. Preserve unrelated `.vscode/settings.json` changes and the existing `research/` material.
- Record commit, runtime, dependency versions, public route behavior, language switching, and representative screenshots. Inventory environment variable names and required services without exposing values.
- Record the current production deployment and determine whether it can actually be restored through the provider. Do not assume Node 12 source can still rebuild, or that an old deployment will remain eligible for promotion.
- In the isolated checkout, test a clean Node 24 install and candidate Next 16/React 18 dependency set. Capture concrete install, compiler, build, and browser errors.
- Classify each proposed update by its blocker or framework support requirement. Resolve exact versions and the translation approach before broad edits. Revise the estimate after roughly half a day; stop if a substantial rewrite is required.

### 2. Make runtime, framework, and compatibility changes

Completed locally; [part two evidence](node-24-implementation.md) records clean installation, full builds, required local checks and focused browser verification. Final translation runtime/plugin pins are 3.0.0 after a full-app locale-switching regression in 3.2.0. The user approved temporary ESLint 9 with a separate supported-linter follow-up.

- Update runtime declarations, framework dependencies, types, Webpack options, and the lockfile.
- Apply only proven compatibility changes from the table above. Keep application behavior and shared links intact.
- Keep changes reviewable in coherent commits, such as runtime/build setup followed by required application compatibility changes. Intermediate broken states need not be deployed or merged.
- Run focused checks as each affected area is completed; then test installation from a clean checkout with the final lockfile.

### 3. Restore the required development and CI checks

Completed on 2026-09-23. The first hosted run passed installation and lint, then failed on Packtracker's unavailable API. Packtracker also reported bundle parser errors. The replacement preserves per-build inspection through the existing Next bundle analyzer and GitHub HTML artifacts. Hosted run `35893873513` passed all steps on commit `47918fc`; all three uploaded reports were downloaded and inspected. Packtracker history/comparisons/budgets are not replaced. See [part three evidence](node-24-ci.md).

- Update the obsolete GitHub Actions and application runtime declaration.
- Run the acceptance commands below. The existing lint command uses `--fix`; use its equivalent without `--fix` for verification to avoid unrelated changes.
- Verify the actual CI build and bundle-report upload. The original Packtracker path was exercised and replaced after its demonstrated failure, as recorded above.
- Leave the Cypress CI step disabled. Record unrelated lint/test-tool maintenance separately unless it blocks required checks.

### 4. Verify a Vercel preview

- Deploy the implementation branch as a preview when implementation and preview deployment are authorized. Set `engines.node` so the candidate uses Node 24 while production remains unchanged.
- Verify the Node version in build/runtime evidence, the candidate commit, and the application's behavior. A READY status alone is insufficient.
- Determine whether preview configuration points to production Firebase before any write tests. Use an existing nonproduction project or isolated test records under an agreed test-data arrangement. A preview URL does not isolate its database.
- Complete browser acceptance and record results, defects, and any unavailable proof. Do not claim completion when critical gameplay or authentication checks remain untested.

### 5. Coordinate main and production cutover

This is a release step after the candidate passes acceptance and release is authorized.

1. Recheck GitHub default branch, rules, PR targets, Actions configuration, Vercel production branch, deployment settings, and rollback availability. Record the current production deployment identifier.
2. Coordinate the rename before the merge that should trigger production. Keep the existing deployment serving during the short configuration change.
3. Use GitHub's native branch rename from `master` to `main`, preserving history and allowing GitHub to retarget PR bases. Do not substitute deleting `master` and creating an unrelated branch.
4. Explicitly set Vercel's production branch to `main` and its project Node version to 24. Verify both settings; do not assume GitHub rename updates Vercel.
5. Update the local primary branch, upstream, and remote HEAD. For an existing local primary checkout, the normal sequence is `git branch -m master main`, `git fetch origin`, `git branch --set-upstream-to=origin/main main`, and `git remote set-head origin -a`. Adjust for the actual branch/worktree state and never force over local work.
6. Verify GitHub's default branch is `main`, open PR bases were retargeted, and any newly discovered branch restrictions are correct. The inspected workflow triggers on every push, so it currently has no `master` filter to replace.
7. Merge the verified migration into `main` through the chosen review process, and verify the resulting production deployment's commit and Node 24 runtime. Repeat production smoke checks using the agreed test-data arrangement.
8. If release verification fails, use the previously verified rollback procedure and keep the migration open. Avoid reverting to an unbuildable Node 12 source as the only rollback strategy. A runtime rollback does not require undoing the successful branch rename.

## Acceptance checklist

- [x] A clean checkout installs reproducibly with the documented Node 24/npm combination using `npm ci`.
- [x] `npm run dev` starts and renders the application under Node 24.
- [x] TypeScript passes with `tsc --noEmit`; required lint/hook checks work without broad source rewrites.
- [x] `npm run validate-locales` passes. `npm run validate-tickets` runs and its output is inspected: the current script catches assertion failures and may still exit successfully.
- [x] `npm run build` and `npm run start` succeed, with no migration-related serving or hydration errors.
- [ ] Full locale/shared-room acceptance (partial local proof complete): both Spanish and English load correctly. Direct visits, refreshes, switching languages, plural text, and existing shared-room URLs retain their behavior.
- [ ] Host and player sessions can create/join a room, receive realtime number updates, and restart a game without cross-room effects.
- [ ] Authentication and existing event/admin paths work with the agreed test accounts and data.
- [ ] Production CSS, images, SVGs, animations, audio, Markdown content, and spreadsheet downloads retain their behavior. No UI redesign is introduced.
- [x] GitHub Actions passes under Node 24, including bundle-report upload and cache saves.
- [ ] A Vercel preview verifies the candidate's Node 24 runtime and application behavior; successful deployment status alone is insufficient.
- [ ] After release, GitHub default, local primary tracking, and Vercel production branch all use `main`; PR bases are correct.
- [ ] Production runs the expected migration commit on Node 24 and passes smoke checks; rollback evidence is recorded.

No new automated test suite is required for this task. Use targeted regression checks where compatibility edits affect behavior; do not expand this into a testing-platform migration.

## Level of effort

Estimate for one engineer familiar with the project, assuming working service access and no substantial rewrite:

| Work | Engineering hours |
| --- | ---: |
| Baseline and compatibility investigation | 4 |
| Runtime, framework, build configuration, and lockfile | 8–12 |
| Translation and React compatibility edits | 8–16 |
| Required tooling checks and CI | 4–8 |
| Local/browser and preview verification | 8–12 |
| Branch/release coordination and verification | 2–4 |
| Total | 34–56 |

Budget approximately **4–7 engineering days**. This refines the initial 4–8 day range after excluding Cypress restoration. The branch rename and settings verification alone should take roughly half an hour to one hour; the release phase also includes deployment and smoke checks. Waiting for access, reviews, or external services is additional elapsed time.

The half-day investigation should replace this estimate with one grounded in actual errors. Translation generation, React peer conflicts, PostCSS behavior, and TypeScript/lint integration are the main uncertainties. Escalate a discovered rewrite before exceeding the agreed boundary.

## Deferred work

Restoring Cypress, App Router or React 19 adoption, changing package managers, broad lint/format modernization, design changes, Firebase/data migrations, monetization changes, and unrelated dependency cleanup are outside this plan.

## Sources

- [Node.js release schedule](https://github.com/nodejs/Release)
- [Next.js support policy](https://nextjs.org/support-policy)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js Pages Router](https://nextjs.org/docs/pages)
- [Publisher metadata confirming Next 16 React 18 compatibility](https://registry.npmjs.org/next/16.3.6)
- [next-translate 0.19 migration](https://github.com/aralroca/next-translate/releases/tag/0.19.0)
- [next-translate 1.0 migration](https://github.com/aralroca/next-translate/blob/canary/docs/migration-guide-1.0.0.md)
- [ESLint support policy](https://eslint.org/version-support/)
- [GitHub Actions cache retirement](https://github.blog/changelog/2024-12-05-notice-of-upcoming-releases-and-breaking-changes-for-github-actions/)
- [GitHub native branch rename](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/renaming-a-branch)
- [Vercel Node.js versions and engines precedence](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel Git deployment configuration](https://vercel.com/docs/git)

Provider observations are from the read-only checks in this planning session. Revalidate version support and live configuration when implementation begins.
