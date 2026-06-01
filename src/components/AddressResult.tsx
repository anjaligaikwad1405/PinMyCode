"use client";

import type { GeocodedAddress, OfficialPostalOffice, PostalOfficeSearchResult } from "@/types/postalDirectory";

type AddressResultProps = {
  result: { address: GeocodedAddress; postalOffice: OfficialPostalOffice };
  onCopy: (text: string, message: string) => Promise<void>;
  onOpen: (office: PostalOfficeSearchResult) => void;
  onShare: (office: PostalOfficeSearchResult) => Promise<void>;
};

function toOfficeResult(office: OfficialPostalOffice): PostalOfficeSearchResult {
  return {
    officename: office.officename,
    pincode: office.pincode,
    district: office.district,
    statename: office.statename,
    latitude: office.latitude,
    longitude: office.longitude,
    divisionname: office.divisionname,
    regionname: office.regionname,
    officetype: office.officetype,
    delivery: "",
    rankLabel: "Nearest office",
  };
}

export function AddressResult({ result, onCopy, onOpen, onShare }: AddressResultProps) {
  const office = toOfficeResult(result.postalOffice);
  return (
    <div className="mt-4 animate-fade-in rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Geocoded Address
          </p>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {result.address.display_name}
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium text-slate-400">Nearest Office</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{office.officename}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">Distance</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {result.postalOffice.distanceKm.toFixed(2)} km
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">District</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{office.district}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col justify-between rounded-lg bg-slate-900 p-4 text-white">
          <div>
            <p className="text-xs text-slate-400">PIN Code</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">{office.pincode}</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Confidence</span>
              <span>{result.postalOffice.confidence}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${result.postalOffice.confidence}%` }}
              />
            </div>
            {result.postalOffice.confidenceWarning && (
              <p className="mt-1.5 text-xs text-slate-300">
                {result.postalOffice.confidenceWarning}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[
          ["Copy PIN", () => onCopy(office.pincode, "PIN copied")],
          ["Details", () => onOpen(office)],
          ["Share", () => onShare(office)],
        ].map(([label, handler]) => (
          <button
            key={label as string}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
            onClick={() => void (handler as () => void | Promise<void>)()}
            type="button"
          >
            {label as string}
          </button>
        ))}
      </div>
    </div>
  );
}
