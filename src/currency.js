// PKR formatting helpers using the South Asian numbering system
// (thousand, lakh, crore, arab) used on cheques, invoices and in daily speech.

/**
 * Groups digits the South Asian way: 12,34,56,789
 * @param {number|string} value
 * @param {number} [decimals=0]
 */
export function formatLakh(value, decimals = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const negative = n < 0;
  const [intPart, decPart] = Math.abs(n).toFixed(decimals).split('.');
  let grouped;
  if (intPart.length <= 3) {
    grouped = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = `${rest},${last3}`;
  }
  return `${negative ? '-' : ''}${grouped}${decPart ? '.' + decPart : ''}`;
}

/**
 * Formats a number as rupees: "Rs 1,50,000".
 * @param {number} value
 * @param {object} [options]
 * @param {string} [options.symbol='Rs']  e.g. 'Rs', 'PKR', '₨', 'روپے'
 * @param {number} [options.decimals=0]
 */
export function formatPKR(value, { symbol = 'Rs', decimals = 0 } = {}) {
  const body = formatLakh(value, decimals);
  if (body === null) return null;
  if (body.startsWith('-')) return `-${symbol} ${body.slice(1)}`;
  return `${symbol} ${body}`;
}

/**
 * Short human form: 1500 → "1.5 thousand", 2500000 → "25 lakh",
 * 150000000 → "15 crore", 2e9 → "2 arab".
 */
export function toShortPKR(value, { decimals = 2 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(n);
  const units = [
    [1e9, 'arab'],
    [1e7, 'crore'],
    [1e5, 'lakh'],
    [1e3, 'thousand'],
  ];
  for (const [size, name] of units) {
    if (abs >= size) {
      const v = Number((n / size).toFixed(decimals));
      return `${v} ${name}`;
    }
  }
  return String(n);
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`;
}

function threeDigits(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts = [];
  if (h) parts.push(`${ONES[h]} Hundred`);
  if (r) parts.push(twoDigits(r));
  return parts.join(' ');
}

/** Converts a whole number to words in the South Asian system. */
export function numberToWords(value) {
  let n = Math.floor(Math.abs(Number(value)));
  if (!Number.isFinite(n)) return null;
  if (n === 0) return 'Zero';
  if (n > Number.MAX_SAFE_INTEGER) throw new RangeError('Number too large');

  const parts = [];
  const kharab = Math.floor(n / 1e11); n %= 1e11;
  const arab = Math.floor(n / 1e9); n %= 1e9;
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;

  if (kharab) parts.push(`${numberToWords(kharab)} Kharab`);
  if (arab) parts.push(`${twoDigits(arab)} Arab`);
  if (crore) parts.push(`${twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (n) parts.push(threeDigits(n));
  return (Number(value) < 0 ? 'Minus ' : '') + parts.join(' ');
}

/**
 * Converts an amount to cheque-style words:
 * 150250.5 → "One Lakh Fifty Thousand Two Hundred Fifty Rupees and Fifty Paisa Only"
 */
export function amountToWords(value, { only = true } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(n);
  const totalPaisa = Math.round(abs * 100);
  const rupees = Math.floor(totalPaisa / 100);
  const paisa = totalPaisa % 100;

  let words = `${numberToWords(rupees)} Rupee${rupees === 1 ? '' : 's'}`;
  if (paisa) words += ` and ${twoDigits(paisa)} Paisa`;
  if (n < 0) words = `Minus ${words}`;
  return only ? `${words} Only` : words;
}
