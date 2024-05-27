This markdown document provides documentation for all the functions and files in the Support folder. It is broken up into classes and then the functions it's self. The file's in the Support folder are able to be imported anywhere inside the project as they should be able to work fully without dependencies.

- - - 
# Fetcher
The `Fetcher` class in `fetcher.js` provides utility functions for fetching content from URLs.
## site
Fetches the content of a website and returns the parsed HTML document, or null if the fetch failed.

### Parameters:
- `link` (string): The URL of the website to fetch.

### Returns:
- `Document|null`: The parsed HTML document of the website, or null if the fetch failed.

### Example:
```
const fetcher = new Fetcher();
const link = "https://example.com";
const htmlDoc = await fetcher.site(link);

if (htmlDoc) {
    console.log("Website fetched successfully:", htmlDoc);
} else {
    console.error("Failed to fetch website:", link);
}
```
This method fetches the content of the specified URL using the `fetch` API. If the response is successful (status code 200), the HTML content is parsed into a DOM `Document` object using the `DOMParser` API. If the fetch fails or the response status code is not 200, an error is logged to the console and null is returned.

- - - 
# InfoSourceHelper
The `InfoSourceHelper` class provides utility functions for managing information sources.

## countItem
Counts the occurrences of a specified item within information sources.

### Parameters:
- `item` (string): The type of item to count occurrences for.
- `language` (string): The language of the items to consider. Default is `null`.
- `chapter` (number): The chapter of the items to consider. Default is `null`.
- `infoSources` (Array): An array of information sources to search within.
- `calledInternally` (boolean): Internal flag indicating whether the function is called internally. Default is `false`.

### Returns:
- `number`: The count of occurrences of the specified item.

### Example:
```
const count = countItem("exampleItem", "eng", 1, infoSourcesArray, false);
console.log(count);
```
This method retrieves all items of the specified type from the provided information sources and counts their occurrences. It also supports filtering by language and chapter.

## getItems
Retrieves items from information sources based on specified criteria.

### Parameters:
- `item` (string): The type of item to retrieve.
- `language` (string): The language of the items to retrieve. Default is `null`.
- `chapter` (number): The chapter of the items to retrieve. Default is `null`.
- `infoSources` (Array): An array of information sources from which to retrieve items.
- `fallbackLanguage` (boolean): Whether to use fallback language if the specified language is not available. Default is `false`.
- `alwaysOutput` (boolean): Whether to always include output, even if no valid items are found. Default is `true`.
- `justChapter` (boolean): Whether to retrieve only items related to a specific chapter. Default is `false`.
- `calledInternally` (boolean): Internal flag indicating whether the function is called internally. Default is `false`.

### Returns:
- `Array`: An array of objects representing the retrieved items.

### Example:
```
const items = getItems("exampleItem", "eng", 1, infoSourcesArray, false, true, false, false);
console.log(items);
```
This method retrieves all items of the specified type from the provided information sources based on the specified criteria. It supports filtering by language, chapter, and fallback language.

## getInfo
Retrieves information from the provided list of infoSources based on the specified source.

### Parameters:
- `source` (string): The identifier for the information source.
- `infoSources` (Array): An array of information sources to search within.

### Returns:
- `object|null`: The information object corresponding to the provided source, or null if not found.

### Example:
```
const sourceInfo = getInfo("source-ID", infoSourcesArray);
console.log(sourceInfo);
```
This method retrieves the information object corresponding to the specified source from the provided list of information sources.

## getInfoIndex
Retrieves the index of the information source within the provided list of infoSources based on the specified source.

### Parameters:
- `source` (string): The identifier for the information source.
- `infoSources` (Array): An array of information sources to search within.

### Returns:
- `number|null`: The index of the information source within the infoSources array, or null if not found.

### Example:
```
const index = getInfoIndex("source-ID", infoSourcesArray);
console.log(index);
```
This method retrieves the index of the information source corresponding to the specified source from the provided list of information sources.

- - -
# InputChecker
The `InputChecker` class provides utility functions for performing input checks.

## infoInputCheck
Performs input checks most likely needed for the info function.

### Parameters:
- `info` (object): The input object for the info function.
- `source` (string): The source that this module handles.

### Returns:
- `boolean`: False if input fails checks; otherwise, true.

### Example:
```
if (!this.inputChecker.infoInputCheck(info, this.source)) {
    return null;
}
```
This method checks whether the provided input object for the info function meets certain criteria, including the presence of `source` and `link` properties, and whether the `source` matches the expected source.

## pictureInputCheck
Performs input checks most likely needed for the picture function.

### Parameters:
- `info` (object): Input object for the info function.
- `chapter` (number): Input for the chapter function.
- `language` (string): Input for the language function.
- `source` (string): The source that this module handles.

### Returns:
- `Array`: First item indicates if input fails checks (false) or passes (true); second item indicates if calling the info function can fix the issue (true), otherwise false.

### Example:
```
const [checker, infoFix] = this.inputChecker.pictureInputCheck(info, chapter, language, this.source);
if (!checker) {
    return null;
}
if (infoFix) {
    // Call info function to fix the issue
    const infoResult = this.getInfo(...);
    // Handle infoResult...
}
```
This method checks whether the provided input for the picture function meets certain criteria, including the presence of `source`, `chapter`, and `language`, and whether the `chapterLinks` property is present. If the input fails the checks, it returns an array indicating the issue and whether calling the info function can fix it.

- - - 

# LanguageFinder
The `LanguageFinder` class provides functionality to map between language names and their corresponding ISO 639-3 codes.

## nameToISO
Converts a language name to its corresponding ISO 639-3 code.

### Parameters:
- `name` (string): The name of the language.

### Returns:
- `string|null`: The ISO 639-3 code corresponding to the language name, or null if not found.

### Example:
```
const ISOCode = languageFinder.nameToISO("English");
console.log(ISOCode); // Output: "eng"
```

## ISOToName
Converts an ISO 639-3 code to its corresponding language name.

### Parameters:
- `ISO` (string): The ISO 639-3 code.

### Returns:
- `string|null`: The language name corresponding to the ISO 639-3 code, or null if not found.

### Example:
```
const languageName = languageFinder.ISOToName("eng");
console.log(languageName); // Output: "English"
```

- - - 

# Merge
The `Merge` class provides a method for merging two dictionaries while preserving existing values from the old dictionary.

## info
Merges two dictionaries, preserving existing values from the old dictionary.

### Parameters:
- `oldDict` (object): The original dictionary.
- `newDict` (object): The dictionary containing new values to merge.

### Returns:
- `object`: The merged dictionary.

### Example:
```
const merger = new Merge();
const oldDict = { key1: 'value1', key2: 'value2' };
const newDict = { key2: 'newValue2', key3: 'value3' };
const mergedDict = merger.info(oldDict, newDict);
console.log(mergedDict);
```

This method recursively merges the `newDict` into the `oldDict`, preserving existing values from the `oldDict` where possible. If a key exists in both dictionaries, the value from the `newDict` is used. If a key exists only in the `newDict`, it is added to the merged dictionary.

- - - 

# ParserHelpers
The `ParserHelpers` class provides utility methods for finding elements within a collection based on their text content.

## findElementByText
Finds an element within a collection based on its text content.

### Parameters:
- `elements` (NodeList): The collection of elements to search within.
- `text` (string): The text to search for within the elements.

### Returns:
- `Element|null`: The first element found containing the specified text, or null if not found.

### Example:
```
const parserHelpers = new ParserHelpers();
const elements = document.querySelectorAll('.some-elements');
const foundElement = parserHelpers.findElementByText(elements, 'some text');
console.log(foundElement);
```
This method searches through the provided `elements` collection and returns the first element that contains the specified `text`.

## findElementBySubtext
Finds an element within a collection based on its subtext content.

### Parameters:
- `elements` (NodeList): The collection of elements to search within.
- `subtext` (string): The subtext to search for within the elements.

### Returns:
- `Element|null`: The first element found containing the specified subtext, or null if not found.

### Example:
```
const parserHelpers = new ParserHelpers();
const elements = document.querySelectorAll('.some-elements');
const foundElement = parserHelpers.findElementBySubtext(elements, 'subtext');
console.log(foundElement);
```
This method searches through the provided `elements` collection and returns the first element that contains the specified `subtext`.

- - - 

# Templater
The `Templater` class provides methods for creating templates for manga information.

## makeBaseTemplate
Creates the base template for manga information.

### Parameters:
- `info` (object|null): The information input provided by mangaScraper (optional).

### Returns:
- `object`: The base template for manga information.

### Example:
```
const templater = new Templater();
const newInfo = templater.makeBaseTemplate(info);
console.log(newInfo);
```
This method creates a base template object for manga information, initializing various properties such as `source`, `id`, `link`, `authors`, `artists`, `genres`, `originalLanguage`, `availableLanguages`, `displayMethod`, `views`, `rating`, and `totalReviews`. If the `info` parameter is provided, the `source` and `link` properties are populated with values from the provided information.

## makeLanguageTemplate
Creates a sub-template for manga information in a specific language.

### Parameters:
- `coverImageExpire` (boolean): Indicates whether the cover image expires (defaults to true).
- `chapterLinksExpire` (boolean): Indicates whether the chapter links expire (defaults to true).
- `pictureLinksExpire` (boolean): Indicates whether the picture links expire (defaults to true).

### Returns:
- `object`: The sub-template for manga information in a specific language.

### Example:
```
const templater = new Templater();
const languageTemplate = templater.makeLanguageTemplate(true, false, true);
console.log(languageTemplate);
```
This method creates a sub-template object for manga information in a specific language, initializing properties such as `coverImage`, `coverImageExpire`, `title`, `subtitle`, `description`, `status`, `totalChapters`, `chapterTitles`, `chapterUploader`, `chapterLength`, `chapterLinks`, `chapterLinksExpire`, `pictureLinks`, and `pictureLinksExpire` with the provided default values for expiration flags.