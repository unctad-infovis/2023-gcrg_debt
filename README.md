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

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

## Packages

The following packages are used in this project by default.

### Project specific

* **d3** — used to create the wheel
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