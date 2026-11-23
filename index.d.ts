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
  year?: FiscalYear;
}
export const TAX_SLABS: Record<FiscalYear, TaxTable>;
export const LATEST_FISCAL_YEAR: FiscalYear;
export function getSupportedYears(): FiscalYear[];
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
