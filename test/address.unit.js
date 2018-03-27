"use strict";

const { assert } = require("chai");
const Address = require("../lib/index.js");

describe("Address Model", () => {
	describe("instantiation", () => {
		it ("assigns inward and outward codes", () => {
			const address = new Address({ postcode: "FOO BAR" });
			assert.equal(address.postcode_outward, "FOO");
			assert.equal(address.postcode_inward, "BAR");
		});
		it ("assigns empty string to inward/outward codes if postcode not present", () => {
			const address = new Address({ postcode: null });
			assert.equal(address.postcode_outward, "");
			assert.equal(address.postcode_inward, "");
		});
		it ("assigns cache", () => {
			const address = new Address({});
			assert.isNull(address.cache);
		});
		it ("detects empty building number", () => {
			const address = new Address({ building_number: "0" });
			assert.equal(address.building_number, "");
			assert.isTrue(address.merge_sub_and_building);
		});
		it ("assigns relevant attributes", () => {
			const data = {
				postcode: "postcode",
				udprn: 1,
				umprn: 2,
				post_town: "POST_TOWN",
				dependant_locality: "dependant_locality",
				double_dependant_locality: "double_dependant_locality",
				thoroughfare: "thoroughfare",
				dependant_thoroughfare: "dependant_thoroughfare",
				building_number: "building_number",
				building_name: "building_name",
				sub_building_name: "sub_building_name",
				po_box: "po_box",
				department_name: "department_name",
				organisation_name: "organisation_name",
				postcode_type: "postcode_type",
				su_organisation_indicator: "su_organisation_indicator",
				delivery_point_suffix: "delivery_point_suffix",
				northings: 123456,
				eastings: 654321,
				longitude: 0.012345,
				latitude: 55.0235234,
				county: "county",
				traditional_county: "traditional_county",
				administrative_county: "administrative_county",
				postal_county: "postal_county",
				district: "district",
				ward: "ward",
				country: "country",
			};
			const address = new Address(data);
			Object.keys(data).forEach(attr => {
				assert.equal(address[attr], data[attr]);
			});
			assert.isFalse(address.merge_sub_and_building);
		});
		it ("uppercases post town", () => {
			const address = new Address({ post_town: "foo" });
			assert.equal(address.post_town, "FOO");
		});
	});

	describe("#formattedAddress", () => {
		it ("returns and caches an address object", () => {
			const sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "APPLEFORD",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "LEDA ENGINEERING LTD",
				department_name: "",
				UDPRN: ""
			};
			const address = new Address(sample);
			const	formattedAddress = address.formattedAddress();
			assert.isObject(address);
			assert.equal(address.cache, formattedAddress);
		});
		it ("returns cached object if available", () => {
			const address = new Address({});
			address.cache = {};
			assert.equal(address.cache, address.formattedAddress());
		});
	});

	describe(".formatPostcode", () => {
		it ("formats a postcode", () => {
			assert.equal(Address.formatPostcode("ab 1%20 1BB%20 "), "AB11BB");
		});
	});
});
