import { describe, it, expect } from 'vitest';
import { napkinToProForma } from '@/lib/finance/napkin';

describe('napkinToProForma', () => {
  it('maps purchase price correctly', () => {
    const result = napkinToProForma({ purchasePrice: 400_000, monthlyRent: 2500, interestRate: 6.5 });
    expect(result.purchase.purchasePrice).toBe(400_000);
  });

  it('maps monthly rent correctly', () => {
    const result = napkinToProForma({ purchasePrice: 300_000, monthlyRent: 2000, interestRate: 7 });
    expect(result.income.monthlyRent).toBe(2000);
  });

  it('maps interest rate correctly', () => {
    const result = napkinToProForma({ purchasePrice: 300_000, monthlyRent: 2000, interestRate: 6.5 });
    expect(result.purchase.interestRate).toBe(6.5);
  });

  it('applies default down payment of 20%', () => {
    const result = napkinToProForma({ purchasePrice: 300_000, monthlyRent: 2000, interestRate: 7 });
    expect(result.purchase.downPaymentPercent).toBe(20);
  });

  it('scales insurance proportionally', () => {
    const result = napkinToProForma({ purchasePrice: 500_000, monthlyRent: 3000, interestRate: 7 });
    expect(result.expenses.insuranceAnnual).toBe(2000); // 0.4% of 500K
  });

  it('applies default 5% vacancy', () => {
    const result = napkinToProForma({ purchasePrice: 300_000, monthlyRent: 2000, interestRate: 7 });
    expect(result.income.vacancyRate).toBe(5);
  });

  it('sets property type to residential', () => {
    const result = napkinToProForma({ purchasePrice: 300_000, monthlyRent: 2000, interestRate: 7 });
    expect(result.propertyType).toBe('residential');
  });
});
