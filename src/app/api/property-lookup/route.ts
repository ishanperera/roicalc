import { NextRequest, NextResponse } from 'next/server';
import { fetchRentCast } from '@/lib/api/rentcast';
import { fetchZillow } from '@/lib/api/zillow';
import { fetchMockProperty } from '@/lib/api/mock-provider';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')?.trim();

  if (!address || address.length < 5) {
    return NextResponse.json(
      { error: 'A valid address is required (at least 5 characters).' },
      { status: 400 }
    );
  }

  const provider = process.env.PROPERTY_API_PROVIDER || 'mock';

  try {
    switch (provider) {
      case 'rentcast': {
        const result = await fetchRentCast(address);
        return NextResponse.json(result);
      }
      case 'zillow': {
        const result = await fetchZillow(address);
        return NextResponse.json(result);
      }
      case 'mock':
      default: {
        const result = fetchMockProperty(address);
        return NextResponse.json(result);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Property lookup failed: ${message}` },
      { status: 502 }
    );
  }
}
