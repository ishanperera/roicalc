import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, label, showPercent = true, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const isComplete = percent >= 100;

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercent && (
            <span className="tabular-nums text-gray-500 dark:text-gray-400">
              {percent.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-sm shadow-green-500/20'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm shadow-blue-500/20'
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
