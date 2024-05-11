/**
 * Fetcher template V0.1
 */

//import { Templater, InputChecker, ParserHelpers }  from '../Support/fetcherSupport.js';
import { Templater } from '../Support/templater.js';
import { InputChecker } from '../Support/inputChecker.js';
import { Merge } from '../Support/merger.js';
import { Fetcher } from '../Support/fetcher.js';


export class Example{ // Your classname
    constructor() {
        this.templater = new Templater();
        this.inputChecker = new InputChecker();
        this.merge = new Merge();
        this.fetcher = new Fetcher();
        
        this.source = "example"; // Your sourcename
    }

    search(query){ //Will be added at a later time

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