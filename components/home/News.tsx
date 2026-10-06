import { BigArrow, Button, Eyebrow, linkProps } from "@/components/ui";
import { news, newsSection, shortDate } from "@/lib/content";

/* "Latest News" as ACN's news cards: image, title and a large arrow, on a ruled grid (three across here).
   The live "Events & Awards" row was removed at the client's request (2026-10-06). */
export function News() {
  return <section className="news section" id="news" data-tone="mist" aria-labelledby="news-title" data-late tabIndex={-1}>
    <div className="wrap">
      <div className="news-head">
        <div>
          <Eyebrow>{newsSection.eyebrow}</Eyebrow>
          <h2 className="h2" id="news-title" data-reveal="heading">{newsSection.title}</h2>
        </div>
        <Button href={newsSection.all.href} tone="line" size="sm">{newsSection.all.label}</Button>
      </div>
      <ul className="posts">
        {news.map((n) => <li key={n.href} className="post" data-reveal="card">
          <a href={n.href} {...linkProps(n.href)}>
            <div className="post-photo"><img src={n.photo.src} alt="" width={n.photo.w} height={n.photo.h} loading="lazy" className={n.photo.contain ? "is-contain" : undefined} style={n.photo.focus ? { objectPosition: n.photo.focus } : undefined} /></div>
            <div className="post-body">
              <p className="post-meta muted"><time dateTime={n.date}>{shortDate(n.date)}</time> · {n.category}</p>
              <h3 className="h3">{n.title}</h3>
              <p className="post-text muted">{n.excerpt}</p>
            </div>
            <BigArrow />
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
