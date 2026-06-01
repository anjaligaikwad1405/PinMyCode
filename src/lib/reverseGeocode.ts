import type { Address, ReverseGeocodeResponse } from "@/types/address";
import type { GeolocationErrorCode } from "@/types/geolocation";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const NOMINATIM_DETAIL_ZOOM = "18";

export class ReverseGeocodeError extends Error {
  code: GeolocationErrorCode;

  constructor(code: GeolocationErrorCode, message: string) {
    super(message);
    this.name = "ReverseGeocodeError";
    this.code = code;
  }
}

function cleanValue(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function pickFirstAvailable(
  ...values: Array<string | undefined>
): string | undefined {
  return values.map(cleanValue).find(Boolean);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<Address> {
  const url = new URL(NOMINATIM_REVERSE_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", NOMINATIM_DETAIL_ZOOM);
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("extratags", "1");
  url.searchParams.set("namedetails", "1");

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new ReverseGeocodeError(
      "network-error",
      "Could not reach the reverse geocoding service.",
    );
  }

  if (!response.ok) {
    throw new ReverseGeocodeError(
      "reverse-geocode-failed",
      "The reverse geocoding request failed.",
    );
  }

  let data: ReverseGeocodeResponse;

  try {
    data = (await response.json()) as ReverseGeocodeResponse;
  } catch {
    throw new ReverseGeocodeError(
      "invalid-response",
      "The reverse geocoding service returned invalid JSON.",
    );
  }

  if (!data || data.error || !data.address) {
    throw new ReverseGeocodeError(
      "invalid-response",
      "The reverse geocoding service returned no address.",
    );
  }

  return {
    latitude,
    longitude,
    houseNumber: cleanValue(data.address.house_number),
    buildingName: pickFirstAvailable(
      data.address.building,
      data.address.house_name,
      data.address.name,
      data.address.amenity,
      data.address.apartments,
      data.address.commercial,
      data.address.retail,
      data.address.shop,
      data.address.office,
      data.address.tourism,
      data.address.leisure,
      data.address.historic,
      data.address.attraction,
      data.address.man_made,
      data.name,
      data.namedetails?.name,
    ),
    road: pickFirstAvailable(
      data.address.road,
      data.address.residential,
      data.address.pedestrian,
      data.address.footway,
      data.address.path,
    ),
    locality: pickFirstAvailable(
      data.address.suburb,
      data.address.neighbourhood,
      data.address.industrial,
      data.address.residential,
      data.address.city_district,
      data.address.quarter,
      data.address.hamlet,
      data.address.borough,
      data.address.locality,
    ),
    city: pickFirstAvailable(
      data.address.city,
      data.address.town,
      data.address.village,
      data.address.municipality,
      data.address.county,
    ),
    district: pickFirstAvailable(data.address.state_district, data.address.county),
    state: cleanValue(data.address.state),
    country: cleanValue(data.address.country),
    rawAddress: data.address,
  };
}
