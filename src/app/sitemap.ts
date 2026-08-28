import type { MetadataRoute } from "next";
import { DOMAIN } from "@/lib/store-config";
import { KATEGORI, PRODUK } from "@/data/catalog";
import { NAV_UTAMA, NAV_LEGAL } from "@/lib/nav";

/* ============================================================================
 * SITEMAP
 * ----------------------------------------------------------------------------
 * Menyertakan seluruh halaman menu, halaman ketentuan, SEMUA halaman kategori,
 * dan SEMUA halaman produk.
 *
 * Keranjang dan checkout sengaja tidak dimasukkan, karena isinya berbeda tiap
 * pengunjung dan tidak ada gunanya diindeks. Keduanya juga sudah ditandai
 * noindex lewat metadata masing masing.
 * ========================================================================== */

export default function sitemap(): MetadataRoute.Sitemap {
  const sekarang = new Date();

  const halamanMenu: MetadataRoute.Sitemap = NAV_UTAMA.map((item) => ({
    url: `${DOMAIN}${item.href === "/" ? "" : item.href}`,
    lastModified: sekarang,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/katalog" ? 0.9 : 0.7,
  }));

  const halamanLegal: MetadataRoute.Sitemap = NAV_LEGAL.map((item) => ({
    url: `${DOMAIN}${item.href}`,
    lastModified: sekarang,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const halamanKategori: MetadataRoute.Sitemap = KATEGORI.map((k) => ({
    url: `${DOMAIN}/katalog/${k.slug}`,
    lastModified: sekarang,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const halamanProduk: MetadataRoute.Sitemap = PRODUK.map((p) => ({
    url: `${DOMAIN}/produk/${p.slug}`,
    lastModified: new Date(p.ditambahkan),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...halamanMenu, ...halamanKategori, ...halamanProduk, ...halamanLegal];
}
