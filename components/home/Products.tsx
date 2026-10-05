import { Arrow, Button, Eyebrow, linkProps } from "@/components/ui";
import { products } from "@/lib/content";

/* Our products: the twelve real Libra ranges from /libra-products/, on ACN's ruled grid (the member-wall
   pattern). Each cell gives the surfactant family, the range name and the live page's one-line summary, and links
   to that range. The catalogue and product guide sit with the intro. */
export function Products() {
  return <section className="products section" id="products" data-tone="mist" aria-labelledby="products-title" tabIndex={-1}>
    <div className="wrap">
      <div className="products-head">
        <div>
          <Eyebrow>{products.eyebrow}</Eyebrow>
          <h2 className="h2" id="products-title" data-reveal="heading">{products.title}</h2>
        </div>
        <div className="products-intro">
          <p className="copy" data-reveal="text">{products.body}</p>
          <div className="products-actions">
            <Button href={products.catalog.href} tone="navy">{products.catalog.label}</Button>
            <Button href={products.guide.href} tone="line">{products.guide.label}</Button>
          </div>
        </div>
      </div>
      <ul className="ranges">
        {products.items.map((p) => <li key={p.href} className="range" data-reveal="card">
          <a href={p.href} {...linkProps(p.href)}>
            <span className="range-family label">{p.family}</span>
            <h3 className="range-name">{p.name}</h3>
            <p className="range-text">{p.text}</p>
            <Arrow />
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
