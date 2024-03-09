
import { Mangatoto }  from './mangatoto.js';


export class MetaHandler{
    getAllItems(item, langauge = null, chapter = null, infoSources){
        let allItemInfo = [];
        let tempInfoSources = [];
        // if item in langauge filter info
        if (chapter !== null && langauge !== null) {
            // item in langauge
            for (let info of infoSources) {
                for (let availableLanguage of info.availableLanguages) {
                    if (langauge == availableLanguage){
                        if (info[langauge][item][chapter] !== null && info[langauge][item][chapter].length !== 0) {
                            tempInfoSources.push(info);
                        }
                    }
                }
            }
            for (let info of tempInfoSources) {
                if (info[langauge][item][chapter] == null || info[langauge][item][chapter] == undefined || info[langauge][item][chapter] == "" || info[langauge][item][chapter].length == 0) {
                    //input is invaild
                    continue;
                }
                allItemInfo.push({"info": info[langauge][item][chapter], "id": `${info.source}-${info.id}`});
            }
        } else if (langauge !== null) {
            // item in langauge
            for (let info of infoSources) {
                for (let availableLanguage of info.availableLanguages) {
                    if (langauge == availableLanguage){
                        tempInfoSources.push(info);
                    }
                }
            }
            for (let info of tempInfoSources) {
                if (info[langauge][item] == null || info[langauge][item] == undefined || info[langauge][item] == "" || info[langauge][item].length == 0) {
                    //input is invaild
                    continue;
                }
                allItemInfo.push({"info": info[langauge][item], "id": `${info.source}-${info.id}`});
            }
        } else {
            // not in langauge
            tempInfoSources = [...infoSources];
            for (let info of tempInfoSources) {
                if (info[item] == null || info[item] == undefined || info[item] == "" || info[item].length == 0) {
                    //input is invaild
                    continue;
                }
                allItemInfo.push({"info": info[item], "id": `${info.source}-${info.id}`});
            }
        }
        

        return allItemInfo;
    }

}
export class RequestHandler{
    constructor() {
        this.mangatoto = new Mangatoto();
    }
    async request(item, langauge, chapter, source, infoSources) {

        // Stage 0 create useful vars
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        // Stage 1 get correct dict from the list infoSources 
        let infoSource = null;
        let infoSourceIndex;
        for (let i in infoSources) {
            if (infoSources[i].id == rawID && infoSources[i].source == rawSource){
                // Found dict
                infoSource = infoSources[i];
                infoSourceIndex = i;
                break;
            }
        }
        if (infoSource == null) { // ERROR check
            console.error(`couldn't find ${source} in infoSources`);
            return null;
        }

        // Stage 2 call module functions
        let rawInfoSource;
        if (rawSource == this.mangatoto.source) {
            let inPictureSupport = ["pictureLinks", "chapterLength"];
            if (inPictureSupport.includes(item)) {
                rawInfoSource = await this.mangatoto.picture(infoSource, chapter, langauge);
            } else {
                rawInfoSource = await this.mangatoto.info(infoSource);
            }


            if (rawInfoSource.id && !(Array.isArray(rawInfoSource.id) && rawInfoSource.id.length === 0)) {// this if statment checks if the input is mot default
                infoSource.id = rawInfoSource.id;
            }
            if (rawInfoSource.link && !(Array.isArray(rawInfoSource.link) && rawInfoSource.link.length === 0)) {// this if statment checks if the input is mot default
                infoSource.link = rawInfoSource.link;
            }
            if (rawInfoSource.authors && !(Array.isArray(rawInfoSource.authors) && rawInfoSource.authors.length === 0)) {// this if statment checks if the input is mot default
                infoSource.authors = rawInfoSource.authors;
            }
            if (rawInfoSource.artists && !(Array.isArray(rawInfoSource.artists) && rawInfoSource.artists.length === 0)) {// this if statment checks if the input is mot default
                infoSource.artists = rawInfoSource.artists;
            }
            if (rawInfoSource.genres && !(Array.isArray(rawInfoSource.genres) && rawInfoSource.genres.length === 0)) {// this if statment checks if the input is mot default
                infoSource.genres = rawInfoSource.genres;
            }
            if (rawInfoSource.originalLanguage && !(Array.isArray(rawInfoSource.originalLanguage) && rawInfoSource.originalLanguage.length === 0)) {// this if statment checks if the input is mot default
                infoSource.originalLanguage = rawInfoSource.originalLanguage;
            }
            if (rawInfoSource.availableLanguages && !(Array.isArray(rawInfoSource.availableLanguages) && rawInfoSource.availableLanguages.length === 0)) {// this if statment checks if the input is mot default
                infoSource.availableLanguages = rawInfoSource.availableLanguages;
            }
            if (rawInfoSource.displayMethod && !(Array.isArray(rawInfoSource.displayMethod) && rawInfoSource.displayMethod.length === 0)) {// this if statment checks if the input is mot default
                infoSource.displayMethod = rawInfoSource.displayMethod;
            }
            if (rawInfoSource.views && !(Array.isArray(rawInfoSource.views) && rawInfoSource.views.length === 0)) {// this if statment checks if the input is mot default
                infoSource.views = rawInfoSource.views;
            }
            if (rawInfoSource.ratings && !(Array.isArray(rawInfoSource.ratings) && rawInfoSource.ratings.length === 0)) {// this if statment checks if the input is mot default
                infoSource.ratings = rawInfoSource.ratings;
            }
            if (rawInfoSource.totalReviews && !(Array.isArray(rawInfoSource.totalReviews) && rawInfoSource.totalReviews.length === 0)) {// this if statment checks if the input is mot default
                infoSource.totalReviews = rawInfoSource.totalReviews;
            }
            if (rawInfoSource && rawInfoSource[langauge] !== undefined) {
                if (rawInfoSource[langauge].coverImage && !(Array.isArray(rawInfoSource[langauge].coverImage) && rawInfoSource[langauge].coverImage.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].coverImage = rawInfoSource[langauge].coverImage;
                }
                if (rawInfoSource[langauge].coverImageExpire && !(Array.isArray(rawInfoSource[langauge].coverImageExpire) && rawInfoSource[langauge].coverImageExpire.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].coverImageExpire = rawInfoSource[langauge].coverImageExpire;
                }
                if (rawInfoSource[langauge].title && !(Array.isArray(rawInfoSource[langauge].title) && rawInfoSource[langauge].title.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].title = rawInfoSource[langauge].title;
                }
                if (rawInfoSource[langauge].subtitle && !(Array.isArray(rawInfoSource[langauge].subtitle) && rawInfoSource[langauge].subtitle.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].subtitle = rawInfoSource[langauge].subtitle;
                }
                if (rawInfoSource[langauge].description && !(Array.isArray(rawInfoSource[langauge].description) && rawInfoSource[langauge].description.length === 0)) {// this if statment checks if the input is mot default
                    infoSource.description = rawInfoSource.description;
                }
                if (rawInfoSource[langauge].status && !(Array.isArray(rawInfoSource[langauge].status) && rawInfoSource[langauge].status.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].status = rawInfoSource[langauge].status;
                }
                if (rawInfoSource[langauge].totalChapters && !(Array.isArray(rawInfoSource[langauge].totalChapters) && rawInfoSource[langauge].totalChapters.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].totalChapters = rawInfoSource[langauge].totalChapters;
                }
                if (rawInfoSource[langauge].chapterTitles && !(Array.isArray(rawInfoSource[langauge].chapterTitles) && rawInfoSource[langauge].chapterTitles.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].chapterTitles = rawInfoSource[langauge].chapterTitles;
                }
                if (rawInfoSource[langauge].chapterUploader && !(Array.isArray(rawInfoSource[langauge].chapterUploader) && rawInfoSource[langauge].chapterUploader.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].chapterUploader = rawInfoSource[langauge].chapterUploader;
                }
                if (rawInfoSource[langauge].totalPictures[chapter] && !(Array.isArray(rawInfoSource[langauge].totalPictures[chapter]) && rawInfoSource[langauge].totalPictures[chapter].length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].totalPictures[chapter] = rawInfoSource[langauge].totalPictures[chapter];
                }
                if (rawInfoSource[langauge].chapterLinks && !(Array.isArray(rawInfoSource[langauge].chapterLinks) && rawInfoSource[langauge].chapterLinks.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].chapterLinks = rawInfoSource[langauge].chapterLinks;
                }
                if (rawInfoSource[langauge].chapterLinksExpire && !(Array.isArray(rawInfoSource[langauge].chapterLinksExpire) && rawInfoSource[langauge].chapterLinksExpire.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].chapterLinksExpire = rawInfoSource[langauge].chapterLinksExpire;
                }
                if (rawInfoSource[langauge].pictureLinks[chapter] && !(Array.isArray(rawInfoSource[langauge].pictureLinks[chapter]) && rawInfoSource[langauge].pictureLinks[chapter].length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].pictureLinks[chapter] = rawInfoSource[langauge].pictureLinks[chapter];
                }
                if (rawInfoSource[langauge].pictureLinksExpire && !(Array.isArray(rawInfoSource[langauge].pictureLinksExpire) && rawInfoSource[langauge].pictureLinksExpire.length === 0)) {// this if statment checks if the input is mot default
                    infoSource[langauge].pictureLinksExpire = rawInfoSource[langauge].pictureLinksExpire;
                }
            } else {
                console.error("langauge not vaild")
            }
        }

        // Stage 3 Modify infoSources
        
        infoSources[infoSourceIndex] = infoSource;
        return infoSources;
    }

    async parallelRequests(item, language, chapter, requestGroup, infoSources) {
        if (!Array.isArray(requestGroup)) {
            console.error("Invallid Input: requestGroup is not list");
            return null;
        }
        const parallelRequests = [];
    
        // Iterate through the second dimension of requestGroup
        for (let i = 0; i < requestGroup.length; i++) {
            // Create a promise for each request
            const requestPromise = new Promise((resolve, reject) => {
                // Make the request
                this.request(item, language, chapter, requestGroup[i], infoSources)
                    .then(response => {
                        resolve(response); // Resolve the promise with the response
                    })
                    .catch(error => {
                        reject(error); // Reject the promise if there's an error
                    });
            });
            parallelRequests.push(requestPromise); // Add the promise to the array
        }
    
        try {
            // Execute all promises in parallel
            const responses = await Promise.all(parallelRequests);
            return responses; // Return responses when all requests are completed
        } catch (error) {
            throw error; // Throw any error that occurs during requests
        }
    }
}