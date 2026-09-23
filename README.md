# Coronabingo

Next.js Pages Router application using React 18, Webpack and npm.

## Local setup

Use Node **24.21.0** and npm **11.19.0** (bundled with this Node release):

```bash
nvm install
nvm use
npm ci
cp .env.template .env
```

Fill in `.env` with the Firebase project configuration from its owner. Firebase authentication and Firestore are required for login and gameplay. Google Analytics and Sentry settings are optional. Keep `.env` private; environment values exposed by `next.config.js` are included in the browser bundle and must not contain server credentials.

A local server or Vercel preview uses whichever Firebase project `.env` points to. Use a test project or agreed test records before creating rooms, registering players, or editing events.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). To use another port, run `npm run dev -- --port 3124`. Edit routes in `pages/`; translations live in `locales/es` and `locales/en`. Spanish is the default locale. Existing `/es/…` and `/en/…` links remain accepted; Next.js generates unprefixed Spanish navigation URLs.

## Checks and production build

```bash
npm run lint:check
npm run validate-locales
npm run validate-tickets
npm run build
npm run start
```

`lint:check` includes TypeScript and does not modify files. `lint` and the pre-commit hook retain their existing autofix behavior. Inspect the ticket validator's output as well as its exit code: the legacy script catches assertion failures.

Run build and start sequentially. Do not run an install, a development server and a production build against the same checkout concurrently.

Use `ANALYZE_BUNDLE=1 npm run build` to write bundle reports under `.next/analyze/`. CI enables this and uploads the HTML reports as the `bundle-reports` artifact, retained for 14 days. These replace the failing Packtracker upload; they provide per-build inspection without Packtracker's historical comparisons or budgets.

Cypress and its legacy suite have been removed. No automated browser suite remains, and `npm test` is no longer defined. Use the explicit checks above; they do not verify gameplay in a browser. See the [removal record](research/cypress-removal-plan.md).

## Migration status

The primary branch is `main`, tracking `origin/main`. GitHub's default branch and Vercel's production branch use `main`; the Vercel project runtime is Node 24.

CI reads `.nvmrc`, installs with `npm ci`, runs `lint:check`, then builds with locale validation and uploads bundle reports. [CI verification](research/node-24-ci.md) and [Vercel preview acceptance](research/node-24-preview.md) cover the verified application. Standalone admin/event checks were excluded by request.

See the [migration plan](research/node-24-main-migration-plan.md) and [release record](research/node-24-release.md) for production verification. The user waived development test-room cleanup and pre-release rollback verification, and will handle rollback in Vercel if needed.

ESLint 9 is retained temporarily by agreement because the current React and accessibility plugins do not declare ESLint 10 compatibility. Replace or upgrade those plugins and move to a supported ESLint release in a follow-up. Other legacy dependency maintenance is outside this migration.
