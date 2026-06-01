import { NextResponse } from "next/server";
import {
  findNearestPostalOffice,
  PostalDirectoryDatasetError,
} from "@/lib/postalDirectoryDataset";
import type { PostalDirectoryAddressInput } from "@/types/postalDirectory";

export const runtime = "nodejs";

type PostalDirectoryRequest = {
  address?: PostalDirectoryAddressInput;
};

export async function POST(request: Request) {
  let requestBody: PostalDirectoryRequest;

  try {
    requestBody = (await request.json()) as PostalDirectoryRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request JSON.", code: "invalid-response" },
      { status: 400 },
    );
  }

  if (!requestBody.address) {
    return NextResponse.json(
      {
        error: "Address context is required.",
        code: "missing-address-context",
      },
      { status: 400 },
    );
  }

  try {
    const postalOffice = await findNearestPostalOffice(requestBody.address);
    return NextResponse.json(postalOffice);
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
      {
        error: "Postal directory lookup failed.",
        code: "unknown",
      },
      { status: 500 },
    );
  }
}
