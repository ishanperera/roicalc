import type { AmortizationEntry } from './types';

/**
 * Calculate monthly mortgage payment using standard amortization formula:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage (e.g., 7 for 7%)
 * @param termYears - Loan term in years
 * @returns Monthly payment amount
 */
export function calcMonthlyMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const factor = Math.pow(1 + monthlyRate, numPayments);

  return principal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Generate a full amortization schedule.
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number
): AmortizationEntry[] {
  const monthlyPayment = calcMonthlyMortgagePayment(principal, annualRate, termYears);
  if (monthlyPayment <= 0) return [];

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const schedule: AmortizationEntry[] = [];
  let balance = principal;

  for (let month = 1; month <= numPayments; month++) {
    const interest = balance * monthlyRate;
    const principalPortion = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPortion);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPortion,
      interest,
      balance,
    });
  }

  return schedule;
}

/**
 * Get the loan balance at a specific month from the amortization schedule.
 */
export function getLoanBalanceAtMonth(
  principal: number,
  annualRate: number,
  termYears: number,
  month: number
): number {
  if (principal <= 0 || month <= 0) return principal;
  if (annualRate <= 0) {
    const monthlyPayment = principal / (termYears * 12);
    return Math.max(0, principal - monthlyPayment * month);
  }

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const factor = Math.pow(1 + monthlyRate, numPayments);
  const monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);

  const balanceFactor = Math.pow(1 + monthlyRate, month);
  const balance = principal * balanceFactor - monthlyPayment * ((balanceFactor - 1) / monthlyRate);

  return Math.max(0, balance);
}
