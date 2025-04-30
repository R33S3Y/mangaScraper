
import { InfoSourceHelper } from './support/infoSourceHelper.js';
import { Templater } from './support/templater.js';
import { Merge } from './support/merger.js';

// fetchers
import { Mangatoto }  from './fetchers/mangatoto.js';


export class MangaSearch {
    constructor() {
        this.merge = new Merge();
        this.requesthandler = new RequestHandler();

        // Default configuration
        this.config = {
            askRound: 0,
            maxParallelRequests: 2,
            allowDoubleQuerying: true,
            runCallbackOnError: false,
            language : null
        }

        this.lastQuery = "";
        this.allSources = ["mangatoto"];
        this.availableSources = []; // e.g., [{source: "mangatoto", askround: 0}]
    }

    // Method to update the configuration
    updateConfig(config = {}) {
        config = this.merge.info(this.config, config);

        this.config = config;
        
        this.merge.updateConfig(config);
        this.requesthandler.updateConfig(config);
        return;
    }

    // Main search method
    async search(query, callback = null) {
        
        // Error checking for query and callback
        if (typeof query !== "string" || query === "") {
            return null;
        }
        if (typeof callback !== "function" && callback !== null) {
            return null;
        }

        // If the query is new, reset sources and update the last query
        if (query !== this.lastQuery) {
            this.availableSources = []; // Reset sources
            this.lastQuery = query;
            for (let i of [...this.allSources]) {
                this.availableSources.push({ source: i, askRound: 0 });
            }
        }

        // Function to get a group of requests based on max parallel requests
        const getRequestGroup = (max) => {
            this.availableSources.sort((a, b) => a.askRound - b.askRound);

            let requestGroup = this.availableSources.slice(0, max);

            for (let i = 0; i < requestGroup.length; i++) {
                this.availableSources[i].askRound++;
            }

            return JSON.parse(JSON.stringify(requestGroup));
        };

        let requestGroup = getRequestGroup(this.config.maxParallelRequests);

        // Allow double querying if enabled in the config
        if (this.config.allowDoubleQuerying === true && requestGroup.length < this.config.maxParallelRequests) {
            while (requestGroup.length < this.config.maxParallelRequests) {
                requestGroup = requestGroup.concat(getRequestGroup(this.config.maxParallelRequests - requestGroup.length));
            }
        }

        // Function to create Manga objects from the response
        const makeMangaClass = (response, source) => {
            if (response.length === 0) {
                // Remove source if the response is empty
                this.availableSources = this.availableSources.filter(item => item.source !== source);
            }
            let result = [];
            for (let item of response) {
                let manga = new Manga();
                manga.sourceRank = [[`${item.source}-${item.id}`]];
                manga.infoSources = [item];
                manga.updateConfig({language : this.config.language});
                result.push(manga);
            }

            return result;
        }

        // Create promises for each request in the request group
        let promises = requestGroup.map((groupItem) => {
            return this.requesthandler.distributeSearchRequest(query, groupItem.askRound, groupItem.source)
                .then(response => [response, groupItem.source])
                .catch(error => {
                    if (this.config.runCallbackOnError) {
                        return Promise.reject({ status: 'rejected', reason: error, source: groupItem.source });
                    }
                    return Promise.reject(error);
                });
        });

        // If no callback is provided, return the results directly
        if (callback === null) {
            let settledPromises = await Promise.allSettled(promises);
            let results = [];
            settledPromises.forEach(p => {
                if (p.status === "fulfilled") {
                    results.push(...makeMangaClass(p.value[0], p.value[1]));
                }
            });
            return results;
        }

        // If a callback is provided, handle the results and errors using the callback
        for (const promise of promises) {
            try {
                const resolvedPromise = await promise;
                let result = makeMangaClass(resolvedPromise[0], resolvedPromise[1]);

                if (this.config.runCallbackOnError === true) {
                    callback({ status: 'fulfilled', value: result });
                } else {
                    callback(result);
                }
            } catch (error) {
                if (this.config.runCallbackOnError === true) {
                    callback({ status: 'rejected', value: error });
                }
                console.error(error);
            }
        }
    }
}

export class Manga {
    constructor() {
        this.infoSourceHelper = new InfoSourceHelper();
        this.requesthandler = new RequestHandler();
        this.templater = new Templater();
        this.merge = new Merge();

        this.sourceRank = []; 
        
        // Config stores all default function params
        this.config = {
            // Manga
             // all
             language : null,
             chapter : 0,
             // get()
             outputAll : false,
             outputSource : false,
            
            // RequestHandler
             // orderRequests()
             maxParallelRequests : 2,

            // InfoSourceHelper
             // getItems
             fallbackLanguage : true,
             alwaysOutput : true,
             justChapter : false
        }
        this.updateConfig();
        // INFO
        
        this.infoSources = [];
    }
    
    updateConfig(config = {}) {
        config = this.merge.info(this.config, config);

        this.config = config;

        this.infoSourceHelper.updateConfig(config);
        this.requesthandler.updateConfig(config);
        this.templater.updateConfig(config);
        this.merge.updateConfig(config);
        return;
    }

    async update(items, language = this.config.language, chapter = this.config.chapter) {
        /**
         * returns nothing. Just updates the value of the item requested
         * @param {Array} item - list of names of the items you want to get update
         * @param {string} language - the language of the info you want
         * @param {Int} chapter - what chapter do you want the info from.
         * @param {Int} maxParallelRequests - how many requests can the function make in parallel
         * 
         * @example await manga.update(["pictureLinks","title"], "english", chapter);
         */

        // Check that items is vaild
        let standaloneOutput = false;
        if (Array.isArray(items) == false) {
            if (typeof items !== "string") {
                console.error("Invalid input: Manga.request() needs items to be list or string");
                return null;
            }
            standaloneOutput = true;
            items = [items];
        }
        // add check that sourceRank is array
        // Add check here to make sure that items[i] = vaild string (I dont know the full list now) ; )
        // for item in items:
        for (let item of items) {
            /**
             * If the following check has failed this means that there is none of that info locally and we need to do a network request
             */
            if (this.infoSourceHelper.countItem(item, language, chapter, this.infoSources) == 0){

                /**
                 * The following code attempts to use the genric ranking from "this.metaInfo.request.info" (Yes I know I amazing at naming things!! :3 ) 
                 * to determine the best order to do the requests.
                 * 
                 * This work by: having the input of "this.metaInfo.request.info" be a list of list containg the source-ID 
                 * the main list determines the rank of the item. therefore if there are mutpile items in the same rank they can be requested in parallel
                 * there's a var ("maxParallelRequests") that determines the max ammount of parallel requests. Here and example of it
                 * 
                 * this.metaInfo.request.info (input) = 
                 *      [[item1, item2, item3],     Rank1
                 *      [item4],                    Rank2
                 *      [item5, item6]]             Rank3
                 * 
                 * maxParallelRequests (also input) = 2
                 * 
                 * requestOrder (Output) = [
                 *      [item1, item2]
                 *      [item3]
                 *      [item4]
                 *      [item5, item6]
                 *      ]
                 * 
                 * Here you can see an example of it working properly
                 * 
                 * As you can see it limits amount of items in a sublist to "maxParallelRequests"
                 * Although as you can see it intentionally avoided merging ranks to fill requests.
                 * This is intentional although I may add a flag/setting to merge.
                 */

                let requestOrder = this.requesthandler.orderUpdateRequests(this.sourceRank);

                //Make request
                for (let requestGroup of requestOrder) {
                    let parallelRequestsOut = await this.requesthandler.parallelizeUpdateRequests(item, language, chapter, requestGroup, this.infoSources);
                    if (parallelRequestsOut !== null) {
                        this.infoSources = parallelRequestsOut;
                        if (this.infoSourceHelper.countItem(item, language, chapter, this.infoSources) !== 0) {
                            break;
                        }
                    }
                }
            }
        }
    }

    get(item, language = this.config.language, chapter = this.config.chapter, outputAll = this.config.outputAll,
        outputSource = this.config.outputSource, fallbackLanguage = this.config.fallbackLanguage, 
        alwaysOutput = this.config.alwaysOutput, justChapter = this.config.justChapter) {
        /**
         * Retrieves information for the specified item from manga sources.
         * @param {string} item - The name of the item to retrieve.
         * @param {string} language - The language of the information.
         * @param {number} [chapter=0] - The chapter number to retrieve information from.
         * @param {boolean} [outputAll=false] - If true, outputs a list of all values.
         * @param {boolean} [outputSource=false] - If true, outputs dictionaries containing item and id.
         * @param {boolean} [fallbackLanguage=true] - If true, falls back to default language when requested language info is not available.
         * @param {boolean} [alwaysOutput=true] - If true, always outputs information, even if it's empty.
         * @param {boolean} [justChapter=false] - If true, retrieves information for just the specified chapter.
         * @returns {*} The retrieved information.
         * @example
         * let pictureLinks = Manga.get("pictureLinks", "english", chapter);
         */

        //get all info
        let hold = this.infoSourceHelper.getItems(item, language, chapter, this.infoSources, fallbackLanguage, alwaysOutput, justChapter);

        if (!hold.item) {
            return "";
        }
        
        //sort data
        let flatSourceRank = this.sourceRank.reduce((acc, curr) => {
            return acc.concat(curr);
        }, []);
        let reorderedData = flatSourceRank.map(id => {
            return hold.find(item => item.id === id);
        });

        // makes it so the list is only 1 item long
        if (outputAll === false) {
            reorderedData = [reorderedData[0]];
        }

        // removes dict
        if (outputSource === false) {
            for (let i = 0; i < reorderedData.length; i++) {
                reorderedData[i] = reorderedData[i].item;
            }
        }

        // removes list
        if (outputAll === false) {
            reorderedData = reorderedData[0];
        }

        return reorderedData;
    }   
    
    template(source = null, language = this.config.language) {
        /**
         * Generates complete template over top a current source
         * @param {string} source - used as ID
         * @param {string} language - the language to make the template
         * 
         * @example manga.template();
         */

        //make vars
        let newInfo;
        let oldInfo;

        // getold info
        oldInfo = this.infoSourceHelper.getInfo(source, this.infoSources);

        let rawID = 0;
        let rawSource = "";

        if (source !== null) {
            let dashIndex = source.indexOf('-');
            rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
            rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;
        }


        if (oldInfo == null) {
            // no source
            oldInfo = {
                source : rawSource,
                id : rawID,
                link : ""
            }
        } 

        newInfo = this.templater.makeBaseTemplate(oldInfo);
        newInfo[language] = this.templater.makeLanguageTemplate(false, false, false);


        // get index
        let i = this.infoSourceHelper.getInfoIndex(source, this.infoSources);

        let mergedinfo = this.merge.info(oldInfo, newInfo);

        if (i == null) {
            //source is new
            this.infoSources.push(mergedinfo);
            return;
        }
        
        this.infoSources[i] = mergedinfo;
        return;
        
    }
}

class RequestHandler{
    constructor() {
        // Support
        this.infoSourceHelper = new InfoSourceHelper();
        // Fetchers
        this.mangatoto = new Mangatoto();

        this.config = {};
    }

    updateConfig(config) {
        config = JSON.parse(JSON.stringify(config));

        this.config = config;

        this.mangatoto.updateConfig(config);
        return;
    }

    orderUpdateRequests(sourceRank) {
        let rawRequestOrder = JSON.parse(JSON.stringify(sourceRank)); // This is done to make a deep copy of sourceRank
        let requestOrder = [];

        for (let rank of rawRequestOrder) {

            let requestItem = [];
            while(rank.length !== 0){

                if (requestItem.length >= this.config.maxParallelRequests) {
                    requestOrder.push(requestItem);
                    requestItem = [];
                }
                requestItem.push(rank[0]);
                rank.shift()
            }

            requestOrder.push(requestItem);
        }
        return requestOrder;
    }


    async distributeUpdateRequest(item, language, chapter, source, info) {
        // Create useful vars
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        // Mangatoto.js
        if (rawSource == this.mangatoto.source) {
            let inPictureSupport = ["pictureLinks", "chapterLength"];
            if (inPictureSupport.includes(item)) {
                info = await this.mangatoto.picture(info, chapter, language);
            } else {
                info = await this.mangatoto.info(info);
            }
        }

        // We throw error here to stop it from being added to 
        if (info == null) {
            console.error("Variable 'info' cannot be null.");
        }

        return info;
    }

    async distributeSearchRequest(query, askRound, source) {
        // Stage 0 create useful vars
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        let result;

        // Mangatoto.js
        if (rawSource == this.mangatoto.source) {
            result = await this.mangatoto.search(query, askRound);
        }

        // We throw error here to stop it from being added to 
        if (result == null) {
            console.error("Variable 'result' cannot be null.");
        }

        return result;
    }

    async parallelizeUpdateRequests(item, language, chapter, requestGroup, infoSources) {
        if (!Array.isArray(requestGroup)) {
            console.error("Invallid Input: requestGroup is not list");
            return null;
        }
        let parallelRequests = [];

        let resolvedRequests = [];
        let rejectedRequests = [];
        // Iterate through the second dimension of requestGroup
        for (let i = 0; i < requestGroup.length; i++) {
            // Create a promise for each request
            const requestPromise = new Promise((resolve, reject) => {
                // Make the request
                let info = this.infoSourceHelper.getInfo(requestGroup[i], infoSources);
                this.distributeUpdateRequest(item, language, chapter, requestGroup[i], info)
                    .then(response => {
                        resolvedRequests.push(requestGroup[i]);
                        resolve(response); // Resolve the promise with the response
                    })
                    .catch(error => {
                        rejectedRequests.push(requestGroup[i]);
                        reject(error); // Reject the promise if there's an error
                });
            });
            parallelRequests.push(requestPromise); // Add the promise to the array
        }
    
        try {
            // Execute all promises in parallel
            let rawResponses = await Promise.allSettled(parallelRequests);  // IS LIST OF LIST will need to handle better  - Fixed 6/4/24
            
            let responses = [];
            for (let rawResponse of rawResponses) {
                if (rawResponse.status === "fulfilled") {
                    responses.push(rawResponse.value);
                }
            }
            // responses now acts as mini infoSources with the updated info

            // Filters out any requsts with error
            for (let source of resolvedRequests) {
                let info = this.infoSourceHelper.getInfo(source, responses);
                let i = this.infoSourceHelper.getInfoIndex(source, infoSources);
                infoSources[i] = info;
            }
            return infoSources;
            
        } catch (error) {
            throw error; // Throw any error that occurs during requests
        }
    }
}