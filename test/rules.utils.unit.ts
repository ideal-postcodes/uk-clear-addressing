"use strict";

import { assert } from "chai";
import { Address } from "../src/index";
import {
  nameException,
  isSingleCharacter,
  combinePremise,
  premiseLocalities,
  appendOrganisationInfo,
  checkBuildingRange,
} from "../src/utils";

describe("Rules", () => {
  describe("nameException", () => {
    [
      "12A",
      "100:1",
      "1to1",
      "A",
      "a",
      "1A",
      "1a",
      "11A",
      "1",
      "10",
      "100",
    ].forEach(testCase => {
      it(`returns true for ${testCase}`, () => {
        assert.isTrue(nameException(testCase));
      });
    });
    it("returns false otherwise", () => {
      assert.isFalse(nameException("Foo"));
    });
  });

  describe("isSingleCharacter", () => {
    it("returns true if string is single character", () => {
      ["A", "B", "Z", "a"].forEach(c => assert.isTrue(isSingleCharacter(c)));
    });
    it("returns false if string is not character", () => {
      ["0", "1", "AZ", "azz", ""].forEach(c =>
        assert.isFalse(isSingleCharacter(c))
      );
    });
  });
  describe("checkBuildingRange", () => {
    it("returns a building range object if detected", () => {
      assert.deepEqual(checkBuildingRange("foo 12-13"), {
        range: "12-13",
        name: "foo",
      });
    });
    it("returns null if no building range detected", () => {
      assert.isUndefined(checkBuildingRange("foo"));
    });
  });

  describe("appendOrganisationInfo", () => {
    it("appends organisation name", () => {
      const address = new Address({ organisation_name: "bar" });
      const premiseElements = ["foo"];
      appendOrganisationInfo(premiseElements, address);
      assert.deepEqual(premiseElements, ["foo", "bar"]);
    });
    it("appends department name if present", () => {
      const address = new Address({
        organisation_name: "bar",
        department_name: "baz",
      });
      const premiseElements = ["foo"];
      appendOrganisationInfo(premiseElements, address);
      assert.deepEqual(premiseElements, ["foo", "baz", "bar"]);
    });
  });

  describe("combinePremise", () => {
    it("combines ordered premise labels to an address object", () => {
      const premiseElements = ["foo", "bar", "baz"];
      const result = combinePremise(premiseElements, new Address({}), "quux");
      assert.deepEqual(result, {
        line_1: "baz",
        line_2: "bar",
        line_3: "foo",
        premise: "quux",
      });
    });
    it("returns empty string for line_1 and line_2 if not present", () => {
      const premiseElements = ["foo"];
      const result = combinePremise(premiseElements, new Address({}), "quux");
      assert.deepEqual(result, {
        line_1: "foo",
        line_2: "",
        line_3: "",
        premise: "quux",
      });
    });
    it("merges on line_3 if more than 3 premise labels provided", () => {
      const premiseElements = ["qux", "foo", "bar", "baz"];
      const result = combinePremise(premiseElements, new Address({}), "quux");
      assert.deepEqual(result, {
        line_1: "baz",
        line_2: "bar",
        line_3: "foo, qux",
        premise: "quux",
      });
    });
    it("assigns precedence to organisation details", () => {
      const premiseElements = ["foo"];
      const result = combinePremise(
        premiseElements,
        new Address({
          organisation_name: "baz ltd",
        }),
        "quux"
      );
      assert.deepEqual(result, {
        line_1: "baz ltd",
        line_2: "foo",
        line_3: "",
        premise: "quux",
      });
    });
    it("handles empty label array", () => {
      assert.deepEqual(combinePremise([], new Address({}), ""), {
        line_1: "",
        line_2: "",
        line_3: "",
        premise: "",
      });
    });
  });

  describe("premiseLocalities", () => {
    it("returns an ordered array of premise localities", () => {
      assert.deepEqual(
        premiseLocalities(
          new Address({
            double_dependant_locality: "bar",
            dependant_locality: "foo",
            dependant_thoroughfare: "quux",
            thoroughfare: "baz",
          })
        ),
        ["foo", "bar", "baz", "quux"]
      );
    });
    it("excludes empty localities", () => {
      assert.deepEqual(
        premiseLocalities(
          new Address({
            double_dependant_locality: "bar",
            dependant_locality: "",
            thoroughfare: " ",
          })
        ),
        ["bar"]
      );
    });
  });
});
