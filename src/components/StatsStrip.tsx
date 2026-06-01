"use client";

import type { PostalStats } from "@/types/postalDirectory";
import { AnimatedCounter } from "./AnimatedCounter";

type StatsStripProps = {
  stats: PostalStats | null;
};

export function StatsStrip({ stats }: StatsStripProps) {
  const items: [string, number][] = [
    ["Total Offices", stats?.totalOffices ?? 0],
    ["PIN Codes", stats?.totalPincodes ?? 0],
    ["States", stats?.statesCovered ?? 0],
    ["Districts", stats?.districtsCovered ?? 0],
  ];

  return (
    <section className="border-y border-slate-100 bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="font-mono text-xl font-semibold text-slate-900 sm:text-2xl">
                <AnimatedCounter value={value} />
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
