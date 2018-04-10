import * as t from "./types";
export declare const extract: (address: t.AddressRecord, elem: "northings" | "eastings" | "longitude" | "latitude" | "county" | "traditional_county" | "administrative_county" | "postal_county" | "district" | "ward" | "country" | "udprn" | "umprn" | "postcode" | "building_number" | "building_name" | "sub_building_name" | "department_name" | "organisation_name" | "po_box" | "post_town" | "dependant_locality" | "double_dependant_locality" | "thoroughfare" | "dependant_thoroughfare" | "postcode_type" | "su_organisation_indicator" | "delivery_point_suffix") => string;
export declare const extractInteger: t.NumericExtractor;
export declare const isEmpty: (s: string) => boolean;
export declare const extractFloat: t.NumericExtractor;
export declare const lastElem: (a: string[]) => string;
export declare const prependLocality: (localities: string[], premise: string) => void;
