"use client";

import { useState } from "react";
import { reverseGeocode } from "@/lib/reverseGeocode";
import type {
  GeolocationErrorCode,
  GeolocationState,
} from "@/types/geolocation";
import { AddressCard } from "./AddressCard";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

const initialState: GeolocationState = {
  status: "idle",
  address: null,
  error: null,
};

const errorMessages: Record<GeolocationErrorCode, string> = {
  "permission-denied": "Permission denied",
  "location-unavailable": "Location unavailable",
  timeout: "Location request timed out",
  unsupported: "Geolocation is not supported by this browser",
  unknown: "Something went wrong while detecting your location",
};

function getErrorCode(error: GeolocationPositionError): GeolocationErrorCode {
  if (error.code === error.PERMISSION_DENIED) {
    return "permission-denied";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "location-unavailable";
  }

  if (error.code === error.TIMEOUT) {
    return "timeout";
  }

  return "unknown";
}

export function DetectLocationButton() {
  const [state, setState] = useState<GeolocationState>(initialState);

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      setState({
        status: "error",
        address: null,
        error: "unsupported",
      });
      return;
    }

    setState({
      status: "loading",
      address: null,
      error: null,
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);

        setState({
          status: "success",
          address,
          error: null,
        });
      },
      (error) => {
        setState({
          status: "error",
          address: null,
          error: getErrorCode(error),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  return (
    <div className="w-full space-y-5">
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
        disabled={state.status === "loading"}
        onClick={detectLocation}
        type="button"
      >
        Detect My Address
      </button>

      {state.status === "loading" ? <LoadingState /> : null}
      {state.status === "error" && state.error ? (
        <ErrorState message={errorMessages[state.error]} />
      ) : null}
      {state.status === "success" && state.address ? (
        <AddressCard address={state.address} />
      ) : null}
    </div>
  );
}
