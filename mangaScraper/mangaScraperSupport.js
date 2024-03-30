
import { Mangatoto }  from './mangatoto.js';


export class MetaHandler{
    countItem(item, langauge = null, chapter = null, infoSources, calledInternally = false){
        //gets all items
        let itemValues = [];

        for (let i = 0; i < infoSources.length; i++) {
            if (infoSources[i].hasOwnProperty(item)) {
                itemValues.push(infoSources[i][item]);
            } else {
                for (let prop in infoSources[i]) {
                    if (typeof infoSources[i][prop] === 'object' && prop === langauge.toLowerCase()) {
                        
                        itemValues = itemValues.concat(this.countItem(item, langauge, chapter, [infoSources[i][prop]], true));
                    }
                }
            }
        }

        if (calledInternally === true) {
            return itemValues;
        }

        // counts only if vaild
        let vaildItems = [];
        let needsChapter = ["pictureLinks", "chapterLength"];
        if (needsChapter.includes(item)){
            for (let value in itemValues) {
                if (Array.isArray(value)) {
                    if (value[chapter] && !(Array.isArray(value[chapter]) && value[chapter].length === 0)) {
                        vaildItems.push(value[chapter]);
                    }
                } else {
                    console.warn(`item is ${item} & value is not list!!! value: ${value}`);
                }
            }
        } else {
            for (let value in itemValues) {
                if (value && !(Array.isArray(value) && value.length === 0)) {
                    vaildItems.push(value);
                }
            }
        }
        return vaildItems.length;
    }

    getItems(item, langauge = null, chapter = null, infoSources, calledInternally = false){
        //gets all items
        let itemValues = [];

        for (let i = 0; i < infoSources.length; i++) {
            if (infoSources[i].hasOwnProperty(item)) {
                let obj = {
                    "item": infoSources[i][item],
                    "id": `${infoSources[i].source}-${infoSources[i].id}`
                };
                itemValues.push(obj);
            } else {
                for (let prop in infoSources[i]) {
                    if (typeof infoSources[i][prop] === 'object' && prop === langauge.toLowerCase()) {
                        let obj = {...infoSources[i][prop]};
                        obj.id = infoSources[i].id;
                        obj.source = infoSources[i].source;
                        itemValues = itemValues.concat(this.getItems(item, langauge, chapter, [obj], true));
                    }
                }
            }
        }
        return itemValues;
        if (calledInternally === true) {
            return itemValues;
        }

        // counts only if vaild
        let vaildItems = [];
        let needsChapter = ["pictureLinks", "chapterLength"];
        if (needsChapter.includes(item)){
            for (let value in itemValues) {
                if (Array.isArray(value.item)) {
                    if (value.item[chapter] && !(Array.isArray(value.item[chapter]) && value.item[chapter].length === 0)) {
                        let obj = {
                            "item": value.item[chapter],
                            "id": `${value.source}-${value.id}`
                        };
                        vaildItems.push(obj);
                    }
                } else {
                    console.warn(`item is ${item} & value is not list!!! value: ${value}`);
                }
            }
        } else {
            for (let value in itemValues) {
                if (value.item && !(Array.isArray(value.item) && value.item.length === 0)) {
                    vaildItems.push(value);
                }
            }
        }
        return vaildItems;
    }
}
export class RequestHandler{
    constructor() {
        this.mangatoto = new Mangatoto();
    }
    async distributeRequest(item, langauge, chapter, source, infoSources) {

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

            /**
             * The following code has been made redundent. this is expected to cause issues but that fine. 
             * It was intended to handle merging the old info with that of the new info.
             * 
             * The responseablity of merging an info will now be split between the parallelizer and the fetchers EG:mangatoto
             * 
             * to acomadte this I will make a function in fetcherSupport.js to help with this. 
             */
            
            /** 
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

            for (let availableLanguage of rawInfoSource.availableLanguages) {
                 
                availableLanguage = availableLanguage.toLowerCase();

                if (rawInfoSource && rawInfoSource[availableLanguage] !== undefined) {
                    if (rawInfoSource[availableLanguage].coverImage && !(Array.isArray(rawInfoSource[availableLanguage].coverImage) && rawInfoSource[availableLanguage].coverImage.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].coverImage = rawInfoSource[availableLanguage].coverImage;
                    }
                    if (rawInfoSource[availableLanguage].coverImageExpire && !(Array.isArray(rawInfoSource[availableLanguage].coverImageExpire) && rawInfoSource[availableLanguage].coverImageExpire.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].coverImageExpire = rawInfoSource[availableLanguage].coverImageExpire;
                    }
                    if (rawInfoSource[availableLanguage].title && !(Array.isArray(rawInfoSource[availableLanguage].title) && rawInfoSource[availableLanguage].title.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].title = rawInfoSource[availableLanguage].title;
                    }
                    if (rawInfoSource[availableLanguage].subtitle && !(Array.isArray(rawInfoSource[availableLanguage].subtitle) && rawInfoSource[availableLanguage].subtitle.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].subtitle = rawInfoSource[availableLanguage].subtitle;
                    }
                    if (rawInfoSource[availableLanguage].description && !(Array.isArray(rawInfoSource[availableLanguage].description) && rawInfoSource[availableLanguage].description.length === 0)) {// this if statment checks if the input is mot default
                        infoSource.description = rawInfoSource.description;
                    }
                    if (rawInfoSource[availableLanguage].status && !(Array.isArray(rawInfoSource[availableLanguage].status) && rawInfoSource[availableLanguage].status.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].status = rawInfoSource[availableLanguage].status;
                    }
                    if (rawInfoSource[availableLanguage].totalChapters && !(Array.isArray(rawInfoSource[availableLanguage].totalChapters) && rawInfoSource[availableLanguage].totalChapters.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].totalChapters = rawInfoSource[availableLanguage].totalChapters;
                    }
                    if (rawInfoSource[availableLanguage].chapterTitles && !(Array.isArray(rawInfoSource[availableLanguage].chapterTitles) && rawInfoSource[availableLanguage].chapterTitles.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].chapterTitles = rawInfoSource[availableLanguage].chapterTitles;
                    }
                    if (rawInfoSource[availableLanguage].chapterUploader && !(Array.isArray(rawInfoSource[availableLanguage].chapterUploader) && rawInfoSource[availableLanguage].chapterUploader.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].chapterUploader = rawInfoSource[availableLanguage].chapterUploader;
                    }
                    if (rawInfoSource[availableLanguage].chapterLength[chapter] && !(Array.isArray(rawInfoSource[availableLanguage].chapterLength[chapter]) && rawInfoSource[availableLanguage].chapterLength[chapter].length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].chapterLength[chapter] = rawInfoSource[availableLanguage].chapterLength[chapter];
                    }
                    if (rawInfoSource[availableLanguage].chapterLinks && !(Array.isArray(rawInfoSource[availableLanguage].chapterLinks) && rawInfoSource[availableLanguage].chapterLinks.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].chapterLinks = rawInfoSource[availableLanguage].chapterLinks;
                    }
                    if (rawInfoSource[availableLanguage].chapterLinksExpire && !(Array.isArray(rawInfoSource[availableLanguage].chapterLinksExpire) && rawInfoSource[availableLanguage].chapterLinksExpire.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].chapterLinksExpire = rawInfoSource[availableLanguage].chapterLinksExpire;
                    }
                    if (rawInfoSource[availableLanguage].pictureLinks[chapter] && !(Array.isArray(rawInfoSource[availableLanguage].pictureLinks[chapter]) && rawInfoSource[availableLanguage].pictureLinks[chapter].length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].pictureLinks[chapter] = rawInfoSource[availableLanguage].pictureLinks[chapter];
                    }
                    if (rawInfoSource[availableLanguage].pictureLinksExpire && !(Array.isArray(rawInfoSource[availableLanguage].pictureLinksExpire) && rawInfoSource[availableLanguage].pictureLinksExpire.length === 0)) {// this if statment checks if the input is mot default
                        infoSource[availableLanguage].pictureLinksExpire = rawInfoSource[availableLanguage].pictureLinksExpire;
                    }
                } else {
                    console.error(`could not find info for ${availableLanguage} and as such it will be skipped`);
                }
            }
            if (chapter == 0) {
                console.warn("chapter = 0. This is a vaild input but mangaScraper also uses it as a fallback. So take this as a good chance to check that you are actually inputing chapter")
            }
            */
        }
        
        
        // Stage 3 Modify infoSources
        
        infoSources[infoSourceIndex] = rawInfoSource;
        return infoSources;
    }

    async parallelizeRequests(item, language, chapter, requestGroup, infoSources) {
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

                this.distributeRequest(item, language, chapter, requestGroup[i], infoSources)
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
            const responses = await Promise.all(parallelRequests);  // IS LIST OF LIST will need to handle better
            return responses[0]; // Return responses when all requests are completed THE [0] is temp!!!
        } catch (error) {
            throw error; // Throw any error that occurs during requests
        }
    }
}