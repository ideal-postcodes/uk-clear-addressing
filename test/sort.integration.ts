"use strict";

import { readdirSync } from "fs";
import { join } from "path";
import { assert } from "chai";
import { Address } from "../src/index";
import { AddressRecord } from "../src/types";

/**
 * Reads JSON files that match `*.sorted.json`
 * These files represent sorted responses
 */
const testCases: Address[][] = readdirSync(join(__dirname, "data"))
	.filter(file => file.match(/\.sorted\.json$/))
	.map(file => <AddressRecord[]>require(`./data/${file}`))
	.map(addressRecords => {
		return addressRecords.map(record => new Address(record));
	});

const sortingError = (results: Address[], expected: Address[]): string => {
	const toString = (a: Address): string => {
		const formatted = a.formattedAddress();
		return [formatted.line_1, formatted.line_2, formatted.line_3]
			.filter(e => e !== "")
			.join(", ");
	};
	const expectedList = expected.map(toString).join("\n");
	const computedList = results.map(toString).join("\n");
	return `
		Expected:\n
${expectedList}

		To Match:\n
${computedList}`;
};

const sameOrder = (results: Address[], expected: Address[]): void => {
	assert.equal(results.length, expected.length);
	expected.forEach((_, i) => {
		const errorMessage = sortingError(results, expected);
		assert.equal(expected[i].sub_building_name, results[i].sub_building_name, errorMessage);
		assert.equal(expected[i].building_name, results[i].building_name, errorMessage);
		assert.equal(expected[i].building_number, results[i].building_number, errorMessage);
		assert.equal(expected[i].organisation_name, results[i].organisation_name, errorMessage);
		assert.equal(expected[i].department_name, results[i].department_name, errorMessage);
	});
};

// Non-destructive version of
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle<T> (array: T[]): T[] {
	const a = array.slice();
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
};

describe("sort", () => {
	testCases.forEach(testAddresses => {
		it ("correctly sorts addresses", () => {
			const sortedAddresses = shuffle(testAddresses);
			sortedAddresses.sort(Address.sort);
			sameOrder(sortedAddresses, testAddresses);
		});
	});

	it ("handles identical addresses", () => {
		const data = {
			"building_name": "",
			"sub_building_name": "",
			"building_number": "188",
			"organisation_name": "",
			"department_name": "",
			"post_town": "LEIGH-ON-SEA",
			"postcode": "AA1 1AA",
			"dependant_locality": "",
			"double_dependant_locality": "",
			"po_box": "",
			"thoroughfare": "Elm Road",
			"dependant_thoroughfare": ""
		};
		const addresses = [
			new Address(data),
			new Address(data),
			new Address(data),
		];
		const sortedAddresses = addresses.slice().sort(Address.sort);
		assert.equal(sortedAddresses.length, addresses.length);
		addresses.forEach(address => {
			assert.isTrue(sortedAddresses.some(a => a === address));
		});
	});
});
