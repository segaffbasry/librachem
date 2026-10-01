import Preloader from "@/components/Preloader";
import { About } from "@/components/home/About";
import { Accreditations } from "@/components/home/Accreditations";
import { Hero } from "@/components/home/Hero";
import { Manchester } from "@/components/home/Manchester";
import { Markets } from "@/components/home/Markets";
import { News } from "@/components/home/News";

/* The single route. Section order follows the live homepage: hero film and headline, the intro and its three
   pillars, the tile grid (with its "Made in Manchester" film tile as the band after it), accreditations, then
   events and news. The live LinkedIn feed widget is replaced by links in the footer. */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <About />
    <Markets />
    <Manchester />
    <Accreditations />
    <News />
  </>;
}
