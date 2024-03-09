// tester.js

import { MangaSearch, Manga } from './mangaScraper/mangaScraper.js';


const manga = new Manga();
manga.sourceRank = [["mangatoto-103606"]];
manga.infoSources = [{source: "mangatoto", id: "103606", link:"https://mangatoto.com/series/103606/everything-s-coming-up-roses"}]

manga.update("title");
let titles = manga.get("title");
console.log(titles);
