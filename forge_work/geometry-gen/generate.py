#!/usr/bin/env python3
"""
GEOMETRY — arif-fazil.com animated visual canon
Generates 9 domain visuals + showcase index. Pure SVG + CSS/SMIL. Zero JS.
Canon: PRIMER-1 design tokens (ratified F13, 2026-08-01).
  yellow #FFCC00 human · blue #1E3A8A institution · teal #00D4AA earth · red RATIONED
  type: IBM Plex Sans/Serif/Mono · dark field #0a0a0f
Output: sites/shared/design-system/geometry/ → served /_shared/design-system/geometry/
"""

import math, os, html

OUT = "/root/arif-fazil.com/sites/shared/design-system/geometry"
os.makedirs(OUT, exist_ok=True)

# ── canon palette ─────────────────────────────────────────────
BG = "#0a0a0f"
PANEL = "#101018"
DIM = "#1a1a25"
INK = "#e8e8ef"
MUT = "#9a9aa8"
Y500, Y700, Y900 = "#FFCC00", "#B8860B", "#5C4500"
Y50, Y100, Y300 = "#FFFAEB", "#FFF0C2", "#FFD54F"
B500, B700, B900 = "#1E3A8A", "#152C6B", "#0C1A45"
B100, B300 = "#D6E4FF", "#91B0F2"
T500, T700, T900 = "#00D4AA", "#047857", "#064E3B"
T100, T300 = "#B2F5EA", "#4FD1C5"
R500 = "#E63946"  # rationed — seal strip only

W, H = 1200, 630

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — GEOMETRY · arif-fazil.com</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Serif:wght@700&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{height:100%}}
body{{background:{bg};display:grid;place-items:center;overflow:hidden}}
.afg-stage{{position:relative;width:100vw;height:100vh;max-width:100vw}}
.afg-stage svg{{width:100%;height:100%;display:block}}
.afg-cap{{position:absolute;left:2rem;bottom:1.4rem;font-family:'IBM Plex Mono',monospace;
 font-size:.68rem;letter-spacing:2.5px;color:{mut};text-transform:uppercase;z-index:5}}
.afg-cap b{{color:{cap};font-weight:600}}
.afg-cap .rule{{display:inline-block;width:34px;height:1px;background:{cap};vertical-align:middle;margin-right:.7rem;opacity:.7}}
{css}
</style>
</head>
<body>
<div class="afg-stage">
{svg}
<div class="afg-cap"><span class="rule"></span><b>{domain}</b>&ensp;{organ}</div>
</div>
</body>
</html>
"""


# ── helpers ───────────────────────────────────────────────────
def sine_path(base_y, amp, wl, phase, x0=0, x1=2400, step=16, close_to=None):
    """Smooth sine polyline. If close_to given, close as filled area down to that y."""
    pts = []
    x = x0
    while x <= x1:
        y = base_y + amp * math.sin(2 * math.pi * (x - x0) / wl + phase)
        pts.append(f"{x:.0f},{y:.1f}")
        x += step
    d = "M" + " L".join(pts)
    if close_to is not None:
        d += f" L{x1},{close_to} L{x0},{close_to} Z"
    return d


def komda_series(n, seed, start, vol):
    """Deterministic candle walk."""
    out, price = [], start
    for i in range(n):
        drift = math.sin(i * 0.9 + seed) * 0.6 + math.sin(i * 0.31 + seed * 2.7) * 0.4
        o = price
        c = o + drift * vol
        hi = max(o, c) + abs(math.sin(i * 1.7 + seed)) * vol * 0.55
        lo = min(o, c) - abs(math.cos(i * 1.3 + seed)) * vol * 0.55
        out.append((o, c, hi, lo))
        price = c
    return out


def candles_svg(
    series, x0, y_top, plot_w, plot_h, cw, gap, cls, lo_price, hi_price, delay_step=0.05
):
    """Render candles. Up=yellow(human), down=blue(institution). Canon: no red."""
    span = hi_price - lo_price or 1

    def y(p):
        return y_top + (hi_price - p) / span * plot_h

    g = []
    x = x0
    for i, (o, c, hi, lo) in enumerate(series):
        up = c >= o
        col = Y500 if up else B500
        body_top, body_bot = (y(c), y(o)) if up else (y(o), y(c))
        bh = max(body_bot - body_top, 2.5)
        d = f"{i * delay_step:.2f}s"
        g.append(
            f'<g class="{cls}" style="animation-delay:{d}">'
            f'<line x1="{x + cw / 2:.1f}" y1="{y(hi):.1f}" x2="{x + cw / 2:.1f}" y2="{y(lo):.1f}" stroke="{col}" stroke-width="1.4" opacity=".8"/>'
            f'<rect x="{x:.1f}" y="{body_top:.1f}" width="{cw:.1f}" height="{bh:.1f}" fill="{col}" rx="1"/>'
            f"</g>"
        )
        x += cw + gap
    return "\n".join(g), x


# ════════════════════════════════════════════════════════════
# 1 · EARTH — SEISMIC SWELL · /earth · Φ GEOX
# ════════════════════════════════════════════════════════════
def earth_wave():
    layers = [
        # base_y, amp, wavelength, phase, fill, opacity, dur, dir, extra
        (300, 26, 900, 0.0, T900, 0.95, 44, 1, ""),
        (330, 34, 720, 1.3, "#05594a", 0.9, 34, -1, ""),
        (360, 30, 560, 2.1, T700, 0.85, 26, 1, ""),
        (392, 38, 470, 0.7, "#059678", 0.8, 19, -1, ""),
        (428, 34, 380, 2.9, T500, 0.7, 13, 1, ""),
        (466, 28, 300, 1.8, T300, 0.55, 9, -1, ""),
    ]
    wave_svg = []
    for i, (by, amp, wl, ph, fill, op, dur, dr, _) in enumerate(layers):
        d = sine_path(by, amp, wl, ph, close_to=H + 60)
        wave_svg.append(
            f'<g class="afge-w" style="animation-duration:{dur}s;animation-direction:{"normal" if dr > 0 else "reverse"}">'
            f'<path d="{d}" fill="{fill}" opacity="{op}" transform="translate(0,0)"/></g>'
        )
    # seismic trace — bright line riding layer 5, with scanning witness dot
    trace_d = sine_path(428, 34, 380, 2.9, x0=0, x1=1200, step=8)
    css = f"""
.afge-w{{animation-name:afgeDrift;animation-timing-function:linear;animation-iteration-count:infinite}}
.afge-w path{{will-change:transform}}
@keyframes afgeDrift{{from{{transform:translateX(0)}}to{{transform:translateX(-1200px)}}}}
.afge-grid{{animation:afgeBreathe 7s ease-in-out infinite}}
@keyframes afgeBreathe{{0%,100%{{opacity:.14}}50%{{opacity:.3}}}}
.afge-trace{{stroke-dasharray:5 9;animation:afgeTrace 3.2s linear infinite}}
@keyframes afgeTrace{{to{{stroke-dashoffset:-56}}}}
.afge-scan{{animation:afgeScanX 8s ease-in-out infinite}}
@keyframes afgeScanX{{0%,100%{{transform:translateX(0)}}50%{{transform:translateX(940px)}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated seismic waves — GEOX earth intelligence">
<defs>
 <linearGradient id="afgeSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="{BG}"/><stop offset=".55" stop-color="#071712"/><stop offset="1" stop-color="{T900}"/>
 </linearGradient>
 <radialGradient id="afgeGlow" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="{T500}" stop-opacity=".5"/><stop offset="1" stop-color="{T500}" stop-opacity="0"/>
 </radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgeSky)"/>
<g class="afge-grid" stroke="{T300}" stroke-width=".5" opacity=".18">
 {"".join(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>' for x in range(0, W + 1, 120))}
 {"".join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in range(60, H, 90))}
</g>
<ellipse cx="980" cy="120" rx="240" ry="120" fill="url(#afgeGlow)" opacity=".35"/>
<text x="60" y="108" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{T300}" opacity=".85">Φ GEOX · SEISMIC SWELL</text>
<text x="60" y="132" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">the dynamic planet · Macrostrat · live pipe</text>
{"".join(wave_svg)}
<path class="afge-trace" d="{trace_d}" fill="none" stroke="{T100}" stroke-width="1.6" opacity=".9"/>
<g class="afge-scan"><circle cx="130" cy="428" r="5" fill="{T100}"/><circle cx="130" cy="428" r="12" fill="none" stroke="{T100}" stroke-width="1" opacity=".5"/></g>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 2 · WEALTH — KOMDA FRACTAL · /economics · Ψ WEALTH
# ════════════════════════════════════════════════════════════
def wealth_komda():
    macro = komda_series(12, 3.1, 100, 16)
    meso = komda_series(36, 7.7, 100, 9)
    micro = komda_series(96, 1.9, 100, 5)

    def rng(s):
        return min(o for o, *_ in s), max(max(r[1], r[2]) for r in s)

    lo, hi = rng(macro)
    lo2, hi2 = rng(meso)
    lo3, hi3 = rng(micro)
    g1, _ = candles_svg(macro, 40, 90, 0, 440, 78, 18, "afgk-c", lo - 6, hi + 6, 0.09)
    g2, _ = candles_svg(
        meso, 40, 150, 0, 360, 24, 7.6, "afgk-c", lo2 - 4, hi2 + 4, 0.045
    )
    g3, _ = candles_svg(
        micro, 40, 235, 0, 250, 7.4, 3.1, "afgk-c", lo3 - 3, hi3 + 3, 0.02
    )
    # fibonacci arc — golden ratio sweep across the fractal
    arc = "M60,520 Q360,180 640,300 T1150,140"
    css = f"""
.afgk-c{{transform-box:fill-box;transform-origin:50% 100%;animation:afgkGrow .9s cubic-bezier(.2,.9,.3,1.2) both}}
@keyframes afgkGrow{{from{{transform:scaleY(0);opacity:0}}to{{transform:scaleY(1);opacity:1}}}}
.afgk-sweep{{animation:afgkSweep 6s linear infinite}}
@keyframes afgkSweep{{from{{transform:translateX(-260px)}}to{{transform:translateX(1300px)}}}}
.afgk-arc{{stroke-dasharray:1;stroke-dashoffset:1;pathLength:1;animation:afgkDraw 5s ease-in-out infinite}}
@keyframes afgkDraw{{0%{{stroke-dashoffset:1;opacity:0}}15%{{opacity:.85}}70%{{stroke-dashoffset:0;opacity:.85}}100%{{stroke-dashoffset:0;opacity:0}}}}
.afgk-pulse{{animation:afgkPulse 2.4s ease-in-out infinite}}
@keyframes afgkPulse{{0%,100%{{opacity:.25}}50%{{opacity:.7}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated komda candlestick fractal — WEALTH capital intelligence">
<defs>
 <linearGradient id="afgkBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="#12100a"/></linearGradient>
 <linearGradient id="afgkSw" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="{Y500}" stop-opacity="0"/><stop offset=".5" stop-color="{Y500}" stop-opacity=".14"/><stop offset="1" stop-color="{Y500}" stop-opacity="0"/>
 </linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgkBg)"/>
<g stroke="{DIM}" stroke-width=".6" opacity=".7">
 {"".join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in range(110, H, 86))}
</g>
<text x="60" y="72" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{Y300}">Ψ WEALTH · KOMDA FRACTAL</text>
<text x="60" y="94" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">self-similar price geometry · φ 1.618 · EMV-gated</text>
<g opacity=".28">{g1}</g>
<g opacity=".55">{g2}</g>
<g>{g3}</g>
<path class="afgk-arc" pathLength="1" d="{arc}" fill="none" stroke="{Y300}" stroke-width="1.8"/>
<rect class="afgk-sweep" x="0" y="60" width="240" height="{H - 120}" fill="url(#afgkSw)"/>
<g class="afgk-pulse" font-family="IBM Plex Mono,monospace" font-size="11" fill="{Y500}">
 <text x="1010" y="560">▲ {Y500} human-long</text>
 <text x="1010" y="580" fill="{B300}">▼ {B500} institution-short</text>
</g>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 3 · ROOT — SOVEREIGN LATTICE · / · Δ 333
# ════════════════════════════════════════════════════════════
def root_seal():
    cx, cy, R = 600, 315, 218
    dots, star = [], []
    pts = []
    for k in range(13):
        a = -math.pi / 2 + k * 2 * math.pi / 13
        pts.append((cx + R * math.cos(a), cy + R * math.sin(a)))
    for k, (px, py) in enumerate(pts):
        dots.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="5" fill="{Y500}"/>')
        dots.append(
            f'<circle cx="{px:.1f}" cy="{py:.1f}" r="10" fill="none" stroke="{Y700}" stroke-width="1"/>'
        )
    # {13/5} star polygon
    order = [(k * 5) % 13 for k in range(14)]
    d = "M" + " L".join(f"{pts[i][0]:.1f},{pts[i][1]:.1f}" for i in order) + " Z"
    star.append(
        f'<path d="{d}" fill="none" stroke="{Y500}" stroke-width="1.4" opacity=".85"/>'
    )
    ticks = "".join(
        f'<line x1="{cx + (R + 26) * math.cos(a):.1f}" y1="{cy + (R + 26) * math.sin(a):.1f}" '
        f'x2="{cx + (R + 38) * math.cos(a):.1f}" y2="{cy + (R + 38) * math.sin(a):.1f}" stroke="{Y700}" stroke-width="1.6"/>'
        for a in [k * 2 * math.pi / 52 for k in range(52)]
    )
    css = f"""
.afgr-ring{{animation:afgrSpin 70s linear infinite;transform-origin:600px 315px}}
.afgr-star{{animation:afgrSpinR 110s linear infinite;transform-origin:600px 315px}}
.afgr-hex{{animation:afgrSpin 46s linear infinite;transform-origin:600px 315px}}
@keyframes afgrSpin{{to{{transform:rotate(360deg)}}}}
@keyframes afgrSpinR{{to{{transform:rotate(-360deg)}}}}
.afgr-core{{animation:afgrPulse 3.4s ease-in-out infinite;transform-origin:600px 315px}}
@keyframes afgrPulse{{0%,100%{{transform:scale(1);opacity:.85}}50%{{transform:scale(1.16);opacity:1}}}}
.afgr-dots circle:nth-child(odd){{animation:afgrBlink 4s ease-in-out infinite}}
@keyframes afgrBlink{{0%,100%{{opacity:1}}50%{{opacity:.45}}}}
"""
    hexd = (
        "M"
        + " L".join(
            f"{cx + 118 * math.cos(-math.pi / 2 + k * math.pi / 3):.1f},{cy + 118 * math.sin(-math.pi / 2 + k * math.pi / 3):.1f}"
            for k in range(6)
        )
        + " Z"
    )
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rotating sovereign lattice — 13 constitutional floors">
<defs>
 <radialGradient id="afgrG" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#171207"/><stop offset="1" stop-color="{BG}"/></radialGradient>
 <radialGradient id="afgrCore" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{Y500}" stop-opacity=".9"/><stop offset="1" stop-color="{Y500}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgrG)"/>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{Y300}">Δ ROOT · SOVEREIGN LATTICE</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">13 floors · F13 veto · the human at /000</text>
<g class="afgr-ring"><circle cx="{cx}" cy="{cy}" r="{R + 32}" fill="none" stroke="{Y900}" stroke-width="1"/>{ticks}</g>
<g class="afgr-star">{"".join(star)}</g>
<g class="afgr-dots">{"".join(dots)}</g>
<g class="afgr-hex"><path d="{hexd}" fill="none" stroke="{Y700}" stroke-width="1.2" opacity=".8"/></g>
<circle class="afgr-core" cx="{cx}" cy="{cy}" r="46" fill="url(#afgrCore)"/>
<circle cx="{cx}" cy="{cy}" r="7" fill="{Y500}"/>
<text x="{cx}" y="{cy + 4}" font-family="IBM Plex Mono,monospace" font-size="9" fill="{BG}" text-anchor="middle" font-weight="600">F13</text>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 4 · /000 — MEMBRANE · PROOF OF HUMAN
# ════════════════════════════════════════════════════════════
def membrane():
    cx, cy = 600, 315
    rings = []
    for i in range(9):
        r = 52 + i * 30
        dash = f"{40 + i * 13} {18 + i * 7}"
        dur = 30 + i * 9
        direction = "reverse" if i % 2 else "normal"
        rings.append(
            f'<circle class="afgm-ring" cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{Y300 if i % 3 == 0 else Y700}" '
            f'stroke-width="{1.6 if i % 3 == 0 else 1}" stroke-dasharray="{dash}" opacity="{0.9 - i * 0.07:.2f}" '
            f'style="animation-duration:{dur}s;animation-direction:{direction}"/>'
        )
    css = f"""
.afgm-ring{{animation-name:afgmSpin;animation-timing-function:linear;animation-iteration-count:infinite;transform-origin:{cx}px {cy}px}}
@keyframes afgmSpin{{to{{transform:rotate(360deg)}}}}
.afgm-breathe{{animation:afgmB 4.6s ease-in-out infinite;transform-origin:{cx}px {cy}px}}
@keyframes afgmB{{0%,100%{{transform:scale(1)}}50%{{transform:scale(1.05)}}}}
.afgm-heart{{animation:afgmH 2.3s ease-in-out infinite;transform-origin:{cx}px {cy}px}}
@keyframes afgmH{{0%,100%{{transform:scale(1);opacity:.9}}12%{{transform:scale(1.28);opacity:1}}24%{{transform:scale(1.05)}}36%{{transform:scale(1.2);opacity:1}}}}
.afgm-cross{{animation:afgmX 6s ease-in-out infinite}}
@keyframes afgmX{{0%,100%{{opacity:.5}}50%{{opacity:1}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Breathing membrane — proof of human at /000">
<defs>
 <radialGradient id="afgmG" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#191307"/><stop offset="1" stop-color="{BG}"/></radialGradient>
 <radialGradient id="afgmWarm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{Y500}" stop-opacity=".55"/><stop offset="1" stop-color="{Y500}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgmG)"/>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{Y300}">/000 · MEMBRANE</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">proof of human · consciousness attested, never extracted</text>
<g class="afgm-breathe">{"".join(rings)}</g>
<circle cx="{cx}" cy="{cy}" r="86" fill="url(#afgmWarm)"/>
<g class="afgm-cross" stroke="{Y500}" stroke-width="1.4">
 <line x1="{cx - 30}" y1="{cy}" x2="{cx - 14}" y2="{cy}"/><line x1="{cx + 14}" y1="{cy}" x2="{cx + 30}" y2="{cy}"/>
 <line x1="{cx}" y1="{cy - 30}" x2="{cx}" y2="{cy - 14}"/><line x1="{cx}" y1="{cy + 14}" x2="{cx}" y2="{cy + 30}"/>
</g>
<circle class="afgm-heart" cx="{cx}" cy="{cy}" r="8" fill="{Y500}"/>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 5 · /999 — HASH CHAIN · SEALED VAULT
# ════════════════════════════════════════════════════════════
def chain():
    blocks = []
    bw, bh, y = 148, 96, 268
    xs = [70, 268, 466, 664, 862]
    for i, x in enumerate(xs):
        bars = "".join(
            f'<rect x="{x + 16 + j * 22}" y="{y + 52}" width="16" height="6" rx="1" fill="{B300}" opacity="{0.9 - j * 0.18:.2f}"/>'
            for j in range(5)
        )
        blocks.append(
            f'<g class="afgc-b" style="animation-delay:{i * 0.35:.2f}s">'
            f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="8" fill="{B900}" stroke="{B500}" stroke-width="1.4"/>'
            f'<text x="{x + 16}" y="{y + 30}" font-family="IBM Plex Mono,monospace" font-size="11" fill="{B100}" letter-spacing="1">SEQ {1000 + i}</text>'
            f"{bars}"
            f'<circle cx="{x + bw - 18}" cy="{y + 24}" r="4" fill="{Y500}" opacity=".9"/></g>'
        )
    links = "".join(
        f'<line x1="{x + bw + 4}" y1="{y + bh / 2}" x2="{x + 198 - 4}" y2="{y + bh / 2}" stroke="{B500}" stroke-width="2" stroke-dasharray="5 5" class="afgc-l"/>'
        for x in xs[:-1]
    )
    # travel path through link centers
    travel = f"M{xs[0] + bw / 2},{y + bh / 2} L{xs[-1] + bw / 2},{y + bh / 2}"
    css = f"""
.afgc-b{{animation:afgcIn .7s ease-out both}}
@keyframes afgcIn{{from{{opacity:0;transform:translateY(16px)}}to{{opacity:1;transform:none}}}}
.afgc-l{{animation:afgcDash 1.4s linear infinite}}
@keyframes afgcDash{{to{{stroke-dashoffset:-20}}}}
.afgc-ghost{{animation:afgcGhost 4.2s ease-in-out infinite}}
@keyframes afgcGhost{{0%,15%{{opacity:0}}55%,80%{{opacity:.75}}100%{{opacity:0}}}}
.afgc-glow{{animation:afgcGlow 3s ease-in-out infinite}}
@keyframes afgcGlow{{0%,100%{{opacity:.12}}50%{{opacity:.4}}}}
"""
    gx = 1060
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated hash chain — VAULT999 sealed ledger">
<defs>
 <linearGradient id="afgcBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="#080d1c"/></linearGradient>
 <radialGradient id="afgcGl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{B300}" stop-opacity=".5"/><stop offset="1" stop-color="{B300}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgcBg)"/>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{B300}">/999 · HASH CHAIN</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">append-only · merkle-anchored · irreversible</text>
<ellipse class="afgc-glow" cx="600" cy="316" rx="520" ry="130" fill="url(#afgcGl)"/>
{links}
{"".join(blocks)}
<g class="afgc-ghost">
 <rect x="{gx}" y="{y}" width="{bw - 34}" height="{bh}" rx="8" fill="none" stroke="{B300}" stroke-width="1.4" stroke-dasharray="7 6"/>
 <text x="{gx + 16}" y="{y + 30}" font-family="IBM Plex Mono,monospace" font-size="11" fill="{B300}" letter-spacing="1">SEALING…</text>
</g>
<circle r="6" fill="{Y500}">
 <animateMotion dur="5.5s" repeatCount="indefinite" path="{travel}" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/>
</circle>
<circle r="13" fill="none" stroke="{Y500}" stroke-width="1" opacity=".5">
 <animateMotion dur="5.5s" repeatCount="indefinite" path="{travel}"/>
</circle>
<text x="60" y="560" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">● <tspan fill="{Y500}">human pulse</tspan> verifies the institutional chain</text>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 6 · /world — MERIDIAN
# ════════════════════════════════════════════════════════════
def meridian():
    cx, cy, R = 600, 318, 205
    meridians = []
    for i in range(6):
        begin = f"{-i * 1.15:.2f}s"
        meridians.append(
            f'<ellipse cx="{cx}" cy="{cy}" ry="{R}" rx="{R}" fill="none" stroke="{B300}" stroke-width="1.1" opacity=".75">'
            f'<animate attributeName="rx" values="{R};14;{R}" dur="9.2s" begin="{begin}" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>'
            f'<animate attributeName="opacity" values=".75;.2;.75" dur="9.2s" begin="{begin}" repeatCount="indefinite"/>'
            f"</ellipse>"
        )
    lats = "".join(
        f'<ellipse cx="{cx}" cy="{cy + off}" rx="{rx}" ry="{rx * 0.24:.0f}" fill="none" stroke="{T500}" stroke-width="1" opacity=".5"/>'
        for off, rx in [(-120, 166), (-45, 200), (35, 202), (115, 168)]
    )
    css = f"""
.afgw-tilt{{animation:afgwT 14s ease-in-out infinite;transform-origin:{cx}px {cy}px}}
@keyframes afgwT{{0%,100%{{transform:rotate(-4deg)}}50%{{transform:rotate(4deg)}}}}
.afgw-term{{animation:afgwTerm 18s linear infinite;transform-origin:{cx}px {cy}px}}
@keyframes afgwTerm{{to{{transform:rotate(360deg)}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rotating meridian globe — world intelligence">
<defs>
 <radialGradient id="afgwG" cx=".38" cy=".36" r=".75"><stop offset="0" stop-color="#0d1830"/><stop offset="1" stop-color="{BG}"/></radialGradient>
 <radialGradient id="afgwSphere" cx=".36" cy=".32" r=".9"><stop offset="0" stop-color="{B500}" stop-opacity=".5"/><stop offset=".7" stop-color="{B900}" stop-opacity=".85"/><stop offset="1" stop-color="{BG}"/></radialGradient>
 <clipPath id="afgwClip"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgwG)"/>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{B300}">/world · MERIDIAN</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">one planet · one ledger of consequence</text>
<g class="afgw-tilt">
 <circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#afgwSphere)" stroke="{B300}" stroke-width="1.4"/>
 <g clip-path="url(#afgwClip)">{"".join(meridians)}{lats}</g>
 <g class="afgw-term" clip-path="url(#afgwClip)"><rect x="{cx}" y="{cy - R - 4}" width="{R + 8}" height="{2 * R + 8}" fill="{BG}" opacity=".42"/></g>
 <circle r="5" fill="{Y500}"><animateMotion dur="7s" repeatCount="indefinite" path="M{cx - R - 26},{cy} a{R + 26},{R + 26} 0 1,1 {2 * (R + 26)},0 a{R + 26},{R + 26} 0 1,1 -{2 * (R + 26)},0"/></circle>
</g>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 7 · /writing — INK FLOW
# ════════════════════════════════════════════════════════════
def ink():
    s1 = "M120,420 C260,300 340,500 470,380 S680,250 800,340 S1020,430 1100,300"
    s2 = "M150,250 C300,180 420,320 560,230 S820,150 1080,210"
    s3 = "M200,520 C380,470 520,560 700,500 S950,470 1060,510"
    css = f"""
.afgi-s{{fill:none;stroke-linecap:round;stroke-dasharray:1;pathLength:1;animation:afgiDraw 7s ease-in-out infinite}}
.afgi-s2{{animation-delay:1.2s}}.afgi-s3{{animation-delay:2.4s}}
@keyframes afgiDraw{{0%{{stroke-dashoffset:1;opacity:0}}8%{{opacity:1}}55%{{stroke-dashoffset:0;opacity:1}}82%{{stroke-dashoffset:0;opacity:1}}100%{{stroke-dashoffset:0;opacity:0}}}}
.afgi-nib{{animation:afgiNib 7s ease-in-out infinite}}
@keyframes afgiNib{{0%,55%{{opacity:1}}70%,100%{{opacity:0}}}}
.afgi-dot{{animation:afgiDot 7s ease-in-out infinite}}
@keyframes afgiDot{{0%,50%{{opacity:0}}62%{{opacity:.9}}100%{{opacity:0}}}}
.afgi-line{{animation:afgiRule 5s ease-in-out infinite}}
@keyframes afgiRule{{0%,100%{{opacity:.1}}50%{{opacity:.28}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flowing ink strokes — writing surface">
<defs>
 <linearGradient id="afgiBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="#100e14"/></linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgiBg)"/>
<g class="afgi-line" stroke="{MUT}" stroke-width=".6">
 {"".join(f'<line x1="90" y1="{y}" x2="1110" y2="{y}"/>' for y in range(190, 560, 66))}
 <line x1="140" y1="150" x2="140" y2="570" stroke="{R500}" stroke-width="1" opacity=".5"/>
</g>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{INK}">/writing · INK FLOW</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">essays · doctrine · the long form</text>
<path class="afgi-s" pathLength="1" d="{s1}" stroke="{INK}" stroke-width="3.2"/>
<path class="afgi-s afgi-s2" pathLength="1" d="{s2}" stroke="{Y300}" stroke-width="2.4"/>
<path class="afgi-s afgi-s3" pathLength="1" d="{s3}" stroke="{B300}" stroke-width="2"/>
<circle class="afgi-nib" r="6" fill="{Y500}"><animateMotion dur="7s" repeatCount="indefinite" path="{s1}"/></circle>
<g class="afgi-dot" fill="{INK}"><circle cx="470" cy="380" r="3.4"/><circle cx="800" cy="340" r="2.6"/><circle cx="1100" cy="300" r="3"/></g>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 8 · /doctrine — THIRTEEN FLOORS
# ════════════════════════════════════════════════════════════
def floors():
    floors_def = [
        ("F1", "AMANAH", "hard"),
        ("F2", "TRUTH", "hard"),
        ("F3", "TRI-WITNESS", "derived"),
        ("F4", "CLARITY", "hard"),
        ("F5", "PEACE²", "soft"),
        ("F6", "MARUAH", "soft"),
        ("F7", "HUMILITY", "hard"),
        ("F8", "GENIUS", "derived"),
        ("F9", "ANTIHANTU", "hard"),
        ("F10", "ONTOLOGY", "hard"),
        ("F11", "AUDIT", "hard"),
        ("F12", "RESILIENCE", "hard"),
        ("F13", "SOVEREIGN", "hard"),
    ]
    rows = []
    y0, rh, gap = 96, 30, 9
    for i, (fid, name, kind) in enumerate(floors_def):
        y = y0 + i * (rh + gap)
        w = 640 - i * 14
        x = 170 + i * 7
        fill = B500 if kind == "hard" else "none"
        stroke = B300 if kind == "hard" else B300
        dash = "" if kind != "derived" else ' stroke-dasharray="8 5"'
        txt = Y500 if i == 12 else B100
        rows.append(
            f'<g class="afgf-row" style="animation-delay:{i * 0.22:.2f}s">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{rh}" rx="4" fill="{fill}" stroke="{stroke}" stroke-width="1.2"{dash} opacity="{1 if kind == "hard" else 0.8}"/>'
            f'<text x="{x + 14}" y="{y + 20}" font-family="IBM Plex Mono,monospace" font-size="12" font-weight="600" fill="{txt}">{fid}</text>'
            f'<text x="{x + 58}" y="{y + 20}" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="2" fill="{txt if i == 12 else B100}" opacity=".9">{name}</text>'
            f"</g>"
        )
    css = f"""
.afgf-row{{animation:afgfIn .6s ease-out both}}
@keyframes afgfIn{{from{{opacity:0;transform:translateX(-26px)}}to{{opacity:1;transform:none}}}}
.afgf-beam{{animation:afgfBeam 6.5s ease-in-out infinite}}
@keyframes afgfBeam{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(452px)}}}}
.afgf-verdict{{animation:afgfV 3s ease-in-out infinite}}
@keyframes afgfV{{0%,100%{{opacity:.55}}50%{{opacity:1}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thirteen constitutional floors scanning">
<defs>
 <linearGradient id="afgfBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="#080d1c"/></linearGradient>
 <linearGradient id="afgfBeamG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="{B300}" stop-opacity="0"/><stop offset=".5" stop-color="{B300}" stop-opacity=".3"/><stop offset="1" stop-color="{B300}" stop-opacity="0"/>
 </linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgfBg)"/>
<text x="60" y="72" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{B300}">/doctrine · THIRTEEN FLOORS</text>
<g class="afgf-beam"><rect x="150" y="60" width="700" height="46" fill="url(#afgfBeamG)"/></g>
{"".join(rows)}
<g class="afgf-verdict" font-family="IBM Plex Mono,monospace">
 <rect x="900" y="270" width="176" height="52" rx="6" fill="none" stroke="{Y500}" stroke-width="1.4"/>
 <text x="988" y="302" font-size="15" letter-spacing="4" fill="{Y500}" text-anchor="middle" font-weight="600">SEAL</text>
</g>
<text x="900" y="352" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1.5" fill="{MUT}">HARD ▮ · SOFT ▯ · DERIVED ╌</text>
<text x="900" y="372" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1.5" fill="{MUT}">verdicts: SEAL · SABAR · HOLD · VOID</text>
</svg>'''
    return css, svg


# ════════════════════════════════════════════════════════════
# 9 · /well — HOMEOSTASIS
# ════════════════════════════════════════════════════════════
def well_pulse():
    # ECG trace with HRV irregularity
    pts, x = [], 0
    segs = [
        (60, 0),
        (14, -14),
        (10, 10),
        (12, -96),
        (12, 132),
        (12, -52),
        (14, 8),
        (30, 0),
        (16, -22),
        (22, 22),
        (34, 0),
    ]
    d = "M0,340"
    y = 340
    for dx, dy in segs * 5:
        x += dx
        y = 340 + dy if dy else 340
        d += f" L{x},{y}"
        if x > 1200:
            break
    css = f"""
.afgw2-ecg{{fill:none;stroke:{T500};stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round;
 stroke-dasharray:1;pathLength:1;animation:afgw2Draw 3.8s linear infinite}}
@keyframes afgw2Draw{{0%{{stroke-dashoffset:1}}100%{{stroke-dashoffset:-1}}}}
.afgw2-ring{{transform-origin:600px 315px;animation:afgw2Ring 3.8s ease-out infinite}}
.afgw2-ring2{{animation-delay:1.9s}}
@keyframes afgw2Ring{{0%{{transform:scale(.35);opacity:.7}}70%{{opacity:.15}}100%{{transform:scale(1.5);opacity:0}}}}
.afgw2-breathe{{transform-origin:600px 315px;animation:afgw2B 7.6s ease-in-out infinite}}
@keyframes afgw2B{{0%,100%{{transform:scale(1);opacity:.5}}50%{{transform:scale(1.07);opacity:.85}}}}
.afgw2-num{{animation:afgw2N 3.8s ease-in-out infinite}}
@keyframes afgw2N{{0%,100%{{opacity:.6}}50%{{opacity:1}}}}
"""
    svg = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Heartbeat and breathing rings — WELL vitality">
<defs>
 <radialGradient id="afgw2G" cx=".5" cy=".5" r=".65"><stop offset="0" stop-color="#071712"/><stop offset="1" stop-color="{BG}"/></radialGradient>
 <radialGradient id="afgw2Warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{T500}" stop-opacity=".3"/><stop offset="1" stop-color="{T500}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#afgw2G)"/>
<text x="60" y="80" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="{T300}">/well · HOMEOSTASIS</text>
<text x="60" y="102" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2" fill="{MUT}">vitality mirror · readiness · dignity intact</text>
<circle class="afgw2-breathe" cx="600" cy="315" r="180" fill="url(#afgw2Warm)"/>
<circle class="afgw2-ring" cx="600" cy="315" r="150" fill="none" stroke="{T300}" stroke-width="1.4"/>
<circle class="afgw2-ring afgw2-ring2" cx="600" cy="315" r="150" fill="none" stroke="{Y300}" stroke-width="1"/>
<path class="afgw2-ecg" pathLength="1" d="{d}"/>
<g class="afgw2-num" font-family="IBM Plex Mono,monospace">
 <text x="986" y="150" font-size="42" font-weight="600" fill="{T300}">62</text>
 <text x="986" y="172" font-size="10" letter-spacing="2" fill="{MUT}">BPM · HRV 94ms</text>
 <text x="986" y="200" font-size="10" letter-spacing="2" fill="{T500}">STATE: OPTIMAL</text>
</g>
</svg>'''
    return css, svg


# ── emit ──────────────────────────────────────────────────────
PAGES = [
    (
        "earth-wave",
        "EARTH — Seismic Swell",
        "/earth",
        "Φ GEOX · earth intelligence",
        T300,
        earth_wave,
    ),
    (
        "wealth-komda",
        "WEALTH — Komda Fractal",
        "/economics",
        "Ψ WEALTH · capital intelligence",
        Y300,
        wealth_komda,
    ),
    (
        "root-seal",
        "ROOT — Sovereign Lattice",
        "/",
        "Δ 333 · the human surface",
        Y300,
        root_seal,
    ),
    ("000-membrane", "000 — Membrane", "/000", "proof of human", Y300, membrane),
    ("999-chain", "999 — Hash Chain", "/999", "VAULT999 · sealed past", B300, chain),
    (
        "world-meridian",
        "WORLD — Meridian",
        "/world",
        "worldview · makcikgpt",
        B300,
        meridian,
    ),
    ("writing-ink", "WRITING — Ink Flow", "/writing", "essays · long form", INK, ink),
    (
        "doctrine-floors",
        "DOCTRINE — Thirteen Floors",
        "/doctrine",
        "F1–F13 constitutional canon",
        B300,
        floors,
    ),
    (
        "well-pulse",
        "WELL — Homeostasis",
        "/well",
        "Ω WELL · vitality mirror",
        T300,
        well_pulse,
    ),
]

for slug, title, domain, organ, cap, fn in PAGES:
    css, svg = fn()
    with open(f"{OUT}/{slug}.html", "w") as f:
        f.write(
            PAGE.format(
                title=html.escape(title),
                bg=BG,
                mut=MUT,
                cap=cap,
                css=css,
                svg=svg,
                domain=domain,
                organ=organ,
            )
        )
    print(f"  ✅ {slug}.html")

# ── showcase index ────────────────────────────────────────────
cells = []
for i, (slug, title, domain, organ, cap, fn) in enumerate(PAGES):
    css, svg = fn()
    # scope the svg into a card: wrap with unique clipping scale
    cells.append(f'''
<a class="cell" href="{slug}.html" style="animation-delay:{i * 0.09:.2f}s">
 <div class="frame">{svg}</div>
 <div class="meta"><span class="dom" style="color:{cap}">{domain}</span><span class="ttl">{title}</span><span class="org">{organ}</span></div>
</a>''')

index_css = f"""
body{{background:{BG};display:block;overflow:auto;font-family:'IBM Plex Mono',monospace}}
.wrap{{max-width:1460px;margin:0 auto;padding:2.4rem 2rem 4rem}}
.masthead{{display:flex;align-items:baseline;gap:1.6rem;flex-wrap:wrap;border-bottom:1px solid {DIM};padding-bottom:1.4rem;margin-bottom:2rem}}
.masthead h1{{font-family:'IBM Plex Serif',serif;font-size:2.2rem;color:{INK};font-weight:700;letter-spacing:.5px}}
.masthead h1 em{{color:{Y500};font-style:normal}}
.masthead .sub{{font-size:.72rem;letter-spacing:2.5px;color:{MUT};text-transform:uppercase}}
.masthead .count{{margin-left:auto;font-size:.72rem;letter-spacing:2px;color:{T300}}}
.strip{{display:flex;gap:.5rem;margin-bottom:2.2rem}}
.strip i{{height:4px;flex:1;display:block;opacity:.9}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}}
@media(max-width:1000px){{.grid{{grid-template-columns:repeat(2,1fr)}}}}
@media(max-width:640px){{.grid{{grid-template-columns:1fr}}}}
.cell{{display:block;text-decoration:none;border:1px solid {DIM};background:{PANEL};overflow:hidden;
 animation:cellIn .7s ease-out both;transition:border-color .25s,transform .25s}}
.cell:hover{{border-color:{Y700};transform:translateY(-4px)}}
@keyframes cellIn{{from{{opacity:0;transform:translateY(22px)}}to{{opacity:1;transform:none}}}}
.frame{{aspect-ratio:1200/630;overflow:hidden;position:relative}}
.frame svg{{width:100%;height:100%;display:block}}
.frame .afg-cap{{display:none}}
.meta{{display:flex;flex-direction:column;gap:.15rem;padding:.8rem 1rem;border-top:1px solid {DIM}}}
.meta .dom{{font-size:.72rem;letter-spacing:2px;font-weight:600}}
.meta .ttl{{font-size:.86rem;color:{INK}}}
.meta .org{{font-size:.64rem;letter-spacing:1.5px;color:{MUT};text-transform:uppercase}}
footer{{margin-top:2.6rem;font-size:.64rem;letter-spacing:2px;color:{MUT};text-transform:uppercase;display:flex;gap:2rem;flex-wrap:wrap}}
footer b{{color:{Y500}}}
"""
strip_cols = [T500, Y500, Y500, B500, B300, B300, INK, B300, T500]
strip = "".join(f'<i style="background:{c}"></i>' for c in strip_cols)

index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GEOMETRY — arif-fazil.com animated visual canon</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Serif:wght@700&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
{index_css}
{earth_wave()[0]}{wealth_komda()[0]}{root_seal()[0]}{membrane()[0]}{chain()[0]}{meridian()[0]}{ink()[0]}{floors()[0]}{well_pulse()[0]}
</style>
</head>
<body>
<div class="wrap">
 <div class="masthead">
  <h1>GEOMETRY<em>.</em></h1>
  <span class="sub">arif-fazil.com · animated visual canon · PRIMER-1</span>
  <span class="count">9 DOMAINS · PURE SVG+CSS · ZERO JS</span>
 </div>
 <div class="strip">{strip}</div>
 <div class="grid">{"".join(cells)}</div>
 <footer>
  <span><b>CANON</b> design-tokens PRIMER-1 · ratified F13 · 2026-08-01</span>
  <span><b>EMBED</b> copy any &lt;svg&gt; block + its scoped style</span>
  <span><b>MOTION</b> CSS keyframes + SMIL only — no scripts</span>
 </footer>
</div>
</body>
</html>
"""
with open(f"{OUT}/index.html", "w") as f:
    f.write(index_html)
print("  ✅ index.html (showcase)")
print(f"\nDONE → {OUT}/")
