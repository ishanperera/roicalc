'use client';

import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { NumericInput } from '@/components/ui/Input';

export function GoalTracker() {
  const { coreMetrics, irr } = useCalculator();
  const [targetCoC, setTargetCoC] = useState(10);
  const [targetIRR, setTargetIRR] = useState(15);

  if (!coreMetrics) return null;

  const currentCoC = coreMetrics.cashOnCash;
  const currentIRR = isNaN(irr) ? 0 : irr;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Goal Tracker
      </h3>
      <div className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <ProgressBar
              value={currentCoC}
              max={targetCoC}
              label={`Cash-on-Cash: ${currentCoC.toFixed(1)}% / ${targetCoC}%`}
            />
          </div>
          <NumericInput
            label="Target"
            value={targetCoC}
            onChange={setTargetCoC}
            mode="percent"
            className="w-24"
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <ProgressBar
              value={currentIRR}
              max={targetIRR}
              label={`IRR: ${currentIRR.toFixed(1)}% / ${targetIRR}%`}
            />
          </div>
          <NumericInput
            label="Target"
            value={targetIRR}
            onChange={setTargetIRR}
            mode="percent"
            className="w-24"
          />
        </div>
      </div>
    </Card>
  );
}
