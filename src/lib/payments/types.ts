/* ============================================================================
 * LAPISAN PEMBAYARAN — ANTARMUKA BERSAMA
 * ----------------------------------------------------------------------------
 * Ada dua implementasi yang memakai antarmuka yang sama persis:
 *
 *   demo.ts     mode simulasi. Tidak menghubungi siapa pun, tidak memindahkan
 *               uang, dan selalu menandai dirinya sebagai simulasi di layar.
 *   xendit.ts   kerangka kosong, siap disambungkan dengan kunci milik toko.
 *   midtrans.ts kerangka kosong, siap disambungkan dengan kunci milik toko.
 *
 * ATURAN YANG TIDAK BOLEH DILANGGAR
 *   - Tidak ada kunci API yang ditulis di dalam kode. Semuanya lewat variabel
 *     lingkungan di sisi server.
 *   - Tidak ada satu pun form di situs ini yang meminta nomor kartu, tanggal
 *     kedaluwarsa, atau CVV. Data kartu ditangani sepenuhnya oleh halaman
 *     milik penyedia pembayaran, bukan oleh situs ini.
 * ========================================================================== */

export type ItemPembayaran = {
  sku: string;
  nama: string;
  jumlah: number;
  hargaSatuan: number;
};

export type PermintaanPembayaran = {
  kodePesanan: string;
  total: number;
  pembeli: { nama: string; email: string; telepon: string };
  item: ItemPembayaran[];
};

export type HasilPembayaran = {
  /** true berarti tidak ada uang yang benar-benar berpindah. */
  simulasi: boolean;
  /** Nama mode yang sedang aktif, ditampilkan apa adanya di layar. */
  mode: "demo" | "xendit" | "midtrans";
  /** siap    : lapisan pembayaran menjawab dengan benar.
   *  belum-tersambung : kerangka masih kosong, kunci belum dipasang. */
  status: "siap" | "belum-tersambung";
  /** Kalimat yang boleh ditampilkan ke pembeli. */
  pesan: string;
  /** Alamat halaman pembayaran milik penyedia, kalau nanti sudah ada. */
  urlPembayaran: string | null;
};

export interface AdapterPembayaran {
  readonly mode: "demo" | "xendit" | "midtrans";
  readonly simulasi: boolean;
  readonly namaTampilan: string;
  buatPembayaran(permintaan: PermintaanPembayaran): Promise<HasilPembayaran>;
}
