"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { about, events, linko, manchester, products, sectors } from "@/lib/content";
import { contact, getInTouch, navGroups, socials, usefulLinks } from "@/lib/site";

// Menu shortcuts to the homepage's own sections (scrolled through Lenis).
const onPage = [
  { label: "Home", href: "#top" },
  { label: "About us", href: "#about" },
  { label: "Our products", href: "#products" },
  { label: "Industrial sectors", href: "#sectors" },
  { label: "Contract & Toll", href: "#manchester" },
  { label: "News & events", href: "#news" },
  { label: "Contact", href: "#contact" },
];

/* Full-screen menu carrying the live site's five dropdowns. In: a navy panel wipes down from the header
   (clip-path), then every item rises into place, one after another, on one GSAP timeline; reverse() plays the exact
   way out. The header's group names open it with that group focused. Focus is trapped, Esc closes, focus returns
   to whichever control opened it. */
function Menu({ open, close, trigger, group }: { open: boolean; close: () => void; trigger: HTMLElement | null; group: number }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "libra" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, stagger: { amount: .4 } }, .28);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      const first = group >= 0 ? el.querySelector<HTMLElement>(`[data-group="${group}"] a`) : null;
      return focusOverlay(el, close, trigger, first);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close, trigger, group]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <div className="menu-top wrap">
      <a href="#top" className="brand" onClick={close} aria-label="Libra Speciality Chemicals, back to the top"><Logo title="" /></a>
      <button className="menu-close" onClick={close}><span>Close</span><span className="menu-close-x" aria-hidden="true" /></button>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-page" aria-label="On this page">
        <p className="menu-label label" data-menu-in>On this page</p>
        <ul>{onPage.map((l) => <li key={l.href} data-menu-in><a href={l.href} onClick={close}><span>{l.label}</span><Arrow /></a></li>)}</ul>
      </nav>
      <nav className="menu-groups" aria-label="Libra site">
        {navGroups.map((g, i) => <div key={g.label} className={`menu-group${i === group ? " is-current" : ""}`} data-group={i}>
          <a href={g.href} className="menu-label label" data-menu-in {...linkProps(g.href)}>{g.label}</a>
          <ul>{g.links.map((l) => <li key={l.href + l.label} data-menu-in><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </div>)}
      </nav>
    </div>
    <div className="menu-foot wrap" data-menu-in>
      <a href={contact.tel}>{contact.phone}</a>
      <a href={contact.mailto}>{contact.email}</a>
      <Button href={getInTouch.href} tone="lime" size="sm" reveal={false}>{getInTouch.label}</Button>
    </div>
  </div>;
}

/* Header, after abatable.com (client reference, 2026-10-05). Measured there: a fixed white bar 1.25em from the top,
   inset to the page margins (`.mega-nav { left/right: var(--site--margin); top: 1.25em }`), 71px tall at 1440,
   0.25em radius; logo first with 3em after it, then the section triggers with a caret (0.9375em, 0.375em 0.625em
   padding, 0.25em radius); an outline and a filled button at the far end; each trigger drops a white mega panel
   joined to the bar's underside (columns split by 1px rules, a feature card with an image), and the page behind
   dims to rgba(0,0,0,.25). Here the dim is navy at 25%, the panel lists the live dropdown's links and its card
   shows one of Libra's photos. Hover opens a panel (click or Enter on touch and keyboards); leaving the bar and panel, Esc or a click outside closes it,
   focus returns to the trigger. Under 1180px the triggers give way to "Menu" and the full-screen menu.
   The bar slides away on the way down and returns on the way up (ACN's PAGE_SCROLL_DOWN / UP). */
const features = [
  { src: "/media/head-office.jpg", text: about.title },
  { src: "/media/glassware.jpg", text: products.title },
  { src: "/media/site-aerial.jpg", text: sectors.title },
  { src: "/media/tank-farm.jpg", text: manchester.contract },
  { src: "/media/post-award.jpg", text: events[0].title },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(-1);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  /* Hover opens a panel (pointer devices only); leaving the bar and panel closes it after a 150ms grace, so the
     pointer can travel from a trigger down into its panel. Click and Enter still toggle, for touch and keyboards. */
  const leaveTimer = useRef(0);
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hoverOpen = (index: number) => { if (!canHover()) return; window.clearTimeout(leaveTimer.current); setPanel(index); };
  const hoverStay = () => window.clearTimeout(leaveTimer.current);
  const hoverLeave = () => { if (!canHover()) return; window.clearTimeout(leaveTimer.current); leaveTimer.current = window.setTimeout(() => setPanel(-1), 150); };
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  const closePanel = useCallback((refocus = false) => {
    setPanel((current) => {
      if (refocus && current >= 0) bar.current?.querySelector<HTMLElement>(`[data-panel-trigger="${current}"]`)?.focus();
      return -1;
    });
  }, []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      if (delta > 0) closePanel();
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, [closePanel]);

  // An open panel closes on Escape (focus back to its trigger) or on a click anywhere outside the bar.
  useEffect(() => {
    if (panel < 0) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closePanel(true); };
    const onDown = (event: PointerEvent) => { if (!bar.current?.contains(event.target as Node)) closePanel(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [panel, closePanel]);

  return <>
    <div className={`header-dim${panel >= 0 ? " is-on" : ""}`} aria-hidden="true" />
    <header className={`site-header${panel >= 0 ? " has-panel" : ""}`} ref={bar} onMouseLeave={hoverLeave} onMouseEnter={hoverStay}>
      <div className="header-bar" data-hero-part>
        <a href="#top" className="brand" aria-label="Libra Speciality Chemicals, back to the top" onMouseEnter={hoverLeave}><Logo title="" /></a>
        <nav className="header-nav" aria-label="Main">
          <ul>{navGroups.map((g, i) => <li key={g.label}>
            <button className={`header-link${panel === i ? " is-open" : ""}`} data-panel-trigger={i} aria-expanded={panel === i} aria-controls={`panel-${i}`} onMouseEnter={() => hoverOpen(i)} onClick={() => { if (!canHover()) setPanel(panel === i ? -1 : i); else setPanel(i); }}>
              <span>{g.label}</span>
              <svg className="caret" viewBox="0 0 18 18" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 7.5 9 11.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </li>)}</ul>
        </nav>
        <div className="header-actions" onMouseEnter={hoverLeave}>
          <a href={products.catalog.href} className="header-secondary" {...linkProps(products.catalog.href)}>{products.catalog.label}</a>
          <Button href={getInTouch.href} tone="navy" size="sm" className="header-cta" reveal={false}>{getInTouch.label}</Button>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>
            <span>Menu</span><span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
      <div className="header-panels">
        {navGroups.map((g, i) => <div key={g.label} id={`panel-${i}`} className={`header-panel${panel === i ? " is-open" : ""}`} inert={panel !== i} aria-hidden={panel !== i}>
          <div className="panel-col panel-links">
            <a href={g.href} className="panel-title" {...linkProps(g.href)}>{g.label}<Arrow /></a>
            <ul className={g.links.length > 6 ? "is-two" : undefined}>
              {g.links.map((l) => <li key={l.href + l.label}><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}
            </ul>
          </div>
          <a href={g.href} className="panel-col panel-card" {...linkProps(g.href)}>
            <img src={features[i].src} alt="" loading="lazy" />
            <span className="panel-card-text">{features[i].text}</span>
            <span className="panel-card-cta">Visit {g.label}<Arrow /></span>
          </a>
        </div>)}
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} group={-1} />
  </>;
}

/* ACN closes on a full-width colour field (its blue footer); here it is navy, carrying the live footer's content:
   address, phone, email, office hours, the "Useful Links and Resources" list and the registered company line. */
function Footer() {
  return <footer className="site-footer" id="contact" data-tone="dark" data-late tabIndex={-1}>
    <div className="wrap">
      <div className="footer-top">
        <a href="#top" className="footer-logo" aria-label="Libra Speciality Chemicals, back to the top"><Logo title="" /></a>
        <div className="footer-cta">
          <h2 className="h-display" data-reveal="heading">{getInTouch.label}</h2>
          <div className="footer-actions">
            <Button href={getInTouch.href} tone="lime">Contact form</Button>
            <Button href={contact.mailto} tone="white">{contact.email}</Button>
          </div>
        </div>
      </div>
      <div className="footer-grid">
        <div className="footer-col" data-reveal="card">
          <h3 className="label">Visit</h3>
          <a href={contact.map} {...linkProps(contact.map)} className="u-link"><address>{contact.company}<br />{contact.address.map((line) => <span key={line}>{line}<br /></span>)}</address></a>
        </div>
        <div className="footer-col" data-reveal="card">
          <h3 className="label">Contact</h3>
          <a href={contact.tel} className="u-link">{contact.phone}</a>
          <a href={contact.mailto} className="u-link">{contact.email}</a>
          <p>{contact.hours}</p>
        </div>
        <div className="footer-col" data-reveal="card">
          <h3 className="label">Useful links and resources</h3>
          <ul>{usefulLinks.map((l) => <li key={l.label}><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </div>
        <div className="footer-col" data-reveal="card">
          <h3 className="label">Follow</h3>
          <ul>
            {socials.map((s) => <li key={s.name}><a href={s.href} className="footer-social u-link" {...linkProps(s.href)}><SocialIcon icon={s.icon} /><span>{s.name}</span></a></li>)}
            <li><a href={linko.href} className="u-link" {...linkProps(linko.href)}>{linko.label}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">
        <p>{contact.registered}</p>
        <a href="#top" className="u-link">Back to top</a>
      </div>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
