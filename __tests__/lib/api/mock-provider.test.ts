import { describe, it, expect } from 'vitest';
import { fetchMockProperty } from '@/lib/api/mock-provider';
import type { PropertyLookupResult } from '@/lib/api/types';

describe('fetchMockProperty', () => {
  it('returns a valid PropertyLookupResult shape', () => {
    const result = fetchMockProperty('123 Main St, Atlanta, GA 30301');

    expect(result).toMatchObject({
      address: expect.any(String),
      estimatedValue: expect.any(Number),
      estimatedValueLow: expect.any(Number),
      estimatedValueHigh: expect.any(Number),
      rentEstimate: expect.any(Number),
      rentEstimateLow: expect.any(Number),
      rentEstimateHigh: expect.any(Number),
      propertyTaxRate: expect.any(Number),
      insuranceAnnual: expect.any(Number),
      bedrooms: expect.any(Number),
      bathrooms: expect.any(Number),
      squareFootage: expect.any(Number),
      yearBuilt: expect.any(Number),
      propertyType: 'residential',
      source: 'mock',
    } satisfies PropertyLookupResult);
  });

  it('returns positive values for price and rent', () => {
    const result = fetchMockProperty('456 Oak Ave, Austin, TX 78701');
    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.rentEstimate).toBeGreaterThan(0);
    expect(result.insuranceAnnual).toBeGreaterThan(0);
  });

  it('produces higher values for coastal (high-cost) zip codes', () => {
    const coastal = fetchMockProperty('100 Beach Rd, Los Angeles, CA 90210');
    const inland = fetchMockProperty('200 Plains Dr, Topeka, KS 66601');
    expect(coastal.estimatedValue).toBeGreaterThan(inland.estimatedValue);
  });

  it('uses fallback zip when no zip is present in address', () => {
    const result = fetchMockProperty('Some Address Without Zip');
    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.source).toBe('mock');
  });

  it('returns low/high ranges around the estimate', () => {
    const result = fetchMockProperty('123 Main St, Atlanta, GA 30301');
    expect(result.estimatedValueLow).toBeLessThan(result.estimatedValue);
    expect(result.estimatedValueHigh).toBeGreaterThan(result.estimatedValue);
    expect(result.rentEstimateLow).toBeLessThan(result.rentEstimate);
    expect(result.rentEstimateHigh).toBeGreaterThan(result.rentEstimate);
  });

  it('derives insurance as ~0.35% of estimated value', () => {
    const result = fetchMockProperty('123 Main St, Atlanta, GA 30301');
    const expectedInsurance = Math.round(result.estimatedValue * 0.0035);
    expect(result.insuranceAnnual).toBe(expectedInsurance);
  });
});
