import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Isi alamat pengiriman, pilih cara pengiriman, lalu periksa ringkasan pesanan.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function HalamanCheckout() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Keranjang", href: "/keranjang" },
          { nama: "Checkout", href: "/checkout" },
        ]}
      />
      <header className="mt-6">
        <p className="eyebrow text-ink-2">Checkout</p>
        <h1 className="h-display mt-4">Selesaikan pesanan</h1>
        <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
          Empat langkah: alamat pengiriman, cara pengiriman, ringkasan, lalu konfirmasi. Situs ini tidak
          pernah meminta nomor kartu di langkah mana pun.
        </p>
      </header>
      <CheckoutFlow />
    </div>
  );
}
