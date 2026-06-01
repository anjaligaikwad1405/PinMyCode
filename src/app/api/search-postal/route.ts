import { NextResponse } from "next/server";
import {
  PostalDirectoryDatasetError,
  searchPostalOffices,
} from "@/lib/postalDirectoryDataset";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";

  try {
    const results = await searchPostalOffices(query);
    return NextResponse.json({
      query,
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
      { error: "Postal search failed.", code: "unknown" },
      { status: 500 },
    );
  }
}
