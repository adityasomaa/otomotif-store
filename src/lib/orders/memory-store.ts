/* ----------------------------------------------------------------------------
 * Penyimpanan pesanan di memori server.
 *
 * PENTING: penyimpanan ini TIDAK AWET. Isinya hilang setiap kali server
 * dimulai ulang, dan di Vercel tiap wilayah bisa punya memori sendiri.
 * Cukup untuk mencoba alurnya, tidak cukup untuk berjualan sungguhan.
 *
 * Supaya pembeli tetap bisa membuka kembali pesanannya di perangkat yang sama,
 * halaman Cek Pesanan juga menyimpan salinan di browser pembeli.
 *
 * Untuk produksi, ganti dengan basis data. Lihat database-store.ts.
 * -------------------------------------------------------------------------- */
import type { Pesanan, PenyimpananPesanan } from "./types";

const globalUntukPesanan = globalThis as unknown as { __pesanan?: Map<string, Pesanan> };
const peta: Map<string, Pesanan> = (globalUntukPesanan.__pesanan ??= new Map());

export const penyimpananMemori: PenyimpananPesanan = {
  namaTampilan: "Memori server (tidak awet)",
  awet: false,
  async simpan(pesanan: Pesanan) {
    peta.set(pesanan.kode.toUpperCase(), pesanan);
  },
  async ambil(kode: string) {
    return peta.get(kode.toUpperCase()) ?? null;
  },
};
