# Dashboard validation

`2026-09-30.json` records the v16 pre-publication data, licence, link, archive, model and browser checks. It does not assert publication or deployment success; those must be checked against the remote commit and live site after each push.

`check_dashboard.cjs` runs the prepared repository files in a headless Chromium browser without publishing them. Use an installed Playwright package and browser in the cloud:

```bash
RACEBOARD_ROOT=/absolute/path/to/repository node motorsport/validation/check_dashboard.cjs
```

Set `RACEBOARD_CHROMIUM` to an available Chromium executable if Playwright's bundled browser is unavailable. `RACEBOARD_EVIDENCE` optionally selects a temporary evidence directory (default `/tmp/raceboard-browser-evidence`). The curated cloud runtime can provide Playwright through `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.

The harness deliberately blocks external requests while serving the prepared files on a temporary virtual origin. It tests page JavaScript, spoiler defaults/reveal/hide, independent per-series state, event-specific persistence, unavailable/malformed/legacy storage, keyboard tabs and checkbox control, accessibility-tree exclusion, loaded local images, earlier-result access and mobile page overflow. Screenshots allow separate visual inspection. External links are verified separately against their actual URLs.

The v16 tests used Chromium 154.0.8037.92 at 1280×1000, 390×844 and 320×844. There was no physical screen-reader test; DOM hidden/inert behaviour, accessibility snapshots and keyboard operation were checked.
