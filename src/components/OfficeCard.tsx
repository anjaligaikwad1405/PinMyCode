"use client";

import type { PostalOfficeSearchResult } from "@/types/postalDirectory";
import { highlight } from "./Highlight";

function formatOfficeAddress(office: PostalOfficeSearchResult) {
  return [office.officename, office.district, office.statename, office.pincode].join("\n");
}

type OfficeCardProps = {
  office: PostalOfficeSearchResult;
  query: string;
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

export function OfficeCard({ office, query, onCopy, onOpen, onShare }: OfficeCardProps) {
  return (
    <article className="animate-fade-in rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <button className="text-left" onClick={() => onOpen(office)} type="button">
          <p className="text-sm font-semibold text-slate-900 sm:text-base">
            {highlight(office.officename, query)}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            {highlight(office.district, query)} &middot; {highlight(office.statename, query)}
          </p>
          <p className="mt-1.5 text-xs text-slate-400">
            {office.rankLabel ?? office.officetype}
          </p>
        </button>
        <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0">
          <p className="font-mono text-lg font-semibold text-slate-900">{office.pincode}</p>
          <p className="text-xs text-slate-400">{office.officetype}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
          onClick={() => void onCopy(office.pincode, "PIN copied")}
          type="button"
        >
          Copy PIN
        </button>
        <button
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
          onClick={() => void onCopy(formatOfficeAddress(office), "Address copied")}
          type="button"
        >
          Copy Address
        </button>
        <button
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
          onClick={() => void onShare(office)}
          type="button"
        >
          Share
        </button>
        <button
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
          onClick={() => onOpen(office)}
          type="button"
        >
          Details
        </button>
      </div>
    </article>
  );
}
