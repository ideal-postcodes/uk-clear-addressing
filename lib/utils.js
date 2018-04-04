"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extract = (address, elem) => {
    const result = address[elem];
    if (result === undefined)
        return "";
    if (result === null)
        return "";
    if (result.trim().length === 0)
        return "";
    return result;
};
exports.extractNumber = (address, elem) => {
    const result = address[elem];
    if (result === undefined)
        return "";
    if (result === null)
        return "";
    return result;
};
exports.isEmpty = s => !s || s.trim() === "";
exports.extractFloat = (address, elem) => parseFloat(address[elem]) || "";
exports.lastElem = array => array[array.length - 1];
exports.prependLocality = (localities, premise) => {
    localities[localities.length - 1] = `${premise} ${exports.lastElem(localities)}`;
};
