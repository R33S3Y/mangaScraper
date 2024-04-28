export class InputChecker{
    infoInputCheck(info, source){
        /**
         * Performs input checks most likely needed for the info function.
         * @param {object} info - The input object for the info function.
         * @param {string} source - The source that this module handles.
         * @returns {boolean} - False if input fails checks; otherwise, true.
         * 
         * @example
         * if (!this.inputChecker.infoInputCheck(info, this.source)) {
         *     return null;
         * }
         */
        if (!info.source) {
            console.error(`Invalid input: ${source}.js needs info.source`);
            return false;
        }

        if (!info.link) {
            console.error(`Invalid input: ${source}.js needs info.link`);
            return false;
        }

        if (info.source !== source) {
            console.error(`Invalid input: ${source}.js does not handle sources from: ${info.source}`);
            return false;
        }
        
        return true
    }

    pictureInputCheck(info, chapter, language, source){
        /**
         * Performs input checks most likely needed for the picture function.
         * @param {object} info - Input object for the info function.
         * @param {number} chapter - Input for the chapter function.
         * @param {string} language - Input for the language function.
         * @param {string} source - The source that this module handles.
         * @returns {Array} - First item indicates if input fails checks (false) or passes (true); 
         *                    second item indicates if calling the info function can fix the issue (true), otherwise false.
         * 
         * @example
         * const [checker, infoFix] = this.inputChecker.pictureInputCheck(info, chapter, language, this.source);
         * if (!checker) {
         *     return null;
         * }
         * if (infoFix) {
         *     // Call info function to fix the issue
         *     const infoResult = this.getInfo(...);
         *     // Handle infoResult...
         * }
         */
        if (!info.source) {
            console.error(`Invalid input: ${source}.js needs info.source`);
            return [false, false];
        }

        if (info.source !== source) {
            console.error(`Invalid input: ${source}.js does not handle sources from: ${info.source}`);
            return [false, false];
        }

        if (chapter == undefined || chapter == null) {
            console.error(`Invalid input: ${source}.js needs chapter to be inputted when calling picture`);
            return [false, false];
        }

        if (!language) {
            console.error(`Invalid input: ${source}.js needs language to be inputted when calling picture`);
            return [false, false];
        }

        if (info[language].chapterLinks[chapter] == undefined || info[language].chapterLinks[chapter] == null) {
            console.warn(`Invalid input: ${source}.js needs chapterLinks when calling picture can be fixed with info call`);
            return [false, true];
        }
        
        return [true, false];
    }
}