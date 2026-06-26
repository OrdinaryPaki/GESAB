# Worktree And Merge Protocol

Use worktree mode only when the project is a Git repo and worktrees are allowed by the invocation contract and project rules.

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
