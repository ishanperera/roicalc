import type { ProFormaInputs, CoreMetrics } from './types';
import { calcMonthlyMortgagePayment } from './mortgage';

/**
 * Calculate Net Operating Income (NOI).
 * NOI = Effective Gross Income - Operating Expenses
 */
export function calcNOI(effectiveGrossIncome: number, operatingExpenses: number): number {
  return effectiveGrossIncome - operatingExpenses;
}

/**
 * Calculate Cap Rate.
 * Cap Rate = NOI / Purchase Price
 */
export function calcCapRate(noi: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (noi / purchasePrice) * 100;
}

/**
 * Calculate Cash-on-Cash Return.
 * CoC = Annual Cash Flow / Total Cash Invested
 */
export function calcCashOnCash(annualCashFlow: number, totalCashInvested: number): number {
  if (totalCashInvested <= 0) return 0;
  return (annualCashFlow / totalCashInvested) * 100;
}

/**
 * Calculate Gross Rent Multiplier.
 * GRM = Purchase Price / Gross Annual Rent
 */
export function calcGRM(purchasePrice: number, grossAnnualRent: number): number {
  if (grossAnnualRent <= 0) return 0;
  return purchasePrice / grossAnnualRent;
}

/**
 * Compute all core financial metrics from ProForma inputs.
 */
export function computeCoreMetrics(inputs: ProFormaInputs): CoreMetrics {
  const { purchase, income, expenses, renovation } = inputs;

  // Loan calculations
  const loanAmount = purchase.purchasePrice * (1 - purchase.downPaymentPercent / 100);
  const monthlyPayment = calcMonthlyMortgagePayment(
    loanAmount,
    purchase.interestRate,
    purchase.loanTermYears
  );
  const annualDebtService = monthlyPayment * 12;

  // Income calculations
  const grossAnnualRent = income.monthlyRent * 12;
  const grossOtherIncome = income.otherMonthlyIncome * 12;
  const vacancyLoss = (grossAnnualRent + grossOtherIncome) * (income.vacancyRate / 100);
  const effectiveGrossIncome = grossAnnualRent + grossOtherIncome - vacancyLoss;

  // Expense calculations
  const propertyTax = purchase.purchasePrice * (expenses.propertyTaxRate / 100);
  const maintenance = purchase.purchasePrice * (expenses.maintenancePercent / 100);
  const management = effectiveGrossIncome * (expenses.managementPercent / 100);
  const hoa = expenses.hoaMonthly * 12;
  const operatingExpenses = propertyTax + expenses.insuranceAnnual + maintenance + management + hoa;

  // Core metrics
  const noi = calcNOI(effectiveGrossIncome, operatingExpenses);
  const capRate = calcCapRate(noi, purchase.purchasePrice);
  const annualCashFlow = noi - annualDebtService;

  // Total cash invested
  const downPayment = purchase.purchasePrice * (purchase.downPaymentPercent / 100);
  const closingCosts = purchase.purchasePrice * (purchase.closingCostPercent / 100);
  const totalCashInvested = downPayment + closingCosts + renovation.renovationCost;

  const cashOnCash = calcCashOnCash(annualCashFlow, totalCashInvested);
  const grm = calcGRM(purchase.purchasePrice, grossAnnualRent);

  return {
    noi,
    capRate,
    cashOnCash,
    grm,
    monthlyPayment,
    annualDebtService,
    annualCashFlow,
    totalCashInvested,
    effectiveGrossIncome,
    operatingExpenses,
    loanAmount,
  };
}
