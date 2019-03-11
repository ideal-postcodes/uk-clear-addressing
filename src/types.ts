import { Address } from "./index";

export interface FormattedPremise {
  premise: string;
  line_1: string;
  line_2: string;
  line_3: string;
}

export interface FormattedAddress extends FormattedPremise {
  post_town: string;
  postcode: string;
}

/**
 * Implements a raw record which can be found on Royal Mail's Postcode Address
 * File
 */
export interface PafRecord {
  udprn?: number;
  umprn?: number;
  postcode?: string;
  building_number?: string;
  building_name?: string;
  sub_building_name?: string;
  department_name?: string;
  organisation_name?: string;
  po_box?: string;
  post_town?: string;
  dependant_locality?: string;
  double_dependant_locality?: string;
  thoroughfare?: string;
  dependant_thoroughfare?: string;
  postcode_type?: string;
  su_organisation_indicator?: string;
  delivery_point_suffix?: string;
}

/**
 * AddressRecord includes PAF attributes as well as optional attributes from
 * third party sources
 */
export interface AddressRecord extends PafRecord {
  northings?: number;
  eastings?: number;
  longitude?: number;
  latitude?: number;
  county?: string;
  traditional_county?: string;
  administrative_county?: string;
  postal_county?: string;
  district?: string;
  ward?: string;
  country?: string;
}

/**
 * A list of premise labels ordered by precedence
 * @hidden
 */
export type AddressElements = string[];

/**
 * Function implements Address Formatter. It takes an `Address` instance and
 * formats premise attributes according to certain rules
 */
export interface AddressFormatter {
  (address: Address): FormattedPremise;
}

export type LocalityElements =
  | "dependant_locality"
  | "double_dependant_locality"
  | "thoroughfare"
  | "dependant_thoroughfare";

/**
 * Building range match object
 * @hidden
 */
export interface BuildingRangeMatch {
  range: string;
  name: string;
}

export type SortingElems =
  | "building_number"
  | "building_name"
  | "sub_building_name"
  | "organisation_name"
  | "department_name"
  | "po_box";

export type EmptyString = "";

export interface NumericExtractor {
  (address: AddressRecord, elem: keyof AddressRecord): number | EmptyString;
}

export interface RawAddress {
  postcode_inward: string;
  postcode_outward: string;
  po_box: string;
  postcode: string;
  post_town: string;
  dependant_locality: string;
  double_dependant_locality: string;
  thoroughfare: string;
  dependant_thoroughfare: string;
  building_number: string;
  building_name: string;
  sub_building_name: string;
  department_name: string;
  organisation_name: string;
  postcode_type: string;
  su_organisation_indicator: string;
  delivery_point_suffix: string;
  county: string;
  traditional_county: string;
  administrative_county: string;
  postal_county: string;
  district: string;
  ward: string;
  country: string;
  northings: number | EmptyString;
  eastings: number | EmptyString;
  udprn: number | EmptyString;
  umprn: number | EmptyString;
  longitude: number | EmptyString;
  latitude: number | EmptyString;
}

export interface AddressJSON extends RawAddress, FormattedAddress {}
