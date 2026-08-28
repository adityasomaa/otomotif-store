/* ----------------------------------------------------------------------------
 * Pemilih adapter ongkos kirim.
 * Diatur lewat variabel lingkungan SHIPPING_PROVIDER di sisi server:
 *   (kosong) atau "demo" -> tarif contoh
 *   "agregator"          -> kerangka agregator logistik
 * -------------------------------------------------------------------------- */
import type { AdapterOngkir } from "./types";
import { adapterOngkirDemo } from "./demo";
import { adapterOngkirAgregator } from "./aggregator";

export function adapterOngkir(): AdapterOngkir {
  switch ((process.env.SHIPPING_PROVIDER ?? "demo").toLowerCase()) {
    case "agregator":
      return adapterOngkirAgregator;
    default:
      return adapterOngkirDemo;
  }
}

/* Berat perkiraan per barang dipakai hanya untuk menghitung tarif contoh.
   Ganti dengan berat asli tiap produk kalau datanya sudah ada. */
export const BERAT_PERKIRAAN_GRAM = 1000;

export type * from "./types";
