"use client";

/* ============================================================================
 * KARTU PRODUK
 * ----------------------------------------------------------------------------
 * Satu kartu memberi empat hal sekaligus: barangnya apa, harganya berapa,
 * stoknya bagaimana, dan cocok atau tidak dengan kendaraan yang sedang dipilih.
 * ========================================================================== */

import { TransitionLink } from "@/components/ui/transition-link";
import { ProductGraphic } from "@/components/ui/product-graphic";
import { StockBadge } from "@/components/ui/bits";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useOverlay } from "@/components/providers/overlay-provider";
import { cekKecocokan, namaKategori } from "@/lib/fitment";
import { rupiah } from "@/lib/format";
import type { Produk } from "@/data/catalog";

export function ProductCard({ produk, prioritas = false }: { produk: Produk; prioritas?: boolean }) {
  const { kendaraan } = useKendaraan();
  const { tambah } = useKeranjang();
  const { setTerbuka } = useOverlay();

  const hasil = cekKecocokan(produk, kendaraan);
  const habis = produk.stok <= 0;

  return (
    <article className="group flex h-full flex-col border border-rule bg-panel transition-colors hover:border-ink">
      <TransitionLink href={`/produk/${produk.slug}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden border-b border-rule">
          <ProductGraphic sku={produk.sku} nama={produk.nama} prioritas={prioritas} />
          {kendaraan && (
            <div className="absolute top-0 left-0">
              <PenandaKecocokan hasil={hasil} />
            </div>
          )}
        </div>
      </TransitionLink>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-ink-2">{namaKategori(produk.kategori)}</p>
          <p className="text-[0.7rem] text-ink-2" data-tabular>
            {produk.sku}
          </p>
        </div>

        <h3 className="mt-2.5 text-[1rem] leading-snug font-medium">
          <TransitionLink href={`/produk/${produk.slug}`} className="hover:text-accent-ink">
            {produk.nama}
          </TransitionLink>
        </h3>

        <p className="mt-1 text-[0.8rem] text-ink-2">{produk.merekProduk}</p>

        <div className="mt-3">
          <StockBadge stok={produk.stok} kecil />
        </div>

        <div className="mt-auto pt-4">
          <p className="text-[1.1rem] font-medium" data-tabular>
            {rupiah(produk.harga)}
          </p>
          <button
            type="button"
            disabled={habis}
            onClick={() => {
              tambah(produk.sku, 1);
              setTerbuka("keranjang", true);
            }}
            className="mt-3 inline-flex h-10 w-full items-center justify-center border border-ink px-4 text-[0.82rem] font-medium transition-colors hover:bg-ink hover:text-chalk disabled:cursor-not-allowed disabled:border-control disabled:text-ink-2 disabled:hover:bg-transparent disabled:hover:text-ink-2"
          >
            {habis ? "Stok habis" : "Tambah ke keranjang"}
          </button>
        </div>
      </div>
    </article>
  );
}

/** Penanda kecocokan. Selalu ada teksnya, tidak hanya dibedakan lewat warna. */
export function PenandaKecocokan({
  hasil,
  besar = false,
}: {
  hasil: "cocok" | "tidak-cocok" | "universal" | "belum-dipilih";
  besar?: boolean;
}) {
  if (hasil === "belum-dipilih") return null;

  const isi =
    hasil === "cocok"
      ? { label: "Cocok", gaya: "bg-ok text-white" }
      : hasil === "universal"
        ? { label: "Cocok untuk semua kendaraan", gaya: "bg-ink text-chalk" }
        : { label: "Tidak cocok", gaya: "bg-off-bg text-off border border-off" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${isi.gaya} ${
        besar ? "px-3 py-1.5 text-[0.8rem]" : "px-2.5 py-1 text-[0.7rem]"
      }`}
    >
      {hasil === "tidak-cocok" ? (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg width="11" height="9" viewBox="0 0 11 9" aria-hidden="true">
          <path d="M1 4.6L4 7.6L10 1.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )}
      {isi.label}
    </span>
  );
}
