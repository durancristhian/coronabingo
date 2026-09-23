# Preview acceptance evidence

Collected on 2026-09-23 for application commit `47918fc` on the existing Vercel preview. See [the report](../node-24-preview.md) for scope and limits.

- `deployment.json`: deployment identity, READY status and deployed function runtimes.
- `build.log`: Vercel build output, including Node 24 override and successful Next 16 build.
- `production-unchanged.json`: production deployment, commit, branch and project runtime setting.
- `browser-checks.json`: realtime draw, room isolation, selected ticket mark, locale URL and console observations.
- `final-gameplay-dom.txt`: final host, player and isolated-room DOM snapshots, excluding embedded social content.
- `shared-url-refresh.json`: query/fragment preservation and English lobby after refresh.
- `host-english.png`, `player-spanish.png`: visually inspected desktop screenshots.
- `http-checks.json`: home/lobby/player responses and audio delivery.
- `room-a-en.xlsx`, `spreadsheet-check.json`: downloaded workbook and verified locale-prefixed links.
- `test-records.json`, `cleanup.json`: synthetic development records and denied atomic cleanup. Records remain in `coronabingo-dev`.

No private credentials, auth sessions or environment files are included.
