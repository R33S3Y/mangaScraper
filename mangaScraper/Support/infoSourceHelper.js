
export class InfoSourceHelper{
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
        // The code below verifys that the input meaning that but instead of that it could be very good 
        // to insteed to just inforce haveing defualts
        // Also there's an error in the for loop were the var value = "0" for some reason. 

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