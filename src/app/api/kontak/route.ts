/* Menerima pesan dari halaman kontak.
   Isian diperiksa ulang di server, tidak cuma di browser. */
import { NextResponse } from "next/server";
import { skemaKontak, petaGalat } from "@/lib/validation";

export async function POST(request: Request) {
  let mentah: unknown;
  try {
    mentah = await request.json();
  } catch {
    return NextResponse.json({ ok: false, pesan: "Isi permintaan tidak terbaca." }, { status: 400 });
  }

  const diperiksa = skemaKontak.safeParse(mentah);
  if (!diperiksa.success) {
    return NextResponse.json(
      { ok: false, pesan: "Ada isian yang belum benar.", galat: petaGalat(diperiksa.error) },
      { status: 422 }
    );
  }

  if (diperiksa.data.situs) {
    return NextResponse.json({ ok: false, pesan: "Pengiriman ditolak." }, { status: 400 });
  }

  /* Tujuan pengiriman pesan belum ditentukan.
     Begitu email atau nomor WhatsApp toko diisi, sambungkan pengiriman di sini
     (misalnya lewat penyedia email transaksional). Selama itu belum ada,
     jawaban di bawah mengatakan apa adanya, bukan berpura-pura terkirim. */
  return NextResponse.json({
    ok: true,
    terkirim: false,
    pesan:
      "Isian Anda sudah lolos pemeriksaan, tapi tujuan pengiriman pesan belum diatur pemilik toko. Untuk sekarang, gunakan tombol WhatsApp supaya pesan Anda benar-benar sampai.",
  });
}
