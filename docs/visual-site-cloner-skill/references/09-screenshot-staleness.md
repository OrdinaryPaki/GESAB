# Screenshot Staleness

Every screenshot record must include:

- mission_id
- route
- viewport
- reference_url or local_route
- foundation_version
- worktree or branch
- commit, hash, or checkpoint id
- timestamp
- screenshot type: reference or local

Store records in:

```text
.visual-clone/screenshot-manifest.json
```

## Stale Conditions

A local screenshot is stale if:

- foundation version changed for affected components/routes
- worktree or branch was rebased
- commit/checkpoint changed after screenshot capture
- local route implementation changed after screenshot capture
- dev server build changed after screenshot capture
- screenshot was captured before worker repair

Reference screenshots are stale if:

- the reference route visibly changed
- the viewport or browser state differs from the required QA state
- the screenshot was captured before accepting cookie/banner/menu state that affects layout

## Rules

Stale screenshots cannot be used as final evidence.

If foundation changes from `foundation.v1` to `foundation.v2`, all local screenshots for affected routes/components using `foundation.v1` are stale.

Affected workers must rebaseline only affected sections unless the route is broken. They must not continue optimizing against stale screenshots.

Worker reports using stale screenshots are invalid.
