import type { ProFormaInputs, SensitivityMatrix, SensitivityCell } from './types';
import { generateCashFlowProjection } from './cash-flow';
import { computeCoreMetrics } from './core-metrics';
import { calcIRR } from './irr';
import { calcCashOnCash } from './core-metrics';

/**
 * Generate a 2D sensitivity matrix varying exit cap rate (rows) and vacancy rate (columns).
 * Returns IRR and CoC for each combination.
 *
 * Default: 7 rows (exit cap rate) x 6 columns (vacancy rate) = 42 cells
 */
export function generateSensitivityMatrix(
  inputs: ProFormaInputs,
  rowSteps = 7,
  colSteps = 6
): SensitivityMatrix {
  const baseExitCapRate = inputs.exit.exitCapRate;
  const baseVacancy = inputs.income.vacancyRate;

  // Generate exit cap rate values centered on base (e.g., 3% to 9% for base of 6%)
  const rowSpread = Math.max(baseExitCapRate - 1, 3);
  const rowStep = (rowSpread * 2) / (rowSteps - 1);
  const rowValues: number[] = [];
  for (let i = 0; i < rowSteps; i++) {
    const val = Math.max(0.5, baseExitCapRate - rowSpread + i * rowStep);
    rowValues.push(Math.round(val * 100) / 100);
  }

  // Generate vacancy rate values (e.g., 0% to 15% for base of 5%)
  const colMax = Math.max(baseVacancy + 10, 15);
  const colStep = colMax / (colSteps - 1);
  const colValues: number[] = [];
  for (let i = 0; i < colSteps; i++) {
    colValues.push(Math.round(i * colStep * 100) / 100);
  }

  // Find base indices
  const baseRowIndex = rowValues.reduce((closest, val, idx) =>
    Math.abs(val - baseExitCapRate) < Math.abs(rowValues[closest] - baseExitCapRate) ? idx : closest, 0);
  const baseColIndex = colValues.reduce((closest, val, idx) =>
    Math.abs(val - baseVacancy) < Math.abs(colValues[closest] - baseVacancy) ? idx : closest, 0);

  // Compute matrix
  const cells: SensitivityCell[][] = [];

  for (let r = 0; r < rowSteps; r++) {
    const row: SensitivityCell[] = [];
    for (let c = 0; c < colSteps; c++) {
      const modifiedInputs: ProFormaInputs = {
        ...inputs,
        income: { ...inputs.income, vacancyRate: colValues[c] },
        exit: { ...inputs.exit, exitCapRate: rowValues[r] },
      };

      const metrics = computeCoreMetrics(modifiedInputs);
      const projection = generateCashFlowProjection(modifiedInputs);

      // Build IRR cash flows: initial investment + annual cash flows + sale proceeds at exit
      const downPayment = modifiedInputs.purchase.purchasePrice * (modifiedInputs.purchase.downPaymentPercent / 100);
      const closingCosts = modifiedInputs.purchase.purchasePrice * (modifiedInputs.purchase.closingCostPercent / 100);
      const totalCashInvested = downPayment + closingCosts + modifiedInputs.renovation.renovationCost;

      const lastYear = projection[projection.length - 1];
      const exitNoi = lastYear ? lastYear.noi : metrics.noi;
      const exitCapRate = rowValues[r] / 100;
      const salePrice = exitCapRate > 0 ? exitNoi / exitCapRate : 0;
      const sellingCosts = salePrice * (modifiedInputs.exit.sellingCostPercent / 100);
      const netSaleProceeds = salePrice - sellingCosts - (lastYear ? lastYear.loanBalance : 0);

      const irrCashFlows = [
        -totalCashInvested,
        ...projection.map((y, idx) =>
          idx === projection.length - 1 ? y.cashFlow + netSaleProceeds : y.cashFlow
        ),
      ];

      const irr = calcIRR(irrCashFlows);
      const coc = calcCashOnCash(metrics.annualCashFlow, totalCashInvested);

      row.push({
        rowParam: rowValues[r],
        colParam: colValues[c],
        irr: isNaN(irr) ? 0 : irr,
        coc,
      });
    }
    cells.push(row);
  }

  return {
    rowLabel: 'Exit Cap Rate (%)',
    colLabel: 'Vacancy Rate (%)',
    rowValues,
    colValues,
    cells,
    baseRowIndex,
    baseColIndex,
  };
}
