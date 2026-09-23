# Part two evidence

Collected 2026-09-23 for application commit `c93bc83` on `migrate/node24`.

| File | Check |
| --- | --- |
| `01-clean-install.log` | Plain `npm ci`, fresh clone, Node 24.21.0/npm 11.19.0; exit 0 |
| `02-clean-dependencies.log` | `npm ls --depth=0`; exit 0 |
| `03-clean-lint.log` | `npm run lint:check` before building; type generation, TypeScript and ESLint pass |
| `04-clean-tickets.log` | `npm run validate-tickets`; success output inspected |
| `05-implementation-build.log` | Plain `npm run build`, includes locale validation; exit 0 |
| `06-clean-build-with-analyzer.log` | `ANALYZE_BUNDLE=1 npm run build` in clean clone; exit 0, three analyzer reports |
| `direct-dependency-changes.json` | Resolved direct dependency delta from `master` commit `9da2c4b` |
| `browser-checks.json` | Observations from real dev/production app and temporary component fixture; limits included |
| `clean-production-http.json` | HTML status and language for existing URL patterns; no gameplay proof |
| `production-local-es.jpg`, `clean-production-en.jpg` | Production-mode home screenshots; local app, not Vercel |
| `fixture-es.jpg`, `fixture-news-en.jpg` | Component fixture and dynamically translated Markdown modal |
| `node24-fixture-en.xlsx`, `node24-fixture-es.xlsx` | Downloads produced by the actual spreadsheet component with mock local data; ZIP/XML inspected |
| `component-fixture.jsx.txt` | Temporary fixture source; deliberately not an application route |

No gameplay or authentication submissions were made. Fixture ticket selection and number changes only affected React state. Its player has an empty ID to prevent the ticket component from restoring or persisting gameplay state. Spreadsheet records are mock objects without Firebase references.

To repeat the fixture in a disposable checkout after `npm ci` and environment setup, copy `component-fixture.jsx.txt` to `pages/node24-check.jsx`, run `npm run dev -- --port 3124`, and visit `/es/node24-check` or `/en/node24-check`. Exercise the named fixture controls. Remove the temporary route before building the shipping app. Do not submit the normal app's room/authentication forms without the agreed test-data arrangement.

See [the implementation report](../node-24-implementation.md) for version decisions, the next-translate 3.2 regression, the approved temporary ESLint 9 exception and remaining acceptance work. The part-one evidence directory remains a historical investigation snapshot and does not describe the final dependency pins.
