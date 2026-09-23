# Unused features pruning plan

Status: accepted by the owner on 2026-09-23 and ready for later execution. This document records research and prepares a later implementation; no application removal has been performed.

Evidence baseline: local source at `6905b4d`, inspected on 2026-09-23. Recheck references against the execution checkout before deleting files. Source reachability does not establish whether someone still visits a route or uses historical data.

## Outcome and decisions

Simplify the application while preserving the ordinary create-room, configure, share, play, and restart flow. Use [the glossary](../CONTEXT.md) to distinguish a room's host from a charity-event organizer.

| Decision | Status | Choice or recommendation |
| --- | --- | --- |
| D1: Feature scope | Accepted by owner | Retire standalone `/admin`, charity-event routes, and verified unused code. |
| D2: Stored data and account settings | Accepted by owner | Code only. Keep Firebase documents, receipt uploads, accounts, rules, and billing unchanged. |
| D3: Old URL behavior | Accepted by owner | Standard 404 for retired routes. Keep no retirement-notice routes or redirects. |
| D4: Shared understanding | Confirmed by owner on 2026-09-23 | The finished plan captures the agreed scope and is ready for later execution. |

Documentation is complete. App implementation is deferred until a later execution request.

## What exists

| Entry point | Behavior | Evidence |
| --- | --- | --- |
| `/admin` | Email/password login followed by event creation. `Premium` is the name of its UI container, with no subscription functionality. | `pages/admin.tsx`, `components/Premium.tsx`, `components/EventGenerator.tsx` |
| `/eventos/[eventId]` | Event description and former registration form for name, phone, donation receipt, and comment. | `pages/eventos/[eventId].tsx` |
| `/eventos/[eventId]/admin` | Review receipts, approve registrations, allocate cards, open a participant's card link, and contact the participant through WhatsApp. | `pages/eventos/[eventId]/admin.tsx`, `components/Registrations.tsx` |
| `/room/[roomId]/admin` | Configure players, choose a host, assign cards, and start the room. Normal creation and restart navigate here. | `components/CreateRoom.tsx`, `components/Restart.tsx`, `pages/room/[roomId]/admin.tsx` |

The charity-event generator creates an event, a locked room, a host, and 449 participant card allocations. Registration approval consumes an allocation and creates a player. These routes are wired together and are not unreferenced code.

Retirement evidence:

- The registration form closes for every event after August 15, 2020 at 15:30 according to the browser's local clock. A newly created event also inherits this cutoff.
- `components/EventBanner.tsx` promotes only `coronabingo-solidario-por-minka`, during August 11–15, 2020. `components/Layout.tsx` still mounts it, but its date condition now returns nothing.
- No in-app navigation to standalone `/admin` or an event directory was found.
- The public event page still subscribes to registrations even though its form is closed. The organizer page can still load historical receipts.

Current route traffic and Firebase activity have not been checked for this plan. The earlier [Firebase research](firebase-spark-vs-blaze-2026-09.md) is historical evidence, not a fresh account inspection.

## Execution sequence

### 1. Establish a baseline

- Read `AGENTS.md`, this plan, and current repository setup instructions. Before code changes, read the relevant installed guides under `node_modules/next/dist/docs/`.
- Inspect branch and worktree status; preserve unrelated changes. Record the implementation base commit.
- Identify the target Firebase project without publishing credentials. Use an isolated test project or explicitly agreed test records for gameplay checks.
- Run current non-mutating lint/type and locale checks. Record pre-existing failures separately.

Complete when scope decisions are settled, the baseline is recorded, and the test-data arrangement is known. Production data changes are not implied by this code cleanup.

### 2. Remove verified files with no callers

Recheck static imports, dynamic imports, re-exports, scripts, and configuration before removing each candidate:

| Candidate | Original purpose |
| --- | --- |
| `components/AdminPassword.tsx` | Unused password form. Host protection uses `RoomCode`. |
| `hooks/useDocument.tsx` | Unused generic Firestore document listener. |
| `hooks/useEventBanner.tsx` | Unused hook for selecting banner placement. |
| `utils/createEmptyRoom.ts` | Unused helper that prepopulates a locked room. |
| `utils/telegram.ts` | Unused Telegram bot sender. Telegram sharing has a separate implementation. |

Complete when each deletion has no remaining runtime caller and lint/type checks pass.

### 3. Retire charity-event routes and their exclusive code

Delete the route files for standalone `/admin`, `/eventos/[eventId]`, and `/eventos/[eventId]/admin` so they use standard Next.js 404 handling, including their Spanish and English URL forms. Verify the final HTTP status is 404, not a successful page containing an error message. Keep no retirement-notice routes or redirects.

Remove the event banner import and render from `components/Layout.tsx`. Remove event and email/password authentication providers from `contexts/index.tsx` after removing their consumers.

Starting inventory, subject to the reference check:

- Routes: `pages/admin.tsx`, `pages/eventos/[eventId].tsx`, `pages/eventos/[eventId]/admin.tsx`.
- Event UI: `components/Premium.tsx`, `components/EventGenerator.tsx`, `components/Registrations.tsx`, `components/EventBanner.tsx`.
- Organizer login: `components/EnsureLogin.tsx`, `components/Login.tsx`, `hooks/useAuth.tsx`, `contexts/Auth.tsx`, `interfaces/contexts/Auth.ts`.
- Event state: `hooks/useEvent.tsx`, `hooks/useSubCollection.tsx`, `contexts/Event.tsx`, `interfaces/contexts/Event.ts`, `interfaces/models/Event.ts`, `interfaces/models/Registration.ts`, `interfaces/models/RoomTicket.ts`.
- Exclusive input and receipt helpers: `components/InputMarkdown.tsx`, `components/InputImage.tsx`, `components/InputTextarea.tsx`, `components/FirebaseImage.tsx`, `components/Accordion.tsx`, `components/Tag.tsx`.

Remove only `sendWhatsAppTo` from `utils/sendWhatsapp.ts`; retain `sendWhatsApp`, which `components/Copy.tsx` uses for normal sharing.

Follow dependencies of deleted files to find newly orphaned helpers. Preserve any helper with a remaining gameplay consumer.

In `utils/firebase.ts`, remove event collection access and the Auth/Storage imports, initialization, and exports once all their consumers are gone. Preserve the shared Firebase app, Firestore, Analytics, room access, timestamps, and batching used by gameplay. An unused export does not imply its underlying instance can be removed: `db` remains necessary internally.

Complete when the chosen retired-route behavior works, no deleted module has a live reference, and normal gameplay still has its required providers and Firebase services.

### 4. Prune dependencies and update current documentation

- Remove packages exclusively used by the retired workflow, updating `package.json` and the lockfile together: `date-fns`, `markdown-it`, `@types/markdown-it`, `react-markdown-editor-lite`, and `slugify`, subject to the fresh reference check.
- Remove the Markdown editor CSS import from `public/css/styles.css`. Retain `markdown-body.css`, used by news content. Audit any remaining event-only selectors.
- Review `AUTH_DOMAIN` and `STORAGE_BUCKET` references together across `utils/firebase.ts`, `next.config.js`, `.env.template`, and `.github/workflows/push.yml`. Remove configuration entries only when the remaining SDK use no longer requires them. Keep actual local `.env` files, other private environment files, hosted environment settings, and GitHub secrets unchanged.
- Update README setup and verification instructions to match the remaining application. Retain historical research and evidence as dated records.
- Retain `firebase`, `zipcelx`, its types, and packages still used by ordinary gameplay or ticket-generation scripts.
- Record unrelated dependency candidates such as `gsheets` and `@types/gsheets` separately; this plan does not expand into a general dependency upgrade or CI runtime migration.

Complete when the install remains reproducible, removed packages have no remaining consumers, and current setup documentation matches the application.

### 5. Verify behavior and prepare the handoff

Run the repository's lint/type check, locale validator, ticket validator, and production build sequentially where they share generated output. Inspect the ticket validator's output as well as its exit code, since it catches assertion failures.

At the evidence baseline, the commands are:

```sh
npm run lint:check
npm run validate-locales
npm run validate-tickets
npm run build
npm run start
```

Recheck current `package.json` and README before execution. Use the pinned Node/npm runtime, and do not overlap installation, development, and production builds in one checkout. `lint` autofixes files; `lint:check` is the intended verification command.

Verify the built application with both supported locales:

| Scenario | Required result |
| --- | --- |
| Home and language switching | Spanish and English render, navigate, and survive refresh. |
| Normal room creation and setup | Add players, select host/options, assign cards, start the room. |
| Independent signed-out host and player sessions | Called numbers synchronize, cards render, and host controls work with Firebase Auth removed. |
| Host code enabled | The emoji-code gate remains functional without organizer login. |
| Restart | Returns to room setup and supports another game. |
| Sharing and spreadsheet export | Existing links and downloaded player/host links remain correct. |
| Retired routes | Final response is standard 404 for unprefixed, `/es`, and `/en` URLs. No event or registration listener remains on these pages. |
| Missing room | Existing error behavior remains intact. |

Cypress is currently disabled in CI and its suite is legacy. `npm test` invokes Cypress recording and can create real Firebase rooms and players; it is not a substitute for an agreed test-data arrangement. Do not present a successful build or HTTP 200 as proof of gameplay. Choose focused browser checks or suitable maintained tests and state exactly what was exercised. The deployed Firebase rules have not been inspected for this plan; signed-out gameplay verification is required to establish that removing ambient Auth state is safe for the target environment.

Complete when checks pass or documented pre-existing limitations are resolved with the owner. Record changed files, test evidence, remaining risks, and the rollback commit. Publish/deploy only under a separate instruction that authorizes it.

## Preserve during cleanup

- All `/room/...` routes, including `/room/[roomId]/admin`, plus room/player state and models.
- Room codes, `activateAdminCode`, `locked`, host selection, and restart behavior. Event retirement alone does not prove these shared fields are obsolete.
- `locales/es/admin.json`, `locales/en/admin.json`, and the room-admin namespace mapping in `i18n.json`.
- `cypress/integration/admin/admin_spec.js`, which exercises room setup through room creation.
- `components/DownloadSpreadsheet.tsx`, `zipcelx`, and its types.
- WhatsApp and Telegram sharing in `components/Copy.tsx`, independently of the event contact function and unused bot helper.
- News content and rendering, including `gray-matter` and any Markdown styles still used there.
- Firebase documents, uploads, and account configuration according to D2. Removing their UI does not delete or secure those records.

Historical event rooms remain stored and retain their current `locked` behavior. Removing organizer pages does not authorize unlocking or migrating those rooms.

## Rollback

For a code-only execution, restore the pruning commit or commits and reinstall from the restored lockfile. Preserved historical data makes the prior UI recoverable, subject to the Firebase configuration at that time. A future archival or deletion project needs its own retention decision and verified recovery procedure.
