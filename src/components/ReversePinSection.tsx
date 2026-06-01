"use client";

import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { SectionHeader } from "./SectionHeader";
import { SearchInput } from "./SearchInput";
import { ResultGrid } from "./ResultGrid";
import { LoadingState } from "./LoadingState";

type ReversePinSectionProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: PostalOfficeSearchResult[];
  loading: boolean;
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

export function ReversePinSection({ query, onQueryChange, results, loading, onCopy, onOpen, onShare }: ReversePinSectionProps) {
  return (
    <div id="reverse" className="scroll-mt-20">
      <SectionHeader
        eyebrow="Reverse PIN Lookup"
        title="Enter a PIN code to see every matching office"
      />
      <SearchInput
        inputMode="numeric"
        label="Reverse PIN lookup"
        maxLength={6}
        onChange={onQueryChange}
        placeholder="413001"
        value={query}
      />
      {loading && <LoadingState message="Looking up PIN..." />}
      <ResultGrid
        query={query}
        results={results}
        onCopy={onCopy}
        onOpen={onOpen}
        onShare={onShare}
      />
    </div>
  );
}
