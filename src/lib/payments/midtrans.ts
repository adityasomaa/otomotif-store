/* ----------------------------------------------------------------------------
 * KERANGKA MIDTRANS — belum tersambung.
 *
 * Cara menyambungkan nanti:
 *   1. Simpan kunci sebagai variabel lingkungan di Vercel:
 *        MIDTRANS_SERVER_KEY
 *        MIDTRANS_IS_PRODUCTION   ("true" atau "false")
 *      Jangan pernah menuliskannya di dalam file ini.
 *   2. Isi bagian bertanda TODO di bawah dengan panggilan ke Snap API.
 *   3. Ubah variabel lingkungan PAYMENT_PROVIDER menjadi "midtrans".
 *   4. Daftarkan alamat notifikasi pembayaran di dasbor Midtrans.
 *
 * Selama fungsi di bawah masih mengembalikan "belum-tersambung", seluruh
 * tampilan checkout akan menyatakan bahwa pembayaran belum aktif.
 * -------------------------------------------------------------------------- */
import type { AdapterPembayaran, HasilPembayaran, PermintaanPembayaran } from "./types";

export const adapterMidtrans: AdapterPembayaran = {
  mode: "midtrans",
  simulasi: false,
  namaTampilan: "Midtrans",

  async buatPembayaran(permintaan: PermintaanPembayaran): Promise<HasilPembayaran> {
    const kunci = process.env.MIDTRANS_SERVER_KEY;

    if (!kunci) {
      return {
        simulasi: false,
        mode: "midtrans",
        status: "belum-tersambung",
        pesan:
          "Pembayaran Midtrans belum tersambung. Kunci API belum dipasang di variabel lingkungan server.",
        urlPembayaran: null,
      };
    }

    /* TODO: panggil Midtrans Snap API di sini, lalu kembalikan redirect_url
       dari tanggapan Snap. Kunci hanya boleh dibaca dari `kunci` di atas. */

    return {
      simulasi: false,
      mode: "midtrans",
      status: "belum-tersambung",
      pesan: "Kerangka Midtrans sudah ada, pemanggilan API-nya belum diisi.",
      urlPembayaran: null,
    };
  },
};
