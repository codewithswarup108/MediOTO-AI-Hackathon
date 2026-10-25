// Illustrative prototype intervals only. They are not clinical reference ranges.
export const criteria = {
  hemoglobin: { name: 'Hemoglobin', unit: 'g/dL', low: 12, high: 17.5, source: 'Illustrative demo interval', context: ['age', 'sex', 'pregnancy status'], group: 'blood' },
  wbc: { name: 'White blood cells', unit: '×10⁹/L', low: 4, high: 11, source: 'Illustrative demo interval', context: ['age'], group: 'blood' },
  platelets: { name: 'Platelets', unit: '×10⁹/L', low: 150, high: 400, source: 'Illustrative demo interval', context: ['age'], group: 'blood' },
  glucose: { name: 'Fasting blood glucose', unit: 'mg/dL', low: 70, high: 99, source: 'Illustrative demonstration threshold; fasting status required', context: ['fasting status'], group: 'glucose' },
  hba1c: { name: 'HbA1c', unit: '%', low: 4, high: 5.6, source: 'Illustrative demonstration threshold', context: ['age', 'clinical context'], group: 'glucose' },
  total_cholesterol: { name: 'Total cholesterol', unit: 'mg/dL', low: 0, high: 199, source: 'Illustrative demo interval', context: ['age', 'cardiovascular risk context'], group: 'lipids' },
  ldl: { name: 'LDL cholesterol', unit: 'mg/dL', low: 0, high: 99, source: 'Illustrative demo interval', context: ['individual risk context'], group: 'lipids' },
  hdl: { name: 'HDL cholesterol', unit: 'mg/dL', low: 40, high: 100, source: 'Illustrative demo interval', context: ['age', 'sex'], group: 'lipids' },
  triglycerides: { name: 'Triglycerides', unit: 'mg/dL', low: 0, high: 149, source: 'Illustrative demo interval', context: ['fasting status'], group: 'lipids' },
  creatinine: { name: 'Creatinine', unit: 'mg/dL', low: 0.6, high: 1.3, source: 'Illustrative demo interval', context: ['age', 'sex', 'body size'], group: 'kidney' }
};

export const samples = {
  normal: { title: 'Within-range example', id: 'DEMO-1042', values: { hemoglobin: 14.2, wbc: 6.4, platelets: 245, glucose: 91, hba1c: 5.2, total_cholesterol: 176, ldl: 92, hdl: 56, triglycerides: 118, creatinine: 0.9 } },
  mixed: { title: 'Mixed-results example', id: 'DEMO-2087', values: { hemoglobin: 11.2, wbc: 6.8, platelets: 438, glucose: 108, hba1c: 5.4, total_cholesterol: 214, ldl: 134, hdl: 48, triglycerides: 168, creatinine: 1.1 } },
  combined: { title: 'Combined-indicator example', id: 'DEMO-3016', values: { hemoglobin: 14.1, wbc: 7.2, platelets: 264, glucose: 112, hba1c: 5.8, total_cholesterol: 181, ldl: 96, hdl: 52, triglycerides: 124, creatinine: 0.95 } }
};

export const combinationRules = [{
  id: 'glucose_pair_review', name: 'Related glucose measurements', measurements: ['glucose', 'hba1c'], units: ['mg/dL', '%'],
  trigger: 'Fasting glucose > 99 mg/dL AND HbA1c > 5.6%', requiredContext: ['verified fasting status', 'age', 'clinical context'],
  explanation: 'Multiple related glucose measurements meet the configured review criteria. Their interpretation depends on clinical context and applicable testing criteria. Consider discussing these results with a qualified healthcare professional.',
  limitation: 'This illustrative rule is not a diagnostic criterion. Values, testing methods, and clinical context can change interpretation.'
}];
