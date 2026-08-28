/* Mengambil pilihan pengiriman dari lapisan ongkos kirim.
   Tarif tidak pernah dihitung di browser. */
import { NextResponse } from "next/server";
import { z } from "zod";
import { adapterOngkir, BERAT_PERKIRAAN_GRAM } from "@/lib/shipping";

const skema = z.object({
  kota: z.string().trim().min(2).max(80),
  kodePos: z.string().trim().regex(/^[0-9]{5}$/),
  jumlahBarang: z.number().int().min(1).max(999),
  nilaiBarang: z.number().int().min(0),
});

export async function POST(request: Request) {
  let mentah: unknown;
  try {
    mentah = await request.json();
  } catch {
    return NextResponse.json({ ok: false, pesan: "Isi permintaan tidak terbaca." }, { status: 400 });
  }

  const diperiksa = skema.safeParse(mentah);
  if (!diperiksa.success) {
    return NextResponse.json(
      { ok: false, pesan: "Alamat tujuan belum lengkap." },
      { status: 422 }
    );
  }

  const data = diperiksa.data;
  const hasil = await adapterOngkir().hitung({
    kotaTujuan: data.kota,
    kodePos: data.kodePos,
    beratGram: data.jumlahBarang * BERAT_PERKIRAAN_GRAM,
    nilaiBarang: data.nilaiBarang,
  });

  return NextResponse.json({ ok: true, ...hasil });
}
