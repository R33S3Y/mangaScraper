
import { MangaSearch, Manga } from './mangaScraper/mangaScraper.js';
import { Mangatoto } from './mangaScraper/Fetchers/mangatoto.js';

let manga = new Manga();
let mangatoto = new Mangatoto();

//set config
manga.updateConfig({
    language : "eng",
    chapter: 1
});

//make vars
manga.sourceRank = [["mangatoto-103606"]];
manga.template();

manga.infoSources[0].source = "mangatoto";
manga.infoSources[0].id = "103606";
manga.infoSources[0].link = "https://mangatoto.com/series/103606/everything-s-coming-up-roses";


await manga.update(["pictureLinks","title"]);

let titles = manga.get("title");
let pictureLinks = manga.get("pictureLinks");

let p = document.getElementById("1");
p.innerHTML = titles;

let img = document.getElementById("2");
img.src = pictureLinks[1][0];

console.log(await mangatoto.search("hi"));