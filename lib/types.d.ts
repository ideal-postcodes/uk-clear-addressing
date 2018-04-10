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
export interface PafRecord {
    udprn: number;
    umprn?: number;
    postcode: string;
    building_number: string;
    building_name: string;
    sub_building_name: string;
    department_name: string;
    organisation_name: string;
    po_box: string;
    post_town: string;
    dependant_locality: string;
    double_dependant_locality: string;
    thoroughfare: string;
    dependant_thoroughfare: string;
    postcode_type: string;
    su_organisation_indicator: string;
    delivery_point_suffix: string;
}
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
export declare type AddressElements = string[];
export interface AddressFormatter {
    (address: Address): FormattedPremise;
}
export declare type LocalityElements = "dependant_locality" | "double_dependant_locality" | "thoroughfare" | "dependant_thoroughfare";
export interface BuildingRangeMatch {
    range: string;
    actual_name: string;
}
export declare type SortingElems = "building_number" | "building_name" | "sub_building_name" | "organisation_name" | "department_name" | "po_box";
export declare type EmptyString = "";
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
export interface AddressJSON extends RawAddress, FormattedAddress {
}
