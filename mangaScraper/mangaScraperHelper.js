
import { Mangatoto }  from './mangatoto.js';


export class MetaHandler{
    
    makeMetaInfo(infoSources) {

        let mangaSource = ["mangatoto"];

        // Create an array of objects containing the info and its corresponding rating index
        let infoWithIndexes = infoSources.map(item => ({
            source: item.source,
        index: mangaSource.indexOf(item.info)
        }));

        // Sort the array based on rating index in ascending order
        infoWithIndexes.sort((a, b) => a.index - b.index);

        // Extract the sorted indexes
        let bestId = [];
        let bestIndex = infoWithIndexes.map(item => item.index);
        for (let i of bestIndex) {
            bestId.push([`${infoSources[i].source}-${infoSources[i].id}`]);
        }
        let metaInfo = {
            requests: {type: "rank", info: bestId},
            link: {type: "rank", info: bestId},
            authors: {type: "accumulativeMinusMatchs", info: null},
            artists: {type: "accumulativeMinusMatchs", info: null},
            genres: {type: "accumulativeMinusMatchs", info: null},
            originalLanguage: {type: "rank", info: bestId},
            availableLanguages: {type: "rank", info: bestId},
            displayMethod: {type: "rank", info: bestId},
            views: {type: "addition", info: null},
            
            ratings: {type: "mean", info: "totalReviews"},
            totalReviews: {type: "addition", info: null},
            
            english: {
                coverImage: {type: "rank", info: bestId},
                coverImageExpire: {type: "sameSource", info: "english.coverImage"},
                title: {type: "rank", info: bestId},
                subtitle: {type: "rank", info: bestId},
                description: {type: "rank", info: bestId},
                status: {type: "rank", info: bestId},
                totalChapters: {type: "greater", info: null},
                chapterTitles: {type: "rank", info: bestId},
                chapterUploader: {type: "sameSource", info: "english.totalChapters"},
                chapterLengths: {type: "sameSource", info: "english.totalChapters"},
                chapterLinks: {type: "sameSource", info: "english.totalChapters"},
                chapterLinksExpire : {type: "sameSource", info: "english.totalChapters"},
                pictureLinks: {type: "sameSource", info: "english.totalChapters"},
                pictureLinksExpire : {type: "sameSource", info: "english.totalChapters"},
            }
        }
        console.log(metaInfo);
        return metaInfo;
    }
    getBestItem(allItemInfo, meta, metaInfo, snapBack = 0) {
        /**
         * This function uses the metadata to determine how to handle to it here a breif description:
         * 
         * addition - int or float - add all sources togeter and outputs the total
         * accumulativeMinusMatchs - list - merges all the list together and removes any matches
         * greater - int or float - find the biggest value
         * rank - any - uses info in metadata to detremine what's the best option
         * mean - num - adds means togetter while keeping the averages blanced
         * sameSorce - any - do the same as x other thing as stated in metadata info 
         * 
         */
        if (meta.type  == "addition"){
            let total = 0;
            for (let itemInfo of allItemInfo){
                total += itemInfo.info;
            }
            // adds everything in list.info togetter
            return total;

        } if (meta.type == "accumulativeMinusMatchs") {
            let accumulative;
            for (let itemInfo of allItemInfo){
                
                for (let listItem of itemInfo.info) {
                    let match = false;
                    for (let accumulativeItem of accumulative) {
                        if (accumulativeItem == listItem) {
                            match = true;
                        }
                    }
                    if (match == false) {
                        accumulative.push(listItem);
                    }
                }
            }
            // accumulates everything together except when something matches
            return accumulative;

        } if (meta.type == "greater") {
            let biggestItem = 0;
            for (let itemInfo of allItemInfo) {
                if (itemInfo.info > biggestItem) {
                    biggestItem = itemInfo.info;
                }
            }
            // greatest item
            return biggestItem;

        } if (meta.type == "rank") {
            let flattenedRank = []
    
            meta.info.forEach(function (row) {
                if (Array.isArray(row)) {
                    flattenedRank = flattenedRank.concat(row);
                } else {
                    flattenedRank.push(row);
                }
            });

            for (let targetId in flattenedRank) {
                for (const dictionary of allItemInfo) {
                    if (dictionary.id === targetId) {
                        return dictionary.info;
                    }
                }
            }
            console.error("No vaild info meeting rank")
            return null;
            
        } if (meta.type == "mean") {
            let allMeanInfo = metaInfo[meta.info];
            let mergedList = [];
                // Iterate over the first list
                allItemInfo.forEach(item1 => {
                // Find matching item in the second list
                let matchingItem = allMeanInfo.find(item2 => item2.id === item1.id);
                
                // If a match is found, merge properties and add to the merged list
                if (matchingItem) {
                    const mergedItem = {avarage: item1.info, count: matchingItem.info };
                    mergedList.push(mergedItem);
                }
            });
            let totalCount = 0;
            let totalavarage = 0;
            for (let item of mergedList) {
                totalCount += item.count;
                totalavarage += item.avarage*item.count;
            }
            //avarage
            return totalavarage/totalCount;

        } if (meta.type == "sameSource") {
            snapBack += -1;
            if (snapBack == 0) { // snapBack is used to track how many time getBestItem has called itself. Used to stop infinte loops
                console.error("ERROR: forced to snapback 2 sameSources are pointing at eachother or sameSources are very indrectly formated");
                return null;
            } else {
                return this.__getBestItem(allItemInfo, metaInfo[meta.info], metaInfo, snapBack);
            }
        }
    }
    getAllItems(item, infoSources){
        let allItemInfo = [];
        let tempInfoSources = [];
        // if item in langauge filter info
        if (item.includes(".")) {
            // item in langauge
            let langauge = item.substring(0, item.indexOf('.'));
            for (let info of infoSources) {
                for (let availableLanguage of info.availableLanguages) {
                    if (langauge == availableLanguage){
                        tempInfoSources.push(info);
                    }
                }
            }
        } else {
            // not in langauge
            tempInfoSources = infoSources;
        }
        
        for (let info of tempInfoSources) {
            if (info[item] == null || info[item] == undefined || info[item] == "" || info[item].length == 0) {
                //input is invaild
                continue;
            }
            allItemInfo.push({"info": info[item], "id": `${info.source}-${info.id}`});
        }
        return allItemInfo;
    }

}
export class RequestHandler{
    constructor() {
        this.mangatoto = new Mangatoto();
    }
    async request(item, source, chapter, infoSources) {

        // Stage 0 create useful vars
        let dotIndex = item.indexOf('.');
        let rawItem = dotIndex !== -1 ? item.substring(dotIndex + 1) : item;
        let rawLangauge = dotIndex !== -1 ? item.substring(0, dotIndex) : item;

        let dashIndex = source.indexOf('-');
        let rawID = dotIndex !== -1 ? source.substring(dotIndex + 1) : source;
        let rawSource = dotIndex !== -1 ? source.substring(0, dotIndex) : source;

        // Stage 1 get correct dict from the list infoSources 
        let infoSource = null;
        for (let infoSourceTest of infoSources) {
            if (infoSourceTest.id == rawID && infoSourceTest.source == rawSource){
                // Found dict
                infoSource = infoSourceTest;
                break;
            }
        }
        if (infoSource == null) { // ERROR check
            console.error(`couldn't find ${source} in infoSources`);
            return null;
        }

        // Stage 2 call module functions
        let newInfoSource;
        if (rawSource == this.mangatoto.source) {
            let inPictureSupport = ["pictureLinks", "chapterLength"];
            if (inPictureSupport.includes(item)) {
                newInfoSource = await this.mangatoto.picture(infoSource, chapter, rawLangauge);
            } else {
                newInfoSource = await this.mangatoto.info(infoSource);
            }
        }

        // Stage 3 Modify infoSources


        // Stage 4 packup
    }
}