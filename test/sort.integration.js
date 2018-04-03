"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("chai").assert;
const Address = require("../lib/index.js");

/**
 * Reads JSON files that match `*.sorted.json`
 * These files represent sorted responses
 */
const testCases = fs.readdirSync(path.join(__dirname, "data"))
	.filter(file => file.match(/\.sorted\.json$/))
	.map(file => require(`./data/${file}`));

const sameOrder = (addressObjects, testAddresses) => {
	assert.equal(addressObjects.length, testAddresses.length);
	Object.keys(testAddresses)
		.forEach(attr => {
			for (let i = 0; i < testAddresses.length; i++) {
				assert.equal(testAddresses[i][attr], addressObjects[i][attr]);
			}
		});
};

// Non-destructive version of
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = array => {
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
			const sortedAddresses = shuffle(testAddresses)
				.map(address => new Address(address))
				.sort(Address.sort);
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
		const sortedAddresses = addresses.sort(Address.sort);
		assert.equal(sortedAddresses.length, addresses.length);
		addresses.forEach(address => {
			assert.isTrue(sortedAddresses.some(a => a === address));
		});
	});
});
