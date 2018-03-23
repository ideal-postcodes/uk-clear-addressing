"use strict";

const { assert } = require("chai");
const Address = require("../lib/index.js");

describe("Building name exception test", () => {
	let sample, address;
	
	it ("should be true", function () {
		sample = {
			building_name: "12A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "100:1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1to1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "a"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1a"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "11A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	
	// SHOULD THIS BE A CONSIDERATION? PLAIN DIGITS?
	//
	it ("should be true", function () {  
		sample = {
			building_name: "1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	
	it ("should be true", function () {  
		sample = {
			building_name: "10"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {  
		sample = {
			building_name: "100"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
});

describe("Formatted Addresses", function () {
	it ("should cache formatted addresses", function () {
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
		assert.equal(address.formattedAddressCache, formattedAddress);
	});
});