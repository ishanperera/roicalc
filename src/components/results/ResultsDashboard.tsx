'use client';

import { useUIStore } from '@/stores/uiStore';
import { Tabs } from '@/components/ui/Tabs';
import { MetricsGrid } from './MetricsGrid';
import { GoalTracker } from './GoalTracker';
import { CashFlowChart } from '@/components/charts/CashFlowChart';
import { EquityBuildupChart } from '@/components/charts/EquityBuildupChart';
import { ExpenseBreakdown } from '@/components/charts/ExpenseBreakdown';
import { SensitivityMatrix } from '@/components/charts/SensitivityMatrix';

type ResultsTab = 'metrics' | 'charts' | 'sensitivity';

const resultTabs: { value: ResultsTab; label: string }[] = [
  { value: 'metrics', label: 'Metrics' },
  { value: 'charts', label: 'Charts' },
  { value: 'sensitivity', label: 'Sensitivity' },
];

export function ResultsDashboard() {
  const resultsTab = useUIStore((s) => s.resultsTab);
  const setResultsTab = useUIStore((s) => s.setResultsTab);

  return (
    <div className="space-y-4">
      <Tabs tabs={resultTabs} value={resultsTab} onChange={setResultsTab} />

      {resultsTab === 'metrics' && (
        <div className="space-y-4">
          <MetricsGrid />
          <GoalTracker />
        </div>
      )}

      {resultsTab === 'charts' && (
        <div className="space-y-6">
          <CashFlowChart />
          <EquityBuildupChart />
          <ExpenseBreakdown />
        </div>
      )}

      {resultsTab === 'sensitivity' && (
        <SensitivityMatrix />
      )}
    </div>
  );
}
