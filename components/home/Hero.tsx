"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { getInTouch, pages } from "@/lib/site";
import { splitLines } from "@/lib/split";

/* Hero in ACN's arrangement: an uppercase statement on the white ground at the left, a tall colour panel at the
   right. Libra's panel is its own site film (the Irlam plant, tank farm, warehouses and control room), toned to
   the palette. The entrance waits for the preloader's `intro:done` and is the one place with heavier motion:
   the headline's lines rise out of masks while the film panel clips open from the bottom and the header fades in.
   The film is muted, has a pause control, pauses when off-screen, and shows a local poster until it plays. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const title = el.querySelector<HTMLElement>(".hero-title")!;
    let split: ReturnType<typeof splitLines> | null = null;
    let tl: gsap.core.Timeline | null = null;

    const enter = () => {
      if (reducedMotion()) return;
      split = splitLines(title);
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(el.querySelector(".hero-media"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut", clearProps: "clipPath" }, 0)
        .fromTo(el.querySelector(".hero-media video"), { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
        .fromTo(el.querySelectorAll(".hero-eyebrow, .hero-lead"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .08 }, .1);
      split.lines.forEach((line, i) => tl!.fromTo(line, { yPercent: 105 }, { yPercent: 0, duration: .9 }, .18 + i * .08));
      tl.fromTo(el.querySelectorAll(".hero-foot > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .08 }, .55)
        .fromTo(document.querySelectorAll(".site-header [data-hero-part]"), { opacity: 0 }, { opacity: 1, duration: .6, ease: "libra" }, .2);
    };
    if (document.documentElement.dataset.intro === "done") enter();
    else document.addEventListener("intro:done", enter, { once: true });

    // Play only while on screen; a pause from the button is respected until the visitor presses play again.
    const video = film.current;
    const io = video ? new IntersectionObserver(([entry]) => {
      if (!video || userPaused.current) return;
      if (entry.isIntersecting) void video.play().catch(() => setPaused(true)); else video.pause();
    }, { threshold: .15 }) : null;
    if (video && io) { io.observe(video); if (reducedMotion()) { video.pause(); userPaused.current = true; setPaused(true); } }

    return () => { document.removeEventListener("intro:done", enter); tl?.kill(); split?.revert(); io?.disconnect(); };
  }, []);

  const toggle = () => {
    const video = film.current; if (!video) return;
    if (video.paused) { userPaused.current = false; void video.play(); setPaused(false); }
    else { userPaused.current = true; video.pause(); setPaused(true); }
  };

  return <section className="hero" ref={root} data-hero aria-labelledby="hero-title">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="label hero-eyebrow" data-hero-part>{hero.eyebrow}</p>
        <h1 className="hero-heading" id="hero-title" data-hero-part>
          <span className="hero-lead">{hero.lead}</span>
          <span className="h-display hero-title">{hero.title}</span>
        </h1>
        <div className="hero-foot" data-hero-part>
          <p className="hero-place label">{hero.place}</p>
          <div className="hero-actions">
            <Button href={pages.products} tone="navy" reveal={false}>Our products</Button>
            <Button href={getInTouch.href} tone="line" reveal={false}>{getInTouch.label}</Button>
          </div>
        </div>
      </div>
      <div className="hero-media tone" data-hero-part>
        <video ref={film} src={hero.film.src} poster={hero.film.poster} muted loop playsInline autoPlay preload="auto" aria-label={hero.film.label} />
        <button className="film-toggle" onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play the site film" : "Pause the site film"}>
          <span aria-hidden="true" className={paused ? "icon-play" : "icon-pause"} />
          <span className="film-toggle-text">{paused ? "Play" : "Pause"}</span>
        </button>
      </div>
    </div>
  </section>;
}
