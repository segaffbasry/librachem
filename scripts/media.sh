#!/bin/sh
# Downloads every image and film the live homepage uses (into _scrape/raw, gitignored) and writes the web versions
# to public/media. Needs curl, ffmpeg and python3 with Pillow. Run: npm run media
#
# Treatment (README "Photography"): every photo is mapped onto the palette as a navy-to-white duotone, so the stock
# sector shots (pink jars, red triggers, orange sunsets) sit in the same two inks as the logo. The films stay in
# colour files and are toned in CSS (grayscale + navy multiply), which keeps them light to ship.
set -e
cd "$(dirname "$0")/.."
RAW=_scrape/raw
OUT=public/media
mkdir -p "$RAW" "$OUT" public/badges
U=https://librachem.co.uk/wp-content/uploads

fetch() { [ -s "$RAW/$(echo "$1" | tr / _)" ] || curl -sfL "$U/$1" -o "$RAW/$(echo "$1" | tr / _)"; }
for f in 2023/12/Libra-Chem-V3-online.mp4 2023/03/made-in-manchester-website-video-background.mp4 \
  2023/05/26.png 2023/05/32.png 2023/05/site-image.png 2023/05/bottles-image.png \
  2023/02/personal-care-home.jpg 2023/03/libra_hii_cleaning-inside-image.jpg 2023/02/agriculture-home.jpg \
  2023/02/oil-gas-home.jpg 2023/03/Industrial-home-page-e1677772295263.jpg \
  2023/07/image.png 2023/08/110.png 2023/09/libra-website-blue-chem-header-Large.png 2023/01/Sun-screen-.png \
  2023/07/4-1.png 2023/07/2-2.png 2023/07/3-2.png 2023/07/5-1.png 2023/08/33.png 2023/08/34.png \
  2026/01/RSPO-Logo-.png 2023/07/14.png 2023/07/12.png 2023/07/11.png 2025/08/medal.png 2025/11/badge-en.png; do
  fetch "$f"
done

# Films: the brand film (69s, 960x540 is the largest the site serves) and the "Made in Manchester" band (640x200).
# Audio stripped, H.264 for every browser, moov atom first so playback starts while it downloads.
ffmpeg -loglevel error -y -i "$RAW/2023_12_Libra-Chem-V3-online.mp4" -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "$OUT/libra-film.mp4"
ffmpeg -loglevel error -y -i "$RAW/2023_03_made-in-manchester-website-video-background.mp4" -an -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/manchester.mp4"
# Posters and two stills of the plant from the film itself (operator at the control screens, the reactor panel).
ffmpeg -loglevel error -y -ss 0.5 -i "$RAW/2023_12_Libra-Chem-V3-online.mp4" -frames:v 1 "$RAW/still-film-poster.png"
ffmpeg -loglevel error -y -ss 20 -i "$RAW/2023_12_Libra-Chem-V3-online.mp4" -frames:v 1 "$RAW/still-control-room.png"
ffmpeg -loglevel error -y -ss 45 -i "$RAW/2023_12_Libra-Chem-V3-online.mp4" -frames:v 1 "$RAW/still-reactor-panel.png"
ffmpeg -loglevel error -y -ss 1 -i "$RAW/2023_03_made-in-manchester-website-video-background.mp4" -frames:v 1 "$RAW/still-manchester-poster.png"

python3 - <<'PY'
from PIL import Image, ImageOps
RAW, OUT = "_scrape/raw", "public/media"
NAVY, WHITE = (0x26, 0x30, 0x68), (0xff, 0xff, 0xff)

def duotone(src, dst, width, crop=None, gamma=1.0):
    im = Image.open(f"{RAW}/{src}").convert("RGB")
    if crop: im = ImageOps.fit(im, crop, Image.LANCZOS)
    if im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)
    if gamma != 1.0: g = g.point(lambda v: round(255 * (v / 255) ** gamma))  # opens up the darker source shots
    ImageOps.colorize(g, NAVY, WHITE).save(f"{OUT}/{dst}", quality=82, optimize=True, progressive=True)

# Company photography (the Irlam site) and film stills.
duotone("2023_05_26.png", "head-office.jpg", 1600)
duotone("2023_05_32.png", "tank-farm.jpg", 1600)
duotone("2023_05_site-image.png", "site-aerial.jpg", 1600, gamma=0.6)  # the live file already carries a dark navy wash
duotone("still-control-room.png", "control-room.jpg", 960)
duotone("still-reactor-panel.png", "reactor-panel.jpg", 960)
duotone("2023_05_bottles-image.png", "glassware.jpg", 1600)
# Sector tiles (the live site's own tile images).
duotone("2023_02_personal-care-home.jpg", "sector-personal-care.jpg", 900)
duotone("2023_03_libra_hii_cleaning-inside-image.jpg", "sector-cleaning.jpg", 900)
duotone("2023_02_agriculture-home.jpg", "sector-agriculture.jpg", 900)
duotone("2023_02_oil-gas-home.jpg", "sector-oil-gas.jpg", 900)
duotone("2023_03_Industrial-home-page-e1677772295263.jpg", "sector-industrial.jpg", 900)
# Featured posts.
duotone("2023_07_image.png", "post-award.jpg", 800)
duotone("2023_08_110.png", "post-environmental.jpg", 800)
duotone("2023_09_libra-website-blue-chem-header-Large.png", "post-cb35.jpg", 800)
duotone("2023_01_Sun-screen-.png", "post-sunscreen.jpg", 800)
# Film posters: kept in colour, the CSS tone applies to poster and film alike so the swap is seamless.
for src, dst in (("still-film-poster.png", "libra-film-poster.jpg"), ("still-manchester-poster.png", "manchester-poster.jpg")):
    Image.open(f"{RAW}/{src}").convert("RGB").save(f"{OUT}/{dst}", quality=80, optimize=True, progressive=True)

# Accreditation marks: third-party logos, shown in one ink (navy) on white like the reference's member wall.
for src, dst in (("2023_07_4-1.png", "iso-45001"), ("2023_07_2-2.png", "iso-9001"), ("2023_07_3-2.png", "iso-14001"),
                 ("2023_07_5-1.png", "effci-gmp"), ("2023_08_33.png", "cosmos-organic"), ("2023_08_34.png", "cosmos-natural"),
                 ("2026_01_RSPO-Logo-.png", "rspo"), ("2023_07_14.png", "bcmpa"), ("2023_07_12.png", "british-safety-council"),
                 ("2023_07_11.png", "effci-member"), ("2025_08_medal.png", "ecovadis-silver"), ("2025_11_badge-en.png", "sedex-supplier-plus")):
    im = Image.open(f"{RAW}/{src}").convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    g = ImageOps.grayscale(bg.convert("RGB"))
    alpha = g.point(lambda v: min(255, round((255 - v) * 1.7)))  # dark ink -> opaque, white ground -> clear; mid greys firmed up
    bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    ink = Image.new("RGBA", im.size, NAVY + (0,)); ink.putalpha(alpha)
    ink = ink.crop(bbox); ink.thumbnail((360, 360), Image.LANCZOS)
    ink.save(f"public/badges/{dst}.png", optimize=True)
print("media done")
PY
ls -la "$OUT" public/badges | awk '{print $5, $9}'
