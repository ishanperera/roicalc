import type { PropertyLookupResult } from './types';

/**
 * Generates realistic mock property data based on zip code heuristics.
 * Coastal/high-cost zips (9xxxx, 1xxxx) get higher prices.
 */
export function fetchMockProperty(address: string): PropertyLookupResult {
  const zipMatch = address.match(/\b(\d{5})\b/);
  const zip = zipMatch ? zipMatch[1] : '30301';
  const zipPrefix = parseInt(zip.slice(0, 2), 10);

  // Higher prices for coastal zip prefixes (90-99 West Coast, 10-11 NYC area)
  const isHighCost = zipPrefix >= 90 || zipPrefix <= 11;
  const isMedCost = zipPrefix >= 20 && zipPrefix <= 22; // DC area

  let baseValue: number;
  let baseRent: number;
  if (isHighCost) {
    baseValue = 650_000;
    baseRent = 3_200;
  } else if (isMedCost) {
    baseValue = 450_000;
    baseRent = 2_400;
  } else {
    baseValue = 300_000;
    baseRent = 1_800;
  }

  // Add some deterministic variation from the zip code digits
  const zipNum = parseInt(zip, 10);
  const variation = ((zipNum % 100) - 50) / 100; // -0.5 to +0.49
  const estimatedValue = Math.round(baseValue * (1 + variation * 0.3));
  const rentEstimate = Math.round(baseRent * (1 + variation * 0.2));

  const propertyTaxRate = isHighCost ? 1.0 : isMedCost ? 1.1 : 1.2;
  const insuranceAnnual = Math.round(estimatedValue * 0.0035);

  return {
    address: address.trim() || '123 Main St, Atlanta, GA 30301',
    estimatedValue,
    estimatedValueLow: Math.round(estimatedValue * 0.9),
    estimatedValueHigh: Math.round(estimatedValue * 1.1),
    rentEstimate,
    rentEstimateLow: Math.round(rentEstimate * 0.85),
    rentEstimateHigh: Math.round(rentEstimate * 1.15),
    propertyTaxRate,
    insuranceAnnual,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1_650,
    yearBuilt: 1998,
    propertyType: 'residential',
    source: 'mock',
  };
}
