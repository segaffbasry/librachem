import { Arrow, Eyebrow, linkProps } from "@/components/ui";
import { about } from "@/lib/content";

/* About us as its own section (client feedback): the company in a paragraph and a half, four facts from the live
   Our Company and Why Choose Libra pages on a ruled row (ACN's hairline grid), the site in two photographs, and the
   three About pages as links. */
export function About() {
  return <section className="about section" id="about" aria-labelledby="about-title" tabIndex={-1}>
    <div className="wrap">
      <div className="about-grid">
        <div className="about-copy">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h2 className="h2" id="about-title" data-reveal="heading">{about.title}</h2>
          <p className="lead" data-reveal="text">{about.body}</p>
          <p className="copy" data-reveal="text">{about.story}</p>
          <ul className="about-links">
            {about.links.map((l) => <li key={l.href} data-reveal="label"><a href={l.href} {...linkProps(l.href)}><span>{l.label}</span><Arrow /></a></li>)}
          </ul>
        </div>
        <div className="about-photos">
          <figure className="about-photo about-photo-main" data-reveal="image" data-parallax>
            <img src={about.photo.src} alt={about.photo.alt} width={about.photo.w} height={about.photo.h} loading="lazy" />
          </figure>
          <figure className="about-photo about-photo-inset" data-reveal="image">
            <img src={about.photo2.src} alt={about.photo2.alt} width={about.photo2.w} height={about.photo2.h} loading="lazy" />
          </figure>
        </div>
      </div>
      <dl className="facts">
        {about.facts.map((f) => <div key={f.value} className="fact" data-reveal="card">
          <dt className="fact-value">{f.value}</dt>
          <dd className="fact-label">{f.label}</dd>
        </div>)}
      </dl>
    </div>
  </section>;
}
