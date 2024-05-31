
import { MangaSearch, Manga } from './mangaScraper/mangaScraper.js';

let mangaSearch = new MangaSearch();
let manga = new Manga();


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

mangaSearch.updateConfig({ language : "eng", maxParallelRequests : 5 });

console.log(await mangaSearch.search("hi"));

function test(mangas) {
    let titles = [];
    for (let manga of mangas) {
        titles.push(manga.get("title"));
    }
    console.log(titles);
    return;
}

await mangaSearch.search("hi", test);

mangaSearch.updateConfig({runCallbackOnError : true});

function testWithRunCallbackOnError(input) {
    if (input.status === "fulfilled") {
        let mangas = input.value;
        let titles = [];
        for (let manga of mangas) {
            titles.push(manga.get("title"));
        }
        console.log(titles);
    } else {
        console.error(input.value);
    }
    return;

}

console.log("testWithRunCallbackOnError");
mangaSearch.search("hi", testWithRunCallbackOnError);
