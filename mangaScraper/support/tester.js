export class Tester {
    static dicts(template, actual, prefix = "", suffix = "") {
        /**
         * Validates that all required keys in the template object exist in the actual object
         * and checks if the values in the actual object match the specified types in the template.
         *
         * @param {Object} template - The template object with required keys and their expected types.
         * @param {Object} actual - The actual object to test against the template.
         * @returns {Object} - An object containing missing or type-mismatched keys (if any), or null if valid.
         */

        let issues = {};

        for (let key in template) {
            if (!(key in actual)) {
                issues[key] = `Key '${key}' is missing`;
                continue;
            }

            let expected = template[key];
            
            if (typeof expected === "string" || Array.isArray(expected) === true) {
                expected = {type : expected};
            }

            let { type, empty, full } = expected;
            if(Array.isArray(type) === false) {
                type = [type];
            }
            if (!isTypes(actual[key], type)) {
                issues[key] = `Key '${key}' is expected to be of type/s (${JSON.stringify(type).slice(1, -1)}), but got '${getType(actual[key])}'`;
            } else {
                if (empty === false && !actual[key]) {
                    issues[key] = `Key '${key}' cannot be empty`;
                } else if (empty === true && actual[key]) {
                    issues[key] = `Key '${key}' must be empty`;
                }
                if (full === false && actual[key]) {
                    issues[key] = `Key '${key}' must not be full`;
                } else if (full === true && !actual[key]) {
                    issues[key] = `Key '${key}' must be full`;
                }
            }
        }

        for (let key in issues) {
            issues[key] = `${prefix}${issues[key]}${suffix}`;
            console.error(issues[key]);
        }
        if (Object.keys(issues).length !== 0) {
            console.debug(actual);
        }

        return Object.keys(issues).length === 0 ? null : issues;
    }
}

function isTypes (value, types) {
    for (let type of types) {
        if (isType(value, type) === true) return true;
    }
    return false;
}


/**
* Checks if a value matches a specified type.
* @param {any} value - The value to check.
* @param {string} type - The expected type (e.g., "string", "number", "array", "map", "set", "HTMLElement").
* @returns {boolean} - True if the value matches the type, false otherwise.
*/
function isType(value, type) {
    if (type === "array") return Array.isArray(value);
    if (type === "null") return value === null;
    if (type === "map") return value instanceof Map;
    if (type === "set") return value instanceof Set;
    if (type === "HTMLElement") return value instanceof HTMLElement;
    if (type === "function") return value instanceof Function;
    if (type === "dict") return typeof value === "object" && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement);
    return typeof value === type && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement) && !(value instanceof Function);
}

/**
* Determines the type of a value.
* @param {any} value - The value to analyze.
* @returns {string} - The type of the value.
*/
function getType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (value instanceof Map) return "map";
    if (value instanceof Set) return "set";
    if (value instanceof HTMLElement) return "HTMLElement";
    if (value instanceof Function) return "function";
    if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement)) return "dict";
    return typeof value;
}