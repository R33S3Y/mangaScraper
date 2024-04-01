
export class ParserHelpers{
    findElementByText(elements, text) {
        return Array.from(elements).find(element => element.textContent.includes(text));
    }
    findElementBySubtext(elements, subtext) {
        return Array.from(elements).find(element => element.textContent.includes(subtext));
    }
}