import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NAMA_TOKO } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Katalog Sparepart, Aksesoris, Oli, dan Audio Kendaraan",
  description:
    "Katalog produk otomotif lengkap dengan pencarian, filter kategori, merek, rentang harga, dan ketersediaan. Saring berdasarkan merek, model, dan tahun kendaraan Anda.",
  alternates: { canonical: "/katalog" },
  openGraph: {
    title: `Katalog Produk — ${NAMA_TOKO}`,
    description:
      "Katalog produk otomotif dengan pencarian dan filter, disaring berdasarkan kecocokan kendaraan.",
    url: "/katalog",
  },
};

export default async function HalamanKatalog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Katalog", href: "/katalog" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Katalog</p>
        <h1 className="h-display mt-4">Semua produk otomotif</h1>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-ink-2">
          Sparepart, aksesoris, oli, audio, dan produk perawatan kendaraan. Gunakan pencarian dan
          penyaringan di bawah, atau pilih kendaraan Anda supaya yang tampil hanya yang cocok.
        </p>
      </header>

      <CatalogBrowser kataAwal={q ?? ""} />
    </div>
  );
}
