// NTN (National Tax Number) helpers.
// Classic NTNs are 7 digits plus a check digit, written 1234567-8.
// Since 2019 an individual's CNIC (13 digits) also serves as their NTN.
// This module validates the format only; it does not query FBR.

import { isValidCNIC, formatCNIC } from './cnic.js';

const NTN_DASHED = /^\d{7}-\d$/;
const NTN_PLAIN = /^\d{8}$/;

/**
 * Returns the NTN type: 'ntn' (7+1 digit), 'cnic' (13-digit CNIC used as NTN),
 * or null if the value matches neither.
 */
export function getNTNType(input) {
  if (input === null || input === undefined) return null;
  const s = String(input).trim().replace(/\s+/g, '');
  if (NTN_DASHED.test(s) || NTN_PLAIN.test(s)) return 'ntn';
  if (isValidCNIC(s)) return 'cnic';
  return null;
}

/** Returns true if the value is a well-formed NTN (classic or CNIC-based). */
export function isValidNTN(input) {
  return getNTNType(input) !== null;
}

/** Formats an NTN as 1234567-8 (or as a CNIC for CNIC-based NTNs). */
export function formatNTN(input) {
  const type = getNTNType(input);
  if (!type) return null;
  const s = String(input).trim().replace(/\s+/g, '');
  if (type === 'cnic') return formatCNIC(s);
  const d = s.replace('-', '');
  return `${d.slice(0, 7)}-${d.slice(7)}`;
}
