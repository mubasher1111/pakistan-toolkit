// Reference data for Pakistan. Also published as plain JSON in /data
// (run `npm run build:data` to regenerate after editing this file).

/** Provinces and territories with ISO 3166-2 codes. */
export const provinces = [
  { code: 'PK-PB', name: 'Punjab', urdu: 'پنجاب', capital: 'Lahore', type: 'province' },
  { code: 'PK-SD', name: 'Sindh', urdu: 'سندھ', capital: 'Karachi', type: 'province' },
  { code: 'PK-KP', name: 'Khyber Pakhtunkhwa', urdu: 'خیبر پختونخوا', capital: 'Peshawar', type: 'province' },
  { code: 'PK-BA', name: 'Balochistan', urdu: 'بلوچستان', capital: 'Quetta', type: 'province' },
  { code: 'PK-IS', name: 'Islamabad Capital Territory', urdu: 'اسلام آباد', capital: 'Islamabad', type: 'territory' },
  { code: 'PK-GB', name: 'Gilgit-Baltistan', urdu: 'گلگت بلتستان', capital: 'Gilgit', type: 'territory' },
  { code: 'PK-JK', name: 'Azad Jammu & Kashmir', urdu: 'آزاد جموں و کشمیر', capital: 'Muzaffarabad', type: 'territory' },
];

/** Major cities. `province` is the ISO code from `provinces`. */
export const cities = [
  // Punjab
  { name: 'Lahore', urdu: 'لاہور', province: 'PK-PB' },
  { name: 'Faisalabad', urdu: 'فیصل آباد', province: 'PK-PB' },
  { name: 'Rawalpindi', urdu: 'راولپنڈی', province: 'PK-PB' },
  { name: 'Gujranwala', urdu: 'گوجرانوالہ', province: 'PK-PB' },
  { name: 'Multan', urdu: 'ملتان', province: 'PK-PB' },
  { name: 'Bahawalpur', urdu: 'بہاولپور', province: 'PK-PB' },
  { name: 'Sargodha', urdu: 'سرگودھا', province: 'PK-PB' },
  { name: 'Sialkot', urdu: 'سیالکوٹ', province: 'PK-PB' },
  { name: 'Sheikhupura', urdu: 'شیخوپورہ', province: 'PK-PB' },
  { name: 'Rahim Yar Khan', urdu: 'رحیم یار خان', province: 'PK-PB' },
  { name: 'Jhang', urdu: 'جھنگ', province: 'PK-PB' },
  { name: 'Dera Ghazi Khan', urdu: 'ڈیرہ غازی خان', province: 'PK-PB' },
  { name: 'Gujrat', urdu: 'گجرات', province: 'PK-PB' },
  { name: 'Sahiwal', urdu: 'ساہیوال', province: 'PK-PB' },
  { name: 'Kasur', urdu: 'قصور', province: 'PK-PB' },
  { name: 'Okara', urdu: 'اوکاڑہ', province: 'PK-PB' },
  { name: 'Chiniot', urdu: 'چنیوٹ', province: 'PK-PB' },
  { name: 'Jhelum', urdu: 'جہلم', province: 'PK-PB' },
  { name: 'Khanewal', urdu: 'خانیوال', province: 'PK-PB' },
  { name: 'Vehari', urdu: 'وہاڑی', province: 'PK-PB' },
  { name: 'Attock', urdu: 'اٹک', province: 'PK-PB' },
  { name: 'Hafizabad', urdu: 'حافظ آباد', province: 'PK-PB' },
  { name: 'Mandi Bahauddin', urdu: 'منڈی بہاؤالدین', province: 'PK-PB' },
  { name: 'Taxila', urdu: 'ٹیکسلا', province: 'PK-PB' },
  { name: 'Murree', urdu: 'مری', province: 'PK-PB' },
  // Sindh
  { name: 'Karachi', urdu: 'کراچی', province: 'PK-SD' },
  { name: 'Hyderabad', urdu: 'حیدرآباد', province: 'PK-SD' },
  { name: 'Sukkur', urdu: 'سکھر', province: 'PK-SD' },
  { name: 'Larkana', urdu: 'لاڑکانہ', province: 'PK-SD' },
  { name: 'Nawabshah', urdu: 'نوابشاہ', province: 'PK-SD' },
  { name: 'Mirpur Khas', urdu: 'میرپور خاص', province: 'PK-SD' },
  { name: 'Jacobabad', urdu: 'جیکب آباد', province: 'PK-SD' },
  { name: 'Thatta', urdu: 'ٹھٹہ', province: 'PK-SD' },
  // Khyber Pakhtunkhwa
  { name: 'Peshawar', urdu: 'پشاور', province: 'PK-KP' },
  { name: 'Mardan', urdu: 'مردان', province: 'PK-KP' },
  { name: 'Mingora', urdu: 'مینگورہ', province: 'PK-KP' },
  { name: 'Abbottabad', urdu: 'ایبٹ آباد', province: 'PK-KP' },
  { name: 'Kohat', urdu: 'کوہاٹ', province: 'PK-KP' },
  { name: 'Dera Ismail Khan', urdu: 'ڈیرہ اسماعیل خان', province: 'PK-KP' },
  { name: 'Bannu', urdu: 'بنوں', province: 'PK-KP' },
  { name: 'Mansehra', urdu: 'مانسہرہ', province: 'PK-KP' },
  // Balochistan
  { name: 'Quetta', urdu: 'کوئٹہ', province: 'PK-BA' },
  { name: 'Gwadar', urdu: 'گوادر', province: 'PK-BA' },
  { name: 'Turbat', urdu: 'تربت', province: 'PK-BA' },
  { name: 'Khuzdar', urdu: 'خضدار', province: 'PK-BA' },
  { name: 'Chaman', urdu: 'چمن', province: 'PK-BA' },
  // Islamabad
  { name: 'Islamabad', urdu: 'اسلام آباد', province: 'PK-IS' },
  // Gilgit-Baltistan
  { name: 'Gilgit', urdu: 'گلگت', province: 'PK-GB' },
  { name: 'Skardu', urdu: 'سکردو', province: 'PK-GB' },
  // Azad Jammu & Kashmir
  { name: 'Muzaffarabad', urdu: 'مظفرآباد', province: 'PK-JK' },
  { name: 'Mirpur', urdu: 'میرپور', province: 'PK-JK' },
  { name: 'Kotli', urdu: 'کوٹلی', province: 'PK-JK' },
];

/** Banks with their 4-letter IBAN bank codes. */
export const banks = [
  { code: 'ABPA', name: 'Allied Bank Limited', short: 'ABL', type: 'conventional' },
  { code: 'AIIN', name: 'Al Baraka Bank (Pakistan) Limited', short: 'Al Baraka', type: 'islamic' },
  { code: 'ALFH', name: 'Bank Alfalah Limited', short: 'Bank Alfalah', type: 'conventional' },
  { code: 'ASCM', name: 'Askari Bank Limited', short: 'Askari', type: 'conventional' },
  { code: 'BAHL', name: 'Bank AL Habib Limited', short: 'BAHL', type: 'conventional' },
  { code: 'BKIP', name: 'BankIslami Pakistan Limited', short: 'BankIslami', type: 'islamic' },
  { code: 'BPUN', name: 'The Bank of Punjab', short: 'BOP', type: 'conventional' },
  { code: 'CITI', name: 'Citibank N.A. Pakistan', short: 'Citibank', type: 'conventional' },
  { code: 'DUIB', name: 'Dubai Islamic Bank Pakistan Limited', short: 'DIB', type: 'islamic' },
  { code: 'FAYS', name: 'Faysal Bank Limited', short: 'Faysal', type: 'islamic' },
  { code: 'HABB', name: 'Habib Bank Limited', short: 'HBL', type: 'conventional' },
  { code: 'JCMA', name: 'Mobilink Microfinance Bank Limited (JazzCash)', short: 'JazzCash', type: 'microfinance' },
  { code: 'JSBL', name: 'JS Bank Limited', short: 'JS Bank', type: 'conventional' },
  { code: 'KHYB', name: 'The Bank of Khyber', short: 'BOK', type: 'conventional' },
  { code: 'MCIB', name: 'MCB Islamic Bank Limited', short: 'MCB Islamic', type: 'islamic' },
  { code: 'MEZN', name: 'Meezan Bank Limited', short: 'Meezan', type: 'islamic' },
  { code: 'MPBL', name: 'Habib Metropolitan Bank Limited', short: 'HabibMetro', type: 'conventional' },
  { code: 'MUCB', name: 'MCB Bank Limited', short: 'MCB', type: 'conventional' },
  { code: 'NBPA', name: 'National Bank of Pakistan', short: 'NBP', type: 'conventional' },
  { code: 'SAUD', name: 'Silkbank Limited', short: 'Silkbank', type: 'conventional' },
  { code: 'SCBL', name: 'Standard Chartered Bank (Pakistan) Limited', short: 'SCB', type: 'conventional' },
  { code: 'SIND', name: 'Sindh Bank Limited', short: 'Sindh Bank', type: 'conventional' },
  { code: 'SONE', name: 'Soneri Bank Limited', short: 'Soneri', type: 'conventional' },
  { code: 'SUMB', name: 'Summit Bank Limited', short: 'Summit', type: 'conventional' },
  { code: 'TMFB', name: 'Telenor Microfinance Bank Limited (Easypaisa)', short: 'Easypaisa', type: 'microfinance' },
  { code: 'UNIL', name: 'United Bank Limited', short: 'UBL', type: 'conventional' },
];

/** Returns cities in a province (accepts ISO code or name, case-insensitive). */
export function getCitiesByProvince(province) {
  const key = String(province).toLowerCase();
  const p = provinces.find((x) => x.code.toLowerCase() === key || x.name.toLowerCase() === key);
  if (!p) return [];
  return cities.filter((c) => c.province === p.code);
}

/** Finds a bank by IBAN code or short name, case-insensitive. */
export function findBank(query) {
  const key = String(query).toLowerCase();
  return banks.find((b) => b.code.toLowerCase() === key || b.short.toLowerCase() === key) ?? null;
}
