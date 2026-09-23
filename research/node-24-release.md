# Node 24 production release

Date: 2026-09-23. Status: branch/settings cutover complete; production deployment and smoke verification pending.

## Authorization and scope

The user authorized the next release step after main-game preview acceptance. They explicitly waived development test-room cleanup and rollback verification, and will handle rollback in Vercel if needed. This supersedes the earlier rollback gate in the migration plan and historical reports. Standalone `/admin` and `/eventos` checks remain excluded.

## Branch and provider changes

- GitHub native rename changed `master` to `main`, preserving remote commit `002046108df164389ea8b446de495c7913c500fe` before the migration push.
- Local primary branch renamed to `main`, tracking `origin/main`; `origin/HEAD` points to `main`.
- Vercel production branch explicitly changed to `main`; project Node version changed to `24.x`. No environment variables were changed.
- Recheck found no branch rules/protection, no environment branch restrictions, no deploy hooks and no open PRs to retarget.
- Merged the verified migration into the local primary branch while preserving the user's documentation-only `Plans` commit `62c1e30`. Application/configuration files match CI/preview-tested commit `47918fc`; other changes are documentation and evidence.
- Previous production deployment: `dpl_94TcP2sYDzaNgEVnJdhvbQCSeW2H`, application commit `002046108df164389ea8b446de495c7913c500fe`.

## Verification

Production results will be recorded after the push. Preview gameplay evidence remains in [the preview report](node-24-preview.md).

## API references

- [GitHub native branch rename](https://docs.github.com/en/rest/branches/branches#rename-a-branch).
- [Vercel project update](https://vercel.com/docs/rest-api/projects/update-an-existing-project).
- [Vercel's production-branch client implementation](https://github.com/vercel/terraform-provider-vercel/blob/main/client/project.go).
