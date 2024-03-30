
export class Templater{
    makeBaseTemplate(info){
        /**
         * makes the same base template as inputed by mangaScraper
         * 
         * @param {dict} info - the same input that should 
         * @returns {dict} template - the template
         * 
         * @example const newInfo = this.templater.makeBaseTemplate(info);
         */
        const template = {
            source: info.source,
            id: 0,
            link: info.link,
            authors: [],
            artists: [],
            genres: [],
            originalLanguage: '',
            availableLanguages: [],
            displayMethod: "",
            views: 0,
            rating: 0,
            totalReviews: 0,
        };
        return template
    }

    makeLanguageTemplate(coverImageExpire = true, chapterLinksExpire = true, pictureLinksExpire = true){
        /**
         * make the subtemplate for info
         * 
         * @param {bool} coverImageExpire - defaults to true
         * @param {bool} chapterLinksExpire - defaults to true
         * @param {bool} pictureLinksExpire - defaults to true
         * @returns {dict} template - it the template
         * 
         * @example newInfo[language] = this.templater.makeLanguageTemplate(true, false);
         */
        const template = {
            coverImage: "",
            coverImageExpire: coverImageExpire,
            title: "",
            subtitle: "",
            description: "",
            status: "",
            totalChapters: 0,
            chapterTitles: [],
            chapterUploader: [],
            chapterLength: [],
            chapterLinks: [],
            chapterLinksExpire: chapterLinksExpire,
            pictureLinks: [],
            pictureLinksExpire: pictureLinksExpire,
        };
        return template
    }
}

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
         * @returns {list} - 1st item false if it failed on checks else true sencond is for if call info can fix
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

export class ParserHelpers{
    findElementByText(elements, text) {
        return Array.from(elements).find(element => element.textContent.includes(text));
    }
    findElementBySubtext(elements, subtext) {
        return Array.from(elements).find(element => element.textContent.includes(subtext));
    }
}