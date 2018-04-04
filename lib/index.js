"use strict";
const utils_1 = require("./utils");
const sort_js_1 = require("./sort.js");
const rules_js_1 = require("./rules.js");
class Address {
    constructor(data) {
        this.extractAddress(data);
        this.upcasePostTown();
        this.assignOutcodes();
        this.detectedMergedNumbers();
        this.cache = null;
    }
    extractAddress(data) {
        extractable.forEach(a => this[a] = utils_1.extract(data, a));
        extractableFloats.forEach(a => this[a] = utils_1.extractFloat(data, a));
        extractableNumbers.forEach(a => this[a] = utils_1.extractNumber(data, a));
    }
    detectedMergedNumbers() {
        if (this.building_number === "0") {
            this.building_number = "";
            this.merge_sub_and_building = true;
        }
        else {
            this.merge_sub_and_building = false;
        }
    }
    upcasePostTown() {
        this.post_town = this.post_town.toUpperCase();
    }
    assignOutcodes() {
        if (this.postcode) {
            this.postcode_outward = this.postcode.split(" ")[0];
            this.postcode_inward = this.postcode.split(" ")[1];
        }
        else {
            this.postcode_outward = "";
            this.postcode_inward = "";
        }
    }
    formattedAddress() {
        if (this.cache)
            return this.cache;
        this.cache = Object.assign({
            post_town: this.post_town,
            postcode: this.postcode,
        }, rules_js_1.formatter(this));
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
        return sort_js_1.sort(a, b);
    }
}
const extractableFloats = ["longitude", "latitude"];
const extractableNumbers = [
    "udprn",
    "umprn",
    "po_box",
    "northings",
    "eastings",
];
const extractable = [
    "postcode",
    "post_town",
    "dependant_locality",
    "double_dependant_locality",
    "thoroughfare",
    "dependant_thoroughfare",
    "building_number",
    "building_name",
    "sub_building_name",
    "department_name",
    "organisation_name",
    "postcode_type",
    "su_organisation_indicator",
    "delivery_point_suffix",
    "county",
    "traditional_county",
    "administrative_county",
    "postal_county",
    "district",
    "ward",
    "country",
];
module.exports = Address;
