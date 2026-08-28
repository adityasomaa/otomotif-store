/* ----------------------------------------------------------------------------
 * KERANGKA XENDIT — belum tersambung.
 *
 * Cara menyambungkan nanti:
 *   1. Simpan kunci rahasia sebagai variabel lingkungan di Vercel:
 *        XENDIT_SECRET_KEY
 *      Jangan pernah menuliskannya di dalam file ini.
 *   2. Isi bagian bertanda TODO di bawah dengan panggilan ke Xendit Invoice API.
 *   3. Ubah variabel lingkungan PAYMENT_PROVIDER menjadi "xendit".
 *   4. Daftarkan alamat webhook toko di dasbor Xendit supaya status pesanan
 *      ikut berubah setelah pembayaran diterima.
 *
 * Selama fungsi di bawah masih mengembalikan "belum-tersambung", seluruh
 * tampilan checkout akan menyatakan bahwa pembayaran belum aktif.
 * -------------------------------------------------------------------------- */
import type { AdapterPembayaran, HasilPembayaran, PermintaanPembayaran } from "./types";

export const adapterXendit: AdapterPembayaran = {
  mode: "xendit",
  simulasi: false,
  namaTampilan: "Xendit",

  async buatPembayaran(permintaan: PermintaanPembayaran): Promise<HasilPembayaran> {
    const kunci = process.env.XENDIT_SECRET_KEY;

    if (!kunci) {
      return {
        simulasi: false,
        mode: "xendit",
        status: "belum-tersambung",
        pesan:
          "Pembayaran Xendit belum tersambung. Kunci API belum dipasang di variabel lingkungan server.",
        urlPembayaran: null,
      };
    }

    /* TODO: panggil Xendit Invoice API di sini, lalu kembalikan urlPembayaran
       dari tanggapan Xendit. Kunci hanya boleh dibaca dari `kunci` di atas. */

    return {
      simulasi: false,
      mode: "xendit",
      status: "belum-tersambung",
      pesan: "Kerangka Xendit sudah ada, pemanggilan API-nya belum diisi.",
      urlPembayaran: null,
    };
  },
};
