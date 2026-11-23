import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidCNIC, formatCNIC, parseCNIC, maskCNIC,
  isValidPhone, formatPhone, parsePhone, getOperator,
  isValidIBAN, formatIBAN, parseIBAN, getBankFromIBAN,
  isValidNTN, formatNTN, getNTNType,
} from '../src/index.js';

test('CNIC: accepts dashed and plain forms', () => {
  assert.equal(isValidCNIC('35202-1234567-3'), true);
  assert.equal(isValidCNIC('3520212345673'), true);
  assert.equal(isValidCNIC(' 35202 1234567 3 '), true);
});

test('CNIC: rejects bad input', () => {
  for (const bad of ['', null, undefined, '3520212345', '35202-123456-73', '9520212345673',
    '0520212345673', '1111111111111', 'abcde-fghijkl-m']) {
    assert.equal(isValidCNIC(bad), false, `expected invalid: ${bad}`);
  }
});

test('CNIC: parse, format, mask', () => {
  assert.equal(formatCNIC('3520212345673'), '35202-1234567-3');
  assert.deepEqual(parseCNIC('42101-1234567-8'), {
    valid: true,
    digits: '4210112345678',
    formatted: '42101-1234567-8',
    region: 'Sindh',
    gender: 'female',
  });
  assert.equal(parseCNIC('35202-1234567-3').gender, 'male');
  assert.equal(parseCNIC('35202-1234567-3').region, 'Punjab');
  assert.equal(maskCNIC('3520212345673'), '35202-*******-3');
  assert.equal(parseCNIC('nope').valid, false);
});

test('Phone: accepts common formats', () => {
  for (const ok of ['03001234567', '0300-1234567', '+923001234567', '923001234567',
    '00923001234567', '3001234567', '+92 300 1234567', '(0300) 123-4567']) {
    assert.equal(isValidPhone(ok), true, `expected valid: ${ok}`);
    assert.equal(formatPhone(ok), '+923001234567');
  }
});

test('Phone: rejects non-mobile / malformed', () => {
  for (const bad of ['0421234567', '0300123456', '030012345678', '+913001234567', 'abc', '']) {
    assert.equal(isValidPhone(bad), false, `expected invalid: ${bad}`);
  }
});

test('Phone: styles and operators', () => {
  assert.equal(formatPhone('03211234567', 'local'), '0321-1234567');
  assert.equal(formatPhone('03211234567', 'international'), '+92 321 1234567');
  assert.equal(formatPhone('03211234567', 'whatsapp'), '923211234567');
  assert.equal(getOperator('03001234567'), 'Jazz');
  assert.equal(getOperator('03151234567'), 'Zong');
  assert.equal(getOperator('03331234567'), 'Ufone');
  assert.equal(getOperator('03451234567'), 'Telenor');
  assert.equal(getOperator('03551234567'), 'SCO');
  assert.equal(getOperator('03901234567'), 'Unknown');
  assert.deepEqual(parsePhone('0345 1234567'), {
    valid: true, e164: '+923451234567', local: '0345-1234567', operator: 'Telenor',
  });
});

test('IBAN: validates checksum', () => {
  assert.equal(isValidIBAN('PK36SCBL0000001123456702'), true);
  assert.equal(isValidIBAN('pk36 scbl 0000 0011 2345 6702'), true);
  assert.equal(isValidIBAN('PK36SCBL0000001123456703'), false); // checksum broken
  assert.equal(isValidIBAN('PK36SCBL00000011234567'), false); // too short
  assert.equal(isValidIBAN('GB82WEST12345698765432'), false); // not Pakistani
});

test('IBAN: format, parse, bank lookup', () => {
  assert.equal(formatIBAN('PK36SCBL0000001123456702'), 'PK36 SCBL 0000 0011 2345 6702');
  const info = parseIBAN('PK36SCBL0000001123456702');
  assert.equal(info.bankCode, 'SCBL');
  assert.equal(info.accountNumber, '0000001123456702');
  assert.equal(info.bank.short, 'SCB');
  assert.equal(getBankFromIBAN('PK36SCBL0000001123456702').name, 'Standard Chartered Bank (Pakistan) Limited');
  assert.equal(getBankFromIBAN('invalid'), null);
});

test('NTN: classic and CNIC-based', () => {
  assert.equal(isValidNTN('1234567-8'), true);
  assert.equal(isValidNTN('12345678'), true);
  assert.equal(formatNTN('12345678'), '1234567-8');
  assert.equal(getNTNType('3520212345673'), 'cnic');
  assert.equal(formatNTN('3520212345673'), '35202-1234567-3');
  assert.equal(isValidNTN('123'), false);
  assert.equal(getNTNType(''), null);
});
