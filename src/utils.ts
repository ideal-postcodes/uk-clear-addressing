import {
  AddressRecord,
  FormattedPremise,
  LocalityElements,
  NumericExtractor,
  AddressElements,
  BuildingRangeMatch,
} from "./types";
import { Address } from "./index";

export const extract = (
  address: AddressRecord,
  elem: keyof AddressRecord
): string => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "string") return String(result);
  if (result.trim().length === 0) return "";
  return result;
};

export const extractInteger: NumericExtractor = (address, elem) => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "number") return parseInt(result, 10) || "";
  return result;
};

export const isEmpty = (s: string): boolean => {
  return !s || s.trim() === "";
};

export const extractFloat: NumericExtractor = (address, elem) => {
  const result = address[elem];
  if (result === undefined) return "";
  if (result === null) return "";
  if (typeof result !== "number") return parseFloat(result) || "";
  return result;
};

/**
 * Non-desctructively return last elem
 */
export const lastElem = (a: AddressElements): string => a[a.length - 1];

export const prependLocality = (
  localities: AddressElements,
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

const unitPrefixRegex = /^(back\sof|blocks?|building|maisonettes?|rear\sof|shops?|stalls?|suites?|units?)/i;

/**
 * Test for whether a string begins with a unit prefix
 *
 * E.g. `Back of 10A` => true
 */
export const hasUnitPrefix = (e: string): boolean => {
  return e.match(unitPrefixRegex) !== null;
};

export const notEmpty = (a: string): boolean => !isEmpty(a);

const nameExceptionRegex = /^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i;

/**
 * Exception Rule indicators:
 * i) First and last characters of the Building Name are numeric (eg ‘1to1’ or ’100:1’)
 * ii) First and penultimate characters are numeric, last character is alphabetic (eg 12A’)
 * iii) Building Name has only one character (eg ‘A’)
 */
export const nameException = (n: string): boolean => {
  return n.match(nameExceptionRegex) !== null;
};

const singleCharacterRegex = /^[A-Z]$/i;

/**
 * Returns true if string matches rule (iii) of exception rule (above)
 */
export const isSingleCharacter = (c: string): boolean =>
  c.match(singleCharacterRegex) !== null;

const BUILDING_RANGE_REGEX = /^(\d.*\D.*\d|\d(.*\d)?[a-z]|[a-z])$/i;

export const appendOrganisationInfo = (
  elems: AddressElements,
  address: Address
): void => {
  const { department_name, organisation_name } = address;
  if (isEmpty(organisation_name)) return;
  if (notEmpty(department_name)) elems.push(department_name);
  elems.push(organisation_name);
};

/**
 * Merges premise elements ordered by precedence into a formatted address
 */
export const combinePremise = (
  elems: AddressElements,
  address: Address,
  premise: string,
  number: string,
  unit: string
): FormattedPremise => {
  const premiseElements = elems.slice();
  appendOrganisationInfo(premiseElements, address);
  const [line_1, line_2, ...line_3] = premiseElements.reverse();
  return {
    premise,
    number,
    unit,
    line_1: line_1 || "",
    line_2: line_2 || "",
    line_3: line_3.join(", "),
  };
};

/**
 * Detects whether a building name contains a range
 */
export const checkBuildingRange = (
  building_name: string
): BuildingRangeMatch | void => {
  const tokens = building_name.split(" ");
  const range = tokens.pop() || "";
  if (range.match(BUILDING_RANGE_REGEX)) {
    return {
      range,
      name: tokens.join(" "),
    };
  }
};

const localityElements: LocalityElements[] = [
  "dependant_locality",
  "double_dependant_locality",
  "thoroughfare",
  "dependant_thoroughfare",
];

/**
 * Returns an array of localities according to precedent recorded in
 * `localityElements`
 */
export const premiseLocalities = (address: Address): AddressElements => {
  return localityElements.map((elem) => address[elem]).filter(notEmpty);
};

/**
 * Formats an address element
 * - If a single letter element, suffix a comma
 * - Otherwise return address element
 */
export const formatElem = (e: string): string => {
  if (isSingleCharacter(e)) return `${e},`;
  return e;
};
