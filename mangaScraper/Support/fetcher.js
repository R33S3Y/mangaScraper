
export class Fetcher {
    async site(link) {
        /**
         * Fetches the content of a website and returns the parsed HTML document, or null if failed.
         * @param {string} link - The URL of the website to fetch.
         * @returns {Document|null} - The parsed HTML document of the website, or null if the fetch failed.
         * 
         * @example
         * const htmlDoc = await fetcher.site(link);
         * if (htmlDoc) {
         *     console.log("Website fetched successfully:", htmlDoc);
         * } else {
         *     console.error("Failed to fetch website:", link);
         * }
         */

        // Fetch the website content
        let response = await fetch(link);
              
        if (!response.ok) {
            console.error(`Couldn't access ${link} status code: ${response.status}`);
            return null;
        }

        let html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html', { contentType: 'text/html', scripting: 'disabled' });
    
        return doc;
    }
}