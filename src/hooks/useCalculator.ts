'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { formatCurrency, formatPercent, formatMultiplier, formatCompactCurrency } from '@/lib/formatters';

export function useCalculator() {
  const store = useCalculatorStore();

  const formattedMetrics = useMemo(() => {
    if (!store.coreMetrics) return null;
    const m = store.coreMetrics;

    return {
      noi: formatCurrency(m.noi),
      capRate: formatPercent(m.capRate),
      cashOnCash: formatPercent(m.cashOnCash),
      grm: formatMultiplier(m.grm),
      monthlyPayment: formatCurrency(m.monthlyPayment),
      annualDebtService: formatCurrency(m.annualDebtService),
      annualCashFlow: formatCurrency(m.annualCashFlow),
      totalCashInvested: formatCurrency(m.totalCashInvested),
      loanAmount: formatCurrency(m.loanAmount),
      irr: isNaN(store.irr) ? 'N/A' : formatPercent(store.irr),
      equityMultiple: store.equityMetrics
        ? formatMultiplier(store.equityMetrics.equityMultiple)
        : 'N/A',
      totalProfit: store.equityMetrics
        ? formatCompactCurrency(store.equityMetrics.totalProfit)
        : 'N/A',
    };
  }, [store.coreMetrics, store.irr, store.equityMetrics]);

  const formattedCommercialMetrics = useMemo(() => {
    if (!store.commercialMetrics) return null;
    const m = store.commercialMetrics;
    return {
      dscr: m.dscr === Infinity ? '∞' : m.dscr.toFixed(2),
      dscrHealth: m.dscr >= 1.25 ? 'green' : m.dscr >= 1.0 ? 'yellow' : 'red',
      capexReserve: formatCurrency(m.capexReserve),
      noiAfterCapex: formatCurrency(m.noiAfterCapex),
    };
  }, [store.commercialMetrics]);

  return {
    ...store,
    formattedMetrics,
    formattedCommercialMetrics,
  };
}
