import { linkProps } from "@/components/ui";
import { accreditations, badges } from "@/lib/content";
import type { Badge } from "@/lib/content";

/* Accreditations as a scrolling logo strip directly under the hero (client feedback: "logos should just be
   scrolling and we don't need such a big section"). This is ACN's own hero pattern: its member logos run in a
   marquee under the headline. The track holds the twelve marks twice and slides by half its width, so the loop is
   seamless; the copy is aria-hidden and unfocusable. It pauses on hover and keyboard focus, and with reduced motion
   it stops and becomes a plain horizontally scrollable row. */
function Mark({ badge, copy }: { badge: Badge; copy?: boolean }) {
  const img = <img src={badge.src} alt={copy ? "" : badge.label} title={badge.label} />;
  if (!badge.href) return <li className="mark">{img}</li>;
  return <li className="mark"><a href={badge.href} {...linkProps(badge.href)} tabIndex={copy ? -1 : undefined} aria-label={copy ? undefined : `${badge.label} certificate`}>{img}</a></li>;
}

export function Accreditations() {
  return <section className="accreditations" id="accreditations" aria-labelledby="acc-title" tabIndex={-1}>
    <div className="wrap acc-strip">
      <div className="acc-label">
        <h2 className="label" id="acc-title">{accreditations.title}</h2>
        <a href={accreditations.cta.href} className="u-link acc-link" {...linkProps(accreditations.cta.href)}>View certificates</a>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          <ul>{badges.map((b) => <Mark key={b.label} badge={b} />)}</ul>
          <ul aria-hidden="true">{badges.map((b) => <Mark key={b.label} badge={b} copy />)}</ul>
        </div>
      </div>
    </div>
  </section>;
}
