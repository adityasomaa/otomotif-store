/* ----------------------------------------------------------------------------
 * KERANGKA BASIS DATA — belum tersambung.
 *
 * Cara menyambungkan nanti:
 *   1. Pasang basis data pilihan toko, misalnya Vercel Postgres atau Supabase.
 *   2. Simpan alamat sambungannya sebagai variabel lingkungan:
 *        DATABASE_URL
 *      Jangan pernah menuliskannya di dalam file ini.
 *   3. Isi bagian bertanda TODO di bawah.
 *   4. Ubah variabel lingkungan ORDER_STORE menjadi "database".
 *
 * Setelah itu halaman Cek Pesanan bisa dibuka dari perangkat mana pun,
 * bukan cuma dari perangkat yang dipakai memesan.
 * -------------------------------------------------------------------------- */
import type { Pesanan, PenyimpananPesanan } from "./types";

export const penyimpananBasisData: PenyimpananPesanan = {
  namaTampilan: "Basis data",
  awet: true,

  async simpan(pesanan: Pesanan) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Basis data belum tersambung. DATABASE_URL belum dipasang.");
    }
    /* TODO: tulis pesanan ke tabel. */
    throw new Error("Kerangka basis data sudah ada, penulisannya belum diisi.");
  },

  async ambil(kode: string): Promise<Pesanan | null> {
    if (!process.env.DATABASE_URL) {
      throw new Error("Basis data belum tersambung. DATABASE_URL belum dipasang.");
    }
    /* TODO: baca pesanan dari tabel berdasarkan kode. */
    throw new Error("Kerangka basis data sudah ada, pembacaannya belum diisi.");
  },
};
