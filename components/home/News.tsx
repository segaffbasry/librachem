import { BigArrow, Button, Eyebrow, linkProps } from "@/components/ui";
import { events, news, newsSection, shortDate } from "@/lib/content";

/* ACN's two listing patterns, one for each live block:
   "Events & Awards"  ACN's event row: date and title on the left, the description to the right, a large arrow at the
                      end, a hairline above and below; Libra's award badge sits in the row.
   "Latest News"      ACN's news cards: image, title and a large arrow, on a ruled grid (three across here). */
export function News() {
  return <section className="news section" id="news" data-tone="mist" aria-labelledby="news-title" data-late tabIndex={-1}>
    <div className="wrap">
      <div className="section-head">
        <Eyebrow>{newsSection.eyebrow}</Eyebrow>
        <h2 className="h2" data-reveal="heading">{newsSection.events}</h2>
      </div>
      <ul className="events">
        {events.map((e) => <li key={e.href} data-reveal="card">
          <a href={e.href} className="event" {...linkProps(e.href)}>
            <div className="event-main">
              <p className="event-date muted"><time dateTime={e.date}>{shortDate(e.date)}</time> · {e.category}</p>
              <h3 className="h3">{e.title}</h3>
            </div>
            <img className="event-image" src={e.photo.src} alt={e.photo.alt} width={e.photo.w} height={e.photo.h} loading="lazy" />
            <p className="event-text muted">{e.excerpt}</p>
            <BigArrow />
          </a>
        </li>)}
      </ul>

      <div className="news-head">
        <h2 className="h2" id="news-title" data-reveal="heading">{newsSection.title}</h2>
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
