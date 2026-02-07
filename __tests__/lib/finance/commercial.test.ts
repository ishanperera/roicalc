import { describe, it, expect } from 'vitest';
import { calcDSCR, computeCommercialMetrics } from '@/lib/finance/commercial';
import { DEFAULT_PROFORMA } from '@/lib/finance/defaults';

describe('calcDSCR', () => {
  it('calculates DSCR correctly', () => {
    // DSCR = NOI / Debt Service = 25000 / 20000 = 1.25
    expect(calcDSCR(25000, 20000)).toBeCloseTo(1.25, 2);
  });

  it('returns Infinity for zero debt service with positive NOI', () => {
    expect(calcDSCR(25000, 0)).toBe(Infinity);
  });

  it('returns 0 for zero debt service with zero NOI', () => {
    expect(calcDSCR(0, 0)).toBe(0);
  });

  it('handles DSCR < 1 (cash flow negative)', () => {
    expect(calcDSCR(15000, 20000)).toBeCloseTo(0.75, 2);
  });
});

describe('computeCommercialMetrics', () => {
  it('computes DSCR for default commercial inputs', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      propertyType: 'commercial' as const,
    };
    const metrics = computeCommercialMetrics(inputs);
    expect(metrics.dscr).toBeGreaterThan(0);
  });

  it('NNN lease increases effective NOI', () => {
    const baseInputs = {
      ...DEFAULT_PROFORMA,
      propertyType: 'commercial' as const,
    };
    const nnnInputs = {
      ...baseInputs,
      commercial: { ...baseInputs.commercial, isNNN: true },
    };

    const baseMetrics = computeCommercialMetrics(baseInputs);
    const nnnMetrics = computeCommercialMetrics(nnnInputs);

    expect(nnnMetrics.noi).toBeGreaterThan(baseMetrics.noi);
    expect(nnnMetrics.dscr).toBeGreaterThan(baseMetrics.dscr);
  });

  it('CAPEX reserve reduces NOI after CAPEX', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      propertyType: 'commercial' as const,
      commercial: { ...DEFAULT_PROFORMA.commercial, capexReservePercent: 10 },
    };
    const metrics = computeCommercialMetrics(inputs);
    expect(metrics.noiAfterCapex).toBeLessThan(metrics.noi);
  });
});
