"use strict";

const { assert } = require("chai");
const {
	nameException,
} = require("../lib/rules.js");

describe("Rules", () => {
	describe("nameException", () => {
		it ("returns true for 12A", () => assert.isTrue(nameException("12A")));
		it ("returns true for 1", () => assert.isTrue(nameException("100:1")));
		it ("returns true for 1to1", () => assert.isTrue(nameException("1to1")));
		it ("returns true for A", () => assert.isTrue(nameException("A")));
		it ("returns true for a", () => assert.isTrue(nameException("a")));
		it ("returns true for 1A", () => assert.isTrue(nameException("1A")));
		it ("returns true for 1a", () => assert.isTrue(nameException("1a")));
		it ("returns true for 11A", () => assert.isTrue(nameException("11A")));
		it ("returns true for 1", () =>   assert.isTrue(nameException("1")));
		it ("returns true for 10", () =>   assert.isTrue(nameException("10")));
		it ("returns true for 100", () =>   assert.isTrue(nameException("100")));
	});
});
