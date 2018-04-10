"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = require("./rules");
const isNumeric = (i) => i === 46 || (i >= 48 && i <= 57);
const chunkify = (t) => {
    let result = [];
    let x = 0;
    let y = -1;
    let n = false;
    let i;
    let j;
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
const alphaNumSort = (a, b) => {
    const aa = chunkify(a.toLowerCase());
    const bb = chunkify(b.toLowerCase());
    for (let x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            const c = Number(aa[x]);
            const d = Number(bb[x]);
            if (c.toString() === aa[x] && b.toString() === bb[x]) {
                return c - d;
            }
            else {
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
    "po_box",
];
const extractIntegerAttribute = (a) => {
    if (rules_1.nameException(a.building_name))
        return a.building_name;
    if (rules_1.nameException(a.sub_building_name))
        return a.sub_building_name;
    return a.building_number;
};
exports.sort = (a, b) => {
    for (let i = 0; i < sortingElems.length; i++) {
        let addressAttribute = sortingElems[i];
        let elemA, elemB;
        if (addressAttribute === "building_number") {
            elemA = extractIntegerAttribute(a);
            elemB = extractIntegerAttribute(b);
        }
        else {
            elemA = a[addressAttribute];
            elemB = b[addressAttribute];
        }
        if (elemA === elemB)
            continue;
        return alphaNumSort(elemA, elemB);
    }
    return 0;
};
