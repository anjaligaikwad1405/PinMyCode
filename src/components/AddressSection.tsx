"use client";

import type { GeocodedAddress, OfficialPostalOffice } from "@/types/postalDirectory";
import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { SectionHeader } from "./SectionHeader";
import { SearchInput } from "./SearchInput";
import { LoadingState } from "./LoadingState";
import { AddressResult } from "./AddressResult";

type AddressSectionProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  result: { address: GeocodedAddress; postalOffice: OfficialPostalOffice } | null;
  loading: boolean;
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

export function AddressSection({ query, onQueryChange, onSubmit, result, loading, onCopy, onOpen, onShare }: AddressSectionProps) {
  return (
    <div id="address" className="scroll-mt-20">
      <SectionHeader
        eyebrow="Find PIN from Address"
        title="Geocode an address and locate the nearest postal office"
      />
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        <SearchInput
          label="Address"
          onChange={onQueryChange}
          placeholder="Near Civil Hospital Solapur"
          value={query}
          wrapperClassName="flex-1"
        />
        <button
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:bg-slate-300"
          type="submit"
          disabled={loading}
        >
          Find PIN
        </button>
      </form>
      {loading && <LoadingState message="Geocoding and ranking offices..." />}
      {result && (
        <AddressResult
          result={result}
          onCopy={onCopy}
          onOpen={onOpen}
          onShare={onShare}
        />
      )}
    </div>
  );
}
