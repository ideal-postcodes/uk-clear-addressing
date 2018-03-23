"use strict";

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

const extractFloat = (address, elem) => parseFloat(address[elem]) || "";

module.exports = {
	extract,
	isEmpty,
	extractNumber,
	extractFloat,
};
