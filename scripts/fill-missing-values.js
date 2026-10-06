// Manual, on-demand patch for public/assets/data/values.csv — NOT run automatically.
//
// The radial wheel groups circles per indicator from rows where latest_year===1
// (see src/jsx/components/debt_wheel/context/RadialData.jsx). If a country has
// zero rows for an indicator, it contributes no circle at all, and
// Radial.Spoke.Axis.jsx's `if (!focus) return null` wipes out the entire spoke
// (axis, scale, labels) instead of showing a graceful "no data" placeholder.
//
// This script backfills that gap: any missing (country, indicator) pair gets a
// `value=NA` placeholder row, and any pair with historical rows but no row
// flagged latest_year=1 gets its most recent row re-flagged. It only fills
// structural gaps — it never touches or judges real values (e.g. outliers).
//
// This is a temporary workaround for a specific data export, not a permanent
// fix: the data authors own getting their export to already include one row per
// (country, indicator), and `npm run validate-data` is what confirms whether
// that's true for a given file. Run this script by hand, only when you've
// decided a given export needs patching before it's usable, and re-run
// `npm run validate-data` afterwards to confirm the patch worked.
//
// Run with: npm run fill-missing-values

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { csvFormat, csvParse } from 'd3';

const dataDir = fileURLToPath(new URL('../public/assets/data/', import.meta.url));

const idKey = csvParse(readFileSync(`${dataDir}id_key.csv`, 'utf8'));
const indicatorKey = csvParse(readFileSync(`${dataDir}indicator_key.csv`, 'utf8'));
const valuesPath = `${dataDir}values.csv`;
const values = csvParse(readFileSync(valuesPath, 'utf8'));
const columns = values.columns;

const countries = idKey.filter(d => d.type === 'country').map(d => d.id);
const indicators = indicatorKey.map(d => d.indicator_key);

const byPair = new Map();
for (const row of values) {
  const key = `${row.id}\u0000${row.indicator}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(row);
}

// typical "latest" year per indicator = mode of year among existing latest_year=1 rows
const yearMode = {};
for (const indicator of indicators) {
  const counts = new Map();
  for (const row of values) {
    if (row.indicator === indicator && row.latest_year === '1') {
      counts.set(row.year, (counts.get(row.year) || 0) + 1);
    }
  }
  let best = '2025';
  let bestCount = -1;
  for (const [year, count] of counts) {
    if (count > bestCount) {
      best = year;
      bestCount = count;
    }
  }
  yearMode[indicator] = best;
}

let added = 0;
let reflagged = 0;

for (const id of countries) {
  for (const indicator of indicators) {
    const key = `${id}\u0000${indicator}`;
    const pairRows = byPair.get(key) || [];

    if (pairRows.length === 0) {
      values.push({
        latest_year: '1',
        id,
        indicator,
        year: yearMode[indicator],
        xaxis_display: '',
        value: 'NA'
      });
      added += 1;
      continue;
    }

    if (!pairRows.some(row => row.latest_year === '1')) {
      const mostRecent = pairRows.reduce((a, b) => (Number(b.year) > Number(a.year) ? b : a));
      mostRecent.latest_year = '1';
      reflagged += 1;
    }
  }
}

if (added > 0 || reflagged > 0) {
  writeFileSync(valuesPath, csvFormat(values, columns));
}

console.log(`fill-missing-values: added ${added} placeholder row(s), re-flagged ${reflagged} row(s) as latest_year=1`);
