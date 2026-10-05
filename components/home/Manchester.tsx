"use client";

import { useEffect, useRef } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { manchester } from "@/lib/content";
import { getInTouch, pages } from "@/lib/site";

/* ACN's dark call-to-action band (`.cc-dark-cta`: deep field, capitalised statement, a light and an outline button,
   a graphic at the right). Libra's "Made in Manchester (UK) / Distributed around the world" film tile becomes the
   statement, with the tile's own film in place of the graphic. It also carries the Contract & Toll line, which
   lived in the homepage's pillar boxes before they were removed. The film is decorative (no sound, no story), so it
   plays only while on screen and stays on its poster with reduced motion. */
export function Manchester() {
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = film.current; if (!video) return;
    if (reducedMotion()) { video.pause(); return; }
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void video.play().catch(() => {}); else video.pause(); }, { threshold: .1 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return <section className="manchester" id="manchester" data-tone="dark" aria-labelledby="manchester-title" tabIndex={-1}>
    <div className="wrap manchester-grid">
      <div className="manchester-copy">
        <h2 className="h-display" id="manchester-title" data-reveal="heading">
          {manchester.lines[0]}<br /><span className="accent">{manchester.lines[1]}</span>
        </h2>
        <p className="manchester-text" data-reveal="text">{manchester.contract}</p>
        <div className="manchester-actions">
          <Button href={getInTouch.href} tone="lime">{getInTouch.label}</Button>
          <Button href={pages.contract} tone="white">Contract & Toll services</Button>
        </div>
      </div>
      <div className="manchester-film tone" data-reveal="image">
        <video ref={film} src={manchester.film.src} poster={manchester.film.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
    </div>
  </section>;
}
