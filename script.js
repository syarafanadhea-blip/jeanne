/* ===== Jeanne – script.js ===== */
const WA_NUMBER = "6282136822110"; // nomor WhatsApp Jeanne

/* ---------- Helper ---------- */
let UID = 0;
const nid = () => "u" + ++UID;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function hex2rgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function shade(hex, amt) {
  const [r, g, b] = hex2rgb(hex);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return "#" + [r, g, b].map((v) => Math.round(v + (t - v) * p).toString(16).padStart(2, "0")).join("");
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- Data ---------- */
const PRICE = 69000;
/* Warna disesuaikan dengan foto produk di folder foto- */
const PRODUCTS = [
  { id: 1, name: "Soft Pink", color: "#efcdc9", c2: "#fbeeec", tag: "Best Seller", photo: "foto-soft-pink.jpg", pos: "56% 25%",
    desc: "Merah muda pucat yang lembut dan segar, membuat wajah tampak cerah. Favorit untuk tampilan harian." },
  { id: 2, name: "Mocha", color: "#8d7d70", c2: "#ece5df", tag: "Favorit", photo: "foto-mocha.jpg", pos: "38% 30%",
    desc: "Cokelat keabu-abuan yang kalem dan elegan, aman dipadukan dengan hampir semua warna." },
  { id: 3, name: "Stone", color: "#b6aca8", c2: "#eeeae8", tag: "Baru", photo: "foto-stone.jpg", pos: "50% 20%",
    desc: "Abu hangat yang netral dan modern. Tampil rapi untuk kuliah, kerja, maupun acara santai." },
  { id: 4, name: "Sand", color: "#d9d0c1", c2: "#f4f0e8", tag: "Pastel", photo: "foto-sand.jpg", pos: "50% 25%",
    desc: "Krem pasir yang lembut dan natural. Jatuhnya cantik dengan lipatan yang mudah dibentuk." },
  { id: 5, name: "Ivory", color: "#ebded4", c2: "#f8f2ec", tag: "Classic", photo: "foto-ivory.jpg", pos: "50% 12%",
    desc: "Putih gading kemerahan yang bersih dan mewah. Paling serasi untuk acara formal maupun santai." },
  { id: 6, name: "Navy", color: "#26356c", c2: "#dfe4f1", tag: "Elegant", photo: "foto-navy.jpg", pos: "40% 20%",
    desc: "Biru dongker pekat yang tegas dan berkelas, nyaman dipakai untuk kerja dan kuliah." },
  { id: 7, name: "Hitam", color: "#2a2729", c2: "#e6e3e4", tag: "Essential", photo: "foto-hitam.jpg", pos: "45% 25%",
    desc: "Hitam pekat yang tidak mudah pudar. Wajib punya untuk segala suasana dan mudah dipadukan." },
].map((p) => ({ ...p, full: "Pashmina Kaos " + p.name }));

const MOTIFS = [
  { id: "peony", name: "Peony" },
  { id: "rose", name: "Mawar" },
  { id: "daisy", name: "Daisy" },
  { id: "sakura", name: "Sakura" },
  { id: "lavender", name: "Lavender" },
];
const TINTS = [
  { c: "#e58aa5", n: "Pink" }, { c: "#f2a58a", n: "Peach" }, { c: "#a98bd6", n: "Ungu" },
  { c: "#7fa7d9", n: "Biru" }, { c: "#f0c35a", n: "Kuning" }, { c: "#d95a63", n: "Merah" },
];
const BASES = [
  { c: "#f6efe6", n: "Ivory" }, { c: "#f5dcdc", n: "Blush" }, { c: "#dfe8da", n: "Sage" },
  { c: "#e6def0", n: "Lilac" }, { c: "#34425f", n: "Navy" }, { c: "#2b2b2f", n: "Hitam" },
];
const DEFAULT_SCR = { motif: "peony", tint: "#e58aa5", base: "#f6efe6", scale: 0.8, up: false, note: "" };


/* ---------- Watercolor: filter, daun, bunga ---------- */
const wcFilter = (id, sc = 6) =>
  `<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7"/></filter>`;

const leaf = (x, y, r, s = 1) =>
  `<ellipse transform="translate(${x} ${y}) rotate(${r})" rx="${5 * s}" ry="${14 * s}" fill="#8fa58b" fill-opacity=".55" stroke="#6f8a6b" stroke-opacity=".35" stroke-width=".7"/>`;

function flower(type, cx, cy, s, c, rot) {
  const d = shade(c, -0.25), R = s * 26;
  let g = "";
  if (type === "peony") {
    for (let L = 0; L < 3; L++) {
      const n = 8 - L, rr = R * (1 - L * 0.28), col = L === 0 ? c : L === 1 ? shade(c, -0.08) : d;
      for (let i = 0; i < n; i++) {
        const a = (i * 360) / n + L * 22;
        g += `<ellipse cx="0" cy="${-rr * 0.5}" rx="${rr * 0.52}" ry="${rr * 0.5}" transform="rotate(${a})" fill="${col}" fill-opacity=".5" stroke="${d}" stroke-opacity=".35" stroke-width=".8"/>`;
      }
    }
    g += `<circle r="${R * 0.14}" fill="#f3c76b" fill-opacity=".9"/>`;
  } else if (type === "rose") {
    for (let i = 0; i < 6; i++) {
      const r = R * (1 - i * 0.15);
      g += `<circle cx="${Math.sin(i * 2) * R * 0.06}" cy="${Math.cos(i * 2.3) * R * 0.06}" r="${r}" fill="${shade(c, i * -0.07)}" fill-opacity=".4" stroke="${d}" stroke-opacity=".5" stroke-width=".9"/>`;
    }
    g += `<path d="M${-R * 0.28} ${R * 0.02} q${R * 0.28} ${-R * 0.34} ${R * 0.56} 0" fill="none" stroke="${d}" stroke-opacity=".6" stroke-width="1"/><path d="M${-R * 0.12} ${-R * 0.1} q${R * 0.12} ${-R * 0.16} ${R * 0.26} 0" fill="none" stroke="${d}" stroke-opacity=".6" stroke-width="1"/>`;
  } else if (type === "daisy") {
    for (let i = 0; i < 14; i++) {
      g += `<ellipse cx="0" cy="${-R * 0.62}" rx="${R * 0.13}" ry="${R * 0.42}" transform="rotate(${(i * 360) / 14})" fill="#fff" fill-opacity=".92" stroke="${c}" stroke-opacity=".7" stroke-width="1"/>`;
    }
    g += `<circle r="${R * 0.2}" fill="#f2c14e" fill-opacity=".95" stroke="#d99a2b" stroke-opacity=".6" stroke-width=".8"/>`;
  } else if (type === "sakura") {
    for (let i = 0; i < 5; i++) {
      g += `<path transform="rotate(${i * 72})" d="M0 0 C${-R * 0.55} ${-R * 0.35} ${-R * 0.4} ${-R * 1.05} 0 ${-R * 0.88} C${R * 0.4} ${-R * 1.05} ${R * 0.55} ${-R * 0.35} 0 0Z" fill="${c}" fill-opacity=".62" stroke="${d}" stroke-opacity=".45" stroke-width=".9"/>`;
    }
    for (let i = 0; i < 6; i++) g += `<circle cx="${Math.cos(i) * R * 0.18}" cy="${Math.sin(i) * R * 0.18}" r="${R * 0.05}" fill="${d}" fill-opacity=".8"/>`;
  } else if (type === "lavender") {
    [-1, 0, 1].forEach((j) => {
      g += `<g transform="rotate(${j * 22})"><path d="M0 ${R * 0.9} L0 ${-R * 1.3}" stroke="#7d9a78" stroke-opacity=".8" stroke-width="1.6" fill="none"/>`;
      for (let k = 0; k < 8; k++) {
        const y = R * 0.7 - k * R * 0.26, sd = k % 2 ? 1 : -1, sz = 1 - k * 0.05;
        g += `<ellipse cx="${sd * R * 0.11}" cy="${y}" rx="${R * 0.1 * sz}" ry="${R * 0.17 * sz}" transform="rotate(${sd * 25} ${sd * R * 0.11} ${y})" fill="${c}" fill-opacity=".78" stroke="${d}" stroke-opacity=".4" stroke-width=".7"/>`;
      }
      g += `<ellipse cx="0" cy="${-R * 1.35}" rx="${R * 0.08}" ry="${R * 0.14}" fill="${c}" fill-opacity=".85"/></g>`;
    });
  }
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">${g}</g>`;
}

function motifTile(cfg) {
  const t = cfg.tint;
  let g = `<ellipse cx="38" cy="40" rx="44" ry="36" fill="${t}" fill-opacity=".11"/><ellipse cx="106" cy="100" rx="42" ry="34" fill="${t}" fill-opacity=".1"/>`;
  [[66, 68, 40], [72, 20, -30], [22, 74, 70], [122, 66, -50], [62, 120, 10], [132, 122, 60]].forEach((l) => (g += leaf(l[0], l[1], l[2])));
  const k = cfg.motif === "lavender" ? 1.1 : 1;
  [[38, 40, 1, 8], [106, 38, 0.62, 35], [100, 104, 0.95, 20], [30, 106, 0.6, 60]].forEach((p) => (g += flower(cfg.motif, p[0], p[1], p[2] * k, t, p[3])));
  return g;
}

/* pola kain (pattern) */
function patDefs(id, cfg, w = 140, h = 140) {
  const f = wcFilter(id + "wc");
  if (cfg.up && cfg.upData) {
    return `${f}<pattern id="${id}p" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><image href="${cfg.upData}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></pattern>`;
  }
  return `${f}<pattern id="${id}p" width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="scale(${cfg.scale})"><rect width="140" height="140" fill="${cfg.base}"/><g filter="url(#${id}wc)">${motifTile(cfg)}</g></pattern>`;
}

/* ---------- Scrunchie ---------- */
function scrunchie(cfg) {
  const id = nid(), N = 16;
  let o = "", n = "";
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * Math.PI * 2;
    const ro = 96 + 6.5 * Math.sin(N * t) + 2.5 * Math.sin(2 * N * t + 1);
    const ri = 44 + 4.5 * Math.sin(N * t + 0.6);
    o += (i ? "L" : "M") + (120 + ro * Math.cos(t)).toFixed(1) + " " + (120 + ro * Math.sin(t)).toFixed(1);
    n += (i ? "L" : "M") + (120 + ri * Math.cos(t)).toFixed(1) + " " + (120 + ri * Math.sin(t)).toFixed(1);
  }
  let folds = "";
  for (let k = 0; k < N; k++) {
    const a = (k * Math.PI * 2) / N + 0.2;
    const P = (r, da) => [(120 + r * Math.cos(a + da)).toFixed(1), (120 + r * Math.sin(a + da)).toFixed(1)];
    const [x1, y1] = P(48, 0), [qx, qy] = P(72, 0.2), [x2, y2] = P(93, 0.06);
    folds += `<path d="M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="2.4" stroke-linecap="round"/>`;
    const [a1, b1] = P(50, 0.1), [c1, d1] = P(72, 0.3), [a2, b2] = P(90, 0.14);
    folds += `<path d="M${a1} ${b1} Q${c1} ${d1} ${a2} ${b2}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3" stroke-linecap="round"/>`;
  }
  const d = o + "Z" + n + "Z";
  return `<svg viewBox="0 0 240 240" role="img" aria-label="Pratinjau scrunchie custom"><defs>${patDefs(id, cfg, 240, 240)}
    <radialGradient id="${id}s" cx="120" cy="120" r="100" gradientUnits="userSpaceOnUse"><stop offset=".42" stop-color="#000" stop-opacity=".34"/><stop offset=".56" stop-color="#fff" stop-opacity=".2"/><stop offset=".76" stop-color="#000" stop-opacity="0"/><stop offset=".95" stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient></defs>
    <path d="${d}" fill="url(#${id}p)" fill-rule="evenodd"/>
    <path d="${d}" fill="url(#${id}s)" fill-rule="evenodd"/>
    <g>${folds}</g>
    <path d="${n}Z" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/></svg>`;
}

function closeup(cfg) {
  const id = nid();
  const c = { ...cfg, scale: cfg.scale * 1.15 };
  return `<svg viewBox="0 0 300 110" role="img" aria-label="Close-up motif kain"><defs>${patDefs(id, c, 300, 110)}</defs><rect width="300" height="110" rx="16" fill="url(#${id}p)"/><rect width="300" height="110" rx="16" fill="none" stroke="rgba(0,0,0,.08)"/></svg>`;
}

/* bunga tunggal (hiasan & pilihan motif) */
function flowerSVG(type, color, size = 80) {
  const id = nid();
  return `<svg viewBox="-42 -42 84 84" width="${size}" height="${size}" role="img" aria-label="${type}"><defs>${wcFilter(id, 4)}</defs><g filter="url(#${id})">${leaf(-10, 18, 50, 0.9)}${leaf(14, 20, -40, 0.8)}${flower(type, 0, 0, 1, color, 0)}</g></svg>`;
}

/* ---------- Model berhijab (ilustrasi produk) ---------- */
function model(color, wash) {
  const id = nid();
  const dk = shade(color, -0.2), lt = shade(color, 0.22), dk2 = shade(color, -0.36);
  const w1 = shade(wash || color, 0.55), w2 = shade(wash || color, 0.7);
  return `<svg viewBox="0 0 300 360" role="img" aria-label="Model memakai pashmina ${color}" preserveAspectRatio="xMidYMid slice"><defs>${wcFilter(id + "w", 18)}
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lt}"/><stop offset="1" stop-color="${dk}"/></linearGradient>
    <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt}"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>
    <rect width="300" height="360" fill="${w2}"/>
    <g filter="url(#${id}w)" opacity=".85"><ellipse cx="70" cy="90" rx="90" ry="70" fill="${w1}"/><ellipse cx="250" cy="150" rx="70" ry="90" fill="${w1}" fill-opacity=".8"/><ellipse cx="60" cy="300" rx="80" ry="60" fill="${w1}" fill-opacity=".7"/></g>
    <path d="M20 360 C34 306 88 276 150 274 C212 276 266 306 280 360Z" fill="#f3ebe2"/>
    <path d="M150 44 C98 44 76 96 80 152 C82 188 64 214 48 262 C38 296 34 330 32 360 L268 360 C266 330 262 296 252 262 C236 214 218 188 220 152 C224 96 202 44 150 44Z" fill="url(#${id}g)"/>
    <ellipse cx="150" cy="144" rx="45" ry="57" fill="${dk2}" fill-opacity=".55"/>
    <ellipse cx="150" cy="144" rx="39" ry="51" fill="#f0cdb5"/>
    <ellipse cx="136" cy="128" rx="14" ry="22" fill="#fff" fill-opacity=".18"/>
    <circle cx="127" cy="158" r="8" fill="#e8908e" fill-opacity=".22"/><circle cx="173" cy="158" r="8" fill="#e8908e" fill-opacity=".22"/>
    <path d="M138 172 q12 8 24 0" fill="none" stroke="#c97b73" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".8"/>
    <path d="M128 122 q8 -5 16 0 M156 122 q8 -5 16 0" fill="none" stroke="#6b4a40" stroke-width="2" stroke-linecap="round" stroke-opacity=".55"/>
    <path d="M84 192 C112 252 192 264 238 214 C248 252 258 304 264 360 L90 360 C86 300 84 250 84 192Z" fill="url(#${id}h)"/>
    <path d="M84 192 C112 252 192 264 238 214" fill="none" stroke="${dk}" stroke-opacity=".5" stroke-width="2"/>
    <g fill="none" stroke="${dk}" stroke-opacity=".38" stroke-width="2.4" stroke-linecap="round"><path d="M112 244 C130 292 140 322 138 360"/><path d="M152 258 C166 304 172 332 174 360"/><path d="M194 252 C208 296 216 326 218 360"/></g>
    <g fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"><path d="M122 250 C140 296 150 326 150 360"/><path d="M204 256 C218 300 226 330 228 360"/><path d="M100 84 C112 66 130 54 150 52"/></g></svg>`;
}

/* ---------- Render awal: hero, tentang ---------- */
$("#heroModel").innerHTML = `<img src="foto-hero-group.jpg" alt="Empat model mengenakan pashmina kaos premium Jeanne" width="736" height="736" fetchpriority="high" decoding="async">`;
$("#heroScr").innerHTML = scrunchie({ ...DEFAULT_SCR, scale: 0.7 });
$("#hf1").innerHTML = flowerSVG("peony", "#e58aa5", 96);
$("#hf2").innerHTML = flowerSVG("sakura", "#f2a5b9", 74);
$("#hf3").innerHTML = flowerSVG("daisy", "#f0c35a", 84);
$("#aboutArt").innerHTML = `<img src="foto-stone.jpg" alt="Model mengenakan pashmina kaos Jeanne warna Stone" loading="lazy" decoding="async">`;

/* ---------- Foto produk (dengan cadangan ilustrasi bila foto gagal dimuat) ---------- */
function productImage(p) {
  if (p.photo) return `<img src="${esc(p.photo)}" alt="${esc(p.full)}" loading="lazy" decoding="async" style="object-position:${p.pos || "50% 25%"}" data-fallback="${p.id}">`;
  return model(p.color, p.color);
}
function attachFallbacks(root = document) {
  $$("img[data-fallback]", root).forEach((img) => {
    const swap = () => {
      const p = PRODUCTS.find((x) => x.id === +img.dataset.fallback);
      if (p && img.parentNode) img.outerHTML = model(p.color, p.color);
    };
    img.addEventListener("error", swap, { once: true });
  });
}
const SCR_MOTIFS = ["peony", "rose", "daisy", "sakura", "lavender", "peony", "rose"];
$("#products").innerHTML = PRODUCTS.map((p) => `
  <article class="card reveal">
    <div class="card-img">
      <span class="tag">${esc(p.tag)}</span>
      <div class="pframe">${productImage(p)}</div>
      <span class="free-chip" aria-label="Gratis scrunchie custom">${scrunchie({ ...DEFAULT_SCR, motif: SCR_MOTIFS[p.id - 1] })}<span><b>Free</b> scrunchie</span></span>
    </div>
    <div class="card-body">
      <h3><span class="dot" style="background:${p.color}"></span>${esc(p.full)}</h3>
      <div class="meta"><span>Rayon viscose jersey</span><span>175 × 75 cm</span><span>Tidak menerawang</span></div>
      <p>${esc(p.desc)}</p>
      <div class="price">${rupiah(PRICE)} <small>/ pcs • termasuk scrunchie</small></div>
      <div class="card-foot"><div class="row">
        <button class="btn btn-primary add" data-id="${p.id}">+ Keranjang</button>
        <button class="btn btn-ghost custom" data-id="${p.id}">Custom 🌸</button>
      </div></div>
    </div>
  </article>`).join("");

attachFallbacks($("#products"));

/* ---------- Studio scrunchie ---------- */
const S = { pid: 1, motif: "peony", tint: "#e58aa5", base: "#f6efe6", scale: 1, upData: "", upName: "", note: "" };

$("#pickPashmina").innerHTML = PRODUCTS.map((p) => `<button class="sw" data-v="${p.id}" style="background:${p.color}" title="${esc(p.name)}" aria-label="${esc(p.full)}"></button>`).join("");
$("#pickMotif").innerHTML = MOTIFS.map((m) => `<button class="mt" data-v="${m.id}">${flowerSVG(m.id, "#e58aa5", 54)}<span>${m.name}</span></button>`).join("");
$("#pickTint").innerHTML = TINTS.map((t) => `<button class="sw" data-v="${t.c}" style="background:${t.c}" title="${t.n}" aria-label="Bunga ${t.n}"></button>`).join("");
$("#pickBase").innerHTML = BASES.map((t) => `<button class="sw" data-v="${t.c}" style="background:${t.c}" title="${t.n}" aria-label="Dasar ${t.n}"></button>`).join("");

const nameOf = (list, c) => (list.find((x) => x.c === c || x.id === c) || {}).n || (list.find((x) => x.id === c) || {}).name || "";
const scrCfg = () => ({ motif: S.motif, tint: S.tint, base: S.base, scale: S.scale, up: !!S.upData, upData: S.upData });

let studioRaf = 0;
function renderStudio() {
  cancelAnimationFrame(studioRaf);
  studioRaf = requestAnimationFrame(() => {
    const p = PRODUCTS.find((x) => x.id === S.pid);
    const cfg = scrCfg();
    $("#stageModel").innerHTML = productImage(p);
    attachFallbacks($("#stageModel"));
    $("#stageScr").innerHTML = scrunchie(cfg);
    $("#stageClose").innerHTML = closeup(cfg);
    $("#studioName").textContent = p.full + " + Scrunchie Gratis";
    $("#studioSummary").textContent = S.upData
      ? "Motif: gambar unggahan kamu"
      : `Motif ${nameOf(MOTIFS, S.motif)} · bunga ${nameOf(TINTS, S.tint)} · dasar ${nameOf(BASES, S.base)}`;
  });
  $$("#pickPashmina .sw").forEach((b) => b.classList.toggle("active", +b.dataset.v === S.pid));
  $$("#pickMotif .mt").forEach((b) => b.classList.toggle("active", b.dataset.v === S.motif));
  $$("#pickTint .sw").forEach((b) => b.classList.toggle("active", b.dataset.v === S.tint));
  $$("#pickBase .sw").forEach((b) => b.classList.toggle("active", b.dataset.v === S.base));
  $("#scaleVal").textContent = Math.round(S.scale * 100) + "%";
  $("#clearUp").hidden = !S.upData;
  $("#upName").textContent = S.upName;
}
function bindPick(sel, key, num) {
  $(sel).addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    S[key] = num ? +b.dataset.v : b.dataset.v;
    renderStudio();
  });
}
bindPick("#pickPashmina", "pid", true);
bindPick("#pickMotif", "motif");
bindPick("#pickTint", "tint");
bindPick("#pickBase", "base");
$("#scale").addEventListener("input", (e) => { S.scale = e.target.value / 100; renderStudio(); });
$("#note").addEventListener("input", (e) => { S.note = e.target.value; });

function readImage(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const sc = Math.min(1, 480 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      im.onerror = rej;
      im.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}
$("#upload").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.startsWith("image/")) return toast("File harus berupa gambar");
  if (f.size > 8 * 1024 * 1024) return toast("Ukuran gambar maksimal 8 MB");
  try {
    S.upData = await readImage(f);
    S.upName = f.name.length > 28 ? f.name.slice(0, 25) + "…" : f.name;
    renderStudio();
    toast("Gambar dipakai untuk pratinjau 🌸");
  } catch (err) { toast("Gagal membaca gambar"); }
  e.target.value = "";
});
$("#clearUp").addEventListener("click", () => { S.upData = ""; S.upName = ""; renderStudio(); });

$("#studioShuffle").addEventListener("click", () => {
  const r = (a) => a[Math.floor(Math.random() * a.length)];
  S.motif = r(MOTIFS).id; S.tint = r(TINTS).c; S.base = r(BASES).c;
  S.scale = +(0.7 + Math.random() * 0.8).toFixed(2);
  S.upData = ""; S.upName = "";
  $("#scale").value = Math.round(S.scale * 100);
  renderStudio();
});
$("#studioAdd").addEventListener("click", () => {
  addLine(S.pid, { motif: S.motif, tint: S.tint, base: S.base, scale: S.scale, up: !!S.upData, note: S.note.trim() }, S.upData);
  toast("Pashmina + scrunchie custom masuk keranjang 🌸");
});
renderStudio();

/* ---------- Keranjang ---------- */
let cart = [];
const uploads = {}; // dataURL gambar unggahan (hanya di memori)
try { cart = JSON.parse(localStorage.getItem("jeanne_cart") || "[]"); } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem("jeanne_cart", JSON.stringify(cart)); } catch (e) {} };
const keyOf = (pid, s) => [pid, s.motif, s.tint, s.base, s.scale, s.up ? 1 : 0, s.note].join("|");

function addLine(pid, scr, upData) {
  const key = keyOf(pid, scr);
  const f = cart.find((i) => i.key === key);
  f ? f.qty++ : cart.push({ key, pid, qty: 1, scr });
  if (upData) uploads[key] = upData;
  renderCart();
}
const summaryOf = (s) => s.up ? "gambar unggahan" : `${nameOf(MOTIFS, s.motif)}, bunga ${nameOf(TINTS, s.tint)}, dasar ${nameOf(BASES, s.base)}, ukuran ${Math.round(s.scale * 100)}%`;

function renderCart() {
  const box = $("#cartItems");
  cart = cart.filter((it) => PRODUCTS.some((p) => p.id === it.pid));
  if (!cart.length) {
    box.innerHTML = `<div class="empty"><span>🛍️</span>Keranjang masih kosong.<br>Yuk pilih pashmina favoritmu!</div>`;
  } else {
    box.innerHTML = cart.map((it) => {
      const p = PRODUCTS.find((x) => x.id === it.pid);
      const cfg = { ...it.scr, upData: it.scr.up ? uploads[it.key] : "" };
      if (it.scr.up && !cfg.upData) cfg.up = false;
      return `<div class="item">
        <div class="item-img"><div class="pframe">${productImage(p)}</div><div class="mini">${scrunchie(cfg)}</div></div>
        <div><h5>${esc(p.full)}</h5><small>${rupiah(PRICE)}</small>
          <small><span class="fs">Free scrunchie:</span> ${esc(summaryOf(it.scr))}${it.scr.note ? "<br>Catatan: " + esc(it.scr.note) : ""}</small>
          <div class="qty"><button data-act="dec" data-key="${esc(it.key)}" aria-label="Kurangi">−</button><span>${it.qty}</span><button data-act="inc" data-key="${esc(it.key)}" aria-label="Tambah">+</button></div></div>
        <button class="rm" data-act="rm" data-key="${esc(it.key)}" aria-label="Hapus ${esc(p.full)}">🗑</button>
      </div>`;
    }).join("");
  }
  attachFallbacks(box);
  const total = cart.reduce((s, it) => s + PRICE * it.qty, 0);
  const count = cart.reduce((s, it) => s + it.qty, 0);
  $("#cartTotal").textContent = rupiah(total);
  const badge = $("#cartCount");
  badge.textContent = count;
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  saveCart();
}

$("#products").addEventListener("click", (e) => {
  const add = e.target.closest(".add"), cu = e.target.closest(".custom");
  if (add) {
    addLine(+add.dataset.id, { ...DEFAULT_SCR });
    toast("Masuk keranjang. Scrunchie gratis bisa kamu custom di Studio 🌸");
  }
  if (cu) {
    S.pid = +cu.dataset.id;
    renderStudio();
    $("#studio").scrollIntoView({ behavior: "smooth" });
    toast("Atur desain scrunchie gratismu di sini 🌸");
  }
});

$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const it = cart.find((i) => i.key === b.dataset.key);
  if (!it) return;
  if (b.dataset.act === "inc") it.qty++;
  if (b.dataset.act === "dec") it.qty--;
  if (b.dataset.act === "rm" || it.qty <= 0) cart = cart.filter((i) => i.key !== it.key);
  renderCart();
});

const drawer = $("#drawer"), overlay = $("#overlay");
function toggleCart(open) {
  drawer.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
  drawer.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}
$("#openCart").addEventListener("click", () => toggleCart(true));
$("#closeCart").addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });
$("#clearCart").addEventListener("click", () => { cart = []; renderCart(); });

$("#checkout").addEventListener("click", () => {
  if (!cart.length) return toast("Keranjang masih kosong");
  let total = 0, needUpload = false;
  const lines = cart.map((it, i) => {
    const p = PRODUCTS.find((x) => x.id === it.pid);
    total += PRICE * it.qty;
    if (it.scr.up) needUpload = true;
    return `${i + 1}. ${p.full} x${it.qty} = ${rupiah(PRICE * it.qty)}\n   Free scrunchie: ${summaryOf(it.scr)}${it.scr.note ? "\n   Catatan: " + it.scr.note : ""}`;
  });
  const msg = `Halo Jeanne, saya mau pesan:\n${lines.join("\n")}\n\nTotal: ${rupiah(total)} (scrunchie gratis)${needUpload ? "\n\nSaya akan kirim file gambar untuk scrunchie lewat chat ini." : ""}\n\nNama penerima:\nAlamat pengiriman:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});
renderCart();

/* ---------- Tab kebijakan ---------- */
$$(".tab").forEach((t) => t.addEventListener("click", () => {
  $$(".tab").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
  $$(".panel").forEach((p) => p.classList.remove("active"));
  t.classList.add("active"); t.setAttribute("aria-selected", "true");
  $("#tab-" + t.dataset.tab).classList.add("active");
}));

/* ---------- Menu mobile ---------- */
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
$$("#menu a").forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

/* ---------- Scroll ---------- */
const header = $("#header"), toTop = $("#toTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 20);
  toTop.classList.toggle("show", scrollY > 500);
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
  $$(".reveal").forEach((el) => io.observe(el));
} else { $$(".reveal").forEach((el) => el.classList.add("in")); }

/* ---------- Form kontak ---------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const n = $("#cName").value.trim(), m = $("#cMsg").value.trim(), err = $("#formErr");
  if (n.length < 2 || m.length < 5) { err.textContent = "Mohon isi nama dan pesan dengan lengkap."; return; }
  err.textContent = "";
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Jeanne, saya ${n}.\n${m}`)}`, "_blank", "noopener");
  e.target.reset();
  toast("Membuka WhatsApp…");
});

$("#year").textContent = new Date().getFullYear();
