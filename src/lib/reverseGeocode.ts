import type { AddressData } from "@/types/address";

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<AddressData> {
  return {
    latitude,
    longitude,
  };
}
