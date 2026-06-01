import { readFile } from "node:fs/promises";
import path from "node:path";
import { getConfidenceScore } from "@/lib/confidenceScore";
import type {
  OfficialPostalOffice,
  PostalDirectoryAddressInput,
  PostalOffice,
  PostalOfficeSearchResult,
  PostalStats,
} from "@/types/postalDirectory";

const DATASET_PATH = path.join(
  process.cwd(),
  "data",
  "india-postal-directory.csv",
);

type PostalOfficeWithDistance = PostalOffice & {
  distanceKm: number;
  rankingScore: number;
  rankingBonus: number;
  localityMatches: boolean;
  districtMatches: boolean;
  stateMatches: boolean;
};

export class PostalDirectoryDatasetError extends Error {
  code:
    | "missing-address-context"
    | "postal-office-not-found"
    | "postal-dataset-unavailable"
    | "invalid-response";

  constructor(code: PostalDirectoryDatasetError["code"], message: string) {
    super(message);
    this.name = "PostalDirectoryDatasetError";
    this.code = code;
  }
}

function cleanValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

function normalizeComparable(value: string | undefined): string {
  return cleanValue(value).toUpperCase();
}

function parseCoordinate(value: string | undefined): number | null {
  const cleanedValue = cleanValue(value);

  if (!cleanedValue || cleanedValue.toUpperCase() === "NA") {
    return null;
  }

  const coordinate = Number(cleanedValue);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let isInsideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      isInsideQuotes = !isInsideQuotes;
      continue;
    }

    if (character === "," && !isInsideQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);
  return values;
}

function parseCsv(csv: string): Array<Record<string, string>> {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const [headerLine, ...recordLines] = lines;

  if (!headerLine) {
    throw new PostalDirectoryDatasetError(
      "invalid-response",
      "Postal directory CSV is empty.",
    );
  }

  const headers = parseCsvLine(headerLine).map((header) =>
    normalizeComparable(header).toLowerCase(),
  );

  return recordLines.map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = cleanValue(values[index]);
      return record;
    }, {});
  });
}

function toPostalOffice(record: Record<string, string>): PostalOffice | null {
  const officename = cleanValue(record.officename);
  const pincode = cleanValue(record.pincode);
  const district = cleanValue(record.district);
  const statename = cleanValue(record.statename);

  if (!officename || !pincode || !district || !statename) {
    return null;
  }

  return {
    officename,
    pincode,
    district,
    statename,
    latitude: parseCoordinate(record.latitude),
    longitude: parseCoordinate(record.longitude),
    divisionname: cleanValue(record.divisionname),
    regionname: cleanValue(record.regionname),
    officetype: cleanValue(record.officetype),
    delivery: cleanValue(record.delivery),
  };
}

async function loadPostalOfficeDataset(): Promise<PostalOffice[]> {
  try {
    const csv = await readFile(DATASET_PATH, "utf8");
    const offices = parseCsv(csv)
      .map(toPostalOffice)
      .filter((office): office is PostalOffice => Boolean(office));

    return offices;
  } catch {
    throw new PostalDirectoryDatasetError(
      "postal-dataset-unavailable",
      "Could not load the local postal directory dataset.",
    );
  }
}

const postalOfficeDatasetPromise = loadPostalOfficeDataset();
const coordinateBearingPostalOfficeDatasetPromise =
  postalOfficeDatasetPromise.then((offices) => offices.filter(withCoordinates));

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(endLatitude - startLatitude);
  const longitudeDelta = toRadians(endLongitude - startLongitude);
  const startLatitudeRadians = toRadians(startLatitude);
  const endLatitudeRadians = toRadians(endLatitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function officeNameMatchesLocality(
  office: PostalOffice,
  locality: string,
): boolean {
  const officeName = normalizeComparable(office.officename);
  return Boolean(locality) && officeName.includes(locality);
}

function withCoordinates(office: PostalOffice): office is PostalOffice & {
  latitude: number;
  longitude: number;
} {
  return office.latitude !== null && office.longitude !== null;
}

function getRankingBonus(
  office: PostalOffice,
  input: PostalDirectoryAddressInput,
) {
  const locality = normalizeComparable(input.locality);
  const district = normalizeComparable(input.district);
  const state = normalizeComparable(input.state);
  const localityMatches = officeNameMatchesLocality(office, locality);
  const districtMatches =
    Boolean(district) && normalizeComparable(office.district) === district;
  const stateMatches =
    Boolean(state) && normalizeComparable(office.statename) === state;

  return {
    localityMatches,
    districtMatches,
    stateMatches,
    rankingBonus:
      (localityMatches ? 20 : 0) +
      (districtMatches ? 10 : 0) +
      (stateMatches ? 10 : 0),
  };
}

function rankByDistance(
  offices: Array<PostalOffice & { latitude: number; longitude: number }>,
  latitude: number,
  longitude: number,
  input: PostalDirectoryAddressInput,
): PostalOfficeWithDistance[] {
  return offices
    .map((office) => {
      const bonus = getRankingBonus(office, input);
      const distanceKm = calculateDistanceKm(
        latitude,
        longitude,
        office.latitude,
        office.longitude,
      );

      return {
        ...office,
        ...bonus,
        distanceKm,
        rankingScore: distanceKm - bonus.rankingBonus * 0.1,
      };
    })
    .sort((first, second) => {
      const scoreDifference = first.rankingScore - second.rankingScore;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return first.distanceKm - second.distanceKm;
    });
}

function toSearchResult(office: PostalOffice): PostalOfficeSearchResult {
  return {
    officename: office.officename,
    pincode: office.pincode,
    district: office.district,
    statename: office.statename,
    latitude: office.latitude,
    longitude: office.longitude,
    divisionname: office.divisionname,
    regionname: office.regionname,
    officetype: office.officetype,
    delivery: office.delivery,
  };
}

function getSearchRank(
  office: PostalOffice,
  query: string,
): { rank: number; label: string } {
  const officeName = normalizeComparable(office.officename);
  const district = normalizeComparable(office.district);
  const state = normalizeComparable(office.statename);
  const region = normalizeComparable(office.regionname);
  const pincode = normalizeComparable(office.pincode);
  const officeNameWords = officeName.split(/\s+/).filter(Boolean);

  // Priority -1: Exact PIN match
  if (pincode === query) {
    return { rank: -1, label: "Exact PIN" };
  }

  // Priority 0: Exact office name match
  if (officeName === query) {
    return { rank: 0, label: "Exact office" };
  }

  // Priority 1: Office name starts with query
  if (officeName.startsWith(query)) {
    return { rank: 1, label: "Starts with" };
  }

  // Priority 2: Any whole word in office name matches query
  if (officeNameWords.some((word) => word === query)) {
    return { rank: 2, label: "Office word match" };
  }

  // Priority 3: Any whole word in office name starts with query
  if (officeNameWords.some((word) => word.startsWith(query))) {
    return { rank: 3, label: "Word prefix match" };
  }

  // Priority 4: Office name contains query as substring
  if (officeName.includes(query)) {
    return { rank: 4, label: "Office contains" };
  }

  // Priority 5: District match
  const districtWords = district.split(/\s+/).filter(Boolean);
  if (
    district === query ||
    district.startsWith(query) ||
    districtWords.some((w) => w === query)
  ) {
    return { rank: 5, label: "District" };
  }

  // Priority 6: Region match
  const regionWords = region.split(/\s+/).filter(Boolean);
  if (
    region === query ||
    region.startsWith(query) ||
    regionWords.some((w) => w === query)
  ) {
    return { rank: 6, label: "Region" };
  }

  // Priority 7: State match
  const stateWords = state.split(/\s+/).filter(Boolean);
  if (
    state === query ||
    state.startsWith(query) ||
    stateWords.some((w) => w === query)
  ) {
    return { rank: 7, label: "State" };
  }

  return { rank: Number.POSITIVE_INFINITY, label: "" };
}

export async function searchPostalOffices(
  query: string,
): Promise<PostalOfficeSearchResult[]> {
  const normalizedQuery = normalizeComparable(query);

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  const offices = await postalOfficeDatasetPromise;

  const results: Array<PostalOfficeSearchResult & { rank: number }> = [];

  for (const office of offices) {
    const { rank, label } = getSearchRank(office, normalizedQuery);
    if (!Number.isFinite(rank)) continue;
    results.push({ ...toSearchResult(office), rank: rank, rankLabel: label });
  }

  results.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.officename.localeCompare(b.officename);
  });

  return results.slice(0, 50).map(({ rank: _rank, ...rest }) => rest);
}

export async function reverseLookupByPincode(
  pincode: string,
): Promise<PostalOfficeSearchResult[]> {
  const normalizedPincode = cleanValue(pincode);

  if (!/^\d{6}$/.test(normalizedPincode)) {
    return [];
  }

  const offices = await postalOfficeDatasetPromise;
  return offices
    .filter((office) => office.pincode === normalizedPincode)
    .sort((first, second) => first.officename.localeCompare(second.officename))
    .map((office) => ({
      ...toSearchResult(office),
      rankLabel: "Exact PIN",
      score: 0,
    }));
}

export async function getPostalStats(): Promise<PostalStats> {
  const offices = await postalOfficeDatasetPromise;
  return {
    totalOffices: offices.length,
    totalPincodes: new Set(offices.map((office) => office.pincode)).size,
    statesCovered: new Set(offices.map((office) => office.statename)).size,
    districtsCovered: new Set(offices.map((office) => office.district)).size,
  };
}

export async function findNearestPostalOffice(
  input: PostalDirectoryAddressInput,
): Promise<OfficialPostalOffice> {
  if (
    typeof input.latitude !== "number" ||
    typeof input.longitude !== "number"
  ) {
    throw new PostalDirectoryDatasetError(
      "missing-address-context",
      "Coordinates are required for postal lookup.",
    );
  }

  const coordinateBearingOffices =
    await coordinateBearingPostalOfficeDatasetPromise;

  const rankedOffices = rankByDistance(
    coordinateBearingOffices,
    input.latitude,
    input.longitude,
    input,
  );

  if (rankedOffices.length === 0) {
    throw new PostalDirectoryDatasetError(
      "postal-office-not-found",
      "No matching postal office with coordinates was found.",
    );
  }

  const nearestOffice = rankedOffices[0];

  return {
    officename: nearestOffice.officename,
    pincode: nearestOffice.pincode,
    district: nearestOffice.district,
    statename: nearestOffice.statename,
    latitude: nearestOffice.latitude,
    longitude: nearestOffice.longitude,
    divisionname: nearestOffice.divisionname,
    regionname: nearestOffice.regionname,
    officetype: nearestOffice.officetype,
    distanceKm: nearestOffice.distanceKm,
    confidence: getConfidenceScore(nearestOffice.distanceKm).confidence,
    confidenceLabel: getConfidenceScore(nearestOffice.distanceKm).label,
    confidenceWarning: getConfidenceScore(nearestOffice.distanceKm).warning,
  };
}
