import type { Metadata } from "next";
import { OrderLookup } from "@/components/checkout/order-lookup";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { NAMA_TOKO } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Cek Status Pesanan",
  description:
    "Masukkan kode pesanan untuk melihat status, rincian barang, dan alamat pengiriman pesanan Anda.",
  alternates: { canonical: "/cek-pesanan" },
  openGraph: {
    title: `Cek Status Pesanan — ${NAMA_TOKO}`,
    description: "Lihat status pesanan Anda dengan memasukkan kode pesanan.",
    url: "/cek-pesanan",
  },
};

export default function HalamanCekPesanan() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Cek Pesanan", href: "/cek-pesanan" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Cek pesanan</p>
        <h1 className="h-display mt-4">Lihat status pesanan</h1>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-ink-2">
          Masukkan kode pesanan yang Anda terima di layar konfirmasi. Halaman ini menampilkan status,
          rincian barang, dan alamat pengiriman pesanan tersebut.
        </p>
      </header>

      <OrderLookup />

      <section aria-labelledby="bantuan-pesanan" className="mt-24">
        <SectionHeader
          urut="01"
          judul="Kalau kode tidak ditemukan"
          headline="Kode pesanan bisa dicek ulang lewat pesan"
          deskripsi="Periksa lagi penulisan kodenya, termasuk tanda hubung. Kalau masih tidak ketemu, kirimkan kode itu lewat WhatsApp supaya bisa dicari manual."
          cta={{ label: "Buka halaman kontak", href: "/kontak" }}
          sebagai="h2"
        />
      </section>
    </div>
  );
}
