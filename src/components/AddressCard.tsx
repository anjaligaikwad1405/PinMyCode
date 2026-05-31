import type { AddressData } from "@/types/address";

type AddressCardProps = {
  address: AddressData;
};

export function AddressCard({ address }: AddressCardProps) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-medium text-emerald-700">Location detected</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          Your current coordinates
        </h2>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md bg-slate-50 p-4">
          <dt className="text-sm font-medium text-slate-500">Latitude</dt>
          <dd className="mt-1 font-mono text-lg text-slate-950">
            {address.latitude.toFixed(6)}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <dt className="text-sm font-medium text-slate-500">Longitude</dt>
          <dd className="mt-1 font-mono text-lg text-slate-950">
            {address.longitude.toFixed(6)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
