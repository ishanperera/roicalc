import type { ProFormaInputs, CommercialMetrics } from './types';
import { computeCoreMetrics } from './core-metrics';

/**
 * Calculate Debt Service Coverage Ratio.
 * DSCR = NOI / Annual Debt Service
 * >= 1.25 is healthy (green), < 1.0 means cash flow doesn't cover debt (red)
 */
export function calcDSCR(noi: number, annualDebtService: number): number {
  if (annualDebtService <= 0) return noi > 0 ? Infinity : 0;
  return noi / annualDebtService;
}

/**
 * Compute commercial-specific metrics including DSCR, CAPEX reserves, and TI allowances.
 * For NNN leases, tenant covers taxes, insurance, and maintenance.
 */
export function computeCommercialMetrics(inputs: ProFormaInputs): CommercialMetrics {
  const { purchase, commercial, expenses } = inputs;

  // Start with core metrics
  const core = computeCoreMetrics(inputs);

  // CAPEX reserve (either percentage of NOI or fixed annual amount)
  const capexReserve = commercial.annualCapexReserve > 0
    ? commercial.annualCapexReserve
    : core.noi * (commercial.capexReservePercent / 100);

  const tenantImprovements = commercial.tenantImprovementAllowance;

  // For NNN leases, tenant pays property taxes, insurance, and maintenance
  // These are already accounted for in the NOI, so we don't subtract them again
  // Instead, NNN means the NOI is effectively higher since tenant reimburses these costs
  let nnnReimbursement = 0;
  if (commercial.isNNN) {
    const propertyTax = purchase.purchasePrice * (expenses.propertyTaxRate / 100);
    const maintenance = purchase.purchasePrice * (expenses.maintenancePercent / 100);
    nnnReimbursement = propertyTax + expenses.insuranceAnnual + maintenance;
  }

  const adjustedNoi = core.noi + nnnReimbursement;
  const noiAfterCapex = adjustedNoi - capexReserve;
  const dscr = calcDSCR(adjustedNoi, core.annualDebtService);

  return {
    ...core,
    noi: adjustedNoi,
    annualCashFlow: adjustedNoi - core.annualDebtService,
    dscr,
    capexReserve,
    tenantImprovements,
    noiAfterCapex,
  };
}
