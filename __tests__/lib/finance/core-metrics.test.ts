import { describe, it, expect } from 'vitest';
import {
  calcNOI,
  calcCapRate,
  calcCashOnCash,
  calcGRM,
  computeCoreMetrics,
} from '@/lib/finance/core-metrics';
import { DEFAULT_PROFORMA } from '@/lib/finance/defaults';

describe('calcNOI', () => {
  it('calculates NOI correctly', () => {
    // $2K/mo rent, 5% vacancy = EGI of $22,800; assume $7,920 OpEx
    const egi = 2000 * 12 * 0.95; // $22,800
    const opex = 7920;
    expect(calcNOI(egi, opex)).toBeCloseTo(14880, 0);
  });
});

describe('calcCapRate', () => {
  it('calculates cap rate correctly', () => {
    // $14,880 NOI / $300K = 4.96%
    expect(calcCapRate(14880, 300_000)).toBeCloseTo(4.96, 2);
  });

  it('returns 0 for zero price', () => {
    expect(calcCapRate(14880, 0)).toBe(0);
  });
});

describe('calcCashOnCash', () => {
  it('calculates positive CoC', () => {
    expect(calcCashOnCash(5000, 69_000)).toBeCloseTo(7.25, 1);
  });

  it('handles negative cash flow', () => {
    const result = calcCashOnCash(-2000, 69_000);
    expect(result).toBeLessThan(0);
  });

  it('returns 0 for zero investment', () => {
    expect(calcCashOnCash(5000, 0)).toBe(0);
  });
});

describe('calcGRM', () => {
  it('calculates GRM correctly', () => {
    // $300K / ($2K * 12) = 12.5
    expect(calcGRM(300_000, 24_000)).toBeCloseTo(12.5, 1);
  });

  it('returns 0 for zero rent', () => {
    expect(calcGRM(300_000, 0)).toBe(0);
  });
});

describe('computeCoreMetrics', () => {
  it('computes all metrics for default inputs', () => {
    const metrics = computeCoreMetrics(DEFAULT_PROFORMA);

    expect(metrics.loanAmount).toBe(240_000);
    expect(metrics.monthlyPayment).toBeCloseTo(1596.73, 0);
    expect(metrics.annualDebtService).toBeCloseTo(19160.8, 0);
    expect(metrics.noi).toBeGreaterThan(0);
    expect(metrics.capRate).toBeGreaterThan(0);
    expect(metrics.grm).toBeCloseTo(12.5, 1);
    expect(metrics.totalCashInvested).toBe(69_000); // 60K down + 9K closing
  });

  it('handles all-cash purchase (100% down)', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      purchase: { ...DEFAULT_PROFORMA.purchase, downPaymentPercent: 100 },
    };
    const metrics = computeCoreMetrics(inputs);
    expect(metrics.monthlyPayment).toBe(0);
    expect(metrics.annualDebtService).toBe(0);
    expect(metrics.annualCashFlow).toBe(metrics.noi);
  });
});
