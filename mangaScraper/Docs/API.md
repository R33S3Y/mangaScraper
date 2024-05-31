We Provide two classes to use in our API Manga & MangaSearch. Here lies the documention for both.
 - - -
# MangaSearch Functions

## Search
```
async search(query, callback = null);
```
This function returns a list of manga classes ready to go. When rerunning the same query it returns more results.

### Parameters:
 - `query` (String) - the thing you want to search for
 - `Callback` (Function) - if passed through it will pass the results of promises as they are resolved else it will just resolve all and return them.
### Returns:
- A list of classes by default all though this can be modified with the runCallbackOnError config option

### Example:
```
let mangaSearch = new MangaSearch();

mangaSearch.updateConfig({ language : "eng" });

// logs all the titles
function logTitles(mangas) {
	for (let manga of mangas) {
		console.log(manga.get("title"));
	}
	return;
}

mangaSearch.search("hi", logTitles);
```

- - -
# Manga Functions
## Update
```
async update(items, language, chapter = 0);
```
This function returns nothing. It just updates/checks that the item requested is there and is valid. If not it will make the necessary requests to update it.
### Parameters:
- `items` (Array or String) - list or string of names of the item/items you want to get updated. You can see the full Iist of items [here](API.md##Items).
- `language` (String) - the language of the info you want the items in. (Should be ISO 639-3)
- `chapter` (Int) - what chapter do you want the info from.
### Returns:
- Nothing
### Example:
```
await manga.update(["pictureLinks","title"], "eng", chapter);
```

- - -
## get
```
get(item, language = "", chapter = 0, outputAll = false, outputSource = false, fallbackLanguage = true, alwaysOutput = true, justChapter = false)
```
The `get` method in the `Manga` class retrieves information for the specified item from manga sources. It first fetches all information for the item, sorts the data based on the source ranking, and then applies filtering based on the `outputAll` and `outputSource` parameters. Finally, it returns the retrieved information in the specified format.

### Parameters:
- `item` (string): The name of the item to retrieve. You can see the full Iist of items [here](API.md##Items).
- `language` (string): The language of the information. (Should be ISO 639-3)
- `chapter` (number, optional, default: 0): The chapter number to retrieve information from.
- `outputAll` (boolean, optional, default: false): If true, outputs a list of all values.
- `outputSource` (boolean, optional, default: false): If true, outputs dictionaries containing item and id.
- `fallbackLanguage` (boolean, optional, default: true): If true, falls back to the default language when requested language information is not available.
- `alwaysOutput` (boolean, optional, default: true): If true, always outputs information, even if it's empty.
- `justChapter` (boolean, optional, default: false): If true, retrieves information for just the specified chapter.

### Returns:
- `*`: The retrieved information.

### Example:
```
const pictureLinks = manga.get("pictureLinks", "english", chapter);
console.log(pictureLinks);
```
 - - -
## Template
```
template(source = null, language)
```
Generates complete template over top a current source if source is null then it will make a whole new template.

### Parameters:
* `source`  (String) - used as ID
* `language` (String)- the language to make the template
### Returns:
- Nothing
### Example:
```
manga.template();
```

 - - -
## UpdateConfig
```
updateConfig(config = {});
```
Allows you to update the config settings for mangaScraper.

### Parameters:
 - `Config` (dict) the changes you want to make to config. You can see the full Iist of Config options [here](API.md###Options).
### Returns:
- Nothing
### Example:
```
manga.updateConfig({
	language : "eng",
	chapter: 1
});
```
**Note:** Due to `updateConfig()` only being added in 0.4 you can change config via:
```
manga.config.language = "eng";
manga.config.chapter = 1;
manga.updateConfig();
```
Although this only really exists for better backwards compatibly with the old Customizable defaults system added in [V0.1.4](ChangeLog.md##V%200.1.4)
# Other
## Items
Here is the full list of items you can input into the item argument:
 - source
 - id
 - link
 - authors
 - artists
 - genres
 - originalLanguage
 - availableLanguages
 - displayMethod
 - views
 - rating
 - totalReviews
 - coverImage
 - coverImageExpire
 - title
 - subtitle
 - description
 - status
 - totalChapters
 - chapterTitles
 - chapterUploader
 - chapterLength
 - chapterLinks
 - chapterLinksExpire
 - pictureLinks
 - pictureLinksExpire

## Config / Customizable defaults
Added in [V0.1.4](ChangeLog.md##V%200.1.4) it allows you to change many of the default values for functions. It was designed to help avoid repetitive code but now (As of [V0.4](ChangeLog.md#V%200.4)) it is the only way to configure some options (Eg: maxParallelRequests). To use this you need to use the [updateConfig](API.md##UpdateConfig) function
### Example:
instead of...
```
// do things
manga.template(null, "eng");
await manga.update(["pictureLinks","title"], "eng", 1);

let titles = manga.get("title", "eng", 1);
let pictureLinks = manga.get("pictureLinks", "eng", 1);
```
you can do this...
```
//set config
manga.updateConfig({
	language : "eng",
	chapter: 1
});

//do things
manga.template();
await manga.update(["pictureLinks","title"]);

let titles = manga.get("title");
let pictureLinks = manga.get("pictureLinks");
```

### Options
Here is a full list of the config options and there defaults and what they change
 - language - null  - [get()](API.md##get) & [update()](API.md##update) 
 - chapter - 0 - [get()](API.md##get) & [update()](API.md##update) 
 - outputAll - false - [get()](API.md##get)
 - outputSource - false - [get()](API.md##get)
 - maxParallelRequests - 2 - how many requests it make can the function make in parallel
 - fallbackLanguage - true - [get()](API.md##get)
 - alwaysOutput - true - [get()](API.md##get)
 - justChapter - false - [get()](API.md##get)