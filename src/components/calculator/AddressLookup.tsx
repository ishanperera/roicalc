'use client';

import { useCallback, type FormEvent } from 'react';
import { useAddressLookup } from '@/hooks/useAddressLookup';
import { Badge } from '@/components/ui/Badge';

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
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !addressQuery.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
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
        {result && (
          <button
            type="button"
            onClick={clearLookup}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {result && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {result.address}
          </span>
          <Badge>{result.bedrooms} bd</Badge>
          <Badge>{result.bathrooms} ba</Badge>
          <Badge>{result.squareFootage.toLocaleString()} sqft</Badge>
          {result.yearBuilt > 0 && <Badge>Built {result.yearBuilt}</Badge>}
          <Badge variant="blue">{result.source}</Badge>
        </div>
      )}
    </div>
  );
}
