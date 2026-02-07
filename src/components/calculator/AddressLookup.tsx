'use client';

import { useCallback, type FormEvent } from 'react';
import { useAddressLookup } from '@/hooks/useAddressLookup';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function AddressLookup() {
  const {
    addressQuery,
    setAddressQuery,
    lookup,
    isLoading,
    error,
    result,
    clearLookup,
  } = useAddressLookup();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      lookup(addressQuery);
    },
    [lookup, addressQuery]
  );

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
          <svg
            className="absolute left-3.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            placeholder="Paste an address... (e.g., 123 Main St, Austin, TX 78701)"
            className="w-full rounded-xl bg-transparent py-3 pl-11 pr-24 text-base placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !addressQuery.trim()}
            className="absolute right-2 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {isLoading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
        {isLoading && (
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 border-l-[3px] border-l-red-500 bg-red-50/50 px-4 py-3 dark:border-red-800 dark:border-l-red-500 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <Card padding="sm" className="animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {result.address}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {result.bedrooms} bd &middot; {result.bathrooms} ba &middot; {result.squareFootage.toLocaleString()} sqft
                  {result.yearBuilt > 0 && <> &middot; Built {result.yearBuilt}</>}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearLookup}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Estimated Value
              </p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {formatCompact(result.estimatedValue)}
              </p>
              {result.estimatedValueLow > 0 && result.estimatedValueHigh > 0 && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {formatCompact(result.estimatedValueLow)} &ndash; {formatCompact(result.estimatedValueHigh)}
                </p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Rent Estimate
              </p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                ${result.rentEstimate.toLocaleString()}/mo
              </p>
              {result.rentEstimateLow > 0 && result.rentEstimateHigh > 0 && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  ${result.rentEstimateLow.toLocaleString()} &ndash; ${result.rentEstimateHigh.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center border-t border-gray-100 pt-2 dark:border-gray-800">
            <Badge variant="gradient" className="text-[10px]">{result.source}</Badge>
          </div>
        </Card>
      )}
    </div>
  );
}
