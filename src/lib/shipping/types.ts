/* ============================================================================
 * LAPISAN ONGKOS KIRIM — ANTARMUKA BERSAMA
 * ----------------------------------------------------------------------------
 * Bentuknya sengaja dibuat sama dengan lapisan pembayaran: satu antarmuka,
 * dua implementasi.
 *
 *   demo.ts        tarif contoh yang ditandai jelas sebagai contoh.
 *   aggregator.ts  kerangka kosong untuk disambungkan ke agregator logistik.
 *
 * Tidak ada tarif, lama pengiriman, atau kebijakan retur yang dikarang di
 * tempat lain mana pun dalam kode ini.
 * ========================================================================== */

export type PermintaanOngkir = {
  kotaTujuan: string;
  kodePos: string;
  beratGram: number;
  nilaiBarang: number;
};

export type PilihanKirim = {
  kode: string;
  nama: string;
  /** Ongkos dalam rupiah. */
  ongkos: number;
  /** Keterangan apa adanya. Tidak berisi janji waktu sampai. */
  keterangan: string;
};

export type HasilOngkir = {
  /** true berarti tarifnya cuma contoh, bukan tarif kurir sungguhan. */
  contoh: boolean;
  mode: "demo" | "agregator";
  status: "siap" | "belum-tersambung";
  pesan: string;
  pilihan: PilihanKirim[];
};

export interface AdapterOngkir {
  readonly mode: "demo" | "agregator";
  readonly contoh: boolean;
  readonly namaTampilan: string;
  hitung(permintaan: PermintaanOngkir): Promise<HasilOngkir>;
}
