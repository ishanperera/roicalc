import type { PropertyLookupResult } from './types';

const RAPIDAPI_HOST = 'zillow56.p.rapidapi.com';

interface ZillowSearchResult {
  zpid: number;
  address: string;
}

interface ZillowPropertyResult {
  zpid: number;
  address: { streetAddress: string; city: string; state: string; zipcode: string };
  zestimate: number;
  rentZestimate: number;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  yearBuilt: number;
  homeType: string;
  propertyTaxRate?: number;
  annualHomeownersInsurance?: number;
}

export async function fetchZillow(address: string): Promise<PropertyLookupResult> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  const headers = {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': RAPIDAPI_HOST,
  };

  // Step 1: Search for zpid
  const searchRes = await fetch(
    `https://${RAPIDAPI_HOST}/search?location=${encodeURIComponent(address)}`,
    { headers }
  );
  if (!searchRes.ok) {
    throw new Error(`Zillow search API error: ${searchRes.status} ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  const results = searchData?.results ?? searchData?.searchResults ?? [];
  const firstResult: ZillowSearchResult | undefined = Array.isArray(results) ? results[0] : undefined;
  if (!firstResult?.zpid) {
    throw new Error('No property found for the given address');
  }

  // Step 2: Get property details
  const detailRes = await fetch(
    `https://${RAPIDAPI_HOST}/property?zpid=${firstResult.zpid}`,
    { headers }
  );
  if (!detailRes.ok) {
    throw new Error(`Zillow property API error: ${detailRes.status} ${detailRes.statusText}`);
  }

  const property: ZillowPropertyResult = await detailRes.json();

  const estimatedValue = property.zestimate || 0;
  const propertyTaxRate = property.propertyTaxRate ?? 1.2;
  const insuranceAnnual = property.annualHomeownersInsurance ?? Math.round(estimatedValue * 0.0035);

  const fullAddress = property.address
    ? `${property.address.streetAddress}, ${property.address.city}, ${property.address.state} ${property.address.zipcode}`
    : address;

  return {
    address: fullAddress,
    estimatedValue,
    estimatedValueLow: Math.round(estimatedValue * 0.92),
    estimatedValueHigh: Math.round(estimatedValue * 1.08),
    rentEstimate: property.rentZestimate || 0,
    rentEstimateLow: Math.round((property.rentZestimate || 0) * 0.9),
    rentEstimateHigh: Math.round((property.rentZestimate || 0) * 1.1),
    propertyTaxRate,
    insuranceAnnual,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    squareFootage: property.livingArea ?? 0,
    yearBuilt: property.yearBuilt ?? 0,
    propertyType: property.homeType === 'commercial' ? 'commercial' : 'residential',
    source: 'zillow',
  };
}
