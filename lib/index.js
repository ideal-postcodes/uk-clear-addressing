"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_1 = require("./sort");
const rules_1 = require("./rules");
const utils_1 = require("./utils");
class Address {
    constructor(data) {
        this.postcode = utils_1.extract(data, "postcode");
        this.post_town = utils_1.extract(data, "post_town").toUpperCase();
        this.dependant_locality = utils_1.extract(data, "dependant_locality");
        this.double_dependant_locality = utils_1.extract(data, "double_dependant_locality");
        this.thoroughfare = utils_1.extract(data, "thoroughfare");
        this.dependant_thoroughfare = utils_1.extract(data, "dependant_thoroughfare");
        this.building_number = utils_1.extract(data, "building_number");
        this.building_name = utils_1.extract(data, "building_name");
        this.sub_building_name = utils_1.extract(data, "sub_building_name");
        this.department_name = utils_1.extract(data, "department_name");
        this.organisation_name = utils_1.extract(data, "organisation_name");
        this.postcode_type = utils_1.extract(data, "postcode_type");
        this.su_organisation_indicator = utils_1.extract(data, "su_organisation_indicator");
        this.delivery_point_suffix = utils_1.extract(data, "delivery_point_suffix");
        this.county = utils_1.extract(data, "county");
        this.traditional_county = utils_1.extract(data, "traditional_county");
        this.administrative_county = utils_1.extract(data, "administrative_county");
        this.postal_county = utils_1.extract(data, "postal_county");
        this.district = utils_1.extract(data, "district");
        this.ward = utils_1.extract(data, "ward");
        this.country = utils_1.extract(data, "country");
        this.po_box = utils_1.extract(data, "po_box");
        this.udprn = utils_1.extractInteger(data, "udprn");
        this.umprn = utils_1.extractInteger(data, "umprn");
        this.northings = utils_1.extractInteger(data, "northings");
        this.eastings = utils_1.extractInteger(data, "eastings");
        this.longitude = utils_1.extractFloat(data, "longitude");
        this.latitude = utils_1.extractFloat(data, "latitude");
        if (this.postcode) {
            this.postcode_outward = this.postcode.split(" ")[0];
            this.postcode_inward = this.postcode.split(" ")[1];
        }
        else {
            this.postcode_outward = "";
            this.postcode_inward = "";
        }
        this.cache = null;
        if (this.building_number === "0") {
            this.building_number = "";
            this.merge_sub_and_building = true;
        }
        else {
            this.merge_sub_and_building = false;
        }
    }
    raw() {
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
    toJSON() {
        return Object.assign(this.raw(), this.formattedAddress());
    }
    formattedAddress() {
        if (this.cache)
            return this.cache;
        this.cache = Object.assign({
            post_town: this.post_town,
            postcode: this.postcode,
        }, rules_1.formatter(this));
        return this.cache;
    }
    static formatPostcode(postcode) {
        return postcode
            .toString()
            .toUpperCase()
            .replace(/\s/g, "")
            .replace(/%20/g, "");
    }
    static sort(a, b) {
        return sort_1.sort(a, b);
    }
}
exports.Address = Address;
