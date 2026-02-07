import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/property-lookup/route';
import { NextRequest } from 'next/server';

function makeRequest(address?: string) {
  const url = address
    ? `http://localhost:3000/api/property-lookup?address=${encodeURIComponent(address)}`
    : 'http://localhost:3000/api/property-lookup';
  return new NextRequest(url);
}

describe('GET /api/property-lookup', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 400 when address is missing', async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when address is too short', async () => {
    const res = await GET(makeRequest('abc'));
    expect(res.status).toBe(400);
  });

  it('returns mock data for a valid address (default provider)', async () => {
    vi.stubEnv('PROPERTY_API_PROVIDER', 'mock');
    const res = await GET(makeRequest('123 Main St, Austin, TX 78701'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.source).toBe('mock');
    expect(body.estimatedValue).toBeGreaterThan(0);
    expect(body.rentEstimate).toBeGreaterThan(0);
    expect(body.address).toBeTruthy();
    expect(body.propertyTaxRate).toBeGreaterThan(0);
    expect(body.insuranceAnnual).toBeGreaterThan(0);
  });

  it('returns mock data when provider env is unset', async () => {
    vi.stubEnv('PROPERTY_API_PROVIDER', '');
    const res = await GET(makeRequest('456 Oak Ave, Denver, CO 80201'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.source).toBe('mock');
  });

  it('returns 502 when rentcast is selected but no API key', async () => {
    vi.stubEnv('PROPERTY_API_PROVIDER', 'rentcast');
    vi.stubEnv('RENTCAST_API_KEY', '');
    const res = await GET(makeRequest('123 Main St, Austin, TX 78701'));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toContain('Property lookup failed');
  });

  it('returns 502 when zillow is selected but no API key', async () => {
    vi.stubEnv('PROPERTY_API_PROVIDER', 'zillow');
    vi.stubEnv('RAPIDAPI_KEY', '');
    const res = await GET(makeRequest('123 Main St, Austin, TX 78701'));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toContain('Property lookup failed');
  });
});
