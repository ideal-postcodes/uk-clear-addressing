"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extract = (address, elem) => {
    const result = address[elem];
    if (result === undefined)
        return "";
    if (result === null)
        return "";
    if (typeof result !== "string")
        return String(result);
    if (result.trim().length === 0)
        return "";
    return result;
};
exports.extractInteger = (address, elem) => {
    const result = address[elem];
    if (result === undefined)
        return "";
    if (result === null)
        return "";
    if (typeof result !== "number")
        return parseInt(result, 10) || "";
    return result;
};
exports.isEmpty = (s) => {
    return !s || s.trim() === "";
};
exports.extractFloat = (address, elem) => {
    const result = address[elem];
    if (result === undefined)
        return "";
    if (result === null)
        return "";
    if (typeof result !== "number")
        return parseFloat(result) || "";
    return result;
};
exports.lastElem = (a) => a[a.length - 1];
exports.prependLocality = (localities, premise) => {
    localities[localities.length - 1] = `${premise} ${exports.lastElem(localities)}`;
};
