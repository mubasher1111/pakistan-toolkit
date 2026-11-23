// CNIC (Computerized National Identity Card) helpers.
// Format: XXXXX-XXXXXXX-X (13 digits). The first digit identifies the
// province/region of the card holder; the last digit is odd for males and
// even for females.

const REGION_BY_DIGIT = {
  1: 'Khyber Pakhtunkhwa',
  2: 'FATA (merged into Khyber Pakhtunkhwa)',
  3: 'Punjab',
  4: 'Sindh',
  5: 'Balochistan',
  6: 'Islamabad Capital Territory',
  7: 'Gilgit-Baltistan',
  8: 'Azad Jammu & Kashmir',
};

const DASHED = /^\d{5}-\d{7}-\d$/;
const PLAIN = /^\d{13}$/;

function clean(input) {
  if (input === null || input === undefined) return null;
  const s = String(input).trim();
  if (DASHED.test(s)) return s.replace(/-/g, '');
  const noSpaces = s.replace(/\s+/g, '');
  if (PLAIN.test(noSpaces)) return noSpaces;
  if (DASHED.test(noSpaces)) return noSpaces.replace(/-/g, '');
  return null;
}

/**
 * Returns true if the value is a structurally valid CNIC
 * (with or without dashes).
 */
export function isValidCNIC(input) {
  const digits = clean(input);
  if (!digits) return false;
  const first = Number(digits[0]);
  if (!REGION_BY_DIGIT[first]) return false;
  // All-same-digit numbers like 1111111111111 are never issued.
  if (/^(\d)\1{12}$/.test(digits)) return false;
  return true;
}

/** Formats a CNIC as XXXXX-XXXXXXX-X. Returns null if invalid. */
export function formatCNIC(input) {
  if (!isValidCNIC(input)) return null;
  const d = clean(input);
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

/**
 * Parses a CNIC and returns its details.
 * @returns {{ valid: boolean, digits: string|null, formatted: string|null,
 *   region: string|null, gender: 'male'|'female'|null }}
 */
export function parseCNIC(input) {
  if (!isValidCNIC(input)) {
    return { valid: false, digits: null, formatted: null, region: null, gender: null };
  }
  const digits = clean(input);
  const last = Number(digits[12]);
  return {
    valid: true,
    digits,
    formatted: formatCNIC(digits),
    region: REGION_BY_DIGIT[Number(digits[0])],
    gender: last % 2 === 1 ? 'male' : 'female',
  };
}

/**
 * Masks a CNIC for display, e.g. "35202-*******-3".
 */
export function maskCNIC(input) {
  const f = formatCNIC(input);
  if (!f) return null;
  return `${f.slice(0, 5)}-*******-${f.slice(-1)}`;
}
