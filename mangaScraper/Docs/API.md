# Functions
## Update
```
async update(items, langauge, chapter = 0, maxParallelRequests = 2)
```

This function returns nothing. It just updates/checks that the item requested is there and is valid. If not it will make the necessary requests to update it.

- item (Array or String) - list or string of names of the item/items you want to get updated. You can see the full Iist of items [here](API.md##Items).
- langauge (String) - the langauge of the info you want the items in. (Should be lowercase)
- chapter (Int) - what chapter do you want the info from.
- maxParallelRequests (int) - how many requests can the function make in parallel

**example:** 
```
await manga.update(["pictureLinks","title"], "english", chapter);
```

## Get
```
get(item, langauge, chapter = 0, outputAll = false, outputSource = false)
```

This function gets the value of item

- item (String) - string of names of the item you want to get. You can see the full Iist of items [here](API.md##Items).
- langauge (String) - the langauge of the info you want the items in. (Should be lowercase)
- chapter (Int) - what chapter do you want the info from.
- outputAll (Boolean) - if true function will output a list of all values as appose to just a single value to a item
- outputSource (Boolean) - if true function will output dicts containg item and id

**example:** 
```
let titles = manga.get("title", "english");
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