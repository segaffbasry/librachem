import Preloader from "@/components/Preloader";
import { About } from "@/components/home/About";
import { Accreditations } from "@/components/home/Accreditations";
import { Hero } from "@/components/home/Hero";
import { Manchester } from "@/components/home/Manchester";
import { News } from "@/components/home/News";
import { Products } from "@/components/home/Products";
import { Sectors } from "@/components/home/Sectors";

/* The single route. Hero film and headline with the accreditations strip under it, then About us, Our products and
   Industrial sectors (the three sections the client asked for in place of the tile grid), the "Made in Manchester"
   band with Contract & Toll, then the latest news. The live LinkedIn feed widget is replaced by footer links. */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <Accreditations />
    <About />
    <Products />
    <Sectors />
    <Manchester />
    <News />
  </>;
}
