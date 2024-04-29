# Functions
## Update
```
async update(items, language, chapter = 0, maxParallelRequests = 2)
```

This function returns nothing. It just updates/checks that the item requested is there and is valid. If not it will make the necessary requests to update it.

- item (Array or String) - list or string of names of the item/items you want to get updated. You can see the full Iist of items [here](API.md##Items).
- language (String) - the language of the info you want the items in. (Should be lowercase)
- chapter (Int) - what chapter do you want the info from.
- maxParallelRequests (int) - how many requests can the function make in parallel

**example:** 
```
await manga.update(["pictureLinks","title"], "eng", chapter);
```

## get
```
get(item, language = "", chapter = 0, outputAll = false, outputSource = false, fallbackLanguage = true, alwaysOutput = true, justChapter = false)
```
The `get` method in the `Manga` class retrieves information for the specified item from manga sources.

## Parameters:
- `item` (string): The name of the item to retrieve.
- `language` (string): The language of the information.
- `chapter` (number, optional, default: 0): The chapter number to retrieve information from.
- `outputAll` (boolean, optional, default: false): If true, outputs a list of all values.
- `outputSource` (boolean, optional, default: false): If true, outputs dictionaries containing item and id.
- `fallbackLanguage` (boolean, optional, default: true): If true, falls back to the default language when requested language information is not available.
- `alwaysOutput` (boolean, optional, default: true): If true, always outputs information, even if it's empty.
- `justChapter` (boolean, optional, default: false): If true, retrieves information for just the specified chapter.

## Returns:
- `*`: The retrieved information.

## Example:
```
const pictureLinks = manga.get("pictureLinks", "english", chapter);
console.log(pictureLinks);
```
This method retrieves information for the specified item from manga sources based on the provided parameters. It first fetches all information for the item, sorts the data based on the source ranking, and then applies filtering based on the `outputAll` and `outputSource` parameters. Finally, it returns the retrieved information in the specified format.
## Template
```
template(source = null, language)
```

Generates complete template over top a current source if source is null then it will make a whole new template.

* source (String) - used as ID
* language (String)- the language to make the template

**example:** 
```
manga.template();
```

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

## Customizable defaults
These values set the defaults for values in functions it is designed to help avoid repetitive code.

#### Example
instead of...
```
// do things
await manga.update(["pictureLinks","title"], "eng", 0);

let titles = manga.get("title", "eng", 0);
let pictureLinks = manga.get("pictureLinks", "eng", 0);
```
you can do this...
```
//set config
manga.config.language = "eng";
manga.config.chapter = 0;

//do things
await manga.update(["pictureLinks","title"]);

let titles = manga.get("title");
let pictureLinks = manga.get("pictureLinks");
```

#### Usage
To use this you need to call className.config.varableName 

Here is a full list of the varableNames and there defaults
 - language : null
 - chapter : 0
 - maxParallelRequests : 2
 - outputAll : false
 - outputSource : false
