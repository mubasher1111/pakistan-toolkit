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
