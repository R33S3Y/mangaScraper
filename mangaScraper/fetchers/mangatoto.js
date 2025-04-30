// imports
import { Templater } from '../support/templater.js';
import { InputChecker } from '../support/inputChecker.js';
import { ParserHelpers } from '../support/parserHelpers.js';
import { Merge } from '../support/merger.js'
import { Fetcher } from '../support/fetcher.js';
import { LanguageFinder } from '../support/languageFinder.js';


export class Mangatoto{
    constructor() {
        this.templater = new Templater();
        this.inputChecker = new InputChecker();
        this.parserHelpers = new ParserHelpers();
        this.merge = new Merge();
        this.fetcher = new Fetcher();
        this.languageFinder = new LanguageFinder();
        
        this.source = "mangatoto";

        this.config = {};

        this.lastQuery = "";
        this.lastPageCount = 100; // set as it is the max for mangatoto
    }

    updateConfig(config) {
        config = JSON.parse(JSON.stringify(config));

        this.config = config;

        this.templater.updateConfig(config);
        this.inputChecker.updateConfig(config);
        this.parserHelpers.updateConfig(config);
        this.merge.updateConfig(config);
        this.fetcher.updateConfig(config);
        this.languageFinder.updateConfig(config);
        return;
    }

    async search(query, askRound = 0){
        //invalid input check
        if (typeof query !== 'string') {
            return null;
        }
        if (isNaN(askRound) == true) {
            return null;
        }
        askRound++;
        query = query.replace(" ", "+");

        if (query === this.lastQuery && askRound > this.lastPageCount) {
            return [];
        }
        
        this.lastQuery = query;

        try {
            let link = `https://mangatoto.com/search?word=${query}&page=${askRound}`
            let html = await this.fetcher.site(link);
            
            if (html == null) {
                return null;                
            }


            
            let pageLinks = html.querySelectorAll(".page-link");
            let pageNum = []
            for (let pageLink of pageLinks) {
                let rawnum;
                const match = pageLink.href.match(/[?&]page=(\d+)/);
                if (match) {
                    rawnum = match[1];
                    if (!isNaN(rawnum)) {
                        pageNum.push(parseInt(rawnum));
                    }
                }
            }
            this.lastPageCount = pageNum.sort(function(a, b){return b - a})[0];
            if (askRound > this.lastPageCount) {
                return [];
            }

            let rawResults = [];
            let results = [];

            // get rawResults
            let allResults = html.querySelector('#series-list');
            let childElements = Array.from(allResults.children);
    
            // Push each child element into the subElements array
            rawResults.push(...childElements);

            if (rawResults == []) {
                return null;
            }
            
            for (let i = 0; i < rawResults.length; i++) {
                try {
                    let doc = rawResults[i];
                    
                    // make template
                    let info;
                    info = this.templater.makeBaseTemplate();
                    info.fallBack = this.templater.makeLanguageTemplate();

                    // source
                    info.source = this.source;

                    let imga = doc.querySelector(".item-cover");
                    let img = imga.querySelector("img");


                    // link
                    info.link = `mangatoto.com${imga.href.replace(/^(.*\/series\/)/, '/series/')}`;
                    // id
                    info.id = imga.href.match(/\/series\/(\d+)\//)[1];

                    

                    // nice to have
                    info.fallBack.title = doc.querySelector(".item-title").textContent.trim();
                    info.fallBack.coverImage = img.src;

                    let textdivs = doc.querySelectorAll(".item-text > .item-alias");
                    if (textdivs.length != 0) {
                        info.fallBack.subtitle = textdivs[0].querySelector(".text-muted").textContent.trim();;
                        if (textdivs.length > 1) {
                            let parts = textdivs[1].querySelectorAll(".text-muted");

                            let author = parts[0].textContent.trim();
                            let artist = parts[1] ? parts[1].textContent.trim() : "";

                            if (author !== "") {
                                info.authors = [{ name : author}];
                            }
                            if (artist !== "") {
                                info.artists = [{ name : artist}];
                            }
                        }
                    } else {
                        console.debug("no subtitle or artist info for:");
                        console.debug(doc);
                    }
                    let genresSpans = doc.querySelectorAll(".item-genre > span, u");
                    for (let genreSpan of genresSpans) {
                        info.genres.push(genreSpan.textContent.trim());
                    }
                    results.push(info);
                } catch (error) {
                    console.error('Single Manga retrieval failed - Error:', error);
                }
                
            }

            return results;
        } catch (error) {
            console.error('Error:', error);
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
            let language;
            let languageElement;
            try {
                languageElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Translated language:');
                language = languageElement ? languageElement.nextElementSibling.textContent.trim() : null;
            } catch {
                try {
                    languageElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Original language:');
                    language = languageElement ? languageElement.nextElementSibling.textContent.trim() : null;
                } catch {
                    console.error(`Can't find language info at ${info.link}`);
                    return null;
                }
            }

            // Convert to ISO 639-3
            language = this.languageFinder.nameToISO(language);

            // Check that language is not in the newInfo template
            for (const key in newInfo) {
                if (language === key) {
                    console.error(`Language cannot equal ${key}`);
                    return null;
                }
            }

            newInfo[language] = this.templater.makeLanguageTemplate(false, false, false);

            
            newInfo.id = newInfo.link.match(/\/series\/(\d+)\//)[1];

            try {
                // Get authors info
                const authorsElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Authors:');
                const authors = authorsElement ? authorsElement.nextElementSibling.querySelectorAll('a') : null;
                newInfo.authors = Array.from(authors).map(item => ({ name: item.textContent }));
            } catch (error) {
                console.warn(`Can't find authors info at ${info.link}`);
                // Function is still useful if authors info can't be found
            }

            try {
                // Get artists info
                const artistsElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Artists:');
                const artists = artistsElement ? artistsElement.nextElementSibling.querySelectorAll('a') : null;
                newInfo.artists = Array.from(artists).map(item => ({ name: item.textContent }));
            } catch (error) {
                console.warn(`Can't find artists info at ${info.link}`);
                // Function is still useful if artists info can't be found
            }
            
            try {
                // Get genres info
                const genresElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Genres:');
                const genres = genresElement ? genresElement.nextElementSibling.querySelectorAll(['span','u']) : null;
            
                newInfo.genres = Array.from(genres).map(item => (item.textContent));
            } catch (error) {
                console.warn(`Can't find genres info at ${info.link}`);
                // Function is still useful if genres info can't be found
            }
            
            try {
                // Get originalLanguage info
                const originalLanguageElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Original language:');
                const originalLanguage = originalLanguageElement ? originalLanguageElement.nextElementSibling.textContent.trim() : null;
            
                newInfo.originalLanguage = originalLanguage;
            } catch (error) {
                console.warn(`Can't find originalLanguage info at ${info.link}`);
                // Function is still useful if originalLanguage info can't be found
            }
            
            try {
                // Get availableLanguages info
                const availableLanguageElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Translated language:');
                const availableLanguage = availableLanguageElement ? availableLanguageElement.nextElementSibling.textContent.trim() : null;
            
                newInfo.availableLanguages.push(availableLanguage);
            } catch (error) {
                console.warn(`Can't find availableLanguages info at ${info.link}`);
                // Function is still useful if availableLanguages info can't be found
            }
            
            try {
                // Get views info
                const viewsElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Rank:');
                const viewsText = viewsElement ? viewsElement.nextElementSibling.textContent.trim() : null;
            
                // Use regular expressions to find the total views
                const viewsMatch = viewsText.match(/(\d+(\.\d+)?)\s*K?\s*monthly\s*\/\s*(\d+(\.\d+)?)\s*([KMT]?)\s*total\s*views/i);
            
                if (viewsMatch) {
                    let totalViews = parseFloat(viewsMatch[3]);
                    const multiplier = viewsMatch[5].toUpperCase();
            
                    if (multiplier === 'K') {
                        totalViews *= 1000;
                    } else if (multiplier === 'M') {
                        totalViews *= 1000000;
                    } else if (multiplier === 'T') {
                        totalViews *= 1000000000;
                    }
            
                    totalViews = Math.round(totalViews);
            
                    newInfo.views = totalViews;
                } else {
                    console.warn('Total views not found.');
                }
            } catch (error) {
                console.warn(`Can't find views info at ${info.link}`);
                // Function is still useful if views info can't be found
            }
            
            try {
                // Get coverImage info
                const coverImage = doc.querySelector('meta[property="og:image"]').getAttribute('content');
                newInfo[language].coverImage = coverImage;
            } catch (error) {
                console.warn(`Can't find coverImage info at ${info.link}`);
                // Function is still useful if coverImage info can't be found
            }
            
            try {
                // Get title info
                const title = doc.querySelector('meta[property="og:title"]').getAttribute('content');
                newInfo[language].title = title;
            } catch (error) {
                console.warn(`Can't find title info at ${info.link}`);
                // Function is still useful if title info can't be found
            }
            
            try {
                // Get subtitle info
                const subtitle = doc.querySelector('div.pb-2.alias-set.line-b-f').textContent.trim();
                newInfo[language].subtitle = subtitle;
            } catch (error) {
                console.warn(`Can't find subtitle info at ${info.link}`);
                // Function is still useful if subtitle info can't be found
            }
            
            try {
                // Get description info
                const description = doc.querySelector('meta[property="og:description"]').getAttribute('content');
                newInfo[language].description = description;
            } catch (error) {
                console.warn(`Can't find description info at ${info.link}`);
                // Function is still useful if description info can't be found
            }
            
            try {
                // Get status info
                const statusElement = this.parserHelpers.findElementByText(doc.querySelectorAll('b.text-muted'), 'Upload status:');
                const status = statusElement ? statusElement.nextElementSibling.textContent.trim() : null;
            
                newInfo[language].status = status;
            } catch (error) {
                try {
                    // Get status info (fallback)
                    status = doc.querySelector('b:contains("Original work:")').nextElementSibling.textContent.trim();
            
                    newInfo[language].status = status;
                } catch (innerError) {
                    console.warn(`Can't find status info at ${info.link}`);
                    // Function is still useful if status info can't be found
                }
            }
            
            try {
                // Get chapters info
                const chapters = Array.from(doc.querySelector('div.main').querySelectorAll('div.item.is-new, div.item'));
            
                newInfo[language].totalChapters = chapters.length;
            
                chapters.reverse().forEach(chapter => {
                    newInfo[language].chapterTitles.push(chapter.querySelector('b').textContent.trim());
                    newInfo[language].chapterLinks.push(`https://mangatoto.com${chapter.querySelector('a').getAttribute('href')}`);
                    newInfo[language].chapterUploader.push({name: chapter.querySelector('div').querySelector('a').querySelector('span').textContent.trim()});
                });
            } catch (error) {
                console.warn(`Can't find chapters info at ${info.link}`);
                // Function is still useful if chapters info can't be found
            }
            
            let mergedInfo = this.merge.info(info, newInfo);
            console.debug(mergedInfo);
            return mergedInfo;
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
                const pictureInfoElement = this.parserHelpers.findElementBySubtext(doc.querySelectorAll('script'), 'const your_email = ');
                const pictureInfo = pictureInfoElement ? pictureInfoElement.textContent.trim() : null;

                // Define a regular expression to match specific variables
                const variableRegex = /const\s+(imgHttps)\s*=\s*([^;]+);/g;

                // Initialize variables to store extracted values
                let imgHttps;

                // Match and extract variables using the regular expression
                let match;
                while ((match = variableRegex.exec(pictureInfo)) !== null) {
                    const variableName = match[1];
                    const variableValue = match[2].trim();

                    // Assign the extracted value to the corresponding variable
                    if (variableName === 'imgHttps') {
                        imgHttps = JSON.parse(variableValue);
                    }
                }
                
                let imgLinks = [];

                for (const index in imgHttps){
                    imgLinks.push(imgHttps[index]);
                }
                
                newInfo[language].pictureLinks[chapter] = imgLinks;
                newInfo[language].chapterLength[chapter] = imgLinks.length;

            } catch (error) {
                console.warn(`Can't find pictureInfo info at ${info[language].chapterLinks[chapter]} ERROR: ${error}`);
            }

            let mergedInfo = this.merge.info(info, newInfo);
            console.debug(mergedInfo);
            return mergedInfo;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}