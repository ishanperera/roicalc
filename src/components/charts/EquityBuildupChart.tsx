'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { Card } from '@/components/ui/Card';
import { formatCompactCurrency } from '@/lib/formatters';

export function EquityBuildupChart() {
  const cashFlowProjection = useCalculatorStore((s) => s.cashFlowProjection);

  const data = useMemo(
    () =>
      cashFlowProjection.map((y) => ({
        year: `Year ${y.year}`,
        equity: Math.round(y.equity),
        debt: Math.round(y.loanBalance),
        propertyValue: Math.round(y.propertyValue),
      })),
    [cashFlowProjection]
  );

  if (data.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Equity Buildup
      </h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatCompactCurrency(v)} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatCompactCurrency(Number(value))}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="equity"
              name="Equity"
              stackId="1"
              fill="#3b82f6"
              stroke="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="debt"
              name="Debt"
              stackId="1"
              fill="#ef4444"
              stroke="#ef4444"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
