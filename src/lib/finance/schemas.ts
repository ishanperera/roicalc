import { z } from 'zod';

const positiveNumber = z.number().min(0);
const percentage = z.number().min(0).max(100);
const rate = z.number().min(0).max(50);

export const purchaseInputsSchema = z.object({
  purchasePrice: positiveNumber,
  downPaymentPercent: percentage,
  interestRate: rate,
  loanTermYears: z.number().int().min(1).max(40),
  closingCostPercent: percentage,
});

export const renovationInputsSchema = z.object({
  renovationCost: positiveNumber,
  afterRepairValue: positiveNumber,
});

export const incomeInputsSchema = z.object({
  monthlyRent: positiveNumber,
  otherMonthlyIncome: positiveNumber,
  annualRentGrowth: z.number().min(-10).max(20),
  vacancyRate: percentage,
});

export const expenseInputsSchema = z.object({
  propertyTaxRate: percentage,
  insuranceAnnual: positiveNumber,
  maintenancePercent: percentage,
  managementPercent: percentage,
  hoaMonthly: positiveNumber,
  annualExpenseGrowth: z.number().min(-5).max(20),
});

export const commercialInputsSchema = z.object({
  isNNN: z.boolean(),
  tenantImprovementAllowance: positiveNumber,
  capexReservePercent: percentage,
  leasingCommissionPercent: percentage,
  annualCapexReserve: positiveNumber,
});

export const exitInputsSchema = z.object({
  holdPeriodYears: z.number().int().min(1).max(30),
  exitCapRate: rate,
  sellingCostPercent: percentage,
  appreciationRate: z.number().min(-10).max(20),
});

export const napkinInputsSchema = z.object({
  purchasePrice: positiveNumber,
  monthlyRent: positiveNumber,
  interestRate: rate,
});

export const proFormaInputsSchema = z.object({
  propertyType: z.enum(['residential', 'commercial']),
  purchase: purchaseInputsSchema,
  renovation: renovationInputsSchema,
  income: incomeInputsSchema,
  expenses: expenseInputsSchema,
  commercial: commercialInputsSchema,
  exit: exitInputsSchema,
});
