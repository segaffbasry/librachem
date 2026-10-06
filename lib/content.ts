/* Homepage content: every item on the live librachem.co.uk homepage, in its order, with its real copy.
   Source of truth is content/home.json (npm run scrape); text here is copied from it verbatim except where noted
   (no em or en dashes, ever; post excerpts are the opening sentence of each post, since the homepage cuts them at
   "[...]"). Images are the live ones, downloaded and toned by scripts/media.sh. */
import { LIVE, pages } from "@/lib/site";

export type Photo = { src: string; alt: string; w: number; h: number; contain?: boolean; focus?: string };
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

/* Client feedback (2026-10-05): the homepage tile grid is replaced by three real sections: About us, Our products
   (the actual product ranges) and Industrial sectors. The other tiles and the three pillar boxes are removed.
   Copy is from the live About, Our Company, Why Choose Libra, Products and Applications pages, verbatim. */
export const about = {
  eyebrow: "About us",
  // /about-us/ subtitle
  title: "Providing high quality products and services to the chemical industry since 1971",
  // Homepage intro paragraph
  body: "Based in Manchester, UK, Libra Speciality Chemicals are a leading UK chemical manufacturer and global distributor of surfactants and speciality industrial chemicals. Our chemicals are supplied into various industrial markets including Personal Care, Household & Institutional Cleaning and Industrial sectors including Energy Extraction, Agriculture, Lubricants, Metal Working and Coatings markets.",
  // /about-us/our-company/
  story: "Our five-acre manufacturing site, based on the Northbank Industrial Estate in Irlam, Manchester is within easy access of the M6, M62 and M60 motorways. This has given us ideal transport links to service our customers around the UK and to export our multi-award winning service to global markets.",
  // /about-us/why-choose-libra/ "Our Capacity" and /about-us/our-company/
  facts: [
    { value: "1971", label: "Providing products and services to the chemical industry since 1971" },
    { value: "5 acres", label: "Manufacturing site in Irlam, Manchester" },
    { value: "15 + 9", label: "Mixing vessels and reactors available as part of our contract and toll service" },
    { value: "Betaine", label: "One of the largest betaine manufacturing capacities globally" },
  ],
  links: [
    { label: "Our Company", href: `${LIVE}/about-us/our-company/` },
    { label: "Our Team", href: `${LIVE}/about-us/our-team/` },
    { label: "Why Choose Libra", href: `${LIVE}/about-us/why-choose-libra/` },
  ],
  photo: { src: "/media/head-office.jpg", alt: "Libra's head office in Irlam, a red-brick building with a glass entrance", w: 1600, h: 857 },
  photo2: { src: "/media/tank-farm.jpg", alt: "Aerial view of the tank farm and reaction plant at Irlam", w: 1600, h: 857 },
};

export type Product = { name: string; family: string; text: string; href: string };
const P = `${LIVE}/libra-products`;
// /libra-products/: the "Libra Product Range" cards (names and summaries as written there) and the surfactant
// family each range sits under in the page's own Nonionic / Amphoteric / Anionic / Cationic lists.
export const products = {
  eyebrow: "Our products",
  title: "Our range of speciality surfactants and chemicals",
  body: "From our Manchester (UK) site, we have been producing and developing a wide range of speciality surfactants for over 50 years, all with different properties and purposes in chemical formulations. As primary, secondary and co-surfactants in formulations, our surfactants can act as foaming agents, detergents, emulsifiers, dispersing agents and more.",
  catalog: { label: "Product catalog", href: "https://www.librachem.store/products" },
  guide: { label: "Download product guide", href: "https://online.flippingbook.com/view/827249133/" },
  items: [
    { name: "Librateric Betaines", family: "Amphoteric", text: "Our Librateric Cocamidopropyl Betaines (CAB) are high-quality surfactants manufactured…", href: `${P}/librateric-betaines/` },
    { name: "Librateric Low Salt Betaine", family: "Amphoteric", text: "Our Librateric Low-Salt Betaines are innovative surfactants with global applications…", href: `${P}/low-salt-betaine/` },
    { name: "Librateric Amphoteric Surfactants", family: "Amphoteric", text: "Our Librateric Amphoterics are highly versatile are compatible with various different types of surfactants…", href: `${P}/librateric-amphoteric-surfactants/` },
    { name: "Libranox Amine Oxides", family: "Nonionic", text: "Our Libranox series of amine oxide surfactants are highly compatible, non-ionic…", href: `${P}/libranox-amine-oxides/` },
    { name: "Libranol Alkanolamides", family: "Nonionic", text: "Our Libranol Alkanolamides are a range of highly compatible, non-ionic…", href: `${P}/alkanolamides/` },
    { name: "LibraCare Alkyl Polyglucosides (APG)", family: "Nonionic", text: "Our LibraCare Alkyl Polyglucoside range of readily biodegradable surfactants…", href: `${P}/libracare-alkyl-polyglucosides-apgs/` },
    { name: "Libranone Alcohol Ethoxylates", family: "Nonionic", text: "Our range of Alcohol Ethoxylates have excellent properties for supporting…", href: `${P}/libranone-non-ionic-alcohol-ethoxylates/` },
    { name: "Libratex Dioctyl Sulphosuccinates", family: "Anionic", text: "Our Libratex range are compatible with other anionic and nonionic surfactants…", href: `${P}/libratex-sodium-dioctyl-sulphosuccinates/` },
    { name: "Libraphos Phosphate Esters", family: "Anionic", text: "Our Libraphos series of free-acid phosphate esters are anionic surfactants…", href: `${P}/libraphos-phosphate-esters/` },
    { name: "Libradet Formulated Products", family: "Anionic", text: "Our Libradet range are a synergistic blend of surfactants and foam stabilisers…", href: `${P}/libradet-formulated-products/` },
    { name: "Libraquat PQ7: Polyquaternium-7", family: "Cationic", text: "Our Libraquat PQ7 surfactant is a water soluble copolymer with excellent cleaning…", href: `${P}/libraquat-pq7-polyquaternium-7-cationic-surfactant/` },
    { name: "Libra Specialised Surfactants", family: "Specialised", text: "Our Libra range of specialised surfactants have specific properties and applications…", href: `${P}/libra-specialized-products/` },
  ] as Product[],
};

export type Sector = { name: string; text: string; href: string; photo: Photo };
const A = `${LIVE}/libra-applications`;
// /libra-applications/ (the "Learn more about our global industry applications" blocks) and
// /libra-applications/industrial-sectors/ for the fifth.
export const sectors = {
  eyebrow: "Industrial sectors",
  title: "Speciality chemicals and surfactants for a range of global industries",
  body: "Libra manufacture and distribute our chemicals globally as well as working with customers to develop and manufacture their portfolio for their required industries.",
  href: `${A}/`,
  items: [
    { name: "Personal Care", text: "Libra have an extensive portfolio of high-quality surfactants for Personal Care markets. From cosmetic products to toiletries, our formulations will help meet your growing customer demands.", href: `${A}/personal-care/`,
      photo: { src: "/media/sector-personal-care.jpg", alt: "A hand holding a small jar of cream", w: 724, h: 656 } },
    { name: "HI & I Cleaning", text: "Libra have extensive experience with Home, Industrial & Institutional (HI&I) Cleaning formulations. We have the formula for your success within global specialist cleaning markets.", href: `${A}/hi-i-cleaning/`,
      photo: { src: "/media/sector-cleaning.jpg", alt: "Trigger spray bottles and a cleaning cloth", w: 900, h: 571 } },
    { name: "Agriculture", text: "Libra’s speciality product portfolio can be utilised for agrochemical products like Emulsifiers or Dispersing Agents, offering a solution for your continued success within agriculture markets.", href: `${A}/agriculture/`,
      photo: { src: "/media/sector-agriculture.jpg", alt: "A pivot irrigator watering a field of crops", w: 724, h: 479 } },
    { name: "Energy Extraction", text: "Our range of surfactants are supplied for specialist, sustainable and accredited Energy Extraction products for Oil & Gas Fields. Libra offer expert products that benefit our customers and the industry.", href: `${A}/oil-and-gas/`,
      photo: { src: "/media/sector-oil-gas.jpg", alt: "Pipelines running out over water at dusk", w: 724, h: 543 } },
    { name: "Industrial Sectors", text: "From general use to speciality requirements, we offer the solution for success in varying industrial sectors: industrial lubricants and metal works, water treatment, building and construction, and textiles.", href: `${A}/industrial-sectors/`,
      photo: { src: "/media/sector-industrial.jpg", alt: "Coolant spraying over a metal part on a lathe", w: 900, h: 599 } },
  ] as Sector[],
};

// The live film tile: "Made in Manchester (UK) / Distributed around the world" over the site film.
export const manchester = {
  lines: ["Made in Manchester (UK)", "Distributed around the world"],
  // The Contract & Toll pillar text from the homepage, moved here when the pillars were removed.
  contract: "Libra provide a bespoke, total chemical manufacturing and supply solution to meet your company’s needs.",
  film: { src: "/media/manchester.mp4", poster: "/media/manchester-poster.jpg", label: "Short film of the Libra site in Manchester" },
};

// Shown as a scrolling strip under the hero (client feedback 2026-10-05: "logos should just be scrolling").
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

// "Latest News" (three cards). The live "Events & Awards" post was removed at the client's request (2026-10-06).
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
  // The live section heading.
  title: "Latest News",
  all: { label: "All news", href: pages.news },
};

// The live "Linko Page:" tile (brand values card linking to Libra's link page). Its LinkedIn feed column is an
// Elfsight widget and is replaced by the LinkedIn link in the footer.
export const linko = { label: "Linko page", href: "https://linko.page/librachem" };

// Live date badges show day and month only ("03 Aug"); the same format is used here.
export const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
