/* Refreshes content/home.json from the live homepage (librachem.co.uk, WordPress + Flatsome) and the four posts it
   features. Copy is kept verbatim apart from undash() (house rule: no em or en dashes) and whitespace.
   Run: npm run scrape. Media is fetched separately by scripts/media.sh. */
import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";

const LIVE = "https://librachem.co.uk";
const get = async (url) => cheerio.load(await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (demo content refresh)" } })).text());
const clean = (s) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();
// Dashes become colons or commas (see README "Copy").
const undash = (s) => s.replace(/\s+[–—]\s+/g, ": ").replace(/[–—]/g, ", ").replace(/:\s+(.+?):\s+/, ": $1, ");
const abs = (href) => (href.startsWith("http") ? href : `${LIVE}${href.startsWith("/") ? "" : "/"}${href}`);

const $ = await get(`${LIVE}/`);
const main = $("main");

const hero = main.find("section").first().find("h1").map((_, h) => clean($(h).text())).get();
const intro = clean(main.find(".libra-products .text p").first().text());
const standard = clean(main.find(".libra-products h5").first().text());

const pillars = main.find(".libra-products .box").map((_, box) => ({
  title: clean($(box).find("h4").text()),
  text: clean($(box).find(".box-text p").text()).replace(/…$/, "…"),
  href: abs($(box).parent().find("a.button, a:contains('Discover more')").last().attr("href") ?? ""),
})).get();

// Sector tiles: the 4+4 image banners around the "Made in Manchester" film tile.
const bgFor = {};
$("style").each((_, s) => {
  for (const m of $(s).html().matchAll(/#(banner-\d+) \.bg[^{]*\{[^}]*?url\(([^)]+)\)/g)) bgFor[m[1]] ??= m[2].replace(/-\d+x\d+(?=\.\w+$)/, "");
});
const tiles = main.find(".libra-tiles .banner").map((_, b) => ({
  id: $(b).attr("id"),
  title: clean($(b).find("h3").text()),
  href: $(b).find("a").attr("href") ? abs($(b).find("a").attr("href")) : null,
  image: bgFor[$(b).attr("id")] ?? null,
  video: $(b).find("video source").attr("src") ? abs($(b).find("video source").attr("src")) : null,
})).get();

const accSection = main.find("h2:contains('Our Accreditations')").closest("section");
const accreditations = {
  title: clean(accSection.find("h2").first().text()),
  text: accSection.find(".text p").map((_, p) => clean($(p).text())).get().filter(Boolean),
  badges: accSection.find(".banner-grid .col").map((_, c) => ({
    label: clean($(c).find("h4").text()),
    href: $(c).find("a").attr("href") ?? null,
    image: bgFor[$(c).find(".banner").attr("id")] ?? $(c).find("img").attr("src")?.replace(/-\d+x\d+(?=\.\w+$)/, "") ?? null,
  })).get(),
  resources: abs(accSection.find("a:contains('Resources')").attr("href") ?? "/libra-news/resources/"),
};

// Featured posts: the Events & Awards slider and the three "Latest News" cards. Each post page gives the category
// (rel="category tag"), the publish date and the opening paragraph.
const postLinks = main.find(".post-item a").map((_, a) => $(a).attr("href")).get();
const posts = [];
for (const href of postLinks) {
  const p = await get(href);
  posts.push({
    href,
    title: undash(clean(p("h1").first().text())),
    date: p('meta[property="article:published_time"]').attr("content")?.slice(0, 10) ?? href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//).slice(1).join("-"),
    category: clean(p('a[rel="category tag"]').first().text()),
    excerpt: undash(clean(p(".entry-content p").filter((_, el) => clean(p(el).text()).length > 40).first().text())),
    image: main.find(`a[href="${href}"] img`).attr("src")?.replace(/-\d+x\d+(?=\.\w+$)/, "") ?? null,
  });
}

const footerText = $("footer").text();
const footer = {
  registered: clean(footerText.match(/Libra Speciality Chemicals Limited\. Registered No\.[^\n]+/)?.[0] ?? ""),
  hours: undash(clean(footerText.match(/Office hours:[^\n]+/)?.[0] ?? "")).replace(", ", " to "),
};

const data = {
  source: `${LIVE}/`,
  fetched: new Date().toISOString().slice(0, 10),
  hero, intro, standard, pillars, tiles, accreditations,
  events: posts.slice(0, 1), news: posts.slice(1),
  linko: { href: main.find("a[href*='linko.page']").attr("href"), image: main.find("a[href*='linko.page'] img").attr("src")?.replace(/-\d+x\d+(?=\.\w+$)/, "") },
  footer,
};
await writeFile(new URL("../content/home.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log(`hero ${hero.length}, pillars ${pillars.length}, tiles ${tiles.length}, badges ${accreditations.badges.length}, events ${data.events.length}, news ${data.news.length}`);
