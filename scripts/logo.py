"""Rebuild the Libra logo as vector parts for the preloader and header (writes lib/logo.ts and public/logos/*.svg).

No vector logo is published anywhere (the live site only serves two 498x246 PNGs), so this traces the light-ground PNG:
  1. upscale 6x (Lanczos) and split it into the two brand inks by colour: navy letters, lime swooshes;
  2. label every connected shape in each ink (flood fill), so each letter and each swoosh is its own part;
  3. trace each part on its own with potrace (curve-fitted, holes kept) and convert potrace's relative, flipped
     coordinates back to absolute ones in the PNG's own 498x246 space.
Parts: L, I, B, R, A (the wordmark), the tagline's 19 letters (kept as one group), the lime wave across the A,
and the two orbit swooshes. Run: npm run logo (needs `brew install potrace`, Pillow and numpy).
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_scrape/raw/2022_11_Libra-Chemicals-Logo-LightBG.png"
SCALE = 6

im = Image.open(SRC).convert("RGBA")
W, H = im.size
big = np.array(im.resize((W * SCALE, H * SCALE), Image.LANCZOS)).astype(int)
r, g, b, a = big[..., 0], big[..., 1], big[..., 2], big[..., 3]
inks = {
    # Navy #263068 letters: blue clearly above red, green not dominant.
    "navy": (a > 110) & (b > r + 25) & (g < r + 60) & (r < 150),
    # Lime #a9ca49 swooshes: green well above blue.
    "lime": (a > 110) & (g > b + 40),
}


def components(mask):
    """Connected shapes of one ink (flood fill in C via Pillow; each pass seeds from the first unfilled pixel)."""
    canvas = Image.fromarray(np.where(mask, 255, 0).astype("uint8"))
    found = []
    while True:
        arr = np.array(canvas)
        seeds = np.flatnonzero(arr == 255)
        if not seeds.size:
            return found
        y, x = divmod(int(seeds[0]), arr.shape[1])
        ImageDraw.floodfill(canvas, (x, y), 128)
        part = np.array(canvas) == 128
        if part.sum() > 400 * SCALE:  # skip anti-aliasing specks
            found.append(part)
        canvas.paste(0, mask=Image.fromarray(part.astype("uint8") * 255))


def num_pairs(s):
    vals = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", s)]
    return list(zip(vals[0::2], vals[1::2]))


def trace(mask):
    """potrace one shape; return an absolute SVG path in the source PNG's pixel space."""
    with tempfile.TemporaryDirectory() as tmp:
        pbm, svg = Path(tmp) / "p.pbm", Path(tmp) / "p.svg"
        Image.fromarray(np.where(mask, 0, 255).astype("uint8")).convert("1").save(pbm)
        subprocess.run(["potrace", str(pbm), "-s", "-o", str(svg), "-t", "20", "-a", "1.0", "-O", "0.4", "-u", "10"], check=True)
        text = svg.read_text()
    # potrace: <g transform="translate(0,Hpt) scale(0.1,-0.1)">; path data in 1/10 px, relative after each M.
    ht = float(re.search(r'translate\(0\.?0*,([\d.]+)\)', text).group(1))
    out = []
    for d in re.findall(r'<path d="([^"]+)"', text):
        cx = cy = sx = sy = 0.0
        for cmd, body in re.findall(r"([MmLlCcZz])([^MmLlCcZz]*)", d):
            pts = num_pairs(body)
            if cmd in "Zz":
                out.append("Z"); cx, cy = sx, sy; continue
            if cmd == "M":
                cx, cy = pts[0]; sx, sy = cx, cy; out.append(f"M{fmt(cx, cy, ht)}"); pts = pts[1:]; cmd = "L"
            elif cmd == "m":
                cx, cy = cx + pts[0][0], cy + pts[0][1]; sx, sy = cx, cy; out.append(f"M{fmt(cx, cy, ht)}"); pts = pts[1:]; cmd = "l"
            if cmd in "Ll":
                for px, py in pts:
                    cx, cy = (px, py) if cmd == "L" else (cx + px, cy + py)
                    out.append(f"L{fmt(cx, cy, ht)}")
            elif cmd in "Cc":
                for i in range(0, len(pts) - 2, 3):
                    p = pts[i:i + 3] if cmd == "C" else [(cx + x, cy + y) for x, y in pts[i:i + 3]]
                    out.append("C" + " ".join(fmt(x, y, ht) for x, y in p))
                    cx, cy = p[2]
    return "".join(out)


def fmt(x, y, ht):
    # 0.1 units -> px, flip y, then back down from the 6x canvas to the PNG's 498x246 space.
    return f"{x * 0.1 / SCALE:.1f} {(ht - y * 0.1) / SCALE:.1f}".replace(".0 ", " ")


def bbox(mask):
    ys, xs = np.nonzero(mask)
    return [xs.min() / SCALE, ys.min() / SCALE, xs.max() / SCALE, ys.max() / SCALE]


navy = [(bbox(m), m) for m in components(inks["navy"])]
lime = [(bbox(m), m) for m in components(inks["lime"])]

# Wordmark letters stand above y≈125 and are tall; tagline letters sit below.
letters = sorted([p for p in navy if p[0][3] - p[0][1] > 60], key=lambda p: p[0][0])
tagline = sorted([p for p in navy if p[0][3] - p[0][1] <= 60], key=lambda p: p[0][0])
assert len(letters) == 5, f"expected 5 wordmark letters, got {len(letters)}"
print(f"wordmark {len(letters)} letters, tagline {len(tagline)} shapes, lime {len(lime)} shapes")

# Lime: the wave is the shape inside the A's box; the two orbits are the remaining large ones (top-right, bottom-left).
a_box = letters[4][0]
wave = [p for p in lime if p[0][0] > a_box[0] - 30 and p[0][2] < a_box[2] + 40 and p[0][1] > a_box[1]]
orbits = sorted([p for p in lime if p not in wave], key=lambda p: -(p[0][2] - p[0][0]))[:2]
orbit_top = min(orbits, key=lambda p: p[0][1])
orbit_bottom = max(orbits, key=lambda p: p[0][1])

parts = [
    *({"id": f"letter-{c}", "group": "word", "fill": "navy", "d": trace(m), "box": bb} for c, (bb, m) in zip("LIBRA", letters)),
    {"id": "wave", "group": "mark", "fill": "lime", "d": "".join(trace(m) for _, m in wave), "box": wave[0][0]},
    {"id": "orbit-top", "group": "mark", "fill": "lime", "d": trace(orbit_top[1]), "box": orbit_top[0]},
    {"id": "orbit-bottom", "group": "mark", "fill": "lime", "d": trace(orbit_bottom[1]), "box": orbit_bottom[0]},
    {"id": "tagline", "group": "tagline", "fill": "navy", "d": "".join(trace(m) for _, m in tagline), "box": [tagline[0][0][0], min(t[0][1] for t in tagline), tagline[-1][0][2], max(t[0][3] for t in tagline)]},
]

# Tight viewBox around everything (the PNG has transparent margins).
xs = [p["box"][0] for p in parts] + [p["box"][2] for p in parts]
ys = [p["box"][1] for p in parts] + [p["box"][3] for p in parts]
pad = 2
vb = [float(x) for x in [round(min(xs) - pad, 1), round(min(ys) - pad, 1), round(max(xs) - min(xs) + pad * 2, 1), round(max(ys) - min(ys) + pad * 2, 1)]]

ts = ["/* Generated by scripts/logo.py from the live site's Libra-Chemicals-Logo-LightBG.png (no vector logo is published).",
      "   Coordinates are the PNG's own pixel space. `fill` names a palette token: navy letters, lime swooshes. */",
      f"export const logoViewBox = \"{' '.join(map(str, vb))}\";",
      "export type LogoPart = { id: string; group: \"word\" | \"mark\" | \"tagline\"; fill: \"navy\" | \"lime\"; d: string };",
      "export const logoParts: LogoPart[] = " + json.dumps([{k: p[k] for k in ("id", "group", "fill", "d")} for p in parts], indent=2) + ";", ""]
(ROOT / "lib/logo.ts").write_text("\n".join(ts))

colours = {"navy": "#263068", "lime": "#a9ca49", "white": "#ffffff"}
for name, word in (("libra-logo", "navy"), ("libra-logo-white", "white")):
    paths = "".join(f'<path fill="{colours[word if p["fill"] == "navy" else "lime"]}" d="{p["d"]}"/>' for p in parts)
    (ROOT / f"public/logos/{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str, vb))}">{paths}</svg>\n')
print("viewBox", vb)
