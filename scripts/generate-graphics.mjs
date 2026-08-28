/* ============================================================================
 * PEMBUAT GAMBAR PLACEHOLDER
 * ----------------------------------------------------------------------------
 * Menghasilkan seluruh file SVG di public/graphics dari kode, bukan dari stok.
 * Hasilnya selalu sama untuk data yang sama, jadi aman diregenerasi kapan pun:
 *
 *     node scripts/generate-graphics.mjs
 *
 * Aturan yang dipegang berkas ini:
 *   - Satu warna aksen saja.
 *   - Tiap kategori punya komposisi geometris berbeda supaya kartunya bisa
 *     dibedakan sekilas.
 *   - Tidak ada grain, noise, dither, atau tekstur bintik dalam bentuk apa pun.
 *     Kedalaman datang dari garis, bidang geometris, dan kontras.
 *   - Tidak ada yang berpura-pura jadi foto produk, dan tidak ada logo merek
 *     kendaraan mana pun.
 * ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "graphics");

/* -- Warna dijaga sama persis dengan token di globals.css -- */
const C = {
  paper: "#f4f3ef",
  panel: "#ffffff",
  ink: "#14161a",
  ink2: "#545a63",
  rule: "#d9d7d0",
  accent: "#ff5a1f",
  deep: "#0d0f12",
  deep2: "#191c21",
  chalk: "#f4f3ef",
};

/* -- Acak yang bisa diulang: angka yang keluar hanya bergantung pada seed. -- */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const between = (r, a, b) => a + r() * (b - a);
const n = (v) => Math.round(v * 100) / 100;

/* -- Elemen bersama: kisi garis, siku sudut, dan label kode kecil. -- */
function frame(w, h, seed, label) {
  const g = [];
  const step = 40;
  for (let x = step; x < w; x += step) {
    g.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${C.rule}" stroke-width="1" opacity=".5"/>`);
  }
  for (let y = step; y < h; y += step) {
    g.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${C.rule}" stroke-width="1" opacity=".5"/>`);
  }
  const t = 16;
  const corner = (x, y, sx, sy) =>
    `<path d="M ${x + sx * t} ${y} L ${x} ${y} L ${x} ${y + sy * t}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`;
  const corners = [
    corner(14, 14, 1, 1),
    corner(w - 14, 14, -1, 1),
    corner(14, h - 14, 1, -1),
    corner(w - 14, h - 14, -1, -1),
  ].join("");
  const tag = label
    ? `<text x="20" y="${h - 20}" font-family="ui-monospace, monospace" font-size="11" letter-spacing="1.4" fill="${C.ink2}">${label}</text>`
    : "";
  return { grid: g.join(""), corners, tag };
}

/* ---------------------------------------------------------------------------
 * Lima keluarga komposisi. Satu per kategori.
 * ------------------------------------------------------------------------- */

/* Sparepart: piringan rem, lingkaran baut, dan sudut kaliper. */
function rotor(r, w, h) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const R = Math.min(w, h) * between(r, 0.34, 0.4);
  const bolts = Math.round(between(r, 4, 6));
  const vents = Math.round(between(r, 14, 22));
  const o = [];
  o.push(`<circle cx="${cx}" cy="${cy}" r="${n(R)}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`);
  o.push(`<circle cx="${cx}" cy="${cy}" r="${n(R * 0.74)}" fill="none" stroke="${C.rule}" stroke-width="1"/>`);
  o.push(`<circle cx="${cx}" cy="${cy}" r="${n(R * 0.4)}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`);
  o.push(`<circle cx="${cx}" cy="${cy}" r="${n(R * 0.12)}" fill="${C.ink}"/>`);
  for (let i = 0; i < vents; i++) {
    const a = (i / vents) * Math.PI * 2;
    const r1 = R * 0.46;
    const r2 = R * 0.7;
    o.push(
      `<line x1="${n(cx + Math.cos(a) * r1)}" y1="${n(cy + Math.sin(a) * r1)}" x2="${n(cx + Math.cos(a) * r2)}" y2="${n(cy + Math.sin(a) * r2)}" stroke="${C.rule}" stroke-width="2"/>`
    );
  }
  const off = between(r, 0, Math.PI * 2);
  for (let i = 0; i < bolts; i++) {
    const a = off + (i / bolts) * Math.PI * 2;
    const br = R * 0.26;
    o.push(
      `<circle cx="${n(cx + Math.cos(a) * br)}" cy="${n(cy + Math.sin(a) * br)}" r="4.5" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
    );
  }
  /* Kaliper sebagai satu-satunya bidang aksen. */
  const ca = between(r, -0.9, 0.4);
  const sweep = 0.62;
  const arc = (rad, a0, a1) =>
    `${n(cx + Math.cos(a0) * rad)} ${n(cy + Math.sin(a0) * rad)} A ${n(rad)} ${n(rad)} 0 0 1 ${n(cx + Math.cos(a1) * rad)} ${n(cy + Math.sin(a1) * rad)}`;
  o.push(
    `<path d="M ${arc(R * 1.1, ca, ca + sweep)} L ${n(cx + Math.cos(ca + sweep) * R * 0.86)} ${n(cy + Math.sin(ca + sweep) * R * 0.86)} A ${n(R * 0.86)} ${n(R * 0.86)} 0 0 0 ${n(cx + Math.cos(ca) * R * 0.86)} ${n(cy + Math.sin(ca) * R * 0.86)} Z" fill="${C.accent}"/>`
  );
  /* Garis ukur diameter. */
  o.push(
    `<line x1="${n(cx - R)}" y1="${n(cy + R + 28)}" x2="${n(cx + R)}" y2="${n(cy + R + 28)}" stroke="${C.ink2}" stroke-width="1"/>` +
      `<line x1="${n(cx - R)}" y1="${n(cy + R + 22)}" x2="${n(cx - R)}" y2="${n(cy + R + 34)}" stroke="${C.ink2}" stroke-width="1"/>` +
      `<line x1="${n(cx + R)}" y1="${n(cy + R + 22)}" x2="${n(cx + R)}" y2="${n(cy + R + 34)}" stroke="${C.ink2}" stroke-width="1"/>`
  );
  return o.join("");
}

/* Aksesoris: susunan modul persegi bertingkat dengan garis sambung. */
function modul(r, w, h) {
  const o = [];
  const cols = 3;
  const rows = 3;
  const pad = 64;
  const gw = (w - pad * 2) / cols;
  const gh = (h - pad * 2) / rows;
  const accentCell = Math.floor(r() * cols * rows);
  let i = 0;
  const centers = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++, i++) {
      const inset = between(r, 6, 16);
      const bx = pad + x * gw + inset;
      const by = pad + y * gh + inset;
      const bw = gw - inset * 2;
      const bh = gh - inset * 2;
      if (bw <= 4 || bh <= 4) continue;
      centers.push([bx + bw / 2, by + bh / 2]);
      const isAccent = i === accentCell;
      o.push(
        `<rect x="${n(bx)}" y="${n(by)}" width="${n(bw)}" height="${n(bh)}" rx="2" fill="${isAccent ? C.accent : "none"}" stroke="${isAccent ? C.accent : C.ink}" stroke-width="1.5"/>`
      );
      if (!isAccent && r() > 0.55) {
        o.push(
          `<rect x="${n(bx + 8)}" y="${n(by + 8)}" width="${n(bw - 16)}" height="${n(bh - 16)}" rx="1" fill="none" stroke="${C.rule}" stroke-width="1"/>`
        );
      }
    }
  }
  for (let k = 1; k < centers.length; k++) {
    if (r() > 0.62) {
      const [x1, y1] = centers[k - 1];
      const [x2, y2] = centers[k];
      o.push(
        `<path d="M ${n(x1)} ${n(y1)} L ${n(x1)} ${n((y1 + y2) / 2)} L ${n(x2)} ${n((y1 + y2) / 2)} L ${n(x2)} ${n(y2)}" fill="none" stroke="${C.rule}" stroke-width="1"/>`
      );
    }
  }
  return o.join("");
}

/* Oli dan cairan: lapisan mendatar dengan tebal berbeda dan gelas ukur. */
function fluida(r, w, h) {
  const o = [];
  const left = 76;
  const right = w - 150;
  let y = 96;
  const bands = Math.round(between(r, 5, 8));
  const accentBand = Math.floor(r() * bands);
  for (let i = 0; i < bands && y < h - 110; i++) {
    const t = between(r, 12, 34);
    const isAccent = i === accentBand;
    o.push(
      `<rect x="${left}" y="${n(y)}" width="${n(right - left)}" height="${n(t)}" fill="${isAccent ? C.accent : "none"}" stroke="${isAccent ? C.accent : C.ink}" stroke-width="1.5"/>`
    );
    if (!isAccent) {
      const divs = Math.round(between(r, 2, 5));
      for (let d = 1; d < divs; d++) {
        const x = left + ((right - left) / divs) * d;
        o.push(`<line x1="${n(x)}" y1="${n(y)}" x2="${n(x)}" y2="${n(y + t)}" stroke="${C.rule}" stroke-width="1"/>`);
      }
    }
    y += t + between(r, 6, 14);
  }
  /* Gelas ukur dengan garis takar di sisi kanan. */
  const gx = w - 116;
  const gTop = 90;
  const gBot = h - 96;
  const level = between(r, 0.34, 0.66);
  const ly = gBot - (gBot - gTop) * level;
  o.push(
    `<path d="M ${gx} ${gTop} L ${gx} ${gBot} L ${gx + 56} ${gBot} L ${gx + 56} ${gTop}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
  );
  o.push(`<rect x="${gx + 1}" y="${n(ly)}" width="54" height="${n(gBot - ly - 1)}" fill="${C.accent}" opacity="0.16"/>`);
  o.push(`<line x1="${gx}" y1="${n(ly)}" x2="${gx + 56}" y2="${n(ly)}" stroke="${C.accent}" stroke-width="2.5"/>`);
  for (let i = 1; i < 8; i++) {
    const ty = gTop + ((gBot - gTop) / 8) * i;
    const len = i % 2 === 0 ? 16 : 9;
    o.push(`<line x1="${gx}" y1="${n(ty)}" x2="${n(gx + len)}" y2="${n(ty)}" stroke="${C.ink2}" stroke-width="1"/>`);
  }
  return o.join("");
}

/* Audio: kerucut speaker dan batang spektrum. */
function gelombang(r, w, h) {
  const o = [];
  const cx = w * 0.34;
  const cy = h * 0.5;
  const R = Math.min(w, h) * 0.36;
  const rings = Math.round(between(r, 4, 7));
  for (let i = rings; i >= 1; i--) {
    const rr = (R / rings) * i;
    o.push(
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(rr)}" fill="none" stroke="${i === rings ? C.ink : C.rule}" stroke-width="${i === rings ? 1.5 : 1}"/>`
    );
  }
  o.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.16)}" fill="${C.accent}"/>`);
  /* Empat titik sekrup di sudut dudukan. */
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    o.push(
      `<circle cx="${n(cx + sx * R * 0.82)}" cy="${n(cy + sy * R * 0.82)}" r="3.5" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
    );
  }
  /* Batang spektrum dengan tinggi yang tetap sama tiap regenerasi. */
  const bx = w * 0.64;
  const bars = 13;
  const bw = 12;
  const gap = 8;
  const maxH = h * 0.5;
  for (let i = 0; i < bars; i++) {
    const bh = maxH * between(r, 0.14, 1);
    const x = bx + i * (bw + gap);
    if (x + bw > w - 44) break;
    o.push(
      `<rect x="${n(x)}" y="${n(cy - bh / 2)}" width="${bw}" height="${n(bh)}" fill="${i % 4 === 1 ? C.accent : "none"}" stroke="${i % 4 === 1 ? C.accent : C.ink}" stroke-width="1.5"/>`
    );
  }
  o.push(`<line x1="${n(bx - 18)}" y1="${n(cy)}" x2="${n(w - 44)}" y2="${n(cy)}" stroke="${C.rule}" stroke-width="1"/>`);
  return o.join("");
}

/* Perawatan: kipas garis memancar dan sapuan busur. */
function radial(r, w, h) {
  const o = [];
  const ox = w * 0.16;
  const oy = h * 0.84;
  const rays = Math.round(between(r, 12, 18));
  const spread = between(r, 0.85, 1.15);
  const start = -Math.PI / 2 - spread / 2 + between(r, -0.15, 0.15);
  const len = Math.min(w, h) * 0.92;
  for (let i = 0; i < rays; i++) {
    const a = start + (i / (rays - 1)) * spread;
    const l = len * between(r, 0.62, 1);
    o.push(
      `<line x1="${n(ox)}" y1="${n(oy)}" x2="${n(ox + Math.cos(a) * l)}" y2="${n(oy + Math.sin(a) * l)}" stroke="${C.rule}" stroke-width="1"/>`
    );
  }
  const sweeps = Math.round(between(r, 3, 5));
  for (let i = 1; i <= sweeps; i++) {
    const rad = (len / (sweeps + 1)) * i;
    const a0 = start;
    const a1 = start + spread;
    o.push(
      `<path d="M ${n(ox + Math.cos(a0) * rad)} ${n(oy + Math.sin(a0) * rad)} A ${n(rad)} ${n(rad)} 0 0 1 ${n(ox + Math.cos(a1) * rad)} ${n(oy + Math.sin(a1) * rad)}" fill="none" stroke="${i === sweeps - 1 ? C.accent : C.ink}" stroke-width="${i === sweeps - 1 ? 3 : 1.5}"/>`
    );
  }
  o.push(`<circle cx="${n(ox)}" cy="${n(oy)}" r="6" fill="${C.ink}"/>`);
  /* Satu bidang aksen kecil sebagai penyeimbang komposisi. */
  const px = w * between(r, 0.62, 0.76);
  const py = h * between(r, 0.16, 0.3);
  o.push(`<rect x="${n(px)}" y="${n(py)}" width="34" height="34" fill="${C.accent}"/>`);
  return o.join("");
}

const FAMILIES = { rotor, modul, fluida, gelombang, radial };

/* -- Bungkus jadi satu file SVG utuh. -- */
function svg({ w, h, seed, family, label, dark = false }) {
  const r = rng(seed);
  const { grid, corners, tag } = frame(w, h, seed, label);
  const body = FAMILIES[family](r, w, h);
  const bg = dark ? C.deep : C.panel;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
<rect width="${w}" height="${h}" fill="${bg}"/>
<g>${grid}</g>
<g>${body}</g>
<g>${corners}</g>
${tag}
</svg>`;
}

/* -- Gambar cadangan kalau ada file yang gagal dimuat. -- */
function fallbackSvg() {
  const w = 640;
  const h = 480;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">
<rect width="${w}" height="${h}" fill="${C.paper}"/>
<line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${C.rule}" stroke-width="1"/>
<line x1="${w}" y1="0" x2="0" y2="${h}" stroke="${C.rule}" stroke-width="1"/>
<rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="${C.control ?? "#8e8a80"}" stroke-width="1.5"/>
<rect x="${w / 2 - 60}" y="${h / 2 - 6}" width="120" height="12" fill="${C.accent}"/>
</svg>`;
}

/* -- Wordmark untuk OG image dan site icon (latar transparan). -- */
function iconSvg() {
  /* Monogram teknis: dua busur kaliper mengapit satu batang aksen.
     Bukan logo merek kendaraan mana pun, dan latarnya transparan. */
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="23" fill="none" stroke="#14161a" stroke-width="5"/>
<circle cx="32" cy="32" r="7.5" fill="#14161a"/>
<rect x="29" y="1.5" width="6" height="14" fill="#ff5a1f"/>
<rect x="29" y="48.5" width="6" height="14" fill="#ff5a1f"/>
</svg>`;
}

/* ---------------------------------------------------------------------------
 * Jalankan.
 * ------------------------------------------------------------------------- */
async function main() {
  const catalogPath = path.join(ROOT, "src", "data", "catalog.ts");
  const src = fs.readFileSync(catalogPath, "utf8");

  /* Baca sku + kategori langsung dari file data supaya tidak perlu compiler. */
  const kategoriGrafik = {};
  const katRe = /slug:\s*"([^"]+)",\s*\n\s*nama:[\s\S]*?grafik:\s*"([^"]+)"/g;
  let m;
  while ((m = katRe.exec(src))) kategoriGrafik[m[1]] = m[2];

  const produkRe = /sku:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)",\s*\n\s*nama:\s*"[^"]*",\s*\n\s*kategori:\s*"([^"]+)"/g;
  const produk = [];
  while ((m = produkRe.exec(src))) produk.push({ sku: m[1], slug: m[2], kategori: m[3] });

  if (!Object.keys(kategoriGrafik).length || !produk.length) {
    throw new Error("Tidak menemukan kategori atau produk di src/data/catalog.ts");
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, "produk"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "kategori"), { recursive: true });

  for (const [slug, family] of Object.entries(kategoriGrafik)) {
    fs.writeFileSync(
      path.join(OUT, "kategori", `${slug}.svg`),
      svg({ w: 800, h: 500, seed: `kategori:${slug}`, family, label: slug.toUpperCase() })
    );
  }

  for (const p of produk) {
    const family = kategoriGrafik[p.kategori];
    if (!family) throw new Error(`Kategori "${p.kategori}" pada ${p.sku} tidak ada di daftar KATEGORI`);
    fs.writeFileSync(
      path.join(OUT, "produk", `${p.sku}.svg`),
      svg({ w: 640, h: 480, seed: p.sku, family, label: p.sku })
    );
  }

  fs.writeFileSync(path.join(OUT, "fallback.svg"), fallbackSvg());
  fs.writeFileSync(path.join(ROOT, "src", "app", "icon.svg"), iconSvg());

  console.log(
    `Selesai. ${Object.keys(kategoriGrafik).length} kategori, ${produk.length} produk, 1 fallback, 1 site icon.`
  );
}

main();
