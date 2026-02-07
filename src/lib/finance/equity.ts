import type { ProFormaInputs, CashFlowYear, EquityMetrics } from './types';
import { generateCashFlowProjection } from './cash-flow';

/**
 * Calculate equity metrics including equity multiple, total profit, and equity by year.
 */
export function calcEquityMetrics(inputs: ProFormaInputs, cashFlow?: CashFlowYear[]): EquityMetrics {
  const { purchase, renovation, exit } = inputs;
  const projection = cashFlow ?? generateCashFlowProjection(inputs);

  // Total cash invested
  const downPayment = purchase.purchasePrice * (purchase.downPaymentPercent / 100);
  const closingCosts = purchase.purchasePrice * (purchase.closingCostPercent / 100);
  const totalCashInvested = downPayment + closingCosts + renovation.renovationCost;

  if (totalCashInvested <= 0) {
    return {
      equityMultiple: 0,
      totalProfit: 0,
      totalDistributions: 0,
      equityByYear: [],
    };
  }

  // Total cash flow over hold period
  const totalCashFlow = projection.reduce((sum, year) => sum + year.cashFlow, 0);

  // Sale proceeds at exit
  const lastYear = projection[projection.length - 1];
  const salePrice = lastYear ? lastYear.propertyValue : purchase.purchasePrice;
  const sellingCosts = salePrice * (exit.sellingCostPercent / 100);
  const loanBalance = lastYear ? lastYear.loanBalance : 0;
  const netSaleProceeds = salePrice - sellingCosts - loanBalance;

  const totalDistributions = totalCashFlow + netSaleProceeds;
  const totalProfit = totalDistributions - totalCashInvested;
  const equityMultiple = totalDistributions / totalCashInvested;

  const equityByYear = projection.map((y) => ({
    year: y.year,
    equity: y.equity,
    propertyValue: y.propertyValue,
    loanBalance: y.loanBalance,
  }));

  return {
    equityMultiple,
    totalProfit,
    totalDistributions,
    equityByYear,
  };
}
