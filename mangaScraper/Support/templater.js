
export class Templater{
    makeBaseTemplate(info = null){
        /**
         * makes the same base template as inputed by mangaScraper
         * 
         * @param {dict} info - the same input that should 
         * @returns {dict} template - the template
         * 
         * @example const newInfo = this.templater.makeBaseTemplate(info);
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
            rating: 0,
            totalReviews: 0,
        };

        if (!info == null) {
            template.source = info.source;
            template.link = info.link;
        }
        
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