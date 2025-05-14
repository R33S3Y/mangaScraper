import { Templater } from './templater.js';

export class InfoSourceHelper{

    static countItem(item, language = null, chapter = null, infoSources, calledInternally = false){
        /**
         * Counts the occurrences of a specified item within information sources.
         * @param {string} item - The type of item to count occurrences for.
         * @param {string} language - The language of the items to consider. Default is `null`.
         * @param {number} chapter - The chapter of the items to consider. Default is `null`.
         * @param {Array} infoSources - An array of information sources to search within.
         * @param {boolean} calledInternally - Internal flag indicating whether the function is called internally. Default is `false`.
         * @returns {number} - The count of occurrences of the specified item.
         * 
         * @example
         * const count = countItem("exampleItem", "eng", 1, infoSourcesArray, false);
         * console.log(count);
         */

        //gets all items
        let itemValues = [];

        for (let i = 0; i < infoSources.length; i++) {
            if (infoSources[i].hasOwnProperty(item)) {
                itemValues.push(infoSources[i][item]);
            } else {
                for (let prop in infoSources[i]) {
                    if (typeof infoSources[i][prop] === 'object' && prop === language.toLowerCase()) {
                        
                        itemValues = itemValues.concat(this.countItem(item, language, chapter, [infoSources[i][prop]], true));
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
            for (let value of itemValues) {
                if (Array.isArray(value)) {
                    if (value[chapter] && !(Array.isArray(value[chapter]) && value[chapter].length === 0)) {
                        vaildItems.push(value[chapter]);
                    }
                } else {
                    console.warn(`item is ${item} & value is not list!!! value: ${value}`);
                }
            }
        } else {
            for (let value of itemValues) {
                if (value && !(Array.isArray(value) && value.length === 0)) {
                    vaildItems.push(value);
                }
            }
        }
        return vaildItems.length;
    }

    static getItems(item, language = null, chapter = null, infoSources, fallbackLanguage = this.config.fallbackLanguage, 
        alwaysOutput = this.config.alwaysOutput, justChapter = this.config.justChapter){
        /**
         * Retrieves items from information sources based on specified criteria.
         * @param {string} item - The type of item to retrieve.
         * @param {string} language - The language of the items to retrieve. Default is `null`.
         * @param {number} chapter - The chapter of the items to retrieve. Default is `null`.
         * @param {Array} infoSources - An array of information sources from which to retrieve items.
         * @param {boolean} fallbackLanguage - Whether to use fallback language if the specified language is not available. Default is `false`.
         * @param {boolean} alwaysOutput - Whether to always include output, even if no valid items are found. Default is `true`.
         * @param {boolean} justChapter - Whether to retrieve only items related to a specific chapter. Default is `false`.
         * @param {boolean} calledInternally - Internal flag indicating whether the function is called internally. Default is `false`.
         * @returns {Array} - An array of objects representing the retrieved items.
         * 
         * @example
         * const items = getItems("exampleItem", "eng", 1, infoSourcesArray, false, true, false, false);
         * console.log(items);
         */
        let vaildItems = [];
        for (let info of infoSources) {
            if (item in info && info[item]) {
                vaildItems.push({
                    "item": info[item],
                    "id": `${info.source}-${info.id}`
                });
                continue;
            } 
            let langInfo = info[language] || (fallbackLanguage ? info.fallback : null);
            if (langInfo && item in langInfo && langInfo[item]) {
                if ((item === "chapterLength" || item === "pictureLinks") && !langInfo[item][chapter]) continue;
                vaildItems.push({
                    "item": langInfo[item],
                    "id": `${info.source}-${info.id}`
                });
            }
        }
        

        if (vaildItems.length === 0 && alwaysOutput === true) {
            let template = Templater.makeBaseTemplate(oldInfo);
            template[language] = Templater.makeLanguageTemplate(false, false, false);

            if (item in template) {
                vaildItems.push({
                    "item": template[item],
                    "id": ""
                });
            } else if (item in template[language]) {
                vaildItems.push({
                    "item": template[language][item],
                    "id": ""
                });
            } else {
                vaildItems.push({
                    "item": "",
                    "id": ""
                });
            }
        }
        return vaildItems;
    }

    static getInfo(source, infoSources) {
        /**
         * Retrieves information from the provided list of infoSources based on the specified source.
         * @param {string} source - The identifier for the information source.
         * @param {Array} infoSources - An array of information sources to search within.
         * @returns {object|null} - The information object corresponding to the provided source, or null if not found.
         * 
         * @example
         * const sourceInfo = getInfo("source-ID", infoSourcesArray);
         * console.log(sourceInfo);
         */

        // Stage 0 create useful vars

        if (source == null) {
            return null;
        }
        
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        // Stage 1 get correct dict from the list infoSources 
        let info = null;
        
        for (let i in infoSources) {
            if (infoSources[i].id == rawID && infoSources[i].source == rawSource){
                // Found dict
                info = infoSources[i];
                return info;
            }
        }

        console.error(`couldn't find ${source} in infoSources`);
        return null;
    }

    static getInfoIndex(source, infoSources) {
        /**
         * Retrieves the index of the information source within the provided list of infoSources based on the specified source.
         * @param {string} source - The identifier for the information source.
         * @param {Array} infoSources - An array of information sources to search within.
         * @returns {number|null} - The index of the information source within the infoSources array, or null if not found.
         * 
         * @example
         * const index = getInfoIndex("source-ID", infoSourcesArray);
         * console.log(index);
         */
        
        if (source == null) {
            return null;
        }
        
        // Stage 0 create useful vars
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        // Stage 1 get correct dict from the list infoSources 
        for (let i in infoSources) {
            if (infoSources[i].id == rawID && infoSources[i].source == rawSource){
                // Found dict
                return i;
            }
        }

        console.error(`couldn't find ${source} in infoSources`);
        return null;
    }
}