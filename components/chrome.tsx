"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { linko } from "@/lib/content";
import { contact, getInTouch, navGroups, socials, usefulLinks } from "@/lib/site";

// Menu shortcuts to the homepage's own sections (scrolled through Lenis).
const onPage = [
  { label: "Home", href: "#top" },
  { label: "About Libra", href: "#about" },
  { label: "Markets", href: "#markets" },
  { label: "Accreditations", href: "#accreditations" },
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

/* Frameless header in ACN's arrangement: logo left, the site's sections in a row, a bordered button at the end.
   No bar or box: its colour follows the section underneath (motion.tsx sets html[data-header]); it slides away on
   the way down and returns on the way up (ACN's PAGE_SCROLL_DOWN / PAGE_SCROLL_UP interaction). */
function Header() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(-1);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      el.classList.toggle("is-scrolled", y > 8);
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  const openAt = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => { setTrigger(event.currentTarget); setGroup(index); setOpen(true); };

  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Libra Speciality Chemicals, back to the top"><Logo title="" /></a>
        <nav className="header-nav" aria-label="Main" data-hero-part>
          <ul>{navGroups.map((g, i) => <li key={g.label}>
            <button className="header-link" aria-haspopup="dialog" aria-expanded={open && group === i} aria-controls="site-menu" onClick={openAt(i)}>{g.label}</button>
          </li>)}</ul>
        </nav>
        <div className="header-actions" data-hero-part>
          <Button href={getInTouch.href} tone="line" size="sm" className="header-cta" reveal={false}>{getInTouch.label}</Button>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={openAt(-1)}>
            <span>Menu</span><span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} group={group} />
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
