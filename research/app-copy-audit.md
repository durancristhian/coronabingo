# App copy audit, 2026-09-27

Status: accepted
Work status: resolved

## Scope and baseline

The owner requested small ES/EN wording and functional-icon improvements, an implementation PR and a Vercel Preview for approval. Preserve layout, content sections, gameplay and the existing tone. No merge or Production deployment is authorized.

- Worktree: `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-e6df5911`
- Branch: `t3code/audit-app-copy`, reusing the app-created task worktree.
- Verified base after `git fetch origin`: `e81afc8caa2078c2b6f8698cf41baf40840eb6bd`, equal to `origin/main`; clean initial tree.
- Bootstrap: copied the owner-authorized main checkout `.env` only because the destination was absent. Node 24.21.0, npm 11.19.0, `npm ci` succeeded. No environment values logged or committed.
- Sources: `CONTEXT.md`, `.better-web-ui.md`, all ten locale catalogs and their component call sites, installed Next.js Pages Router internationalization guide.

## Editorial decisions and findings

The owner explicitly chose neutral Spanish during this audit, overriding the earlier Argentine Spanish wording preference in `.better-web-ui.md`. Use consistent informal tú, warmth and short, direct instructions; use natural English rather than literal translations. Use sala/room, cartón/card and dirige el juego/host consistently. Error messages describe the failed action and recovery without inventing a cause.

| Finding | Adjustment |
| --- | --- |
| Spanish mixes `Espere`, `Intenta`, `Seleccione`-style language and voseo | Consistent conversational neutral Spanish; short completion messages without an unnecessary wait instruction |
| Creation asks for `Nombre` and ends with `Listo` plus a smile | `Nombre de la sala`, `Crear sala`, plus icon |
| Setup and joining both say `Jugar` | Setup says `Empezar partida` with play icon; joining retains `Jugar` |
| English calls the host `Admin` and cards `tickets` | `Host` and `cards`, including spreadsheet labels and share metadata |
| Restart only explains reconfiguration | Explain cleared called numbers, new cards and cleared marks at the correct stages; `Reiniciar partida` / `Restart game` and restart icon |
| Room code instructions do not explain emoji ordering | Explicitly select the three emojis in order; matching recovery message |
| Hidden host-code checkbox is hardcoded in Spanish | Translate its existing label and hint; retain activation behavior |
| Selects expose `adminId` and `language`, icon tools and close lack labels | Localized accessible names and native titles without adding visible content |
| Spreadsheet says `.xls` but download is `.xlsx`; count is called capacity | Correct the format label and describe the actual player count |
| Home recommends Google Hangouts and implies video calls are required | Optional video call wording and the current Google Meet destination |
| Orthography | `Cómo`, `imagen`, `confeti`, `arcoíris`, `revólver`; natural English instructions |

The Google Meet destination was checked against [Google's calling help](https://support.google.com/meet/answer/14160292?hl=en-GB); [Google's Hangouts retirement notice](https://workspaceupdates.googleblog.com/2022/09/Google-Hangouts-to-Google-Chat-Update-September-2022.html) confirms the old recommendation is obsolete. The existing anchor ID remains for analytics compatibility.

Traditional quiniela associations, sound names, artwork names and external video/tweet content retain their meaning. This is a copy edit, not a replacement of cultural game content. No CSS, component ordering, game data or security behavior changes. Tutorial and feedback also use play and message icons instead of eye and heart icons.

## Acceptance criteria

- Readable, consistent ES/EN across home, setup, lobby, cards, dialogs and errors.
- Labels describe their actual actions; translations preserve interpolation and plural keys.
- Existing layout works at desktop and mobile widths with the updated text.
- Existing host/player regression journeys still pass; focused bilingual checks cover the changed controls.
- Lint/typecheck, locale validation, build and whitespace checks pass.
- Branch pushed, PR opened, CI and Vercel checked through terminal results, Preview URL supplied for owner review.

## Verification

Local verification passed on the implementation introduced with this record, based on `e81afc8`. Hosted checks passed on implementation commit `796e6b0c0f38ef8873d9fb290298d10a056281a1`; details below.

| Command / review | Result |
| --- | --- |
| `npm run lint:check` | Passed, including Next.js type generation and TypeScript |
| `npm run validate-locales` | Passed; also runs through `prebuild` |
| Recursive ES/EN key and interpolation comparison | Passed, 226 matching leaf keys per language |
| `npm run ui-tests` | 20/20 passed, 73.4 seconds including owned services |
| `npm run build` | Passed with the checkout environment; no hosted gameplay writes |
| `npm run ui-tests:production` | 20/20 passed, 25.7 seconds for tests and 35.8 seconds including services/build |
| `git diff --check` | Passed |
| Component review | Existing imports and components reused; no additional dependencies, data fetching or gameplay changes |

The first development run found one obsolete error-text expectation, which was corrected. A subsequent run was interrupted after the owner selected neutral Spanish so the final validation could cover one consistent revision. The final complete runs above include the neutral Spanish edits.

Both suites use this task worktree and branch at `http://127.0.0.1:3187`, Firestore Emulator `127.0.0.1:8187`, project `demo-coronabingo-ui`. Development runner PID 1178 owned Firestore 1180 and Next.js 1200. Runners stop their processes and discard emulator data at completion. No hosted game records were created by local checks.

The four new bilingual journeys cover creation, setup, translated host protection label, lobby, sharing, cards and restart at 390×844 and 1280×844. Existing tests cover separate host/player contexts, number synchronization, marking, refresh, role changes, room-code protection, spreadsheet recovery/download and tutorial failure recovery. Browser requests are restricted to the local app/emulator. Successful build and emulator checks are not Production acceptance.

Screenshots from the final development run were inspected for wrapping, visible actions and overflow: [Spanish home](app-copy-audit-evidence/es-390-home.png), [Spanish setup](app-copy-audit-evidence/es-390-setup.png), [English setup](app-copy-audit-evidence/en-390-setup.png), [Spanish restart](app-copy-audit-evidence/es-390-restart.png), [English lobby](app-copy-audit-evidence/en-1280-lobby.png), [English cards](app-copy-audit-evidence/en-1280-cards.png). These preserve real transient success toasts and development UI; Preview remains the owner's review environment.

Coverage limits: Chromium only; no human usability study, screen-reader session or hosted gameplay verification. Existing third-party videos/tweets and the framework's default 404 copy are outside this content edit.

## Comments

- 2026-09-27: Audit and implementation started within the owner's explicit PR/Preview request. No additional approval required for these edits or branch publication.

- 2026-09-27: Owner chose neutral Spanish. Updated all existing Spanish imperative copy, including sharing, help, recovery and donations, to avoid mixing voseo and tú.

## PR and Preview verification

- [PR #210](https://github.com/durancristhian/coronabingo/pull/210), linked to the active T3 thread, against `main`. Branch `t3code/audit-app-copy` is pushed. Implementation commit `796e6b0c0f38ef8873d9fb290298d10a056281a1`.
- [GitHub Actions 36366714944](https://github.com/durancristhian/coronabingo/actions/runs/36366714944): successful lint/typecheck, build and 20/20 Chromium tests. Tests took 48.5 seconds, the browser runner 54.7 seconds and the job 3m13s.
- [Vercel deployment](https://vercel.com/cristhian-durans-projects-3ace6550/coronabingo/5EE5s8LDSUfqeGXXfGVpXRCbG2pi): successful for the implementation commit.
- [Branch Preview](https://coronabingo-git-t3cod-d83e16-cristhian-durans-projects-3ace6550.vercel.app), with English at `/en`.
- Preview home was checked read-only in both languages at 390×844 and 1280×844: HTTP 200, correct labels, empty form disabled, named form enabled and no horizontal overflow. The create button was never submitted. External requests were blocked in this inspection, so ads and embedded news are not verified. [Recorded result](app-copy-audit-evidence/preview-home.json).
- No hosted game records created, no local servers left running, no merge or Production deployment. The owner still needs to review and approve the copy in Preview.

This final evidence update changes documentation and screenshots only. PR checks for the final branch head remain visible in GitHub; they are monitored through completion before handoff.
