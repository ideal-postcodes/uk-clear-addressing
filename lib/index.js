function extract (address, elem) {
	var result = address[elem];
	if (result === undefined || result === null) return "";
	if (result.trim().length === 0) return "";
	return result;
}

function extractNumber (address, elem) {
	var result = address[elem];
	if (result === undefined || result === null) return "";
	return result;
}

function isEmpty (string) {
	return !string || string.trim() === "";
}

var AddressModel = function(address) {
	this.postcode = address.postcode;
	this.udprn = address.udprn;
	this.post_town = extract(address, "post_town");
	this.dependant_locality = extract(address, "dependant_locality");
	this.double_dependant_locality = extract(address, "double_dependant_locality");
	this.thoroughfare = extract(address, "thoroughfare");
	this.dependant_thoroughfare = extract(address, "dependant_thoroughfare");
	this.building_number = extract(address, "building_number");
	this.building_name = extract(address, "building_name");
	this.sub_building_name = extract(address, "sub_building_name");
	this.po_box = extractNumber(address, "po_box");
	this.department_name = extract(address, "department_name");
	this.organisation_name = extract(address, "organisation_name");
	this.postcode_type = extract(address, "postcode_type");
	this.su_organisation_indicator = extract(address, "su_organisation_indicator");
	this.delivery_point_suffix = extract(address, "delivery_point_suffix");
	this.northings = extractNumber(address, "northings");
	this.eastings = extractNumber(address, "eastings");
	this.longitude = parseFloat(address.longitude) ? parseFloat(address.longitude) : "";
	this.latitude = parseFloat(address.latitude) ? parseFloat(address.latitude) : "";
	this.county = extract(address, "county");
	this.district = extract(address, "district");
	this.ward = extract(address, "ward");
	this.country = extract(address, "country");

	if (this.postcode) {
		this.postcode_outward = address.postcode.split(" ")[0];
		this.postcode_inward = address.postcode.split(" ")[1];
	} else {
		this.postcode_outward = "";
		this.postcode_inward = "";
	}

	if (this.building_number === "0") {
		this.building_number = "";
		this.merge_sub_and_building = true;
	} else {
		this.merge_sub_and_building = false;
	}

	this.formattedAddressCache = null;
};

// Exception Rule indicators:
// i) First and last characters of the Building Name are numeric (eg ‘1to1’ or ’100:1’)
// ii) First and penultimate characters are numeric, last character is alphabetic (eg 12A’)
// iii) Building Name has only one character (eg ‘A’)

var nameException = function (name) {
	return !!(name.match(/^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i));
}

AddressModel.prototype.buildingNameException = function () {
	return nameException(this.building_name);
}

AddressModel.prototype.subBuildingNameException = function () {
	return nameException(this.sub_building_name);
}

AddressModel.prototype.formattedAddress = function() {
	if (this.formattedAddressCache) {
		return this.formattedAddressCache;
	}

	var has_BuildingNumber = !isEmpty(this.building_number);
	var has_BuildingName = !isEmpty(this.building_name);
	var has_SubBuildingName = !isEmpty(this.sub_building_name);

	if (!isEmpty(this.po_box)) {
		return po_box(this);
	}

	if (has_SubBuildingName) { 

		if (has_BuildingName) {
			if (has_BuildingNumber) { 
				result = rule7(this);					// Sub + Name + Number
			} else {
				result = rule6(this);					// Sub + Name + ______
			}
		} else {
			if (has_BuildingNumber) {
				result = rule5(this);					// Sub + ____ + Number
			} else {
				result = weirdRule(this);			// Sub + ____ + ______
			}
		}

	} else { 

		if (has_BuildingName) {
			if (has_BuildingNumber) {
				result = rule4(this);					// ___ + Name + Number
			} else {
				result = rule3(this);					// ___ + Name + ______ 
			}
		} else {
			if (has_BuildingNumber) {
				result = rule2(this);					// ___ + ____ + Number
			} else {
				result = rule1(this);					// ___ + ____ + _____ 
			}
		}
	}

	//cache result
	this.formattedAddressCache = result;
	return result;
}

var prepareAddressArray = function (address_array, address, premise) {
	var result = {
		postcode: address.postcode,
		post_town: address.post_town
	};

	if (typeof premise === "string") {
		result.premise = premise;
	}

	if (!isEmpty(address.organisation_name)) {
		if (!isEmpty(address.department_name)) {
			address_array.push(capitalize(address.department_name));
		}
		address_array.push(capitalize(address.organisation_name));
	}
	var length = address_array.length;
	result.line_1 = "";
	result.line_2 = "";
	result.line_3 = "";
	address_array.reverse();
	for (var line = 0; line < length; line += 1) {
		if (line < 3) {
			result["line_" + (line + 1).toString()] = address_array[line];
		} else {
			result.line_3 += (", " + address_array[line]);
		}
	}
	return result;
};

var addLocalityAndThoroughfareElements = function (address) {
	result = [];
	if (!isEmpty(address.dependant_locality)) result.push(capitalize(address.dependant_locality));
	if (!isEmpty(address.double_dependant_locality)) result.push(capitalize(address.double_dependant_locality));
	if (!isEmpty(address.thoroughfare)) result.push(capitalize(address.thoroughfare));
	if (!isEmpty(address.dependant_thoroughfare)) result.push(capitalize(address.dependant_thoroughfare));
	return result;
}

// Organisation Name
var rule1 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	
	return prepareAddressArray(result, address, "");
}

// Building number only
var rule2 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	return prepareAddressArray(result, address, address.building_number);
}


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

var checkBuildingRange = function (building_name) {
	var name_split = building_name.split(" ");
	var last_elem = name_split.pop();
	if (last_elem.match(/^(\d.*\D.*\d|\d(.*\d)?[a-z]|[a-z])$/i)) {
		return {
			range: last_elem,
			actual_name: name_split.join(" ")
		}
	}
	return null
}

var rule3 = function(address) {
	var premise;
	var result = addLocalityAndThoroughfareElements(address);
	if (address.buildingNameException()) {
		premise = address.building_name.toLowerCase();
		result[result.length - 1] = premise + " " + result[result.length - 1];
	} else {
		var sub_range_match = checkBuildingRange(address.building_name);
		if (sub_range_match) { // Check if name contains number range
			premise = capitalize(sub_range_match.actual_name) + ", " + sub_range_match.range.toLowerCase();
			result[result.length - 1] = sub_range_match.range.toLowerCase() + " " + result[result.length - 1];
			result.push(capitalize(sub_range_match.actual_name));	
		} else {
			premise = capitalize(address.building_name);
			result.push(premise);	
		}
	}
	return prepareAddressArray(result, address, premise);
}

// Building Name and Building Number
// The Building Name should appear on the line preceding the Thoroughfare 
// and/or Locality information. The Building Number should appear at the 
// beginning of the first Thoroughfare line. If there is no Thoroughfare 
// information then the Building Number should appear at the beginning of 
// the first Locality line.

var rule4 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	var premise = capitalize(address.building_name) + ", " + address.building_number;
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	result.push(capitalize(address.building_name));
	return prepareAddressArray(result, address, premise);
}


// Sub Building Name and Building Number
// The Sub Building Name should appear on the line preceding the Thoroughfare 
// and Locality information. The Building Number should appear at the beginning 
// of the first Thoroughfare line. If there is no Thoroughfare information then 
// the Building Number should appear at the beginning of the first Locality line. 

var rule5 = function(address) {
	var premise;
	var result = addLocalityAndThoroughfareElements(address);
	if (address.sub_building_name.match(/^[a-z]$/i)) {
		premise = address.building_number + address.sub_building_name;
		result[result.length - 1] = premise + " " + result[result.length - 1];	
	} else {
		premise = [capitalize(address.sub_building_name), address.building_number].join(", ");
		result[result.length - 1] = address.building_number + " " + result[result.length - 1];
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address, premise);
}

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

var rule6 = function(address) {
	var premise;
	var result = addLocalityAndThoroughfareElements(address);
	if (address.subBuildingNameException()) {
		premise = address.sub_building_name + " " + capitalize(address.building_name);
		result.push(premise);
	} else if (address.buildingNameException()) {
		premise = capitalize(address.sub_building_name) + ", " + capitalize(address.building_name);
		result[result.length - 1] = capitalize(address.building_name) + " " + result[result.length - 1];
		result.push(capitalize(address.sub_building_name));
	} else if (address.merge_sub_and_building) {
		premise = capitalize(address.sub_building_name) + ", " + capitalize(address.building_name);
		result.push(premise);
	} else {
		premise = capitalize(address.sub_building_name) + ", " + capitalize(address.building_name);
		result.push(capitalize(address.building_name));
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address, premise);
}

// Sub building, building name and building number
// If the Exception Rule applies, the Sub Building Name should appear on the same 
// line as and before the Building Name.

var rule7 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	var premise = ", " + address.building_number; 
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	if (address.subBuildingNameException()) {
		premise = address.sub_building_name + " " + capitalize(address.building_name) + premise;
		result.push(address.sub_building_name + " " + capitalize(address.building_name));
	} else if (address.merge_sub_and_building) {
		premise = capitalize(address.sub_building_name) + ", " + capitalize(address.building_name) + premise;
		result.push(capitalize(address.sub_building_name) + ", " + capitalize(address.building_name));
	} else {
		premise = capitalize(address.sub_building_name) + ", " + capitalize(address.building_name) + premise;
		result.push(capitalize(address.building_name));
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address, premise);
}

// This rule should not exist as it is not listed in the developer docs. But some records 
// in the wild only have a sub building name

var weirdRule = function(address) {
	var premise = address.sub_building_name;
	var result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.sub_building_name + " " + result[result.length - 1];
	return prepareAddressArray(result, address, premise);
};

var po_box =  function (address) {
	var premise;
	var result = addLocalityAndThoroughfareElements(address);
	premise = "PO Box " + address.po_box;
	result.push(premise);
	return prepareAddressArray(result, address, premise);
}

var capitalize = function(phrase) {
	return phrase.toLowerCase().replace(/^\w|\s\w|\W\w(?!\s)/g, function (match) {
		return match.toUpperCase();
	});
}

var capitalizeSurname = function(name) {
	return S(name).between("(", ")").capitalize().ensureLeft("(").ensureRight(")").s; 
}

AddressModel.formatPostcode = function(postcode) {
	return postcode.toString().toUpperCase().replace(/\s/g,"").replace(/%20/g,"");
}

module.exports = AddressModel;
