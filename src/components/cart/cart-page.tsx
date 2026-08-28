"use client";

/* ============================================================================
 * HALAMAN KERANJANG
 * ========================================================================== */

import { TransitionLink } from "@/components/ui/transition-link";
import { ProductGraphic } from "@/components/ui/product-graphic";
import { PengaturJumlah, StockBadge, TandaContoh } from "@/components/ui/bits";
import { PenandaKecocokan } from "@/components/catalog/product-card";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { cekKecocokan } from "@/lib/fitment";
import { rupiah } from "@/lib/format";

export function CartPage() {
  const { isi, jumlahBarang, subtotal, ubahJumlah, hapus, kosongkan, siap } = useKeranjang();
  const { kendaraan } = useKendaraan();

  if (!siap) {
    return <p className="mt-10 text-[0.92rem] text-ink-2">Membaca isi keranjang&hellip;</p>;
  }

  if (isi.length === 0) {
    return (
      <div className="mt-10 border border-rule bg-panel px-5 py-14 text-center">
        <p className="text-[1.05rem] font-medium">Keranjang masih kosong</p>
        <p className="mx-auto mt-2 max-w-[44ch] text-[0.9rem] leading-relaxed text-ink-2">
          Pilih kendaraan Anda dulu di katalog supaya yang tampil hanya barang yang cocok.
        </p>
        <TransitionLink
          href="/katalog"
          className="mt-6 inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
        >
          Lihat katalog
        </TransitionLink>
      </div>
    );
  }

  /* Peringatan kalau ada barang yang tidak cocok dengan kendaraan terpilih. */
  const tidakCocok = kendaraan
    ? isi.filter((b) => cekKecocokan(b.produk, kendaraan) === "tidak-cocok")
    : [];

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-12">
      <div className="min-w-0">
        {tidakCocok.length > 0 && (
          <div role="alert" className="mb-6 border border-accent-ink bg-accent-soft p-4">
            <p className="eyebrow text-accent-ink">Perlu diperiksa</p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink">
              {tidakCocok.length} barang di keranjang tidak ada di daftar kecocokan untuk{" "}
              <span className="font-medium">
                {kendaraan!.merek} {kendaraan!.model} {kendaraan!.tahun}
              </span>
              . Periksa lagi sebelum melanjutkan.
            </p>
          </div>
        )}

        <ul className="border-t border-rule">
          {isi.map((b) => {
            const hasil = cekKecocokan(b.produk, kendaraan);
            return (
              <li key={b.sku} className="flex gap-4 border-b border-rule py-5">
                <TransitionLink
                  href={`/produk/${b.produk.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden border border-rule bg-panel sm:h-28 sm:w-28"
                >
                  <ProductGraphic sku={b.sku} nama={b.produk.nama} />
                </TransitionLink>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <TransitionLink
                        href={`/produk/${b.produk.slug}`}
                        className="text-[0.98rem] leading-snug font-medium hover:text-accent-ink"
                      >
                        {b.produk.nama}
                      </TransitionLink>
                      <p className="mt-1 text-[0.76rem] text-ink-2" data-tabular>
                        {b.sku} &middot; {b.produk.merekProduk}
                      </p>
                    </div>
                    <p className="shrink-0 text-[1rem] font-medium" data-tabular>
                      {rupiah(b.subtotal)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <StockBadge stok={b.produk.stok} kecil />
                    {kendaraan && <PenandaKecocokan hasil={hasil} />}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <PengaturJumlah
                      jumlah={b.jumlah}
                      onUbah={(n) => ubahJumlah(b.sku, n)}
                      maks={Math.min(99, b.produk.stok)}
                      namaBarang={b.produk.nama}
                    />
                    <button
                      type="button"
                      onClick={() => hapus(b.sku)}
                      className="text-[0.8rem] text-ink-2 underline underline-offset-2 hover:text-ink"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <TransitionLink
            href="/katalog"
            className="inline-flex h-11 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
          >
            Lanjut belanja
          </TransitionLink>
          <button
            type="button"
            onClick={kosongkan}
            className="inline-flex h-11 items-center px-2 text-[0.85rem] text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Kosongkan keranjang
          </button>
        </div>
      </div>

      <aside className="min-w-0">
        <div className="border border-ink bg-panel lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <div className="border-b border-rule px-5 py-4">
            <p className="eyebrow text-ink-2">Ringkasan</p>
          </div>
          <dl className="px-5 py-4 text-[0.9rem]">
            <div className="flex justify-between py-1.5">
              <dt className="text-ink-2">Jumlah barang</dt>
              <dd data-tabular>{jumlahBarang}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-ink-2">Subtotal</dt>
              <dd data-tabular>{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-ink-2">Ongkos kirim</dt>
              <dd className="text-ink-2">Dihitung saat checkout</dd>
            </div>
          </dl>
          <div className="border-t border-rule px-5 py-4">
            <TandaContoh>Harga contoh</TandaContoh>
            <TransitionLink
              href="/checkout"
              className="mt-4 inline-flex h-12 w-full items-center justify-center bg-ink px-5 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
            >
              Lanjut ke checkout
            </TransitionLink>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-2">
              Pembayaran belum tersambung. Checkout hanya membuat catatan pesanan, tidak menagih.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
