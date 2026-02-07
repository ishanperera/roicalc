import { describe, it, expect } from 'vitest';
import {
  calcMonthlyMortgagePayment,
  generateAmortizationSchedule,
  getLoanBalanceAtMonth,
} from '@/lib/finance/mortgage';

describe('calcMonthlyMortgagePayment', () => {
  it('calculates correctly for $240K @ 7% 30yr', () => {
    const payment = calcMonthlyMortgagePayment(240_000, 7, 30);
    expect(payment).toBeCloseTo(1596.73, 0);
  });

  it('calculates correctly for $200K @ 5% 15yr', () => {
    const payment = calcMonthlyMortgagePayment(200_000, 5, 15);
    expect(payment).toBeCloseTo(1581.59, 0);
  });

  it('returns 0 for zero principal', () => {
    expect(calcMonthlyMortgagePayment(0, 7, 30)).toBe(0);
  });

  it('handles zero interest rate (interest-free loan)', () => {
    const payment = calcMonthlyMortgagePayment(120_000, 0, 10);
    expect(payment).toBeCloseTo(1000, 0);
  });

  it('returns 0 for negative principal', () => {
    expect(calcMonthlyMortgagePayment(-100_000, 7, 30)).toBe(0);
  });
});

describe('generateAmortizationSchedule', () => {
  it('generates correct number of entries', () => {
    const schedule = generateAmortizationSchedule(240_000, 7, 30);
    expect(schedule.length).toBe(360);
  });

  it('has balance near zero at end', () => {
    const schedule = generateAmortizationSchedule(240_000, 7, 30);
    const lastEntry = schedule[schedule.length - 1];
    expect(lastEntry.balance).toBeCloseTo(0, 0);
  });

  it('first month interest > principal for typical mortgage', () => {
    const schedule = generateAmortizationSchedule(240_000, 7, 30);
    expect(schedule[0].interest).toBeGreaterThan(schedule[0].principal);
  });

  it('returns empty for zero principal', () => {
    expect(generateAmortizationSchedule(0, 7, 30)).toEqual([]);
  });
});

describe('getLoanBalanceAtMonth', () => {
  it('returns original principal at month 0', () => {
    expect(getLoanBalanceAtMonth(240_000, 7, 30, 0)).toBe(240_000);
  });

  it('matches amortization schedule', () => {
    const schedule = generateAmortizationSchedule(240_000, 7, 30);
    const balanceAt60 = getLoanBalanceAtMonth(240_000, 7, 30, 60);
    expect(balanceAt60).toBeCloseTo(schedule[59].balance, 0);
  });

  it('returns near zero at end of term', () => {
    const balance = getLoanBalanceAtMonth(240_000, 7, 30, 360);
    expect(balance).toBeCloseTo(0, 0);
  });
});
