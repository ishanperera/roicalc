'use client';

import { useCalculatorStore } from '@/stores/calculatorStore';
import { NumericInput } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function NapkinForm() {
  const napkinInputs = useCalculatorStore((s) => s.napkinInputs);
  const updateNapkinInputs = useCalculatorStore((s) => s.updateNapkinInputs);

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Quick Analysis
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Enter 3 values for an instant estimate using industry heuristics.
      </p>
      <div className="space-y-4">
        <NumericInput
          label="Purchase Price"
          value={napkinInputs.purchasePrice}
          onChange={(v) => updateNapkinInputs({ purchasePrice: v })}
          mode="currency"
          showSlider
          sliderMin={50000}
          sliderMax={2000000}
          sliderStep={10000}
        />
        <NumericInput
          label="Monthly Rent"
          value={napkinInputs.monthlyRent}
          onChange={(v) => updateNapkinInputs({ monthlyRent: v })}
          mode="currency"
          showSlider
          sliderMin={500}
          sliderMax={15000}
          sliderStep={100}
        />
        <NumericInput
          label="Interest Rate"
          value={napkinInputs.interestRate}
          onChange={(v) => updateNapkinInputs({ interestRate: v })}
          mode="rate"
          showSlider
          sliderMin={2}
          sliderMax={12}
          sliderStep={0.125}
        />
      </div>
    </Card>
  );
}
