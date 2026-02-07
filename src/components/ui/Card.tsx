import { cn } from '@/lib/cn';
import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({ className, padding = 'md', hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/60 bg-white shadow-elevated overflow-hidden transition-shadow duration-300 dark:border-gray-700/40 dark:bg-gray-900',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
