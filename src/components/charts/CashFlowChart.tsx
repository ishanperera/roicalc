'use client';

import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
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

export function CashFlowChart() {
  const cashFlowProjection = useCalculatorStore((s) => s.cashFlowProjection);

  const data = useMemo(
    () =>
      cashFlowProjection.map((y) => ({
        year: `Year ${y.year}`,
        cashFlow: Math.round(y.cashFlow),
        cumulative: Math.round(y.cumulativeCashFlow),
        noi: Math.round(y.noi),
      })),
    [cashFlowProjection]
  );

  if (data.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Cash Flow Projection
      </h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatCompactCurrency(v)} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatCompactCurrency(Number(value))}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="cashFlow" name="Cash Flow" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line
              dataKey="cumulative"
              name="Cumulative"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
