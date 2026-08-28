/* ============================================================================
 * PESANAN
 * ========================================================================== */

export type StatusPesanan =
  | "menunggu-pembayaran"
  | "sedang-disiapkan"
  | "dikirim"
  | "selesai"
  | "dibatalkan";

export const LABEL_STATUS: Record<StatusPesanan, string> = {
  "menunggu-pembayaran": "Menunggu pembayaran",
  "sedang-disiapkan": "Sedang disiapkan",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export type ItemPesanan = {
  sku: string;
  slug: string;
  nama: string;
  jumlah: number;
  hargaSatuan: number;
};

export type Pesanan = {
  kode: string;
  dibuatPada: string;
  status: StatusPesanan;
  pembeli: { nama: string; email: string; telepon: string };
  alamat: {
    jalan: string;
    kota: string;
    provinsi: string;
    kodePos: string;
    catatan: string;
  };
  pengiriman: { kode: string; nama: string; ongkos: number; keterangan: string };
  item: ItemPesanan[];
  subtotal: number;
  total: number;
  /** Rekaman apa adanya soal bagaimana pesanan ini dibuat. */
  pembayaran: {
    mode: "demo" | "xendit" | "midtrans";
    simulasi: boolean;
    status: "siap" | "belum-tersambung";
    pesan: string;
  };
  /** Kendaraan yang sedang dipilih pembeli saat memesan, kalau ada. */
  kendaraan: { merek: string; model: string; tahun: number } | null;
  /** Tarif ongkir yang dipakai cuma contoh atau bukan. */
  ongkirContoh: boolean;
};

export interface PenyimpananPesanan {
  readonly namaTampilan: string;
  readonly awet: boolean;
  simpan(pesanan: Pesanan): Promise<void>;
  ambil(kode: string): Promise<Pesanan | null>;
}
