import { AddressRecord } from "./index";
import { AddressElements } from "./rules";

export type EmptyString = "";

export const extract = (address: AddressRecord, elem: keyof AddressRecord): string => {
	const result = address[elem];
	if (result === undefined) return "";
	if (result === null) return "";
	if (typeof result !== "string") return String(result);
	if (result.trim().length === 0) return "";
	return result;
};

export const extractInteger = (address: AddressRecord, elem: keyof AddressRecord): number|EmptyString => {
	const result = address[elem];
	if (result === undefined ) return "";
	if (result === null) return "";
	if (typeof result !== "number") return parseInt(result, 10) || "";
	return result;
};

export const isEmpty = (s: string): boolean => {
	return !s || s.trim() === "";
};

export const extractFloat = (address: AddressRecord, elem: keyof AddressRecord): number|EmptyString => {
	const result = address[elem];
	if (result === undefined ) return "";
	if (result === null) return "";
	if (typeof result !== "number") return parseFloat(result) || "";
	return result;
};

/**
 * Non-desctructively return last elem
 */
export const lastElem = (a: AddressElements): string => a[a.length - 1];

export const prependLocality = (localities: AddressElements, premise: string): void => {
	localities[localities.length - 1] = `${premise} ${lastElem(localities)}`;
};
