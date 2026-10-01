import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links that leave the page open in a new tab with rel="noopener" (brief); motion.tsx keeps them from navigating at all.
export const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

export function Arrow({ className = "arrow" }: { className?: string }) {
  return <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
}

/* ACN's large outline arrow from its event and news rows (a 50px line arrow, drawn here as a stroke). */
export function BigArrow() {
  return <svg className="big-arrow" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
    <path d="M4 22h35M26 9l13 13-13 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
}

/* THE COPIED INTERACTION (README "Copied interaction"): acnetwork.nl's `.new-button`.
   Live CSS (cdn.prod.website-files.com/620a8cb4d7be4f2bdbfaa281/css, read from the page's stylesheets):
     .new-button        { border: 1px solid var(--colors--text); background-color: var(--colors--surface);
                          box-shadow: 0 0 0 0 var(--colors--text); color: var(--colors--text); padding: .63em 2em;
                          transition: box-shadow .2s, transform .2s, opacity .3s; }
     .new-button:hover  { box-shadow: 6px 6px 0 0 var(--colors--text); transform: translate(-6px, -6px); }
     .cc-blue-shadow    { background-color: var(--deep-blue); box-shadow: 0 0 0 0 var(--blue); color: var(--white); }  (+ :hover shadow var(--blue))
     .cc-green          { border-color: var(--mint); background-color: var(--mint); color: var(--deep-blue); }
   Element structure is the same: <a class="new-button"><div class="button_text">…</div></a>.
   The button lifts up and left by 6px while a hard shadow of the same size grows out behind it, so it reads as a
   tile lifting off its own print. Shift, duration and curve are CSS custom properties (--btn-shift, --btn-dur,
   --btn-ease) in app/globals.css; the tones map ACN's variants onto the Libra palette (styles/ui.css). */
export function Button({ href, children, tone = "line", size, className = "", reveal = true, onClick }: {
  href: string; children: ReactNode; tone?: "line" | "navy" | "lime" | "white"; size?: "sm"; className?: string; reveal?: boolean; onClick?: () => void;
}) {
  return <a href={href} className={`btn btn-${tone}${size ? ` btn-${size}` : ""} ${className}`} data-reveal={reveal ? "label" : undefined} onClick={onClick} {...linkProps(href)}>
    <span className="btn-text">{children}</span>
  </a>;
}

export function SocialIcon({ icon, size = 18 }: { icon: BrandIcon; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="label eyebrow" data-reveal="label">{children}</p>;
}
