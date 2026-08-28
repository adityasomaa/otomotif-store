"use client";

/* ============================================================================
 * DRAWER KERANJANG DAN BAR KERANJANG MELAYANG
 * ----------------------------------------------------------------------------
 * Keduanya memakai token lapisan dari globals.css, jadi urutan tumpukannya
 * tidak pernah ditebak-tebak:
 *   bar melayang  ada di atas isi halaman, di bawah panel filter
 *   drawer        ada di atas menu mobile, di bawah cookie banner
 *
 * Scroll halaman dikunci lewat pengatur lapisan bersama saat drawer terbuka,
 * dan dilepas persis di posisi semula saat ditutup.
 * ========================================================================== */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useOverlay } from "@/components/providers/overlay-provider";
import { ProductGraphic } from "@/components/ui/product-graphic";
import { PengaturJumlah, TandaContoh } from "@/components/ui/bits";
import { rupiah } from "@/lib/format";
import { DATA_CONTOH } from "@/lib/store-config";

export function CartDrawer() {
  const { terbuka, setTerbuka } = useOverlay();
  const { isi, jumlahBarang, subtotal, ubahJumlah, hapus } = useKeranjang();
  const panelRef = useRef<HTMLDivElement>(null);
  const tutupRef = useRef<HTMLButtonElement>(null);

  const buka = terbuka.keranjang;

  useEffect(() => {
    if (buka) tutupRef.current?.focus();
  }, [buka]);

  /* Perangkap fokus sederhana supaya Tab tidak keluar dari drawer. */
  useEffect(() => {
    if (!buka) return;
    const saatTekan = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const bisaFokus = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (bisaFokus.length === 0) return;
      const pertama = bisaFokus[0];
      const terakhir = bisaFokus[bisaFokus.length - 1];
      if (e.shiftKey && document.activeElement === pertama) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && document.activeElement === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    };
    window.addEventListener("keydown", saatTekan);
    return () => window.removeEventListener("keydown", saatTekan);
  }, [buka]);

  if (!buka) return null;

  const tutup = () => setTerbuka("keranjang", false);

  return (
    <div className="layer-overlay fixed inset-0">
      <button type="button" aria-label="Tutup keranjang" onClick={tutup} className="absolute inset-0 bg-ink/55" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-ink bg-paper"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-rule px-5 py-4">
          <div>
            <p className="eyebrow text-ink-2">Keranjang</p>
            <p className="mt-1 text-[1.05rem] font-medium" data-tabular>
              {jumlahBarang} barang
            </p>
          </div>
          <button
            ref={tutupRef}
            type="button"
            onClick={tutup}
            className="inline-flex h-10 w-10 items-center justify-center border border-control transition-colors hover:border-ink"
            aria-label="Tutup keranjang"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isi.length === 0 ? (
            <div className="px-5 py-10">
              <p className="text-[0.95rem] text-ink-2">Keranjang masih kosong.</p>
              <TransitionLink
                href="/katalog"
                sebelumPindah={tutup}
                className="mt-5 inline-flex h-11 items-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
              >
                Lihat katalog
              </TransitionLink>
            </div>
          ) : (
            <ul>
              {isi.map((baris) => (
                <li key={baris.sku} className="flex gap-3.5 border-b border-rule px-5 py-4">
                  <div className="h-[68px] w-[68px] shrink-0 overflow-hidden border border-rule bg-panel">
                    <ProductGraphic sku={baris.sku} nama={baris.produk.nama} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <TransitionLink
                      href={`/produk/${baris.produk.slug}`}
                      sebelumPindah={tutup}
                      className="block text-[0.9rem] leading-snug font-medium hover:text-accent-ink"
                    >
                      {baris.produk.nama}
                    </TransitionLink>
                    <p className="mt-0.5 text-[0.72rem] text-ink-2" data-tabular>
                      {baris.sku}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <PengaturJumlah
                        jumlah={baris.jumlah}
                        onUbah={(n) => ubahJumlah(baris.sku, n)}
                        maks={Math.min(99, baris.produk.stok)}
                        namaBarang={baris.produk.nama}
                      />
                      <p className="text-[0.9rem] font-medium" data-tabular>
                        {rupiah(baris.subtotal)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => hapus(baris.sku)}
                      className="mt-2 text-[0.76rem] text-ink-2 underline underline-offset-2 hover:text-ink"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isi.length > 0 && (
          <div className="shrink-0 border-t border-ink bg-panel px-5 py-4">
            {DATA_CONTOH && (
              <div className="mb-3">
                <TandaContoh>Harga contoh</TandaContoh>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[0.85rem] text-ink-2">Subtotal</span>
              <span className="text-[1.15rem] font-medium" data-tabular>
                {rupiah(subtotal)}
              </span>
            </div>
            <p className="mt-1.5 text-[0.76rem] text-ink-2">
              Ongkos kirim dihitung di langkah pengiriman.
            </p>
            <div className="mt-4 grid gap-2.5">
              <TransitionLink
                href="/checkout"
                sebelumPindah={tutup}
                className="inline-flex h-12 items-center justify-center bg-ink px-5 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
              >
                Lanjut ke checkout
              </TransitionLink>
              <TransitionLink
                href="/keranjang"
                sebelumPindah={tutup}
                className="inline-flex h-11 items-center justify-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
              >
                Lihat keranjang
              </TransitionLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * BAR KERANJANG MELAYANG
 * Muncul di layar kecil saja, dan menyingkir sendiri kalau cookie banner
 * sedang tampil supaya tidak ada tombol yang tertutup.
 * ------------------------------------------------------------------------- */
export function CartBar() {
  const { jumlahBarang, subtotal } = useKeranjang();
  const { setTerbuka, adaYangTerbuka } = useOverlay();
  const pathname = usePathname();

  const diAlurBelanja = pathname.startsWith("/keranjang") || pathname.startsWith("/checkout");
  if (jumlahBarang === 0 || diAlurBelanja || adaYangTerbuka) return null;

  return (
    <div className="layer-cartbar cart-bar fixed inset-x-0 bottom-0 border-t border-ink bg-panel px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.74rem] text-ink-2" data-tabular>
            {jumlahBarang} barang
          </p>
          <p className="truncate text-[0.98rem] font-medium" data-tabular>
            {rupiah(subtotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTerbuka("keranjang", true)}
          className="inline-flex h-11 shrink-0 items-center bg-ink px-5 text-[0.85rem] font-medium text-chalk"
        >
          Buka keranjang
        </button>
      </div>
    </div>
  );
}
