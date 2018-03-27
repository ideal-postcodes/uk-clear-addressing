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

/**
 * Non-desctructively return last elem
 */
const lastElem = array => array[array.length - 1];

const prependLocality = (localities, premise) => {
	localities[localities.length - 1] = `${premise} ${lastElem(localities)}`;
};

module.exports = {
	extract,
	isEmpty,
	lastElem,
	extractNumber,
	extractFloat,
	prependLocality,
};
