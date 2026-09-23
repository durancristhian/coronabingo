# Cypress removal plan

Date: 2026-09-23

Status: removal implemented on 2026-09-23 after the owner requested execution and a commit after verification. See the execution record below.

Evidence baseline: local source at `6905b4d`, inspected on 2026-09-23. Recheck references and working-tree changes before execution.

## Agreed outcome

Remove Cypress and its associated tests and tooling from Coronabingo. Do not replace it with another runner, migrate its tests, or introduce another automated browser suite.

The owner accepted leaving the app without automated browser tests. The original planning session produced only this document; a later request authorized implementation. Existing TypeScript, lint, locale validation, ticket validation, build, and pre-commit checks remain in scope to preserve. Removing other automation is not part of this request.

This is a reversible tooling cleanup. Record the decision here; no separate ADR or domain-glossary change is needed.

## Planning baseline and retired coverage

At planning time, Cypress was a direct dependency, declared as `^4.4.0`. The suite had eight spec files with 28 test cases. CI already commented out its test command, and the README described the suite as deferred. The suite was not run during this investigation, so these are source-level assertions, not verified current coverage.

| Spec under `cypress/integration/` | Cases | Intended coverage |
| --- | ---: | --- |
| `home/home_spec.js` | 3 | Create-room controls, room creation, tutorial modal |
| `admin/admin_spec.js` | 11 | Room setup, player management, host selection, sharing controls |
| `layout/header_spec.js` | 1 | Language URL switching |
| `layout/footer_spec.js` | 6 | Donation modal and external links |
| `player/player_spec.js` | 1 | Selected-number persistence after reload |
| `player/numbers_meaning_spec.js` | 2 | Number-meaning visibility |
| `player/admin_player_spec.js` | 3 | Drawing numbers, host options, game restart |
| `room/room_spec.js` | 1 | Spreadsheet download control visibility |

Some assertions are narrower than their names: the spreadsheet case checks the control exists, and the clipboard case checks the sharing modal closes. Removal retires these deferred sources; it does not remove a currently enabled CI test gate. No other unit or browser test suite was found.

## Exact removal scope

| Location | Planned change |
| --- | --- |
| `cypress/` | Delete all eight specs, the example fixture, plugin entry point, support entry point, and custom commands. |
| `cypress.json` | Delete viewport settings and the Cypress project identifier. |
| `package.json` dependencies | Remove `cypress` and `start-server-and-test`. The latter is used only by the Cypress test command. |
| `package.json` scripts | Remove `cypress-open`, `cypress-run`, `test`, and `build-start`. The only repository consumer of `build-start` is the removed test command. |
| `package-lock.json` | Regenerate with the repository's pinned npm version. Remove orphaned transitive packages while retaining packages still required elsewhere. Review for unrelated version changes. |
| `.github/workflows/push.yml` | Remove the `CYPRESS_PROJECT_KEY` environment mapping and commented `npm t` step. Preserve the existing build job. |
| `components/Cells.tsx` | Remove `data-test-class="cell-number"`. |
| `components/Ball.tsx` | Remove `data-test-class="ball"`. |
| `README.md` | Replace deferred-Cypress setup advice with the removal status and remaining verification commands. State that no automated browser suite remains. |
| `research/node-24-main-migration-plan.md` | Add a dated note linking to this decision, superseding the earlier requirement to preserve deferred Cypress sources. |

Repository searches found no consumers of the two HTML attributes outside Cypress. Preserve element structure, handlers, styles, and gameplay behavior. No Cypress-specific TypeScript or ESLint configuration was found. Other element IDs and attributes must not be removed merely because a test selects them.

After removal, `npm test` will no longer be defined. Do not replace it with a command that silently succeeds or implies browser coverage. Keep the explicit existing check commands.

## Boundaries and related work

- Preserve historical research logs, candidate manifests, candidate lockfiles, and migration evidence under `research/`. Cypress mentions in those dated records are expected.
- Keep actual GitHub secrets, Cypress Cloud records, hosted settings, private environment files, and the machine-wide Cypress binary cache unchanged. Removing the repository's secret reference does not delete the hosted secret.
- Keep Firebase data, application features, routes, translations, CI runtime versions, and unrelated dependencies unchanged.
- Keep Husky, lint-staged, the pre-commit hook, and the build's locale-validation step.
- The [unused-features pruning plan](unused-features-pruning-plan.md) is separate. Coordinate overlapping README and dependency edits if both plans are implemented; this plan does not authorize feature retirement.
- The broader [Node 24 migration plan](node-24-main-migration-plan.md) has separate CI and deployment work. Cypress removal does not establish that those migration steps are complete.

## Execution sequence

1. Read `AGENTS.md`, this plan, the README, and relevant installed Next.js guides. Record the current commit and preserve unrelated working-tree changes.
2. Recheck Cypress references, script consumers, and the two HTML attributes. Confirm no new runner integrations or shared helpers have appeared since this inventory.
3. Remove the listed files, scripts, dependencies, CI references, and test-only attributes. Use the Node/npm versions pinned by the execution checkout and inspect the manifest and lockfile diff together.
4. Update the README and add the migration-plan supersession note. Preserve historical evidence.
5. Verify the removal and record results against the acceptance criteria below. Do not run installation or a production build alongside a development server in the same checkout; use an isolated checkout if needed.

## Acceptance criteria

- `cypress/` and `cypress.json` are absent.
- The root manifest and lockfile contain neither Cypress nor `start-server-and-test`, and no active command invokes them.
- CI no longer references `CYPRESS_PROJECT_KEY` or the removed test command.
- Neither test-only HTML attribute remains, and the component diff contains no behavior changes.
- Search tracked source and configuration for `cypress`, `CYPRESS`, `start-server-and-test`, `cypress-open`, `cypress-run`, and `build-start`. Review each remaining match; historical research and documentation explaining the removal are allowed.
- A clean `npm ci` succeeds with the updated lockfile in an isolated checkout.
- `npm run lint:check`, `npm run validate-locales`, `npm run validate-tickets`, and `npm run build` pass. Run checks sequentially where they share generated output. Inspect ticket-validator output as well as its exit code because the legacy validator catches assertion failures.
- Record pre-existing failures separately instead of expanding this cleanup into unrelated fixes.
- Current documentation accurately states that automated browser coverage is absent. Static checks and a successful build do not establish working gameplay.

Execution results are recorded below. No new test automation was introduced.

## Execution record, 2026-09-23

Implemented from `c335e3acebdd50da5261f56107fbad3e20ddc2c5` using Node 24.21.0 and npm 11.19.0. Removed the eight specs and their support files, configuration, two dependencies, four scripts, CI secret mapping and disabled step, and the two test-only HTML attributes. Updated the README and the migration-plan supersession note.

The regenerated lockfile removes 184 package entries. Comparing parsed package records found no new entries and no changes to retained entries, including their versions, resolved URLs and integrity hashes. The component diff removes only the two attributes; element structure, handlers and styling are unchanged.

Verification ran sequentially in an isolated detached checkout with a fresh dependency installation:

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | Passed, exit 0 | [Install log](cypress-removal-evidence/01-install.log) |
| `npm run lint:check` | Passed, including TypeScript | [Lint log](cypress-removal-evidence/02-lint.log) |
| `npm run validate-locales` | Passed for both locales | [Locale log](cypress-removal-evidence/03-locales.log) |
| `npm run validate-tickets` | Passed; output contained the success message and no caught assertion failures | [Ticket log](cypress-removal-evidence/04-tickets.log) |
| `npm run build` | Passed, including locale prebuild, TypeScript, page generation and tracing | [Build log](cypress-removal-evidence/05-build.log) |
| Removal audit | Suite and config absent; no runner, script, secret or test-attribute references in active source/configuration | Tracked-file search and manifest/lockfile inspection |
| `git diff --check` | Passed | Local diff review |

Remaining Cypress references are documentation explaining removal or historical research, including candidate manifests and lockfiles. Those historical files were preserved. No browser gameplay verification was performed; there is no replacement automated browser suite, and `npm test` is undefined.

Installation reported deprecations, lifecycle-policy warnings and 66 dependency vulnerabilities. The build reported the existing Tailwind purge-configuration warning. No check failed, and this removal does not address the remaining dependency or styling maintenance.

The unrelated traffic/revenue research files, hosted secrets, private environment configuration and machine-wide Cypress cache were left unchanged.

## Recovery

Git retains the deleted suite. If a later decision requires restoration, restore the removal changes together, including manifest, lockfile, scripts, configuration, and test attributes. Restoring old sources does not establish compatibility or passing tests; that would require separate verification.
