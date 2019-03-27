import * as t from "./types";

export const extract = (
  address: t.AddressRecord,
  elem: keyof t.AddressRecord
): string => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "string") return String(result);
  if (result.trim().length === 0) return "";
  return result;
};

export const extractInteger: t.NumericExtractor = (address, elem) => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "number") return parseInt(result, 10) || "";
  return result;
};

export const isEmpty = (s: string): boolean => {
  return !s || s.trim() === "";
};

export const extractFloat: t.NumericExtractor = (address, elem) => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "number") return parseFloat(result) || "";
  return result;
};

/**
 * Non-desctructively return last elem
 */
export const lastElem = (a: t.AddressElements): string => a[a.length - 1];

export const prependLocality = (
  localities: t.AddressElements,
  premise: string
): void => {
  localities[localities.length - 1] = `${premise} ${lastElem(localities)}`;
};

// Valid unit prefixes
// [
//   "Back of",
//   "Block",
//   "Blocks",
//   "Building",
//   "Maisonette",
//   "Maisonettes",
//   "Rear of",
//   "Shop",
//   "Shops",
//   "Stall",
//   "Stalls",
//   "Suite",
//   "Suites",
//   "Unit",
//   "Units",
// ];

const unitPrefixRegex = /^(back\sof|block|blocks|building|maisonette|maisonettes|rear\sof|shop|shops|stall|stalls|suite|suites|unit|units)/gi;

/**
 * Test for whether a string begins with a unit prefix
 *
 * E.g. `Back of 10A` => true
 */
export const hasUnitPrefix = (e: string): boolean => {
  return e.match(unitPrefixRegex) !== null;
};
