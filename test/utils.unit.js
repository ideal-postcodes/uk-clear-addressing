"use strict";

const { assert } = require("chai");
const {
	extract,
	isEmpty,
	extractNumber,
	extractFloat,
} = require("../lib/utils.js");

describe("Utils", () => {
	describe("extract", () => {
		it ("returns empty string if elem is undefined", () => {
			const address = { foo: undefined };
			const elem = "foo";
			assert.equal(extract(address, elem), "");
		});
		it ("returns empty string if elem is null", () => {
			const address = { foo: null };
			const elem = "foo";
			assert.equal(extract(address, elem), "");
		});
		it ("returns empty string if elem is spaced string", () => {
			const address = { foo: "    " };
			const elem = "foo";
			assert.equal(extract(address, elem), "");
		});
		it ("returns attribute identified by elem", () => {
			const address = { foo: "bar" };
			const elem = "foo";
			assert.equal(extract(address, elem), "bar");
		});
	});

	describe("isEmpty", () => {
		it ("returns false if undefined", () => {
			assert.isTrue(isEmpty(undefined));
		});
		it ("returns false if empty string", () => {
			assert.isTrue(isEmpty(""));
		});
		it ("returns false if spaced string", () => {
			assert.isTrue(isEmpty("  "));
		});
		it ("returns false if null", () => {
			assert.isTrue(isEmpty(null));
		});
		it ("returns false if 0", () => {
			assert.isTrue(isEmpty(0));
		});
		it ("otherwise returns true", () => {
			assert.isFalse(isEmpty("foo"));
		});
	});

	describe("extractNumber", () => {
		it ("returns empty string if undefined", () => {
			const address = { foo: undefined };
			const elem = "foo";
			assert.equal(extractNumber(address, elem), "");
		});
		it ("returns empty string if null", () => {
			const address = { foo: null };
			const elem = "foo";
			assert.equal(extractNumber(address, elem), "");
		});
		it ("returns number", () => {
			const address = { foo: 42 };
			const elem = "foo";
			assert.equal(extractNumber(address, elem), 42);
		});
	});

	describe("extractFloat", () => {
		it ("returns empty string if invalid float", () => {
			const address = { foo: "bar" };
			assert.equal(extractFloat(address, "foo"), "");
		});
		it ("returns float", () => {
			const address = { foo: 0.327328746238 };
			assert.equal(extractFloat(address, "foo"), address.foo);
		});
	});
});
