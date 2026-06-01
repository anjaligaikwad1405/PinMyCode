"use client";

import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { OfficeCard } from "./OfficeCard";

const exampleSearches = ["Solapur", "413001", "Akluj", "Mumbai", "Pune"];

type ResultGridProps = {
  results: PostalOfficeSearchResult[];
  query: string;
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

export function ResultGrid({ results, query, onCopy, onOpen, onShare }: ResultGridProps) {
  if (!query.trim()) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-400">
        Try {exampleSearches.join(", ")}.
      </p>
    );
  }
  if (!results.length) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-400">
        No matching postal offices found.
      </p>
    );
  }
  return (
    <div className="mt-4 flex flex-col gap-2">
      {results.map((office) => (
        <OfficeCard
          key={`${office.officename}-${office.pincode}-${office.district}`}
          office={office}
          query={query}
          onCopy={onCopy}
          onOpen={onOpen}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
