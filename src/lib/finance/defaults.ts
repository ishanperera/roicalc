import type {
  ProFormaInputs,
  NapkinInputs,
  PurchaseInputs,
  RenovationInputs,
  IncomeInputs,
  ExpenseInputs,
  CommercialInputs,
  ExitInputs,
} from './types';

export const DEFAULT_PURCHASE: PurchaseInputs = {
  purchasePrice: 300_000,
  downPaymentPercent: 20,
  interestRate: 7,
  loanTermYears: 30,
  closingCostPercent: 3,
};

export const DEFAULT_RENOVATION: RenovationInputs = {
  renovationCost: 0,
  afterRepairValue: 0,
};

export const DEFAULT_INCOME: IncomeInputs = {
  monthlyRent: 2_000,
  otherMonthlyIncome: 0,
  annualRentGrowth: 3,
  vacancyRate: 5,
};

export const DEFAULT_EXPENSES: ExpenseInputs = {
  propertyTaxRate: 1.2,
  insuranceAnnual: 1_200,
  maintenancePercent: 1,
  managementPercent: 8,
  hoaMonthly: 0,
  annualExpenseGrowth: 2,
};

export const DEFAULT_COMMERCIAL: CommercialInputs = {
  isNNN: false,
  tenantImprovementAllowance: 0,
  capexReservePercent: 5,
  leasingCommissionPercent: 5,
  annualCapexReserve: 0,
};

export const DEFAULT_EXIT: ExitInputs = {
  holdPeriodYears: 5,
  exitCapRate: 6,
  sellingCostPercent: 6,
  appreciationRate: 3,
};

export const DEFAULT_NAPKIN: NapkinInputs = {
  purchasePrice: 300_000,
  monthlyRent: 2_000,
  interestRate: 7,
};

export const DEFAULT_PROFORMA: ProFormaInputs = {
  propertyType: 'residential',
  purchase: { ...DEFAULT_PURCHASE },
  renovation: { ...DEFAULT_RENOVATION },
  income: { ...DEFAULT_INCOME },
  expenses: { ...DEFAULT_EXPENSES },
  commercial: { ...DEFAULT_COMMERCIAL },
  exit: { ...DEFAULT_EXIT },
};
