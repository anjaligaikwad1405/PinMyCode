import { NextResponse } from "next/server";
import {
  findNearestPostalOffice,
  PostalDirectoryDatasetError,
} from "@/lib/postalDirectoryDataset";
import type { GeocodedAddress } from "@/types/postalDirectory";

export const runtime = "nodejs";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

type NominatimSearchResponse = Array<
  GeocodedAddress & {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      suburb?: string;
      state_district?: string;
      county?: string;
      state?: string;
    };
  }
>;

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: { address?: string };

  try {
    body = (await request.json()) as { address?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid request JSON.", code: "invalid-response" },
      { status: 400 },
    );
  }

  const address = clean(body.address);

  if (!address) {
    return NextResponse.json(
      { error: "Address is required.", code: "missing-address-context" },
      { status: 400 },
    );
  }

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", address);
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  let geocodeResponse: Response;

  try {
    geocodeResponse = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "PinMyCode/1.0 postal intelligence demo",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Nominatim.", code: "network-error" },
      { status: 502 },
    );
  }

  if (!geocodeResponse.ok) {
    return NextResponse.json(
      { error: "Geocoding failed.", code: "reverse-geocode-failed" },
      { status: 502 },
    );
  }

  const geocoded = (await geocodeResponse.json()) as NominatimSearchResponse;
  const bestMatch = geocoded[0];
  const latitude = Number(bestMatch?.lat);
  const longitude = Number(bestMatch?.lon);

  if (!bestMatch || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json(
      { error: "No address match found.", code: "postal-office-not-found" },
      { status: 404 },
    );
  }

  try {
    const postalOffice = await findNearestPostalOffice({
      latitude,
      longitude,
      locality: clean(
        bestMatch.address?.suburb ??
          bestMatch.address?.city ??
          bestMatch.address?.town ??
          bestMatch.address?.village,
      ),
      district: clean(
        bestMatch.address?.state_district ?? bestMatch.address?.county,
      ),
      state: clean(bestMatch.address?.state),
    });

    return NextResponse.json({
      address: {
        lat: bestMatch.lat,
        lon: bestMatch.lon,
        display_name: bestMatch.display_name,
      },
      postalOffice,
    });
  } catch (error) {
    if (error instanceof PostalDirectoryDatasetError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        {
          status:
            error.code === "postal-dataset-unavailable" ||
            error.code === "invalid-response"
              ? 502
              : 404,
        },
      );
    }

    return NextResponse.json(
      { error: "Address to PIN lookup failed.", code: "unknown" },
      { status: 500 },
    );
  }
}
