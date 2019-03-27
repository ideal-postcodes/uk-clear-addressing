import * as t from "./types";
import { sort } from "./sort";
import { formatter } from "./rules";
import { extract, extractFloat, extractInteger } from "./utils";

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

  readonly northings: number | t.EmptyString;
  readonly eastings: number | t.EmptyString;
  readonly udprn: number | t.EmptyString;
  readonly umprn: number | t.EmptyString;

  readonly longitude: number | t.EmptyString;
  readonly latitude: number | t.EmptyString;

  public cache: t.FormattedAddress | null;

  /**
   * The `Address` class is designed to wrap a Postcode Address File (PAF)
   * record and provide utility methods to make this data more readily
   * consumable for humans
   *
   * `Address` requires an object of type `AddressRecord` to be instantiated
   * which is comprised of fields readily found on PAF
   *
   * `Address` can be used to
   * - Compute address lines based on premise and locality information
   * - Sensibly compute a `premise` label based on (sub) building name and number
   * - Sensibly sort an array of addresses
   *
   * @example
   * ```typescript
   * // Formatting an address
   *
   * const address = new Address({
   * 	postcode: "WS11 5SB",
   * 	post_town: "CANNOCK",
   * 	dependant_locality: "",
   * 	double_dependant_locality: "",
   * 	thoroughfare: "Pye Green Road",
   * 	building_number: "",
   * 	building_name: "Flower House 189A",
   * 	sub_building_name: "",
   * 	dependant_thoroughfare: "",
   * 	organisation_name: 'S D Alcott Florists',
   * });
   *
   * console.log(address.formattedAddress());
   *
   * //
   * //	{
   * //		postcode: 'WS11 5SB',
   * //		post_town: 'CANNOCK',
   * //		line_1: 'S D Alcott Florists',
   * //		line_2: 'Flower House',
   * //		line_3: '189a Pye Green Road',
   * //		premise: "Flower House, 189a"
   * //	}
   * //
   * ```
   *
   * @example
   * ```typescript
   * // Formatting an address
   *
   *const addresses = await query("SELECT * FROM postcode_address_file LIMIT 10");
   *
   * addresses
   * 	.map(address => new Address(address)) // Instantiate an `Address` instances
   * 	.sort(Address.sort)  								  // Now sort
   *
   * 	// Print an example to console
   * 	.forEach(address => console.log(address.line_1));
   * 	// "190 Elm Road"
   * 	// "190a Elm Road"
   * 	// "191 Elm Road"
   * 	// "191a Elm Road"
   * 	// "192 Elm Road"
   * 	// "193 Elm Road"
   * 	// "193a Elm Road"
   * 	// "197 Elm Road"
   * 	// "197a Elm Road"
   * 	// "199 Elm Road"
   * ```
   * @param {AddressRecord} data
   */
  constructor(data: AddressRecord) {
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

  get line_1(): string {
    return this.formattedAddress().line_1;
  }

  get line_2(): string {
    return this.formattedAddress().line_2;
  }

  get line_3(): string {
    return this.formattedAddress().line_3;
  }

  get premise(): string {
    return this.formattedAddress().premise;
  }

  /**
   * Returns object containing raw address attributes
   * @hidden
   */
  raw(): t.RawAddress {
    return {
      postcode: this.postcode,
      post_town: this.post_town,
      dependant_locality: this.dependant_locality,
      double_dependant_locality: this.double_dependant_locality,
      thoroughfare: this.thoroughfare,
      dependant_thoroughfare: this.dependant_thoroughfare,
      building_number: this.building_number,
      building_name: this.building_name,
      sub_building_name: this.sub_building_name,
      department_name: this.department_name,
      organisation_name: this.organisation_name,
      postcode_type: this.postcode_type,
      su_organisation_indicator: this.su_organisation_indicator,
      delivery_point_suffix: this.delivery_point_suffix,
      county: this.county,
      traditional_county: this.traditional_county,
      administrative_county: this.administrative_county,
      postal_county: this.postal_county,
      district: this.district,
      ward: this.ward,
      country: this.country,
      po_box: this.po_box,
      udprn: this.udprn,
      umprn: this.umprn,
      northings: this.northings,
      eastings: this.eastings,
      longitude: this.longitude,
      latitude: this.latitude,
      postcode_outward: this.postcode_outward,
      postcode_inward: this.postcode_inward,
    };
  }

  /**
   * Returns a complete JSON representation of the `Address` instance
   */
  toJSON(): t.AddressJSON {
    return Object.assign(this.raw(), this.formattedAddress());
  }

  /**
   * Returns an object representing an address with sensibly computed address
   * line labels according to Royal Mail's formatting rules
   */
  formattedAddress(): t.FormattedAddress {
    if (this.cache) return this.cache;
    this.cache = Object.assign(
      {
        post_town: this.post_town,
        postcode: this.postcode,
      },
      formatter(this)
    );
    return this.cache;
  }

  static formatPostcode(postcode: string): string {
    return postcode
      .toString()
      .toUpperCase()
      .replace(/\s/g, "")
      .replace(/%20/g, "");
  }

  /**
   * A function which allow two `Address` objects to be compared.
   * This function can be readily fed into `Array.prototype.sort`
   *
   * @example
   *
   * ```
   * addresses.sort(Address.sort)
   * ```
   */
  static sort(a: Address, b: Address): number {
    return sort(a, b);
  }
}

export type AddressRecord = t.AddressRecord;
