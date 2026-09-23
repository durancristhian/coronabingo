# Admin and charity-event cleanup

Date: 2026-09-23. Status: implemented and verified locally. No deployment or push performed.

Implemented the accepted [pruning plan](unused-features-pruning-plan.md). Initial base was `c335e3acebdd50da5261f56107fbad3e20ddc2c5` on `main`. The owner ran a separate Cypress cleanup concurrently, committed as `fc55735`; this cleanup preserves that commit and leaves the three unrelated traffic-research files untracked.

## Changes

- Deleted standalone `/admin` and both charity-event routes, their organizer login, event state, receipt UI, and event banner. Retired URLs use Next.js's standard 404 with no redirects or replacement pages.
- Deleted the five verified unused modules from the plan. Thirty files were removed in total. Fresh source, script, stylesheet, and configuration searches found no surviving callers.
- Removed Firebase Auth and Storage initialization and event collection access. The shared app, Firestore instance, Analytics, timestamps, rooms, and batching remain. Removed unused `db` and `firebaseApp` exports while preserving their internal instances.
- Removed five direct dependencies and their exclusively used transitive packages. No surviving package version changed. Removed editor CSS while preserving news Markdown styles and rendering.
- Removed `AUTH_DOMAIN` and `STORAGE_BUCKET` entries from the app configuration, environment template, and CI. Actual local environment files, hosted values, secrets, Firebase rules, billing, historical documents, accounts, and uploads were unchanged.
- Retained room routes and providers, emoji codes, locked-room handling, translations, sharing, and spreadsheet export. `gsheets` and `@types/gsheets` remain separate dependency candidates.

## Verification

Used Node `24.21.0` and npm `11.19.0`. Baseline `lint:check` and locale validation passed before edits. The final clean install, lint/type check, locale validator, ticket validator, and production build ran sequentially. The ticket validator printed its success result, with no caught assertion failures. Logs are in [the evidence directory](admin-events-cleanup-evidence/README.md).

The production build at port 3124 was tested against `coronabingo-dev`. The host used `localhost`, and the player used `127.0.0.1`, giving them separate browser origins and app storage within one Chrome profile. This is separate-origin session evidence, not two separate browser profiles. Captured Firestore requests contained no Authorization header or encoded authorization field. The host's longer request capture was truncated; a separate fresh-reload capture was complete. Source maps contain no Firebase Auth, Firebase Storage, or retired event modules.

| Check | Result |
| --- | --- |
| Home and locales | Spanish and English rendered; switching to English and refreshing retained the translated home. Gameplay also switched languages and survived refresh. |
| Create and configure | Created one synthetic room, added two players, selected the host, changed options, assigned cards, and reached the lobby. |
| Host protection | Emoji gate blocked the host before entry, accepted the code in English and Spanish, and appeared again after refresh. |
| Realtime gameplay | Host drew 59 with the online spinner; the independent player received it and marked 59 on a card. |
| Restart | Returned to room setup, put the player in its waiting state, and reassigned cards. The second game used manual draws; 42 synchronized and remained after player refresh. |
| Sharing | Sharing dialog retained Copy, WhatsApp, and Telegram. Copy placed the exact Spanish room URL in the system clipboard. No third-party message was sent. |
| Spreadsheets | Downloaded and inspected both English and Spanish XLSX files. Each contains the correct room, host, and player URLs with its locale prefix, names, capacity, and cards. |
| Retired URLs | Twelve unprefixed, `/es`, and `/en` admin/event URL variants returned HTTP 404 and standard error content. Browser event-admin 404 made zero Firestore requests. |
| Missing room | Existing translated error and reload controls appeared in both languages. |
| Console | No warnings or errors observed in host/player logs. |

## Test data and limits

Created only room `pPtwEtJxUbiHuBUWLpcp`, named `Admin events cleanup QA 20260923`, and its two synthetic players in `coronabingo-dev`. A signed-out REST read confirmed `readyToPlay: true`, `timesPlayed: 2`, called number 42, host protection enabled, and manual spinner mode. [Exact records](admin-events-cleanup-evidence/test-records.json) remain for owner cleanup. No deletion or rules change was attempted.

These results establish local application behavior against the development project's deployed rules. They do not establish production rule behavior or a production deployment. Existing dependency deprecation/install-script warnings and the Tailwind purge warning remain outside this cleanup. No general dependency upgrade was performed.

## Rollback

Revert the commit titled `Retire standalone admin and charity-event workflows`, then run `npm ci`. Its parent is the separate Cypress cleanup commit `fc55735`, which should remain intact. The historical Firebase data and receipt uploads were retained; restoring their UI remains subject to the Firebase account configuration at that time.
