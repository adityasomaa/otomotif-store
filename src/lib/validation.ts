/* ============================================================================
 * ATURAN VALIDASI
 * ----------------------------------------------------------------------------
 * Satu berkas dipakai dua kali: di browser untuk memberi tahu pembeli lebih
 * cepat, dan di server sebagai pemeriksaan yang sebenarnya. Pemeriksaan di
 * browser bisa dilewati siapa pun, jadi server tidak pernah mempercayainya.
 * ========================================================================== */

import { z } from "zod";

const teksWajib = (nama: string, min = 1, max = 200) =>
  z
    .string({ error: `${nama} wajib diisi.` })
    .trim()
    .min(min, `${nama} wajib diisi.`)
    .max(max, `${nama} terlalu panjang.`);

/* Nomor telepon Indonesia dalam bentuk yang lazim diketik orang. */
const telepon = z
  .string({ error: "Nomor telepon wajib diisi." })
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => /^(\+?62|0)8[1-9][0-9]{6,11}$/.test(v), {
    message: "Nomor telepon belum benar. Contoh bentuk yang diterima: 081234567890.",
  });

export const skemaAlamat = z.object({
  nama: teksWajib("Nama penerima", 2, 80),
  email: z
    .string({ error: "Email wajib diisi." })
    .trim()
    .min(1, "Email wajib diisi.")
    .pipe(z.email("Format email belum benar.")),
  telepon,
  jalan: teksWajib("Alamat", 8, 300),
  kota: teksWajib("Kota atau kabupaten", 2, 80),
  provinsi: teksWajib("Provinsi", 2, 80),
  kodePos: z
    .string({ error: "Kode pos wajib diisi." })
    .trim()
    .regex(/^[0-9]{5}$/, "Kode pos terdiri dari 5 angka."),
  catatan: z.string().trim().max(500, "Catatan terlalu panjang.").optional().default(""),
});

export const skemaItemPesanan = z.object({
  sku: z.string().trim().min(1).max(40),
  jumlah: z.number().int("Jumlah harus bilangan bulat.").min(1, "Jumlah minimal 1.").max(99, "Jumlah maksimal 99 per barang."),
});

export const skemaKendaraan = z
  .object({
    merek: z.string().trim().min(1).max(40),
    model: z.string().trim().min(1).max(60),
    tahun: z.number().int().min(1950).max(2100),
  })
  .nullable();

export const skemaCheckout = z.object({
  alamat: skemaAlamat,
  item: z.array(skemaItemPesanan).min(1, "Keranjang masih kosong.").max(60, "Terlalu banyak jenis barang dalam satu pesanan."),
  kodePengiriman: z.string().trim().min(1, "Pilih cara pengiriman dulu."),
  kendaraan: skemaKendaraan.optional().default(null),
  /* Kolom jebakan untuk robot pengisi form. Manusia tidak pernah melihatnya. */
  situs: z.string().max(0, "Pengiriman ditolak.").optional().default(""),
});

export const skemaKontak = z.object({
  nama: teksWajib("Nama", 2, 80),
  email: z
    .string({ error: "Email wajib diisi." })
    .trim()
    .min(1, "Email wajib diisi.")
    .pipe(z.email("Format email belum benar.")),
  pesan: teksWajib("Pesan", 10, 2000),
  situs: z.string().max(0, "Pengiriman ditolak.").optional().default(""),
});

export type DataAlamat = z.infer<typeof skemaAlamat>;
export type DataCheckout = z.infer<typeof skemaCheckout>;
export type DataKontak = z.infer<typeof skemaKontak>;

/** Mengubah galat zod menjadi peta sederhana: { namaKolom: pesan }. */
export function petaGalat(error: z.ZodError): Record<string, string> {
  const hasil: Record<string, string> = {};
  for (const isu of error.issues) {
    const kunci = isu.path.join(".");
    if (!hasil[kunci]) hasil[kunci] = isu.message;
  }
  return hasil;
}
