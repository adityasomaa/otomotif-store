/* ============================================================================
 * SUSUNAN MENU
 * Dipakai bersama oleh header, menu mobile, footer, dan sitemap.
 * ========================================================================== */

export type ItemNav = { href: string; label: string };

/* Lima halaman di menu utama. Keranjang tidak masuk sini, dia jadi ikon
   di header supaya menu tetap ringkas. */
export const NAV_UTAMA: ItemNav[] = [
  { href: "/", label: "Home" },
  { href: "/katalog", label: "Katalog" },
  { href: "/cek-kecocokan", label: "Cek Kecocokan" },
  { href: "/cek-pesanan", label: "Cek Pesanan" },
  { href: "/kontak", label: "Kontak" },
];

export const NAV_LEGAL: ItemNav[] = [
  { href: "/privacy", label: "Kebijakan Privasi" },
  { href: "/terms", label: "Syarat dan Ketentuan" },
];

/* Halaman yang tidak muncul di menu tapi tetap masuk sitemap. */
export const RUTE_TAMBAHAN: string[] = ["/keranjang", "/checkout"];
