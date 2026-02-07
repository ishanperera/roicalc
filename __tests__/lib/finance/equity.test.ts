import { describe, it, expect } from 'vitest';
import { calcEquityMetrics } from '@/lib/finance/equity';
import { DEFAULT_PROFORMA } from '@/lib/finance/defaults';

describe('calcEquityMetrics', () => {
  it('computes equity multiple > 1 for default deal', () => {
    const metrics = calcEquityMetrics(DEFAULT_PROFORMA);
    expect(metrics.equityMultiple).toBeGreaterThan(1);
  });

  it('computes positive total profit for default deal', () => {
    const metrics = calcEquityMetrics(DEFAULT_PROFORMA);
    expect(metrics.totalProfit).toBeGreaterThan(0);
  });

  it('total distributions = cash flows + net sale proceeds', () => {
    const metrics = calcEquityMetrics(DEFAULT_PROFORMA);
    expect(metrics.totalDistributions).toBeGreaterThan(0);
    expect(metrics.equityMultiple).toBeCloseTo(
      metrics.totalDistributions / 69_000,
      2
    );
  });

  it('equity by year has correct number of entries', () => {
    const metrics = calcEquityMetrics(DEFAULT_PROFORMA);
    expect(metrics.equityByYear.length).toBe(DEFAULT_PROFORMA.exit.holdPeriodYears);
  });

  it('equity grows over time', () => {
    const metrics = calcEquityMetrics(DEFAULT_PROFORMA);
    const first = metrics.equityByYear[0].equity;
    const last = metrics.equityByYear[metrics.equityByYear.length - 1].equity;
    expect(last).toBeGreaterThan(first);
  });

  it('handles zero cash invested', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      purchase: { ...DEFAULT_PROFORMA.purchase, downPaymentPercent: 0, closingCostPercent: 0 },
    };
    const metrics = calcEquityMetrics(inputs);
    expect(metrics.equityMultiple).toBe(0);
  });
});
