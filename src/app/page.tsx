import { DetectLocationButton } from "@/components/DetectLocationButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Open-source location utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            PinMyCode
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Instantly detect your current coordinates in the browser. Postal
            address and pincode lookup will be added through reverse geocoding
            in a later step.
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <DetectLocationButton />
        </div>
      </section>
    </main>
  );
}
