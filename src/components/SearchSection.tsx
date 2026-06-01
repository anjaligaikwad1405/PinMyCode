"use client";

import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { SectionHeader } from "./SectionHeader";
import { SearchInput } from "./SearchInput";
import { ResultGrid } from "./ResultGrid";
import { LoadingState } from "./LoadingState";

type SearchSectionProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: PostalOfficeSearchResult[];
  loading: boolean;
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

export function SearchSection({ query, onQueryChange, results, loading, onCopy, onOpen, onShare }: SearchSectionProps) {
  return (
    <div id="search" className="scroll-mt-20">
      <SectionHeader
        eyebrow="Smart Search Engine"
        title="Search offices, districts, regions &amp; states"
      />
      <SearchInput
        id="hero-search-input"
        label="Search places"
        onChange={onQueryChange}
        placeholder="Try Solapur, Mumbai, Pune..."
        value={query}
      />
      {loading && <LoadingState message="Searching..." />}
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
