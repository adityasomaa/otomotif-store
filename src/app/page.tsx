import type { Metadata } from "next";
import { Hero } from "@/components/layout/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { CategoryGraphic } from "@/components/ui/product-graphic";
import { FeaturedProducts } from "@/components/catalog/featured-products";
import { TandaContoh } from "@/components/ui/bits";
import { KATEGORI, PRODUK } from "@/data/catalog";
import { NAMA_TOKO, DATA_CONTOH } from "@/lib/store-config";

export const metadata: Metadata = {
  title: `${NAMA_TOKO} — Sparepart, Aksesoris, Oli, dan Audio Kendaraan`,
  description:
    "Toko online sparepart, aksesoris, oli, audio, dan produk perawatan kendaraan. Pilih merek, model, dan tahun kendaraan untuk melihat komponen yang cocok.",
  alternates: { canonical: "/" },
};

export default function HalamanUtama() {
  return (
    <>
      <Hero />

      {/* ---- Kategori produk ---- */}
      <section aria-labelledby="kategori-judul" className="shell py-20 md:py-24">
        <SectionHeader
          urut="01"
          judul="Kategori produk"
          headline="Lima kelompok barang untuk kebutuhan kendaraan"
          deskripsi="Sparepart pengganti, aksesoris tambahan, oli dan cairan, perangkat audio, serta produk perawatan. Tiap produk mencantumkan daftar kendaraan yang cocok."
          cta={{ label: "Buka katalog lengkap", href: "/katalog" }}
          sebagai="h2"
        />

        {DATA_CONTOH && (
          <div className="mt-8">
            <TandaContoh>Seluruh produk dan harga di halaman ini adalah data contoh</TandaContoh>
          </div>
        )}

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KATEGORI.map((k, i) => {
            const jumlah = PRODUK.filter((p) => p.kategori === k.slug).length;
            return (
              <Reveal key={k.slug} sebagai="li" jeda={i * 60}>
                <TransitionLink
                  href={`/katalog/${k.slug}`}
                  className="group flex h-full flex-col border border-rule bg-panel transition-colors hover:border-ink"
                >
                  <div className="aspect-16/10 overflow-hidden border-b border-rule">
                    <CategoryGraphic slug={k.slug} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[1.15rem] font-medium tracking-tight">{k.nama}</h3>
                      <span className="text-[0.72rem] text-ink-2" data-tabular>
                        {jumlah} produk
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-2">{k.deskripsi}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-medium">
                      Lihat kategori
                      <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        <path d="M0 4.5h12M8.5 1L12 4.5L8.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </div>
                </TransitionLink>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <div className="shell">
        <div className="rule-tick" aria-hidden="true" />
      </div>

      {/* ---- Produk pilihan ---- */}
      <section aria-labelledby="pilihan-judul" className="shell py-20 md:py-24">
        <SectionHeader
          urut="02"
          judul="Produk pilihan"
          headline="Barang yang baru masuk katalog"
          deskripsi="Daftar ini ikut menyesuaikan begitu Anda memilih kendaraan, jadi yang tampil hanya yang cocok dengan merek, model, dan tahun tersebut."
          cta={{ label: "Lihat semua produk", href: "/katalog" }}
          sebagai="h2"
        />
        <FeaturedProducts jumlah={6} />
      </section>
    </>
  );
}
