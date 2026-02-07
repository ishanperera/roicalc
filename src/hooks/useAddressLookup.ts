'use client';

import { useCallback } from 'react';
import { useCalculatorStore } from '@/stores/calculatorStore';
import type { PropertyLookupResult } from '@/lib/api/types';

export function useAddressLookup() {
  const addressQuery = useCalculatorStore((s) => s.addressQuery);
  const propertyLookup = useCalculatorStore((s) => s.propertyLookup);
  const isLoading = useCalculatorStore((s) => s.lookupLoading);
  const error = useCalculatorStore((s) => s.lookupError);
  const setAddressQuery = useCalculatorStore((s) => s.setAddressQuery);
  const setLookupLoading = useCalculatorStore((s) => s.setLookupLoading);
  const setLookupError = useCalculatorStore((s) => s.setLookupError);
  const applyPropertyLookup = useCalculatorStore((s) => s.applyPropertyLookup);
  const clearLookup = useCalculatorStore((s) => s.clearLookup);

  const lookup = useCallback(
    async (address: string) => {
      const trimmed = address.trim();
      if (!trimmed) return;

      setLookupLoading(true);
      setLookupError(null);

      try {
        const res = await fetch(
          `/api/property-lookup?address=${encodeURIComponent(trimmed)}`
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(body.error || `Lookup failed (${res.status})`);
        }

        const data: PropertyLookupResult = await res.json();
        applyPropertyLookup(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lookup failed';
        setLookupError(message);
        setLookupLoading(false);
      }
    },
    [setLookupLoading, setLookupError, applyPropertyLookup]
  );

  return {
    addressQuery,
    setAddressQuery,
    lookup,
    isLoading,
    error,
    result: propertyLookup,
    clearLookup,
  };
}
