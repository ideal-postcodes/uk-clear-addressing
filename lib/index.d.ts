import { EmptyString } from "./utils";
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
export declare class Address {
    readonly merge_sub_and_building: boolean;
    readonly postcode_inward: string;
    readonly postcode_outward: string;
    readonly po_box: string;
    readonly postcode: string;
    readonly post_town: string;
    readonly dependant_locality: string;
    readonly double_dependant_locality: string;
    readonly thoroughfare: string;
    readonly dependant_thoroughfare: string;
    readonly building_number: string;
    readonly building_name: string;
    readonly sub_building_name: string;
    readonly department_name: string;
    readonly organisation_name: string;
    readonly postcode_type: string;
    readonly su_organisation_indicator: string;
    readonly delivery_point_suffix: string;
    readonly county: string;
    readonly traditional_county: string;
    readonly administrative_county: string;
    readonly postal_county: string;
    readonly district: string;
    readonly ward: string;
    readonly country: string;
    readonly northings: number | EmptyString;
    readonly eastings: number | EmptyString;
    readonly udprn: number | EmptyString;
    readonly umprn: number | EmptyString;
    readonly longitude: number | EmptyString;
    readonly latitude: number | EmptyString;
    cache: FormattedAddress | null;
    constructor(data: AddressRecord);
    formattedAddress(): FormattedAddress;
    static formatPostcode(postcode: string): string;
    static sort(a: Address, b: Address): Number;
}
