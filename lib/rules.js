"use strict";

const {
	isEmpty,
} = require("./utils.js");

const nameExceptionRegex = /^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i;

// Exception Rule indicators:
// i) First and last characters of the Building Name are numeric (eg ‘1to1’ or ’100:1’)
// ii) First and penultimate characters are numeric, last character is alphabetic (eg 12A’)
// iii) Building Name has only one character (eg ‘A’)
const nameException = name => name.match(nameExceptionRegex) !== null;

const prepareAddressArray = (address_array, address, premise) => {
	const result = {
		postcode: address.postcode,
		post_town: address.post_town
	};

	if (typeof premise === "string") {
		result.premise = premise;
	}

	if (!isEmpty(address.organisation_name)) {
		if (!isEmpty(address.department_name)) {
			address_array.push(address.department_name);
		}
		address_array.push(address.organisation_name);
	}
	const length = address_array.length;
	result.line_1 = "";
	result.line_2 = "";
	result.line_3 = "";
	address_array.reverse();
	for (let line = 0; line < length; line += 1) {
		if (line < 3) {
			result["line_" + (line + 1).toString()] = address_array[line];
		} else {
			result.line_3 += (", " + address_array[line]);
		}
	}
	return result;
};

const addLocalityAndThoroughfareElements = address => {
	const result = [];
	if (!isEmpty(address.dependant_locality)) result.push(address.dependant_locality);
	if (!isEmpty(address.double_dependant_locality)) result.push(address.double_dependant_locality);
	if (!isEmpty(address.thoroughfare)) result.push(address.thoroughfare);
	if (!isEmpty(address.dependant_thoroughfare)) result.push(address.dependant_thoroughfare);
	return result;
};

// Organisation Name
const rule1 = address => {
	const result = addLocalityAndThoroughfareElements(address);
	return prepareAddressArray(result, address, "");
};

// Building number only
const rule2 = address => {
	const result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	return prepareAddressArray(result, address, address.building_number);
};

// Building name only
// Check format of Building Name (see note (a) above). If the Exception 
// Rule applies, the Building Name should appear at the beginning of the 
// first Thoroughfare line, or the first Locality line if there is no 
// Thoroughfare information.

// When a building has a name AND a number range, both must be held in the 
// Building Name field because the Building Number field can only hold numeric 
// characters.
// If an address has a building name with text followed by a space and then 
// completed by numerics/numeric ranges with the numeric part an exception 
// (see Note (a) above), the numerics/numeric range are treated as a building 
// number, and the text part is treated as the Building Name and the 
// numerics/numeric range are split off to appear at the beginning of the first 
// Thoroughfare line, or the first Locality line if there is no Thoroughfare.

const BUILDING_RANGE_REGEX = /^(\d.*\D.*\d|\d(.*\d)?[a-z]|[a-z])$/i;

const checkBuildingRange = building_name => {
	const name_split = building_name.split(" ");
	const last_elem = name_split.pop();
	if (last_elem.match(BUILDING_RANGE_REGEX)) {
		return {
			range: last_elem,
			actual_name: name_split.join(" ")
		};
	}
	return null;
};

const SUB_RANGE_REGEX = /^unit\s/i;

const rule3 = address => {
	let premise;
	const result = addLocalityAndThoroughfareElements(address);
	if (address.buildingNameException()) {
		premise = address.building_name.toLowerCase();
		result[result.length - 1] = premise + " " + result[result.length - 1];
	} else {
		const sub_range_match = checkBuildingRange(address.building_name);
		if (sub_range_match && !address.building_name.match(SUB_RANGE_REGEX)) { // Check if name contains number range
			premise = sub_range_match.actual_name + ", " + sub_range_match.range.toLowerCase();
			result[result.length - 1] = sub_range_match.range.toLowerCase() + " " + result[result.length - 1];
			result.push(sub_range_match.actual_name);
		} else {
			premise = address.building_name;
			result.push(premise);	
		}
	}
	return prepareAddressArray(result, address, premise);
};

// Building Name and Building Number
// The Building Name should appear on the line preceding the Thoroughfare 
// and/or Locality information. The Building Number should appear at the 
// beginning of the first Thoroughfare line. If there is no Thoroughfare 
// information then the Building Number should appear at the beginning of 
// the first Locality line.

const rule4 = address => {
	const result = addLocalityAndThoroughfareElements(address);
	const premise = address.building_name + ", " + address.building_number;
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	result.push(address.building_name);
	return prepareAddressArray(result, address, premise);
};


// Sub Building Name and Building Number
// The Sub Building Name should appear on the line preceding the Thoroughfare 
// and Locality information. The Building Number should appear at the beginning 
// of the first Thoroughfare line. If there is no Thoroughfare information then 
// the Building Number should appear at the beginning of the first Locality line. 

const STARTS_CHAR_REGEX = /^[a-z]$/i;

const rule5 = address => {
	let premise;
	const result = addLocalityAndThoroughfareElements(address);
	if (address.sub_building_name.match(STARTS_CHAR_REGEX)) {
		premise = address.building_number + address.sub_building_name;
		result[result.length - 1] = premise + " " + result[result.length - 1];	
	} else {
		premise = [address.sub_building_name, address.building_number].join(", ");
		result[result.length - 1] = address.building_number + " " + result[result.length - 1];
		result.push(address.sub_building_name);
	}
	return prepareAddressArray(result, address, premise);
};

// Sub Building name and building name
// Check the format of Sub Building Name (see Note (a) above). If the Exception 
// Rule applies, the Sub Building Name should appear on the same line as, and 
// before, the Building Name.
// Otherwise, the Sub Building Name should appear on a line preceding the Building 
// Name, Thoroughfare and Locality information
// Check format of Building Name (see note (a) above) If the Exception Rule applies, 
// the Building Name should appear at the beginning of the first Thoroughfare line, 
// or the first Locality line if there is no Thoroughfare information. Otherwise, the 
// Building Name should appear on a line preceding the Thoroughfare and Locality information.

const rule6 = address => {
	let premise;
	const result = addLocalityAndThoroughfareElements(address);
	if (address.subBuildingNameException()) {
		premise = address.sub_building_name + " " + address.building_name;
		result.push(premise);
	} else if (address.buildingNameException()) {
		premise = address.sub_building_name + ", " + address.building_name;
		result[result.length - 1] = address.building_name + " " + result[result.length - 1];
		result.push(address.sub_building_name);
	} else if (address.merge_sub_and_building) {
		premise = address.sub_building_name + ", " + address.building_name;
		result.push(premise);
	} else {
		premise = address.sub_building_name + ", " + address.building_name;
		result.push(address.building_name);
		result.push(address.sub_building_name);
	}
	return prepareAddressArray(result, address, premise);
};

// Sub building, building name and building number
// If the Exception Rule applies, the Sub Building Name should appear on the same 
// line as and before the Building Name.

const rule7 = address => {
	let result = addLocalityAndThoroughfareElements(address);
	let premise = ", " + address.building_number; 
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	if (address.subBuildingNameException()) {
		premise = address.sub_building_name + " " + address.building_name + premise;
		result.push(address.sub_building_name + " " + address.building_name);
	} else if (address.merge_sub_and_building) {
		premise = address.sub_building_name + ", " + address.building_name + premise;
		result.push(address.sub_building_name + ", " + address.building_name);
	} else {
		premise = address.sub_building_name + ", " + address.building_name + premise;
		result.push(address.building_name);
		result.push(address.sub_building_name);
	}
	return prepareAddressArray(result, address, premise);
};

// This rule should not exist as it is not listed in the developer docs. But some records 
// in the wild only have a sub building name

const weirdRule = address => {
	const premise = address.sub_building_name;
	const result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.sub_building_name + " " + result[result.length - 1];
	return prepareAddressArray(result, address, premise);
};

const po_box = address => {
	const result = addLocalityAndThoroughfareElements(address);
	const premise = "PO Box " + address.po_box;
	result.push(premise);
	return prepareAddressArray(result, address, premise);
};

const formatter = address => {
	const hasBuildingNumber = !isEmpty(address.building_number);
	const hasBuildingName = !isEmpty(address.building_name);
	const hasSubBuildingName = !isEmpty(address.sub_building_name);

	if (!isEmpty(address.po_box)) return po_box(address);

	if (hasSubBuildingName) { 
		if (hasBuildingName) {
			if (hasBuildingNumber) { 
				return rule7(address);					// Sub + Name + Number
			} else {
				return rule6(address);					// Sub + Name + ______
			}
		} else {
			if (hasBuildingNumber) {
				return rule5(address);					// Sub + ____ + Number
			} else {
				return weirdRule(address);			// Sub + ____ + ______
			}
		}
	} else { 
		if (hasBuildingName) {
			if (hasBuildingNumber) {
				return rule4(address);					// ___ + Name + Number
			} else {
				return rule3(address);					// ___ + Name + ______ 
			}
		} else {
			if (hasBuildingNumber) {
				return rule2(address);					// ___ + ____ + Number
			} else {
				return rule1(address);					// ___ + ____ + _____ 
			}
		}
	}
};

module.exports = {
	formatter,
	nameException,
};
