# Worktree And Merge Protocol

Use worktree mode only when the project is a Git repo and worktrees are allowed by the invocation contract and project rules.

If project instructions say to work only in the main worktree or main branch unless explicitly asked, invoking `$visual-site-cloner` counts as that explicit ask for temporary local visual-cloner worktrees and branches.

If project instructions absolutely forbid branches or worktrees with no exception, obey them.

## Dirty Working Tree Policy

Before creating worktrees or an integration baseline, main must inspect Git status.

If uncommitted user changes exist:

- do not overwrite them
- do not reset them
- do not delete them
- record them in `.visual-clone/run.json`
- prefer a non-destructive checkpoint if allowed
- otherwise run in sequential main-worktree mode or report blocked

Workers must never assume uncommitted files are disposable.

## Worktree Mode

1. Main creates or confirms the shared foundation in the base worktree.
2. Main creates a checkpoint commit or explicit integration baseline before workers start.
3. Main creates one local worktree/branch per worker from that baseline.
4. Workers implement only their assigned mission in their worktree.
5. Workers run browser QA against their assigned local URL/port.
6. Workers submit structured reports.
7. Workers must not merge themselves.
8. Main integrates one worker output at a time.

Use branch names under:

```text
codex/visual-site-cloner-{mission-id}
```

This permission does not allow pushing or pull requests.

## Integration Gate

After each worker integration, main runs:

- build/typecheck when available
- route-level browser QA for the integrated route
- duplicate Header/Footer check
- global token/foundation mutation check
- screenshot staleness check

If integration changes foundation, main must create a new foundation version and mark affected screenshots stale.

## Sequential Fallback

If worktrees are unavailable or prohibited:

- run one mission at a time
- keep mission packets and reports separate
- do not start the next mission while global foundation changes are unresolved
- still apply all worker report and screenshot evidence rules
