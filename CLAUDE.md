# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) — and to any developer taking over this project — when working with code in this repository.

## Project

An interactive "debt wheel" dashboard (not a multi-slide MDX storyboard, despite using the same UNCTAD Vite + React + MDX template as other projects in this org). `src/Article.mdx` is a one-liner that renders a single component, `<DebtWheel />` — all real content and interactivity lives in `src/jsx/components/debt_wheel/`.

The dashboard lets a user pick a country or country-grouping ("focus") and compare it against up to two others across 18 debt-related indicators, shown as a radial wheel (desktop) or a dot-plot (small screens — see `viewPort.js`'s `smScreen`). A right-hand panel shows three views per selected indicator: by-country swarm plot, trend-over-time line chart, and an About tab with indicator-specific text.

## Commands

```bash
npm run start           # Dev server (auto-opens browser)
npm run start_public    # Dev server accessible over the network
npm run build            # Production build → dist/
npm run preview          # Preview the production build locally
npm run format            # Format with Biome (run after edits)
npm run lint:fix          # Lint + auto-fix with Biome
npm run validate-data     # Read-only check of the data files — run before using any new data drop
npm run fill-missing-values  # Manual, on-demand patch for values.csv — see "Data" below, do not automate this
```

No test framework exists in this project.

## Code style (Biome)

- Indentation: 2 spaces
- Line width: **320 characters** — do not wrap lines at 80/100; Biome will not flag long lines
- JS/JSX: single quotes in JS, double quotes for JSX attributes
- Trailing commas: none
- Semicolons: always

## Architecture

- `src/Article.mdx` → renders `<DebtWheel />` (`src/jsx/components/debt_wheel/DebtWheel.jsx`), the app root.
- `public/assets/data/` — CSV and JSON data loaded client-side at runtime (not bundled). See "Data" below.
- `__PROJECT_NAME__` — a Vite-injected global (from `package.json` name) used in asset paths and DOM IDs.

**Context provider nesting** (`DebtWheel.jsx`) — data flows top-down through React Context, no external state library:

```
StaticDataContextProvider   (loads all 4 data files once)
  FocusContextProvider       (selected country/group + up to 2 comparisons)
    MetricContextProvider     (selected indicator)
      PanelContextProvider     (which of the 3 panel tabs is active)
        RadialDataContextProvider → <Dotplot> or <Radial>  (by-country wheel/dotplot)
        <Panel>
          SwarmDataContextProvider → <Swarm> | <Line> | <About>  (right-hand panel)
```

- `radial/` — the desktop wheel (`Radial.jsx`, `Radial.Pie.*`, `Radial.Spoke.*`, `Radial.Center.jsx`).
- `dotplot/` — the small-screen fallback layout.
- `panel/` — the right-hand panel and its three tabs (`Panel.Swarm.jsx`, `Panel.Line.jsx`, `Panel.About.jsx`).
- `filters/` — the focus/comparison country pickers and the "How does X compare to Y" sentence.
- `context/` — the providers listed above.
- `helpers/` — `FormatNum.js` (number formatting by `format`/`decimals` from `indicator_key.csv`), `viewPort.js`, `InvisibleArc.js`.

**BasePath logic** (`@unctad-infovis/general-tools`' `BasePath`/`resolveAsset`, used via `LoadFile`): auto-detects environment —
- `unctad.org` host → Azure Storage paths
- `localhost` → relative paths
- anything else → GitHub Pages paths

Do not hardcode asset paths; use the BasePath helper.

## Data

The data schema (`id_key.csv`, `indicator_key.csv`, `values.csv`, `about.json`), the validation/fill scripts, and the full workflow are documented in **README.md → "Data files" and "Data workflow"** — read that before touching any data file. The short version:

- Data arrives from an external author and should be dropped in as-is. **Do not hand-edit or "fix" data content yourself** (wrong values, outliers, etc.) — that's the author's job; report problems back to them instead. See `npm run validate-data`.
- `npm run fill-missing-values` is a manual, on-demand structural patch (backfills missing `latest_year=1` rows) — it is **not** wired into any `pre`/`post` npm hook on purpose. Don't add that automation back; a previous attempt at it was explicitly reverted because silently rewriting data on every build risks masking real problems.
- Three load-bearing cross-file dependencies that silently break if out of sync:
  1. `about.json`'s `id` values must exactly match `indicator_key.csv`'s `indicator_key` values (`Panel.About.jsx` looks up by exact match).
  2. `src/jsx/components/debt_wheel/context/Metric.jsx` hardcodes the default metric as a literal string — it must be a real `indicator_key` value.
  3. Every `(country, indicator)` pair in `values.csv` needs exactly one `latest_year=1` row (even an explicit `NA` one) — a country with *zero* rows for an indicator makes that entire spoke vanish instead of showing "no data" (`Radial.Spoke.Axis.jsx` returns `null` when it finds no row to anchor on).

## Deployment

Two separate targets, both triggered via npm scripts:

| Target | Command | Requires |
|--------|---------|---------|
| GitHub Pages | `npm run sync-gh-pages` | git subtree push; `origin` remote (GitHub) |
| Azure Blob Storage | `npm run sync-prod` | `azcopy` installed; `AZURE_STORAGE_NAME` env var; `npm run login` first |

Always run `npm run build` before either deploy command.

**Important gotcha:** `npm run sync-gh-pages` runs `git subtree push --prefix dist origin gh-pages`, which reads from **committed git history**, not the working tree. `dist/` is tracked in this repo specifically so this works. If you build but forget to `git add dist/ && git commit` first, the subtree push will silently redeploy the *previous* build — it won't fail, it'll just push stale content. Sequence that works:

```bash
# after committing your source/data changes:
npm run build
git add dist/ && git commit -m "Build: ..."
git push && git push unctad main   # or: npm run push
npm run sync-gh-pages
```

Verify a deploy actually landed by diffing against the remote branch directly (bypasses any CDN cache):
```bash
git fetch origin gh-pages
diff <(git show origin/gh-pages:assets/data/values.csv) public/assets/data/values.csv
```

This project has two git remotes (`origin` on GitHub, `unctad` on Azure DevOps) — `npm run push` pushes to both; after pushing, verify both point at the same commit with `git ls-remote origin main` / `git ls-remote unctad main`.
