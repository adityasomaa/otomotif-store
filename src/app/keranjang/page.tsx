import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description: "Isi keranjang belanja Anda, lengkap dengan penanda kecocokan kendaraan pada tiap barang.",
  alternates: { canonical: "/keranjang" },
  robots: { index: false, follow: true },
};

export default function HalamanKeranjang() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Keranjang", href: "/keranjang" },
        ]}
      />
      <header className="mt-6">
        <p className="eyebrow text-ink-2">Keranjang</p>
        <h1 className="h-display mt-4">Keranjang belanja</h1>
        <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
          Periksa jumlah dan kecocokan tiap barang sebelum melanjutkan ke pengisian alamat.
        </p>
      </header>
      <CartPage />
    </div>
  );
}
