# Propuesta de AGENTS.md para Coronabingo

Fecha: 2026-09-23

Estado: aprobada por el usuario y aplicada en `AGENTS.md` el 2026-09-23. El bloque siguiente conserva la versión aprobada; las futuras actualizaciones se hacen en `AGENTS.md`.

Revisé el [AGENTS.md de Alinear](https://github.com/durancristhian/alinear/blob/6c604296036ba8e02aca11880ca13bd04b78dcc7/AGENTS.md) mediante la API autenticada de GitHub y lo contrasté con el checkout actual de Coronabingo. La propuesta conserva el idioma del archivo original y de la documentación técnica del proyecto.

Cambios respecto de Alinear:

- Usa npm, Pages Router y Firestore. El seguimiento está en `research/`, con las convenciones que ya existen en `docs/agents/`.
- Define cómo crear y cerrar worktrees con Git. Coronabingo todavía no tiene los scripts de runtime y worktrees de Alinear.
- Usa los controles disponibles y contempla los efectos del hook de pre-commit. El plan de Playwright sigue pendiente de implementación.
- Propone commits locales por cada unidad de trabajo verificada, dentro de una implementación autorizada. Push, merge y despliegue requieren autorización que cubra esa acción.
- Conserva exactamente el bloque administrado por Next.js.

Aprobar esta propuesta autoriza actualizar el documento. Los scripts de automatización de worktrees o una nueva suite de tests serían trabajos separados.

## Contenido propuesto para AGENTS.md

```markdown
## Project context

- Coronabingo uses Next.js Pages Router, React, Webpack, and Firestore. Preserve these choices unless the task explicitly changes them.
- Use npm and `package-lock.json`. Read `.nvmrc`, `package.json`, and `README.md` for runtime versions, scripts, and setup.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Scope and sources of truth

- A request to investigate or propose authorizes the findings and reviewable proposal. Apply the implementation after the user approves it. Continue within an approved scope without asking again for routine steps.
- Track plans, tickets, and evidence under `research/`. Follow `docs/agents/issue-tracker.md`; reuse the canonical document and preserve its history. Small changes may use one short record instead of a new ticket hierarchy.
- Before changing product language or domain behavior, read `CONTEXT.md` and follow `docs/agents/domain.md`. Read relevant ADRs when present and surface conflicts.
- Reuse existing components and interaction patterns. Treat plans as proposals until their decisions are approved and their implementation is verified.

## Worktrees and local runtime

- Before editing, inspect the checkout path, branch, `git status --short`, and `git worktree list`. Preserve existing changes and identify the task's base revision.
- Use a separate branch and worktree for implementation. Reuse the task's existing worktree, including one created by the app. Read-only investigation and proposal drafting can use the current checkout.
- For a new independent task, fetch `origin` and create a branch from the verified `origin/main`. Use `codex/<slug>` and a sibling directory, for example `git worktree add -b codex/<slug> ../coronabingo-worktrees/<slug> origin/main`. Replace the placeholders. For dependent work, use its agreed base and record the dependency. If fetching fails, report the local base's freshness before relying on it.
- Run setup and checks inside that worktree. Use `npm ci`; each checkout owns its `node_modules`, `.next`, and TypeScript build cache. Keep generated state separate between worktrees.
- Follow the environment rules below when setting up a new checkout. A worktree does not receive ignored `.env` files automatically and does not isolate a shared Firebase backend.
- Check port availability before starting a server. Run `npm run dev -- --port <port>` and record the worktree path, branch, URL, and process ownership in the task evidence. Use that URL for browser checks; never assume port 3000 belongs to this task.
- Run installation, development, type generation, and production build checks sequentially within a checkout. Stop its own development server before the build. Run `npm run start -- --port <port>` only after a successful build.
- Stop only processes whose ownership is verified. Remove a task worktree with `git worktree remove <path>` only after stopping its processes, preserving required evidence and local files, and confirming its changes are committed. Keep the branch until its work is integrated or deletion is authorized. Never force removal to discard unfinished work.

## Environment and Firebase

- Treat `.env*` files as secret-bearing except the committed, value-free `.env.template`. Inspect filenames and variable names without printing values. Keep credentials, session state, and secret-bearing URLs out of logs, evidence, and commits.
- Local environment files and provider settings belong to the owner. Create or copy a local environment only from an owner-approved source for the named environment. Preserve existing files; application work does not authorize overwriting them or changing provider settings. Reuse authorization already given for the task.
- Values exported through `next.config.js` are bundled into the browser. Never put server credentials there.
- Before a browser flow writes data, verify the Firebase target. Use an approved development project or explicitly agreed test records. Localhost and Vercel Preview can connect to Production; their URL alone does not establish data isolation.
- Gameplay does not require Firebase Authentication. Verify room setup, host/player behavior, and room-code protections through their actual flows. Preserve Firestore security boundaries; client-side controls do not replace server-enforced rules.
- Record test data created and clean up only data owned by the task when that cleanup is authorized. Changes to Production data, Firebase rules, billing, or provider configuration require explicit authorization for the target and action.

## Validation

- Read the current scripts before choosing checks. The implementation baseline is `npm run lint:check`, `npm run build`, and `git diff --check`. `lint:check` includes type checking; the build's `prebuild` validates locales. Run focused checks while developing and the baseline before implementation handoff.
- Use `npm run validate-locales` for focused translation checks. When changing card data or its generator, also run `npm run validate-tickets` and inspect the output: its legacy error handler can report failures without a nonzero exit code.
- Prefer `lint:check` for validation. `npm run lint` and the pre-commit hook can autofix files; review those edits and repeat affected checks if the verified code changes.
- For documentation-only changes, check content, links, command accuracy, and `git diff --check`. Application checks are needed when the change also affects an executable artifact or runtime behavior. Existing commit hooks still apply.
- There is currently no automated browser suite or `npm test` command. `research/playwright-test-plan.md` is a plan, not passing test evidence. When a suite is implemented, update these rules with its actual commands and coverage.
- For user-facing changes, exercise the affected journey at the current worktree's URL. Use separate browser contexts for host and player when checking synchronization. Check Spanish and English when changing shared UI or translations, and relevant mobile/desktop widths when changing layout.
- Verify the behavior affected by the change, including room creation/setup, joining, card assignment, called-number synchronization, refresh persistence, and restart as applicable. A successful build does not prove these interactions work.
- Record commands, results, revision, environment, URL, and relevant browser evidence in the canonical task record. Separate local, CI, Preview, and Production evidence. Record missing checks and blockers explicitly; mark work resolved only when its agreed acceptance criteria are met.

## Commits and handoff

- Within an approved implementation, commit each coherent, verified chunk on the task branch, together with its tracker update. Use a concise message describing the change, following the repository's `fix:`, `feat:`, `perf:`, or `docs:` convention as appropriate. Honor requests to leave changes uncommitted.
- Stage only files or hunks owned by the task. Review `git diff --cached` and `git diff --cached --check`; exclude environment files, browser session state, generated build output, and unrelated changes.
- Let pre-commit hooks run. Investigate failures instead of bypassing them. Review any hook changes and verify the resulting commit and remaining worktree status before handoff.
- Push, merge into `main`, deployment, and history rewriting require user authorization covering that action. A push may trigger CI and Vercel; completing local work does not authorize a release. Reuse explicit authorization already given in the session.
- Handoff should identify the branch/worktree, commits, completed checks, remaining acceptance gaps, and any running server or retained test data. Describe only the environments actually verified.
```

## Registro de aplicación

- Aprobación del usuario: "si tiene sentido".
- Se aplicó el contenido propuesto sin cambios en el bloque de Next.js.
- Se verificaron las referencias locales, los scripts de npm y la igualdad entre la propuesta y el archivo aplicado. `git diff --check` pasó.
- Cambio exclusivamente documental. No se ejecutaron checks de la aplicación.
