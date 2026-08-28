/* ============================================================================
 * DATA TERSTRUKTUR
 * ----------------------------------------------------------------------------
 * Dipakai supaya mesin pencari bisa membaca produk dan jalur navigasi.
 *
 * Yang sengaja TIDAK dipasang di sini: rating, jumlah ulasan, dan jumlah
 * penjualan. Angka-angka itu belum ada, dan memasang angka karangan pada data
 * terstruktur adalah pelanggaran pedoman mesin pencari sekaligus klaim palsu.
 * ========================================================================== */

import { DOMAIN, NAMA_TOKO } from "@/lib/store-config";
import { namaKategori } from "@/lib/fitment";
import type { Produk } from "@/data/catalog";

export function skemaProduk(produk: Produk) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produk.nama,
    sku: produk.sku,
    mpn: produk.sku,
    description: produk.ringkasan,
    category: namaKategori(produk.kategori),
    brand: { "@type": "Brand", name: produk.merekProduk },
    image: [`${DOMAIN}/graphics/produk/${produk.sku}.svg`],
    offers: {
      "@type": "Offer",
      url: `${DOMAIN}/produk/${produk.slug}`,
      priceCurrency: "IDR",
      price: produk.harga,
      availability:
        produk.stok > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: NAMA_TOKO },
    },
  };
}

export function skemaRemah(jalur: { nama: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: jalur.map((j, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: j.nama,
      item: `${DOMAIN}${j.href}`,
    })),
  };
}

export function skemaToko() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: NAMA_TOKO,
    url: DOMAIN,
    description:
      "Toko online sparepart, aksesoris, oli, audio, dan produk perawatan kendaraan dengan pengecekan kecocokan kendaraan.",
  };
}

/** Menyisipkan JSON-LD ke halaman. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
