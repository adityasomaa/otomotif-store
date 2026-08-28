"use client";

/* ============================================================================
 * HEADER
 * ----------------------------------------------------------------------------
 * Lima halaman di menu, keranjang sebagai ikon.
 * Di layar kecil menu berubah jadi tombol hamburger yang membuka panel penuh.
 * ========================================================================== */

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useOverlay } from "@/components/providers/overlay-provider";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { NAV_UTAMA } from "@/lib/nav";
import { NAMA_TOKO } from "@/lib/store-config";

export function Header() {
  const pathname = usePathname();
  const { jumlahBarang } = useKeranjang();
  const { terbuka, setTerbuka } = useOverlay();
  const { kendaraan, siap } = useKendaraan();

  const menuTerbuka = terbuka.menu;

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="layer-header sticky top-0 border-b border-rule bg-paper/92 backdrop-blur-md">
      <div className="shell flex h-(--header-h) items-center justify-between gap-4">
        {/* Wordmark */}
        <TransitionLink href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${NAMA_TOKO}, ke halaman utama`}>
          <svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true" className="shrink-0">
            <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="6" />
            <circle cx="32" cy="32" r="7.5" fill="currentColor" />
            <rect x="29" y="1.5" width="6" height="14" fill="var(--color-accent)" />
            <rect x="29" y="48.5" width="6" height="14" fill="var(--color-accent)" />
          </svg>
          <span className="text-[0.98rem] font-medium tracking-tight whitespace-nowrap">{NAMA_TOKO}</span>
        </TransitionLink>

        {/* Menu layar lebar */}
        <nav aria-label="Menu utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_UTAMA.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  className={`relative inline-flex h-9 items-center px-3 text-[0.86rem] transition-colors ${
                    aktif(item.href) ? "text-ink" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {item.label}
                  {aktif(item.href) && (
                    <span aria-hidden="true" className="absolute inset-x-3 bottom-0.5 h-[2px] bg-accent" />
                  )}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Kendaraan terpilih, ringkas, hanya di layar lebar */}
          {siap && kendaraan && (
            <TransitionLink
              href="/cek-kecocokan"
              className="hidden items-center gap-2 border border-control px-2.5 py-1.5 text-[0.74rem] text-ink transition-colors hover:border-ink xl:inline-flex"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
              <span className="max-w-[16ch] truncate">
                {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
              </span>
            </TransitionLink>
          )}

          {/* Keranjang */}
          <button
            type="button"
            onClick={() => setTerbuka("keranjang", true)}
            className="relative inline-flex h-10 items-center gap-2 border border-control px-3 text-[0.82rem] transition-colors hover:border-ink"
            aria-label={`Buka keranjang, ${jumlahBarang} barang`}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
              <path d="M1.5 2h2.2l2 9.2h8.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 4.6h10l-1.3 5.1H6.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="7" cy="14.2" r="1.2" fill="currentColor" />
              <circle cx="12.6" cy="14.2" r="1.2" fill="currentColor" />
            </svg>
            <span data-tabular className="tabular-nums">
              {jumlahBarang}
            </span>
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setTerbuka("menu", !menuTerbuka)}
            aria-expanded={menuTerbuka}
            aria-controls="menu-mobile"
            aria-label={menuTerbuka ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-10 w-10 items-center justify-center border border-control transition-colors hover:border-ink lg:hidden"
          >
            <span className="relative block h-[11px] w-[18px]">
              <span
                aria-hidden="true"
                className="absolute left-0 block h-[1.6px] w-full bg-ink transition-transform duration-300"
                style={{ top: menuTerbuka ? "5px" : "0px", transform: menuTerbuka ? "rotate(45deg)" : "none" }}
              />
              <span
                aria-hidden="true"
                className="absolute left-0 block h-[1.6px] w-full bg-ink transition-opacity duration-200"
                style={{ top: "5px", opacity: menuTerbuka ? 0 : 1 }}
              />
              <span
                aria-hidden="true"
                className="absolute left-0 block h-[1.6px] w-full bg-ink transition-transform duration-300"
                style={{ top: menuTerbuka ? "5px" : "10px", transform: menuTerbuka ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
