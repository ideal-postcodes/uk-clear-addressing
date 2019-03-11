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
  /**
   *
   *
   * @returns {undefined}
   */
};
