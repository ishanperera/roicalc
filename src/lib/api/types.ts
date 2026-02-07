export interface PropertyLookupResult {
  address: string;
  estimatedValue: number;
  estimatedValueLow: number;
  estimatedValueHigh: number;
  rentEstimate: number;
  rentEstimateLow: number;
  rentEstimateHigh: number;
  propertyTaxRate: number;
  insuranceAnnual: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  propertyType: 'residential' | 'commercial';
  source: 'rentcast' | 'zillow' | 'mock';
}
