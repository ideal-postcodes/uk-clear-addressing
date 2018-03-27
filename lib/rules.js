"use strict";

const { isEmpty, prependLocality } = require("./utils.js");
const notEmpty = a => !isEmpty(a);

const nameExceptionRegex = /^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i;
/**
 * Exception Rule indicators:
 * i) First and last characters of the Building Name are numeric (eg ‘1to1’ or ’100:1’)
 * ii) First and penultimate characters are numeric, last character is alphabetic (eg 12A’)
 * iii) Building Name has only one character (eg ‘A’)
 */
const nameException = name => name.match(nameExceptionRegex) !== null;

const appendOrganisationInfo = (premiseElements, address) => {
	if (notEmpty(address.organisation_name)) {
		if (notEmpty(address.department_name)) {
			premiseElements.push(address.department_name);
		}
		premiseElements.push(address.organisation_name);
	}
};

/**
 * Merges premise elements ordered by precedence into a formatted address
 * object
 */
const combinePremise = (elems, address, premise) => {
	const premiseElements = elems.slice();
	appendOrganisationInfo(premiseElements, address);
	const [line_1, line_2, ...line_3] = premiseElements.reverse();
	return {
		premise: premise || "",
		line_1: line_1 || "",
		line_2: line_2 || "",
		line_3: line_3.join(", "),
	};	
};

const localityElements = [
	"dependant_locality",
	"double_dependant_locality",
	"thoroughfare",
	"dependant_thoroughfare",
];

/**
 * Returns an array of localities according to precedent recorded in
 * `localityElements`
 */
const premiseLocalities = address => {
	return localityElements
		.map(elem => address[elem])
		.filter(notEmpty);
};

// Organisation Name
const rule1 = address => combinePremise(premiseLocalities(address), address);

/**
 * When Building Number Only: Attach number to lowest level locality
 */
const rule2 = address => {
	const { building_number } = address;
	const result = premiseLocalities(address);
	prependLocality(result, building_number);
	return combinePremise(result, address, building_number);
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

/**
 * Detects whether a building name contains a range
 */
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
	const { building_name } = address;
	let premise;
	const result = premiseLocalities(address);
	if (nameException(building_name)) {
		premise = building_name.toLowerCase();
		prependLocality(result, premise);
	} else {
		const sub_range_match = checkBuildingRange(building_name);
		if (sub_range_match && !building_name.match(SUB_RANGE_REGEX)) { // Check if name contains number range
			premise = `${sub_range_match.actual_name}, ${sub_range_match.range.toLowerCase()}`;
			prependLocality(result, sub_range_match.range.toLowerCase());
			result.push(sub_range_match.actual_name);
		} else {
			premise = building_name;
			result.push(premise);	
		}
	}
	return combinePremise(result, address, premise);
};

// Building Name and Building Number
// The Building Name should appear on the line preceding the Thoroughfare 
// and/or Locality information. The Building Number should appear at the 
// beginning of the first Thoroughfare line. If there is no Thoroughfare 
// information then the Building Number should appear at the beginning of 
// the first Locality line.

const rule4 = address => {
	const { building_name, building_number } = address;
	const result = premiseLocalities(address);
	const premise = `${building_name}, ${building_number}`;
	prependLocality(result, building_number);
	result.push(building_name);
	return combinePremise(result, address, premise);
};


// Sub Building Name and Building Number
// The Sub Building Name should appear on the line preceding the Thoroughfare 
// and Locality information. The Building Number should appear at the beginning 
// of the first Thoroughfare line. If there is no Thoroughfare information then 
// the Building Number should appear at the beginning of the first Locality line. 

const STARTS_CHAR_REGEX = /^[a-z]$/i;

const rule5 = address => {
	const { building_number, sub_building_name } = address;
	let premise;
	const result = premiseLocalities(address);
	if (sub_building_name.match(STARTS_CHAR_REGEX)) {
		premise = building_number + sub_building_name;
		prependLocality(result, premise);
	} else {
		premise = `${sub_building_name}, ${building_number}`;
		prependLocality(result, building_number);
		result.push(sub_building_name);
	}
	return combinePremise(result, address, premise);
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
	const { sub_building_name, building_name } = address;
	let premise;
	const result = premiseLocalities(address);
	if (nameException(sub_building_name)) {
		premise = `${sub_building_name} ${building_name}`;
		result.push(premise);
	} else if (nameException(building_name)) {
		premise = `${sub_building_name}, ${building_name}`;
		prependLocality(result, building_name);
		result.push(sub_building_name);
	} else if (address.merge_sub_and_building) {
		premise = `${sub_building_name}, ${building_name}`;
		result.push(premise);
	} else {
		premise = `${sub_building_name}, ${building_name}`;
		result.push(building_name);
		result.push(sub_building_name);
	}
	return combinePremise(result, address, premise);
};

// Sub building, building name and building number
// If the Exception Rule applies, the Sub Building Name should appear on the same 
// line as and before the Building Name.
const rule7 = address => {
	const { building_name, building_number, sub_building_name } = address;
	let result = premiseLocalities(address);
	let premise; 
	prependLocality(result, building_number);
	if (nameException(sub_building_name)) {
		premise = `${sub_building_name} ${building_name}, ${building_number}`;
		result.push(`${sub_building_name} ${building_name}`);
	} else if (address.merge_sub_and_building) {
		// Should not be possible to hit this code path if address object has
		// been parsed correctly
		result = premiseLocalities(address);
		premise = `${sub_building_name}, ${building_name}`;
		result.push(premise);
	} else {
		premise = `${sub_building_name}, ${building_name}, ${building_number}`;
		result.push(building_name);
		result.push(sub_building_name);
	}
	return combinePremise(result, address, premise);
};

// This rule should not exist as it is not listed in the developer docs. But some records 
// in the wild only have a sub building name

const undocumentedRule = address => {
	const { sub_building_name } = address;
	const premise = sub_building_name;
	const result = premiseLocalities(address);
	prependLocality(result, sub_building_name);
	return combinePremise(result, address, premise);
};

const po_box = address => {
	const result = premiseLocalities(address);
	const premise = `PO Box ${address.po_box}`;
	result.push(premise);
	return combinePremise(result, address, premise);
};

const formatter = address => {
	if (notEmpty(address.po_box)) return po_box(address);

	const number = notEmpty(address.building_number);
	const name = notEmpty(address.building_name);
	const sub = notEmpty(address.sub_building_name);
	if (sub === true  && name === true  && number === true ) return rule7(address);
	if (sub === true  && name === true  && number === false) return rule6(address);
	if (sub === true  && name === false && number === true ) return rule5(address);
	if (sub === true  && name === false && number === false) return undocumentedRule(address);
	if (sub === false && name === true  && number === true ) return rule4(address);
	if (sub === false && name === true  && number === false) return rule3(address);
	if (sub === false && name === false && number === true ) return rule2(address);
	return rule1(address); // No premise elements available
};

module.exports = {
	formatter,
	po_box,
	rule1,
	rule2,
	rule3,
	rule4,
	rule5,
	rule6,
	rule7,
	undocumentedRule,
	nameException,
	combinePremise,
	premiseLocalities,
	appendOrganisationInfo,
	checkBuildingRange,
	prependLocality,
};
