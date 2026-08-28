/* ----------------------------------------------------------------------------
 * Pemilih adapter pembayaran.
 * Diatur lewat variabel lingkungan PAYMENT_PROVIDER di sisi server:
 *   (kosong) atau "demo"  -> mode simulasi
 *   "xendit"              -> kerangka Xendit
 *   "midtrans"            -> kerangka Midtrans
 * -------------------------------------------------------------------------- */
import type { AdapterPembayaran } from "./types";
import { adapterDemo } from "./demo";
import { adapterXendit } from "./xendit";
import { adapterMidtrans } from "./midtrans";

export function adapterPembayaran(): AdapterPembayaran {
  switch ((process.env.PAYMENT_PROVIDER ?? "demo").toLowerCase()) {
    case "xendit":
      return adapterXendit;
    case "midtrans":
      return adapterMidtrans;
    default:
      return adapterDemo;
  }
}

export type * from "./types";
