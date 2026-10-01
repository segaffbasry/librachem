import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/chrome";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/chrome.css";
import "@/styles/home.css";

// The live homepage's own title. Its meta description is a stray "Events & Awards", so the intro's first sentence
// stands in for it.
export const metadata: Metadata = {
  title: "Home - Libra Speciality Chemicals",
  description: "Based in Manchester, UK, Libra Speciality Chemicals are a leading UK chemical manufacturer and global distributor of surfactants and speciality industrial chemicals.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

/* `js` (and the preloader's `is-loading`/`is-landing`) is set before first paint, unless reduced motion is requested,
   so reveal targets can start hidden without a flash. The preloader plays once per session: a repeat visit gets `js`
   only. Without JavaScript none of the classes are added and everything renders in place; the <noscript> style also
   hides the preloader. */
const boot = "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js');var s=null;try{s=sessionStorage.getItem('libra-intro')}catch(e){}if(s!=='1')d.classList.add('is-loading','is-landing');else d.classList.add('intro-seen')})()";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-header="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/montserrat-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/lato-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/media/libra-film-poster.jpg" as="image" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
