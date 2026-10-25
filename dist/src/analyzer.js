import { criteria, combinationRules } from './criteria.js';

export function analyzeReport(input = {}) {
  const results = Object.entries(input).map(([id, raw]) => {
    const config = criteria[id];
    if (!config) return { id, name: id, value: raw?.value ?? raw, unit: raw?.unit ?? '', status: 'unsupported', reason: `“${id}” is not a supported demo measurement.` };
    const value = typeof raw === 'object' && raw !== null ? raw.value : raw;
    const unit = typeof raw === 'object' && raw !== null ? raw.unit : config.unit;
    const base = { id, name: config.name, value, unit, expectedUnit: config.unit, interval: [config.low, config.high], source: config.source, context: config.context };
    if (value === '' || value === null || value === undefined) return { ...base, status: 'invalid', reason: 'Enter a numeric value to analyze this measurement.' };
    if (typeof value !== 'number' || !Number.isFinite(value)) return { ...base, status: 'invalid', reason: 'The value must be a finite number.' };
    if (unit !== config.unit) return { ...base, status: 'invalid', reason: `Unit mismatch: this criterion expects ${config.unit}; received ${unit || 'no unit'}. No comparison was made.` };
    const status = value < config.low ? 'below' : value > config.high ? 'above' : 'within';
    const intervalText = `${config.low}–${config.high} ${config.unit}`;
    const reason = status === 'within'
      ? `${value} ${unit} is within the inclusive illustrative interval (${intervalText}).`
      : `The entered value, ${value} ${unit}, is ${status} the configured illustrative interval (${intervalText}). This numerical difference does not establish a diagnosis or its cause.`;
    return { ...base, status, reason };
  });
  const byId = Object.fromEntries(results.map(result => [result.id, result]));
  const rules = combinationRules.map(rule => {
    const a = byId.glucose, b = byId.hba1c;
    const triggered = Boolean(a && b && a.status !== 'invalid' && b.status !== 'invalid' && a.status !== 'unsupported' && b.status !== 'unsupported' && a.value > 99 && b.value > 5.6);
    return { ...rule, triggered, values: { glucose: a?.value, hba1c: b?.value }, conditions: [`Fasting blood glucose > 99 mg/dL (entered: ${a?.value ?? 'not provided'} mg/dL)`, `HbA1c > 5.6% (entered: ${b?.value ?? 'not provided'}%)`] };
  });
  const counts = { total: results.filter(r => criteria[r.id] && r.status !== 'invalid').length, within: 0, below: 0, above: 0, issues: 0, combinations: rules.filter(r => r.triggered).length };
  results.forEach(r => { if (r.status in counts) counts[r.status]++; else if (r.status === 'invalid' || r.status === 'unsupported') counts.issues++; });
  return { results, rules, counts };
}

export function buildSignalMap(analysis) {
  const nodes = analysis.results.filter(r => criteria[r.id]).map(r => ({ id: r.id, name: r.name, value: r.value, unit: r.unit, status: r.status }));
  const links = analysis.rules.filter(r => r.triggered).map(r => ({ id: r.id, source: r.measurements[0], target: r.measurements[1], label: r.name }));
  return { nodes, links };
}
