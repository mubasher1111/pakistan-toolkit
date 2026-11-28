// FBR income tax calculator for SALARIED individuals in Pakistan.
// Slabs come from the Finance Acts for each fiscal year (July–June).
// Tax is: fixed + rate × (income − over). A surcharge (percentage of the tax)
// applies above a threshold in some years.
//
// Salaried slabs apply only when salary is more than 75% of taxable income.
//
// ⚠️ This is an estimate for planning purposes, not tax advice. It ignores
// exemptions, rebates and tax credits.

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
 * Pakistan's fiscal year (July–June) that a date falls in, e.g. 28 Nov 2026 -> '2026-27'.
 * Uses the date's local calendar day.
 * @param {Date|string} [date] Defaults to today.
 */
export function fiscalYearForDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) throw new TypeError('Invalid date');
  const start = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; // July = month 6
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/**
 * Decides which slabs to use. An explicit year wins. Otherwise the fiscal year of `date`
 * (default today) is used; if its slabs are not in this version yet, the latest available
 * year is used and `note` says so, so the answer never silently uses the wrong year.
 */
export function resolveTaxYear({ year, date } = {}) {
  const years = getSupportedYears();
  if (year !== undefined) {
    if (!TAX_SLABS[year]) throw new RangeError(`Unsupported fiscal year "${year}". Supported: ${years.join(', ')}`);
    return { year, source: 'requested', note: null };
  }
  const current = fiscalYearForDate(date);
  if (TAX_SLABS[current]) return { year: current, source: 'current', note: null };
  if (current > LATEST_FISCAL_YEAR) {
    return {
      year: LATEST_FISCAL_YEAR,
      source: 'latest-available',
      note: `The current fiscal year is ${current}, but its slabs are not in this version yet. ` +
        `Showing FY${LATEST_FISCAL_YEAR}. Update the package after the budget for new slabs.`,
    };
  }
  throw new RangeError(`No slabs for FY${current}. Supported: ${years.join(', ')}`);
}

const isAmount = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;

function annualSalaryFrom({ annualIncome, monthlyIncome, salaryPeriods }) {
  const given = [annualIncome, monthlyIncome, salaryPeriods].filter((v) => v !== undefined).length;
  if (given !== 1) throw new TypeError('Provide exactly one of annualIncome, monthlyIncome or salaryPeriods');
  if (salaryPeriods !== undefined) {
    if (!Array.isArray(salaryPeriods) || salaryPeriods.length === 0) throw new TypeError('salaryPeriods must be a non-empty array');
    let months = 0;
    let total = 0;
    for (const p of salaryPeriods) {
      if (!Number.isInteger(p?.months) || p.months < 1 || !isAmount(p?.monthlyIncome)) {
        throw new TypeError('Each salary period needs whole months (1-12) and a non-negative monthlyIncome');
      }
      months += p.months;
      total += p.months * p.monthlyIncome;
    }
    if (months > 12) throw new RangeError(`Salary periods add up to ${months} months; a fiscal year has 12`);
    return total;
  }
  const income = annualIncome ?? monthlyIncome * 12;
  if (!isAmount(income)) throw new TypeError('Provide a non-negative annualIncome or monthlyIncome');
  return income;
}

/**
 * Calculates income tax for a SALARIED individual.
 * @param {object} options
 * @param {number} [options.annualIncome]   Gross annual taxable salary in PKR
 * @param {number} [options.monthlyIncome]  Gross monthly taxable salary in PKR
 * @param {{months:number, monthlyIncome:number}[]} [options.salaryPeriods]
 *        Salary that changed during the year, e.g. [{months:6, monthlyIncome:150000}, {months:6, monthlyIncome:200000}]
 * @param {number} [options.bonus]          Bonus or other lump-sum taxable salary for the year
 * @param {number} [options.otherIncome]    Other income taxed at normal rates (e.g. business or freelance),
 *        NOT rent, bank profit, dividends or capital gains, which are taxed separately
 * @param {number} [options.taxDeducted]    Tax already deducted (e.g. by the employer) for the year
 * @param {string} [options.year]           Fiscal year, e.g. '2026-27' (default: the current fiscal year)
 * @param {Date|string} [options.date]      Date used to pick the current fiscal year (default: today)
 */
export function calculateSalaryTax({
  annualIncome, monthlyIncome, salaryPeriods, bonus = 0, otherIncome = 0, taxDeducted, year, date,
} = {}) {
  const resolved = resolveTaxYear({ year, date });
  const table = TAX_SLABS[resolved.year];
  if (!isAmount(bonus)) throw new TypeError('bonus must be a non-negative number');
  if (!isAmount(otherIncome)) throw new TypeError('otherIncome must be a non-negative number');
  if (taxDeducted !== undefined && !isAmount(taxDeducted)) throw new TypeError('taxDeducted must be a non-negative number');

  const salary = annualSalaryFrom({ annualIncome, monthlyIncome, salaryPeriods }) + bonus;
  const income = salary + otherIncome;
  const salaryShare = income === 0 ? 100 : (salary / income) * 100;
  // Salaried rates apply only when salary is MORE than 75% of taxable income.
  if (otherIncome > 0 && salary <= income * 0.75) {
    const err = new RangeError(
      `Salary is ${round(salaryShare)}% of taxable income (Rs ${round(salary)} of Rs ${round(income)}). ` +
      'Salaried slabs apply only when salary is more than 75% of taxable income, so the non-salaried ' +
      "individual slabs apply instead. This calculator covers salaried slabs only.");
    err.code = 'NOT_SALARIED';
    throw err;
  }

  const slabIndex = table.slabs.findIndex((s) => income <= s.upTo);
  const slab = table.slabs[slabIndex];
  const baseTax = slab.fixed + slab.rate * (income - slab.over);
  const surcharge =
    table.surcharge && income > table.surcharge.threshold ? baseTax * table.surcharge.rate : 0;
  const annualTax = baseTax + surcharge;

  const result = {
    year: resolved.year,
    taxYear: table.taxYear,
    yearSource: resolved.source,
    yearNote: resolved.note,
    annualIncome: round(salary),
    monthlyIncome: round(salary / 12),
    otherIncome: round(otherIncome),
    taxableIncome: round(income),
    salaryShare: round(salaryShare),
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
  if (taxDeducted !== undefined) {
    const balance = round(annualTax - taxDeducted);
    result.taxDeducted = round(taxDeducted);
    result.balance = balance;
    result.balanceStatus = balance > 0 ? 'payable' : balance < 0 ? 'refundable' : 'settled';
  }
  return result;
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
