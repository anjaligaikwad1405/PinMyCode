import type { Address } from "./address";
import type { OfficialPostalOffice } from "./postalDirectory";

export type GeolocationStatus =
  | "idle"
  | "detecting"
  | "geocoding"
  | "postal-lookup"
  | "success"
  | "error";

export type GeolocationErrorCode =
  | "permission-denied"
  | "location-unavailable"
  | "timeout"
  | "unsupported"
  | "reverse-geocode-failed"
  | "invalid-response"
  | "missing-address-context"
  | "postal-office-not-found"
  | "postal-dataset-unavailable"
  | "network-error"
  | "unknown";

export type GeolocationState = {
  status: GeolocationStatus;
  address: Address | null;
  postalOffice: OfficialPostalOffice | null;
  error: GeolocationErrorCode | null;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
};
