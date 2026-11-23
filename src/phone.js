// Pakistani mobile number helpers.
// Mobile numbers are 03XX-XXXXXXX locally, or +92 3XX XXXXXXX internationally.
// Note: because of Mobile Number Portability (MNP) the operator returned here
// is the network the prefix was originally allocated to, not necessarily the
// network the number is on today.

const OPERATORS = [
  { from: 300, to: 309, operator: 'Jazz' },
  { from: 310, to: 319, operator: 'Zong' },
  { from: 320, to: 329, operator: 'Jazz' }, // former Warid range
  { from: 330, to: 339, operator: 'Ufone' },
  { from: 340, to: 349, operator: 'Telenor' },
  { from: 355, to: 355, operator: 'SCO' },
];

function toNational(input) {
  if (input === null || input === undefined) return null;
  let s = String(input).trim();
  // Allow common separators: spaces, dashes, dots, parentheses.
  s = s.replace(/[\s\-.()]/g, '');
  if (s.startsWith('+92')) s = s.slice(3);
  else if (s.startsWith('0092')) s = s.slice(4);
  else if (s.startsWith('92') && s.length === 12) s = s.slice(2);
  else if (s.startsWith('0')) s = s.slice(1);
  // Now expect 3XXXXXXXXX (10 digits)
  if (!/^3\d{9}$/.test(s)) return null;
  return s;
}

/** Returns true for a valid Pakistani mobile number in any common format. */
export function isValidPhone(input) {
  return toNational(input) !== null;
}

/** Returns the operator a number's prefix was originally allocated to, or null. */
export function getOperator(input) {
  const n = toNational(input);
  if (!n) return null;
  const prefix = Number(n.slice(0, 3));
  const match = OPERATORS.find((o) => prefix >= o.from && prefix <= o.to);
  return match ? match.operator : 'Unknown';
}

/**
 * Formats a mobile number.
 * @param {string} input
 * @param {'e164'|'local'|'international'|'whatsapp'} [style='e164']
 *   e164:          +923001234567
 *   local:         0300-1234567
 *   international: +92 300 1234567
 *   whatsapp:      923001234567  (for wa.me links)
 */
export function formatPhone(input, style = 'e164') {
  const n = toNational(input);
  if (!n) return null;
  switch (style) {
    case 'local':
      return `0${n.slice(0, 3)}-${n.slice(3)}`;
    case 'international':
      return `+92 ${n.slice(0, 3)} ${n.slice(3)}`;
    case 'whatsapp':
      return `92${n}`;
    case 'e164':
    default:
      return `+92${n}`;
  }
}

/** Returns a full breakdown of a mobile number. */
export function parsePhone(input) {
  const n = toNational(input);
  if (!n) return { valid: false, e164: null, local: null, operator: null };
  return {
    valid: true,
    e164: formatPhone(n, 'e164'),
    local: formatPhone(n, 'local'),
    operator: getOperator(n),
  };
}
