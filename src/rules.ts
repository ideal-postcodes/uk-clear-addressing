import { AddressFormatter } from "./types";
import {
  formatElem,
  notEmpty,
  combinePremise,
  nameException,
  checkBuildingRange,
  prependLocality,
  premiseLocalities,
  hasUnitPrefix,
} from "./utils";

/**
 * Rule 1 - No building name, number or sub building name
 * No premise elements detected (typically organisation name)
 */
export const rule1: AddressFormatter = (address) =>
  combinePremise(premiseLocalities(address), address, "", "", "");

/**
 * Rule 2 - Building number only
 */
export const rule2: AddressFormatter = (address) => {
  const { building_number } = address;
  const result = premiseLocalities(address);
  prependLocality(result, building_number);
  return combinePremise(result, address, building_number, building_number, "");
};

/**
 * Rule 3 - Building name only
 *
 * Check format of Building Name (see note (a) above). If the Exception
 * Rule applies, the Building Name should appear at the beginning of the
 * first Thoroughfare line, or the first Locality line if there is no
 * Thoroughfare information.
 *
 * When a building has a name AND a number range, both must be held in the
 * Building Name field because the Building Number field can only hold numeric
 * characters.
 *
 * If an address has a building name with text followed by a space and then
 * completed by numerics/numeric ranges with the numeric part an exception
 * (see Note (a) above), the numerics/numeric range are treated as a building
 * number, and the text part is treated as the Building Name and the
 * numerics/numeric range are split off to appear at the beginning of the first
 * Thoroughfare line, or the first Locality line if there is no Thoroughfare.
 */
export const rule3: AddressFormatter = (address) => {
  const { building_name } = address;
  let premise;
  let number = "";
  const result = premiseLocalities(address);
  if (nameException(building_name)) {
    premise = building_name;
    number = building_name;
    prependLocality(result, formatElem(premise));
  } else {
    const sub_range_match = checkBuildingRange(building_name);
    if (sub_range_match && !hasUnitPrefix(building_name)) {
      // Check if name contains number range
      premise = `${sub_range_match.name}, ${sub_range_match.range}`;
      number = sub_range_match.range;
      prependLocality(result, sub_range_match.range);
      result.push(sub_range_match.name);
    } else {
      premise = building_name;
      result.push(premise);
    }
  }
  return combinePremise(result, address, premise, number, "");
};

// Building Name and Building Number

/**
 * Rule 4 - Building Name and Number
 *
 * The Building Name should appear on the line preceding the Thoroughfare
 * and/or Locality information. The Building Number should appear at the
 * beginning of the first Thoroughfare line. If there is no Thoroughfare
 * information then the Building Number should appear at the beginning of
 * the first Locality line.
 */
export const rule4: AddressFormatter = (address) => {
  const { building_name, building_number } = address;
  const result = premiseLocalities(address);
  prependLocality(result, building_number);
  result.push(building_name);
  return combinePremise(
    result,
    address,
    `${building_name}, ${building_number}`,
    building_number,
    ""
  );
};

const STARTS_CHAR_REGEX = /^[a-z]$/i;

/**
 * Rule 5 - Sub Building Name and Building Number
 *
 * The Sub Building Name should appear on the line preceding the Thoroughfare
 * and Locality information. The Building Number should appear at the beginning
 * of the first Thoroughfare line. If there is no Thoroughfare information then
 * the Building Number should appear at the beginning of the first Locality line.
 */
export const rule5: AddressFormatter = (address) => {
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
  return combinePremise(
    result,
    address,
    premise,
    building_number,
    sub_building_name
  );
};

/**
 * Rule 6 - Sub building name and building name
 *
 * Check the format of Sub Building Name (see Note (a) above). If the Exception
 * Rule applies, the Sub Building Name should appear on the same line as, and
 * before, the Building Name.
 *
 * Otherwise, the Sub Building Name should appear on a line preceding the Building
 * Name, Thoroughfare and Locality information
 *
 * Check format of Building Name (see note (a) above) If the Exception Rule applies,
 * the Building Name should appear at the beginning of the first Thoroughfare line,
 * or the first Locality line if there is no Thoroughfare information. Otherwise, the
 * Building Name should appear on a line preceding the Thoroughfare and Locality information.
 */
export const rule6: AddressFormatter = (address) => {
  const { sub_building_name, building_name } = address;
  let premise;
  let number = "";
  const result = premiseLocalities(address);
  const sub_range_match = checkBuildingRange(building_name);
  if (nameException(building_name)) {
    premise = `${sub_building_name}, ${building_name}`;
    number = building_name;
    prependLocality(result, building_name);
    result.push(sub_building_name);
  } else if (sub_range_match && !hasUnitPrefix(building_name)) {
    // Check if name contains number range
    premise = `${sub_building_name}, ${sub_range_match.name}, ${sub_range_match.range}`;
    prependLocality(result, sub_range_match.range);
    number = sub_range_match.range;
    if (nameException(sub_building_name)) {
      result.push(`${formatElem(sub_building_name)} ${sub_range_match.name}`);
    } else {
      result.push(sub_range_match.name);
      result.push(address.sub_building_name);
    }
  } else if (nameException(sub_building_name)) {
    premise = `${formatElem(sub_building_name)} ${building_name}`;
    result.push(premise);
  } else if (address.merge_sub_and_building) {
    premise = `${sub_building_name}, ${building_name}`;
    result.push(premise);
  } else {
    premise = `${sub_building_name}, ${building_name}`;
    result.push(building_name);
    result.push(sub_building_name);
  }
  return combinePremise(result, address, premise, number, sub_building_name);
};

/**
 * Rule 7 - Sub building name, building name and building number
 *
 * If the Exception Rule applies, the Sub Building Name should appear on the same
 * line as and before the Building Name.
 */
export const rule7: AddressFormatter = (address) => {
  const { building_name, building_number, sub_building_name } = address;
  let result = premiseLocalities(address);
  let premise;
  prependLocality(result, building_number);
  if (nameException(sub_building_name)) {
    premise = `${formatElem(
      sub_building_name
    )} ${building_name}, ${building_number}`;
    result.push(`${formatElem(sub_building_name)} ${building_name}`);
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
  return combinePremise(
    result,
    address,
    premise,
    building_number,
    sub_building_name
  );
};

/**
 * Undocumented Rule
 *
 * This rule should not exist as it is not listed in the developer docs. But some records
 * in the wild only have a sub building name
 */
export const undocumentedRule: AddressFormatter = (address) => {
  const { sub_building_name } = address;
  const premise = sub_building_name;
  const result = premiseLocalities(address);
  prependLocality(result, sub_building_name);
  return combinePremise(result, address, premise, "", sub_building_name);
};

/**
 * PO Box Rule
 */
export const po_box: AddressFormatter = (address) => {
  const result = premiseLocalities(address);
  const premise = `PO Box ${address.po_box}`;
  result.push(premise);
  return combinePremise(result, address, premise, "", "");
};

/* tslint:disable:no-boolean-literal-compare */
export const formatter: AddressFormatter = (address) => {
  if (notEmpty(address.po_box)) return po_box(address);

  const no = notEmpty(address.building_number); // Has building number
  const name = notEmpty(address.building_name); // Has building name
  const sub = notEmpty(address.sub_building_name); // Has sub building name

  if (sub === true && name === true && no === true) return rule7(address);
  if (sub === true && name === true && no === false) return rule6(address);
  if (sub === true && name === false && no === true) return rule5(address);
  if (sub === true && name === false && no === false)
    return undocumentedRule(address);
  if (sub === false && name === true && no === true) return rule4(address);
  if (sub === false && name === true && no === false) return rule3(address);
  if (sub === false && name === false && no === true) return rule2(address);
  return rule1(address); // No premise elements available
};
/* tslint:enable:no-boolean-literal-compare */
