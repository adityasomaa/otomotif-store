/* ----------------------------------------------------------------------------
 * KERANGKA AGREGATOR LOGISTIK — belum tersambung.
 *
 * Cara menyambungkan nanti:
 *   1. Simpan kunci sebagai variabel lingkungan di Vercel:
 *        SHIPPING_API_KEY
 *        SHIPPING_ORIGIN_AREA_ID   (kode wilayah asal pengiriman toko)
 *      Jangan pernah menuliskannya di dalam file ini.
 *   2. Isi bagian bertanda TODO dengan panggilan ke API agregator pilihan toko.
 *   3. Ubah variabel lingkungan SHIPPING_PROVIDER menjadi "agregator".
 *
 * Selama fungsi ini masih mengembalikan "belum-tersambung", layar pengiriman
 * akan menyatakan bahwa ongkos kirim belum aktif, bukan menampilkan angka.
 * -------------------------------------------------------------------------- */
import type { AdapterOngkir, HasilOngkir, PermintaanOngkir } from "./types";

export const adapterOngkirAgregator: AdapterOngkir = {
  mode: "agregator",
  contoh: false,
  namaTampilan: "Agregator logistik",

  async hitung(permintaan: PermintaanOngkir): Promise<HasilOngkir> {
    const kunci = process.env.SHIPPING_API_KEY;

    if (!kunci) {
      return {
        contoh: false,
        mode: "agregator",
        status: "belum-tersambung",
        pesan:
          "Layanan pengiriman belum tersambung. Kunci API belum dipasang di variabel lingkungan server.",
        pilihan: [],
      };
    }

    /* TODO: panggil API agregator di sini dan ubah tanggapannya menjadi
       daftar PilihanKirim. Kunci hanya boleh dibaca dari `kunci` di atas. */

    return {
      contoh: false,
      mode: "agregator",
      status: "belum-tersambung",
      pesan: "Kerangka agregator sudah ada, pemanggilan API-nya belum diisi.",
      pilihan: [],
    };
  },
};
