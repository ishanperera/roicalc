'use client';

import { cn } from '@/lib/cn';
import { type InputHTMLAttributes, forwardRef, useCallback } from 'react';

type InputMode = 'currency' | 'percent' | 'rate' | 'number' | 'years';

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  mode?: InputMode;
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  hint?: string;
}

const prefixes: Partial<Record<InputMode, string>> = {
  currency: '$',
};

const suffixes: Partial<Record<InputMode, string>> = {
  percent: '%',
  rate: '%',
  years: 'yr',
};

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ label, value, onChange, mode = 'number', showSlider, sliderMin = 0, sliderMax = 100, sliderStep = 1, hint, className, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.-]/g, '');
        const num = parseFloat(raw);
        if (!isNaN(num)) onChange(num);
        else if (raw === '' || raw === '-') onChange(0);
      },
      [onChange]
    );

    const handleSlider = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
      },
      [onChange]
    );

    const prefix = prefixes[mode];
    const suffix = suffixes[mode];

    const displayValue = mode === 'currency'
      ? value.toLocaleString('en-US')
      : value.toString();

    return (
      <div className={cn('space-y-1', className)}>
        <label className="block text-[13px] font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              'w-full rounded-lg border border-gray-300 bg-white py-2 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500',
              prefix ? 'pl-7' : 'pl-3',
              suffix ? 'pr-8' : 'pr-3'
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {suffix}
            </span>
          )}
        </div>
        {showSlider && (
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={value}
            onChange={handleSlider}
            className="mt-1 w-full"
            aria-label={`${label} slider`}
          />
        )}
        {hint && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);
NumericInput.displayName = 'NumericInput';
