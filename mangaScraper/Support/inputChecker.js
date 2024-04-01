
export class InputChecker{
    infoInputCheck(info, source){
        /**
         * Preforms the input checks most likely needed for the info function
         * 
         * @param {dict} info - info function input
         * @param {str} source - the source that this module handles
         * @returns {bool} - false if it failed on checks else true
         * 
         * @example if (this.inputChecker.infoInputCheck(info, this.source) !== true) {return null;}
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
         * Preforms the input checks most likely needed for the info function
         * 
         * @param {dict} info - info function input
         * @param {int} chapter - chapter function input
         * @param {str} language - language function input
         * @param {str} source - the source that this module handles
         * @returns {list} - 1st item false if it failed on checks else true second is for if a call info can fix the issue
         * 
         * @example let [checker, infoFix]  = this.inputChecker.pictureInputCheck(info, chapter, language, this.source);
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
            console.error(`Invalid input: ${source}.js needs language to be inputted when calling picture`);
            return [false, true];
        }
        
        return [true, false];
    }
}