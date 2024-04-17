# MangaScraper

## Notice
MangaScraper is still in early development and has not been thoroughly tested. Expect bugs, issues and missing features while it in it's current state. 

## Summary
MangaScraper is a library designed to handle the collection and standardization of data between multiple sources, hiding everything behind a API. It is intended for use on a client side web browser.

## Sources
MangaScraper currently supports the collection of info from:

 - [Mangatoto](mangatoto.com)

**Note:** if the website you want to collect info from is not on this list you can go write a fetcher for it by follow the guide that can be found [Here](mangaScraper/Docs/Making%20Fetchers.md).

## Change Log

You can see the change log [Here](mangaScraper/Docs/ChangeLog.md).

## Setup 
To set up MangaScraper Just Import it into your JS as shown here:
```
import { Manga } from './mangaScraper/mangaScraper.js';
```
**Note:** the script you import this to will need to be setup as a follows: 
```
<script type="module" src="example.js" defer=""></script>
```

Once your done with that you can create a instance of the class as follows:
```
let manga = new Manga();
```

Next you will want to define the core variables as shown in this example:
```
manga.sourceRank = [["mangatoto-103606"]];


manga.infoSources = [{

source: "mangatoto",
id: "103606",
link: "https://mangatoto.com/series/103606/everything-s-coming-up-roses",
authors: [],
artists: [],
genres: [],
originalLanguage: '',
availableLanguages: ["English"],
displayMethod: "",
views: 0,
rating: 0,
totalReviews: 0,
  
english: {
coverImage: "",
coverImageExpire: false,
title: "",
subtitle: "",
description: "",
status: "",
totalChapters: 0,
chapterTitles: [],
chapterUploader: [],
chapterLength: [],
chapterLinks: [],
chapterLinksExpire: false,
pictureLinks: [],
pictureLinksExpire: false,
}

}];
```
**Note:** We know this step makes it pretty pointless to use our API but we have plans to add thing's like template and search functions to make it easier.

and that's it your ready to start using our API as shown [Here](mangaScraper/Docs/API.md).

