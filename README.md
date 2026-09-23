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

Cypress remains disabled in CI and its old suite has not been restored. On a machine inheriting `ELECTRON_RUN_AS_NODE=1`, unset that variable before launching Cypress.

## Migration status

The application migration is present on local `master` and `migrate/node24`. The Actions update is on `migrate/node24-ci`: CI reads `.nvmrc`, installs with `npm ci`, runs `lint:check`, then builds with locale validation and uploads bundle reports. See [CI verification](research/node-24-ci.md) for results and remaining checks.

The GitHub default and production branch remain `master`; the planned rename to `main` and Vercel cutover are separate steps. See the [migration plan](research/node-24-main-migration-plan.md) and [implementation evidence](research/node-24-implementation.md).

ESLint 9 is retained temporarily by agreement because the current React and accessibility plugins do not declare ESLint 10 compatibility. Replace or upgrade those plugins and move to a supported ESLint release in a follow-up. Other legacy dependency maintenance is outside this migration.
