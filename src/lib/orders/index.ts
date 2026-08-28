/* ----------------------------------------------------------------------------
 * Pemilih penyimpanan pesanan dan pembuat kode pesanan.
 * -------------------------------------------------------------------------- */
import type { PenyimpananPesanan } from "./types";
import { penyimpananMemori } from "./memory-store";
import { penyimpananBasisData } from "./database-store";

export function penyimpananPesanan(): PenyimpananPesanan {
  switch ((process.env.ORDER_STORE ?? "memori").toLowerCase()) {
    case "database":
      return penyimpananBasisData;
    default:
      return penyimpananMemori;
  }
}

/* Huruf dan angka yang tidak mudah tertukar saat dibacakan lewat telepon.
   Tanpa I, O, 0, dan 1. */
const HURUF = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buatKodePesanan(): string {
  let hasil = "";
  const acak = new Uint32Array(8);
  crypto.getRandomValues(acak);
  for (let i = 0; i < 8; i++) hasil += HURUF[acak[i] % HURUF.length];
  return `OTO-${hasil.slice(0, 4)}-${hasil.slice(4, 8)}`;
}

/** Bentuk kode pesanan yang sah, dipakai untuk memeriksa masukan pengguna. */
export const POLA_KODE_PESANAN = /^OTO-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

/** Merapikan ketikan pengguna: huruf besar, spasi dibuang, tanda hubung dipasang. */
export function rapikanKodePesanan(masukan: string): string {
  const bersih = masukan.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const tanpaAwalan = bersih.startsWith("OTO") ? bersih.slice(3) : bersih;
  const inti = tanpaAwalan.slice(0, 8);
  if (inti.length <= 4) return `OTO-${inti}`;
  return `OTO-${inti.slice(0, 4)}-${inti.slice(4)}`;
}

export type * from "./types";
