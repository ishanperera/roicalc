import type { PropertyLookupResult } from './types';

const BASE_URL = 'https://api.rentcast.io/v1';

interface RentCastValueResponse {
  price: number;
  priceLow: number;
  priceHigh: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  formattedAddress: string;
  county: string;
  propertyTaxes?: number;
}

interface RentCastRentResponse {
  rent: number;
  rentRangeLow: number;
  rentRangeHigh: number;
}

export async function fetchRentCast(address: string): Promise<PropertyLookupResult> {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    throw new Error('RENTCAST_API_KEY is not configured');
  }

  const encodedAddress = encodeURIComponent(address);
  const headers = { 'X-Api-Key': apiKey, Accept: 'application/json' };

  const [valueRes, rentRes] = await Promise.all([
    fetch(`${BASE_URL}/avm/value?address=${encodedAddress}`, { headers }),
    fetch(`${BASE_URL}/avm/rent/long-term?address=${encodedAddress}`, { headers }),
  ]);

  if (!valueRes.ok) {
    throw new Error(`RentCast value API error: ${valueRes.status} ${valueRes.statusText}`);
  }
  if (!rentRes.ok) {
    throw new Error(`RentCast rent API error: ${rentRes.status} ${rentRes.statusText}`);
  }

  const valueData: RentCastValueResponse = await valueRes.json();
  const rentData: RentCastRentResponse = await rentRes.json();

  const estimatedValue = valueData.price;
  const propertyTaxRate = valueData.propertyTaxes
    ? (valueData.propertyTaxes / estimatedValue) * 100
    : 1.2;
  const insuranceAnnual = Math.round(estimatedValue * 0.0035);

  return {
    address: valueData.formattedAddress || address,
    estimatedValue,
    estimatedValueLow: valueData.priceLow,
    estimatedValueHigh: valueData.priceHigh,
    rentEstimate: rentData.rent,
    rentEstimateLow: rentData.rentRangeLow,
    rentEstimateHigh: rentData.rentRangeHigh,
    propertyTaxRate,
    insuranceAnnual,
    bedrooms: valueData.bedrooms ?? 0,
    bathrooms: valueData.bathrooms ?? 0,
    squareFootage: valueData.squareFootage ?? 0,
    yearBuilt: valueData.yearBuilt ?? 0,
    propertyType: valueData.propertyType === 'commercial' ? 'commercial' : 'residential',
    source: 'rentcast',
  };
}
