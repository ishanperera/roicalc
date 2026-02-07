'use client';

import { useCalculator } from '@/hooks/useCalculator';
import { MetricCard } from '@/components/ui/MetricCard';

function getHealth(value: number, goodMin: number, warnMin: number): 'green' | 'yellow' | 'red' {
  if (value >= goodMin) return 'green';
  if (value >= warnMin) return 'yellow';
  return 'red';
}

export function MetricsGrid() {
  const { coreMetrics, formattedMetrics, commercialMetrics, formattedCommercialMetrics, irr, equityMetrics } = useCalculator();

  if (!coreMetrics || !formattedMetrics) return null;

  const cocHealth = getHealth(coreMetrics.cashOnCash, 8, 4);
  const capRateHealth = getHealth(coreMetrics.capRate, 6, 4);
  const irrHealth = getHealth(irr, 12, 8);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <MetricCard label="NOI" value={formattedMetrics.noi} health="neutral" />
      <MetricCard label="Cap Rate" value={formattedMetrics.capRate} health={capRateHealth} />
      <MetricCard
        label="Cash-on-Cash"
        value={formattedMetrics.cashOnCash}
        health={cocHealth}
        subtitle="Annual return on cash invested"
      />
      <MetricCard label="GRM" value={formattedMetrics.grm} health="neutral" />
      <MetricCard label="Monthly Payment" value={formattedMetrics.monthlyPayment} health="neutral" />
      <MetricCard
        label="Annual Cash Flow"
        value={formattedMetrics.annualCashFlow}
        health={coreMetrics.annualCashFlow >= 0 ? 'green' : 'red'}
      />
      <MetricCard label="IRR" value={formattedMetrics.irr} health={isNaN(irr) ? 'neutral' : irrHealth} />
      <MetricCard
        label="Equity Multiple"
        value={formattedMetrics.equityMultiple}
        health={equityMetrics && equityMetrics.equityMultiple >= 2 ? 'green' : equityMetrics && equityMetrics.equityMultiple >= 1.5 ? 'yellow' : 'neutral'}
      />
      <MetricCard label="Total Cash Invested" value={formattedMetrics.totalCashInvested} health="neutral" />
      <MetricCard label="Total Profit" value={formattedMetrics.totalProfit} health="neutral" />

      {commercialMetrics && formattedCommercialMetrics && (
        <>
          <MetricCard
            label="DSCR"
            value={formattedCommercialMetrics.dscr}
            health={formattedCommercialMetrics.dscrHealth as 'green' | 'yellow' | 'red'}
            subtitle="Debt Service Coverage"
          />
          <MetricCard label="CAPEX Reserve" value={formattedCommercialMetrics.capexReserve} health="neutral" />
        </>
      )}
    </div>
  );
}
