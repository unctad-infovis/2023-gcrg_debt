// Read-only data validator. Checks public/assets/data/{id_key,indicator_key,values}.csv
// for structural problems and prints a report — it never modifies any file.
//
// The data files are expected to arrive ready-to-use from the data authors. This
// script exists to compile concrete, actionable feedback to send back to them
// (exact ids/indicators/rows), not to patch the files ourselves. Content/judgment
// calls (e.g. whether a value is a genuine outlier) are flagged for human review,
// never auto-resolved.
//
// Run with: npm run validate-data

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { csvParse } from 'd3';

const dataDir = fileURLToPath(new URL('../public/assets/data/', import.meta.url));
const read = name => csvParse(readFileSync(`${dataDir}${name}`, 'utf8'));

const idKey = read('id_key.csv');
const indicatorKey = read('indicator_key.csv');
const values = read('values.csv');

const countries = idKey.filter(d => d.type === 'country').map(d => d.id);
const indicators = indicatorKey.map(d => d.indicator_key);
const indicatorInfo = new Map(indicatorKey.map(d => [d.indicator_key, d]));
const idSet = new Set(idKey.map(d => d.id));

let failed = false;
const section = title => console.log(`\n--- ${title} ---`);
const fail = msg => {
  failed = true;
  console.log(`  FAIL: ${msg}`);
};
const ok = msg => console.log(`  ok: ${msg}`);

// 1. indicator_key.csv required columns
section('indicator_key.csv structure');
const requiredColumns = ['number', 'indicator', 'indicator_full', 'indicator_key', 'desire', 'decimals', 'indicator_short', 'format', 'group', 'round_digits', 'max_label', 'max_overall_label', 'min', 'max', 'min_overall', 'max_overall'];
const missingColumns = requiredColumns.filter(c => !indicatorKey.columns.includes(c));
if (missingColumns.length > 0) {
  fail(`missing column(s): ${missingColumns.join(', ')}`);
} else {
  ok('all required columns present');
}

// 2. duplicate (id, indicator, year) rows
section('duplicate rows');
const seen = new Map();
for (const row of values) {
  const key = `${row.id}\u0000${row.indicator}\u0000${row.year}`;
  seen.set(key, (seen.get(key) || 0) + 1);
}
const dupes = [...seen.entries()].filter(([, count]) => count > 1);
if (dupes.length > 0) {
  fail(
    `${dupes.length} duplicate (id, indicator, year) combo(s), e.g. ${dupes
      .slice(0, 5)
      .map(([k]) => k.replaceAll('\u0000', '/'))
      .join('; ')}`
  );
} else {
  ok('no duplicate (id, indicator, year) rows');
}

// 3. row completeness: every (country, indicator) should have exactly one latest_year=1 row
section('row completeness (latest_year=1 coverage)');
const latestCount = new Map();
const byPair = new Map();
for (const row of values) {
  const key = `${row.id}\u0000${row.indicator}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(row);
  if (row.latest_year === '1') latestCount.set(key, (latestCount.get(key) || 0) + 1);
}
const zeroRows = [];
const noLatestFlag = [];
const multiLatestFlag = [];
for (const id of countries) {
  for (const indicator of indicators) {
    const key = `${id}\u0000${indicator}`;
    const pairRows = byPair.get(key) || [];
    const count = latestCount.get(key) || 0;
    if (pairRows.length === 0) zeroRows.push([id, indicator]);
    else if (count === 0) noLatestFlag.push([id, indicator]);
    else if (count > 1) multiLatestFlag.push([id, indicator]);
  }
}
if (zeroRows.length > 0) {
  fail(
    `${zeroRows.length} (country, indicator) pair(s) with zero rows at all, e.g. ${zeroRows
      .slice(0, 5)
      .map(([a, b]) => `${a}/${b}`)
      .join('; ')}`
  );
} else {
  ok('every (country, indicator) pair has at least one row');
}
if (noLatestFlag.length > 0) {
  fail(
    `${noLatestFlag.length} pair(s) have rows but none flagged latest_year=1, e.g. ${noLatestFlag
      .slice(0, 5)
      .map(([a, b]) => `${a}/${b}`)
      .join('; ')}`
  );
} else {
  ok('every pair with data has a latest_year=1 row');
}
if (multiLatestFlag.length > 0) {
  fail(
    `${multiLatestFlag.length} pair(s) have more than one row flagged latest_year=1, e.g. ${multiLatestFlag
      .slice(0, 5)
      .map(([a, b]) => `${a}/${b}`)
      .join('; ')}`
  );
} else {
  ok('no pair has more than one latest_year=1 row');
}

// 4. orphan ids: values.csv rows referencing an id not in id_key.csv
section('orphan ids');
const orphanIds = new Set();
for (const row of values) {
  if (!idSet.has(row.id)) orphanIds.add(row.id);
}
if (orphanIds.size > 0) {
  fail(`${orphanIds.size} id(s) in values.csv not found in id_key.csv: ${[...orphanIds].slice(0, 10).join(', ')}`);
} else {
  ok('every id in values.csv exists in id_key.csv');
}

// 5. latest-year values outside the indicator's declared [min, max] — flagged for review, not auto-fixed
section('possible outliers (latest_year=1 value outside declared [min, max]) — for human review');
const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const outliers = [];
for (const row of values) {
  if (row.latest_year !== '1') continue;
  const v = toNumber(row.value);
  if (v === null) continue;
  const info = indicatorInfo.get(row.indicator);
  if (!info) continue;
  const min = toNumber(info.min);
  const max = toNumber(info.max);
  if ((max !== null && v > max + 1e-6) || (min !== null && v < min - 1e-6)) {
    outliers.push(`${row.indicator}/${row.id}: ${v} outside [${min}, ${max}]`);
  }
}
if (outliers.length > 0) {
  console.log(`  ${outliers.length} value(s) fall outside their indicator's declared range — review, don't auto-fix:`);
  for (const line of outliers.slice(0, 20)) console.log(`    ${line}`);
} else {
  ok('no latest-year values fall outside their indicator’s declared range');
}

console.log(`\n${failed ? 'FAILED — see above for what to send back to the data authors.' : 'All structural checks passed.'}`);
process.exit(failed ? 1 : 0);
