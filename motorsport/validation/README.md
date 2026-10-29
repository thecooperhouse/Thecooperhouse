# Dashboard validation

`standings-reference.json` is an independently checked official ranking snapshot. Refresh its complete order and points from the official sources whenever standings change, including countback order for ties. The browser suite compares every standings and championship-analysis row against it and checks nonmutating sorting and row-order-independent clinch calculations.

## Cloud runner

`.github/workflows/motorsport-validation.yml` installs pinned Playwright 1.64.1, Chromium and the required Linux libraries on a GitHub-hosted runner. It runs when motorsport files change on a branch or pull request, and can also be started manually. There is no cron schedule and no dependency on the owner's computer. Its repository permission is read-only; it cannot publish or merge.

For maintenance, prepare the complete update on a branch, including the exact previous-page archive and all new photo assets. Inspect the workflow for the candidate commit, wait for success, download its evidence and visually review desktop and mobile screenshots. Only then recheck `main` and fast-forward it without force. If `main` moved, incorporate that work and rerun validation. A push-only test on `main` is too late to serve as the pre-publication gate: GitHub Pages publishes `main` independently.

The artifact `motorsport-checks-<commit SHA>` contains `checks.json` and screenshots, or failure evidence when available. **Revealed screenshots contain spoilers.** Artifacts are retained for 30 days. Preserve the JSON report in a dated repository validation file during maintenance; it records the commit, page SHA-256, Playwright/browser versions and checks actually performed. Do not report a missing browser or an absent workflow as a successful test.

The keyboard checks now follow the actual Tab and Shift+Tab order to both watched controls, check visible focus, use Space to reveal and hide, and exercise Arrow keys, Home and End on the series tabs. They also check spoiler state and new-event protection for both series. Earlier-result counts come from the current page's event data rather than a fixed round number. These are browser checks, not a physical screen-reader audit.

To reproduce in a cloud environment with network access:

```bash
npm install --prefix motorsport/validation --no-save --package-lock=false --ignore-scripts --no-audit --no-fund playwright@1.64.1
cd motorsport/validation
npx --no-install playwright install --with-deps chromium
node check_dashboard.cjs
```

If a restricted maintenance runtime cannot download a browser, use the GitHub runner instead of repeatedly skipping the checks. Report the exact permission or Actions failure if that route is unavailable. This harness verifies local image decoding, but licence review, external links, factual research, probability checks and post-deployment inspection remain separate required work.

## Existing validation records

`2026-09-30.json` records the v16 pre-publication data, licence, link, archive, model and browser checks. It does not assert publication or deployment success; those must be checked against the remote commit and live site after each push.

`check_dashboard.cjs` runs the prepared repository files in a headless Chromium browser without publishing them. Use an installed Playwright package and browser in the cloud:

```bash
RACEBOARD_ROOT=/absolute/path/to/repository node motorsport/validation/check_dashboard.cjs
```

Set `RACEBOARD_CHROMIUM` to an available Chromium executable if Playwright's bundled browser is unavailable. `RACEBOARD_EVIDENCE` optionally selects a temporary evidence directory (default `/tmp/raceboard-browser-evidence`). The curated cloud runtime can provide Playwright through `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.

The harness deliberately blocks external requests while serving the prepared files on a temporary virtual origin. It tests page JavaScript, spoiler defaults/reveal/hide, independent per-series state, event-specific persistence, unavailable/malformed/legacy storage, keyboard tabs and checkbox control, accessibility-tree exclusion, loaded local images, earlier-result access and mobile page overflow. Screenshots allow separate visual inspection. External links are verified separately against their actual URLs.

The v16 tests used Chromium 154.0.8037.92 at 1280×1000, 390×844 and 320×844. There was no physical screen-reader test; DOM hidden/inert behaviour, accessibility snapshots and keyboard operation were checked.

