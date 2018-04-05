import { Address, FormattedPremise } from "./index";
export declare type AddressElements = string[];
export interface AddressFormatter {
    (address: Address): FormattedPremise;
}
export declare const nameException: (n: string) => boolean;
export declare const appendOrganisationInfo: (elems: string[], address: Address) => void;
export declare const combinePremise: (elems: string[], address: Address, premise: string) => FormattedPremise;
export declare const premiseLocalities: (address: Address) => string[];
export declare const rule1: AddressFormatter;
export declare const rule2: AddressFormatter;
export interface BuildingRangeMatch {
    range: string;
    actual_name: string;
}
export declare const checkBuildingRange: (building_name: string) => BuildingRangeMatch | null;
export declare const rule3: AddressFormatter;
export declare const rule4: AddressFormatter;
export declare const rule5: AddressFormatter;
export declare const rule6: AddressFormatter;
export declare const rule7: AddressFormatter;
export declare const undocumentedRule: AddressFormatter;
export declare const po_box: AddressFormatter;
export declare const formatter: AddressFormatter;
