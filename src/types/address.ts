export interface Address {
  latitude: number;
  longitude: number;
  houseNumber?: string;
  buildingName?: string;
  road?: string;
  locality?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  rawAddress: NominatimAddress;
}

export interface NominatimAddress {
  house_number?: string;
  building?: string;
  house_name?: string;
  name?: string;
  amenity?: string;
  apartments?: string;
  commercial?: string;
  retail?: string;
  shop?: string;
  office?: string;
  tourism?: string;
  leisure?: string;
  historic?: string;
  attraction?: string;
  man_made?: string;
  road?: string;
  industrial?: string;
  residential?: string;
  pedestrian?: string;
  footway?: string;
  path?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  quarter?: string;
  hamlet?: string;
  borough?: string;
  locality?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  country?: string;
}

export interface ReverseGeocodeResponse {
  place_id?: number;
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
  address?: NominatimAddress;
  extratags?: Record<string, string>;
  namedetails?: Record<string, string>;
  error?: string;
}
