import { Address } from "./index";
import { nameException } from "./utils";
import { SortingElems } from "./types";
import { alphanum } from "@cablanchard/koelle-sort";

const sortingElems: ReadonlyArray<SortingElems> = [
  "building_number",
  "building_name",
  "sub_building_name",
  "organisation_name",
  "department_name",
  "po_box",
];

/**
 * Takes an `Address` instance and returns a building number, first checking for
 * name exceptions in building_name and sub_building_name fields
 */
const extractIntegerAttribute = (a: Address): string => {
  if (nameException(a.building_name)) return a.building_name;
  if (nameException(a.sub_building_name)) return a.sub_building_name;
  return a.building_number;
};

/**
 * Sorts `Address` objects based on the precedence outlined in `sortingElems`
 */
export const sort = (a: Address, b: Address): number => {
  for (const attr of sortingElems) {
    let A, B: string;
    if (attr === "building_number") {
      A = extractIntegerAttribute(a);
      B = extractIntegerAttribute(b);
    } else {
      A = a[attr];
      B = b[attr];
    }
    if (A === B) continue;
    return alphanum(A, B);
  }
  return 0;
};
