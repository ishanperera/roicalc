'use client';

import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <CalculatorShell />
        </aside>
        <section className="min-w-0">
          <ResultsDashboard />
        </section>
      </div>
    </div>
  );
}
