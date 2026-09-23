# Node 24 production release

Date: 2026-09-23. Status: production release complete and main-game smoke checks passed.

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

- [Production](https://coronabingo.com.ar) serves deployment `dpl_8j8S9eynofmksrCJgTVc99MZpK27`, commit `0e8e1dc6c2c1f13cebc1e3a16eb40a9685ac79b5`. Vercel reports READY, target production, custom-domain alias assigned, and deployed function runtime `nodejs24.x`.
- The deployed bundle uses the existing production Firebase project `coronabingo-bf16f`.
- [CI run 35896693379](https://github.com/durancristhian/coronabingo/actions/runs/35896693379) passed on the release commit: clean install, typecheck/lint, locale validation/build and bundle-report upload. Logs identify Node 24.21.0/npm 11.19.0.
- GitHub's native rename also triggered a run of the historical commit's Node 12 workflow. Run `35896602418` failed during job setup before application execution. The new release run above passed. Automated Dependabot maintenance runs are separate from the migration CI acceptance.
- On the production domain, Spanish home, English switching including the News heading, and English refresh passed.
- Created the synthetic room `X3rfWwSBtvwL71jzpTTl`, named `Node24 release verification 20260923`, with `Release QA Host` and `Release QA Player`. Both joined through the shared lobby and received tickets. Host drew 28; the player received it without refresh, switched to Spanish, and retained it after refresh.
- Restart returned the host to room setup and the player to the waiting screen. Replay resumed gameplay with an empty draw.
- Five home/lobby HTTP routes returned 200 and the expected document language; the sampled MP3 returned 200 with `audio/mpeg`.
- The production player screenshot was visually inspected. No browser console errors were observed in host/player tabs. The deployment-specific Vercel error-log query for the preceding 15 minutes returned no entries. These are bounded smoke observations, not a guarantee of every runtime path.
- Checks used separate tabs in one Chrome profile. Standalone admin/event paths were not tested. Full preview gameplay and its proof boundaries remain in [the preview report](node-24-preview.md).
- No cleanup or rollback verification was attempted in this release step, following the user's instruction. The synthetic production room contains no real participant data.

Evidence is in [node24-release-evidence](node24-release-evidence/README.md). The closeout documentation/evidence commit remains local so recording results does not trigger another identical application deployment.

## API references

- [GitHub native branch rename](https://docs.github.com/en/rest/branches/branches#rename-a-branch).
- [Vercel project update](https://vercel.com/docs/rest-api/projects/update-an-existing-project).
- [Vercel's production-branch client implementation](https://github.com/vercel/terraform-provider-vercel/blob/main/client/project.go).
