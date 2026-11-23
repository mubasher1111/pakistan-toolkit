# 🇵🇰 pakistan-toolkit

**Everything a Pakistani app needs, in one zero-dependency package.**
CNIC, phone, IBAN and NTN validation · FBR salary tax calculator (FY2026-27) · PKR lakh/crore formatting · cheque-style amount in words · provinces, cities and banks data.

> Har Pakistani developer yeh code baar baar likhta hai: CNIC validation, `03XX` numbers, IBAN check, tax calculation, "Rs 1,50,000". Ab dobara likhne ki zarurat nahi.

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933)

---

## Features

| Module | What it does |
|---|---|
| **CNIC** | Validate, format (`35202-1234567-3`), mask, and read region and gender |
| **Phone** | Accepts `0300…`, `+92…`, `0092…` and more. Outputs E.164, local or WhatsApp format and the original operator |
| **IBAN** | Full mod-97 checksum validation, bank detection (HBL, Meezan, JazzCash, Easypaisa, and 20+ more) |
| **NTN** | Classic `1234567-8` and CNIC-based NTNs |
| **Income tax** | FBR salaried slabs for FY2024-25, FY2025-26 and **FY2026-27**, with surcharge, take-home pay and year-over-year comparison |
| **Currency** | `Rs 12,34,56,789`, `"25 lakh"`, `"15 crore"` |
| **Amount in words** | `"One Lakh Fifty Thousand Rupees and Fifty Paisa Only"` for cheques and invoices |
| **Data** | 7 provinces/territories (ISO codes, Urdu names), 50+ cities, 26 banks with IBAN codes. Also available as plain JSON |

- ✅ Zero dependencies
- ✅ Works in Node.js, browsers, Deno, Bun, React and Next.js
- ✅ TypeScript types included
- ✅ Fully tested

## Install

```bash
npm install github:mubasher1111/pakistan-toolkit
```

## Quick start

```js
import {
  parseCNIC, formatPhone, parseIBAN,
  calculateSalaryTax, formatPKR, amountToWords,
} from 'pakistan-toolkit';

parseCNIC('35202-1234567-3');
// { valid: true, formatted: '35202-1234567-3', region: 'Punjab', gender: 'male', ... }

formatPhone('0300 1234567');            // '+923001234567'
formatPhone('+92-300-1234567', 'local'); // '0300-1234567'

parseIBAN('PK36SCBL0000001123456702').bank.name;
// 'Standard Chartered Bank (Pakistan) Limited'

calculateSalaryTax({ monthlyIncome: 200_000 });
// { year: '2026-27', monthlyTax: 13000, monthlyTakeHome: 187000, effectiveRate: 6.5, ... }

formatPKR(1500000);        // 'Rs 15,00,000'
amountToWords(150250.5);   // 'One Lakh Fifty Thousand Two Hundred Fifty Rupees and Fifty Paisa Only'
```

---

## API

### CNIC

```js
isValidCNIC('3520212345673');      // true (dashes optional)
formatCNIC('3520212345673');       // '35202-1234567-3'
maskCNIC('35202-1234567-3');       // '35202-*******-3'
parseCNIC('42101-1234567-8');
// { valid: true, digits: '4210112345678', formatted: '42101-1234567-8',
//   region: 'Sindh', gender: 'female' }
```

The region comes from the first digit (1 KP, 2 FATA, 3 Punjab, 4 Sindh, 5 Balochistan, 6 Islamabad, 7 GB, 8 AJK). Gender comes from the last digit (odd = male, even = female). Validation checks the format only; it does not query NADRA.

### Phone

```js
isValidPhone('0092 300 1234567');           // true
formatPhone('03001234567', 'e164');          // '+923001234567'
formatPhone('03001234567', 'local');         // '0300-1234567'
formatPhone('03001234567', 'international'); // '+92 300 1234567'
formatPhone('03001234567', 'whatsapp');      // '923001234567'  (use with wa.me/)
getOperator('03451234567');                  // 'Telenor'
```

> Because of Mobile Number Portability, `getOperator` returns the network the prefix was **originally** allocated to.

### IBAN

```js
isValidIBAN('PK36 SCBL 0000 0011 2345 6702'); // true (spaces/case ignored)
formatIBAN('PK36SCBL0000001123456702');       // 'PK36 SCBL 0000 0011 2345 6702'
getBankFromIBAN('PK36SCBL0000001123456702');  // { code: 'SCBL', short: 'SCB', ... }
parseIBAN(iban); // { valid, iban, formatted, bankCode, bank, accountNumber }
```

### NTN

```js
isValidNTN('1234567-8');       // true
formatNTN('12345678');         // '1234567-8'
getNTNType('3520212345673');   // 'cnic' (CNIC used as NTN for individuals)
```

### Income tax (salaried)

```js
calculateSalaryTax({ monthlyIncome: 300_000 });               // latest year (2026-27)
calculateSalaryTax({ annualIncome: 3_600_000, year: '2025-26' });

compareSalaryTax({ monthlyIncome: 300_000, from: '2025-26', to: '2026-27' });
// { annualSaving: 50000, monthlySaving: 4166.67, from: {...}, to: {...} }
```

Each result contains `annualTax`, `monthlyTax`, `baseTax`, `surcharge`, `annualTakeHome`, `monthlyTakeHome`, `effectiveRate` (%), `marginalRate` (%) and `slab`.

**FY2026-27 salaried slabs (Finance Act 2026)**

| Annual taxable income (Rs) | Tax |
|---|---|
| 0 – 600,000 | 0 |
| 600,001 – 1,200,000 | 1% of amount over 600,000 |
| 1,200,001 – 2,200,000 | 6,000 + 11% over 1,200,000 |
| 2,200,001 – 3,200,000 | 116,000 + 20% over 2,200,000 |
| 3,200,001 – 4,100,000 | 316,000 + 25% over 3,200,000 |
| 4,100,001 – 5,600,000 | 541,000 + 29% over 4,100,000 |
| 5,600,001 – 7,000,000 | 976,000 + 32% over 5,600,000 |
| Above 7,000,000 | 1,424,000 + 35% over 7,000,000 |

There is no surcharge for salaried individuals in FY2026-27. FY2025-26 had a 9% surcharge above Rs 10M and FY2024-25 had 10%. All slabs are in [`src/tax.js`](src/tax.js) as `TAX_SLABS`.

> ⚠️ This is an estimate for planning. It does not cover exemptions, tax credits, rebates or non-salaried income, and it is not tax advice. Check [fbr.gov.pk](https://www.fbr.gov.pk) or a tax professional before filing.

### Currency

```js
formatLakh(123456789);                 // '12,34,56,789'
formatPKR(150000);                     // 'Rs 1,50,000'
formatPKR(150000, { symbol: 'PKR' });  // 'PKR 1,50,000'
formatPKR(99.5, { decimals: 2 });      // 'Rs 99.50'
toShortPKR(2_500_000);                 // '25 lakh'
toShortPKR(150_000_000);               // '15 crore'
numberToWords(123456789);              // 'Twelve Crore Thirty Four Lakh Fifty Six Thousand Seven Hundred Eighty Nine'
amountToWords(2500000);                // 'Twenty Five Lakh Rupees Only'
```

### Data

```js
import { provinces, cities, banks, getCitiesByProvince, findBank } from 'pakistan-toolkit';

getCitiesByProvince('Sindh');   // [{ name: 'Karachi', urdu: 'کراچی', province: 'PK-SD' }, ...]
findBank('hbl');                // { code: 'HABB', name: 'Habib Bank Limited', ... }
```

**Not using JavaScript?** The same data is in [`data/`](data) as plain JSON (`provinces.json`, `cities.json`, `banks.json`). You can use it from Python, PHP, Go, Laravel, Django, or import it into SQL.

---

## Use cases

- **E-commerce checkout:** validate phone numbers and normalize them for SMS/WhatsApp
- **KYC and sign-up forms:** CNIC validation and masking
- **Payroll / HR apps:** monthly tax deduction and take-home salary
- **Invoicing and accounting:** lakh/crore formatting and amount in words
- **Payment payouts:** IBAN validation before sending a Raast or IBFT transfer
- **Address forms:** province and city dropdowns, with Urdu labels

## Roadmap

- [ ] JazzCash and Easypaisa payment integration helpers
- [ ] Urdu number-to-words (`ایک لاکھ پچاس ہزار`)
- [ ] Non-salaried individual and AOP tax slabs
- [ ] Sales tax (federal and provincial) helpers
- [ ] Postal codes dataset
- [ ] Python port (`pip install pakistan-toolkit`)
- [ ] CLI (`npx pakistan-toolkit tax 200000`)

Have an idea? [Open an issue](https://github.com/mubasher1111/pakistan-toolkit/issues).

## Contributing

PRs are welcome, especially for **data** (missing banks, cities, new tax years). See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git clone https://github.com/mubasher1111/pakistan-toolkit.git
cd pakistan-toolkit
npm test
```

## License

[MIT](LICENSE). Free for personal and commercial use.

If this saved you time, please ⭐ **star the repo**. It helps other Pakistani developers find it.
