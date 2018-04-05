import {
	extract,
	EmptyString,
	extractFloat,
	extractInteger,
} from "./utils";
import { sort } from "./sort";
import { formatter } from "./rules";

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

export class Address {
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

	readonly northings: number|EmptyString;
	readonly eastings: number|EmptyString;
	readonly udprn: number|EmptyString;
	readonly umprn: number|EmptyString;

	readonly longitude: number|EmptyString;
	readonly latitude: number|EmptyString;

	public cache: FormattedAddress|null;

	constructor (data: AddressRecord) {
		this.postcode = extract(data, "postcode");
		this.post_town = extract(data, "post_town").toUpperCase();
		this.dependant_locality = extract(data, "dependant_locality");
		this.double_dependant_locality = extract(data, "double_dependant_locality");
		this.thoroughfare = extract(data, "thoroughfare");
		this.dependant_thoroughfare = extract(data, "dependant_thoroughfare");
		this.building_number = extract(data, "building_number");
		this.building_name = extract(data, "building_name");
		this.sub_building_name = extract(data, "sub_building_name");
		this.department_name = extract(data, "department_name");
		this.organisation_name = extract(data, "organisation_name");
		this.postcode_type = extract(data, "postcode_type");
		this.su_organisation_indicator = extract(data, "su_organisation_indicator");
		this.delivery_point_suffix = extract(data, "delivery_point_suffix");
		this.county = extract(data, "county");
		this.traditional_county = extract(data, "traditional_county");
		this.administrative_county = extract(data, "administrative_county");
		this.postal_county = extract(data, "postal_county");
		this.district = extract(data, "district");
		this.ward = extract(data, "ward");
		this.country = extract(data, "country");
		this.po_box = extract(data, "po_box");

		// Extract integers
		this.udprn = extractInteger(data, "udprn");
		this.umprn = extractInteger(data, "umprn");
		this.northings = extractInteger(data, "northings");
		this.eastings = extractInteger(data, "eastings");

		// Extract floats
		this.longitude = extractFloat(data, "longitude");
		this.latitude = extractFloat(data, "latitude");

		if (this.postcode) {
			this.postcode_outward = this.postcode.split(" ")[0];
			this.postcode_inward = this.postcode.split(" ")[1];
		} else {
			this.postcode_outward = "";
			this.postcode_inward = "";
		}

		this.cache = null;

		if (this.building_number === "0") {
			this.building_number = "";
			this.merge_sub_and_building = true;
		} else {
			this.merge_sub_and_building = false;
		}
	}

	formattedAddress(): FormattedAddress {
		if (this.cache) return this.cache;
		this.cache = Object.assign({
			post_town: this.post_town,
			postcode: this.postcode,
		}, formatter(this));
		return this.cache;
	}

	static formatPostcode(postcode: string): string {
		return postcode
			.toString()
			.toUpperCase()
			.replace(/\s/g, "")
			.replace(/%20/g, "");
	}

	static sort(a: Address, b: Address): Number {
		return sort(a, b);
	}
}
