"use client";

import type { PostalOfficeSearchResult } from "@/types/postalDirectory";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-widest text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

type OfficeDrawerProps = {
  office: PostalOfficeSearchResult | null;
  onClose: () => void;
};

export function OfficeDrawer({ office, onClose }: OfficeDrawerProps) {
  if (!office) return null;
  const hasCoordinates = office.latitude !== null && office.longitude !== null;
  const mapHref = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${office.latitude}&mlon=${office.longitude}#map=15/${office.latitude}/${office.longitude}`
    : "https://www.openstreetmap.org";

  return (
    <div
      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Postal Office
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">
              {office.officename}
            </h2>
          </div>
          <button
            className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4">
          <Metric label="PIN Code" value={office.pincode} />
          <Metric label="District" value={office.district} />
          <Metric label="State" value={office.statename} />
          <Metric label="Region" value={office.regionname || "N/A"} />
          <Metric label="Division" value={office.divisionname || "N/A"} />
          <Metric label="Office Type" value={office.officetype || "N/A"} />
          <Metric label="Latitude" value={office.latitude?.toString() ?? "N/A"} />
          <Metric label="Longitude" value={office.longitude?.toString() ?? "N/A"} />
        </dl>
        <a
          className="mt-6 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          href={mapHref}
          rel="noreferrer"
          target="_blank"
        >
          View on Map
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-400">
            <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.667M10.5 3.5V9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
