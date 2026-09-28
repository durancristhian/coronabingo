# Task workflow

[AGENTS.md](../../AGENTS.md) defines authorization and data boundaries; [README.md](../../README.md) owns setup and test commands.

## Prepare

1. Inspect `pwd`, branch, `git status --short`, and `git worktree list`. Check the task record, code, and PRs; reuse completed work and task worktrees.
2. Record acceptance criteria, exclusions, dependencies, and a fixed base SHA. Briefly report the plan and risks before editing.
3. For independent work, fetch `origin`, verify `origin/main`, and create a sibling worktree:

   ```bash
   git fetch origin
   git rev-parse origin/main
   git worktree add -b codex/<slug> ../coronabingo-worktrees/<slug> origin/main
   ```

   Replace placeholders. Dependent work uses its agreed base. If fetching fails, report the local base's freshness before relying on it.
4. Bootstrap each new worktree before implementation or analysis: copy `.env` from the local checkout used to create it, without printing values or overwriting a destination. This is owner-approved when both checkouts target the same environment. Resolve a missing source or existing destination before continuing. Copying `.env` does not isolate Firebase.
5. Activate `.nvmrc`, run `npm ci`, and confirm Node/npm satisfy the runtime files. Setup is complete only when installation succeeds. Keep `node_modules`, Next.js output, and TypeScript caches local to each checkout.

## Implement and verify

- For an exploration of design or asset quality, prepare a local comparison with originals, alternatives, and relevant measurements. Apply the chosen alternative after approval. Remove temporary demos when their review purpose is complete.
- Before starting a server, check port availability. Use `npm run dev -- --port <port>` and record checkout, branch, URL, and process ownership. Use that URL for checks and manual review.
- Run installation, development, type generation, and builds sequentially within a checkout. Stop its development server before building; run `npm run start -- --port <port>` only after a successful build. The UI runner also needs exclusive access to its fixed ports across worktrees.

## Commit and review

1. Stage only task-owned changes and the corresponding tracker update. Review `git diff --cached` and `git diff --cached --check`; exclude secrets, generated output, and browser state.
2. Commit coherent, verified chunks using `fix:`, `feat:`, `perf:`, or `docs:`. Let hooks run, investigate failures, inspect autofixes, and verify the resulting commit and worktree status.
3. Review against the fixed base and originating requirements, covering both repository standards and requested behavior. When using `$code-review`, supply the base SHA and canonical specification; commit first so its comparison against `HEAD` includes the implementation.
4. Correct justified in-scope findings, repeat affected checks, and record the reviewed HEAD. Keep optional suggestions separate. Renew affected reviews when code or base changes.

## Publish when authorized

Push the task branch, open a PR against its verified base, and link it to the active thread when supported. Describe the problem, resulting behavior, validation, and remaining gaps. Include a Preview link for user review.

Monitor GitHub and Vercel checks to a terminal result and read available review comments. Fix in-scope failures and repeat affected checks after pushing. Verify the affected Preview journey under the standing gameplay permission. Distinguish a ready deployment from tested functionality and report any acceptance gap.

## Multiple tickets

Use this section when the user selects the principal-PR workflow:

- Create `codex/<work>/main` from verified `origin/main`, with a draft principal PR targeting `main`. Ticket branches use `codex/<work>/<ticket>` and target the integration branch. A branch named `codex/<work>` cannot coexist with branches beneath that prefix.
- Start each successive ticket from the accepted integration HEAD. Merge ticket PRs into that branch only under authorization for that workflow, after their criteria, reviews, and checks pass. Record the new base and verify the combined result.
- Keep the principal PR current with incorporated tickets, evidence, and gaps. It leaves draft when technical work is complete. Its merge to `main` remains a separate authorized action. This workflow is not a native stack.
- Models, delegation, budgets, and retry limits belong to the execution. Report missing required capabilities without silent substitutions. Preserve blocked work; continue independent tasks from valid bases.
- At phase changes, record ticket, dependencies, phase, worktree, branch, base/HEAD, PR, evidence, and next action. Keep private state unversioned. On resumption, reconcile with Git/GitHub, reuse work, and preserve consumed budgets.

## Merge, verify, and clean up when authorized

1. Fetch the target branch, check the PR's current base/HEAD, and resolve in-scope conflicts. Preserve concurrent work. Renew affected checks and reviews; absence of conflicts alone does not establish merge readiness. History rewriting requires its own authorization and protection against the expected remote SHA.
2. Merge only after applicable checks, reviews, and repository rules pass. When Production release is authorized, verify the deployment corresponds to the integrated revision and exercise the affected flow within the authorized data scope. Report deployment and functional results separately.
3. Update a clean local `main` with a fast-forward and verify it matches fetched `origin/main`. Preserve local changes or divergence and report anything preventing the update.
4. When cleanup is requested, identify only this task's resources. Confirm integration using PR/merge evidence, including for squash merges, and ensure all changes are committed. Stop owned processes, preserve required evidence and local files, and remove worktrees with `git worktree remove <path>`. Delete only integrated or explicitly authorized task branches, local and remote. Never force removal to discard unfinished work.
5. Report revision, checks, environment, cleanup, and gaps. Retain work awaiting review or integration.
