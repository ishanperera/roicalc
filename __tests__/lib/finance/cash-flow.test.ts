import { describe, it, expect } from 'vitest';
import { generateCashFlowProjection } from '@/lib/finance/cash-flow';
import { DEFAULT_PROFORMA } from '@/lib/finance/defaults';

describe('generateCashFlowProjection', () => {
  it('generates correct number of years', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection.length).toBe(DEFAULT_PROFORMA.exit.holdPeriodYears);
  });

  it('year 1 rent matches input', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection[0].grossRent).toBeCloseTo(24_000, 0);
  });

  it('rent grows year over year', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection[1].grossRent).toBeGreaterThan(projection[0].grossRent);
  });

  it('cumulative cash flow accumulates', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    let running = 0;
    for (const year of projection) {
      running += year.cashFlow;
      expect(year.cumulativeCashFlow).toBeCloseTo(running, 0);
    }
  });

  it('property value appreciates', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection[4].propertyValue).toBeGreaterThan(projection[0].propertyValue);
  });

  it('loan balance decreases over time', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection[4].loanBalance).toBeLessThan(projection[0].loanBalance);
  });

  it('equity increases over time', () => {
    const projection = generateCashFlowProjection(DEFAULT_PROFORMA);
    expect(projection[4].equity).toBeGreaterThan(projection[0].equity);
  });

  it('handles 1-year hold period', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      exit: { ...DEFAULT_PROFORMA.exit, holdPeriodYears: 1 },
    };
    const projection = generateCashFlowProjection(inputs);
    expect(projection.length).toBe(1);
  });

  it('handles 30-year hold period', () => {
    const inputs = {
      ...DEFAULT_PROFORMA,
      exit: { ...DEFAULT_PROFORMA.exit, holdPeriodYears: 30 },
    };
    const projection = generateCashFlowProjection(inputs);
    expect(projection.length).toBe(30);
  });
});
