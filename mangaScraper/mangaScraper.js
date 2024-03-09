// mangaScraper.js
import { MetaHandler, RequestHandler }  from './mangaScraperHelper.js';


export class MangaSearch {
    static search() {
        // Implement MangaSearch search method if needed
    }
}

export class Manga {
    constructor() {
        this.metahandler = new MetaHandler();
        this.requesthandler = new RequestHandler();

        this.sourceRank = []; 
        
        // INFO
        
        this.infoSources = [];
        /** eg: [
         *       {source: "mangatoto",
         *        id: 0,
         *        link: "https://mangatoto.com/series/145319/huh-i-m-just-a-normal-girl-official", 
         *        authors: [{name: "Hana tsukiyuki"}],
         *        artists: [{name: "Rika fujiwara"}],
         *        genres: ["Manga", "Josei(W)", etc],
         *        originalLanguage: "japanese",
         *        availableLanguages: ["english"],
         *        displayMethod: "",
         *        views: 840,
         *  
         *        ratings: None,
         *        totalReviews: 0,
         *  
         *        english: {
         *                    coverImage: "https://xfs-s118.batcg.org/thumb/W600/ampi/1c6/1c679bce242b7f87bfc26d21ccb90c0893bbe395_1055_1500_282809.jpeg?acc=ybn6ysz7iXKqzrd5YGFiLQ&exp=1703898342",
         *                    coverImageExpire : True
         *                    title: "Huh? I'm just a normal girl! [Official]", 
         *                    subtitle: "えっ? 平凡ですよ?? / E? Heibon Desu yo?? / Huh? Everything Is Normal Here", 
         *                    description: "Yukari Tachibana, a normal high school girl who lost her life in a traffic accident. Upon waking up, she found herself reincarnated as the daughter of an Earl in another world! In spite of that, the family she was born to is quite poor. In order to improve the conditions of her second life, Yukari begins to use knowledge from her previous life...?!",
         *                    status: "Ongoing"
         *                    totalChapters: 6,
         *                    chapterTitles: ["Volume 1 Chapter 1", "Volume 1 Chapter 2", etc],
         *                    chapterUploader: [{name: "Rika fujiwara"}],
         *                    totalPictures: [26, 24, etc], // How many pictures are in a chapter
         *                    chapterLinks: ["https://mangatoto.com/chapter/2625924", "https://mangatoto.com/chapter/2644871", etc],
         *                    chapterLinksExpire : False
         *                    pictureLinks: [
         *                                     ["https://xfs-s103.batcg.org/comic/7006/119/657ec22673fc47c1f41a6911/43642984_1080_1535_426892.webp?acc=MAXx2m-8AO2lHdrUEBEtqA&exp=1703890123", "https://xfs-hd03.batcg.org/comic/7006/119/657ec22673fc47c1f41a6911/43642983_1080_1535_394896.webp?acc=7-sQFqWcnh74ndYEV2i29w&exp=1703890123", etc],
         *                                     ["https://xfs-s105.batcg.org/comic/7006/5cb/658eb5fa32142277297e8bc5/44505463_1080_1535_293932.webp?acc=9vAjbokEV_EaOJ64N6xRUw&exp=1703890405", "https://xfs-s122.batcg.org/comic/7006/5cb/658eb5fa32142277297e8bc5/44505464_1080_1535_273214.webp?acc=f4MaX7vFrpoAOsASEm9NPA&exp=1703890405", etc], 
         *                                     etc
         *                                    ]
         *                    pictureLinksExpire : True
         *                   }
         *       }
         *     ]
         */
    }


    async update(items, langauge = null, chapter = null, maxParallelRequests = 2) {

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
        // Add check here to make sure that items[i] = vaild string (I dont know the full list now) ; )
        // for item in items:
        for (let item of items) {
            
            let allItemInfo = [];
            allItemInfo = this.metahandler.getAllItems(item, langauge, chapter, this.infoSources);

            /**
             * If the following check has failed this means that there is none of that info locally and we need to do a network request
             */
            if (allItemInfo.length == 0){
                
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
                let rawRequestOrder = this.sourceRank;
                let requestOrder = [];
                for (let rank of rawRequestOrder) {
                    let requestItem = [];
                    while(rank.length > 0){
                        if (requestItem.length == maxParallelRequests) {
                            requestOrder.push(requestItem);
                            requestItem = [];
                        }
                        requestItem.push(rank[0]);
                    }
                    requestOrder.push(requestItem);
                }
                for (let requestGroup of requestOrder) {
                    console.log(item);
                    console.log()
                    let parallelRequestsOut = this.requesthandler.parallelRequests(item, langauge, chapter, requestGroup, this.infoSources);
                    if (parallelRequestsOut !== null) {
                        this.infoSources = parallelRequestsOut;
                    }
                    if (this.metahandler.getAllItems(item, langauge, chapter, this.infoSources.length !== 0)) {
                        break;
                    }
                }
            }
        }
    }

    get(item, langauge = null, chapter = null) {
        let allItemInfo = this.metahandler.getAllItems(item, langauge, chapter, this.infoSources);

        return allItemInfo;
    }
}

