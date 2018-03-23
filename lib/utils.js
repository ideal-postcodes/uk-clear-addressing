"use strict";

const nameExceptionRegex = /^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i;

// Exception Rule indicators:
// i) First and last characters of the Building Name are numeric (eg ‘1to1’ or ’100:1’)
// ii) First and penultimate characters are numeric, last character is alphabetic (eg 12A’)
// iii) Building Name has only one character (eg ‘A’)
const nameException = name => name.match(nameExceptionRegex) !== null;

const extract = (address, elem) => {
	const result = address[elem];
	if (result === undefined) return "";
	if (result === null) return "";
	if (result.trim().length === 0) return "";
	return result;
};

const extractNumber = (address, elem) => {
	const result = address[elem];
	if (result === undefined ) return "";
	if (result === null) return "";
	return result;
};

const isEmpty = s => !s || s.trim() === "";

module.exports = {
	extract,
	isEmpty,
	extractNumber,
	nameException,
};
