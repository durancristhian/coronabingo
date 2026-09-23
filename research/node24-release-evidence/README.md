# Production release evidence

Collected on 2026-09-23 for release commit `0e8e1dc` and deployment `dpl_8j8S9eynofmksrCJgTVc99MZpK27`.

- `deployment.json`, `project-settings.json`, `github-settings.json`: production identity, Node 24 function runtime, custom-domain alias and main branch settings.
- `build.log`: completed Vercel build.
- `ci-run.json`, `ci-runtime-and-artifact.txt`: successful release CI, pinned Node/npm and report upload evidence.
- `firebase-project.json`: production Firebase project identity, without credentials.
- `browser-checks.json`, `production-game.png`: live host/player draw, language/refresh and restart/replay smoke evidence; screenshot visually reviewed.
- `http-checks.json`: homepage, room and audio delivery checks.
- `runtime-errors.jsonl`: deployment error query for the 15-minute release window; empty output means no returned error entries.

Scope and limits are in [the release report](../node-24-release.md). Test-room cleanup and rollback verification were waived by the user.
