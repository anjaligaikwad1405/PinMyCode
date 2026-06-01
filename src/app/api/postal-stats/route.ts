import { NextResponse } from "next/server";
import {
  getPostalStats,
  PostalDirectoryDatasetError,
} from "@/lib/postalDirectoryDataset";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getPostalStats());
  } catch (error) {
    if (error instanceof PostalDirectoryDatasetError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === "invalid-response" ? 502 : 500 },
      );
    }

    return NextResponse.json(
      { error: "Postal analytics failed.", code: "unknown" },
      { status: 500 },
    );
  }
}
