import { cn } from '@/lib/cn';
import { Card } from './Card';

type Health = 'green' | 'yellow' | 'red' | 'neutral';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  health?: Health;
  trend?: 'up' | 'down' | 'flat';
  className?: string;
}

const healthColors: Record<Health, string> = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-900 dark:text-gray-100',
};

const trendIcons: Record<string, string> = {
  up: '\u2191',
  down: '\u2193',
  flat: '\u2192',
};

export function MetricCard({ label, value, subtitle, health = 'neutral', trend, className }: MetricCardProps) {
  return (
    <Card padding="sm" className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-2xl font-bold tabular-nums', healthColors[health])}>
          {value}
        </span>
        {trend && (
          <span className={cn('text-sm', health === 'neutral' ? 'text-gray-500' : healthColors[health])}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
      )}
    </Card>
  );
}
