'use client';

import { useCalculatorMode } from '@/hooks/useCalculatorMode';
import { Tabs } from '@/components/ui/Tabs';
import { PropertyTypeToggle } from './PropertyTypeToggle';
import { NapkinForm } from './NapkinForm';
import { ProFormaForm } from './ProFormaForm';
import { AddressLookup } from './AddressLookup';
import type { CalculatorMode } from '@/lib/finance/types';

const modeTabs: { value: CalculatorMode; label: string }[] = [
  { value: 'napkin', label: 'Napkin Math' },
  { value: 'proforma', label: 'Pro-Forma' },
];

export function CalculatorShell() {
  const { mode, setMode } = useCalculatorMode();

  return (
    <div className="space-y-4">
      <AddressLookup />
      <hr className="border-gray-200/60 dark:border-gray-700/40" />
      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={modeTabs} value={mode} onChange={setMode} />
        <PropertyTypeToggle />
      </div>
      {mode === 'napkin' ? <NapkinForm /> : <ProFormaForm />}
    </div>
  );
}
