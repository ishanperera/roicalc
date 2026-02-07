import type { ProFormaInputs, NapkinInputs } from './types';
import { DEFAULT_PROFORMA } from './defaults';

/**
 * Convert Napkin Math (3 inputs) to full ProForma inputs using industry heuristics.
 *
 * Heuristics applied:
 * - Down payment: 20%
 * - Loan term: 30 years
 * - Closing costs: 3% of purchase price
 * - Vacancy: 5%
 * - Property tax: 1.2% of purchase price
 * - Insurance: ~0.4% of purchase price
 * - Maintenance: 1% of purchase price
 * - Management: 8% of EGI
 * - Rent growth: 3%/yr, Expense growth: 2%/yr
 * - Hold period: 5 years, Appreciation: 3%/yr
 * - Exit cap rate: 6%, Selling costs: 6%
 */
export function napkinToProForma(napkin: NapkinInputs): ProFormaInputs {
  const { purchasePrice, monthlyRent, interestRate } = napkin;

  return {
    ...DEFAULT_PROFORMA,
    purchase: {
      ...DEFAULT_PROFORMA.purchase,
      purchasePrice,
      interestRate,
    },
    income: {
      ...DEFAULT_PROFORMA.income,
      monthlyRent,
    },
    expenses: {
      ...DEFAULT_PROFORMA.expenses,
      // Scale insurance proportionally to purchase price
      insuranceAnnual: Math.round(purchasePrice * 0.004),
    },
  };
}
