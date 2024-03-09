//mangatoto.js

import { Templater, InputChecker, ParserHelpers }  from './moduleHelper.js';


export class Mangatoto{
    constructor() {
        this.templater = new Templater();
        this.inputChecker = new InputChecker();
        this.parserHelpers = new ParserHelpers();
        this.source = "mangatoto"
    }

    search(query){

    }

    async info(info){
        // Checking For Invalid input
        if (this.inputChecker.infoInputCheck(info, this.source) !== true) {
            return null;
        }

        // Make template
        const newInfo = this.templater.makeBaseTemplate(info);

        // Get website
        fetch(info.link)
        .then(response => {
            if (!response.ok) {
                console.error(`Couldn't access ${info.link} status code: ${response.status}`);
                return null;
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

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

            // Remove case sensitivity
            language = language.toLowerCase();

            // Check that language is not in the newInfo template
            for (const key in newInfo) {
                if (language === key) {
                    console.error(`Language cannot equal ${key}`);
                    return null;
                }
            }

            newInfo[language] = this.templater.makeLanguageTemplate(true, false);

            
            newInfo.id = newInfo.source.match(/\/series\/(\d+)\//)[1];

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
            
                newInfo.genres = Array.from(genres).map(item => (item.textContent));;
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
            
        })
        .catch(error => console.error('Error:', error));

        console.log(newInfo);
        return newInfo
    }

    async picture(info, chapter, language){
        // Checking For Invalid input
        let [checker, infoFix]  = this.inputChecker.pictureInputCheck(info, chapter, language, this.source);
        if (checker !== true) {
            if (infoFix == true){
                let newInfo = this.info(info)
                if (newInfo == null) {
                    return null;
                } else {
                    if (!newInfo[language].chapterLinks[chapter]) {
                        return null;
                    }
                    info[language].chapterLinks[chapter] = newInfo[language].chapterLinks[chapter];
                }
            } else {
                return null;
            }
            
        }

        // Make template
        const newInfo = this.templater.makeBaseTemplate(info);
        newInfo[language] = this.templater.makeLanguageTemplate(true, false, true);

        // Get website
        fetch(info[language].chapterLinks[chapter])
        .then(response => {
            if (!response.ok) {
                console.error(`Couldn't access ${info[language].chapterLinks[chapter]} status code: ${response.status}`);
                return null;
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            try {
                // Get picture info
                const pictureInfoElement = this.parserHelpers.findElementBySubtext(doc.querySelectorAll('script'), 'const your_email = ');
                const pictureInfo = pictureInfoElement ? pictureInfoElement.textContent.trim() : null;

                // Define a regular expression to match specific variables
                const variableRegex = /const\s+(batoWord|batoPass|imgHttps)\s*=\s*([^;]+);/g;

                // Initialize variables to store extracted values
                let batoWord, batoPass, imgHttps;

                // Match and extract variables using the regular expression
                let match;
                while ((match = variableRegex.exec(pictureInfo)) !== null) {
                    const variableName = match[1];
                    const variableValue = match[2].trim();

                    // Assign the extracted value to the corresponding variable
                    if (variableName === 'batoWord') {
                        batoWord = variableValue.slice(1, -1);
                    } else if (variableName === 'batoPass') {
                        batoPass = eval(variableValue);
                    } else if (variableName === 'imgHttps') {
                        imgHttps = JSON.parse(variableValue);
                    }
                }
                
                let imgExp = JSON.parse(CryptoJS.AES.decrypt(batoWord, batoPass).toString(CryptoJS.enc.Utf8));
                let imgLinks = [];

                for (const index in imgHttps){
                    imgLinks.push(`${imgHttps[index]}?${imgExp[index]}`);
                }
                
                newInfo[language].pictureLinks[chapter] = imgLinks;
                newInfo[language].totalPictures[chapter] = imgLinks.length;

            } catch (error) {
                console.warn(`Can't find pictureInfo info at ${info[language].chapterLinks[chapter]} ERROR: ${error}`);
                // Function is still useful if pictureInfo info can't be found
            }
        })
        .catch(error => console.error('Error:', error));

        console.log(newInfo);
        return newInfo;
    }
}