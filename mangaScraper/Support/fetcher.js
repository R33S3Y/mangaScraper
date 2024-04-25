
export class Fetcher {
    async site(link) {
        /**
         * Fetchs site amd returns parsed html or null if failed
         * @param {String} link
         * 
         * @example let html = fetcher.site(link);
         */
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