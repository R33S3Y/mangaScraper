// Support
import { InfoSourceHelper } from './Support/infoSourceHelper.js';

// Fetchers
import { Mangatoto }  from './Fetchers/mangatoto.js';


export class RequestHandler{
    constructor() {
        // Support
        this.infoSourceHelper = new InfoSourceHelper();
        // Fetchers
        this.mangatoto = new Mangatoto();

    }
    async distributeRequest(item, langauge, chapter, source, info) {
        // Stage 0 create useful vars
        let dashIndex = source.indexOf('-');
        let rawID = dashIndex !== -1 ? source.substring(dashIndex + 1) : source;
        let rawSource = dashIndex !== -1 ? source.substring(0, dashIndex) : source;

        // Stage 1 call module functions

        // Mangatoto.js
        if (rawSource == this.mangatoto.source) {
            let inPictureSupport = ["pictureLinks", "chapterLength"];
            if (inPictureSupport.includes(item)) {
                info = await this.mangatoto.picture(info, chapter, langauge);
            } else {
                info = await this.mangatoto.info(info);
            }
        }

        // We throw error here to stop it from being added to 
        if (info == null) {
            throw new console.error("Variable 'info' cannot be null.");
        }

        return info;
    }

    async parallelizeRequests(item, language, chapter, requestGroup, infoSources) {
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
                this.distributeRequest(item, language, chapter, requestGroup[i], info)
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
            let responses = await Promise.all(parallelRequests);  // IS LIST OF LIST will need to handle better  - Fixed 6/4/24
            // responeses now acts as mini infoSources with the updated info

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