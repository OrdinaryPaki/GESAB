# Foundation Lock

## Purpose

Foundation prevents workers from creating separate brands, separate headers, separate footers, or conflicting spacing systems.

Build foundation before worker implementation begins.

Do not spawn implementation workers until foundation exists in code and Header/Footer/PageShell have been browser-checked against the reference.

## Foundation Includes

- font setup
- typography scale
- line heights
- colors
- backgrounds
- spacing rhythm
- container widths
- grid rules
- border radius
- shadows/borders
- Header
- Footer
- PageShell or section wrapper
- nav behavior
- buttons/cards primitives
- animation defaults
- responsive breakpoints

## Output Files

Write:

```text
.visual-clone/blueprint/design-foundation.v1.json
.visual-clone/blueprint/foundation.lock.json
```

The lock must name:

- foundation version
- files/components considered global
- what workers may not silently change
- change request process

## Lock Rule

After foundation lock, workers must not silently modify:

- global CSS variables
- global font setup
- Header
- Footer
- PageShell
- global animation defaults
- shared layout primitives

If a worker believes a global change is required, it submits a foundation change request.

Main must reject or review any worker report that changed global foundation files without an approved foundation change request.

## Foundation Change Gate

Workers may request global changes. Workers may not apply them silently.

Main reviews the request:

- If rejected, the worker solves locally without global mutation.
- If approved, main creates a new foundation version, e.g. `foundation.v2`, updates the lock, and broadcasts rebaseline instructions.

Hard limits:

- global foundation change requires screenshot or DOM evidence
- global foundation change must be approved by main
- workers cannot final-report against a stale foundation version for affected areas
- default max is 2 global foundation rebaselines per run
- after v2, only P0 global fixes may trigger v3 unless user explicitly overrides

## Request Schema

```xml
<foundation_change_request>
  <mission_id>about-page</mission_id>
  <foundation_version>foundation.v1</foundation_version>
  <issue>Global header height appears shorter than reference.</issue>
  <evidence>
    <reference_screenshot>...</reference_screenshot>
    <local_screenshot>...</local_screenshot>
    <measured_difference>...</measured_difference>
  </evidence>
  <requested_change>Increase header vertical padding globally.</requested_change>
  <affected_components>Header, PageShell</affected_components>
</foundation_change_request>
```
