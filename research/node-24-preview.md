# Node 24 migration: Vercel preview

Date: 2026-09-23. Status: main-game preview acceptance passed. The user explicitly excluded the standalone `/admin` and `/eventos` pages because they are scheduled for removal. Room configuration at `/room/[roomId]/admin` remains part of the tested main game.

## Candidate and runtime

- [Verified preview](https://coronabingo-1qhexaw4o-cristhian-durans-projects-3ace6550.vercel.app), deployment `dpl_GKYM5yyNvQVWUACYPdakN8wGLkiu`, READY.
- Application commit `47918fc74a92208984f4178e85fc28833f993f8b`, matching the [successful GitHub Actions run](https://github.com/durancristhian/coronabingo/actions/runs/35893873513). The later `bcbaf82` commit changes only CI evidence and the migration plan.
- Vercel build logs identify Next 16.3.6, Webpack, successful locale validation/build and the Node 24 engines override. Deployment outputs declare `nodejs24.x` for the deployed functions. This proves the configured deployment runtime, not a separately instrumented `process.version` response or exact Node patch.
- The deployed preview bundle uses Firebase `coronabingo-dev`; the public production bundle uses `coronabingo-bf16f`. Only the development project received synthetic gameplay writes.
- Reused the existing preview. No new deployment, branch rename, production promotion, environment change or application code change was needed.

## Main-game verification

| Check | Result |
| --- | --- |
| Spanish and English home | Pass; client switching updates the memoized News heading; English survives refresh |
| Create room and assign host/player | Pass; room A created through the UI, two players added, host selected and game started |
| Shared lobby and player links | Pass; both clients joined through the lobby, received distinct tickets and the expected host/player controls |
| Realtime draw | Pass; host drew 50 and the player received 50 without refresh |
| Player language and refresh | Pass; switching to Spanish retained the player and draw; refresh restored the same state |
| Restart and replay | Pass; host returned to room configuration, player entered the waiting state, replay distributed new tickets and cleared the draw |
| Room isolation | Pass; room B stayed active during room A's restart. Room B then drew 60; room A remained empty until its host drew 49. A's player received 49 while B retained 60 |
| Ticket marking | Pass; marking 9 on ticket 207 rendered the orange mark and retained it after refresh |
| Locale-prefixed shared URL | Pass; direct `/es/room/...` loaded Spanish. Switching to English preserved `?proof=node24-preview#details`; refresh retained the English lobby and two-player plural |
| Spreadsheet | Pass; downloaded XLSX opened as ZIP/XML, contained both players and three correct preview-host `/en/room/...` links |
| Layout and ball rendering | Desktop host and Spanish player screenshots visually reviewed; ticket grids, controls and final ball state rendered correctly |
| Audio | Sound dialog opened and Windows Error control was exercised; deployed MP3 returned 200 with `audio/mpeg`. Audible output on each client was not independently measured |
| HTTP | Seven home/lobby/player routes returned 200 with expected document languages; one audio asset returned 200 |
| Console | No application errors observed in the final gameplay checks. The host tab captured one error from the third-party Twitter embed's `appendChild` call |

Host and player used separate tabs and separate player URLs in the same Chrome profile. These checks prove live Firestore propagation between clients, not isolated browser-profile authentication. No standalone admin, event, login or event-editing checks were performed. Full responsive, exhaustive media and animation-frame comparisons are not claimed.

## Test data and cleanup

Created only these rooms in `coronabingo-dev`, each with two synthetic players:

- `0nniKao4wiFc0Od3D61z`, `Node24 preview QA 20260923 A`.
- `rcqdGZtqPYnPMlgIdqS6`, `Node24 preview QA 20260923 B`.

Read-only Firestore responses confirmed A had `timesPlayed: 2` and selected number 49, while B had `timesPlayed: 1` and selected number 60. An atomic cleanup request for exactly these six documents used name checks and update-time preconditions. Firestore rejected it with HTTP 403, so no documents were deleted. The test records remain for owner cleanup; no permissions or rules were changed.

## Evidence and next boundary

[Evidence directory](node24-preview-evidence/README.md) contains deployment runtime metadata, build logs, browser observations, screenshots, route results, the downloaded spreadsheet, test record identifiers and cleanup status.

The production deployment remains `dpl_94TcP2sYDzaNgEVnJdhvbQCSeW2H`, commit `002046108df164389ea8b446de495c7913c500fe`. The Vercel project still specifies Node 12 and production branch `master`; the preview's package engines override supplies Node 24. Production cutover and the `main` rename were not attempted.

The next migration phase is release preparation. Establish the legacy deployment's executable rollback path before any cutover, as required by the existing plan. Main-game preview acceptance does not resolve that release gate.
