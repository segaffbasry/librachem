"use client";

import { useState } from "react";
import { BigArrow, Eyebrow, linkProps } from "@/components/ui";
import { sectors } from "@/lib/content";

/* Industrial sectors: the five live application markets as ACN's event rows (hairline above and below, name left,
   description right, large arrow). One photograph panel sits beside the list and shows the sector under the pointer
   or keyboard focus, crossfading on ACN's 0.5s "ease"; it starts on the first sector. On phones each row shows its
   own photo instead. */
export function Sectors() {
  const [active, setActive] = useState(0);
  return <section className="sectors section" id="sectors" aria-labelledby="sectors-title" tabIndex={-1}>
    <div className="wrap">
      <div className="section-head">
        <Eyebrow>{sectors.eyebrow}</Eyebrow>
        <div className="sectors-intro">
          <h2 className="h2" id="sectors-title" data-reveal="heading">{sectors.title}</h2>
          <p className="copy" data-reveal="text">{sectors.body}</p>
        </div>
      </div>
      <div className="sectors-grid">
        <div className="sectors-media" data-reveal="image" aria-hidden="true">
          {sectors.items.map((s, i) => <img key={s.name} src={s.photo.src} alt="" width={s.photo.w} height={s.photo.h} loading="lazy" className={i === active ? "is-active" : undefined} />)}
        </div>
        <ul className="sector-list">
          {sectors.items.map((s, i) => <li key={s.name} data-reveal="card">
            <a href={s.href} className={`sector${i === active ? " is-active" : ""}`} {...linkProps(s.href)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <img className="sector-thumb" src={s.photo.src} alt={s.photo.alt} width={s.photo.w} height={s.photo.h} loading="lazy" />
              <h3 className="h3 sector-name">{s.name}</h3>
              <p className="sector-text muted">{s.text}</p>
              <BigArrow />
            </a>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
