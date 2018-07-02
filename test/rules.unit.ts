"use strict";

import { assert } from "chai";
import { Address } from "../src/index";
import {
	po_box,
	rule1,
	rule2,
	rule3,
	rule4,
	rule5,
	rule6,
	rule7,
	undocumentedRule,
} from "../src/rules";

describe("Rules", () => {
	describe("rule1", () => {
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				organisation_name: "Foo Ltd",
			});

			assert.deepEqual(rule1(base), {
				premise: "",
				line_1: "Foo Ltd",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("rule2", () => {
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_number: "8",
			});

			assert.deepEqual(rule2(base), {
				premise: "8",
				line_1: "8 High Street",
				line_2: "",
				line_3: "",
			});
		});
	});

	describe("rule3", () => {
		it ("handles building name exception", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "8a",
			});

			assert.deepEqual(rule3(base), {
				premise: "8a",
				line_1: "8a High Street",
				line_2: "",
				line_3: "",
			});
		});
		it ("handles sub range match", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo 8-9",
			});

			assert.deepEqual(rule3(base), {
				premise: "Foo, 8-9",
				line_1: "Foo",
				line_2: "8-9 High Street",
				line_3: "",
			});
		});
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
			});

			assert.deepEqual(rule3(base), {
				premise: "Foo",
				line_1: "Foo",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("rule4", () => {
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				building_number: "8",
			});

			assert.deepEqual(rule4(base), {
				premise: "Foo, 8",
				line_1: "Foo",
				line_2: "8 High Street",
				line_3: "",
			});
		});
	});

	describe("rule5", () => {
		it ("handles single character sub name", () => {
			const base = new Address({
				thoroughfare: "High Street",
				sub_building_name: "a",
				building_number: "8",
			});

			assert.deepEqual(rule5(base), {
				premise: "8a",
				line_1: "8a High Street",
				line_2: "",
				line_3: "",
			});
		});
		it ("returns correct address format", () => {
			const base = new Address({
				thoroughfare: "High Street",
				sub_building_name: "Foo",
				building_number: "8",
			});

			assert.deepEqual(rule5(base), {
				premise: "Foo, 8",
				line_1: "Foo",
				line_2: "8 High Street",
				line_3: "",
			});
		});
	});

	describe("rule6", () => {
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "Bar",
			});

			assert.deepEqual(rule6(base), {
				premise: "Bar, Foo",
				line_1: "Bar",
				line_2: "Foo",
				line_3: "High Street",
			});
		});
		it ("handles name exception in sub building name", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "8a",
			});

			assert.deepEqual(rule6(base), {
				premise: "8a Foo",
				line_1: "8a Foo",
				line_2: "High Street",
				line_3: "",
			});
		});
		it ("handles name exception in building name", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "9a",
				sub_building_name: "Bar",
			});

			assert.deepEqual(rule6(base), {
				premise: "Bar, 9a",
				line_1: "Bar",
				line_2: "9a High Street",
				line_3: "",
			});
		});
		it ("handles sub and building merges", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "Bar",
				building_number: "0",
			});

			assert.deepEqual(rule6(base), {
				premise: "Bar, Foo",
				line_1: "Bar, Foo",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("rule7", () => {
		it ("returns correct address object", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "Bar",
				building_number: "8",
			});

			assert.deepEqual(rule7(base), {
				premise: "Bar, Foo, 8",
				line_1: "Bar",
				line_2: "Foo",
				line_3: "8 High Street",
			});
		});
		it ("handles sub building name exception", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "9a",
				building_number: "8",
			});

			assert.deepEqual(rule7(base), {
				premise: "9a Foo, 8",
				line_1: "9a Foo",
				line_2: "8 High Street",
				line_3: "",
			});
		});
		it ("handles sub and building merge", () => {
			const base = new Address({
				thoroughfare: "High Street",
				building_name: "Foo",
				sub_building_name: "Bar",
				building_number: "0",
			});

			assert.deepEqual(rule7(base), {
				premise: "Bar, Foo",
				line_1: "Bar, Foo",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("po_box", () => {
		it ("handles po boxes", () => {
			const base = new Address({
				thoroughfare: "High Street",
				po_box: "8",
			});

			assert.deepEqual(po_box(base), {
				premise: "PO Box 8",
				line_1: "PO Box 8",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("Undocumented rule", () => {
		it ("handles sub_building_name only", () => {
			const base = new Address({
				thoroughfare: "High Street",
				sub_building_name: "Foo",
			});

			assert.deepEqual(undocumentedRule(base), {
				premise: "Foo",
				line_1: "Foo High Street",
				line_2: "",
				line_3: "",
			});
		});
	});
});
