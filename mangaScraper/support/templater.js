
export class Templater{

    static makeBaseTemplate(info = null){
        /**
         * Makes the base template for manga information.
         * @param {object|null} info - The information input provided by mangaScraper (optional).
         * @returns {object} - The base template for manga information.
         * 
         * @example
         * const newInfo = Tmplater.makeBaseTemplate(info);
         */

        const template = {
            source: "",
            id: 0,
            link: "",
            authors: [],
            artists: [],
            genres: [],
            originalLanguage: '',
            availableLanguages: [],
            displayMethod: "",
            views: 0,
            ratings: [],
            totalRatings: 0,
        };

        if (info !== null) {
            template.source = info.source;
            template.link = info.link;
        }
        
        return template
    }

    static makeLanguageTemplate(coverImageExpire = true, chapterLinksExpire = true, pictureLinksExpire = true){
        /**
         * Makes a sub-template for manga information in a specific language.
         * @param {boolean} coverImageExpire - Indicates whether the cover image expires (defaults to true).
         * @param {boolean} chapterLinksExpire - Indicates whether the chapter links expire (defaults to true).
         * @param {boolean} pictureLinksExpire - Indicates whether the picture links expire (defaults to true).
         * @returns {object} - The sub-template for manga information in a specific language.
         * 
         * @example
         * newInfo[language] = Templater.makeLanguageTemplate(true, false);
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