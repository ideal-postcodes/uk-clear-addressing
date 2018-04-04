export const extract = (address, elem) => {
	const result = address[elem];
	if (result === undefined) return "";
	if (result === null) return "";
	if (result.trim().length === 0) return "";
	return result;
};

export const extractNumber = (address, elem) => {
	const result = address[elem];
	if (result === undefined ) return "";
	if (result === null) return "";
	return result;
};

export const isEmpty = s => !s || s.trim() === "";

export const extractFloat = (address, elem) => parseFloat(address[elem]) || "";

/**
 * Non-desctructively return last elem
 */
export const lastElem = array => array[array.length - 1];

export const prependLocality = (localities, premise) => {
	localities[localities.length - 1] = `${premise} ${lastElem(localities)}`;
};
