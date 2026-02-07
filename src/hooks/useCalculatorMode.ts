'use client';

import { useCalculatorStore } from '@/stores/calculatorStore';
import type { CalculatorMode } from '@/lib/finance/types';

export function useCalculatorMode() {
  const mode = useCalculatorStore((s) => s.mode);
  const setMode = useCalculatorStore((s) => s.setMode);

  const toggleMode = () => {
    setMode(mode === 'napkin' ? 'proforma' : 'napkin');
  };

  const isNapkin = mode === 'napkin';
  const isProForma = mode === 'proforma';

  return {
    mode,
    setMode: (m: CalculatorMode) => setMode(m),
    toggleMode,
    isNapkin,
    isProForma,
  };
}
