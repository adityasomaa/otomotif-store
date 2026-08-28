/* ============================================================================
 * KECOCOKAN KENDARAAN
 * Satu-satunya tempat aturan "barang ini muat atau tidak" diputuskan.
 * Dipakai bersama oleh katalog, halaman produk, dan halaman cek kecocokan.
 * ========================================================================== */

import { KENDARAAN, PRODUK, KATEGORI, type Produk, type BarisKendaraan } from "@/data/catalog";

export type Kendaraan = {
  merek: string;
  model: string;
  tahun: number;
};

export type HasilKecocokan = "cocok" | "tidak-cocok" | "universal" | "belum-dipilih";

/* -- Daftar merek, urut abjad. -- */
export function daftarMerek(): string[] {
  return [...new Set(KENDARAAN.map((k) => k.merek))].sort((a, b) => a.localeCompare(b, "id"));
}

/* -- Daftar model untuk satu merek. -- */
export function daftarModel(merek: string): string[] {
  if (!merek) return [];
  return [...new Set(KENDARAAN.filter((k) => k.merek === merek).map((k) => k.model))].sort((a, b) =>
    a.localeCompare(b, "id")
  );
}

/* -- Daftar tahun untuk satu merek dan model, terbaru lebih dulu. -- */
export function daftarTahun(merek: string, model: string): number[] {
  if (!merek || !model) return [];
  const baris = KENDARAAN.find((k) => k.merek === merek && k.model === model);
  if (!baris) return [];
  const tahun: number[] = [];
  for (let t = baris.tahunSelesai; t >= baris.tahunMulai; t--) tahun.push(t);
  return tahun;
}

/* -- Apakah kombinasi merek, model, tahun benar-benar ada di tabel kendaraan. -- */
export function kendaraanValid(k: Partial<Kendaraan> | null): k is Kendaraan {
  if (!k || !k.merek || !k.model || !k.tahun) return false;
  const baris = KENDARAAN.find(
    (b: BarisKendaraan) => b.merek === k.merek && b.model === k.model
  );
  if (!baris) return false;
  return k.tahun >= baris.tahunMulai && k.tahun <= baris.tahunSelesai;
}

/* -- Aturan intinya. -- */
export function cekKecocokan(produk: Produk, kendaraan: Kendaraan | null): HasilKecocokan {
  if (produk.universal) return "universal";
  if (!kendaraan) return "belum-dipilih";
  const cocok = produk.kecocokan.some(
    (b) =>
      b.merek === kendaraan.merek &&
      b.model === kendaraan.model &&
      kendaraan.tahun >= b.tahunMulai &&
      kendaraan.tahun <= b.tahunSelesai
  );
  return cocok ? "cocok" : "tidak-cocok";
}

/* -- Produk yang boleh ditampilkan untuk kendaraan tertentu.
      Barang universal selalu ikut tampil, karena memang muat di semua. -- */
export function saringUntukKendaraan(daftar: Produk[], kendaraan: Kendaraan | null): Produk[] {
  if (!kendaraan) return daftar;
  return daftar.filter((p) => {
    const hasil = cekKecocokan(p, kendaraan);
    return hasil === "cocok" || hasil === "universal";
  });
}

/* -- Ringkasan daftar kecocokan sebuah produk, dikelompokkan per merek,
      supaya tabel di halaman produk mudah dibaca. -- */
export function kelompokKecocokan(produk: Produk) {
  const peta = new Map<string, { model: string; tahunMulai: number; tahunSelesai: number }[]>();
  for (const b of produk.kecocokan) {
    const isi = peta.get(b.merek) ?? [];
    isi.push({ model: b.model, tahunMulai: b.tahunMulai, tahunSelesai: b.tahunSelesai });
    peta.set(b.merek, isi);
  }
  return [...peta.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "id"))
    .map(([merek, model]) => ({
      merek,
      model: model.sort((a, b) => a.model.localeCompare(b.model, "id")),
    }));
}

/* -- Status stok. Selalu punya label teks, tidak pernah hanya warna. -- */
export type StatusStok = { kunci: "tersedia" | "menipis" | "habis"; label: string };

export function statusStok(stok: number): StatusStok {
  if (stok <= 0) return { kunci: "habis", label: "Stok habis" };
  if (stok <= 5) return { kunci: "menipis", label: "Stok menipis" };
  return { kunci: "tersedia", label: "Stok tersedia" };
}

/* -- Pencarian sederhana pada nama, sku, merek produk, dan ringkasan. -- */
export function cariProduk(daftar: Produk[], kata: string): Produk[] {
  const q = kata.trim().toLowerCase();
  if (!q) return daftar;
  const bagian = q.split(/\s+/);
  return daftar.filter((p) => {
    const bahan = `${p.nama} ${p.sku} ${p.merekProduk} ${p.ringkasan} ${p.kategori}`.toLowerCase();
    return bagian.every((b) => bahan.includes(b));
  });
}

/* -- Pembantu pencarian data. -- */
export function produkBySlug(slug: string): Produk | undefined {
  return PRODUK.find((p) => p.slug === slug);
}
export function kategoriBySlug(slug: string) {
  return KATEGORI.find((k) => k.slug === slug);
}
export function namaKategori(slug: string): string {
  return KATEGORI.find((k) => k.slug === slug)?.nama ?? slug;
}
export function daftarMerekProduk(): string[] {
  return [...new Set(PRODUK.map((p) => p.merekProduk))].sort((a, b) => a.localeCompare(b, "id"));
}
export function rentangHarga(): { min: number; max: number } {
  const harga = PRODUK.map((p) => p.harga);
  return { min: Math.min(...harga), max: Math.max(...harga) };
}
