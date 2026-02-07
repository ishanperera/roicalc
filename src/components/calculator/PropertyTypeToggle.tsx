'use client';

import { Tabs } from '@/components/ui/Tabs';
import { useCalculatorStore } from '@/stores/calculatorStore';
import type { PropertyType } from '@/lib/finance/types';

const tabs: { value: PropertyType; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

export function PropertyTypeToggle() {
  const propertyType = useCalculatorStore((s) => s.propertyType);
  const setPropertyType = useCalculatorStore((s) => s.setPropertyType);

  return (
    <Tabs
      tabs={tabs}
      value={propertyType}
      onChange={setPropertyType}
    />
  );
}
