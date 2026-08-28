import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { KATEGORI, PRODUK } from "@/data/catalog";
import { NAMA_TOKO } from "@/lib/store-config";

export function generateStaticParams() {
  return KATEGORI.map((k) => ({ kategori: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const data = KATEGORI.find((k) => k.slug === kategori);
  if (!data) return {};

  const judul = `${data.nama} untuk Kendaraan`;
  return {
    title: judul,
    description: data.deskripsi,
    alternates: { canonical: `/katalog/${data.slug}` },
    openGraph: {
      title: `${judul} — ${NAMA_TOKO}`,
      description: data.deskripsi,
      url: `/katalog/${data.slug}`,
    },
  };
}

export default async function HalamanKategori({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const data = KATEGORI.find((k) => k.slug === kategori);
  if (!data) notFound();

  const jumlah = PRODUK.filter((p) => p.kategori === data.slug).length;

  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Katalog", href: "/katalog" },
          { nama: data.nama, href: `/katalog/${data.slug}` },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Kategori</p>
        <h1 className="h-display mt-4">{data.nama} untuk kendaraan</h1>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-ink-2">{data.deskripsi}</p>
        <p className="mt-3 text-[0.84rem] text-ink-2" data-tabular>
          {jumlah} produk dalam kategori ini
        </p>
      </header>

      <CatalogBrowser kategoriTerkunci={data.slug} />
    </div>
  );
}
