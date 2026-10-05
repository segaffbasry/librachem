"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The loading screen: the company signing its name, assembled from the logo's own traced parts (lib/logo.ts),
   on a navy ground with the letters reversed out in white and the swooshes in lime.
   The Libra logo is a wordmark held inside two lime swooshes that read as one orbit, with a lime wave running
   through the A. So the build follows that geometry rather than tiling it:
     Build  0.10–0.95s  the two swooshes sweep in from opposite ends (clip wipes, so the orbit turns once);
                        L·I·B·R·A rise into place one after another (0.06s apart); the wave wipes across the A;
                        the tagline clip-wipes open beneath.
     Hold   0.95–1.30s
     Exit   1.30–1.90s  the navy curtain lifts away from the bottom edge (clip-path) with the logo rising inside
                        it, uncovering the hero as it goes; the hero entrance starts underneath at 1.40s.
   One GSAP timeline, 1.90s in all. Plays on every page load (client asked for a visible loading screen, 2026-10-05),
   never with reduced motion, and never without JavaScript. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      performance.mark("libra:handover");
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    const finish = () => {
      handover(); el.style.display = "none";
      performance.mark("libra:intro-end"); // README "Preloader" reads these marks to check the 2s budget
    };
    delete root.dataset.intro;
    if (reducedMotion()) { finish(); return; }
    root.classList.add("is-loading");

    const part = (id: string) => el.querySelector<SVGPathElement>(`[data-part="${id}"]`);
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const letters = ["L", "I", "B", "R", "A"].map((l) => part(`letter-${l}`));

    performance.mark("libra:intro-start");
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: .45 }, onComplete: finish });
    tl.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      // The lower swoosh opens from its right-hand tip, the upper one from its left: one turn of the orbit.
      .fromTo(part("orbit-bottom"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "power2.inOut" }, .1)
      .fromTo(part("orbit-top"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "power2.inOut" }, .16)
      .fromTo(letters, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .06 }, .2)
      .fromTo(part("wave"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .35, ease: "power2.inOut" }, .55)
      .fromTo(part("tagline"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .35, ease: "power2.inOut" }, .6)
      .addLabel("exit", 1.3)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: .6, ease: "power3.inOut" }, "exit")
      .to(logo, { yPercent: -30, opacity: 0, duration: .45, ease: "power2.in" }, "exit")
      .add(handover, "exit+=.1");

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = window.setTimeout(finish, 2300);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(logo); root.classList.remove("is-loading"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-sign"><Logo parts title="" /></div>
  </div>;
}
