"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

export const INTRO_KEY = "libra-intro";

/* The company signing its name, assembled from the logo's own traced parts (lib/logo.ts).
   The Libra logo is a wordmark held inside two lime swooshes that read as one orbit, with a lime wave running
   through the A. So the build follows that geometry rather than tiling it:
     Build  0.10–0.95s  the two swooshes sweep in from opposite ends (clip wipes, so the orbit turns once);
                        L·I·B·R·A rise into place one after another (0.06s apart); the wave wipes across the A;
                        the tagline clip-wipes open beneath.
     Hold   0.95–1.20s
     Exit   1.20–1.75s  the lock-up glides into the header logo position while the white ground fades away over the
                        hero, which opens on the same white, so there is no colour jump.
   One GSAP timeline, 1.75s in all; the handover fires at 1.30s so the hero entrance overlaps the landing.
   Plays once per browser session (sessionStorage), never with reduced motion, and never without JavaScript. */
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
    // The header logo stays hidden (is-landing) until the travelling logo arrives; then the two swap in one frame.
    const finish = () => {
      handover(); root.classList.remove("is-landing"); el.style.display = "none";
      performance.mark("libra:intro-end"); // README "Preloader" reads these marks to check the 2s budget
      try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* private mode: it simply plays again next time */ }
    };
    delete root.dataset.intro;
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_KEY) === "1"; } catch { /* ignore */ }
    // The boot script (app/layout.tsx) makes the same check, so a repeat visit never paints the preloader at all.
    if (reducedMotion() || seen) { finish(); return; }
    root.classList.add("is-loading", "is-landing");

    const part = (id: string) => el.querySelector<SVGPathElement>(`[data-part="${id}"]`);
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const target = document.querySelector<SVGSVGElement>(".site-header .brand .logo");
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
      .addLabel("exit", 1.2)
      .add(() => {
        // Measured at exit time so a late web font or a resize cannot misplace the landing.
        if (!target || !target.getBoundingClientRect().width) return;
        const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
        gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .55, ease: "power3.inOut" });
      }, "exit")
      .to(el, { backgroundColor: "rgba(255,255,255,0)", duration: .5, ease: "libra" }, "exit+=.05")
      .add(handover, "exit+=.1")
      .set({}, {}, "exit+=.55");

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = window.setTimeout(finish, 2200);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(logo); root.classList.remove("is-loading", "is-landing"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-sign"><Logo parts title="" /></div>
  </div>;
}
