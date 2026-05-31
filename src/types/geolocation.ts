import type { AddressData } from "./address";

export type GeolocationStatus = "idle" | "loading" | "success" | "error";

export type GeolocationErrorCode =
  | "permission-denied"
  | "location-unavailable"
  | "timeout"
  | "unsupported"
  | "unknown";

export type GeolocationState = {
  status: GeolocationStatus;
  address: AddressData | null;
  error: GeolocationErrorCode | null;
};
