'use client';

import { cn } from '@/lib/cn';

interface TabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg bg-gray-100/50 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:bg-gray-800/50',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
            value === tab.value
              ? 'bg-white text-gray-900 shadow-md dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
