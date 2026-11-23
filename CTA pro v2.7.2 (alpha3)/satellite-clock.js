// ==========================================================================
// MODULE: satellite-clock.js
// DESCRIPTION: Ōtsuka Lōtec No. 5 Kai (5号 改) Wandering / Satellite Hour
//              Real-Time Horological SVG Module for CTA Pro (#drumFaceSettings)
// ENGINE: Pure SVG (viewBox 0 0 300 300), Zero-Build, file:// Compatible
// ==========================================================================
(function (global) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const ORBIT_R = 56;
  const DISC_NUMS = [
    [12, 3, 6, 9],
    [1, 4, 7, 10],
    [2, 5, 8, 11]
  ];

  let instanceSeq = 0;
  let activeInstance = null;

  function createSvgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      const keys = Object.keys(attrs);
      for (let i = 0; i < keys.length; i++) {
        node.setAttribute(keys[i], String(attrs[keys[i]]));
      }
    }
    return node;
  }

  function snapEase(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function createGearPath(cx, cy, teeth, rOuter, rInner) {
    const parts = [];
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a0 = i * step;
      const a1 = a0 + step * 0.22;
      const a2 = a0 + step * 0.48;
      const a3 = a0 + step * 0.70;
      const pts = [
        [cx + rInner * Math.cos(a0), cy + rInner * Math.sin(a0)],
        [cx + rOuter * Math.cos(a1), cy + rOuter * Math.sin(a1)],
        [cx + rOuter * Math.cos(a2), cy + rOuter * Math.sin(a2)],
        [cx + rInner * Math.cos(a3), cy + rInner * Math.sin(a3)]
      ];
      for (let j = 0; j < pts.length; j++) {
        parts.push((i === 0 && j === 0 ? "M" : "L") + pts[j][0].toFixed(2) + "," + pts[j][1].toFixed(2));
      }
    }
    parts.push("Z");
    return parts.join(" ");
  }

  function buildClockSvg(uid) {
    const svg = createSvgEl("svg", {
      viewBox: "0 0 300 300",
      class: "satellite-clock-svg",
      role: "img",
      "aria-hidden": "true"
    });

    const defs = createSvgEl("defs");

    // 316L brushed steel case gradient
    const gSteelCase = createSvgEl("linearGradient", {
      id: uid + "-steelCase",
      x1: "8%", y1: "4%", x2: "92%", y2: "96%"
    });
    [
      ["0%", "#EFF2F5"],
      ["28%", "#C4C9D0"],
      ["52%", "#E1E5EA"],
      ["76%", "#A6ADB6"],
      ["100%", "#7E858E"]
    ].forEach(([offset, color]) => {
      gSteelCase.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gSteelCase);

    // 316L straight brushing hairline pattern
    const pBrushed = createSvgEl("pattern", {
      id: uid + "-brushed316L",
      width: "16",
      height: "3",
      patternUnits: "userSpaceOnUse"
    });
    pBrushed.appendChild(createSvgEl("line", {
      x1: "0", y1: "0.6", x2: "16", y2: "0.6",
      stroke: "rgba(255,255,255,0.22)", "stroke-width": "0.55"
    }));
    pBrushed.appendChild(createSvgEl("line", {
      x1: "0", y1: "1.9", x2: "16", y2: "1.9",
      stroke: "rgba(38,42,48,0.14)", "stroke-width": "0.45"
    }));
    defs.appendChild(pBrushed);

    // CNC milled steel carousel bridge gradient
    const gSteelBridge = createSvgEl("linearGradient", {
      id: uid + "-steelBridge",
      x1: "0%", y1: "0%", x2: "100%", y2: "100%"
    });
    [
      ["0%", "#F5F7FA"],
      ["42%", "#CFD5DC"],
      ["74%", "#B3BAC3"],
      ["100%", "#8B939D"]
    ].forEach(([offset, color]) => {
      gSteelBridge.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gSteelBridge);

    // Openwork gunmetal mainplate base
    const gDialBase = createSvgEl("radialGradient", {
      id: uid + "-dialBase",
      cx: "42%", cy: "38%", r: "65%"
    });
    [
      ["0%", "#444950"],
      ["62%", "#272A30"],
      ["100%", "#16181C"]
    ].forEach(([offset, color]) => {
      gDialBase.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gDialBase);

    // Satin silver disc & minute plate gradient
    const gSatDisc = createSvgEl("radialGradient", {
      id: uid + "-satDisc",
      cx: "34%", cy: "28%", r: "74%"
    });
    [
      ["0%", "#F8F9FB"],
      ["60%", "#D9DEE4"],
      ["100%", "#ADB4BE"]
    ].forEach(([offset, color]) => {
      gSatDisc.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gSatDisc);

    // Brass balance wheel & center bushing gradient
    const gBrass = createSvgEl("linearGradient", {
      id: uid + "-brass",
      x1: "0%", y1: "0%", x2: "100%", y2: "100%"
    });
    [
      ["0%", "#F5D687"],
      ["50%", "#CB993F"],
      ["100%", "#835C1C"]
    ].forEach(([offset, color]) => {
      gBrass.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gBrass);

    // 4.6mm Box sapphire crystal diagonal reflection
    const gGlass = createSvgEl("linearGradient", {
      id: uid + "-glassShine",
      x1: "4%", y1: "6%", x2: "94%", y2: "94%"
    });
    [
      ["0%", "rgba(255,255,255,0.30)"],
      ["22%", "rgba(255,255,255,0.12)"],
      ["34%", "rgba(255,255,255,0.02)"],
      ["49%", "rgba(255,255,255,0.10)"],
      ["56%", "rgba(255,255,255,0)"],
      ["85%", "rgba(0,0,0,0.03)"],
      ["100%", "rgba(0,0,0,0.15)"]
    ].forEach(([offset, color]) => {
      gGlass.appendChild(createSvgEl("stop", { offset, "stop-color": color }));
    });
    defs.appendChild(gGlass);

    // Mechanical elevation shadow
    const fMechShadow = createSvgEl("filter", {
      id: uid + "-mechShadow",
      x: "-22%", y: "-22%", width: "144%", height: "144%"
    });
    fMechShadow.appendChild(createSvgEl("feDropShadow", {
      dx: "1.4", dy: "2.4", stdDeviation: "2.4",
      "flood-color": "#000000", "flood-opacity": "0.52"
    }));
    defs.appendChild(fMechShadow);

    // Dial interior clipPath
    const clipDial = createSvgEl("clipPath", { id: uid + "-dialClip" });
    clipDial.appendChild(createSvgEl("circle", { cx: "150", cy: "150", r: "124" }));
    defs.appendChild(clipDial);

    // Top-left arch engraving path for "CASPER™ · CTA" (baseline r≈110.5 -> glyphs centered in 105..123 plaque)
    const pArchTop = createSvgEl("path", {
      id: uid + "-archTopPath",
      d: "M 52,100 A 110.5,110.5 0 0,1 169,41"
    });
    defs.appendChild(pArchTop);

    // Bottom-left engraving path for "NO.5 PRO" (baseline r≈117, glyphs extend inward clear of rim & subdial)
    const pArchBot = createSvgEl("path", {
      id: uid + "-archBotPath",
      d: "M 62,227 A 117,117 0 0,0 130,265"
    });
    defs.appendChild(pArchBot);

    svg.appendChild(defs);

    // =========================================================================
    // LAYER (1): 316L Straight-Brushed Steel Case Bezel & 4 o'clock (+30°) Crown
    // =========================================================================
    const crownG = createSvgEl("g", { transform: "rotate(30 150 150)" });
    crownG.appendChild(createSvgEl("rect", {
      x: "276", y: "142", width: "8", height: "16", rx: "1.5",
      fill: "#7A818A", stroke: "#484E56", "stroke-width": "0.9"
    }));
    crownG.appendChild(createSvgEl("rect", {
      x: "282", y: "136.5", width: "13.5", height: "27", rx: "3.2",
      fill: "url(#" + uid + "-steelCase)", stroke: "#4F555E", "stroke-width": "1.2"
    }));
    for (let cy = 140; cy <= 160; cy += 4) {
      crownG.appendChild(createSvgEl("line", {
        x1: "283.5", y1: cy, x2: "294", y2: cy,
        stroke: "#5A6069", "stroke-width": "1.05", "stroke-linecap": "round"
      }));
    }
    crownG.appendChild(createSvgEl("line", {
      x1: "286", y1: "137.5", x2: "286", y2: "162.5",
      stroke: "rgba(255,255,255,0.45)", "stroke-width": "0.9"
    }));
    svg.appendChild(crownG);

    // Outer 316L brushed bezel rings
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "138.5",
      fill: "url(#" + uid + "-steelCase)", stroke: "#5B616A", "stroke-width": "1.6"
    }));
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "138",
      fill: "url(#" + uid + "-brushed316L)", opacity: "0.75"
    }));
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "130.5",
      fill: "none", stroke: "rgba(255,255,255,0.48)", "stroke-width": "0.9"
    }));
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "127.5",
      fill: "#4E545C", stroke: "#33373D", "stroke-width": "1"
    }));
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "124",
      fill: "url(#" + uid + "-dialBase)"
    }));

    // Clipped interior dial assembly
    const dialInner = createSvgEl("g", { "clip-path": "url(#" + uid + "-dialClip)" });

    // =========================================================================
    // LAYER (2): Openwork Gunmetal Base + 1–2 o'clock Brass Balance Wheel & 9 o'clock Gear Train
    // =========================================================================
    const mainplateG = createSvgEl("g", { class: "satclk-mainplate" });
    // Recessed skeleton apertures & industrial concentric milling rings
    mainplateG.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "106",
      fill: "none", stroke: "rgba(255,255,255,0.06)", "stroke-width": "1"
    }));
    mainplateG.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "74",
      fill: "#1E2126", stroke: "#484D56", "stroke-width": "1.1"
    }));
    mainplateG.appendChild(createSvgEl("circle", {
      cx: "178", cy: "92", r: "29",
      fill: "#121417", stroke: "#4A4F58", "stroke-width": "1.2"
    }));

    // 9 o'clock Gear Train (primary reduction wheel + secondary meshing gear)
    const gearPrimaryG = createSvgEl("g", { transform: "translate(90, 146)" });
    const gearPrimaryRotor = createSvgEl("g", { class: "satclk-gear-primary" });
    gearPrimaryRotor.appendChild(createSvgEl("path", {
      d: createGearPath(0, 0, 20, 27, 23.2),
      fill: "#5B616B", stroke: "#8F96A0", "stroke-width": "0.9"
    }));
    gearPrimaryRotor.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "18.5",
      fill: "#26292E", stroke: "#7B828C", "stroke-width": "1"
    }));
    for (let s = 0; s < 5; s++) {
      gearPrimaryRotor.appendChild(createSvgEl("line", {
        x1: "0", y1: "-18", x2: "0", y2: "0",
        stroke: "#8F96A0", "stroke-width": "2.2",
        transform: "rotate(" + (s * 72) + ")"
      }));
    }
    gearPrimaryRotor.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "6.2",
      fill: "url(#" + uid + "-brass)", stroke: "#694B17", "stroke-width": "0.8"
    }));
    gearPrimaryRotor.appendChild(createSvgEl("circle", { cx: "0", cy: "0", r: "2.2", fill: "#1F2227" }));
    gearPrimaryG.appendChild(gearPrimaryRotor);
    mainplateG.appendChild(gearPrimaryG);

    const gearSecondaryG = createSvgEl("g", { transform: "translate(115, 110)" });
    const gearSecondaryRotor = createSvgEl("g", { class: "satclk-gear-secondary" });
    gearSecondaryRotor.appendChild(createSvgEl("path", {
      d: createGearPath(0, 0, 14, 17, 14.2),
      fill: "#4B5059", stroke: "#858C96", "stroke-width": "0.85"
    }));
    gearSecondaryRotor.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "9.5",
      fill: "#202328", stroke: "#7A818B", "stroke-width": "0.9"
    }));
    gearSecondaryRotor.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "3.4",
      fill: "#B9C0C8", stroke: "#51565F", "stroke-width": "0.7"
    }));
    gearSecondaryG.appendChild(gearSecondaryRotor);
    mainplateG.appendChild(gearSecondaryG);

    // 1–2 o'clock Brass Balance Wheel (4Hz micro oscillating swing)
    const balanceWheelG = createSvgEl("g", { transform: "translate(178, 92)" });
    // Hairspring coil hint
    balanceWheelG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "13",
      fill: "none", stroke: "#8CA6C8", "stroke-width": "0.8", "stroke-dasharray": "4 1.5", opacity: "0.7"
    }));
    balanceWheelG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "9",
      fill: "none", stroke: "#8CA6C8", "stroke-width": "0.7", opacity: "0.65"
    }));
    balanceWheelG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "23.5",
      fill: "none", stroke: "url(#" + uid + "-brass)", "stroke-width": "4.2"
    }));
    balanceWheelG.appendChild(createSvgEl("line", {
      x1: "-21.5", y1: "0", x2: "21.5", y2: "0",
      stroke: "url(#" + uid + "-brass)", "stroke-width": "2.1"
    }));
    balanceWheelG.appendChild(createSvgEl("line", {
      x1: "0", y1: "-21.5", x2: "0", y2: "21.5",
      stroke: "url(#" + uid + "-brass)", "stroke-width": "2.1"
    }));
    balanceWheelG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "5.2",
      fill: "#D93E36", stroke: "#F3D384", "stroke-width": "1.3"
    }));
    balanceWheelG.appendChild(createSvgEl("circle", {
      cx: "-1.2", cy: "-1.2", r: "1.4",
      fill: "rgba(255,255,255,0.55)"
    }));
    mainplateG.appendChild(balanceWheelG);
    dialInner.appendChild(mainplateG);

    // =========================================================================
    // LAYER (3): 5:30 Independent Rotating Small Seconds Disc (1.5mm Bearing)
    // =========================================================================
    const secOuterG = createSvgEl("g", { transform: "translate(178, 223)" });
    secOuterG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "43.5",
      fill: "#1B1E23", stroke: "#7C838C", "stroke-width": "1.25"
    }));
    const secondsDiscG = createSvgEl("g", { class: "satclk-seconds-disc" });
    secondsDiscG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "41",
      fill: "url(#" + uid + "-satDisc)", stroke: "#8A919B", "stroke-width": "0.95"
    }));
    secondsDiscG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "32.5",
      fill: "none", stroke: "rgba(40,45,52,0.14)", "stroke-width": "0.7"
    }));
    for (let s = 0; s < 60; s++) {
      const deg = s * 6 - 90;
      const rad = (deg * Math.PI) / 180;
      const major = s % 5 === 0;
      const r1 = major ? 34 : 36.2;
      const r2 = 39.8;
      secondsDiscG.appendChild(createSvgEl("line", {
        x1: (r1 * Math.cos(rad)).toFixed(2),
        y1: (r1 * Math.sin(rad)).toFixed(2),
        x2: (r2 * Math.cos(rad)).toFixed(2),
        y2: (r2 * Math.sin(rad)).toFixed(2),
        stroke: s === 0 ? "#C0362C" : "#22252A",
        "stroke-width": major ? "1.5" : "0.7",
        "stroke-linecap": "round"
      }));
      if (s % 10 === 0) {
        const rt = 26;
        const tx = rt * Math.cos(rad);
        const ty = rt * Math.sin(rad);
        const txt = createSvgEl("text", {
          x: tx.toFixed(1),
          y: ty.toFixed(1),
          "text-anchor": "middle",
          "dominant-baseline": "central",
          "font-family": "Pretendard, -apple-system, sans-serif",
          "font-size": "7.4",
          "font-weight": "900",
          fill: s === 0 ? "#C0362C" : "#1C1F24",
          transform: "rotate(" + (s * 6) + " " + tx.toFixed(1) + " " + ty.toFixed(1) + ")"
        });
        txt.textContent = String(s).padStart(2, "0");
        secondsDiscG.appendChild(txt);
      }
    }
    secOuterG.appendChild(secondsDiscG);

    // Central 1.5mm MinebeaMitsumi micro ball bearing + fixed 12 o'clock red triangle pointer
    secOuterG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "13",
      fill: "url(#" + uid + "-steelBridge)", stroke: "#545A63", "stroke-width": "1"
    }));
    secOuterG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "7.6",
      fill: "#262930", stroke: "#AEB5BE", "stroke-width": "0.9"
    }));
    for (let b = 0; b < 7; b++) {
      const ba = (b * Math.PI * 2) / 7;
      secOuterG.appendChild(createSvgEl("circle", {
        cx: (5.2 * Math.cos(ba)).toFixed(2),
        cy: (5.2 * Math.sin(ba)).toFixed(2),
        r: "1.35",
        fill: "#E8ECF1", stroke: "#4D535B", "stroke-width": "0.35"
      }));
    }
    secOuterG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "2.9",
      fill: "#DCE1E7", stroke: "#50565F", "stroke-width": "0.7"
    }));
    secOuterG.appendChild(createSvgEl("polygon", {
      points: "0,-39.5 -4.4,-30.5 4.4,-30.5",
      fill: "#D93829", stroke: "#7C1C14", "stroke-width": "0.55"
    }));
    dialInner.appendChild(secOuterG);

    // =========================================================================
    // LAYER (4): 8 o'clock (+150°) Custom Roller Ball-Bearing Guide Pin
    // =========================================================================
    const rollerOuterG = createSvgEl("g", {
      transform: "translate(75.5, 193)",
      filter: "url(#" + uid + "-mechShadow)"
    });
    const rollerRotorG = createSvgEl("g", { class: "satclk-roller-bearing" });
    rollerRotorG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "13.2",
      fill: "url(#" + uid + "-steelCase)", stroke: "#484E56", "stroke-width": "1.35"
    }));
    rollerRotorG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "8.8",
      fill: "#25282E", stroke: "#BFC6CE", "stroke-width": "0.9"
    }));
    for (let rb = 0; rb < 8; rb++) {
      const rba = (rb * Math.PI * 2) / 8;
      rollerRotorG.appendChild(createSvgEl("circle", {
        cx: (6.3 * Math.cos(rba)).toFixed(2),
        cy: (6.3 * Math.sin(rba)).toFixed(2),
        r: "1.55",
        fill: "#EEF1F5", stroke: "#4E545C", "stroke-width": "0.4"
      }));
    }
    rollerRotorG.appendChild(createSvgEl("circle", {
      cx: "0", cy: "0", r: "3.9",
      fill: "#E5E9EE", stroke: "#525861", "stroke-width": "0.8"
    }));
    rollerRotorG.appendChild(createSvgEl("line", {
      x1: "-2.3", y1: "-1.1", x2: "2.3", y2: "1.1",
      stroke: "#4E545C", "stroke-width": "0.85"
    }));
    rollerOuterG.appendChild(rollerRotorG);
    dialInner.appendChild(rollerOuterG);

    // =========================================================================
    // LAYER (5) & (6): 3 Satellite Hour Discs + Central Y-Shaped 3-Arm CNC Bridge
    // =========================================================================
    const satAssemblyG = createSvgEl("g", { filter: "url(#" + uid + "-mechShadow)" });
    const satGroups = [];

    for (let k = 0; k < 3; k++) {
      const outer = createSvgEl("g", { "data-sat-disc": String(k) });
      const inner = createSvgEl("g");

      inner.appendChild(createSvgEl("circle", {
        cx: "0", cy: "0", r: "30.2",
        fill: "url(#" + uid + "-satDisc)", stroke: "#5B616A", "stroke-width": "1.35"
      }));
      inner.appendChild(createSvgEl("circle", {
        cx: "0", cy: "0", r: "22.2",
        fill: "none", stroke: "rgba(36,41,48,0.16)", "stroke-width": "0.75"
      }));

      for (let j = 0; j < 4; j++) {
        const num = DISC_NUMS[k][j];
        const deg = j * 90;
        const rad = (deg * Math.PI) / 180;
        const rTxt = 18.4;
        const tx = rTxt * Math.cos(rad);
        const ty = rTxt * Math.sin(rad);

        // Outer red pointer tip at each hour numeral
        inner.appendChild(createSvgEl("polygon", {
          points: "25.4,-2.6 31.6,0 25.4,2.6",
          fill: "#C0362C",
          transform: "rotate(" + deg + ")"
        }));

        const numTxt = createSvgEl("text", {
          x: tx.toFixed(1),
          y: ty.toFixed(1),
          "text-anchor": "middle",
          "dominant-baseline": "central",
          "font-family": "Pretendard, -apple-system, sans-serif",
          "font-size": "12.8",
          "font-weight": "900",
          fill: "#181A1E",
          transform: "rotate(" + deg + " " + tx.toFixed(1) + " " + ty.toFixed(1) + ")"
        });
        numTxt.textContent = String(num);
        inner.appendChild(numTxt);
      }

      outer.appendChild(inner);
      satAssemblyG.appendChild(outer);
      satGroups.push({ outer, inner });
    }

    // LAYER (6): Central Y-shaped 3-Arm CNC Milled Steel Carousel Bridge
    // (3 milled slots + 6 slotted screw heads + central brass bushing + drop shadow)
    const bridgeG = createSvgEl("g", { class: "satclk-carousel-bridge" });
    for (let arm = 0; arm < 3; arm++) {
      const armG = createSvgEl("g", { transform: "rotate(" + (arm * 120) + " 150 150)" });
      // Tapered CNC milled arm body
      armG.appendChild(createSvgEl("path", {
        d: "M138.8,150 L141.2,92 C141.2,85 158.8,85 158.8,92 L161.2,150 Z",
        fill: "url(#" + uid + "-steelBridge)",
        stroke: "#565C65",
        "stroke-width": "1.2"
      }));
      // Recessed CNC longitudinal milled slot groove
      armG.appendChild(createSvgEl("rect", {
        x: "147.2", y: "103.5", width: "5.6", height: "24.5", rx: "2.8",
        fill: "#6F7680", stroke: "#484E56", "stroke-width": "0.65", opacity: "0.78"
      }));
      // Outer slotted screw head (satellite pivot cap — screws #1, #2, #3)
      armG.appendChild(createSvgEl("circle", {
        cx: "150", cy: "94", r: "4.8",
        fill: "#E2E6EB", stroke: "#4F555E", "stroke-width": "0.95"
      }));
      armG.appendChild(createSvgEl("line", {
        x1: "146.5", y1: "93.2", x2: "153.5", y2: "94.8",
        stroke: "#484E56", "stroke-width": "1.05"
      }));
      // Inner slotted screw head (hub root — screws #4, #5, #6)
      armG.appendChild(createSvgEl("circle", {
        cx: "150", cy: "134.5", r: "3.1",
        fill: "#DCE1E7", stroke: "#4F555E", "stroke-width": "0.85"
      }));
      armG.appendChild(createSvgEl("line", {
        x1: "147.8", y1: "135.4", x2: "152.2", y2: "133.6",
        stroke: "#484E56", "stroke-width": "0.9"
      }));
      bridgeG.appendChild(armG);
    }
    // Central carousel hub & brass bushing
    bridgeG.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "14.8",
      fill: "url(#" + uid + "-steelBridge)", stroke: "#525861", "stroke-width": "1.2"
    }));
    bridgeG.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "7.6",
      fill: "url(#" + uid + "-brass)", stroke: "#6B4C16", "stroke-width": "1"
    }));
    bridgeG.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "2.9",
      fill: "#22252A"
    }));
    satAssemblyG.appendChild(bridgeG);
    dialInner.appendChild(satAssemblyG);

    // =========================================================================
    // LAYER (7): Right Fixed 120° Minute Scale Plate (-60°=00m ~ +60°=60m)
    //            + Top-Left ("CASPER™ · CTA") & Bottom-Left ("NO.5 PRO") Engravings
    // =========================================================================
    const minutePlateG = createSvgEl("g", { class: "satclk-minute-plate" });
    minutePlateG.appendChild(createSvgEl("path", {
      d: "M 193,75.5 A 86,86 0 0,1 193,224.5 L 212,257.4 A 124,124 0 0,0 212,42.6 Z",
      fill: "url(#" + uid + "-satDisc)",
      stroke: "#575D66",
      "stroke-width": "1.35"
    }));
    minutePlateG.appendChild(createSvgEl("path", {
      d: "M 193,75.5 A 86,86 0 0,1 193,224.5 L 212,257.4 A 124,124 0 0,0 212,42.6 Z",
      fill: "url(#" + uid + "-brushed316L)",
      opacity: "0.35"
    }));

    for (let m = 0; m <= 60; m++) {
      const deg = -60 + m * 2;
      const rad = (deg * Math.PI) / 180;
      const isMajor = m % 5 === 0;
      const isQuarter = m % 15 === 0;
      const rIn = isMajor ? 88.8 : 92.2;
      const rOut = isMajor ? 99.2 : 97.2;

      minutePlateG.appendChild(createSvgEl("line", {
        x1: (150 + rIn * Math.cos(rad)).toFixed(2),
        y1: (150 + rIn * Math.sin(rad)).toFixed(2),
        x2: (150 + rOut * Math.cos(rad)).toFixed(2),
        y2: (150 + rOut * Math.sin(rad)).toFixed(2),
        stroke: isQuarter ? "#C0362C" : "#1C1F24",
        "stroke-width": isMajor ? "1.8" : "0.85",
        "stroke-linecap": "round"
      }));

      if (isMajor) {
        const rTxt = 111.2;
        const tx = 150 + rTxt * Math.cos(rad);
        const ty = 150 + rTxt * Math.sin(rad);
        const mTxt = createSvgEl("text", {
          x: tx.toFixed(1),
          y: ty.toFixed(1),
          "text-anchor": "middle",
          "dominant-baseline": "central",
          "font-family": "Pretendard, -apple-system, sans-serif",
          "font-size": isQuarter ? "10.4" : "8.9",
          "font-weight": "900",
          fill: isQuarter ? "#B82F25" : "#21242A",
          transform: "rotate(" + deg + " " + tx.toFixed(1) + " " + ty.toFixed(1) + ")"
        });
        mTxt.textContent = String(m).padStart(2, "0");
        minutePlateG.appendChild(mTxt);
      }
    }
    dialInner.appendChild(minutePlateG);

    // Top-left arch plate with industrial engraving: "CASPER™ · CTA"
    const archPlaqueG = createSvgEl("g", { class: "satclk-engravings" });
    archPlaqueG.appendChild(createSvgEl("path", {
      d: "M 56,101 A 105,105 0 0,1 171,47 L 175,30 A 123,123 0 0,0 41,91 Z",
      fill: "url(#" + uid + "-satDisc)",
      stroke: "#626972",
      "stroke-width": "1.05",
      opacity: "0.96"
    }));
    // 2 tiny industrial plaque rivets
    archPlaqueG.appendChild(createSvgEl("circle", { cx: "53", cy: "90", r: "2.1", fill: "#8C939C", stroke: "#494F57", "stroke-width": "0.6" }));
    archPlaqueG.appendChild(createSvgEl("circle", { cx: "167", cy: "39", r: "2.1", fill: "#8C939C", stroke: "#494F57", "stroke-width": "0.6" }));

    const topEngraving = createSvgEl("text", {
      "font-family": "Pretendard, -apple-system, sans-serif",
      "font-size": "8.4",
      "font-weight": "900",
      fill: "#202328",
      "letter-spacing": "1.15"
    });
    const topEngravingPath = createSvgEl("textPath", {
      href: "#" + uid + "-archTopPath",
      startOffset: "50%",
      "text-anchor": "middle"
    });
    topEngravingPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + uid + "-archTopPath");
    topEngravingPath.textContent = "CASPER™ · CTA";
    topEngraving.appendChild(topEngravingPath);
    archPlaqueG.appendChild(topEngraving);

    // Bottom-left industrial engraving: "NO.5 PRO"
    const botEngraving = createSvgEl("text", {
      "font-family": "Pretendard, -apple-system, sans-serif",
      "font-size": "8.2",
      "font-weight": "800",
      fill: "#D2D7DF",
      "letter-spacing": "1.2"
    });
    const botEngravingPath = createSvgEl("textPath", {
      href: "#" + uid + "-archBotPath",
      startOffset: "48%",
      "text-anchor": "middle"
    });
    botEngravingPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + uid + "-archBotPath");
    botEngravingPath.textContent = "NO.5 PRO";
    botEngraving.appendChild(botEngravingPath);
    archPlaqueG.appendChild(botEngraving);
    dialInner.appendChild(archPlaqueG);

    // =========================================================================
    // LAYER (8): 4.6mm Box Sapphire Crystal Diagonal Glass Reflection Overlay
    // =========================================================================
    dialInner.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "124",
      fill: "url(#" + uid + "-glassShine)",
      "pointer-events": "none"
    }));
    dialInner.appendChild(createSvgEl("path", {
      d: "M 54,78 Q 112,38 182,42 Q 124,62 68,108 Z",
      fill: "rgba(255,255,255,0.11)",
      "pointer-events": "none"
    }));
    svg.appendChild(dialInner);

    // Box sapphire crystal edge refraction highlight
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "124",
      fill: "none", stroke: "rgba(255,255,255,0.34)", "stroke-width": "1.45",
      "pointer-events": "none"
    }));
    svg.appendChild(createSvgEl("circle", {
      cx: "150", cy: "150", r: "121.6",
      fill: "none", stroke: "rgba(255,255,255,0.10)", "stroke-width": "0.85",
      "pointer-events": "none"
    }));

    return {
      svg,
      satGroups,
      bridgeG,
      secondsDiscG,
      balanceWheelG,
      rollerRotorG,
      gearPrimaryRotor,
      gearSecondaryRotor
    };
  }

  function mount(containerEl, options) {
    if (!containerEl) return null;
    const opts = options || {};
    const uid = "satclk" + (++instanceSeq);
    const faceEl = typeof opts.faceEl === "string"
      ? document.querySelector(opts.faceEl)
      : (opts.faceEl || document.getElementById("drumFaceSettings"));
    const onTick = typeof opts.onTick === "function" ? opts.onTick : null;
    const onModeChange = typeof opts.onModeChange === "function" ? opts.onModeChange : null;

    containerEl.textContent = "";
    const parts = buildClockSvg(uid);
    containerEl.appendChild(parts.svg);

    let fastMode = false;
    let simEpochMs = Date.now();
    let lastFrameMs = performance.now();
    let rafId = null;
    let reducedTimerId = null;
    let destroyed = false;
    let frameCount = 0;
    let manualActiveOverride = null;
    let lastState = null;

    const reducedMotionMQ = global.matchMedia
      ? global.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    function isReducedMotion() {
      return !!(reducedMotionMQ && reducedMotionMQ.matches);
    }

    function isFaceVisible() {
      if (manualActiveOverride !== null) return manualActiveOverride;
      if (!faceEl) return true;
      return faceEl.classList.contains("is-active");
    }

    function shouldAnimate() {
      return !destroyed && !document.hidden && isFaceVisible();
    }

    function renderFrame(nowPerf, advanceSim) {
      const dt = Math.min(100, Math.max(0, nowPerf - lastFrameMs));
      lastFrameMs = nowPerf;

      if (fastMode) {
        if (advanceSim) {
          simEpochMs += dt * 600; // 600× speed: 6s = 1 hour, 1s = 10 minutes
        }
      } else {
        simEpochMs = Date.now();
      }

      const d = new Date(simEpochMs);
      const h24 = d.getHours();
      const h12 = h24 % 12;
      const m = d.getMinutes();
      const s = d.getSeconds();
      const ms = d.getMilliseconds();

      // Miyota 90S5 4Hz (0.125s) quantized mechanical sweep in live mode; continuous in 600× mode
      const sSweep = fastMode
        ? (s + ms / 1000)
        : (s + Math.floor(ms / 125) * 0.125);
      const tHours = h12 + m / 60 + sSweep / 3600;

      // 1. Central 3-Arm CNC carousel rotation
      const carouselDeg = tHours * 120 + 30;
      parts.bridgeG.setAttribute("transform", "rotate(" + carouselDeg.toFixed(3) + " 150 150)");

      // 2. 3 satellite hour discs: 120°/hr CW orbit + 8 o'clock roller 90° snap indexing
      const satellites = [];
      let rollerSpinAccum = 0;
      for (let k = 0; k < 3; k++) {
        const orbitDeg = tHours * 120 - 60 - k * 120;
        const rad = (orbitDeg * Math.PI) / 180;
        const x = 150 + ORBIT_R * Math.cos(rad);
        const y = 150 + ORBIT_R * Math.sin(rad);

        const diff = tHours - k;
        const cycle = Math.floor(diff / 3);
        const u = ((diff % 3) + 3) % 3;
        const rawProg = Math.max(0, Math.min(1, (u - 1.45) / 0.6));
        const easedProg = snapEase(rawProg);
        const localSpinDeg = -90 * (cycle + easedProg);

        if (u >= 1.45 && u <= 2.05) {
          rollerSpinAccum += easedProg * 180;
        }

        parts.satGroups[k].outer.setAttribute(
          "transform",
          "translate(" + x.toFixed(2) + ", " + y.toFixed(2) + ") rotate(" + orbitDeg.toFixed(3) + ")"
        );
        parts.satGroups[k].inner.setAttribute("transform", "rotate(" + localSpinDeg.toFixed(3) + ")");
        satellites.push({
          k: k,
          orbitDeg: Number(orbitDeg.toFixed(2)),
          localSpinDeg: Number(localSpinDeg.toFixed(2)),
          u: Number(u.toFixed(3)),
          indexing: u >= 1.45 && u <= 2.05
        });
      }

      // 3. 8 o'clock roller bearing engagement rotation
      parts.rollerRotorG.setAttribute("transform", "rotate(" + rollerSpinAccum.toFixed(1) + ")");

      // 4. 5:30 independent small seconds disc (Miyota 90S5 4Hz 0.125s sweep)
      const secDeg = -6 * sSweep;
      parts.secondsDiscG.setAttribute("transform", "rotate(" + secDeg.toFixed(2) + ")");

      // 5. 1–2 o'clock brass balance wheel 4Hz oscillation + 9 o'clock gear train drive
      const balDeg = isReducedMotion() ? 0 : Math.sin(nowPerf * 0.02513274) * 14;
      parts.balanceWheelG.setAttribute("transform", "translate(178, 92) rotate(" + balDeg.toFixed(1) + ")");
      const gearDeg = tHours * 360;
      parts.gearPrimaryRotor.setAttribute("transform", "rotate(" + gearDeg.toFixed(2) + ")");
      parts.gearSecondaryRotor.setAttribute("transform", "rotate(" + (-gearDeg * 1.428).toFixed(2) + ")");

      const activeDisc = h12 % 3;
      const dispHour = h12 === 0 ? 12 : h12;
      frameCount += 1;

      lastState = {
        date: d,
        h24: h24,
        h12: h12,
        dispHour: dispHour,
        m: m,
        s: s,
        ms: ms,
        sSweep: Number(sSweep.toFixed(3)),
        tHours: Number(tHours.toFixed(5)),
        activeDisc: activeDisc,
        activeDiscNum: activeDisc + 1,
        fastMode: fastMode,
        rafActive: rafId !== null,
        reducedMode: isReducedMotion(),
        frameCount: frameCount,
        satellites: satellites
      };

      if (onTick) {
        onTick(lastState);
      }
      return lastState;
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (reducedTimerId !== null) {
        clearInterval(reducedTimerId);
        reducedTimerId = null;
      }
      if (lastState) {
        lastState.rafActive = false;
      }
    }

    function rafStep(nowPerf) {
      if (!shouldAnimate() || isReducedMotion()) {
        stopLoop();
        return;
      }
      renderFrame(nowPerf, true);
      rafId = requestAnimationFrame(rafStep);
      if (lastState) lastState.rafActive = true;
    }

    function syncLoopState() {
      if (!shouldAnimate()) {
        stopLoop();
        return;
      }
      lastFrameMs = performance.now();
      if (isReducedMotion()) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (reducedTimerId === null) {
          renderFrame(performance.now(), false);
          reducedTimerId = setInterval(() => {
            if (!shouldAnimate()) {
              stopLoop();
              return;
            }
            renderFrame(performance.now(), true);
          }, 1000);
        }
      } else {
        if (reducedTimerId !== null) {
          clearInterval(reducedTimerId);
          reducedTimerId = null;
        }
        if (rafId === null) {
          rafId = requestAnimationFrame(rafStep);
        }
      }
    }

    function handleVisibilityChange() {
      syncLoopState();
    }

    function handleReducedMotionChange() {
      stopLoop();
      syncLoopState();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (reducedMotionMQ) {
      if (typeof reducedMotionMQ.addEventListener === "function") {
        reducedMotionMQ.addEventListener("change", handleReducedMotionChange);
      } else if (typeof reducedMotionMQ.addListener === "function") {
        reducedMotionMQ.addListener(handleReducedMotionChange);
      }
    }

    let classObserver = null;
    if (faceEl && typeof MutationObserver !== "undefined") {
      classObserver = new MutationObserver(() => {
        manualActiveOverride = null;
        syncLoopState();
      });
      classObserver.observe(faceEl, { attributes: true, attributeFilter: ["class"] });
    }

    // Render 1 initial accurate frame immediately, then only start rAF if active & visible
    renderFrame(performance.now(), false);
    syncLoopState();

    const api = {
      setActive: function (isActive) {
        manualActiveOverride = !!isActive;
        if (isActive) {
          lastFrameMs = performance.now();
          renderFrame(lastFrameMs, false);
        }
        syncLoopState();
      },
      setFastMode: function (enabled) {
        const next = !!enabled;
        if (next === fastMode) return fastMode;
        fastMode = next;
        lastFrameMs = performance.now();
        simEpochMs = Date.now();
        renderFrame(lastFrameMs, false);
        if (onModeChange) onModeChange(fastMode);
        syncLoopState();
        return fastMode;
      },
      toggleFastMode: function () {
        return api.setFastMode(!fastMode);
      },
      isFastMode: function () {
        return fastMode;
      },
      isRunning: function () {
        return rafId !== null || reducedTimerId !== null;
      },
      isRafActive: function () {
        return rafId !== null;
      },
      renderNow: function () {
        return renderFrame(performance.now(), false);
      },
      getState: function () {
        return lastState;
      },
      destroy: function () {
        destroyed = true;
        stopLoop();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (reducedMotionMQ) {
          if (typeof reducedMotionMQ.removeEventListener === "function") {
            reducedMotionMQ.removeEventListener("change", handleReducedMotionChange);
          } else if (typeof reducedMotionMQ.removeListener === "function") {
            reducedMotionMQ.removeListener(handleReducedMotionChange);
          }
        }
        if (classObserver) {
          classObserver.disconnect();
          classObserver = null;
        }
        if (activeInstance === api) activeInstance = null;
      }
    };

    activeInstance = api;
    return api;
  }

  global.SatelliteClock = {
    version: "1.0.0",
    mount: mount,
    getInstance: function () {
      return activeInstance;
    }
  };
})(typeof window !== "undefined" ? window : this);
