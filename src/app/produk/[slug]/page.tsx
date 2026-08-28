import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog/product-detail";
import { ProductCard } from "@/components/catalog/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { JsonLd, skemaProduk } from "@/lib/structured-data";
import { namaKategori } from "@/lib/fitment";
import { PRODUK, KATEGORI } from "@/data/catalog";
import { NAMA_TOKO } from "@/lib/store-config";

export function generateStaticParams() {
  return PRODUK.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produk = PRODUK.find((p) => p.slug === slug);
  if (!produk) return {};

  const deskripsi = `${produk.ringkasan} Kode produk ${produk.sku}, merek ${produk.merekProduk}. Periksa daftar kendaraan yang cocok sebelum memesan.`;

  return {
    title: produk.nama,
    description: deskripsi,
    alternates: { canonical: `/produk/${produk.slug}` },
    openGraph: {
      type: "website",
      title: `${produk.nama} — ${NAMA_TOKO}`,
      description: deskripsi,
      url: `/produk/${produk.slug}`,
    },
  };
}

export default async function HalamanProduk({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produk = PRODUK.find((p) => p.slug === slug);
  if (!produk) notFound();

  const kategori = KATEGORI.find((k) => k.slug === produk.kategori);

  /* Produk lain di kategori yang sama, untuk jalan keluar kalau yang ini
     ternyata tidak cocok. */
  const terkait = PRODUK.filter((p) => p.kategori === produk.kategori && p.sku !== produk.sku).slice(0, 3);

  return (
    <div className="shell py-10 md:py-14">
      <JsonLd data={skemaProduk(produk)} />

      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Katalog", href: "/katalog" },
          { nama: namaKategori(produk.kategori), href: `/katalog/${produk.kategori}` },
          { nama: produk.nama, href: `/produk/${produk.slug}` },
        ]}
      />

      <ProductDetail produk={produk} />

      {terkait.length > 0 && (
        <section aria-labelledby="terkait-judul" className="mt-24">
          <SectionHeader
            urut="03"
            judul="Produk terkait"
            headline={`Barang lain di kategori ${kategori?.nama ?? ""}`}
            deskripsi="Kalau barang di atas belum pas, daftar berikut ada di kategori yang sama dan bisa dibandingkan lebih dulu."
            cta={{ label: `Lihat semua ${kategori?.nama ?? "produk"}`, href: `/katalog/${produk.kategori}` }}
            sebagai="h2"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terkait.map((p) => (
              <li key={p.sku}>
                <ProductCard produk={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
