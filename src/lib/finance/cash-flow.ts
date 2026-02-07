import type { ProFormaInputs, CashFlowYear } from './types';
import { calcMonthlyMortgagePayment, getLoanBalanceAtMonth } from './mortgage';

/**
 * Generate year-by-year cash flow projection with rent growth and expense inflation.
 */
export function generateCashFlowProjection(inputs: ProFormaInputs): CashFlowYear[] {
  const { purchase, income, expenses, exit } = inputs;
  const years = exit.holdPeriodYears;

  const loanAmount = purchase.purchasePrice * (1 - purchase.downPaymentPercent / 100);
  const monthlyPayment = calcMonthlyMortgagePayment(
    loanAmount,
    purchase.interestRate,
    purchase.loanTermYears
  );
  const annualDebtService = monthlyPayment * 12;

  const projection: CashFlowYear[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= years; year++) {
    const rentGrowthFactor = Math.pow(1 + income.annualRentGrowth / 100, year - 1);
    const expenseGrowthFactor = Math.pow(1 + expenses.annualExpenseGrowth / 100, year - 1);
    const appreciationFactor = Math.pow(1 + exit.appreciationRate / 100, year);

    // Income
    const grossRent = income.monthlyRent * 12 * rentGrowthFactor;
    const otherIncome = income.otherMonthlyIncome * 12 * rentGrowthFactor;
    const vacancyLoss = (grossRent + otherIncome) * (income.vacancyRate / 100);
    const effectiveGrossIncome = grossRent + otherIncome - vacancyLoss;

    // Expenses (grow with inflation)
    const propertyTax = purchase.purchasePrice * (expenses.propertyTaxRate / 100) * expenseGrowthFactor;
    const insurance = expenses.insuranceAnnual * expenseGrowthFactor;
    const maintenance = purchase.purchasePrice * (expenses.maintenancePercent / 100) * expenseGrowthFactor;
    const management = effectiveGrossIncome * (expenses.managementPercent / 100);
    const hoa = expenses.hoaMonthly * 12 * expenseGrowthFactor;
    const operatingExpenses = propertyTax + insurance + maintenance + management + hoa;

    const noi = effectiveGrossIncome - operatingExpenses;
    const cashFlow = noi - annualDebtService;
    cumulativeCashFlow += cashFlow;

    const propertyValue = purchase.purchasePrice * appreciationFactor;
    const loanBalance = getLoanBalanceAtMonth(loanAmount, purchase.interestRate, purchase.loanTermYears, year * 12);
    const equity = propertyValue - loanBalance;

    projection.push({
      year,
      grossRent,
      otherIncome,
      vacancyLoss,
      effectiveGrossIncome,
      operatingExpenses,
      noi,
      debtService: annualDebtService,
      cashFlow,
      cumulativeCashFlow,
      propertyValue,
      loanBalance,
      equity,
    });
  }

  return projection;
}
