# Admin and events cleanup evidence

Collected 2026-09-23 against the local production build and Firebase `coronabingo-dev`.

- `install.log`, `lint.log`, `locales.log`, `tickets.log`, `build.log`: final clean installation and sequential checks.
- `bundle-check.json`: final client source maps contain no retired event, Firebase Auth, or Firebase Storage modules.
- `http-checks.json`: 3 home responses and 12 retired-route 404 responses.
- `retired-browser.json`: standard browser 404 and zero Firestore requests after reload.
- `signed-out-network.json`: sanitized Firestore request metadata from separate host/player origins. No request bodies or credentials retained. The long host capture was truncated; `hostFreshReload` is complete.
- `final-gameplay-dom.txt`, `host-spanish.png`, `player-english.png`: observed gameplay. Screenshots were visually inspected.
- `console.json`: empty host/player warning and error logs.
- `room-links-en.xlsx`, `room-links-es.xlsx`, `spreadsheet-check.json`, `spreadsheet-check-es.json`: downloaded workbooks and extracted rows with verified links.
- `test-records.json`: synthetic development room and player identifiers, plus final state from a signed-out REST read. Records remain stored.

See [the execution record](../admin-events-cleanup.md) for scope and proof limits. No environment values, authentication sessions, or private credentials are included.
