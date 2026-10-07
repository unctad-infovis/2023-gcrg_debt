# 2023-gcrg_debt

**Live demo** https://unctad-infovis.github.io/2023-gcrg_debt/

## About

Sovereign debt is a growing concern for many developing countries, where governments increasingly spend more on servicing debt than on essential public services like education and health. This project is an interactive "debt wheel" dashboard that lets users select a country or country grouping and compare it against up to two others across 18 debt-related indicators — covering public debt, external public and publicly guaranteed (PPG) debt, debt-service costs, and how government interest payments compare to spending on education and health.

The wheel visualization is built with D3 and falls back to a dot-plot layout on small screens, drawing on data from the IMF World Economic Outlook, International Debt Statistics, and World Bank World Development Indicators, with a screenshot/download feature powered by html2canvas. Content is authored in MDX and rendered as a standalone React application embeddable within UNCTAD's Drupal platform.

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2023-gcrg_debt/js/2023-gcrg_debt.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2023-gcrg_debt/css/2023-gcrg_debt.min.css?v=1">
<div class="app-root-2023-gcrg_debt" id="app-root-2023-gcrg_debt">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to match the current build version to bust the cache.

## Used in

* [A World of Debt](https://unctad.org/publication/world-of-debt)
* [A World of Debt Dashboard](https://unctad.org/publication/world-of-debt/dashboard)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

See `CLAUDE.md` for the component architecture (context provider structure, folder breakdown) and deployment mechanics/gotchas — it's written for whoever picks up this project next, human or AI.

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

Standalone data-maintenance scripts (not part of the app bundle) go to folder `scripts` — see Data workflow below.

## Data files

Four files in `public/assets/data/` drive the whole dashboard: `id_key.csv`, `indicator_key.csv`, `values.csv`, `about.json`. Their columns are consumed more widely, and more subtly, than they look — this is what each one is for and where in the code it's load-bearing.

### `id_key.csv`

Columns: `id, type, region, income, development, LDC, SIDS, id_display, category_display`

Rows are of two kinds, both required:

* **Group rows** (`type` = `region` / `income` / `development` / `LDC` / `SIDS`) — e.g. `Africa,region,…`, `Developed countries,development,…`, `Least developed countries,LDC,…`. Each one is a selectable comparison group, and also has its own aggregate data in `values.csv` under that same `id`.
* **Country rows** (`type` = `country`) — each has `region`, `income` and `development` set to the `id` of the group row it belongs to (e.g. Antigua & Barbuda has `region=Latin America and the Caribbean`, `income=High income`), and `LDC`/`SIDS` set to `0` or `1`.

`FocusContext` (`src/jsx/components/debt_wheel/context/Focus.jsx`) resolves comparisons generically from this shape: `idData.filter(d => d[type] === groupId || +d[type] === 1)`, where `type` is whichever of `region`/`income`/`development`/`LDC`/`SIDS` was selected. That's a single piece of code driving every comparison type in the UI, so it only works if every country row has all five columns filled in consistently with the group rows that exist. `id_display` (shown name) and `category_display` (dropdown section: Region / Income / Development Status / Special Group) are read directly by the country picker (`Filter.FocusMenu.jsx`, `Filter.ComparisonsMenu.jsx`).

### `indicator_key.csv`

Columns: `number, indicator, indicator_full, indicator_key, desire, decimals, indicator_short, format, group, round_digits, max_label, max_overall_label, min, max, min_overall, max_overall`

One row per indicator (18 today), sorted by `number` to set the order of spokes around the wheel. `indicator` and `indicator_key` must be identical (both are used to match rows in `values.csv` and `about.json`). `group` clusters indicators into the six arc segments (`Radial.Pie.jsx`, `Dotplot.jsx`). `format`/`decimals` drive number formatting (`FormatNum.js`); `indicator_short` is the spoke label; `indicator_full` is the panel header and About-tab lookup text.

The four range columns are **not interchangeable** — two different views read two different pairs:

* `min` / `max` and `max_label` — computed from only the *latest-year* rows, used by the radial wheel and swarm plot ("By country" view: `Radial.Spoke.Circle.jsx`, `Radial.Spoke.Axis.jsx`, `Panel.Swarm.jsx`).
* `min_overall` / `max_overall` and `max_overall_label` — computed across *all years*, used by the trend chart ("Trend over time" view: `Panel.Line.jsx`).

`max_label` and `max_overall_label` are **required** — they're not derivable from `min`/`max` by the app at runtime, they must arrive pre-computed from the data author. A file missing this column (as happened once this session) silently breaks the wheel's and swarm's axis scale.

`desire` and `round_digits` are present in the data but **not read anywhere in the current app code** — they exist for the data author's own use when computing `max_label`/`max_overall_label` upstream, not for the app itself.

### `values.csv`

Columns: `latest_year, id, indicator, year, xaxis_display, value`

One row per `(id, indicator, year)`. `value` is a numeric string or the literal string `NA` for missing data (the app checks for both `'NA'` and `''` as "no data" — see `RadialData.jsx`, `SwarmData.jsx`). `xaxis_display` is an optional label for the trend chart's x-axis (`Panel.Line.jsx`, `Tooltip.jsx`); when blank, the chart falls back to showing `year`.

`latest_year='1'` flags the single row used for the "By country" view (radial wheel + swarm plot). **Every `(id, indicator)` pair must have exactly one row with `latest_year='1'`** — including a placeholder row with `value=NA` for an indicator a country simply has no data for. A country with *zero* rows for an indicator (not even an `NA` one) isn't the same as a country with a `value=NA` row: the former makes that entire spoke vanish (axis, scale and all — `Radial.Spoke.Axis.jsx` returns `null` when it finds no row to anchor on), the latter renders a graceful "no data" placeholder. This is exactly the bug `npm run validate-data` / `npm run fill-missing-values` exist for (see Data workflow below).

### `about.json`

`{ "data": [{ "id": "…", "text": "…", "source": "…" }] }` — one entry per indicator. `id` must exactly match that indicator's `indicator_key` value in `indicator_key.csv` (`Panel.About.jsx` looks it up by `aboutData.data.find(d => d.id === metric)`). If an indicator is renamed in `indicator_key.csv` without updating the matching `about.json` entry, that indicator's About tab silently goes blank.

### A hardcoded dependency worth knowing about

`src/jsx/components/debt_wheel/context/Metric.jsx` sets the dashboard's default metric as a literal string: `useState('net_interest_perc_gov_spending')`. This must always equal a real `indicator_key` value in `indicator_key.csv` — if an indicator gets renamed in the data and this isn't updated to match, the initial page load's `metricInfo` lookup returns `undefined` and the swarm/trend/about panels break until the user manually switches metrics.

### Fetching the live production data for comparison

The deployed `values.csv` (and the other data files) can be fetched directly for diffing against a new drop, e.g.:

```
https://storage.unctad.org/2023-gcrg_debt/assets/data/values.csv
https://storage.unctad.org/2023-gcrg_debt/assets/data/indicator_key.csv
https://storage.unctad.org/2023-gcrg_debt/assets/data/id_key.csv
```

This is a different source of truth from the git history of this repo — the two can diverge if a data update was deployed via `npm run sync-prod` without a corresponding commit, so prefer the live URLs over git history when you need to know what's actually in production.

## Data workflow

The data in `public/assets/data/` (`id_key.csv`, `indicator_key.csv`, `values.csv`, `about.json`) is produced externally and dropped into this project — it should arrive ready to use. Fixing bad data is the data authors' job, not something this project's build does automatically.

* **`npm run validate-data`** — read-only check of the three CSVs. Verifies `indicator_key.csv` has all required columns, there are no duplicate `(id, indicator, year)` rows, every country has exactly one `latest_year=1` row per indicator, every `id` referenced in `values.csv` exists in `id_key.csv`, and flags (without touching) any latest-year value that falls outside its indicator's declared `[min, max]` range. It never writes anything — only prints a report. Run it against any new data drop before using it; a failure gives you the exact ids/indicators to send back to the data authors as feedback.
* **`npm run fill-missing-values`** — a manual, on-demand patch for `values.csv`. Backfills any `(country, indicator)` pair that's missing a `latest_year=1` row (adds a `value=NA` placeholder, or re-flags an existing row), because a country with *zero* rows for an indicator makes the radial wheel's spoke vanish entirely instead of showing a graceful "no data" state (`Radial.Spoke.Axis.jsx` returns `null` when it finds no row to anchor on). This is **not run automatically** — no `pre`/`post` npm hooks call it — because silently rewriting data on every build risks masking a real problem or altering data unintentionally. Use it deliberately, as a stopgap while waiting on a corrected export, then re-run `npm run validate-data` to confirm it worked. It only ever adds placeholder rows or flips a `latest_year` flag — it never changes or judges an actual value (e.g. it won't touch outliers; those are a human call).

## Packages

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* **d3** — used to create the wheel; its `d3-dsv` module (`csvParse`/`csvFormat`) is also used directly by `scripts/validate-data.js` and `scripts/fill-missing-values.js` to read/write the data CSVs without adding a separate CSV dependency
* **html2canvas** — used to convert html view into canvas (img)

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components