import { Button, linkProps } from "@/components/ui";
import { accreditations, badges } from "@/lib/content";

/* ACN's member wall, almost exactly: a ruled grid of square cells, one mark in each. All twelve live badges are
   here, in one ink. Badges with a live certificate or directory link are links; the rest are plain cells. */
export function Accreditations() {
  return <section className="accreditations section" id="accreditations" aria-labelledby="acc-title" data-late tabIndex={-1}>
    <div className="wrap">
      <div className="acc-head">
        <h2 className="h2" id="acc-title" data-reveal="heading">{accreditations.title}</h2>
        <div className="copy acc-copy">{accreditations.text.map((t) => <p key={t} data-reveal="text">{t}</p>)}</div>
      </div>
      <ul className="badges">
        {badges.map((b) => {
          const inner = <><img src={b.src} alt="" loading="lazy" /><span className="badge-name">{b.label}</span></>;
          return <li key={b.label} className="badge" data-reveal="card">
            {b.href ? <a href={b.href} {...linkProps(b.href)} aria-label={`${b.label} (certificate)`}>{inner}</a> : <div>{inner}</div>}
          </li>;
        })}
      </ul>
      <div className="acc-foot"><Button href={accreditations.cta.href} tone="line">{accreditations.cta.label}</Button></div>
    </div>
  </section>;
}
