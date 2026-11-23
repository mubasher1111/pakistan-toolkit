import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatLakh, formatPKR, toShortPKR, numberToWords, amountToWords,
  provinces, cities, banks, getCitiesByProvince, findBank,
} from '../src/index.js';

test('formatLakh groups the South Asian way', () => {
  assert.equal(formatLakh(0), '0');
  assert.equal(formatLakh(999), '999');
  assert.equal(formatLakh(1000), '1,000');
  assert.equal(formatLakh(150000), '1,50,000');
  assert.equal(formatLakh(123456789), '12,34,56,789');
  assert.equal(formatLakh(-2500000), '-25,00,000');
  assert.equal(formatLakh(1234.5, 2), '1,234.50');
  assert.equal(formatLakh('abc'), null);
});

test('formatPKR', () => {
  assert.equal(formatPKR(150000), 'Rs 1,50,000');
  assert.equal(formatPKR(150000, { symbol: 'PKR' }), 'PKR 1,50,000');
  assert.equal(formatPKR(-500), '-Rs 500');
  assert.equal(formatPKR(99.5, { decimals: 2 }), 'Rs 99.50');
});

test('toShortPKR', () => {
  assert.equal(toShortPKR(500), '500');
  assert.equal(toShortPKR(1500), '1.5 thousand');
  assert.equal(toShortPKR(2_500_000), '25 lakh');
  assert.equal(toShortPKR(150_000_000), '15 crore');
  assert.equal(toShortPKR(2_000_000_000), '2 arab');
});

test('numberToWords', () => {
  assert.equal(numberToWords(0), 'Zero');
  assert.equal(numberToWords(15), 'Fifteen');
  assert.equal(numberToWords(105), 'One Hundred Five');
  assert.equal(numberToWords(100000), 'One Lakh');
  assert.equal(numberToWords(123456789), 'Twelve Crore Thirty Four Lakh Fifty Six Thousand Seven Hundred Eighty Nine');
  assert.equal(numberToWords(1_000_000_000), 'One Arab');
});

test('amountToWords (cheque style)', () => {
  assert.equal(amountToWords(1), 'One Rupee Only');
  assert.equal(amountToWords(150250.5), 'One Lakh Fifty Thousand Two Hundred Fifty Rupees and Fifty Paisa Only');
  assert.equal(amountToWords(2500000, { only: false }), 'Twenty Five Lakh Rupees');
});

test('data integrity', () => {
  assert.equal(provinces.length, 7);
  const codes = new Set(provinces.map((p) => p.code));
  for (const c of cities) assert.ok(codes.has(c.province), `${c.name} has unknown province`);
  for (const p of provinces) {
    assert.ok(cities.some((c) => c.name === p.capital), `capital ${p.capital} missing from cities`);
  }
  const bankCodes = banks.map((b) => b.code);
  assert.equal(new Set(bankCodes).size, bankCodes.length, 'duplicate bank code');
  for (const code of bankCodes) assert.match(code, /^[A-Z]{4}$/);
});

test('data helpers', () => {
  assert.ok(getCitiesByProvince('Sindh').some((c) => c.name === 'Karachi'));
  assert.ok(getCitiesByProvince('pk-pb').some((c) => c.name === 'Lahore'));
  assert.deepEqual(getCitiesByProvince('Narnia'), []);
  assert.equal(findBank('hbl').code, 'HABB');
  assert.equal(findBank('MEZN').short, 'Meezan');
  assert.equal(findBank('nope'), null);
});
