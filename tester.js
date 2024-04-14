
import { MangaSearch, Manga } from './mangaScraper/mangaScraper.js';


let manga = new Manga();
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

let chapter = 1;

await manga.update(["pictureLinks","title"], "english", chapter);

let titles = manga.get("title", "english", 0);
let pictureLinks = manga.get("pictureLinks", "english", chapter);

console.log(titles);
console.log(pictureLinks);

let p = document.getElementById("1");
p.innerHTML = titles;

let img = document.getElementById("2");
img.src = pictureLinks[chapter][0];