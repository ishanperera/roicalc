'use client';

import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-thin space-y-4">
          <CalculatorShell />
        </aside>
        <section className="min-w-0">
          <ResultsDashboard />
        </section>
      </div>
    </div>
  );
}
