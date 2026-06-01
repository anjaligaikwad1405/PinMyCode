export type PostalDirectoryAddressInput = {
  latitude: number;
  longitude: number;
  locality?: string;
  district?: string;
  state?: string;
};

export type PostalOffice = {
  officename: string;
  pincode: string;
  district: string;
  statename: string;
  latitude: number | null;
  longitude: number | null;
  divisionname: string;
  regionname: string;
  officetype: string;
  delivery: string;
};

export type OfficialPostalOffice = {
  officename: string;
  pincode: string;
  district: string;
  statename: string;
  latitude: number | null;
  longitude: number | null;
  divisionname: string;
  regionname: string;
  officetype: string;
  distanceKm: number;
  confidence: number;
  confidenceLabel: string;
  confidenceWarning: string | null;
};

export type PostalOfficeSearchResult = {
  officename: string;
  pincode: string;
  district: string;
  statename: string;
  latitude: number | null;
  longitude: number | null;
  divisionname: string;
  regionname: string;
  officetype: string;
  delivery: string;
  rankLabel?: string;
  score?: number;
};

export type GeocodedAddress = {
  lat: string;
  lon: string;
  display_name: string;
};

export type PostalStats = {
  totalOffices: number;
  totalPincodes: number;
  statesCovered: number;
  districtsCovered: number;
};
