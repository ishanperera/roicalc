'use client';

import { useCalculatorStore } from '@/stores/calculatorStore';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

function getCellColor(irr: number): string {
  if (irr >= 15) return 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300';
  if (irr >= 10) return 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  if (irr >= 5) return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  if (irr >= 0) return 'bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
  return 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-300';
}

export function SensitivityMatrix() {
  const matrix = useCalculatorStore((s) => s.sensitivityMatrix);

  if (!matrix) return null;

  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Sensitivity Analysis — IRR (%)
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        {matrix.rowLabel} (rows) vs {matrix.colLabel} (columns)
      </p>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[480px] border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Exit Cap / Vacancy
              </th>
              {matrix.colValues.map((col, ci) => (
                <th
                  key={ci}
                  className={cn(
                    'p-2 text-center text-[11px] font-medium',
                    ci === matrix.baseColIndex
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {col.toFixed(1)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.cells.map((row, ri) => (
              <tr key={ri}>
                <td
                  className={cn(
                    'p-2 text-[11px] font-medium',
                    ri === matrix.baseRowIndex
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {matrix.rowValues[ri].toFixed(1)}%
                </td>
                {row.map((cell, ci) => {
                  const isBase = ri === matrix.baseRowIndex && ci === matrix.baseColIndex;
                  return (
                    <td
                      key={ci}
                      className={cn(
                        'rounded-md p-2 text-center tabular-nums transition-colors',
                        getCellColor(cell.irr),
                        isBase && 'ring-2 ring-blue-500 ring-inset font-bold shadow-md shadow-blue-500/20'
                      )}
                    >
                      {cell.irr.toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
