
export class ParserHelpers{

    static findElementByText(elements, text) {
        /**
         * Finds an element within a collection based on its text content.
         * @param {NodeList} elements - The collection of elements to search within.
         * @param {string} text - The text to search for within the elements.
         * @returns {Element|null} - The first element found containing the specified text, or null if not found.
         */
        return Array.from(elements).find(element => element.textContent.includes(text));
    }
    static findElementBySubtext(elements, subtext) {
        /**
         * Finds an element within a collection based on its subtext content.
         * @param {NodeList} elements - The collection of elements to search within.
         * @param {string} subtext - The subtext to search for within the elements.
         * @returns {Element|null} - The first element found containing the specified subtext, or null if not found.
         */
        return Array.from(elements).find(element => element.textContent.includes(subtext));
    }
}