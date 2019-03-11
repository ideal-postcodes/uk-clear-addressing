"use strict";

import { assert } from "chai";
import { extract, isEmpty, extractInteger, extractFloat } from "../src/utils";

describe("Utils", () => {
  describe("extract", () => {
    it("returns empty string if elem is undefined", () => {
      const address = { thoroughfare: undefined };
      const elem = "thoroughfare";
      assert.equal(extract(address, elem), "");
    });
    it("returns empty string if elem is null", () => {
      const address = { thoroughfare: <any>null };
      const elem = "thoroughfare";
      assert.equal(extract(address, elem), "");
    });
    it("returns empty string if elem is spaced string", () => {
      const address = { thoroughfare: "    " };
      const elem = "thoroughfare";
      assert.equal(extract(address, elem), "");
    });
    it("returns attribute identified by elem", () => {
      const address = { thoroughfare: "bar" };
      const elem = "thoroughfare";
      assert.equal(extract(address, elem), "bar");
    });
  });

  describe("isEmpty", () => {
    it("returns false if undefined", () => {
      assert.isTrue(isEmpty(<any>undefined));
    });
    it("returns false if empty string", () => {
      assert.isTrue(isEmpty(""));
    });
    it("returns false if spaced string", () => {
      assert.isTrue(isEmpty("  "));
    });
    it("returns false if null", () => {
      assert.isTrue(isEmpty(<any>null));
    });
    it("returns false if 0", () => {
      assert.isTrue(isEmpty(<any>0));
    });
    it("otherwise returns true", () => {
      assert.isFalse(isEmpty("foo"));
    });
  });

  describe("extractInteger", () => {
    it("returns empty string if undefined", () => {
      const address = { udprn: undefined };
      const elem = "udprn";
      assert.equal(extractInteger(address, elem), "");
    });
    it("returns empty string if null", () => {
      const address = { udprn: <any>null };
      const elem = "udprn";
      assert.equal(extractInteger(address, elem), "");
    });
    it("returns number", () => {
      const address = { udprn: 42 };
      const elem = "udprn";
      assert.equal(extractInteger(address, elem), 42);
    });
    it("returns number if represented as string", () => {
      const address = { building_name: "42" };
      const elem = "building_name";
      assert.equal(extractInteger(address, elem), 42);
    });
    it("returns empty if numeric representation invalid", () => {
      const address = { building_name: "building_name" };
      const elem = "building_name";
      assert.equal(extractInteger(address, elem), "");
    });
  });

  describe("extractFloat", () => {
    it("returns empty string if invalid float", () => {
      const address = { northings: <any>"bar" };
      assert.equal(extractFloat(address, "northings"), "");
    });
    it("returns empty string if undefined", () => {
      const address = { northings: undefined };
      assert.equal(extractFloat(address, "northings"), "");
    });
    it("returns empty string if null", () => {
      const address = { northings: <any>null };
      assert.equal(extractFloat(address, "northings"), "");
    });
    it("returns float", () => {
      const address = { northings: 0.327328746238 };
      assert.equal(extractFloat(address, "northings"), address.northings);
    });
  });
});
