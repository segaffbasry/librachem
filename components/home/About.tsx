import { Arrow, Button, Eyebrow, linkProps } from "@/components/ui";
import { about, pillars } from "@/lib/content";

/* ACN's "What does ACN do?" block: a small label, a capitalised statement, then three cards stepping down the page,
   each on a different ground (white with a hairline, mist, navy). Libra's three "Learn more about" boxes take the
   cards, each led by a photograph of the Irlam site. */
export function About() {
  return <section className="about section" id="about" aria-labelledby="about-title" tabIndex={-1}>
    <div className="wrap">
      <div className="about-head">
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <div className="about-intro">
          <h2 className="h2" id="about-title" data-reveal="heading">{about.statement}</h2>
          <p className="lead" data-reveal="text">{about.body}</p>
          <Button href={about.href} tone="line">About us</Button>
        </div>
      </div>
      <p className="label about-more" data-reveal="label">{about.learnMore}</p>
      <ul className="pillars">
        {pillars.map((p, i) => <li key={p.title} className={`pillar pillar-${i + 1}`} data-reveal="card" data-tone={i === 2 ? "dark" : i === 1 ? "mist" : undefined}>
          <a href={p.href} {...linkProps(p.href)}>
            <div className="pillar-photo" data-parallax><img src={p.photo.src} alt={p.photo.alt} width={p.photo.w} height={p.photo.h} loading="lazy" /></div>
            <div className="pillar-body">
              <h3 className="h3">{p.title}</h3>
              <p className="pillar-text">{p.text}</p>
              <span className="pillar-cta">{p.cta}<Arrow /></span>
            </div>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
