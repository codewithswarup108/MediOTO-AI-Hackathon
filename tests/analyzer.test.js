import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeReport, buildSignalMap } from '../src/analyzer.js';
import { samples, criteria } from '../src/criteria.js';

test('classifies below, above, and within interval values', () => {
  const a = analyzeReport({ hemoglobin: 11, wbc: 12, platelets: 250 });
  assert.deepEqual(a.results.map(r => r.status), ['below', 'above', 'within']);
});
test('interval boundaries are inclusive', () => {
  const a = analyzeReport({ hemoglobin: criteria.hemoglobin.low, wbc: criteria.wbc.high });
  assert.deepEqual(a.results.map(r => r.status), ['within', 'within']);
});
test('rejects missing and non-finite values', () => {
  const a = analyzeReport({ hemoglobin: '', wbc: Number.NaN, platelets: Infinity });
  assert.ok(a.results.every(r => r.status === 'invalid'));
  assert.equal(a.counts.issues, 3);
});
test('flags unsupported identifiers and incompatible units', () => {
  const a = analyzeReport({ unknown_test: 5, glucose: { value: 100, unit: 'mmol/L' } });
  assert.equal(a.results[0].status, 'unsupported');
  assert.equal(a.results[1].status, 'invalid');
  assert.match(a.results[1].reason, /Unit mismatch/);
});
test('combination review triggers only when both exact criteria are met', () => {
  assert.equal(analyzeReport({ glucose: 112, hba1c: 5.8 }).rules[0].triggered, true);
  assert.equal(analyzeReport({ glucose: 112, hba1c: 5.6 }).rules[0].triggered, false);
  assert.equal(analyzeReport({ glucose: 99, hba1c: 5.8 }).rules[0].triggered, false);
});
test('all three fictional samples compute their expected overview and map', () => {
  const normal = analyzeReport(samples.normal.values);
  const mixed = analyzeReport(samples.mixed.values);
  const combined = analyzeReport(samples.combined.values);
  assert.equal(normal.counts.within, 10);
  assert.equal(normal.counts.combinations, 0);
  assert.equal(mixed.counts.below, 1);
  assert.equal(mixed.counts.above, 5);
  assert.equal(mixed.counts.combinations, 0);
  assert.equal(combined.counts.combinations, 1);
  assert.equal(buildSignalMap(combined).links.length, 1);
  assert.equal(buildSignalMap(normal).links.length, 0);
});
test('edited values are reanalyzed and summary counts stay consistent', () => {
  const changed = { ...samples.combined.values, glucose: 90 };
  const a = analyzeReport(changed);
  assert.equal(a.rules[0].triggered, false);
  assert.equal(a.counts.total, a.results.filter(r => r.status !== 'invalid').length);
  assert.equal(a.counts.above, a.results.filter(r => r.status === 'above').length);
});
