# Operating Model

## Mental Model

This skill is not a prompt copied to every worker. It is the operating protocol.

Main reads the skill, creates run state, locks shared design foundation, creates mission packets, starts workers, receives structured reports, gates global changes, integrates output, and runs final QA.

Workers receive concrete missions. They build and verify their assigned page or template. They do not independently redefine the site's global design.

## Run State

Create `.visual-clone/` in the project:

```text
.visual-clone/
  run.json
  reference/screenshots/
  blueprint/
    route-map.json
    template-families.json
    design-foundation.v1.json
    foundation.lock.json
    mission-board.json
  missions/
  reports/
  change-requests/
  screenshot-manifest.json
```

Use these files as shared memory for the run. Do not rely on conversation memory alone.

## Project Mode

If the current folder has a project, follow its existing framework, router, styling system, and docs.

If the folder is empty, default to a production-grade Next.js App Router project with TypeScript, componentized sections, shared CSS variables/design tokens, and data-driven templates.

## Access Limits

Use this skill for public or locally accessible pages. If the reference requires login, private session state, CAPTCHA, bot-blocked access, or permissioned assets, report blocked and ask for an allowed access path. Do not pretend browser evidence exists.

## Dev Server Policy

Main identifies the dev command before workers run.

Single worktree mode:

- main starts one canonical local dev server
- workers use the same local URL only if they are not editing concurrently

Worktree mode:

- each worker must use a unique port or a main-assigned local URL
- worker reports must include the local URL used for screenshots
- if a worker cannot run its local route, it reports `blocked`

## Worktree Permission

Invoking `$visual-site-cloner <url>` grants explicit permission to create temporary local Git worktrees and `codex/visual-site-cloner-*` branches for this run when parallel worker implementation is useful.

This satisfies project rules that require explicit user permission for branches/worktrees. It does not override project rules that absolutely forbid branches/worktrees with no exception.

The permission does not include pushing, pull requests, destructive Git commands, deleting user changes, or external production changes.

If the user says `main-worktree only`, `no worktrees`, or equivalent, use sequential missions in the main worktree.

For parallel implementation, prefer separate Git worktrees per worker.

## Roles

Main:

- discovers rendered site structure
- classifies routes/templates
- creates and locks foundation
- creates mission packets
- starts workers
- reviews worker reports
- approves or rejects foundation changes
- integrates final output
- performs final browser QA

Worker:

- reads mission packet and blueprint files
- opens assigned reference route(s)
- builds assigned page/template
- verifies with screenshots
- fixes P0/P1 deviations
- requests global changes instead of silently applying them
- reports in the required schema

## Stop Condition

Complete only when the integrated site has no unresolved P0/P1 deviations on required routes/templates. P2 deviations may remain if documented and visually minor.
