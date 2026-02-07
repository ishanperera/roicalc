export type PropertyType = 'residential' | 'commercial';
export type CalculatorMode = 'napkin' | 'proforma';

export interface NapkinInputs {
  purchasePrice: number;
  monthlyRent: number;
  interestRate: number;
}

export interface PurchaseInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  closingCostPercent: number;
}

export interface RenovationInputs {
  renovationCost: number;
  afterRepairValue: number;
}

export interface IncomeInputs {
  monthlyRent: number;
  otherMonthlyIncome: number;
  annualRentGrowth: number;
  vacancyRate: number;
}

export interface ExpenseInputs {
  propertyTaxRate: number;
  insuranceAnnual: number;
  maintenancePercent: number;
  managementPercent: number;
  hoaMonthly: number;
  annualExpenseGrowth: number;
}

export interface CommercialInputs {
  isNNN: boolean;
  tenantImprovementAllowance: number;
  capexReservePercent: number;
  leasingCommissionPercent: number;
  annualCapexReserve: number;
}

export interface ExitInputs {
  holdPeriodYears: number;
  exitCapRate: number;
  sellingCostPercent: number;
  appreciationRate: number;
}

export interface ProFormaInputs {
  propertyType: PropertyType;
  purchase: PurchaseInputs;
  renovation: RenovationInputs;
  income: IncomeInputs;
  expenses: ExpenseInputs;
  commercial: CommercialInputs;
  exit: ExitInputs;
}

export interface CoreMetrics {
  noi: number;
  capRate: number;
  cashOnCash: number;
  grm: number;
  monthlyPayment: number;
  annualDebtService: number;
  annualCashFlow: number;
  totalCashInvested: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  loanAmount: number;
}

export interface CashFlowYear {
  year: number;
  grossRent: number;
  otherIncome: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EquityMetrics {
  equityMultiple: number;
  totalProfit: number;
  totalDistributions: number;
  equityByYear: { year: number; equity: number; propertyValue: number; loanBalance: number }[];
}

export interface CommercialMetrics extends CoreMetrics {
  dscr: number;
  capexReserve: number;
  tenantImprovements: number;
  noiAfterCapex: number;
}

export interface SensitivityCell {
  rowParam: number;
  colParam: number;
  irr: number;
  coc: number;
}

export interface SensitivityMatrix {
  rowLabel: string;
  colLabel: string;
  rowValues: number[];
  colValues: number[];
  cells: SensitivityCell[][];
  baseRowIndex: number;
  baseColIndex: number;
}

export interface CalculatorResults {
  mode: CalculatorMode;
  propertyType: PropertyType;
  inputs: ProFormaInputs;
  coreMetrics: CoreMetrics;
  commercialMetrics?: CommercialMetrics;
  cashFlowProjection: CashFlowYear[];
  equityMetrics: EquityMetrics;
  irr: number;
  sensitivityMatrix: SensitivityMatrix;
}
