"use strict";

const { assert } = require("chai");
const {
	po_box,
	rule1,
	rule2,
	rule3,
	rule4,
	rule5,
	rule6,
	rule7,
	undocumentedRule,
} = require("../lib/rules.js");

describe("Rules", () => {
	let base;

	beforeEach(() => {
		base = { thoroughfare: "High Street" };
	});

	describe("rule1", () => {
		it ("returns correct address object", () => {
			base.organisation_name = "Foo Ltd";
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
			base.building_number = "8";
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
			base.building_name = "8a";
			assert.deepEqual(rule3(base), {
				premise: "8a",
				line_1: "8a High Street",
				line_2: "",
				line_3: "",
			});
		});
		it ("handles sub range match", () => {
			base.building_name = "Foo 8-9";
			assert.deepEqual(rule3(base), {
				premise: "Foo, 8-9",
				line_1: "Foo",
				line_2: "8-9 High Street",
				line_3: "",
			});
		});
		it ("returns correct address object", () => {
			base.building_name = "Foo";
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
			base.building_name = "Foo";
			base.building_number = "8";
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
			base.sub_building_name = "a";
			base.building_number = "8";
			assert.deepEqual(rule5(base), {
				premise: "8a",
				line_1: "8a High Street",
				line_2: "",
				line_3: "",
			});
		});
		it ("returns correct address format", () => {
			base.sub_building_name = "Foo";
			base.building_number = "8";
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
			base.building_name = "Foo";
			base.sub_building_name = "Bar";
			assert.deepEqual(rule6(base), {
				premise: "Bar, Foo",
				line_1: "Bar",
				line_2: "Foo",
				line_3: "High Street",
			});
		});
		it ("handles name exception in sub building name", () => {
			base.building_name = "Foo";
			base.sub_building_name = "8a";
			assert.deepEqual(rule6(base), {
				premise: "8a Foo",
				line_1: "8a Foo",
				line_2: "High Street",
				line_3: "",
			});
		});
		it ("handles name exception in building name", () => {
			base.building_name = "9a";
			base.sub_building_name = "Bar";
			assert.deepEqual(rule6(base), {
				premise: "Bar, 9a",
				line_1: "Bar",
				line_2: "9a High Street",
				line_3: "",
			});
		});
		it ("handles sub and building merges", () => {
			base.building_name = "Foo";
			base.sub_building_name = "Bar";
			base.building_number = "";
			base.merge_sub_and_building = true;
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
			base.building_name = "Foo";
			base.sub_building_name = "Bar";
			base.building_number = "8";
			assert.deepEqual(rule7(base), {
				premise: "Bar, Foo, 8",
				line_1: "Bar",
				line_2: "Foo",
				line_3: "8 High Street",
			});
		});
		it ("handles sub building name exception", () => {
			base.building_name = "Foo";
			base.sub_building_name = "9a";
			base.building_number = "8";
			assert.deepEqual(rule7(base), {
				premise: "9a Foo, 8",
				line_1: "9a Foo",
				line_2: "8 High Street",
				line_3: "",
			});
		});
		it ("handles sub and building merge", () => {
			base.building_name = "Foo";
			base.sub_building_name = "Bar";
			base.building_number = "";
			base.merge_sub_and_building = true;
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
			base.po_box = 8;
			assert.deepEqual(po_box(base), {
				premise: "PO Box 8",
				line_1: "PO Box 8",
				line_2: "High Street",
				line_3: "",
			});
		});
	});

	describe("", () => {
		it ("undocumentedRule", () => {
			base.sub_building_name = "Foo";
			assert.deepEqual(undocumentedRule(base), {
				premise: "Foo",
				line_1: "Foo High Street",
				line_2: "",
				line_3: "",
			});
		});
	});
});
