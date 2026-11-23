// Pakistani IBAN helpers.
// Structure: PK + 2 check digits + 4-letter bank code + 16-digit account number
// Total length: 24 characters. Validated with the ISO 13616 mod-97 checksum.

import { banks } from './data.js';

const BANK_BY_CODE = new Map(banks.map((b) => [b.code, b]));
const PATTERN = /^PK\d{2}[A-Z]{4}\d{16}$/;

function normalize(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[\s-]/g, '').toUpperCase();
}

function mod97(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const value = ch >= 'A' && ch <= 'Z' ? String(ch.charCodeAt(0) - 55) : ch;
    for (const digit of value) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

/** Returns true if the value is a valid Pakistani IBAN (checksum included). */
export function isValidIBAN(input) {
  const iban = normalize(input);
  if (!PATTERN.test(iban)) return false;
  return mod97(iban) === 1;
}

/** Formats an IBAN in groups of four: "PK36 SCBL 0000 0011 2345 6702". */
export function formatIBAN(input) {
  if (!isValidIBAN(input)) return null;
  return normalize(input).replace(/(.{4})/g, '$1 ').trim();
}

/** Returns bank info for an IBAN's bank code, or null if unknown/invalid. */
export function getBankFromIBAN(input) {
  if (!isValidIBAN(input)) return null;
  return BANK_BY_CODE.get(normalize(input).slice(4, 8)) ?? null;
}

/**
 * Parses an IBAN.
 * @returns {{ valid: boolean, iban: string|null, formatted: string|null,
 *   bankCode: string|null, bank: object|null, accountNumber: string|null }}
 */
export function parseIBAN(input) {
  if (!isValidIBAN(input)) {
    return { valid: false, iban: null, formatted: null, bankCode: null, bank: null, accountNumber: null };
  }
  const iban = normalize(input);
  return {
    valid: true,
    iban,
    formatted: formatIBAN(iban),
    bankCode: iban.slice(4, 8),
    bank: BANK_BY_CODE.get(iban.slice(4, 8)) ?? null,
    accountNumber: iban.slice(8),
  };
}
