/* ============================================================================
 * KONFIGURASI TOKO
 * ----------------------------------------------------------------------------
 * File ini adalah SATU-SATUNYA tempat untuk mengubah identitas dan kontak toko.
 * Tidak perlu menyentuh file lain.
 *
 * Nilai yang masih `null` artinya BELUM DIISI. Website akan menampilkan
 * penanda "belum diisi" di layar, bukan menebak isinya.
 * ========================================================================== */

/** Nama toko. NAMA SEMENTARA — ganti satu baris ini saja. */
export const NAMA_TOKO = "Otomotif Store";

/** Deskripsi netral satu kalimat. Dipakai di meta description dan footer. */
export const DESKRIPSI_TOKO =
  "Toko online sparepart, aksesoris, oli, audio, dan produk perawatan kendaraan dengan pengecekan kecocokan berdasarkan merek, model, dan tahun kendaraan.";

/** Domain produksi. Dipakai untuk canonical, sitemap, robots, dan structured data. */
export const DOMAIN = "https://otomotif.onyxcreative.asia";

/* ----------------------------------------------------------------------------
 * KONTAK — isi kalau sudah ada datanya.
 * Selama masih null, tombol dan blok terkait menampilkan status "belum diisi".
 * -------------------------------------------------------------------------- */
export const KONTAK = {
  /** Format internasional tanpa tanda plus. Contoh: "6281234567890" */
  whatsapp: null as string | null,
  /** Alamat lengkap toko / gudang. */
  alamat: null as string | null,
  /** Jam operasional. Contoh: "Senin-Sabtu 09.00-17.00 WIB" */
  jamOperasional: null as string | null,
  /** Email yang dipakai untuk urusan pesanan. */
  email: null as string | null,
  /** Username Instagram tanpa tanda @. */
  instagram: null as string | null,
};

/* ----------------------------------------------------------------------------
 * KEBIJAKAN — sengaja dikosongkan.
 * Jangan diisi dengan perkiraan. Ongkos kirim, lama pengiriman, dan syarat
 * retur harus datang dari pemilik toko.
 * -------------------------------------------------------------------------- */
export const KEBIJAKAN = {
  pengiriman: null as string | null,
  retur: null as string | null,
  pembayaran: null as string | null,
};

/* ----------------------------------------------------------------------------
 * MODE DATA
 * Selama `true`, seluruh katalog ditandai di layar sebagai data contoh.
 * Ubah ke `false` setelah katalog asli dimasukkan.
 * -------------------------------------------------------------------------- */
export const DATA_CONTOH = true;

/** Helper: apakah sebuah nilai konfigurasi masih kosong. */
export function belumDiisi(nilai: string | null | undefined): nilai is null {
  return nilai === null || nilai === undefined || nilai.trim() === "";
}

/** Nomor WhatsApp siap pakai untuk URL, atau null kalau belum diisi. */
export function nomorWhatsApp(): string | null {
  return belumDiisi(KONTAK.whatsapp) ? null : KONTAK.whatsapp.replace(/[^0-9]/g, "");
}
