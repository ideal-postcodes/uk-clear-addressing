import { Address } from "./index";
import { nameException } from "./utils";
import { SortingElems } from "./types";
import { alphanum } from "@cablanchard/koelle-sort";

/**
 * Minimum sortable address shape
 */
export type SortableAddress = Pick<
  Address,
  | "building_number"
  | "building_name"
  | "sub_building_name"
  | "organisation_name"
  | "department_name"
  | "po_box"
>;

/**
 * Determines the sort order of `sort`
 */
export const sortingElems: Array<SortingElems> = [
  "building_number",
  "building_name",
  "sub_building_name",
  "organisation_name",
  "department_name",
  "po_box",
];

/**
 * Takes a `SortableAddress` and returns a building number, first checking for
 * name exceptions in building_name and sub_building_name fields
 */
const extractIntegerAttribute = (a: SortableAddress): string => {
  if (nameException(a.building_name)) return a.building_name;
  if (nameException(a.sub_building_name)) return a.sub_building_name;
  return a.building_number;
};

/**
 * Sorts addresses based on the precedence outlined in `sortingElems`
 */
export const sort = (a: SortableAddress, b: SortableAddress): number => {
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
