"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("./utils.js");
const notEmpty = a => !utils_js_1.isEmpty(a);
const nameExceptionRegex = /^(\d|\d.*\d|\d(.*\d)?[a-z]|[a-z])$/i;
exports.nameException = name => name.match(nameExceptionRegex) !== null;
exports.appendOrganisationInfo = (elems, address) => {
    const { department_name, organisation_name } = address;
    if (utils_js_1.isEmpty(organisation_name))
        return;
    if (notEmpty(department_name))
        elems.push(department_name);
    elems.push(organisation_name);
};
exports.combinePremise = (elems, address, premise) => {
    const premiseElements = elems.slice();
    exports.appendOrganisationInfo(premiseElements, address);
    const [line_1, line_2, ...line_3] = premiseElements.reverse();
    return {
        premise: premise || "",
        line_1: line_1 || "",
        line_2: line_2 || "",
        line_3: line_3.join(", "),
    };
};
const localityElements = [
    "dependant_locality",
    "double_dependant_locality",
    "thoroughfare",
    "dependant_thoroughfare",
];
exports.premiseLocalities = address => {
    return localityElements
        .map(elem => address[elem])
        .filter(notEmpty);
};
exports.rule1 = address => exports.combinePremise(exports.premiseLocalities(address), address, "");
exports.rule2 = address => {
    const { building_number } = address;
    const result = exports.premiseLocalities(address);
    utils_js_1.prependLocality(result, building_number);
    return exports.combinePremise(result, address, building_number);
};
const BUILDING_RANGE_REGEX = /^(\d.*\D.*\d|\d(.*\d)?[a-z]|[a-z])$/i;
exports.checkBuildingRange = building_name => {
    const name_split = building_name.split(" ");
    const last_elem = name_split.pop();
    if (last_elem.match(BUILDING_RANGE_REGEX)) {
        return {
            range: last_elem,
            actual_name: name_split.join(" ")
        };
    }
    return null;
};
const SUB_RANGE_REGEX = /^unit\s/i;
exports.rule3 = address => {
    const { building_name } = address;
    let premise;
    const result = exports.premiseLocalities(address);
    if (exports.nameException(building_name)) {
        premise = building_name.toLowerCase();
        utils_js_1.prependLocality(result, premise);
    }
    else {
        const sub_range_match = exports.checkBuildingRange(building_name);
        if (sub_range_match && !building_name.match(SUB_RANGE_REGEX)) {
            premise = `${sub_range_match.actual_name}, ${sub_range_match.range.toLowerCase()}`;
            utils_js_1.prependLocality(result, sub_range_match.range.toLowerCase());
            result.push(sub_range_match.actual_name);
        }
        else {
            premise = building_name;
            result.push(premise);
        }
    }
    return exports.combinePremise(result, address, premise);
};
exports.rule4 = address => {
    const { building_name, building_number } = address;
    const result = exports.premiseLocalities(address);
    const premise = `${building_name}, ${building_number}`;
    utils_js_1.prependLocality(result, building_number);
    result.push(building_name);
    return exports.combinePremise(result, address, premise);
};
const STARTS_CHAR_REGEX = /^[a-z]$/i;
exports.rule5 = address => {
    const { building_number, sub_building_name } = address;
    let premise;
    const result = exports.premiseLocalities(address);
    if (sub_building_name.match(STARTS_CHAR_REGEX)) {
        premise = building_number + sub_building_name;
        utils_js_1.prependLocality(result, premise);
    }
    else {
        premise = `${sub_building_name}, ${building_number}`;
        utils_js_1.prependLocality(result, building_number);
        result.push(sub_building_name);
    }
    return exports.combinePremise(result, address, premise);
};
exports.rule6 = address => {
    const { sub_building_name, building_name } = address;
    let premise;
    const result = exports.premiseLocalities(address);
    if (exports.nameException(sub_building_name)) {
        premise = `${sub_building_name} ${building_name}`;
        result.push(premise);
    }
    else if (exports.nameException(building_name)) {
        premise = `${sub_building_name}, ${building_name}`;
        utils_js_1.prependLocality(result, building_name);
        result.push(sub_building_name);
    }
    else if (address.merge_sub_and_building) {
        premise = `${sub_building_name}, ${building_name}`;
        result.push(premise);
    }
    else {
        premise = `${sub_building_name}, ${building_name}`;
        result.push(building_name);
        result.push(sub_building_name);
    }
    return exports.combinePremise(result, address, premise);
};
exports.rule7 = address => {
    const { building_name, building_number, sub_building_name } = address;
    let result = exports.premiseLocalities(address);
    let premise;
    utils_js_1.prependLocality(result, building_number);
    if (exports.nameException(sub_building_name)) {
        premise = `${sub_building_name} ${building_name}, ${building_number}`;
        result.push(`${sub_building_name} ${building_name}`);
    }
    else if (address.merge_sub_and_building) {
        result = exports.premiseLocalities(address);
        premise = `${sub_building_name}, ${building_name}`;
        result.push(premise);
    }
    else {
        premise = `${sub_building_name}, ${building_name}, ${building_number}`;
        result.push(building_name);
        result.push(sub_building_name);
    }
    return exports.combinePremise(result, address, premise);
};
exports.undocumentedRule = address => {
    const { sub_building_name } = address;
    const premise = sub_building_name;
    const result = exports.premiseLocalities(address);
    utils_js_1.prependLocality(result, sub_building_name);
    return exports.combinePremise(result, address, premise);
};
exports.po_box = address => {
    const result = exports.premiseLocalities(address);
    const premise = `PO Box ${address.po_box}`;
    result.push(premise);
    return exports.combinePremise(result, address, premise);
};
exports.formatter = address => {
    if (notEmpty(address.po_box))
        return exports.po_box(address);
    const number = notEmpty(address.building_number);
    const name = notEmpty(address.building_name);
    const sub = notEmpty(address.sub_building_name);
    if (sub === true && name === true && number === true)
        return exports.rule7(address);
    if (sub === true && name === true && number === false)
        return exports.rule6(address);
    if (sub === true && name === false && number === true)
        return exports.rule5(address);
    if (sub === true && name === false && number === false)
        return exports.undocumentedRule(address);
    if (sub === false && name === true && number === true)
        return exports.rule4(address);
    if (sub === false && name === true && number === false)
        return exports.rule3(address);
    if (sub === false && name === false && number === true)
        return exports.rule2(address);
    return exports.rule1(address);
};
