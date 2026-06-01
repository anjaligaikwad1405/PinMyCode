"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  GeocodedAddress,
  OfficialPostalOffice,
  PostalOfficeSearchResult,
  PostalStats,
} from "@/types/postalDirectory";
import { Navbar } from "./Navbar";
import { Toast } from "./Toast";
import { HeroSection } from "./HeroSection";
import { StatsStrip } from "./StatsStrip";
import { SearchSection } from "./SearchSection";
import { ReversePinSection } from "./ReversePinSection";
import { AddressSection } from "./AddressSection";
import { RecentSearches } from "./RecentSearches";
import { OfficeDrawer } from "./OfficeDrawer";
import { ErrorState } from "./ErrorState";

const PostalMap = dynamic(
  () => import("./PostalMap").then((module) => module.PostalMap),
  { ssr: false },
);

type LookupResponse = {
  count: number;
  results: PostalOfficeSearchResult[];
};

type AddressToPinResponse = {
  address: GeocodedAddress;
  postalOffice: OfficialPostalOffice;
};



type DetectState = {
  status: "idle" | "loading" | "success" | "error";
  address: string | null;
  officeName: string | null;
  pincode: string | null;
  distance: string | null;
  error: string | null;
};



export function PostalIntelligencePlatform() {
  const [placeQuery, setPlaceQuery] = useState("");
  const [pinQuery, setPinQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<PostalOfficeSearchResult[]>([]);
  const [pinResults, setPinResults] = useState<PostalOfficeSearchResult[]>([]);
  const [addressResult, setAddressResult] = useState<AddressToPinResponse | null>(null);
  const [stats, setStats] = useState<PostalStats | null>(null);
  const [activeOffice, setActiveOffice] = useState<PostalOfficeSearchResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [loading, setLoading] = useState({ place: false, pin: false, address: false });
  const [error, setError] = useState<string | null>(null);
  const [detectState, setDetectState] = useState<DetectState>({
    status: "idle",
    address: null,
    officeName: null,
    pincode: null,
    distance: null,
    error: null,
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("pinmycode:recent-searches");
      if (stored) {
        setHistory(JSON.parse(stored) as string[]);
      }
    } catch {
      // localStorage unavailable or corrupt data
    }
  }, []);

  const addToast = useCallback((message: string) => {
    const next = { id: Date.now(), message };
    setToast(next);
    window.setTimeout(() => setToast((c) => (c?.id === next.id ? null : c)), 2200);
  }, []);

  const addHistory = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setHistory((current) => {
      const next = [trimmed, ...current.filter((i) => i !== trimmed)].slice(0, 8);
      localStorage.setItem("pinmycode:recent-searches", JSON.stringify(next));
      return next;
    });
  }, []);

  const copyText = useCallback(
    async (text: string, message: string) => {
      await navigator.clipboard.writeText(text);
      addToast(message);
    },
    [addToast],
  );

  const shareOffice = useCallback(
    async (office: PostalOfficeSearchResult) => {
      const text = `${office.officename}\n${office.district}, ${office.statename}\nPIN ${office.pincode}`;
      if ("share" in navigator) {
        await navigator.share({ title: "PinMyCode result", text });
        addToast("Share sheet opened");
        return;
      }
      await copyText(text, "Share text copied");
    },
    [addToast, copyText],
  );

  const searchPlaces = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) { setPlaceResults([]); return []; }
      setError(null);
      try {
        const res = await fetch(`/api/search-postal?q=${encodeURIComponent(trimmed)}`);
        const data = (await res.json()) as LookupResponse;
        if (!res.ok) throw new Error();
        setPlaceResults(data.results);
        addHistory(trimmed);
        return data.results;
      } catch {
        setError("Place search could not be completed.");
        return [];
      }
    },
    [addHistory],
  );

  const handleHeroSearch = useCallback(
    async (query: string): Promise<PostalOfficeSearchResult[]> => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) return [];
      try {
        const res = await fetch(`/api/search-postal?q=${encodeURIComponent(trimmed)}`);
        const data = (await res.json()) as LookupResponse;
        if (!res.ok) throw new Error();
        addHistory(trimmed);
        return data.results;
      } catch {
        throw new Error("Search failed");
      }
    },
    [addHistory],
  );

  const detectLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setDetectState({
        status: "error",
        address: null,
        officeName: null,
        pincode: null,
        distance: null,
        error: "Geolocation is not supported by this browser",
      });
      return;
    }

    setDetectState({
      status: "loading",
      address: null,
      officeName: null,
      pincode: null,
      distance: null,
      error: null,
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { reverseGeocode } = await import("@/lib/reverseGeocode");
          const address = await reverseGeocode(latitude, longitude);

          const addressStr = [address.locality, address.district, address.state, address.country]
            .filter(Boolean)
            .join(", ");

          setDetectState((prev) => ({
            ...prev,
            address: addressStr,
          }));

          const res = await fetch("/api/postal-directory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: {
                latitude,
                longitude,
                locality: address.locality,
                district: address.district,
                state: address.state,
              },
            }),
          });

          const data = (await res.json()) as OfficialPostalOffice;
          if (!res.ok) throw new Error();

          const successAddressStr = [address.locality, address.district, address.state, address.country]
            .filter(Boolean)
            .join(", ");

          setDetectState({
            status: "success",
            address: successAddressStr || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            officeName: data.officename,
            pincode: data.pincode,
            distance: `${data.distanceKm.toFixed(2)} km`,
            error: null,
          });

          addHistory(`${data.officename} (${data.pincode})`);
        } catch {
          setDetectState({
            status: "error",
            address: null,
            officeName: null,
            pincode: null,
            distance: null,
            error: "Could not determine your PIN code. Please try again.",
          });
        }
      },
      () => {
        setDetectState({
          status: "error",
          address: null,
          officeName: null,
          pincode: null,
          distance: null,
          error: "Location access denied or unavailable. Please check your browser settings.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [addHistory]);

  const searchPin = useCallback(
    async (query: string) => {
      const pincode = query.replace(/\D/g, "").slice(0, 6);
      setPinQuery(pincode);
      if (pincode.length !== 6) { setPinResults([]); return; }
      setLoading((c) => ({ ...c, pin: true }));
      setError(null);
      try {
        const res = await fetch(`/api/reverse-pin?pin=${pincode}`);
        const data = (await res.json()) as LookupResponse;
        if (!res.ok) throw new Error();
        setPinResults(data.results);
        addHistory(pincode);
      } catch {
        setError("Reverse PIN lookup could not be completed.");
      } finally {
        setLoading((c) => ({ ...c, pin: false }));
      }
    },
    [addHistory],
  );

  const findPinFromAddress = useCallback(async () => {
    const address = addressQuery.trim();
    if (!address) return;
    setLoading((c) => ({ ...c, address: true }));
    setError(null);
    try {
      const res = await fetch("/api/address-to-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = (await res.json()) as AddressToPinResponse;
      if (!res.ok) throw new Error();
      setAddressResult(data);
      setActiveOffice({
        officename: data.postalOffice.officename,
        pincode: data.postalOffice.pincode,
        district: data.postalOffice.district,
        statename: data.postalOffice.statename,
        latitude: data.postalOffice.latitude,
        longitude: data.postalOffice.longitude,
        divisionname: data.postalOffice.divisionname,
        regionname: data.postalOffice.regionname,
        officetype: data.postalOffice.officetype,
        delivery: "",
        rankLabel: "Nearest office",
      });
      addHistory(address);
    } catch {
      setAddressResult(null);
      setError("Address lookup could not be completed.");
    } finally {
      setLoading((c) => ({ ...c, address: false }));
    }
  }, [addHistory, addressQuery]);

  useEffect(() => {
    void fetch("/api/postal-stats")
      .then((r) => r.json())
      .then((d: PostalStats) => setStats(d))
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void searchPlaces(placeQuery), 260);
    return () => window.clearTimeout(id);
  }, [placeQuery, searchPlaces]);

  useEffect(() => {
    const id = window.setTimeout(() => void searchPin(pinQuery), 160);
    return () => window.clearTimeout(id);
  }, [pinQuery, searchPin]);

  const mapOffice = useMemo(() => {
    const office = addressResult?.postalOffice;
    if (!office?.latitude || !office.longitude) return null;
    return {
      latitude: office.latitude,
      longitude: office.longitude,
      label: `${office.officename} - ${office.pincode}`,
      tone: "office" as const,
    };
  }, [addressResult]);

  const mapUserPoint = useMemo(() => {
    if (!addressResult) return null;
    return {
      latitude: Number(addressResult.address.lat),
      longitude: Number(addressResult.address.lon),
      label: addressResult.address.display_name,
      tone: "user" as const,
    };
  }, [addressResult]);

  const rerunHistory = (value: string) => {
    if (/^\d{6}$/.test(value)) {
      void searchPin(value);
    } else {
      setPlaceQuery(value);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {toast && <Toast message={toast.message} />}

      <Navbar />

      <main id="top">
        <HeroSection
          onSearch={handleHeroSearch}
          onDetect={detectLocation}
          detectState={detectState}
        />


        <section className="border-y border-slate-100">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="space-y-10">
                <SearchSection
                  query={placeQuery}
                  onQueryChange={setPlaceQuery}
                  results={placeResults}
                  loading={loading.place}
                  onCopy={copyText}
                  onOpen={setActiveOffice}
                  onShare={shareOffice}
                />

                <ReversePinSection
                  query={pinQuery}
                  onQueryChange={(v) => void searchPin(v)}
                  results={pinResults}
                  loading={loading.pin}
                  onCopy={copyText}
                  onOpen={setActiveOffice}
                  onShare={shareOffice}
                />

                <AddressSection
                  query={addressQuery}
                  onQueryChange={setAddressQuery}
                  onSubmit={findPinFromAddress}
                  result={addressResult}
                  loading={loading.address}
                  onCopy={copyText}
                  onOpen={setActiveOffice}
                  onShare={shareOffice}
                />

                {error && <ErrorState message={error} />}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                <RecentSearches
                  history={history}
                  onClear={() => {
                    setHistory([]);
                    localStorage.removeItem("pinmycode:recent-searches");
                  }}
                  onDelete={(item) => {
                    const next = history.filter((e) => e !== item);
                    setHistory(next);
                    localStorage.setItem("pinmycode:recent-searches", JSON.stringify(next));
                  }}
                  onRun={rerunHistory}
                />
                <PostalMap officePoint={mapOffice} userPoint={mapUserPoint} />
              </aside>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-slate-400">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-medium text-slate-900">PinMyCode</span>
          </div>
          <div className="flex gap-5">
            <a className="text-slate-400 transition hover:text-slate-700" href="#top">Privacy</a>
            <a className="text-slate-400 transition hover:text-slate-700" href="#top">Terms</a>
          </div>
        </div>
      </footer>

      <OfficeDrawer office={activeOffice} onClose={() => setActiveOffice(null)} />
    </div>
  );
}
