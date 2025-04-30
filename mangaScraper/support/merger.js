export class Merge {
    static dicts(oldDict, newDict, defaults = [0, "", [], false, null]) {
        /**
         * Merges two dictionaries, preserving existing values from the old dictionary.
         * @param {object} oldDict - The original dictionary.
         * @param {object} newDict - The dictionary containing new values to merge.
         * @returns {object} - The merged dictionary.
         */
        // Helper function to recursively merge dictionaries
        function mergeRecursive(oldObj, newObj) {
            /**
             * Helper function to recursively merge dictionaries.
             * @param {object} oldObj - The original object to merge into.
             * @param {object} newObj - The new object containing values to merge.
             * @returns {object} - The merged object.
             */
            for (let key in newObj) {
                if (newObj.hasOwnProperty(key)) {
                    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key]) && !newObj[key] instanceof HTMLElement) {
                        // If the value is an object (but not an array), recursively merge
                        oldObj[key] = mergeRecursive(oldObj[key] || {}, newObj[key]);
                    } else if (defaults.includes(newObj[key])) {
                        // If the value is a default value, fill in with old value
                        oldObj[key] = oldObj[key] || newObj[key];
                    } else {
                        // Otherwise, use the value from newDict
                        oldObj[key] = newObj[key];
                    }
                }
            }
            return oldObj;
        }
    
        // Call the recursive function with oldDict and newDict
        return mergeRecursive({...oldDict}, newDict);
    }

}