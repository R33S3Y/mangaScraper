// Import dependances (aka support functions)
import { Templater } from "../Support/templater.js";
import { InputChecker } from "../Support/inputChecker.js";
import { ParserHelpers } from "../Support/parserHelpers.js";
import { Merge } from "../Support/merger.js"
import { Fetcher } from "../Support/fetcher.js";
import { LanguageFinder } from "../Support/languageFinder.js";


export class Example{ // Add classname
    constructor() {
        // Declare dependances
        this.templater = new Templater();
        this.inputChecker = new InputChecker();
        this.parserHelpers = new ParserHelpers();
        this.merge = new Merge();
        this.fetcher = new Fetcher();
        this.languageFinder = new LanguageFinder();
        
        // State source
        this.source = "Example";

        // Will be filled by mangaScraper.js on init
        this.config = {};
    }

    updateConfig(config) {
        config = JSON.parse(JSON.stringify(config));

        this.config = config;

        // Call all dependances updateConfig function here
        this.templater.updateConfig(config);
        this.inputChecker.updateConfig(config);
        this.parserHelpers.updateConfig(config);
        this.merge.updateConfig(config);
        this.fetcher.updateConfig(config);
        this.languageFinder.updateConfig(config);


        return;
    }

    async search(query, askRound = 0){
        /**
         * This function is expected to output a list of info dict"s
         * 
         * When you run out of new search results you are expected to output a empty list when called.
         * 
         * You are expected to fill out info as much as posable for just the search results 
         * as such the list of items has ben provided even if you won't find info for all of them.
         * 
         * The following pseudocode is provided as a guide and/or template.
         */



        //invalid input check
        if (typeof query !== "string") {
            return null;
        }
        if (isNaN(askRound) == true) {
            return null;
        }


        try {

            // get website
            let link = `https://example.com/search?word=${query}&page=${askRound}`
            let html = await this.fetcher.site(link);
            
            if (html == null) {
                return null;                
            }

            // get a list of all mangas as raw html search results
            let rawResults = html.querySelectorAll(".manga");

            // error check
            if (rawResults == []) {
                return null;
            }
            
            let results = [];
            for (let i = 0; i < rawResults.length; i++) {
                try {
                    let doc = rawResults[i];
                    
                    // make template
                    let language = "eng"; 
                    /** 
                     * language should alline with ISO 639-3 (you can use languageFinder.nameToISO() to help with this)
                     * If you can't find the language you can set it to fallback
                     * Eg: info.fallback = this.templater.makeLanguageTemplate();
                    */


                    let info;
                    info = this.templater.makeBaseTemplate();
                    info[language] = this.templater.makeLanguageTemplate(); 
                    

                    
                    // NEEDED!
                    // source
                    info.source = this.source;
                    // link
                    info.link = "example.com/manga/miku";
                    // id
                    info.id = 1234

                    

                    // nice to have
                    // authors
                    info.authors = [{ name : "Bob"}];
                    // artist
                    info.artists = [{ name : "fredyguy12"}]; // Go check them out: https://www.instagram.com/fredyguy12_art/

                    // genres
                    info.genres = ["manga", "anime", "netflix adaptation"];

                    // original Language
                    info.originalLanguage = "japanese";
                    // available / translated Languages
                    info.availableLanguages = ["english","japanese"];

                    // views
                    info.views = 12345

                    // ratings
                    info.ratings = [0,0.3,0.1,1,0.7]; // the max rating is normalized to 1
                    info.totalratings = info.ratings.length;


                    // coverimg
                    info[language].coverImage = "example.com/imgs/coverImage.jpg";
                    info[language].coverImageExpire = false; // is for if the coverImage link Expires it can also be set when calling templater.makeLanguageTemplate();

                    // title
                    info[language].title = "exampleTitle";
                    // subtitle
                    info[language].subtitle = "exampleSubTitle";
                    // description
                    info[language].description = "exampleDescription";

                    // status
                    info[language].status = "Ongoing";

                    // totalChapters
                    info[language].totalChapters = 2;
                    // chapterTitles
                    info[language].chapterTitles = ["Volume 1 Chapter 1", "Volume 1 Chapter 2"];
                    // chapterUploader
                    info[language].chapterUploader = [{name : "Bob"}, {name : "Alice"}];
                    // chapterLength
                    info[language].chapterLength = [2, 2]; // How many pictures are in a chapter
                    // chapterLinks
                    info[language].chapterLinks = ["example.com/chapter/0","example.com/chapter/1"];
                    // chapterLinksExpire
                    info[language].chapterLinksExpire = false; // can be set when calling templater.makeLanguageTemplate();
                    // pictureLinks
                    info[language].pictureLinks = [["example.com/imgs/manga/0/0", "example.com/imgs/manga/0/1"], ["example.com/imgs/manga/1/0", "example.com/imgs/manga/1/1"]];
                    //  pictureLinksExpire
                    info[language].pictureLinksExpire = false; // can be set when calling templater.makeLanguageTemplate();
                    
                    results.push(info);
                } catch (error) {
                    console.error("Single Manga retrieval failed - Error:", error);
                }
                
            }

            return results;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    async info(info){
        // Checking For Invalid input
        if (this.inputChecker.infoInputCheck(info, this.source) !== true) {
            return null;
        }

        // Make template
        const newInfo = this.templater.makeBaseTemplate(info);

        try {
            // Get website
            const doc = await this.fetcher.site(info.link);

            // Figure out what language the manga is in.
            let language = "example"; // Add your implementation here
            
            // the langauge should be formated according to ISO 639-3
            // you can use languageFinder.js to help with this.



            // Remove case sensitivity
            language = language.toLowerCase();

            // Check that language is not in the newInfo template
            for (const key in newInfo) {
                if (language === key) {
                    console.error(`Language cannot equal ${key}`);
                    return null;
                }
            }

            newInfo[language] = this.templater.makeLanguageTemplate(false, false, false); // Configure these

            // Get ID            
            newInfo.id = 0 



            try {
                // Get authors info
                newInfo.authors = [{name: "example"}];



            } catch (error) {
                console.warn(`Can't find authors info at ${info.link}`);
                // Function is still useful if authors info can't be found
            }

            try {
                // Get artists info
                newInfo.artists = [{name: "example"}];



            } catch (error) {
                console.warn(`Can't find artists info at ${info.link}`);
                // Function is still useful if artists info can't be found
            }
            
            try {
                // Get genres info
                newInfo.genres = ["example"];



            } catch (error) {
                console.warn(`Can't find genres info at ${info.link}`);
                // Function is still useful if genres info can't be found
            }
            
            try {
                // Get originalLanguage info
                newInfo.originalLanguage = "example";



            } catch (error) {
                console.warn(`Can't find originalLanguage info at ${info.link}`);
                // Function is still useful if originalLanguage info can't be found
            }
            
            try {
                // Get availableLanguages info
                newInfo.availableLanguages = ["example"];



            } catch (error) {
                console.warn(`Can't find availableLanguages info at ${info.link}`);
                // Function is still useful if availableLanguages info can't be found
            }
            
            try {
                // Get views info
                newInfo.views = 0;



            } catch (error) {
                console.warn(`Can't find views info at ${info.link}`);
                // Function is still useful if views info can't be found
            }
            
            try {
                // Get coverImage info
                newInfo[language].coverImage = "www.example.com";



            } catch (error) {
                console.warn(`Can't find coverImage info at ${info.link}`);
                // Function is still useful if coverImage info can't be found
            }
            
            try {
                // Get title info
                newInfo[language].title = "example";



            } catch (error) {
                console.warn(`Can't find title info at ${info.link}`);
                // Function is still useful if title info can't be found
            }
            
            try {
                // Get subtitle info
                newInfo[language].subtitle = "example";



            } catch (error) {
                console.warn(`Can't find subtitle info at ${info.link}`);
                // Function is still useful if subtitle info can't be found
            }
            
            try {
                // Get description info
                newInfo[language].description = "example";



            } catch (error) {
                console.warn(`Can't find description info at ${info.link}`);
                // Function is still useful if description info can't be found
            }
            
            try {
                // Get status info
                newInfo[language].status = "example";



            } catch (error) {
                console.warn(`Can't find status info at ${info.link}`);
                // Function is still useful if status info can't be found
            }
            
            try {
                // Get chapters info
                newInfo[language].chapterTitles = ["example"];
                newInfo[language].chapterLinks  = ["example"];
                newInfo[language].chapterUploader = ["example"];
            


            } catch (error) {
                console.warn(`Can't find chapters info at ${info.link}`);
                // Function is still useful if chapters info can't be found
            }
            
            console.debug(newInfo);
            return this.merge.info(info, newInfo);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async picture(info, chapter, language){
        // Checking For Invalid input
        let [checker, infoFix]  = this.inputChecker.pictureInputCheck(info, chapter, language, this.source);
        if (checker !== true) {
            if (infoFix == true){
                let newInfo = await this.info(info);
                if (newInfo == null) {
                    return null;
                } else {
                    info = this.merge.info(info,newInfo);
                }
            } else {
                return null;
            }
            
        }

        // Make template
        const newInfo = this.templater.makeBaseTemplate(info);
        newInfo[language] = this.templater.makeLanguageTemplate(false, false, false);

        try {
            // Get website
            const doc = await this.fetcher.site(info[language].chapterLinks[chapter]);
            
            try {
                // Get picture info
                newInfo[language].pictureLinks[chapter] = ["example"];
                newInfo[language].chapterLength[chapter] = [0];



            } catch (error) {
                console.warn(`Can't find pictureInfo info at ${info[language].chapterLinks[chapter]} ERROR: ${error}`);
            }


            console.debug(newInfo);
            return this.merge.info(info, newInfo);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}