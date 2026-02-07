import { describe, it, expect } from 'vitest';
import { calcIRR } from '@/lib/finance/irr';

describe('calcIRR', () => {
  it('calculates IRR for a simple investment', () => {
    // Invest $1000, get $1100 back after 1 year = 10% IRR
    const irr = calcIRR([-1000, 1100]);
    expect(irr).toBeCloseTo(10, 0);
  });

  it('calculates IRR for multi-year cash flows', () => {
    // Invest $10K, get $3K/year for 5 years
    const irr = calcIRR([-10000, 3000, 3000, 3000, 3000, 3000]);
    expect(irr).toBeCloseTo(15.24, 0);
  });

  it('handles negative IRR', () => {
    // Invest $10K, get less back over time
    const irr = calcIRR([-10000, 2000, 2000, 2000, 2000]);
    expect(irr).toBeLessThan(0);
  });

  it('handles real estate style cash flows (operating + sale)', () => {
    // Invest $69K, get $4K/yr for 4 years, $4K + $80K sale in year 5
    const irr = calcIRR([-69000, 4000, 4000, 4000, 4000, 84000]);
    expect(irr).toBeGreaterThan(0);
    expect(irr).toBeLessThan(30);
  });

  it('returns NaN for single cash flow', () => {
    expect(calcIRR([-1000])).toBeNaN();
  });

  it('returns NaN for all negative cash flows', () => {
    expect(calcIRR([-1000, -500, -200])).toBeNaN();
  });

  it('returns NaN for all positive cash flows', () => {
    expect(calcIRR([1000, 500, 200])).toBeNaN();
  });

  it('converges within 100 iterations for typical real estate deal', () => {
    const irr = calcIRR([-69000, 3000, 3100, 3200, 3300, 3400 + 95000]);
    expect(isNaN(irr)).toBe(false);
    expect(irr).toBeGreaterThan(5);
    expect(irr).toBeLessThan(40);
  });
});
