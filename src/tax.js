// FBR income tax calculator for SALARIED individuals in Pakistan.
// Slabs come from the Finance Acts for each fiscal year (July–June).
// Tax is: fixed + rate × (income − over). A surcharge (percentage of the tax)
// applies above a threshold in some years.
//
// ⚠️ This is an estimate for planning purposes, not tax advice. It ignores
// exemptions, rebates, tax credits, and withholding adjustments.

export const TAX_SLABS = {
  // FY2024-25 (Tax Year 2025) — Finance Act 2024
  '2024-25': {
    taxYear: 2025,
    slabs: [
      { upTo: 600_000, fixed: 0, rate: 0, over: 0 },
      { upTo: 1_200_000, fixed: 0, rate: 0.05, over: 600_000 },
      { upTo: 2_200_000, fixed: 30_000, rate: 0.15, over: 1_200_000 },
      { upTo: 3_200_000, fixed: 180_000, rate: 0.25, over: 2_200_000 },
      { upTo: 4_100_000, fixed: 430_000, rate: 0.30, over: 3_200_000 },
      { upTo: Infinity, fixed: 700_000, rate: 0.35, over: 4_100_000 },
    ],
    surcharge: { threshold: 10_000_000, rate: 0.10 },
  },
  // FY2025-26 (Tax Year 2026) — Finance Act 2025
  '2025-26': {
    taxYear: 2026,
    slabs: [
      { upTo: 600_000, fixed: 0, rate: 0, over: 0 },
      { upTo: 1_200_000, fixed: 0, rate: 0.01, over: 600_000 },
      { upTo: 2_200_000, fixed: 6_000, rate: 0.11, over: 1_200_000 },
      { upTo: 3_200_000, fixed: 116_000, rate: 0.23, over: 2_200_000 },
      { upTo: 4_100_000, fixed: 346_000, rate: 0.30, over: 3_200_000 },
      { upTo: Infinity, fixed: 616_000, rate: 0.35, over: 4_100_000 },
    ],
    surcharge: { threshold: 10_000_000, rate: 0.09 },
  },
  // FY2026-27 (Tax Year 2027) — Finance Act 2026. Surcharge removed for salaried.
  '2026-27': {
    taxYear: 2027,
    slabs: [
      { upTo: 600_000, fixed: 0, rate: 0, over: 0 },
      { upTo: 1_200_000, fixed: 0, rate: 0.01, over: 600_000 },
      { upTo: 2_200_000, fixed: 6_000, rate: 0.11, over: 1_200_000 },
      { upTo: 3_200_000, fixed: 116_000, rate: 0.20, over: 2_200_000 },
      { upTo: 4_100_000, fixed: 316_000, rate: 0.25, over: 3_200_000 },
      { upTo: 5_600_000, fixed: 541_000, rate: 0.29, over: 4_100_000 },
      { upTo: 7_000_000, fixed: 976_000, rate: 0.32, over: 5_600_000 },
      { upTo: Infinity, fixed: 1_424_000, rate: 0.35, over: 7_000_000 },
    ],
    surcharge: null,
  },
};

export const LATEST_FISCAL_YEAR = '2026-27';

/** Lists supported fiscal years, e.g. ['2024-25', '2025-26', '2026-27']. */
export function getSupportedYears() {
  return Object.keys(TAX_SLABS);
}

const round = (n) => Math.round(n * 100) / 100;

/**
 * Calculates salaried income tax.
 * @param {object} options
 * @param {number} [options.annualIncome]  Gross annual taxable salary in PKR
 * @param {number} [options.monthlyIncome] Gross monthly taxable salary in PKR
 * @param {string} [options.year]          Fiscal year, e.g. '2026-27' (default: latest)
 */
export function calculateSalaryTax({ annualIncome, monthlyIncome, year = LATEST_FISCAL_YEAR } = {}) {
  const table = TAX_SLABS[year];
  if (!table) {
    throw new RangeError(`Unsupported fiscal year "${year}". Supported: ${getSupportedYears().join(', ')}`);
  }
  let income = annualIncome ?? (monthlyIncome !== undefined ? monthlyIncome * 12 : undefined);
  if (typeof income !== 'number' || !Number.isFinite(income) || income < 0) {
    throw new TypeError('Provide a non-negative annualIncome or monthlyIncome');
  }

  const slabIndex = table.slabs.findIndex((s) => income <= s.upTo);
  const slab = table.slabs[slabIndex];
  const baseTax = slab.fixed + slab.rate * (income - slab.over);
  const surcharge =
    table.surcharge && income > table.surcharge.threshold ? baseTax * table.surcharge.rate : 0;
  const annualTax = baseTax + surcharge;

  return {
    year,
    taxYear: table.taxYear,
    annualIncome: round(income),
    monthlyIncome: round(income / 12),
    baseTax: round(baseTax),
    surcharge: round(surcharge),
    annualTax: round(annualTax),
    monthlyTax: round(annualTax / 12),
    annualTakeHome: round(income - annualTax),
    monthlyTakeHome: round((income - annualTax) / 12),
    effectiveRate: income === 0 ? 0 : round((annualTax / income) * 100),
    marginalRate: slab.rate * 100,
    slab: slabIndex + 1,
  };
}

/** Compares the same salary across two fiscal years. */
export function compareSalaryTax({ annualIncome, monthlyIncome, from = '2025-26', to = LATEST_FISCAL_YEAR } = {}) {
  const a = calculateSalaryTax({ annualIncome, monthlyIncome, year: from });
  const b = calculateSalaryTax({ annualIncome, monthlyIncome, year: to });
  return {
    from: a,
    to: b,
    annualSaving: round(a.annualTax - b.annualTax),
    monthlySaving: round(a.monthlyTax - b.monthlyTax),
  };
}
