// Run: node examples/demo.js
import {
  parseCNIC, parsePhone, parseIBAN,
  calculateSalaryTax, compareSalaryTax,
  formatPKR, toShortPKR, amountToWords,
  getCitiesByProvince,
} from '../src/index.js';

console.log('CNIC  ', parseCNIC('35202-1234567-3'));
console.log('Phone ', parsePhone('0300 1234567'));
console.log('IBAN  ', parseIBAN('PK36SCBL0000001123456702'));

console.log('\nSalary tax, Rs 2,00,000 / month (FY2026-27)');
const t = calculateSalaryTax({ monthlyIncome: 200_000 });
console.log(`  Monthly tax:      ${formatPKR(t.monthlyTax)}`);
console.log(`  Monthly take-home: ${formatPKR(t.monthlyTakeHome)}`);
console.log(`  Effective rate:   ${t.effectiveRate}%`);

const c = compareSalaryTax({ monthlyIncome: 500_000 });
console.log(`\nRs 5 lakh/month saves ${formatPKR(c.monthlySaving)} per month vs FY2025-26`);

console.log('\n' + toShortPKR(25_000_000));
console.log(amountToWords(150250.5));
console.log('\nSindh cities:', getCitiesByProvince('Sindh').map((c) => c.name).join(', '));
