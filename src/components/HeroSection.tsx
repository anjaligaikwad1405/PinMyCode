"use client";

import { useState } from "react";
import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

type SearchResult = PostalOfficeSearchResult & { rankLabel?: string };

type HeroSectionProps = {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onDetect: () => void;
  detectState: {
    status: string;
    address: string | null;
    officeName: string | null;
    pincode: string | null;
    distance: string | null;
    error: string | null;
  };
};

export function HeroSection({ onSearch, onDetect, detectState }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearched(true);
    try {
      const results = await onSearch(trimmed);
      setSearchResults(results);
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Find the right PIN code in seconds.
        </h1>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {/* ── Left Card: Detect Location ── */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-900">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 0v2M8 14v2M0 8h2M14 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              Use browser location to find your nearest postal office
            </h2>
          </div>

          <div className="mt-5 flex-1">
            {detectState.status === "idle" && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-slate-400">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 0v2M8 14v2M0 8h2M14 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-3 text-sm text-slate-400">Allow location access to detect your PIN code</p>
              </div>
            )}

            {detectState.status === "loading" && (
              <LoadingState message={detectState.address || "Detecting location..."} />
            )}

            {detectState.status === "error" && detectState.error && (
              <ErrorState message={detectState.error} />
            )}

            {detectState.status === "success" && (
              <div className="animate-fade-in rounded-lg border border-slate-200 bg-white">
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Your Address</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{detectState.address}</p>
                </div>
                <div className="border-t border-slate-100 px-4 py-3">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-xs text-slate-400">Nearest Office</dt>
                      <dd className="text-sm font-medium text-slate-900">{detectState.officeName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Distance</dt>
                      <dd className="text-sm font-medium text-slate-900">{detectState.distance}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-b-lg bg-slate-900 px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">PIN Code</p>
                  <p className="mt-0.5 font-mono text-3xl font-bold tracking-tight text-white">
                    {detectState.pincode}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            id="detect-location-btn"
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={detectState.status === "loading"}
            onClick={onDetect}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 0v2M8 14v2M0 8h2M14 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Detect My PIN
          </button>
        </div>

        {/* ── Right Card: Search ── */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-900">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              Search offices, districts, regions, and states
            </h2>
          </div>

          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Search by place, office, or PIN..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="submit"
                disabled={searchLoading || searchQuery.trim().length < 2}
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-4 flex-1">
            {searchLoading && <LoadingState message="Searching..." />}

            {searchError && <ErrorState message={searchError} />}

            {!searchLoading && !searchError && searched && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center">
                <p className="text-sm text-slate-400">No results found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}

            {!searchLoading && !searchError && searchResults.length > 0 && (
              <div className="animate-fade-in overflow-hidden rounded-lg border border-slate-200">
                <div className="max-h-[280px] overflow-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                    <thead className="sticky top-0 bg-white text-xs font-semibold uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Post Office</th>
                        <th className="px-4 py-3">PIN Code</th>
                        <th className="px-4 py-3">District</th>
                        <th className="px-4 py-3">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {searchResults.map((office) => (
                        <tr key={`${office.officename}-${office.pincode}`} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{office.officename}</td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-900">{office.pincode}</td>
                          <td className="px-4 py-3 text-slate-500">{office.district}</td>
                          <td className="px-4 py-3 text-slate-500">{office.statename}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!searchLoading && !searchError && !searched && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center">
                <p className="text-sm text-slate-400">Type a place or PIN above to search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick example chips */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-slate-400">Try:</span>
        {["Solapur", "Mumbai", "413001", "Barshi", "Kurla"].map((q) => (
          <button
            key={q}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            onClick={async () => {
              setSearchQuery(q);
              setSearchLoading(true);
              setSearchError(null);
              setSearched(true);
              try {
                const results = await onSearch(q);
                setSearchResults(results);
              } catch {
                setSearchError("Search failed.");
              } finally {
                setSearchLoading(false);
              }
            }}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}
