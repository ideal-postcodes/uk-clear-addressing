"use strict";

import { assert } from "chai";
import { Address } from "../src/index";
import { AddressRecord, AddressJSON } from "../src/types";
type RecordKeys = keyof AddressRecord;
import attrData from "./data/expected_raw_attributes.json";
const expectedRawAttributes = attrData as RecordKeys[];

type AddressJsonKeys = keyof AddressJSON;
import jsonData from "./data/expected_json_attributes.json";
const expectedJsonAttributes = jsonData as AddressJsonKeys[];

describe("Address Model", () => {
  describe("instantiation", () => {
    it("assigns inward and outward codes", () => {
      const address = new Address({ postcode: "FOO BAR" });
      assert.equal(address.postcode_outward, "FOO");
      assert.equal(address.postcode_inward, "BAR");
    });

    it("assigns empty string to inward/outward codes if postcode not present", () => {
      const address = new Address({ postcode: "" });
      assert.equal(address.postcode_outward, "");
      assert.equal(address.postcode_inward, "");
    });

    it("assigns cache", () => {
      const address = new Address({});
      assert.isNull(address.cache);
    });

    it("detects empty building number", () => {
      const address = new Address({ building_number: "0" });
      assert.equal(address.building_number, "");
      assert.isTrue(address.merge_sub_and_building);
    });

    it("assigns relevant attributes", () => {
      const data: AddressRecord = {
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
      assert.equal(data.postcode, address.postcode);
      assert.equal(data.post_town, address.post_town);
      assert.equal(data.dependant_locality, address.dependant_locality);
      assert.equal(
        data.double_dependant_locality,
        address.double_dependant_locality
      );
      assert.equal(data.thoroughfare, address.thoroughfare);
      assert.equal(data.dependant_thoroughfare, address.dependant_thoroughfare);
      assert.equal(data.building_number, address.building_number);
      assert.equal(data.building_name, address.building_name);
      assert.equal(data.sub_building_name, address.sub_building_name);
      assert.equal(data.po_box, address.po_box);
      assert.equal(data.department_name, address.department_name);
      assert.equal(data.organisation_name, address.organisation_name);
      assert.equal(data.postcode_type, address.postcode_type);
      assert.equal(
        data.su_organisation_indicator,
        address.su_organisation_indicator
      );
      assert.equal(data.delivery_point_suffix, address.delivery_point_suffix);
      assert.equal(data.county, address.county);
      assert.equal(data.traditional_county, address.traditional_county);
      assert.equal(data.administrative_county, address.administrative_county);
      assert.equal(data.postal_county, address.postal_county);
      assert.equal(data.district, address.district);
      assert.equal(data.ward, address.ward);
      assert.equal(data.country, address.country);
      assert.isFalse(address.merge_sub_and_building);
      assert.equal(data.udprn, <number>address.udprn);
      assert.equal(data.umprn, <number>address.umprn);
      assert.equal(data.northings, <number>address.northings);
      assert.equal(data.eastings, <number>address.eastings);
      assert.equal(data.longitude, <number>address.longitude);
      assert.equal(data.latitude, <number>address.latitude);
    });
    it("uppercases post town", () => {
      const address = new Address({ post_town: "foo" });
      assert.equal(address.post_town, "FOO");
    });
  });

  describe("#raw", () => {
    it("returns a new object representing raw address details", () => {
      const address = new Address({});
      const result = address.raw();
      expectedRawAttributes.forEach(attr => assert.isDefined(result[attr]));
      assert.equal(expectedRawAttributes.length, Object.keys(result).length);
    });
  });

  describe("toJSON", () => {
    it("returns a publicly consumable JSON representation of address", () => {
      const address = new Address({});
      const result = address.toJSON();
      expectedJsonAttributes.forEach(attr => assert.isDefined(result[attr]));
      assert.equal(expectedJsonAttributes.length, Object.keys(result).length);
    });
  });

  describe("#formattedAddress", () => {
    it("returns and caches an address object", () => {
      const sample: AddressRecord = {
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
      };
      const address = new Address(sample);
      const formattedAddress = address.formattedAddress();
      assert.isObject(address);
      assert.equal(address.cache, formattedAddress);
    });
    it("returns cached object if available", () => {
      const address = new Address({});
      address.cache = {
        premise: "premise",
        line_1: "line_1",
        line_2: "line_2",
        line_3: "line_3",
        post_town: "post_town",
        postcode: "postcode",
      };
      assert.equal(address.cache, address.formattedAddress());
    });
  });

  describe(".formatPostcode", () => {
    it("formats a postcode", () => {
      assert.equal(Address.formatPostcode("ab 1%20 1BB%20 "), "AB11BB");
    });
  });
});
