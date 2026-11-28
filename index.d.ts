// Type definitions for pakistan-toolkit

// ---------- CNIC ----------
export interface CNICInfo {
  valid: boolean;
  digits: string | null;
  formatted: string | null;
  region: string | null;
  gender: 'male' | 'female' | null;
}
export function isValidCNIC(input: string | number): boolean;
export function formatCNIC(input: string | number): string | null;
export function parseCNIC(input: string | number): CNICInfo;
export function maskCNIC(input: string | number): string | null;

// ---------- Phone ----------
export type PhoneStyle = 'e164' | 'local' | 'international' | 'whatsapp';
export interface PhoneInfo {
  valid: boolean;
  e164: string | null;
  local: string | null;
  operator: string | null;
}
export function isValidPhone(input: string | number): boolean;
export function formatPhone(input: string | number, style?: PhoneStyle): string | null;
export function parsePhone(input: string | number): PhoneInfo;
export function getOperator(input: string | number): string | null;

// ---------- IBAN ----------
export interface Bank {
  code: string;
  name: string;
  short: string;
  type: 'conventional' | 'islamic' | 'microfinance';
}
export interface IBANInfo {
  valid: boolean;
  iban: string | null;
  formatted: string | null;
  bankCode: string | null;
  bank: Bank | null;
  accountNumber: string | null;
}
export function isValidIBAN(input: string): boolean;
export function formatIBAN(input: string): string | null;
export function parseIBAN(input: string): IBANInfo;
export function getBankFromIBAN(input: string): Bank | null;

// ---------- NTN ----------
export function isValidNTN(input: string | number): boolean;
export function formatNTN(input: string | number): string | null;
export function getNTNType(input: string | number): 'ntn' | 'cnic' | null;

// ---------- Tax ----------
export type FiscalYear = '2024-25' | '2025-26' | '2026-27';
export interface TaxSlab { upTo: number; fixed: number; rate: number; over: number; }
export interface TaxTable {
  taxYear: number;
  slabs: TaxSlab[];
  surcharge: { threshold: number; rate: number } | null;
}
export interface SalaryTaxResult {
  year: FiscalYear;
  taxYear: number;
  /** 'requested' (you passed year), 'current' (today's fiscal year) or 'latest-available' (today's year not added yet) */
  yearSource: 'requested' | 'current' | 'latest-available';
  /** Explains a fallback to an older year; null otherwise */
  yearNote: string | null;
  /** Other income included in taxableIncome */
  otherIncome: number;
  /** Salary (incl. bonus) + otherIncome */
  taxableIncome: number;
  /** Salary as a percentage of taxable income */
  salaryShare: number;
  /** Present when taxDeducted was given */
  taxDeducted?: number;
  /** annualTax - taxDeducted: positive = still payable, negative = refundable */
  balance?: number;
  balanceStatus?: 'payable' | 'refundable' | 'settled';
  annualIncome: number;
  monthlyIncome: number;
  baseTax: number;
  surcharge: number;
  annualTax: number;
  monthlyTax: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  /** Percentage, e.g. 4.5 means 4.5% */
  effectiveRate: number;
  /** Percentage */
  marginalRate: number;
  /** 1-based slab number */
  slab: number;
}
export interface SalaryTaxOptions {
  annualIncome?: number;
  monthlyIncome?: number;
  /** Salary that changed during the year, e.g. [{ months: 6, monthlyIncome: 150000 }, { months: 6, monthlyIncome: 200000 }] */
  salaryPeriods?: { months: number; monthlyIncome: number }[];
  /** Bonus or other lump-sum taxable salary */
  bonus?: number;
  /** Other income taxed at normal rates (e.g. business/freelance). Not rent, bank profit, dividends or capital gains. */
  otherIncome?: number;
  /** Tax already deducted for the year (e.g. by the employer) */
  taxDeducted?: number;
  /** Default: the current fiscal year (falls back to the latest available, with yearNote) */
  year?: FiscalYear;
  /** Date used to pick the current fiscal year (default: today) */
  date?: Date | string;
}
export const TAX_SLABS: Record<FiscalYear, TaxTable>;
export const LATEST_FISCAL_YEAR: FiscalYear;
export function getSupportedYears(): FiscalYear[];
/** Fiscal year (July-June) of a date, e.g. '2026-27'. */
export function fiscalYearForDate(date?: Date | string): string;
export function resolveTaxYear(options?: { year?: FiscalYear; date?: Date | string }): {
  year: FiscalYear; source: 'requested' | 'current' | 'latest-available'; note: string | null;
};
export function calculateSalaryTax(options: SalaryTaxOptions): SalaryTaxResult;
export function compareSalaryTax(options: {
  annualIncome?: number;
  monthlyIncome?: number;
  from?: FiscalYear;
  to?: FiscalYear;
}): { from: SalaryTaxResult; to: SalaryTaxResult; annualSaving: number; monthlySaving: number };

// ---------- Currency ----------
export function formatLakh(value: number | string, decimals?: number): string | null;
export function formatPKR(value: number, options?: { symbol?: string; decimals?: number }): string | null;
export function toShortPKR(value: number, options?: { decimals?: number }): string | null;
export function numberToWords(value: number): string | null;
export function amountToWords(value: number, options?: { only?: boolean }): string | null;

// ---------- Data ----------
export interface Province {
  code: string;
  name: string;
  urdu: string;
  capital: string;
  type: 'province' | 'territory';
}
export interface City { name: string; urdu: string; province: string; }
export const provinces: Province[];
export const cities: City[];
export const banks: Bank[];
export function getCitiesByProvince(province: string): City[];
export function findBank(query: string): Bank | null;
