/* ============================================================================
 * MEMBUAT PESANAN
 * ----------------------------------------------------------------------------
 * Semua yang penting dihitung ulang di sini, bukan diterima apa adanya dari
 * browser:
 *   - harga tiap barang dibaca ulang dari katalog di server
 *   - jumlah barang dibatasi oleh stok yang tercatat di server
 *   - ongkos kirim diambil dari lapisan pengiriman, bukan dari kiriman browser
 *   - seluruh isian diperiksa ulang dengan aturan yang sama seperti di browser
 *
 * Tidak ada satu pun kolom di alur ini yang meminta data kartu.
 * ========================================================================== */

import { NextResponse } from "next/server";
import { skemaCheckout, petaGalat } from "@/lib/validation";
import { PRODUK } from "@/data/catalog";
import { adapterPembayaran } from "@/lib/payments";
import { adapterOngkir, BERAT_PERKIRAAN_GRAM } from "@/lib/shipping";
import { penyimpananPesanan, buatKodePesanan } from "@/lib/orders";
import type { ItemPesanan, Pesanan } from "@/lib/orders/types";

export async function POST(request: Request) {
  let mentah: unknown;
  try {
    mentah = await request.json();
  } catch {
    return NextResponse.json({ ok: false, pesan: "Isi permintaan tidak terbaca." }, { status: 400 });
  }

  /* 1. Periksa bentuk dan isi. */
  const diperiksa = skemaCheckout.safeParse(mentah);
  if (!diperiksa.success) {
    return NextResponse.json(
      { ok: false, pesan: "Ada isian yang belum benar.", galat: petaGalat(diperiksa.error) },
      { status: 422 }
    );
  }
  const data = diperiksa.data;

  /* Kolom jebakan terisi berarti bukan manusia. */
  if (data.situs) {
    return NextResponse.json({ ok: false, pesan: "Pengiriman ditolak." }, { status: 400 });
  }

  /* 2. Susun ulang isi keranjang dari katalog di server. */
  const item: ItemPesanan[] = [];
  const galatItem: Record<string, string> = {};

  for (const baris of data.item) {
    const produk = PRODUK.find((p) => p.sku === baris.sku);
    if (!produk) {
      galatItem[baris.sku] = "Barang ini sudah tidak ada di katalog.";
      continue;
    }
    if (produk.stok <= 0) {
      galatItem[baris.sku] = `${produk.nama} sedang habis.`;
      continue;
    }
    const jumlah = Math.min(baris.jumlah, produk.stok);
    item.push({
      sku: produk.sku,
      slug: produk.slug,
      nama: produk.nama,
      jumlah,
      /* Harga selalu dari katalog, bukan dari kiriman browser. */
      hargaSatuan: produk.harga,
    });
  }

  if (Object.keys(galatItem).length > 0) {
    return NextResponse.json(
      { ok: false, pesan: "Ada barang yang tidak bisa diproses.", galat: galatItem },
      { status: 409 }
    );
  }
  if (item.length === 0) {
    return NextResponse.json({ ok: false, pesan: "Keranjang kosong." }, { status: 422 });
  }

  const subtotal = item.reduce((t, b) => t + b.hargaSatuan * b.jumlah, 0);
  const totalBarang = item.reduce((t, b) => t + b.jumlah, 0);

  /* 3. Ongkos kirim dari lapisan pengiriman. */
  const ongkir = adapterOngkir();
  const kutipan = await ongkir.hitung({
    kotaTujuan: data.alamat.kota,
    kodePos: data.alamat.kodePos,
    beratGram: totalBarang * BERAT_PERKIRAAN_GRAM,
    nilaiBarang: subtotal,
  });

  const pilihan = kutipan.pilihan.find((p) => p.kode === data.kodePengiriman);
  if (!pilihan) {
    return NextResponse.json(
      {
        ok: false,
        pesan:
          kutipan.status === "belum-tersambung"
            ? "Layanan pengiriman belum tersambung, jadi pesanan belum bisa diteruskan."
            : "Cara pengiriman yang dipilih tidak dikenal.",
        galat: { kodePengiriman: "Pilih cara pengiriman yang tersedia." },
      },
      { status: 422 }
    );
  }

  const total = subtotal + pilihan.ongkos;

  /* 4. Serahkan ke lapisan pembayaran. */
  const kode = buatKodePesanan();
  const bayar = adapterPembayaran();
  const hasilBayar = await bayar.buatPembayaran({
    kodePesanan: kode,
    total,
    pembeli: { nama: data.alamat.nama, email: data.alamat.email, telepon: data.alamat.telepon },
    item: item.map((b) => ({ sku: b.sku, nama: b.nama, jumlah: b.jumlah, hargaSatuan: b.hargaSatuan })),
  });

  /* 5. Simpan pesanan. */
  const pesanan: Pesanan = {
    kode,
    dibuatPada: new Date().toISOString(),
    status: "menunggu-pembayaran",
    pembeli: { nama: data.alamat.nama, email: data.alamat.email, telepon: data.alamat.telepon },
    alamat: {
      jalan: data.alamat.jalan,
      kota: data.alamat.kota,
      provinsi: data.alamat.provinsi,
      kodePos: data.alamat.kodePos,
      catatan: data.alamat.catatan ?? "",
    },
    pengiriman: {
      kode: pilihan.kode,
      nama: pilihan.nama,
      ongkos: pilihan.ongkos,
      keterangan: pilihan.keterangan,
    },
    item,
    subtotal,
    total,
    pembayaran: {
      mode: hasilBayar.mode,
      simulasi: hasilBayar.simulasi,
      status: hasilBayar.status,
      pesan: hasilBayar.pesan,
    },
    kendaraan: data.kendaraan ?? null,
    ongkirContoh: kutipan.contoh,
  };

  try {
    await penyimpananPesanan().simpan(pesanan);
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        pesan: e instanceof Error ? e.message : "Pesanan gagal disimpan.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, pesanan });
}
