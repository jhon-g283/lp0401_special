#!/usr/bin/env python3
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")

# HUD / HRD — Figma 8089:6184 (hud_transparent_uniform_fixed), frame 958×955 @ 1033,309; art 910×910 @ 28,22
HERO_HUD_BLOCK = """      <div class="hero-radar hero-hud-hrd" aria-hidden="true"
           style="position:absolute;left:1033px;top:309px;width:958px;height:955px;pointer-events:none;z-index:0;overflow:visible;">
        <img src="images/hero-hud-hrd.svg" alt=""
             style="position:absolute;left:28px;top:22px;width:910px;height:910px;display:block;max-width:none;pointer-events:none;">
      </div>"""


def main():
    inner = []

    inner.append(HERO_HUD_BLOCK)

    # Large blue squares (187×187)
    large_sq = [
        (-30, 300), (1, 588), (117, 481),
    ]
    for x, y in large_sq:
        inner.append(
            f'      <div class="hero-deco hero-deco--lg" aria-hidden="true" '
            f'style="pointer-events:none;position:absolute;left:{x}px;top:{y}px;'
            f'width:187px;height:187px;background:#2563eb;opacity:0.92;"></div>'
        )

    inner.append('      <div class="hero-deco" aria-hidden="true" style="pointer-events:none;">')

    # Cyan squares (Figma 7993:1775)
    deco = [
        (314, 423, 91, 91), (420, 261, 91, 91), (260, 699, 91, 91), (372, 749, 91, 91),
        (366, 537, 91, 91), (506, 435, 91, 91), (612, 273, 91, 91), (272, 507, 91, 91),
        (378, 345, 91, 91), (82, 481, 65, 65), (195, 364, 65, 65), (414, 370, 61, 62),
        (522, 211, 61, 62), (160, 362, 61, 62), (266, 200, 61, 62), (210, 597, 62, 61),
        (316, 435, 62, 61), (445, 510, 61, 62), (551, 348, 61, 62), (347, 568, 62, 61),
        (453, 406, 62, 61),
    ]
    for x, y, w, h in deco:
        inner.append(
            f'        <div style="position:absolute;'
            f'left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#aaeaff;opacity:.5;"></div>'
        )

    inner.append("      </div>")

    inner.append(
        """      <div class="hero-deco-bars" aria-hidden="true" style="pointer-events:none;">
        <div style="position:absolute;left:126px;top:622px;width:6px;height:475px;"><div></div></div>
        <div style="position:absolute;left:295px;top:669px;width:6px;height:475px;"><div></div></div>
        <div style="position:absolute;left:563px;top:580px;width:6px;height:475px;"><div></div></div>
        <div style="position:absolute;left:705px;top:660px;width:6px;height:475px;"><div></div></div>
        <div style="position:absolute;left:992px;top:105px;width:6px;height:203px;"><div></div></div>
        <div style="position:absolute;left:1203px;top:71px;width:6px;height:475px;"><div></div></div>
        <div style="position:absolute;left:1330px;top:467px;width:6px;height:475px;"><div></div></div>
      </div>"""
    )

    # Headline 7993:1797 + Union stamp (8089:2599)
    inner.append(
        """      <!-- Catch copy + stamp (7993:1797) -->
      <img src="images/hero-union-stamp.svg" alt="" aria-hidden="true"
           style="position:absolute;left:862px;top:105px;width:205px;height:132px;display:block;max-width:none;pointer-events:none;z-index:4;">
      <p style="position:absolute;left:282px;top:131px;z-index:5;font-size:50px;font-weight:700;color:#2c2c2e;line-height:80.5px;white-space:nowrap;pointer-events:none;">4/1すべてのAIサービスは</p>
      <p style="position:absolute;left:901px;top:127px;z-index:5;font-size:59px;font-weight:700;color:#fff;line-height:80.5px;white-space:nowrap;pointer-events:none;">過去</p>
      <p style="position:absolute;left:1061px;top:131px;z-index:5;font-size:49px;font-weight:700;color:#2c2c2e;line-height:80.5px;white-space:nowrap;pointer-events:none;">になる。</p>"""
    )

    inner.append(
        """      <!-- Wordmark Group 145 (8053:883) -->
      <img src="images/acb50060-f78b-4d9d-88d0-7676ff96ada5.svg"
           alt="Tenbin AI" aria-hidden="true"
           style="position:absolute;left:199px;top:329px;width:1033px;height:201px;display:block;max-width:none;pointer-events:none;z-index:3;">"""
    )

    inner.append(
        """      <!-- Glass UI chips (8089:2597) -->
      <div aria-hidden="true" style="pointer-events:none;z-index:2;">
        <div style="position:absolute;left:584px;top:617px;width:371px;height:68px;background:#fff;border:4px solid #fff;border-radius:8px;opacity:.4;"></div>
        <div style="position:absolute;left:917px;top:609px;width:22px;height:15px;background:#fff;border:4px solid #fff;opacity:.4;"></div>
        <div style="position:absolute;left:939px;top:601px;width:22px;height:15px;background:#fff;border:4px solid #fff;opacity:.4;"></div>
        <div style="position:absolute;left:952px;top:615px;width:22px;height:15px;background:#fff;border:4px solid #fff;opacity:.4;"></div>
        <div style="position:absolute;left:569px;top:670px;width:22px;height:15px;background:#fff;border:4px solid #fff;opacity:.4;"></div>
        <div style="position:absolute;left:584px;top:679px;width:22px;height:15px;background:#fff;border:4px solid #fff;opacity:.4;"></div>
      </div>
      <p style="position:absolute;left:611px;top:613px;z-index:3;font-size:30px;font-weight:700;color:#0b3d91;line-height:80.5px;white-space:nowrap;pointer-events:none;">天秤 AI NEXT PROJECT</p>"""
    )

    inner.append(
        """      <!-- English (7993:1805 / 7995:2404 / 7995:2406) -->
      <p style="position:absolute;left:915px;top:666px;z-index:4;font-size:18px;font-weight:700;color:#2563eb;line-height:33.3px;white-space:nowrap;-webkit-text-stroke:1px #fff;paint-order:stroke fill;pointer-events:none;">You don't need judgement</p>
      <p style="position:absolute;left:915px;top:700px;z-index:4;font-size:18px;font-weight:700;color:#2563eb;line-height:33.3px;white-space:nowrap;-webkit-text-stroke:1px #fff;paint-order:stroke fill;pointer-events:none;">Your job progress is more accellarte with emotion</p>
      <p style="position:absolute;left:915px;top:736px;z-index:4;font-size:18px;font-weight:700;color:#2563eb;line-height:33.3px;white-space:nowrap;-webkit-text-stroke:1px #fff;paint-order:stroke fill;pointer-events:none;">Your working with AI go to Infinity</p>"""
    )

    inner.append(
        """      <div aria-hidden="true"
           style="position:absolute;left:734px;top:699px;width:44px;height:59px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:4;">
        <div style="width:1px;height:36px;background:rgba(0,0,0,.2);margin-left:1px;"></div>
        <span style="font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#2563eb;">SCROLL</span>
      </div>"""
    )

    new_block = "\n".join(inner) + "\n"

    html = open(INDEX, encoding="utf-8").read()
    pat = r'(<div class="hero__canvas" id="heroCanvas">)\s*.*?\s*(</div><!-- /\.hero__canvas -->)'
    m = re.search(pat, html, re.DOTALL)
    if not m:
        raise SystemExit("hero canvas block not found")
    html = html[: m.start(1)] + m.group(1) + "\n" + new_block + "    " + m.group(2) + html[m.end(2) :]
    open(INDEX, "w", encoding="utf-8").write(html)
    print("Patched", INDEX)


if __name__ == "__main__":
    main()
