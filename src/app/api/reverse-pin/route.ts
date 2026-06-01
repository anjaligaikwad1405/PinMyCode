import { NextResponse } from "next/server";
import {
  PostalDirectoryDatasetError,
  reverseLookupByPincode,
} from "@/lib/postalDirectoryDataset";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pincode = url.searchParams.get("pin") ?? "";

  try {
    const results = await reverseLookupByPincode(pincode);
    return NextResponse.json({
      pincode,
      count: results.length,
      results,
    });
  } catch (error) {
    if (error instanceof PostalDirectoryDatasetError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === "invalid-response" ? 502 : 500 },
      );
    }

    return NextResponse.json(
      { error: "Reverse PIN lookup failed.", code: "unknown" },
      { status: 500 },
    );
  }
}
