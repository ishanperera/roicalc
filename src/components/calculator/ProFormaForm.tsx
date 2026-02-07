'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { NumericInput } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
        aria-expanded={open}
      >
        {title}
        <span className={cn('text-gray-400 transition-transform', open && 'rotate-180')}>
          &#9662;
        </span>
      </button>
      {open && <div className="space-y-3 pb-4">{children}</div>}
    </div>
  );
}

export function ProFormaForm() {
  const store = useCalculatorStore();
  const { proFormaInputs: inputs, propertyType } = store;

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Pro-Forma Analysis
      </h3>

      <AccordionSection title="Purchase" defaultOpen>
        <NumericInput label="Purchase Price" value={inputs.purchase.purchasePrice} onChange={(v) => store.updatePurchaseInputs({ purchasePrice: v })} mode="currency" />
        <NumericInput label="Down Payment" value={inputs.purchase.downPaymentPercent} onChange={(v) => store.updatePurchaseInputs({ downPaymentPercent: v })} mode="percent" showSlider sliderMin={0} sliderMax={100} sliderStep={1} />
        <NumericInput label="Interest Rate" value={inputs.purchase.interestRate} onChange={(v) => store.updatePurchaseInputs({ interestRate: v })} mode="rate" showSlider sliderMin={2} sliderMax={12} sliderStep={0.125} />
        <NumericInput label="Loan Term" value={inputs.purchase.loanTermYears} onChange={(v) => store.updatePurchaseInputs({ loanTermYears: v })} mode="years" />
        <NumericInput label="Closing Costs" value={inputs.purchase.closingCostPercent} onChange={(v) => store.updatePurchaseInputs({ closingCostPercent: v })} mode="percent" />
      </AccordionSection>

      <AccordionSection title="Renovation">
        <NumericInput label="Renovation Cost" value={inputs.renovation.renovationCost} onChange={(v) => store.updateRenovationInputs({ renovationCost: v })} mode="currency" />
        <NumericInput label="After Repair Value (ARV)" value={inputs.renovation.afterRepairValue} onChange={(v) => store.updateRenovationInputs({ afterRepairValue: v })} mode="currency" />
      </AccordionSection>

      <AccordionSection title="Income" defaultOpen>
        <NumericInput label="Monthly Rent" value={inputs.income.monthlyRent} onChange={(v) => store.updateIncomeInputs({ monthlyRent: v })} mode="currency" />
        <NumericInput label="Other Monthly Income" value={inputs.income.otherMonthlyIncome} onChange={(v) => store.updateIncomeInputs({ otherMonthlyIncome: v })} mode="currency" />
        <NumericInput label="Annual Rent Growth" value={inputs.income.annualRentGrowth} onChange={(v) => store.updateIncomeInputs({ annualRentGrowth: v })} mode="percent" />
        <NumericInput label="Vacancy Rate" value={inputs.income.vacancyRate} onChange={(v) => store.updateIncomeInputs({ vacancyRate: v })} mode="percent" showSlider sliderMin={0} sliderMax={20} sliderStep={0.5} />
      </AccordionSection>

      <AccordionSection title="Expenses">
        <NumericInput label="Property Tax Rate" value={inputs.expenses.propertyTaxRate} onChange={(v) => store.updateExpenseInputs({ propertyTaxRate: v })} mode="percent" />
        <NumericInput label="Annual Insurance" value={inputs.expenses.insuranceAnnual} onChange={(v) => store.updateExpenseInputs({ insuranceAnnual: v })} mode="currency" />
        <NumericInput label="Maintenance (%)" value={inputs.expenses.maintenancePercent} onChange={(v) => store.updateExpenseInputs({ maintenancePercent: v })} mode="percent" />
        <NumericInput label="Management Fee" value={inputs.expenses.managementPercent} onChange={(v) => store.updateExpenseInputs({ managementPercent: v })} mode="percent" />
        <NumericInput label="Monthly HOA" value={inputs.expenses.hoaMonthly} onChange={(v) => store.updateExpenseInputs({ hoaMonthly: v })} mode="currency" />
        <NumericInput label="Annual Expense Growth" value={inputs.expenses.annualExpenseGrowth} onChange={(v) => store.updateExpenseInputs({ annualExpenseGrowth: v })} mode="percent" />
      </AccordionSection>

      {propertyType === 'commercial' && (
        <AccordionSection title="Commercial" defaultOpen>
          <div className="flex items-center gap-3">
            <Toggle
              enabled={inputs.commercial.isNNN}
              onChange={(v) => store.updateCommercialInputs({ isNNN: v })}
              label="NNN Lease"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">NNN Lease</span>
          </div>
          <NumericInput label="Tenant Improvement Allowance" value={inputs.commercial.tenantImprovementAllowance} onChange={(v) => store.updateCommercialInputs({ tenantImprovementAllowance: v })} mode="currency" />
          <NumericInput label="CAPEX Reserve (%)" value={inputs.commercial.capexReservePercent} onChange={(v) => store.updateCommercialInputs({ capexReservePercent: v })} mode="percent" />
          <NumericInput label="Leasing Commission (%)" value={inputs.commercial.leasingCommissionPercent} onChange={(v) => store.updateCommercialInputs({ leasingCommissionPercent: v })} mode="percent" />
          <NumericInput label="Annual CAPEX Reserve ($)" value={inputs.commercial.annualCapexReserve} onChange={(v) => store.updateCommercialInputs({ annualCapexReserve: v })} mode="currency" />
        </AccordionSection>
      )}

      <AccordionSection title="Exit Strategy">
        <NumericInput label="Hold Period" value={inputs.exit.holdPeriodYears} onChange={(v) => store.updateExitInputs({ holdPeriodYears: Math.max(1, Math.round(v)) })} mode="years" showSlider sliderMin={1} sliderMax={30} sliderStep={1} />
        <NumericInput label="Exit Cap Rate" value={inputs.exit.exitCapRate} onChange={(v) => store.updateExitInputs({ exitCapRate: v })} mode="percent" />
        <NumericInput label="Selling Costs" value={inputs.exit.sellingCostPercent} onChange={(v) => store.updateExitInputs({ sellingCostPercent: v })} mode="percent" />
        <NumericInput label="Annual Appreciation" value={inputs.exit.appreciationRate} onChange={(v) => store.updateExitInputs({ appreciationRate: v })} mode="percent" />
      </AccordionSection>
    </Card>
  );
}
