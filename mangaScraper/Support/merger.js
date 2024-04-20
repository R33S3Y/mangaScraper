export class Merge {
    info(oldDict, newDict) {
        // Helper function to recursively merge dictionaries
        let defaults = [0, "", [], false, null];
        function mergeRecursive(oldObj, newObj) {
            for (let key in newObj) {
                if (newObj.hasOwnProperty(key)) {
                    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
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