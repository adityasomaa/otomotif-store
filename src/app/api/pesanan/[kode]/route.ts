/* Membaca satu pesanan berdasarkan kodenya. */
import { NextResponse } from "next/server";
import { penyimpananPesanan, POLA_KODE_PESANAN } from "@/lib/orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  const { kode } = await params;
  const bersih = decodeURIComponent(kode).toUpperCase().trim();

  if (!POLA_KODE_PESANAN.test(bersih)) {
    return NextResponse.json(
      { ok: false, pesan: "Bentuk kode pesanan belum benar. Contohnya OTO-A2B3-C4D5." },
      { status: 400 }
    );
  }

  try {
    const pesanan = await penyimpananPesanan().ambil(bersih);
    if (!pesanan) {
      return NextResponse.json(
        {
          ok: false,
          pesan: "Pesanan dengan kode itu tidak ditemukan di server.",
          catatan:
            "Penyimpanan pesanan saat ini masih di memori server dan belum awet. Sambungkan basis data supaya pesanan bisa dibuka dari perangkat mana pun.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, pesanan });
  } catch (e) {
    return NextResponse.json(
      { ok: false, pesan: e instanceof Error ? e.message : "Gagal membaca pesanan." },
      { status: 500 }
    );
  }
}
