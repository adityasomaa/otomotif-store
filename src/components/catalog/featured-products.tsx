"use client";

/* ============================================================================
 * PRODUK PILIHAN DI HALAMAN UTAMA
 * Ikut menyesuaikan dengan kendaraan yang sedang dipilih pembeli.
 * ========================================================================== */

import { useMemo } from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal } from "@/components/ui/reveal";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { saringUntukKendaraan } from "@/lib/fitment";
import { PRODUK } from "@/data/catalog";

export function FeaturedProducts({ jumlah = 6 }: { jumlah?: number }) {
  const { kendaraan, siap } = useKendaraan();

  const daftar = useMemo(() => {
    const tersedia = PRODUK.filter((p) => p.stok > 0);
    const sesuai = saringUntukKendaraan(tersedia, kendaraan);
    const dipakai = sesuai.length >= jumlah ? sesuai : tersedia;
    return [...dipakai]
      .sort((a, b) => b.ditambahkan.localeCompare(a.ditambahkan))
      .slice(0, jumlah);
  }, [kendaraan, jumlah]);

  return (
    <>
      {siap && kendaraan && (
        <p className="mt-6 text-[0.86rem] text-ink-2">
          Menampilkan yang cocok untuk{" "}
          <span className="font-medium text-ink">
            {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
          </span>
          .
        </p>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {daftar.map((p, i) => (
          <Reveal key={p.sku} sebagai="li" jeda={i * 55}>
            <ProductCard produk={p} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
