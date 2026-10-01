/* Homepage content: every item on the live librachem.co.uk homepage, in its order, with its real copy.
   Source of truth is content/home.json (npm run scrape); text here is copied from it verbatim except where noted
   (no em or en dashes, ever; post excerpts are the opening sentence of each post, since the homepage cuts them at
   "[...]"). Images are the live ones, downloaded and toned by scripts/media.sh. */
import { LIVE, pages } from "@/lib/site";

export type Photo = { src: string; alt: string; w: number; h: number; contain?: boolean; focus?: string };
export type Pillar = { title: string; text: string; href: string; cta: string; photo: Photo };
export type Tile = { title: string; href: string; photo: Photo };
export type Badge = { label: string; src: string; href: string | null };
export type Post = { title: string; href: string; date: string; category: string; excerpt: string; photo: Photo };

// Hero: the live page's two stacked H1s ("The UK's Leading" in lime, then the long line).
export const hero = {
  eyebrow: "Libra Speciality Chemicals",
  lead: "The UK’s Leading",
  title: "Manufacturer & Global Distributor of Surfactants, Speciality Chemicals & Contract Toll Services",
  film: { src: "/media/libra-film.mp4", poster: "/media/libra-film-poster.jpg", label: "Libra Speciality Chemicals site film: the Irlam site, tank farm, warehouses and control room" },
  place: "Manchester, UK",
};

// "About" block: the live intro paragraph and the "over 50 years" line that introduces the three pillars.
export const about = {
  eyebrow: "About Libra",
  statement: "At Libra, we have been setting the standards in the provision of high quality chemical and speciality surfactant manufacturing for over 50 years.",
  body: "Based in Manchester, UK, Libra Speciality Chemicals are a leading UK chemical manufacturer and global distributor of surfactants and speciality industrial chemicals. Our chemicals are supplied into various industrial markets including Personal Care, Household & Institutional Cleaning and Industrial sectors including Energy Extraction, Agriculture, Lubricants, Metal Working and Coatings markets.",
  learnMore: "Learn more about:",
  href: `${LIVE}/about-us/`,
};

/* The three "Learn more about" boxes. The live boxes carry animated GIF icons; here each one leads with a
   photograph of the Irlam site instead (two are stills from the company film). */
export const pillars: Pillar[] = [
  { title: "Libra Products", text: "Libra manufacture speciality performance and bespoke surfactants with a wide range of industry applications…", href: pages.products, cta: "Discover more",
    photo: { src: "/media/reactor-panel.jpg", alt: "An operator at a reactor control panel on the Libra site", w: 960, h: 540 } },
  { title: "Applications & Distribution", text: "Our surfactants are produced for global industries alongside the global distribution of surfactants…", href: pages.applications, cta: "Discover more",
    photo: { src: "/media/site-aerial.jpg", alt: "Aerial view of the Libra site at Irlam: storage tanks, warehouses and IBC yard", w: 1600, h: 857 } },
  { title: "Contract & Toll", text: "Libra provide a bespoke, total chemical manufacturing and supply solution to meet your company’s needs…", href: pages.contract, cta: "Discover more",
    photo: { src: "/media/control-room.jpg", alt: "A Libra operator in hi-vis monitoring production screens in the control room", w: 960, h: 540 } },
];

// The live tile grid: eight image tiles around the "Made in Manchester" film tile (that one is the band below).
// Live hrefs such as /personal-care/ 301 to the /libra-applications/ addresses used here.
export const tiles: Tile[] = [
  { title: "About us", href: `${LIVE}/about-us/`, photo: { src: "/media/head-office.jpg", alt: "Libra's head office, a red-brick building with a glass entrance", w: 1600, h: 857 } },
  { title: "Our Products", href: pages.products, photo: { src: "/media/glassware.jpg", alt: "Laboratory glassware holding clear liquids", w: 1600, h: 640 } },
  { title: "Personal Care", href: `${LIVE}/libra-applications/personal-care/`, photo: { src: "/media/sector-personal-care.jpg", alt: "A hand holding a small jar of cream", w: 724, h: 656 } },
  { title: "HI & I Cleaning", href: `${LIVE}/libra-applications/hi-i-cleaning/`, photo: { src: "/media/sector-cleaning.jpg", alt: "Trigger spray bottles and a cleaning cloth", w: 900, h: 571 } },
  { title: "Contract Manufacturing", href: pages.contract, photo: { src: "/media/tank-farm.jpg", alt: "Aerial view of the tank farm and reaction plant at Irlam", w: 1600, h: 857 } },
  { title: "Agriculture", href: `${LIVE}/libra-applications/agriculture/`, photo: { src: "/media/sector-agriculture.jpg", alt: "A pivot irrigator watering a field of crops", w: 724, h: 479 } },
  { title: "Oil & Gas", href: `${LIVE}/libra-applications/oil-and-gas/`, photo: { src: "/media/sector-oil-gas.jpg", alt: "Pipelines running out over water at dusk", w: 724, h: 543 } },
  { title: "Industrial Sectors", href: `${LIVE}/libra-applications/industrial-sectors/`, photo: { src: "/media/sector-industrial.jpg", alt: "Coolant spraying over a metal part on a lathe", w: 900, h: 599 } },
];

export const markets = {
  eyebrow: "Applications & Distribution",
  // From the live intro paragraph ("Our chemicals are supplied into various industrial markets…").
  title: "Our chemicals are supplied into various industrial markets",
};

// The live film tile: "Made in Manchester (UK) / Distributed around the world" over the site film.
export const manchester = {
  lines: ["Made in Manchester (UK)", "Distributed around the world"],
  film: { src: "/media/manchester.mp4", poster: "/media/manchester-poster.jpg", label: "Short film of the Libra site in Manchester" },
};

export const accreditations = {
  title: "Our Accreditations",
  text: [
    "We have been certified and accredited by a range of trade, material and manufacturing organisations. We have also been certified in safety management, environmental and quality practices across our services and products.",
    "These certifications include: ISO14001:2015, ISO9001:2015, ISO45001:2018 (OH&S). Ecocert COSMOS Natural and Organic, EFfCI GMP certification. We are members of the RSPO, BCMPA and British Safety Council.",
  ],
  cta: { label: "View resources", href: pages.resources },
};

// All twelve marks, in live order. Links are the live ones (SGS directory, RSPO and Sedex certificates, EcoVadis).
const SGS = "https://www.sgs.com/en/certified-clients-and-products/certified-client-directory";
export const badges: Badge[] = [
  { label: "ISO 45001:2018", src: "/badges/iso-45001.png", href: SGS },
  { label: "ISO 9001:2015", src: "/badges/iso-9001.png", href: SGS },
  { label: "ISO 14001:2015", src: "/badges/iso-14001.png", href: SGS },
  { label: "EFfCI GMP", src: "/badges/effci-gmp.png", href: SGS },
  { label: "COSMOS Organic", src: "/badges/cosmos-organic.png", href: null },
  { label: "COSMOS Natural", src: "/badges/cosmos-natural.png", href: null },
  { label: "RSPO", src: "/badges/rspo.png", href: "https://acrobat.adobe.com/id/urn:aaid:sc:EU:86cb5183-6343-4310-b44c-d32ada4eb20c" },
  { label: "BCMPA Member", src: "/badges/bcmpa.png", href: null },
  { label: "British Safety Council Member", src: "/badges/british-safety-council.png", href: null },
  { label: "EFfCI Member", src: "/badges/effci-member.png", href: null },
  { label: "Silver EcoVadis Sustainability", src: "/badges/ecovadis-silver.png", href: "https://recognition.ecovadis.com/wRcB2OglukGvnze2_U5fDA" },
  // Unlabelled on the live page; the badge itself reads "Supplier Plus, Sedex".
  { label: "Sedex Supplier Plus", src: "/badges/sedex-supplier-plus.png", href: "https://acrobat.adobe.com/id/urn:aaid:sc:EU:f4a7b054-1253-4512-a371-386e49c2dcad" },
];

// "Events & Awards" (one post in the live slider) and "Latest News" (three cards).
export const events: Post[] = [
  { title: "Chemicals Northwest 2026 Awards", href: `${LIVE}/2023/07/27/chemicals-northwest-2026-awards/`, date: "2023-07-27", category: "Events & Awards",
    excerpt: "We’re pleased to share that Libra Speciality Chemicals has won the International Trade Award 2026 at the Chemicals Northwest Awards 2026. This recognition reflects our continued focus on building a strong international presence, developing long term partnerships, and delivering consistently across global markets.",
    photo: { src: "/media/post-award.jpg", alt: "Chemicals Northwest Awards, Winner 2026, International Trade Award", w: 800, h: 487 } },
];

export const news: Post[] = [
  { title: "Public Environmental Data", href: `${LIVE}/2023/08/03/public-environmental-data/`, date: "2023-08-03", category: "Events",
    excerpt: "2024 is the first year in which Libra’s full carbon emissions have been calculated.",
    photo: { src: "/media/post-environmental.jpg", alt: "A water drop with a seedling, Libra's environmental data icon", w: 800, h: 800, contain: true } },
  { title: "Librateric: Coco-Betaine, CB 35", href: `${LIVE}/2025/11/13/new-librateric-coco-betaine-35/`, date: "2025-11-13", category: "Events",
    excerpt: "Formulators today need surfactants that offer mildness, reliability, and flexibility without compromising performance.",
    photo: { src: "/media/post-cb35.jpg", alt: "Oil droplets suspended in liquid", w: 800, h: 568 } },
  { title: "Sunscreen Formulations", href: `${LIVE}/2023/01/24/sunscreen-formulations/`, date: "2023-01-24", category: "Blog Posts",
    excerpt: "Following our recent post on Libranol 1618 (30:70), we have developed an SPF 30 sunscreen formulation guide to show how it can be used in a full system.",
    photo: { src: "/media/post-sunscreen.jpg", alt: "Page one of Libra's SPF 30 sunscreen formulation guide", w: 800, h: 1020, focus: "50% 0%" } },
];

export const newsSection = {
  eyebrow: "News & Resources",
  // The live section headings, "Events & Awards" and "Latest News".
  events: "Events & Awards",
  title: "Latest News",
  all: { label: "All news", href: pages.news },
};

// The live "Linko Page:" tile (brand values card linking to Libra's link page). Its LinkedIn feed column is an
// Elfsight widget and is replaced by the LinkedIn link in the footer.
export const linko = { label: "Linko page", href: "https://linko.page/librachem" };

// Live date badges show day and month only ("03 Aug"); the same format is used here.
export const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
