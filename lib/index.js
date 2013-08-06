var	S = require('string');

var AddressModel = function(address) {
	this.postcode = address['postcode'],
	this.post_town = address['post_town'],
	this.dependant_locality = address['dependant_locality'],
	this.double_dependant_locality = address['double_dependant_locality'],
	this.thoroughfare = address['thoroughfare'],
	this.dependant_thoroughfare = address['dependant_thoroughfare'],
	this.building_number = address['building_number'],
	this.building_name = address['building_name'],
	this.sub_building_name = address['sub_building_name'],
	this.po_box = address['po_box'],
	this.department_name = address['department_name'],
	this.organisation_name  = address['organisation_name'],
	this.udprn = address['udprn'],
	this.postcode_type = address['postcode_type'],
	this.su_organisation_indicator = address['su_organisation_indicator'],
	this.delivery_point_suffix = address['delivery_point_suffix'];
	if (this.building_number === "0") {
		this.building_number = ""
		this.merge_sub_and_building = true;
	} else {
		this.merge_sub_and_building = false;
	}
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
	var has_BuildingNumber = !S(this.building_number).isEmpty();
	var has_BuildingName = !S(this.building_name).isEmpty();
	var has_SubBuildingName = !S(this.sub_building_name).isEmpty();

	if (!S(this.po_box).isEmpty()) {
		return po_box(this);
	}

	if (has_SubBuildingName) { 
		if (has_BuildingName) {
			if (has_BuildingNumber) { // Sub and Building
				return rule7(this);
			} else {
				return rule6(this);
			}

		} else { // Sub, no building
			if (has_BuildingNumber) {
				return rule5(this);
			}
		}

	} else { // No sub building name
		if (has_BuildingName) {
			if (has_BuildingNumber) {
				return rule4(this);
			} else {
				return rule3(this);
			}

		} else { // No sub, no building
			if (has_BuildingNumber) {
				return rule2(this);
			} else {
				return rule1(this);
			}
		}
	}
}

var prepareAddressArray = function (address_array, address) {
	var result = {
		postcode: address.postcode,
		post_town: address.post_town
	};
	if (!S(address.organisation_name).isEmpty()) address_array.push(capitalize(address.organisation_name));
	var length = address_array.length;
	for (var line = 1; line <= 3; line += 1) {
		result["line_" + line.toString()] = address_array[length - line] || "";
	}
	return result;
}

var addLocalityAndThoroughfareElements = function (address) {
	result = [];
	if (!S(address.dependant_locality).isEmpty()) result.push(capitalize(address.dependant_locality));
	if (!S(address.double_dependant_locality).isEmpty()) result.push(capitalize(address.double_dependant_locality));
	if (!S(address.thoroughfare).isEmpty()) result.push(capitalize(address.thoroughfare));
	if (!S(address.dependant_thoroughfare).isEmpty()) result.push(capitalize(address.dependant_thoroughfare));
	return result;
}

// Organisation Name
var rule1 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	
	return prepareAddressArray(result, address);
}

// Building number only
var rule2 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	return prepareAddressArray(result, address);
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
	var result = addLocalityAndThoroughfareElements(address);
	if (address.buildingNameException()) {
		result[result.length - 1] = address.building_name.toLowerCase() + " " + result[result.length - 1];
	} else {
		var sub_range_match = checkBuildingRange(address.building_name);
		if (sub_range_match) { // Check if name contains number range
			result[result.length - 1] = sub_range_match.range.toLowerCase() + " " + result[result.length - 1];
			result.push(capitalize(sub_range_match.actual_name));	
		} else {
			result.push(capitalize(address.building_name));	
		}
	}
	return prepareAddressArray(result, address);
}

// Building Name and Building Number
// The Building Name should appear on the line preceding the Thoroughfare 
// and/or Locality information. The Building Number should appear at the 
// beginning of the first Thoroughfare line. If there is no Thoroughfare 
// information then the Building Number should appear at the beginning of 
// the first Locality line.

var rule4 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	result.push(capitalize(address.building_name));
	return prepareAddressArray(result, address);
}


// Sub Building Name and Building Number
// The Sub Building Name should appear on the line preceding the Thoroughfare 
// and Locality information. The Building Number should appear at the beginning 
// of the first Thoroughfare line. If there is no Thoroughfare information then 
// the Building Number should appear at the beginning of the first Locality line. 

var rule5 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	if (address.sub_building_name.match(/^[a-z]$/i)) {
		result[result.length - 1] = address.building_number + address.sub_building_name + " " + result[result.length - 1];	
	} else {
		result[result.length - 1] = address.building_number + " " + result[result.length - 1];
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address);
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
	var result = addLocalityAndThoroughfareElements(address);
	if (address.subBuildingNameException()) {
		result.push(address.sub_building_name + " " + capitalize(address.building_name))
	} else if (address.buildingNameException()) {
		result[result.length - 1] = capitalize(address.building_name) + " " + result[result.length - 1];
		result.push(capitalize(address.sub_building_name));
	} else if (address.merge_sub_and_building) {
		result.push(capitalize(address.sub_building_name) + ", " + capitalize(address.building_name));
	} else {
		result.push(capitalize(address.building_name));
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address);
}

// Sub building, building name and building number
// If the Exception Rule applies, the Sub Building Name should appear on the same 
// line as and before the Building Name.

var rule7 = function(address) {
	var result = addLocalityAndThoroughfareElements(address);
	result[result.length - 1] = address.building_number + " " + result[result.length - 1];
	if (address.subBuildingNameException()) {
		result.push(address.sub_building_name + " " + capitalize(address.building_name));
	} else if (address.merge_sub_and_building) {
		result.push(capitalize(address.sub_building_name) + ", " + capitalize(address.building_name));
	} else {
		result.push(capitalize(address.building_name));
		result.push(capitalize(address.sub_building_name));
	}
	return prepareAddressArray(result, address);
}

var po_box =  function (address) {
	var result = addLocalityAndThoroughfareElements(address);
	result.push("PO Box " + address.po_box);
	return prepareAddressArray(result, address);
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
