"use strict";

import { assert } from "chai";
import { Address } from "../src/index";
import { AddressRecord, FormattedAddress } from "../src/types";
import testData from "./data/formatting.json";

interface TestFixture {
  description: string;
  expected: FormattedAddress;
  fixture: AddressRecord;
}

const fixtures = testData.fixtures as TestFixture[];

const compare = (sample: AddressRecord, expected: FormattedAddress): void => {
  const address = new Address(sample);
  const formatted_address = address.formattedAddress();
  assert.equal(formatted_address.line_1, expected.line_1);
  assert.equal(formatted_address.line_2, expected.line_2);
  assert.equal(formatted_address.line_3, expected.line_3);
  assert.equal(formatted_address.postcode, expected.postcode);
  assert.equal(formatted_address.post_town, expected.post_town);
  assert.equal(formatted_address.premise, expected.premise);
  assert.equal(formatted_address.number, expected.number);
};

describe("Address formatting", () => {
  fixtures
    .sort((a, b) => a.description.localeCompare(b.description))
    .forEach(({ description, fixture, expected }) => {
      const testName = `${description} - returns the correct format for ${expected.line_1}`;
      it(testName, () => compare(fixture, expected));
    });
});
