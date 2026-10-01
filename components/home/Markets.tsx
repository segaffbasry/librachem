import { Arrow, Eyebrow, linkProps } from "@/components/ui";
import { markets, tiles } from "@/lib/content";

/* The live homepage's image tiles, laid out like ACN's member wall: one ruled grid of equal cells, four across.
   Each cell is a photograph and a name; on hover the photograph eases in and the arrow steps forward. */
export function Markets() {
  return <section className="markets section" id="markets" data-tone="mist" aria-labelledby="markets-title" tabIndex={-1}>
    <div className="wrap">
      <div className="section-head">
        <Eyebrow>{markets.eyebrow}</Eyebrow>
        <h2 className="h2" id="markets-title" data-reveal="heading">{markets.title}</h2>
      </div>
      <ul className="tiles">
        {tiles.map((t) => <li key={t.title} className="tile" data-reveal="card">
          <a href={t.href} {...linkProps(t.href)}>
            <div className="tile-photo"><img src={t.photo.src} alt="" width={t.photo.w} height={t.photo.h} loading="lazy" /></div>
            <span className="tile-name">{t.title}<Arrow /></span>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
