/* Site structure from the live librachem.co.uk header mega-menu and footer (checked 2026-10-01).
   Only the homepage is rebuilt, so every link goes to its real URL on the live site. Each one is the canonical
   address listed in page-sitemap.xml (the homepage's own short tile links such as /personal-care/ 301 to these). */
import type { BrandIcon } from "@/lib/brand-icons";

export type Link = { label: string; href: string };
export type NavGroup = { label: string; href: string; links: Link[] };

export const LIVE = "https://librachem.co.uk";
const P = `${LIVE}/libra-products`;
const A = `${LIVE}/libra-applications`;
const C = `${LIVE}/chemical-contract-and-toll-manufacturing-services-uk`;

// The live header's five dropdowns, in order, with their own child links. Labels are the live ones; the
// "Libra: " prefix the live menu repeats on every product and market is dropped (the group already says it).
export const navGroups: NavGroup[] = [
  { label: "About us", href: `${LIVE}/about-us/`, links: [
    { label: "Our Company", href: `${LIVE}/about-us/our-company/` },
    { label: "Our Team", href: `${LIVE}/about-us/our-team/` },
    { label: "Why Choose Libra", href: `${LIVE}/about-us/why-choose-libra/` },
  ] },
  { label: "Products", href: `${P}/`, links: [
    { label: "Product Catalog", href: "https://www.librachem.store/products" },
    { label: "Librateric: Betaines", href: `${P}/librateric-betaines/` },
    { label: "Libranox: Amine Oxides", href: `${P}/libranox-amine-oxides/` },
    { label: "Librateric: Amphoteric Surfactants", href: `${P}/librateric-amphoteric-surfactants/` },
    { label: "Libranol: Alkanolamides", href: `${P}/alkanolamides/` },
    { label: "Libraquat: Polyquaternium Cationic Compounds", href: `${P}/libraquat-pq7-polyquaternium-7-cationic-surfactant/` },
    { label: "LibraCare: Alkyl Polyglucosides (APGs)", href: `${P}/libracare-alkyl-polyglucosides-apgs/` },
    { label: "Libranone: Non-Ionic Alcohol Ethoxylates", href: `${P}/libranone-non-ionic-alcohol-ethoxylates/` },
    { label: "Libraphos: Phosphate Esters", href: `${P}/libraphos-phosphate-esters/` },
    { label: "Libratex: Sodium Dioctyl Sulphosuccinates", href: `${P}/libratex-sodium-dioctyl-sulphosuccinates/` },
    { label: "Libratex: Anionic Surfactants", href: `${P}/libratex-anionic-surfactants/` },
    { label: "Libradet: Formulated Products", href: `${P}/libradet-formulated-products/` },
    { label: "Specialised Products", href: `${P}/libra-specialized-products/` },
  ] },
  { label: "Applications", href: `${A}/`, links: [
    { label: "Libra Applications", href: `${A}/` },
    { label: "Personal Care", href: `${A}/personal-care/` },
    { label: "HI & I Cleaning", href: `${A}/hi-i-cleaning/` },
    { label: "Agriculture", href: `${A}/agriculture/` },
    { label: "Oil and Gas", href: `${A}/oil-and-gas/` },
    { label: "Industrial Sectors", href: `${A}/industrial-sectors/` },
  ] },
  { label: "Contract & Toll", href: `${C}/`, links: [
    { label: "Contract and Toll Manufacturing", href: `${C}/` },
    { label: "Reaction Facilities", href: `${C}/reaction-facilities/` },
    { label: "Manufacturing Services", href: `${C}/manufacturing-services/` },
    { label: "Chemical Mixing Services and Vessels", href: `${C}/chemical-mixing-services-and-vessels/` },
    { label: "Chemical Bulk Storage Facilities", href: `${C}/chemical-bulk-storage/` },
  ] },
  { label: "News & Resources", href: `${LIVE}/libra-news/`, links: [
    { label: "News Room & Resources", href: `${LIVE}/libra-news/` },
    { label: "News Archive", href: `${LIVE}/libra-news/news-archive/` },
    { label: "Resources", href: `${LIVE}/libra-news/resources/` },
    { label: "Terms & Conditions", href: `${LIVE}/libra-news/terms-conditions/` },
  ] },
];

// The live header's lime "GET IN TOUCH!" pill.
export const getInTouch: Link = { label: "Get in touch", href: `${LIVE}/get-in-touch/` };
export const pages = {
  products: `${P}/`,
  applications: `${A}/`,
  contract: `${C}/`,
  resources: `${LIVE}/libra-news/resources/`,
  news: `${LIVE}/libra-news/`,
};

// Live footer, verbatim (the hours line is the one rewrite: "Monday – Friday 8am – 5pm" loses its dashes).
export const contact = {
  company: "Libra Speciality Chemicals LTD",
  address: ["Northbank Industrial Park, Brinell Drive", "Irlam, Manchester M44 5LF", "United Kingdom"],
  map: "https://goo.gl/maps/nhaS2wCpLoGWn9WE9",
  phone: "+44 (0) 161 775 1888",
  tel: "tel:+441617751888",
  email: "sales@librachem.co.uk",
  mailto: "mailto:sales@librachem.co.uk",
  hours: "Office hours: Monday to Friday, 8am to 5pm GMT",
  registered: "Libra Speciality Chemicals Limited. Registered No. 1009166 England.",
};

export const socials: { name: string; icon: BrandIcon; href: string }[] = [
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/libra-chemicals" },
];

// Live footer "Useful Links and Resources".
export const usefulLinks: Link[] = [
  { label: "Privacy Policy", href: `${LIVE}/privacy-policy/` },
  { label: "Cookies", href: `${LIVE}/cookies-policy/` },
  { label: "News Room & Resources", href: `${LIVE}/libra-news/` },
  { label: "Get in touch", href: `${LIVE}/get-in-touch/` },
];
