import { NextResponse } from 'next/server';

// Mock market data API — mirrors shape of real Attom/RentCast APIs
const mockMarketData = {
  medianHomePrice: 350_000,
  medianRent: 2_100,
  priceToRentRatio: 13.9,
  averageCapRate: 5.2,
  vacancyRate: 4.8,
  appreciationRate: 3.5,
  propertyTaxRate: 1.15,
  insuranceRate: 0.35,
  market: 'Mock City, ST',
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(mockMarketData);
}
