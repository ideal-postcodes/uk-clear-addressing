"use strict";

const {
	nameException,
} = require("./rules.js");


/**
 * Returns true if charCode is '.' or numeric
 */
const isNumeric = i => i === 46 || (i >= 48 && i <= 57);

/**
 * Breaks string into an array of continuous number or alphabetical strings
 */
const chunkify = t => {
  let result = [];
  let x = 0;
  let y = -1;
  let n = 0;
  let i; // Tracks charCode
  let j; // Tracks character

  i = (j = t.charAt(x++)).charCodeAt(0);
  while (i) {
    let m = isNumeric(i);
    if (m !== n) {
      result[++y] = "";
      n = m;
    }
    result[y] += j;
	  x += 1;
	  i = (j = t.charAt(x++)).charCodeAt(0);
  }
  return result;
};

/**
 * Sorts by number if strings numeric, otherwise performs standard string
 * comparison
 */
const alphaNumSort = (a, b) => {
  let aa = chunkify(a.toLowerCase());
  let bb = chunkify(b.toLowerCase());

  for (let x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      const c = Number(aa[x]);
      const d = Number(bb[x]);
      if (c.toString() === aa[x] && d.toString() === bb[x]) {
      	// Exit: Both strings numeric
        return c - d;
      } else {
      	// Exit: compare strings
      	return (aa[x] > bb[x]) ? 1 : -1;
      }
    }
  }
  return aa.length - bb.length;
};

const sortingElems = [
	"building_number",
	"building_name", 
	"sub_building_name",
	"organisation_name",
	"department_name",
	"po_box"
];

/**
 * Takes an address object and returns a building number, first checking for
 * name exceptions in building_name and sub_building_name fields
 */
const extractNumberAttribute = a => {
	if (nameException(a.building_name)) return a.building_name;
	if (nameException(a.sub_building_name)) return a.sub_building_name;
	return a.building_number;
};

/**
 * Sorts `Address` objects based on the precedence outlined in `sortingElems`
 */
const sort = (a, b) => {
	for (let i = 0; i < sortingElems.length; i++) {
		let addressAttribute = sortingElems[i];
		let elemA, elemB;
		if (addressAttribute === "building_number") {
			elemA = extractNumberAttribute(a);
			elemB = extractNumberAttribute(b);
		} else {
			elemA = a[addressAttribute];
			elemB = b[addressAttribute];
		}
		if (elemA === elemB) continue;
		return alphaNumSort(elemA, elemB);
	}
	return 0;
};

module.exports = { sort };
