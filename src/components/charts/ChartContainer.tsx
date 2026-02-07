'use client';

import { Card } from '@/components/ui/Card';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartContainer({ title, children, height = 300 }: ChartContainerProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
