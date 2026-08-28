/* ============================================================================
 * FORMAT ANGKA
 * Tampilan pakai pemisah ribuan, perhitungan tetap pakai angka mentah.
 * ========================================================================== */

/** "285000" -> "285.000". Hanya untuk ditampilkan. */
export function ribuan(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

/** "285000" -> "Rp285.000". Hanya untuk ditampilkan. */
export function rupiah(n: number): string {
  return `Rp${ribuan(n)}`;
}

/** Membuang semua karakter selain angka lalu mengembalikan angka mentah. */
export function keAngka(teks: string): number {
  const bersih = teks.replace(/[^0-9]/g, "");
  return bersih === "" ? 0 : Number.parseInt(bersih, 10);
}

/** Memformat isi input sambil diketik, tanpa mengubah nilai yang dikirim. */
export function formatSaatKetik(teks: string): string {
  const angka = keAngka(teks);
  return teks.trim() === "" ? "" : ribuan(angka);
}

/** Tanggal ISO -> "22 Agustus 2026". */
export function tanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
