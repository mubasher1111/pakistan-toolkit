export { isValidCNIC, formatCNIC, parseCNIC, maskCNIC } from './cnic.js';
export { isValidPhone, formatPhone, parsePhone, getOperator } from './phone.js';
export { isValidIBAN, formatIBAN, parseIBAN, getBankFromIBAN } from './iban.js';
export { isValidNTN, formatNTN, getNTNType } from './ntn.js';
export {
  calculateSalaryTax,
  compareSalaryTax,
  getSupportedYears,
  TAX_SLABS,
  LATEST_FISCAL_YEAR,
  fiscalYearForDate,
  resolveTaxYear,
} from './tax.js';
export { formatLakh, formatPKR, toShortPKR, numberToWords, amountToWords } from './currency.js';
export { provinces, cities, banks, getCitiesByProvince, findBank } from './data.js';
