import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryTax, compareSalaryTax, getSupportedYears, TAX_SLABS } from '../src/index.js';

test('tax: slab fixed amounts are continuous for every year', () => {
  for (const [year, { slabs }] of Object.entries(TAX_SLABS)) {
    for (let i = 1; i < slabs.length; i++) {
      const prev = slabs[i - 1];
      const taxAtPrevTop = prev.fixed + prev.rate * (prev.upTo - prev.over);
      assert.equal(slabs[i].fixed, Math.round(taxAtPrevTop), `${year} slab ${i + 1}`);
      assert.equal(slabs[i].over, prev.upTo, `${year} slab ${i + 1} lower bound`);
    }
  }
});

test('tax: zero below Rs 600,000', () => {
  assert.equal(calculateSalaryTax({ annualIncome: 600_000 }).annualTax, 0);
  assert.equal(calculateSalaryTax({ monthlyIncome: 50_000 }).annualTax, 0);
  assert.equal(calculateSalaryTax({ annualIncome: 0 }).effectiveRate, 0);
});

test('tax: FY2026-27 matches published examples', () => {
  // Rs 110,000/month -> Rs 1,600/month
  assert.equal(calculateSalaryTax({ monthlyIncome: 110_000, year: '2026-27' }).monthlyTax, 1_600);
  // Rs 1,000,000/month -> Rs 264,500/month (35% band, no surcharge)
  const high = calculateSalaryTax({ monthlyIncome: 1_000_000, year: '2026-27' });
  assert.equal(high.monthlyTax, 264_500);
  assert.equal(high.surcharge, 0);
  assert.equal(high.slab, 8);
  assert.equal(high.marginalRate, 35);
});

test('tax: FY2025-26 applies 9% surcharge above Rs 10M', () => {
  const r = calculateSalaryTax({ annualIncome: 12_000_000, year: '2025-26' });
  assert.equal(r.baseTax, 3_381_000);
  assert.equal(r.surcharge, 304_290);
  assert.equal(r.annualTax, 3_685_290);
});

test('tax: FY2024-25 slab 3', () => {
  // 30,000 + 15% of (1,800,000 - 1,200,000) = 120,000
  assert.equal(calculateSalaryTax({ annualIncome: 1_800_000, year: '2024-25' }).annualTax, 120_000);
});

test('tax: compare years', () => {
  const c = compareSalaryTax({ monthlyIncome: 300_000, from: '2025-26', to: '2026-27' });
  // 3.6M: 2025-26 -> 346,000 + 30% * 400,000 = 466,000 ; 2026-27 -> 316,000 + 25% * 400,000 = 416,000
  assert.equal(c.from.annualTax, 466_000);
  assert.equal(c.to.annualTax, 416_000);
  assert.equal(c.annualSaving, 50_000);
});

test('tax: input validation', () => {
  assert.throws(() => calculateSalaryTax({ annualIncome: -1 }), TypeError);
  assert.throws(() => calculateSalaryTax({}), TypeError);
  assert.throws(() => calculateSalaryTax({ annualIncome: 1, year: '1999-00' }), RangeError);
  assert.deepEqual(getSupportedYears(), ['2024-25', '2025-26', '2026-27']);
});

// ---------- v1.1 ----------
import { fiscalYearForDate, resolveTaxYear } from '../src/index.js';

test('tax: fiscal year from date (July start)', () => {
  assert.equal(fiscalYearForDate(new Date(2026, 10, 28)), '2026-27');
  assert.equal(fiscalYearForDate(new Date(2026, 5, 30)), '2025-26');
  assert.equal(fiscalYearForDate(new Date(2026, 6, 1)), '2026-27');
  assert.equal(fiscalYearForDate(new Date(2099, 7, 1)), '2099-00');
  assert.throws(() => fiscalYearForDate('nope'), TypeError);
});

test('tax: default year follows the date and says when it falls back', () => {
  assert.deepEqual(resolveTaxYear({ date: new Date(2026, 1, 1) }), { year: '2025-26', source: 'current', note: null });
  const r = calculateSalaryTax({ monthlyIncome: 200_000, date: new Date(2026, 10, 28) });
  assert.equal(r.year, '2026-27');
  assert.equal(r.yearSource, 'current');
  assert.equal(r.yearNote, null);
  const later = calculateSalaryTax({ monthlyIncome: 200_000, date: new Date(2027, 7, 1) });
  assert.equal(later.year, '2026-27');
  assert.equal(later.yearSource, 'latest-available');
  assert.match(later.yearNote, /2027-28.*not in this version/);
  assert.equal(calculateSalaryTax({ monthlyIncome: 200_000, year: '2025-26' }).yearSource, 'requested');
  assert.throws(() => calculateSalaryTax({ monthlyIncome: 1, date: new Date(2020, 0, 1) }), RangeError);
});

test('tax: salary that changes mid-year, plus bonus', () => {
  // 6 x 150,000 + 6 x 200,000 + 300,000 bonus = 2,400,000 -> 116,000 + 20% x 200,000 = 156,000
  const r = calculateSalaryTax({
    salaryPeriods: [{ months: 6, monthlyIncome: 150_000 }, { months: 6, monthlyIncome: 200_000 }],
    bonus: 300_000, year: '2026-27',
  });
  assert.equal(r.annualIncome, 2_400_000);
  assert.equal(r.annualTax, 156_000);
  // joined mid-year: only 4 months of salary
  assert.equal(calculateSalaryTax({ salaryPeriods: [{ months: 4, monthlyIncome: 300_000 }], year: '2026-27' }).annualTax, 6_000);
  assert.throws(() => calculateSalaryTax({ salaryPeriods: [{ months: 8, monthlyIncome: 1 }, { months: 5, monthlyIncome: 1 }] }), RangeError);
  assert.throws(() => calculateSalaryTax({ salaryPeriods: [{ months: 0.5, monthlyIncome: 1 }] }), TypeError);
  assert.throws(() => calculateSalaryTax({ monthlyIncome: 1, annualIncome: 12 }), TypeError);
});

test('tax: 75% salary rule with other income', () => {
  // 2,000,000 salary + 400,000 freelance = 2,400,000 taxable; salary 83.33% -> salaried slabs on the total
  const r = calculateSalaryTax({ annualIncome: 2_000_000, otherIncome: 400_000, year: '2026-27' });
  assert.equal(r.taxableIncome, 2_400_000);
  assert.equal(r.salaryShare, 83.33);
  assert.equal(r.annualTax, 156_000);
  // exactly 75% is not "more than 75%"
  assert.throws(() => calculateSalaryTax({ annualIncome: 1_500_000, otherIncome: 500_000 }),
    (e) => e.code === 'NOT_SALARIED' && /75%/.test(e.message));
});

test('tax: tax already deducted -> payable or refundable', () => {
  const payable = calculateSalaryTax({ monthlyIncome: 200_000, taxDeducted: 150_000, year: '2026-27' });
  assert.deepEqual([payable.annualTax, payable.balance, payable.balanceStatus], [156_000, 6_000, 'payable']);
  const refund = calculateSalaryTax({ monthlyIncome: 200_000, taxDeducted: 160_000, year: '2026-27' });
  assert.deepEqual([refund.balance, refund.balanceStatus], [-4_000, 'refundable']);
  assert.equal(calculateSalaryTax({ monthlyIncome: 200_000, taxDeducted: 156_000, year: '2026-27' }).balanceStatus, 'settled');
  assert.equal(calculateSalaryTax({ monthlyIncome: 200_000 }).balance, undefined);
});
