# MangaScraper

## Notice
MangaScraper is now considered feature (enough) complete. I will continue to develop it as  We find bugs and issues but I will instead be focused mainly on other things (Like making a website to use it on). With that in mind please note that MangaScraper has not been thoroughly tested and that you will most likely find bugs and other such issues that you will  need to help fix (by making issues, pull requests and so on). 

## Summary
MangaScraper is a library designed to handle the collection and standardization of manga between multiple sources, hiding everything behind a API. It is intended for use on a client side web browser.

## Sources
MangaScraper currently supports the collection of info from:

 - [Mangatoto](mangatoto.com)

**Note:** if the website you want to collect info from is not on this list you can go write a fetcher for it by follow the guide that can be found [Here](mangaScraper/Docs/Making%20Fetchers.md).

## Change Log

You can see the change log [Here](mangaScraper/Docs/ChangeLog.md).

## Setup 
To set up MangaScraper Just Import it into your JS as shown here:
```
import { MangaSearch, Manga } from './mangaScraper/mangaScraper.js';
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
manga.template();

manga.infoSources[0].source = "mangatoto";
manga.infoSources[0].id = "103606";
manga.infoSources[0].link = "https://mangatoto.com/series/103606/everything-s-coming-up-roses";
```
**Or** you can search for manga. Eg:
```
let mangaSearch = new MangaSearch();

// creates a list of manga classes already setup.
let mangas = await mangaSearch.search("hi");
```
and that's it your ready to start using our API as shown [Here](mangaScraper/Docs/API.md).

