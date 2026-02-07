// Types
export type {
  PropertyType,
  CalculatorMode,
  NapkinInputs,
  PurchaseInputs,
  RenovationInputs,
  IncomeInputs,
  ExpenseInputs,
  CommercialInputs,
  ExitInputs,
  ProFormaInputs,
  CoreMetrics,
  CashFlowYear,
  AmortizationEntry,
  EquityMetrics,
  CommercialMetrics,
  SensitivityCell,
  SensitivityMatrix,
  CalculatorResults,
} from './types';

// Defaults
export {
  DEFAULT_PURCHASE,
  DEFAULT_RENOVATION,
  DEFAULT_INCOME,
  DEFAULT_EXPENSES,
  DEFAULT_COMMERCIAL,
  DEFAULT_EXIT,
  DEFAULT_NAPKIN,
  DEFAULT_PROFORMA,
} from './defaults';

// Schemas
export {
  purchaseInputsSchema,
  renovationInputsSchema,
  incomeInputsSchema,
  expenseInputsSchema,
  commercialInputsSchema,
  exitInputsSchema,
  napkinInputsSchema,
  proFormaInputsSchema,
} from './schemas';

// Mortgage
export {
  calcMonthlyMortgagePayment,
  generateAmortizationSchedule,
  getLoanBalanceAtMonth,
} from './mortgage';

// Core Metrics
export {
  calcNOI,
  calcCapRate,
  calcCashOnCash,
  calcGRM,
  computeCoreMetrics,
} from './core-metrics';

// IRR
export { calcIRR } from './irr';

// Cash Flow
export { generateCashFlowProjection } from './cash-flow';

// Equity
export { calcEquityMetrics } from './equity';

// Commercial
export { calcDSCR, computeCommercialMetrics } from './commercial';

// Napkin
export { napkinToProForma } from './napkin';

// Sensitivity
export { generateSensitivityMatrix } from './sensitivity';
