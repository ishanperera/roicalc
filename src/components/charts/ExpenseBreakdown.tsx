'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '8px 12px',
  fontSize: 12,
};

export function ExpenseBreakdown() {
  const inputs = useCalculatorStore((s) => s.proFormaInputs);
  const coreMetrics = useCalculatorStore((s) => s.coreMetrics);

  const data = useMemo(() => {
    const { purchase, expenses } = inputs;
    const egi = coreMetrics?.effectiveGrossIncome ?? 0;

    const items = [
      { name: 'Property Tax', value: purchase.purchasePrice * (expenses.propertyTaxRate / 100) },
      { name: 'Insurance', value: expenses.insuranceAnnual },
      { name: 'Maintenance', value: purchase.purchasePrice * (expenses.maintenancePercent / 100) },
      { name: 'Management', value: egi * (expenses.managementPercent / 100) },
      { name: 'HOA', value: expenses.hoaMonthly * 12 },
      { name: 'Debt Service', value: coreMetrics?.annualDebtService ?? 0 },
    ];

    return items.filter((item) => item.value > 0).map((item) => ({
      ...item,
      value: Math.round(item.value),
    }));
  }, [inputs, coreMetrics]);

  if (data.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Expense Breakdown
      </h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={tooltipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
